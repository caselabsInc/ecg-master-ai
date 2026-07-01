import type { TreatmentGuidance } from '../types';

export const sgarbossaPositiveIschemiaTreatment: TreatmentGuidance = {
  conditionId: 'sgarbossa_positive_ischemia',
  conditionName: 'Sgarbossa-positive acute infarction',
  aliases: ['Sgarbossa-positive STEMI', 'MI in LBBB', 'Paced-rhythm STEMI equivalent'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Acute infarction pattern in LBBB or paced rhythm using concordant or excessive-discordance ST criteria.',
  immediateActions: ['Activate cath lab for Sgarbossa/modified Sgarbossa-positive ECG with ischemic symptoms.', 'Use bedside echo if borderline but suspicion remains high.'],
  stableManagement: ['After reperfusion, use post-MI secondary prevention.'],
  unstableManagement: ['For shock, pulmonary edema, or respiratory failure, proceed to immediate revascularization with critical-care support.'],
  medications: [{ name: 'Aspirin', role: 'Immediate antiplatelet therapy.', dose: '325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active severe bleeding'] }],
  avoidOrContraindications: [
    { therapy: 'Standard STEMI criteria in LBBB/paced rhythm', reason: 'Baseline secondary ST-T changes make standard thresholds unreliable.', dangerLevel: 'contraindicated' },
    { therapy: 'Fibrinolytics for borderline/non-specific Sgarbossa changes when PCI available', reason: 'Bleeding risk with uncertain benefit; primary PCI preferred.', dangerLevel: 'avoid' },
  ],
  procedures: ['Emergency coronary angiography/primary PCI.', 'Bedside echocardiography for equivocal cases without delaying unstable care.'],
  monitoring: ['Telemetry, serial troponins, serial ECGs, heart failure/shock monitoring.'],
  reversibleCauses: ['Acute coronary thrombosis', 'Aortic dissection involving coronary arteries'],
  consultTriggers: ['Sgarbossa-positive LBBB or paced ECG: immediate interventional cardiology activation.'],
  disposition: ['Active symptoms with positive criteria: cath lab/CCU pathway.'],
  redFlags: ['Concordant ST elevation', 'Concordant V1-V3 ST depression', 'Excessive discordance', 'Hypotension', 'Pulmonary crackles'],
  patientEducation: ['Because LBBB or pacing can hide heart attacks, special ECG rules are used; this pattern needs urgent artery-opening evaluation.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

