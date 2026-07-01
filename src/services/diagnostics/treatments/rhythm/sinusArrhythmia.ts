import type { TreatmentGuidance } from '../types';

export const sinusArrhythmiaTreatment: TreatmentGuidance = {
  conditionId: 'sinus_arrhythmia',
  conditionName: 'Sinus arrhythmia',
  aliases: ['Respiratory sinus arrhythmia'],
  clinicalPriority: 'normal_variant',
  briefClinicalMeaning: 'Normal breathing-related variation in sinus rate, often more obvious in young healthy adults.',
  immediateActions: [],
  stableManagement: ['Reassure when isolated and asymptomatic; no treatment is required.'],
  unstableManagement: [],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Electrophysiology testing or antiarrhythmics for isolated sinus arrhythmia', reason: 'This is a physiologic variant and over-testing can cause harm and anxiety.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['No continuous monitoring is needed for isolated asymptomatic sinus arrhythmia.'],
  reversibleCauses: ['Respiratory vagal tone variation'],
  consultTriggers: [],
  disposition: ['Healthy asymptomatic patient: reassurance and routine care.'],
  redFlags: [],
  patientEducation: ['The rhythm naturally speeds up and slows down with breathing; this is usually a healthy finding.'],
  missingEvidence: ['No source-supported treatment or diagnostic procedure was found for isolated respiratory sinus arrhythmia.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

