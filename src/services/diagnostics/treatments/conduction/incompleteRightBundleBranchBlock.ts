import type { TreatmentGuidance } from '../types';

export const incompleteRightBundleBranchBlockTreatment: TreatmentGuidance = {
  conditionId: 'incomplete_right_bundle_branch_block',
  conditionName: 'Incomplete right bundle branch block',
  aliases: ['Incomplete RBBB', 'IRBBB'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'RBBB-like morphology with QRS <120 ms.',
  immediateActions: ['If symptomatic or associated with right-heart strain signs, evaluate for pulmonary embolism or structural heart disease.'],
  stableManagement: ['Often requires no acute treatment when isolated and asymptomatic.', 'Compare with prior ECGs.'],
  unstableManagement: ['Treat the underlying cause if associated with hypoxia, PE, ACS, or hemodynamic instability.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Antiarrhythmic treatment for isolated IRBBB', reason: 'Incomplete RBBB alone is not an arrhythmia target.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['Telemetry if new, symptomatic, or associated with pulmonary/ischemic concern.'],
  reversibleCauses: ['Right ventricular strain', 'Pulmonary embolism', 'Lead placement variation', 'Structural heart disease'],
  consultTriggers: ['Syncope', 'Dyspnea/hypoxia', 'Suspected PE', 'Progression to complete RBBB or additional conduction disease'],
  disposition: ['Isolated asymptomatic IRBBB: outpatient follow-up.', 'Symptomatic/new IRBBB: evaluate cause.'],
  redFlags: ['Dyspnea', 'Hypoxia', 'Chest pain', 'Syncope', 'Right ventricular strain pattern'],
  patientEducation: ['This is a partial delay in right-sided electrical conduction and often needs only context-based follow-up.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

