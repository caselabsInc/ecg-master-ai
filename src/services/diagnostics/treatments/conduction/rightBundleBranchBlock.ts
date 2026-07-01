import type { TreatmentGuidance } from '../types';

export const rightBundleBranchBlockTreatment: TreatmentGuidance = {
  conditionId: 'right_bundle_branch_block',
  conditionName: 'Right bundle branch block',
  aliases: ['RBBB'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Delayed right ventricular depolarization with typical RBBB morphology.',
  immediateActions: ['If new RBBB with chest pain, dyspnea, syncope, or shock, assess for ischemia, pulmonary embolism, or structural disease.'],
  stableManagement: ['No acute treatment for isolated asymptomatic chronic RBBB.', 'Compare with prior ECGs and evaluate clinical context.'],
  unstableManagement: ['Treat the underlying cause such as ACS, pulmonary embolism, or bradyarrhythmia.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Treating isolated RBBB with antiarrhythmics', reason: 'RBBB is a conduction pattern, not an arrhythmia requiring suppression.', dangerLevel: 'avoid' },
  ],
  procedures: ['Pacing only if associated with symptomatic high-grade AV conduction disease.'],
  monitoring: ['Telemetry if new, symptomatic, ischemic, or associated with additional conduction disease.'],
  reversibleCauses: ['Pulmonary embolism/right ventricular strain', 'Myocardial ischemia', 'Myocarditis', 'Post-procedure conduction injury'],
  consultTriggers: ['Syncope', 'New RBBB with chest pain', 'Bifascicular/trifascicular pattern', 'Progressive conduction delay'],
  disposition: ['Chronic asymptomatic RBBB: outpatient follow-up.', 'New symptomatic RBBB: urgent evaluation.'],
  redFlags: ['Chest pain', 'Syncope', 'Dyspnea', 'Hypotension', 'Anterior ischemia clues', 'Co-existing fascicular block'],
  patientEducation: ['This shows delayed electrical travel through the right bundle; treatment depends on whether it is new or linked to symptoms.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

