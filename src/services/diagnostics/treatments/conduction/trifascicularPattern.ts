import type { TreatmentGuidance } from '../types';

export const trifascicularPatternTreatment: TreatmentGuidance = {
  conditionId: 'trifascicular_pattern',
  conditionName: 'Trifascicular pattern',
  aliases: ['Bifascicular block with PR prolongation', 'Possible trifascicular disease'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Bifascicular conduction disease plus AV conduction delay, suggesting limited conduction reserve.',
  immediateActions: ['Assess for syncope, unstable bradycardia, and intermittent high-grade AV block.'],
  stableManagement: ['Cardiology review is appropriate, especially if new or symptomatic.', 'Review AV nodal blocking medications.'],
  unstableManagement: ['If unstable bradycardia or syncope is present, prepare for urgent pacing-capable management.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers without specialist review', reason: 'May worsen AV delay in a patient with fascicular disease.', dangerLevel: 'caution' },
    { therapy: 'Ignoring syncope as benign', reason: 'Syncope may indicate intermittent complete heart block.', dangerLevel: 'avoid' },
  ],
  procedures: ['Pacing evaluation for syncope, intermittent high-grade block, or symptomatic bradycardia.'],
  monitoring: ['Telemetry if new, symptomatic, ischemic, or medication/toxin related.'],
  reversibleCauses: ['Drug effects', 'Hyperkalemia', 'Ischemia', 'Degenerative conduction disease'],
  consultTriggers: ['Syncope', 'Near-syncope', 'New pattern', 'Progressive PR/QRS prolongation'],
  disposition: ['Asymptomatic chronic: outpatient cardiology.', 'Syncope/new/unstable: urgent monitored evaluation.'],
  redFlags: ['Syncope', 'Hypotension', 'Alternating BBB', 'Progression to high-grade AV block'],
  patientEducation: ['Several conduction pathways are delayed; symptoms like fainting need urgent assessment.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

