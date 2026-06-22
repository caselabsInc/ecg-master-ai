import {
  getApp as getNativeFirebaseApp,
  getApps as getNativeFirebaseApps,
  initializeApp as initializeNativeFirebaseApp,
} from '@react-native-firebase/app';
import {
  default as firebaseAppCheck,
  getLimitedUseToken,
  initializeAppCheck,
  type AppCheck,
} from '@react-native-firebase/app-check';
import { firebaseConfig } from '@/services/firebase';

type AppleAppCheckProvider = 'debug' | 'deviceCheck' | 'appAttest' | 'appAttestWithDeviceCheckFallback';
type AndroidAppCheckProvider = 'debug' | 'playIntegrity';

let appCheckPromise: Promise<AppCheck> | null = null;

function getAppleProvider(): AppleAppCheckProvider {
  const provider = process.env.EXPO_PUBLIC_FIREBASE_APP_CHECK_APPLE_PROVIDER;

  if (
    provider === 'debug' ||
    provider === 'deviceCheck' ||
    provider === 'appAttest' ||
    provider === 'appAttestWithDeviceCheckFallback'
  ) {
    return provider;
  }

  return 'appAttest';
}

function getAndroidProvider(): AndroidAppCheckProvider {
  const provider = process.env.EXPO_PUBLIC_FIREBASE_APP_CHECK_ANDROID_PROVIDER;

  if (provider === 'debug' || provider === 'playIntegrity') {
    return provider;
  }

  return 'playIntegrity';
}

async function getNativeApp() {
  if (getNativeFirebaseApps().length > 0) {
    return getNativeFirebaseApp();
  }

  return initializeNativeFirebaseApp(firebaseConfig);
}

function getAppCheckInstance() {
  if (!appCheckPromise) {
    const debugToken = process.env.EXPO_PUBLIC_FIREBASE_APP_CHECK_DEBUG_TOKEN || undefined;
    const appleProvider = getAppleProvider();
    const androidProvider = getAndroidProvider();
    const appleDebugToken = appleProvider === 'debug' ? debugToken : undefined;
    const androidDebugToken = androidProvider === 'debug' ? debugToken : undefined;

    appCheckPromise = getNativeApp().then((nativeApp) => {
      const appCheck = firebaseAppCheck(nativeApp);
      const provider = appCheck.newReactNativeFirebaseAppCheckProvider();

      provider.configure({
          android: {
            provider: androidProvider,
            debugToken: androidDebugToken,
          },
          apple: {
            provider: appleProvider,
            debugToken: appleDebugToken,
          },
      });

      return initializeAppCheck(nativeApp, {
        provider,
        isTokenAutoRefreshEnabled: true,
      });
    });
  }

  return appCheckPromise;
}

export async function getLimitedUseAppCheckToken(): Promise<string> {
  const appCheck = await getAppCheckInstance();
  const tokenResult = await getLimitedUseToken(appCheck);

  if (!tokenResult.token) {
    throw new Error('App integrity check could not be completed.');
  }

  return tokenResult.token;
}
