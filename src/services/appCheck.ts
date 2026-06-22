export async function getLimitedUseAppCheckToken(): Promise<string> {
  throw new Error('App integrity check is only available in the native app.');
}
