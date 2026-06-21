import { Platform } from 'react-native';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

let isConfigured = false;

type GoogleSignInConfig = {
  scopes: string[];
  webClientId?: string;
  iosClientId?: string;
  googleServicePlistPath?: string;
};

function isRealGoogleClientId(value: string | undefined) {
  return !!value && value.endsWith('.apps.googleusercontent.com') && !value.startsWith('YOUR_');
}

export function configureGoogleSignIn() {
  if (isConfigured) return;

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
  const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;
  const config: GoogleSignInConfig = {
    scopes: ['email', 'profile'],
  };

  if (isRealGoogleClientId(webClientId)) {
    config.webClientId = webClientId;
  }

  if (Platform.OS === 'ios') {
    if (isRealGoogleClientId(iosClientId)) {
      config.iosClientId = iosClientId;
    } else {
      config.googleServicePlistPath = 'GoogleService-Info';
    }
  }

  GoogleSignin.configure(config);
  isConfigured = true;
}
