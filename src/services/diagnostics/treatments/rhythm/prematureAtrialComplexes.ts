import type { TreatmentGuidance } from '../types';

export const prematureAtrialComplexesTreatment: TreatmentGuidance = {
  conditionId: 'premature_atrial_complexes',
  conditionName: 'Premature atrial complexes',
  aliases: ['PACs', 'APCs', 'Atrial premature complexes', 'Premature atrial contractions'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Early ectopic atrial beats that may cause palpitations and usually reset the sinus node.',
  immediateActions: [],
  stableManagement: ['Reassure if isolated or mildly symptomatic.', 'Reduce triggers such as caffeine, nicotine, stimulants, anxiety, and fatigue.'],
  unstableManagement: [],
  medications: [
    {
      name: 'Beta blocker',
      role: 'Symptom suppression for highly symptomatic frequent PACs.',
      dose: 'Verify local protocol.',
      route: 'Oral',
      cautions: ['Avoid in severe bronchospasm or clinically important bradycardia.'],
      source: 'Harrisons Cardiovascular Medicine, Premature Complexes, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Class I or III antiarrhythmics for simple asymptomatic PACs', reason: 'Drug toxicity and proarrhythmia outweigh benefit for benign ectopy.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['Check potassium and magnesium when clinically indicated; ambulatory monitoring if symptoms are frequent or unclear.'],
  reversibleCauses: ['Caffeine', 'Nicotine', 'Stimulants', 'Anxiety', 'Fatigue', 'Electrolyte abnormalities'],
  consultTriggers: ['Very frequent PACs', 'Structural heart disease', 'PAC-triggered AF/flutter', 'Persistent troubling palpitations'],
  disposition: ['Stable asymptomatic/mild PACs: reassurance and outpatient lifestyle modification.'],
  redFlags: ['PACs triggering sustained AF/flutter', 'Frequent PACs with structural heart disease'],
  patientEducation: ['These are common early beats from the upper chambers and often improve by reducing stimulants and stress.'],
  missingEvidence: ['No exact PAC frequency threshold for stroke risk without AF was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

