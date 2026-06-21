# ECG-Master Regulatory Position Draft

Last updated: 14 Jun 2026

## Intended Position

ECG-Master is currently positioned as clinician-only educational decision support. It is intended to help trained health care professionals organize clinician-entered ECG observations, review transparent rule-derived findings, and draft educational explanatory text for independent clinician review.

It is not intended to acquire, scan, process, or analyze ECG waveforms, ECG images, medical images, or signals from signal acquisition systems.

## Non-Device CDS Criteria Mapping

1. No signal or image analysis

The app should not accept ECG waveform uploads, camera ECG scans, signal imports, automatic calipers, or automated ECG pattern detection. The clinician must independently observe the ECG and enter structured findings.

2. Medical information normally communicated between HCPs

The app uses clinician-entered observations, clinical context, and report-style findings such as rhythm label, interval measurements, axis assessment, ST/T findings, and notes.

3. Recommendations, options, and education rather than directives

Outputs should be framed as options for clinician consideration, teaching points, missing data warnings, and documentation support. Avoid urgent alarms, autonomous diagnoses, and directive treatment language.

4. Independent review of the basis

Reports should show the input snapshot, rule-derived findings, rule basis, missing or uncertain inputs, AI status, and clinician-only educational disclaimer so the clinician can independently review the basis.

## Product Guardrails

- HCP-only onboarding language is required.
- Results must separate rule-derived findings from AI-generated draft interpretation.
- Every generated report should include an audit trail.
- AI failures should not erase structured data.
- Public release requires clinical validation, privacy/legal review, store-review metadata, and a documented regulatory decision.

## Open Release Decisions

- Confirm whether public marketing will use "educational tool", "clinician decision support", or "medical device" positioning.
- Obtain written review from qualified clinicians.
- Obtain counsel/regulatory review before publishing store listings.
- Define whether patient-identifiable data is permitted and under what privacy framework.
