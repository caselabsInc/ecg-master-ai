import { onCall, HttpsError, type CallableRequest } from 'firebase-functions/v2/https';
import { defineSecret } from 'firebase-functions/params';
import * as admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';

admin.initializeApp();

const geminiApiKey = defineSecret('GEMINI_API_KEY');
const AI_DAILY_LIMIT_PER_USER = 30;
const AI_COOLDOWN_MS = 30_000;
const MAX_REPORT_DATA_BYTES = 64 * 1024;
const MAX_PROMPT_BYTES = 96 * 1024;
const AI_INTERPRETATION_MODEL = 'gemini-2.5-flash';

type GeminiUsage = {
  promptTokenCount: number | null;
  candidatesTokenCount: number | null;
  thoughtsTokenCount: number | null;
  totalTokenCount: number | null;
  cachedContentTokenCount: number | null;
};

function getUtcDayKey(date = new Date()): string {
  return date.toISOString().slice(0, 10);
}

function getJsonByteLength(value: unknown): number {
  try {
    return Buffer.byteLength(JSON.stringify(value), 'utf8');
  } catch {
    throw new HttpsError(
      'invalid-argument',
      'Report data must be valid JSON.'
    );
  }
}

function getTimestampMillis(value: unknown): number | null {
  if (value instanceof admin.firestore.Timestamp) {
    return value.toMillis();
  }

  return null;
}

function readNumber(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function normalizeGeminiUsageMetadata(value: unknown): GeminiUsage {
  const metadata = value && typeof value === 'object' ? value as Record<string, unknown> : {};

  return {
    promptTokenCount: readNumber(metadata.promptTokenCount),
    candidatesTokenCount: readNumber(metadata.candidatesTokenCount),
    thoughtsTokenCount: readNumber(metadata.thoughtsTokenCount),
    totalTokenCount: readNumber(metadata.totalTokenCount),
    cachedContentTokenCount: readNumber(metadata.cachedContentTokenCount),
  };
}

function pickReportDataForAi(reportData: any) {
  return {
    context: reportData.context ?? {},
    additionalNotes: reportData.additionalNotes ?? '',
    heartRate: reportData.heartRate ?? {},
    rhythm: reportData.rhythm ?? {},
    pWave: reportData.pWave ?? {},
    prInterval: reportData.prInterval ?? {},
    qrsComplex: reportData.qrsComplex ?? {},
    axis: reportData.axis ?? {},
    stSegment: reportData.stSegment ?? {},
    tWaves: reportData.tWaves ?? {},
    qtInterval: reportData.qtInterval ?? {},
  };
}

function buildAiSynthesisPayload(reportData: any) {
  const decisionSupport = reportData.decisionSupport ?? {};
  const auditTrail = decisionSupport.auditTrail ?? {};
  const ruleFindings = Array.isArray(decisionSupport.ruleFindings)
    ? decisionSupport.ruleFindings.map((finding: any) => ({
        id: finding.id,
        label: finding.label,
        source: finding.source,
        finding: finding.finding,
        basis: finding.basis,
        inputs: Array.isArray(finding.inputs) ? finding.inputs : [],
      }))
    : [];

  return {
    patientContext: reportData.context ?? {},
    ruleDerivedReviewBasis: {
      intendedUse: decisionSupport.intendedUse,
      clinicianOnly: decisionSupport.clinicianOnly,
      regulatoryPosition: decisionSupport.regulatoryPosition,
      ruleFindings,
      missingOrUncertainInputs: auditTrail.missingOrUncertainInputs ?? [],
    },
    structuredMeasurements: pickReportDataForAi(reportData),
  };
}

async function recordAiUsage(params: {
  uid: string;
  reportId?: string | null;
  model: string;
  usage: GeminiUsage;
  promptBytes: number;
  reportDataBytes: number;
  latencyMs: number;
  status: 'success' | 'failed';
}) {
  const db = admin.firestore();
  const now = admin.firestore.FieldValue.serverTimestamp();
  const dayKey = getUtcDayKey();
  const usageRef = db.collection('aiUsage').doc(`${params.uid}_${dayKey}`);
  const eventRef = db.collection('aiUsageEvents').doc();
  const incrementIfKnown = (value: number | null) => value ?? 0;

  const usageEvent = {
    uid: params.uid,
    reportId: params.reportId || null,
    dayKey,
    model: params.model,
    status: params.status,
    promptBytes: params.promptBytes,
    reportDataBytes: params.reportDataBytes,
    latencyMs: params.latencyMs,
    usage: params.usage,
    createdAt: now,
  };

  await db.runTransaction(async (transaction) => {
    transaction.set(eventRef, usageEvent);
    transaction.set(
      usageRef,
      {
        uid: params.uid,
        dayKey,
        promptTokenCount: admin.firestore.FieldValue.increment(incrementIfKnown(params.usage.promptTokenCount)),
        candidatesTokenCount: admin.firestore.FieldValue.increment(incrementIfKnown(params.usage.candidatesTokenCount)),
        thoughtsTokenCount: admin.firestore.FieldValue.increment(incrementIfKnown(params.usage.thoughtsTokenCount)),
        totalTokenCount: admin.firestore.FieldValue.increment(incrementIfKnown(params.usage.totalTokenCount)),
        cachedContentTokenCount: admin.firestore.FieldValue.increment(incrementIfKnown(params.usage.cachedContentTokenCount)),
        totalPromptBytes: admin.firestore.FieldValue.increment(params.promptBytes),
        totalReportDataBytes: admin.firestore.FieldValue.increment(params.reportDataBytes),
        lastUsageRecordedAt: now,
        updatedAt: now,
      },
      { merge: true }
    );
  });
}

async function enforceAiUsageControls(uid: string) {
  const db = admin.firestore();
  const now = Date.now();
  const dayKey = getUtcDayKey(new Date(now));
  const usageRef = db.collection('aiUsage').doc(`${uid}_${dayKey}`);

  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(usageRef);
    const usage = snapshot.exists ? snapshot.data() : undefined;
    const currentCount = typeof usage?.count === 'number' ? usage.count : 0;
    const lastRequestMillis = getTimestampMillis(usage?.lastRequestAt);

    if (currentCount >= AI_DAILY_LIMIT_PER_USER) {
      throw new HttpsError(
        'resource-exhausted',
        `Daily AI generation limit reached. Try again tomorrow.`
      );
    }

    if (lastRequestMillis && now - lastRequestMillis < AI_COOLDOWN_MS) {
      const retryAfterSeconds = Math.ceil((AI_COOLDOWN_MS - (now - lastRequestMillis)) / 1000);

      throw new HttpsError(
        'resource-exhausted',
        `Please wait ${retryAfterSeconds} seconds before generating another interpretation.`
      );
    }

    transaction.set(
      usageRef,
      {
        uid,
        dayKey,
        count: currentCount + 1,
        dailyLimit: AI_DAILY_LIMIT_PER_USER,
        lastRequestAt: admin.firestore.Timestamp.fromMillis(now),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        createdAt: usage?.createdAt || admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
}

async function getAuthenticatedUid(request: CallableRequest) {
  if (request.auth?.uid) {
    return request.auth.uid;
  }

  const authorization = request.rawRequest.get('authorization') || '';
  const match = authorization.match(/^Bearer (.+)$/i);
  const idToken = match?.[1];

  if (!idToken) {
    throw new HttpsError(
      'unauthenticated',
      'You must be logged in to generate an interpretation.'
    );
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken, true);
    return decodedToken.uid;
  } catch (error) {
    console.warn('generateECGInterpretation: invalid Firebase ID token', {
      error: error instanceof Error ? error.message : String(error),
    });
    throw new HttpsError(
      'unauthenticated',
      'Your session could not be verified. Please sign in again.'
    );
  }
}

export const generateECGInterpretation = onCall(
  {
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    minInstances: 1,
    secrets: [geminiApiKey],
  },
  async (request) => {
    const startedAt = Date.now();

    const uid = await getAuthenticatedUid(request);

    const reportData = request.data.reportData;
    const reportId = typeof request.data.reportId === 'string' ? request.data.reportId : null;
    if (!reportData) {
      throw new HttpsError(
        'invalid-argument',
        'No report data provided.'
      );
    }

    const reportDataBytes = getJsonByteLength(reportData);
    if (reportDataBytes > MAX_REPORT_DATA_BYTES) {
      throw new HttpsError(
        'invalid-argument',
        'Report data is too large to process.'
      );
    }

    const aiSynthesisPayload = buildAiSynthesisPayload(reportData);

    const prompt = `
You are an ECG educational decision-support assistant for clinicians.
Use only the structured observations and measurements entered by the clinician. Do not claim to acquire, process, scan, or analyze an ECG waveform or medical image.
Do not present yourself as making an autonomous diagnosis. Separate clinician-entered/rule-derived findings from AI-generated synthesis.
When evidence is insufficient, say so explicitly. Treat high-risk patterns conservatively and recommend clinician review rather than issuing directives.
Use the rule-derived review basis as the primary source of truth. The structured measurements are backup context only. Do not contradict rule-derived findings; if a rule finding and measurement appear inconsistent, flag uncertainty instead of resolving it yourself.

Provide:
1. A clinician-reviewable draft ECG interpretation with confidence/uncertainty.
2. Dangerous findings possible or not assessable from the supplied data; avoid saying dangerous findings are ruled out unless the entered data directly supports that.
3. A step-by-step explanation of clinician-entered inputs and rule-derived findings.
4. Differential diagnoses with evidence for and against each.
5. Missing data warnings that limit decision support.
6. Options for the clinician to consider, separated into:
   - Investigations
   - Management considerations (in short)
7. A teaching explanation for the key ECG reasoning.
8. A clear disclaimer stating this is clinician-only educational decision support, requires independent review, and does not replace clinician judgment, ECG machine interpretation, cardiology review, diagnosis, or treatment.

Patient Context:
Age: ${reportData.context?.age || 'Unknown'}
Gender: ${reportData.context?.gender || 'Unknown'}
Indication: ${reportData.context?.indication || 'None'}

Measurements:
${JSON.stringify(aiSynthesisPayload)}

Respond ONLY with a valid JSON object matching this schema exactly:
{
  "primaryInterpretation": "string",
  "dangerousFindings": "string",
  "missingDataWarnings": "string",
  "urgencyLevel": "emergency | urgent | routine | normal_variant | insufficient_data",
  "teachingExplanation": "string",
  "stepByStepInterpretation": "string",
  "differentialsAndExplanation": "string",
  "nextSteps": {
    "investigations": "string",
    "management": "string"
  },
  "disclaimer": "string"
}
`;

    const promptBytes = Buffer.byteLength(prompt, 'utf8');
    if (promptBytes > MAX_PROMPT_BYTES) {
      throw new HttpsError(
        'invalid-argument',
        'Generated AI prompt is too large to process.'
      );
    }

    await enforceAiUsageControls(uid);

    // Initialize the Gemini SDK inside the function execution to securely access the secret value
    const ai = new GoogleGenAI({ apiKey: geminiApiKey.value() });
    let usage = normalizeGeminiUsageMetadata(null);

    try {
      console.info('generateECGInterpretation: starting Gemini request', {
        inputBytes: promptBytes,
        reportDataBytes,
        model: AI_INTERPRETATION_MODEL,
        uid,
      });
      const geminiStartedAt = Date.now();
      const response = await ai.models.generateContent({
        model: AI_INTERPRETATION_MODEL,
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        }
      });
      const geminiLatencyMs = Date.now() - geminiStartedAt;
      usage = normalizeGeminiUsageMetadata((response as any).usageMetadata);
      console.info('generateECGInterpretation: Gemini request completed', {
        latencyMs: geminiLatencyMs,
        usage,
      });

      const responseText = response.text;
      if (!responseText) {
        throw new Error('Empty response from Gemini');
      }

      const interpretation = JSON.parse(responseText);
      const requiredFields = [
        'primaryInterpretation',
        'dangerousFindings',
        'missingDataWarnings',
        'urgencyLevel',
        'teachingExplanation',
        'stepByStepInterpretation',
        'differentialsAndExplanation',
        'nextSteps',
        'disclaimer',
      ];

      for (const field of requiredFields) {
        if (!(field in interpretation)) {
          throw new Error(`Missing interpretation field: ${field}`);
        }
      }

      console.info('generateECGInterpretation: completed', {
        totalLatencyMs: Date.now() - startedAt,
      });

      await recordAiUsage({
        uid,
        reportId,
        model: AI_INTERPRETATION_MODEL,
        usage,
        promptBytes,
        reportDataBytes,
        latencyMs: geminiLatencyMs,
        status: 'success',
      });

      return { interpretation, usage };

    } catch (error) {
      console.error('Error generating interpretation:', error);
      await recordAiUsage({
        uid,
        reportId,
        model: AI_INTERPRETATION_MODEL,
        usage,
        promptBytes,
        reportDataBytes,
        latencyMs: Date.now() - startedAt,
        status: 'failed',
      }).catch((usageError) => {
        console.warn('generateECGInterpretation: failed to record AI usage failure', {
          error: usageError instanceof Error ? usageError.message : String(usageError),
        });
      });
      throw new HttpsError(
        'internal',
        'Failed to generate interpretation'
      );
    }
  }
);

export const deleteAccount = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'You must be logged in to delete your account.'
    );
  }

  const uid = request.auth.uid;
  const userRef = admin.firestore().doc(`users/${uid}`);

  try {
    await admin.firestore().recursiveDelete(userRef);
    await admin.auth().deleteUser(uid);
    return { success: true };
  } catch (error: any) {
    if (error?.code === 'auth/user-not-found') {
      return { success: true };
    }

    console.error('Error deleting account:', error);
    throw new HttpsError(
      'internal',
      'Failed to delete account'
    );
  }
});

export const createSupportTicket = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError(
      'unauthenticated',
      'You must be logged in to contact support.'
    );
  }

  const { category, subject, message, appVersion, deviceInfo } = request.data || {};

  if (typeof category !== 'string' || !category.trim()) {
    throw new HttpsError('invalid-argument', 'Choose a support category.');
  }

  if (typeof subject !== 'string' || subject.trim().length < 4) {
    throw new HttpsError('invalid-argument', 'Enter a short support subject.');
  }

  if (typeof message !== 'string' || message.trim().length < 10) {
    throw new HttpsError('invalid-argument', 'Enter a support message.');
  }

  if (subject.length > 140 || message.length > 4000) {
    throw new HttpsError('invalid-argument', 'Support request is too long.');
  }

  const uid = request.auth.uid;
  const userRecord = await admin.auth().getUser(uid).catch(() => null);
  const ticketRef = admin.firestore().collection('supportTickets').doc();

  await ticketRef.set({
    uid,
    email: userRecord?.email || null,
    displayName: userRecord?.displayName || null,
    category: category.trim(),
    subject: subject.trim(),
    message: message.trim(),
    appVersion: typeof appVersion === 'string' ? appVersion : null,
    deviceInfo: typeof deviceInfo === 'string' ? deviceInfo : null,
    status: 'open',
    source: 'in_app',
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  return {
    ticketId: ticketRef.id,
  };
});
