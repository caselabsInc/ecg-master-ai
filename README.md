# ECG-Master

Clinician-only educational decision-support app for structured 12-lead ECG review.

ECG-Master is intended for internal testing with trained health care professionals, supervised clinical learners, or trusted product reviewers. It is not intended for emergency care, patient-facing use, autonomous ECG diagnosis, or public release validation.

## Local Setup

```bash
npm install
cp .env.example .env
npm run start
```

Populate `.env` with the Firebase and Google sign-in values for the intended test project.

## TestFlight Preflight

Run this before each TestFlight build:

```bash
npm run verify:testflight
npx expo export --platform ios --output-dir /tmp/ecgmaster-export-ios
```

The verification script runs TypeScript, Expo lint, Firebase Functions build, and Expo dependency validation.

## TestFlight Build

Before building, confirm:

- `GoogleService-Info.plist` is available to EAS.
- Firebase Functions and Firestore rules are deployed to the intended test project.
- The `GEMINI_API_KEY` Firebase Functions secret is set.
- App Store Connect has the `ECG-Master` app record with bundle ID `com.caselabs.ecgmaster`.
- Privacy labels and beta release notes match `docs/testflight-readiness-checklist.md`.

Build and submit:

```bash
npx eas-cli@latest build -p ios --profile testflight --auto-submit
```

## Useful Docs

- `docs/testflight-readiness-checklist.md`
- `docs/internal-testflight-plan.md`
- `docs/regulatory-position.md`
- `docs/validation/ecg-validation-protocol.md`
