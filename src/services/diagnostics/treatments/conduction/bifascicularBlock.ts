import type { TreatmentGuidance } from '../types';

export const bifascicularBlockTreatment: TreatmentGuidance = {
  conditionId: 'bifascicular_block',
  conditionName: 'Bifascicular block',
  aliases: ['RBBB with LAFB', 'RBBB with LPFB'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Conduction delay involving two fascicles, commonly RBBB plus LAFB or LPFB.',
  immediateActions: ['Assess for syncope, ischemia, and signs of intermittent high-grade AV block.'],
  stableManagement: ['Review chronicity and symptoms; arrange cardiology follow-up if asymptomatic.'],
  unstableManagement: ['If syncope or unstable bradycardia is present, manage as high-risk conduction disease with pacing readiness.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers without review', reason: 'May worsen conduction in patients with limited remaining conduction reserve.', dangerLevel: 'caution' },
  ],
  procedures: ['Pacing evaluation if syncope, alternating BBB, or high-grade AV block is suspected.'],
  monitoring: ['Telemetry if new, symptomatic, ischemic, or associated with PR prolongation.'],
  reversibleCauses: ['Ischemia', 'Degenerative conduction disease', 'Hyperkalemia', 'Drug effects'],
  consultTriggers: ['Syncope', 'Alternating BBB', 'PR prolongation', 'New bifascicular block with chest pain'],
  disposition: ['Asymptomatic chronic: outpatient cardiology.', 'Syncope/new/ischemic: urgent monitored evaluation.'],
  redFlags: ['Syncope', 'Near-syncope', 'Wide QRS with PR prolongation', 'Chest pain', 'Progression to complete heart block'],
  patientEducation: ['Two parts of the heart’s conduction system are delayed, so fainting or dizziness should be assessed urgently.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

