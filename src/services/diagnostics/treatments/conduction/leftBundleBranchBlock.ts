import type { TreatmentGuidance } from '../types';

export const leftBundleBranchBlockTreatment: TreatmentGuidance = {
  conditionId: 'left_bundle_branch_block',
  conditionName: 'Left bundle branch block',
  aliases: ['LBBB'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Delayed left ventricular depolarization that can obscure standard ST-elevation ischemia assessment.',
  immediateActions: ['For new LBBB with ischemic symptoms, evaluate urgently for occlusion MI using appropriate criteria and clinical context.'],
  stableManagement: ['Assess chronicity, structural heart disease, and heart failure symptoms.', 'Avoid relying on standard STEMI criteria alone.'],
  unstableManagement: ['Treat suspected ACS, shock, or heart failure according to local emergency pathways.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Standard STEMI criteria alone', reason: 'LBBB causes secondary ST-T changes that can mask or mimic ischemia.', dangerLevel: 'avoid' },
  ],
  procedures: ['Cardiac resynchronization therapy may be considered in selected heart failure patients with guideline criteria.'],
  monitoring: ['Telemetry if new, symptomatic, ischemic, or associated with syncope.'],
  reversibleCauses: ['Ischemia', 'Cardiomyopathy', 'Hypertension/structural disease', 'Post-procedure conduction injury'],
  consultTriggers: ['New LBBB with chest pain', 'Syncope', 'Heart failure', 'Positive Sgarbossa/modified Sgarbossa concern'],
  disposition: ['Chronic asymptomatic LBBB: outpatient cardiac evaluation.', 'New or symptomatic LBBB: urgent evaluation.'],
  redFlags: ['Chest pain', 'Dyspnea', 'Syncope', 'Shock', 'Sgarbossa-positive pattern'],
  patientEducation: ['This pattern changes how the heart’s left side activates and may require evaluation for heart disease, especially if new.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

