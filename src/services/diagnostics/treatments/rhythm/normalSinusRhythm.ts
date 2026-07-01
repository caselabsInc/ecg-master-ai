import type { TreatmentGuidance } from '../types';

export const normalSinusRhythmTreatment: TreatmentGuidance = {
  conditionId: 'normal_sinus_rhythm',
  conditionName: 'Normal sinus rhythm',
  aliases: ['NSR', 'Regular sinus rhythm'],
  clinicalPriority: 'normal_variant',
  briefClinicalMeaning: 'Normal rhythm from the sinus node with regular P waves and normal adult resting rate and intervals.',
  immediateActions: [],
  stableManagement: ['No acute treatment is required for asymptomatic normal sinus rhythm.'],
  unstableManagement: [],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Antiarrhythmic or rate-control therapy', reason: 'Normal sinus rhythm is physiologic and should not be treated as a disease.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['Use the ECG as a baseline for PR, QRS, and QTc comparison when clinically useful.'],
  reversibleCauses: [],
  consultTriggers: [],
  disposition: ['Asymptomatic normal ECG: routine care or usual outpatient follow-up.'],
  redFlags: [],
  patientEducation: ['The heart rhythm is normal and starts from the heart\'s natural pacemaker.'],
  missingEvidence: ['No source-supported treatment indication was found for asymptomatic normal sinus rhythm.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
