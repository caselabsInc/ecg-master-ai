import type { TreatmentGuidance } from '../types';

export const nonspecificIvcdTreatment: TreatmentGuidance = {
  conditionId: 'nonspecific_intraventricular_conduction_delay',
  conditionName: 'Nonspecific intraventricular conduction delay',
  aliases: ['IVCD', 'Nonspecific IVCD'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Wide QRS conduction delay that does not meet classic RBBB or LBBB morphology.',
  immediateActions: ['If new with chest pain, syncope, heart failure, or hyperkalemia concern, evaluate urgently.'],
  stableManagement: ['Assess chronicity and underlying structural, metabolic, ischemic, or drug-related cause.'],
  unstableManagement: ['Treat the underlying emergency: ACS, hyperkalemia, toxicologic sodium-channel blockade, or shock.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Assuming benignity without context', reason: 'New IVCD may reflect ischemia, metabolic disturbance, or toxicologic conduction slowing.', dangerLevel: 'caution' },
  ],
  procedures: ['Pacing/defibrillation readiness if associated with unstable bradycardia or malignant arrhythmia.'],
  monitoring: ['Telemetry, electrolyte assessment, medication/toxin review.'],
  reversibleCauses: ['Hyperkalemia', 'Drug toxicity', 'Ischemia', 'Cardiomyopathy', 'Myocarditis'],
  consultTriggers: ['New IVCD', 'Syncope', 'Chest pain', 'QRS widening progression', 'Suspected hyperkalemia/toxicity'],
  disposition: ['Chronic asymptomatic IVCD: outpatient cardiac evaluation.', 'New or symptomatic IVCD: urgent evaluation.'],
  redFlags: ['Chest pain', 'Syncope', 'Shock', 'Marked QRS widening', 'Peaked T waves or toxicologic history'],
  patientEducation: ['This means ventricular electrical conduction is slowed; care depends on whether it is new and what caused it.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

