"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSupportTicket = exports.deleteAccount = exports.generateECGInterpretation = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const admin = __importStar(require("firebase-admin"));
const genai_1 = require("@google/genai");
admin.initializeApp();
const geminiApiKey = (0, params_1.defineSecret)('GEMINI_API_KEY');
const AI_DAILY_LIMIT_PER_USER = 30;
const AI_COOLDOWN_MS = 30_000;
const MAX_REPORT_DATA_BYTES = 64 * 1024;
const MAX_PROMPT_BYTES = 96 * 1024;
function getUtcDayKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}
function getJsonByteLength(value) {
    try {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
    }
    catch {
        throw new https_1.HttpsError('invalid-argument', 'Report data must be valid JSON.');
    }
}
function getTimestampMillis(value) {
    if (value instanceof admin.firestore.Timestamp) {
        return value.toMillis();
    }
    return null;
}
async function enforceAiUsageControls(uid) {
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
            throw new https_1.HttpsError('resource-exhausted', `Daily AI generation limit reached. Try again tomorrow.`);
        }
        if (lastRequestMillis && now - lastRequestMillis < AI_COOLDOWN_MS) {
            const retryAfterSeconds = Math.ceil((AI_COOLDOWN_MS - (now - lastRequestMillis)) / 1000);
            throw new https_1.HttpsError('resource-exhausted', `Please wait ${retryAfterSeconds} seconds before generating another interpretation.`);
        }
        transaction.set(usageRef, {
            uid,
            dayKey,
            count: currentCount + 1,
            dailyLimit: AI_DAILY_LIMIT_PER_USER,
            lastRequestAt: admin.firestore.Timestamp.fromMillis(now),
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            createdAt: usage?.createdAt || admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
    });
}
exports.generateECGInterpretation = (0, https_1.onCall)({
    enforceAppCheck: true,
    consumeAppCheckToken: true,
    minInstances: 1,
    secrets: [geminiApiKey],
}, async (request) => {
    const startedAt = Date.now();
    // Ensure the user is authenticated
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be logged in to generate an interpretation.');
    }
    const reportData = request.data.reportData;
    if (!reportData) {
        throw new https_1.HttpsError('invalid-argument', 'No report data provided.');
    }
    const reportDataBytes = getJsonByteLength(reportData);
    if (reportDataBytes > MAX_REPORT_DATA_BYTES) {
        throw new https_1.HttpsError('invalid-argument', 'Report data is too large to process.');
    }
    const prompt = `
You are an ECG educational decision-support assistant for clinicians.
Use only the structured observations and measurements entered by the clinician. Do not claim to acquire, process, scan, or analyze an ECG waveform or medical image.
Do not present yourself as making an autonomous diagnosis. Separate clinician-entered/rule-derived findings from AI-generated synthesis.
When evidence is insufficient, say so explicitly. Treat high-risk patterns conservatively and recommend clinician review rather than issuing directives.

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
${JSON.stringify(reportData, null, 2)}

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
        throw new https_1.HttpsError('invalid-argument', 'Generated AI prompt is too large to process.');
    }
    await enforceAiUsageControls(request.auth.uid);
    // Initialize the Gemini SDK inside the function execution to securely access the secret value
    const ai = new genai_1.GoogleGenAI({ apiKey: geminiApiKey.value() });
    try {
        console.info('generateECGInterpretation: starting Gemini request', {
            inputBytes: promptBytes,
            reportDataBytes,
            uid: request.auth.uid,
        });
        const geminiStartedAt = Date.now();
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
            }
        });
        console.info('generateECGInterpretation: Gemini request completed', {
            latencyMs: Date.now() - geminiStartedAt,
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
        return { interpretation };
    }
    catch (error) {
        console.error('Error generating interpretation:', error);
        throw new https_1.HttpsError('internal', 'Failed to generate interpretation');
    }
});
exports.deleteAccount = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be logged in to delete your account.');
    }
    const uid = request.auth.uid;
    const userRef = admin.firestore().doc(`users/${uid}`);
    try {
        await admin.firestore().recursiveDelete(userRef);
        await admin.auth().deleteUser(uid);
        return { success: true };
    }
    catch (error) {
        if (error?.code === 'auth/user-not-found') {
            return { success: true };
        }
        console.error('Error deleting account:', error);
        throw new https_1.HttpsError('internal', 'Failed to delete account');
    }
});
exports.createSupportTicket = (0, https_1.onCall)(async (request) => {
    if (!request.auth) {
        throw new https_1.HttpsError('unauthenticated', 'You must be logged in to contact support.');
    }
    const { category, subject, message, appVersion, deviceInfo } = request.data || {};
    if (typeof category !== 'string' || !category.trim()) {
        throw new https_1.HttpsError('invalid-argument', 'Choose a support category.');
    }
    if (typeof subject !== 'string' || subject.trim().length < 4) {
        throw new https_1.HttpsError('invalid-argument', 'Enter a short support subject.');
    }
    if (typeof message !== 'string' || message.trim().length < 10) {
        throw new https_1.HttpsError('invalid-argument', 'Enter a support message.');
    }
    if (subject.length > 140 || message.length > 4000) {
        throw new https_1.HttpsError('invalid-argument', 'Support request is too long.');
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
//# sourceMappingURL=index.js.map