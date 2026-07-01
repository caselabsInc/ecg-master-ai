import type { TreatmentGuidance } from '../types';

export const subendocardialIschemiaTreatment: TreatmentGuidance = {
  conditionId: 'subendocardial_ischemia',
  conditionName: 'Subendocardial ischemia',
  aliases: ['NSTEMI/UA ST depression pattern', 'Non-transmural ischemia'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Horizontal or downsloping ST depression suggesting inner-wall ischemia, often from supply-demand mismatch or non-occlusive ACS.',
  immediateActions: ['Assess symptoms, hemodynamics, serial ECGs, and troponins.', 'Start ACS evaluation and treat oxygenation, anemia, tachyarrhythmia, or hypotension triggers.'],
  stableManagement: ['Use ACS medical therapy and risk stratification; consider early invasive evaluation for high-risk features.'],
  unstableManagement: ['If refractory pain, shock, heart failure, dynamic ECG changes, or malignant arrhythmia occurs, obtain urgent invasive cardiology evaluation.'],
  medications: [
    { name: 'Aspirin', role: 'Antiplatelet therapy for suspected ACS.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['Active severe bleeding'] },
    { name: 'Anticoagulation', role: 'NSTEMI/UA pathway when ACS is suspected.', dose: 'Verify local protocol.', route: 'IV or subcutaneous', cautions: ['Bleeding risk'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Fibrinolytics for isolated NSTEMI/UA ST depression', reason: 'No benefit and increased bleeding risk without STEMI/OMI indication.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Serial ECGs/troponins.', 'Coronary angiography for high-risk NSTEMI/UA features.'],
  monitoring: ['Telemetry, recurrent pain monitoring, troponins, blood pressure, oxygenation.'],
  reversibleCauses: ['Anemia', 'Hypoxia', 'Sepsis', 'Tachyarrhythmia', 'Hypotension', 'Coronary stenosis/plaque rupture'],
  consultTriggers: ['Dynamic ST depression', 'Troponin rise', 'Refractory angina', 'Heart failure/shock', 'High-risk clinical score.'],
  disposition: ['Low-risk resolved symptoms: protocol-directed observation/follow-up.', 'High-risk or troponin-positive: inpatient ACS pathway.'],
  redFlags: ['Diffuse ST depression', 'aVR elevation', 'Refractory chest pain', 'Troponin rise', 'Pulmonary edema'],
  patientEducation: ['This pattern can show reduced blood flow to the inner heart muscle; clinicians monitor closely and treat the cause.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

