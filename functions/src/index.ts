import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { GoogleGenAI } from '@google/genai';

admin.initializeApp();

// Initialize the Gemini SDK
// Requires GEMINI_API_KEY environment variable to be set in Firebase Functions config or .env
const ai = new GoogleGenAI({});

export const generateECGInterpretation = functions.https.onCall(async (data, context) => {
  // Ensure the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated',
      'You must be logged in to generate an interpretation.'
    );
  }

  const { reportData } = data;
  if (!reportData) {
    throw new functions.https.HttpsError(
      'invalid-argument',
      'No report data provided.'
    );
  }

  const prompt = `
You are an expert ECG interpretation tutor helping a clinician learn to read ECGs. 
Based on the following structured measurements entered by the user, provide:
1. A plain-language summary of the rhythm and findings.
2. Possible clinical interpretations using cautious educational language (e.g. "findings are consistent with...").
3. A brief explanation of why each notable finding is significant.
4. A disclaimer reminder that this is for educational purposes only and not a diagnosis.

Patient Context:
Age: ${reportData.context?.age || 'Unknown'}
Gender: ${reportData.context?.gender || 'Unknown'}
Indication: ${reportData.context?.indication || 'None'}

Measurements:
${JSON.stringify(reportData, null, 2)}

Respond ONLY with a valid JSON object matching this schema:
{
  "summary": "string",
  "possibleFindings": "string",
  "educationalNotes": "string",
  "disclaimer": "string"
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error('Empty response from Gemini');
    }

    const interpretation = JSON.parse(responseText);

    return { interpretation };

  } catch (error) {
    console.error('Error generating interpretation:', error);
    throw new functions.https.HttpsError(
      'internal',
      'Failed to generate interpretation'
    );
  }
});
