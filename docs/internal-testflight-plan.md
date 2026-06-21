# ECG-Master Internal TestFlight Plan

Last updated: 14 Jun 2026

## Internal Testing Scope

Internal TestFlight testing is for build stability, account flows, report persistence, AI failure handling, UI responsiveness, and early clinician feedback. It is not a clinical performance claim or public release validation.

## Tester Eligibility

- Invite only clinicians, supervised clinical learners, or trusted product reviewers who understand the educational decision-support scope.
- Do not use the app for emergency care, live clinical decisions, or autonomous ECG diagnosis.
- Avoid entering directly identifying patient information unless a proper privacy/legal approval is in place.

## Pre-Invite Smoke Test

- Sign up and sign in.
- Complete onboarding and confirm clinician-only language is visible.
- Create a report through all ECG steps.
- Generate a report with AI success.
- Simulate or observe AI failure and confirm the structured draft/audit trail remains visible.
- Reopen the saved report from Reports.
- Confirm rule-derived findings and AI-generated draft interpretation are visually separated.
- Confirm Privacy Policy and Terms open from Profile.
- Confirm Profile scrolls fully and no account action is hidden behind the tab bar.
- Confirm Support opens the help center, submits a support ticket, and offers email fallback when configured.
- Confirm Delete account removes the test account and saved report archive in the deployed test environment.
- Sign out and sign back in.
- Repeat on one iPhone and one iPad.

## Tester Instructions

Ask testers to record:

- Device model and iOS version.
- Whether the layout works on their screen size.
- Any crash, stuck loading state, or failed navigation.
- Any confusing clinical wording.
- Any output that appears too directive or diagnostic.
- Any report where the audit trail does not explain the displayed rule finding.
- Any AI response that invents missing ECG facts.

## Known Non-Goals For Internal Testing

- No marketing claims.
- No public App Store release.
- No patient-facing use.
- No autonomous ECG acquisition, scanning, waveform processing, or emergency alerting.

## Exit Criteria For Expanding Beyond Internal Testers

- TypeScript, functions build, Expo Doctor, and lint pass.
- Firebase Functions and Firestore rules are deployed to the intended test project.
- At least 5 to 10 known ECG validation cases have clinician review notes.
- Privacy/terms have real entity, support, and deletion/contact details.
- Apple TestFlight app metadata matches clinician-only educational decision support.
