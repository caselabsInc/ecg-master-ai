import type { TreatmentGuidance } from '../types';

export const stemiMimicsTreatment: TreatmentGuidance = {
  conditionId: 'stemi_mimics',
  conditionName: 'STEMI mimics',
  aliases: ['Non-ischemic ST elevation', 'Pseudoinfarct patterns', 'Secondary ST elevation'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Non-occlusive conditions that can mimic STEMI, including pericarditis, early repolarization, LVH, LBBB, Brugada, hyperkalemia, and hypothermia.',
  immediateActions: ['Assess symptoms, prior ECGs, reciprocal changes, serial ECGs, and dangerous mimics such as hyperkalemia or dissection.'],
  stableManagement: ['Treat the underlying mimic and avoid unnecessary thrombolysis/anticoagulation when STEMI is excluded.'],
  unstableManagement: ['If unstable and STEMI cannot be confidently excluded, obtain emergent cardiology evaluation/coronary angiography.'],
  medications: [{ name: 'Calcium gluconate', role: 'Membrane stabilization when severe hyperkalemia is the mimic.', dose: 'Verify local protocol.', route: 'IV', cautions: ['Do not mix with bicarbonate in same line'] }],
  avoidOrContraindications: [
    { therapy: 'Fibrinolytics in confirmed STEMI mimic', reason: 'May cause catastrophic hemorrhage, especially in pericarditis or dissection.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Serial ECGs.', 'Transthoracic echo for equivocal ST elevation.', 'Coronary angiography if unstable or uncertainty remains high.'],
  monitoring: ['Telemetry and dynamic ST-segment reassessment.'],
  reversibleCauses: ['Hyperkalemia', 'Hypothermia', 'Acute pericarditis', 'LVH strain', 'LBBB', 'Early repolarization'],
  consultTriggers: ['Uncertain ST elevation, instability, reciprocal depression, or suspected dangerous mimic.'],
  disposition: ['Benign static early repolarization: outpatient reassurance.', 'Uncertain or unstable ST elevation: monitored emergency evaluation.'],
  redFlags: ['Reciprocal ST depression', 'Dynamic ST changes', 'Persistent ischemic pain', 'Trapezius-radiating pleuritic pain', 'Hyperkalemia ECG signs'],
  patientEducation: ['Some ECG patterns look like heart attack but come from other causes; clinicians compare symptoms, prior ECGs, labs, and repeat tracings.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

