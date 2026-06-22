import { app, auth } from '@/services/firebase';
import { getLimitedUseAppCheckToken } from '@/services/appCheck';

type CallableError = Error & {
  code?: string;
  details?: unknown;
  status?: number;
};

function createCallableError(message: string, code?: string, status?: number, details?: unknown): CallableError {
  const error = new Error(message) as CallableError;
  error.code = code;
  error.status = status;
  error.details = details;
  return error;
}

export async function callAppCheckedFunction<TResponse = unknown>(
  functionName: string,
  data: unknown,
  options: { region?: string } = {}
): Promise<TResponse> {
  const user = auth.currentUser;
  if (!user) {
    throw createCallableError('Please sign in again before generating interpretation support.', 'unauthenticated');
  }

  const projectId = app.options.projectId;
  if (!projectId) {
    throw createCallableError('Firebase project ID is not configured.', 'failed-precondition');
  }

  const [idToken, appCheckToken] = await Promise.all([
    user.getIdToken(),
    getLimitedUseAppCheckToken(),
  ]);

  const region = options.region ?? 'us-central1';
  const response = await fetch(`https://${region}-${projectId}.cloudfunctions.net/${functionName}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${idToken}`,
      'Content-Type': 'application/json',
      'X-Firebase-AppCheck': appCheckToken,
    },
    body: JSON.stringify({ data }),
  });

  const payload = await response.json().catch(() => null);
  const firebaseError = payload?.error;

  if (!response.ok || firebaseError) {
    throw createCallableError(
      firebaseError?.message || `Firebase function ${functionName} failed.`,
      firebaseError?.status || `http/${response.status}`,
      response.status,
      firebaseError?.details
    );
  }

  return (payload?.result ?? payload?.data) as TResponse;
}
