# ECG-Master TestFlight Readiness Checklist

Last updated: 21 Jun 2026

## Build Identity

- App Store Connect app name: ECG-Master.
- iOS bundle identifier: `com.caselabs.ecgmaster`.
- Expo slug and URL scheme remain `ecgmaster` for compatibility.
- Confirm `GoogleService-Info.plist` is available to EAS before running a remote build.

## Required Local Checks

Run before each TestFlight build:

```bash
npm run verify:testflight
npx expo export --platform ios --output-dir /tmp/ecgmaster-export-ios
```

Expected state:

- TypeScript passes.
- Firebase Functions compile.
- Expo iOS export succeeds.
- Lint has no errors. Existing warnings should be reviewed before wider testing.

## Firebase

- Deploy Firestore rules and indexes to the intended test project.
- Deploy `generateECGInterpretation`.
- Confirm the `GEMINI_API_KEY` secret is set for the deployed function.
- Create one internal test account and verify sign-up, sign-in, report save, AI success, AI failure handling, and sign-out.

## App Store Connect

- Confirm the App Store Connect record uses `com.caselabs.ecgmaster`.
- Confirm privacy nutrition labels match the app privacy policy and `ios/ecgmaster/PrivacyInfo.xcprivacy`.
- Add beta release notes that state internal clinician-only educational decision support.
- Configure `EXPO_PUBLIC_SUPPORT_EMAIL`, or confirm testers should use the in-app support ticket form and TestFlight invitation sender/organization channel for fallback support.
- Confirm Profile support, support ticket creation, and account deletion work in the deployed test environment before inviting testers.
- Confirm export compliance is satisfied by `ios.config.usesNonExemptEncryption: false` in `app.json`.

## TestFlight Command

```bash
npx eas-cli@latest build -p ios --profile testflight --auto-submit
```

Use the `testflight` profile in `eas.json`, which enables store distribution and auto-incremented iOS build numbers.
