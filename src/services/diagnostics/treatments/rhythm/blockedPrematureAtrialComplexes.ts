import type { TreatmentGuidance } from '../types';

export const blockedPrematureAtrialComplexesTreatment: TreatmentGuidance = {
  conditionId: 'blocked_premature_atrial_complexes',
  conditionName: 'Blocked premature atrial complexes',
  aliases: ['Blocked PAC', 'Non-conducted PAC', 'Blocked APC', 'Non-conducted APC'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'A premature atrial impulse reaches the AV node while refractory, causing a non-conducted P wave and apparent pause.',
  immediateActions: [],
  stableManagement: ['Reassure when isolated and benign after Mobitz II/high-grade AV block has been excluded.', 'Address stimulant, stress, and electrolyte triggers.'],
  unstableManagement: ['If repetitive pauses cause syncope or instability, reassess diagnosis and manage as symptomatic bradycardia while excluding AV block.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Pacemaker diagnosis before excluding blocked PAC', reason: 'Blocked PAC can mimic Mobitz II and lead to unnecessary pacemaker implantation.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['Use a long rhythm strip/12-lead review to identify hidden premature P waves in the preceding T wave.'],
  reversibleCauses: ['Caffeine', 'Nicotine', 'Stimulants', 'Stress', 'Electrolyte abnormalities'],
  consultTriggers: ['Frequent symptomatic pauses', 'Syncope', 'Cannot confidently distinguish from Mobitz II AV block'],
  disposition: ['Stable isolated blocked PACs: reassurance and outpatient follow-up once dangerous AV block is excluded.'],
  redFlags: ['Repetitive pauses with dizziness/syncope', 'Regular P-P timing suggesting true AV block'],
  patientEducation: ['An early upper-chamber beat can arrive too soon to conduct, creating a harmless pause or skipped-beat feeling.'],
  missingEvidence: ['No specific pharmacologic therapy for symptomatic non-conducted PACs was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

