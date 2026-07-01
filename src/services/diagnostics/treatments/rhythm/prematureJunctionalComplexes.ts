import type { TreatmentGuidance } from '../types';

export const prematureJunctionalComplexesTreatment: TreatmentGuidance = {
  conditionId: 'premature_junctional_complexes',
  conditionName: 'Premature junctional complexes',
  aliases: ['PJC', 'PJCs', 'Junctional premature complexes', 'Junctional premature contractions'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Rare early ectopic beats from the AV junction, often with retrograde atrial activation.',
  immediateActions: [],
  stableManagement: ['Observe and reassure if asymptomatic.', 'Assess for stress, ischemia, and digoxin effect if frequent or new.'],
  unstableManagement: [],
  medications: [
    {
      name: 'Beta blocker',
      role: 'Symptom suppression for frequent PJCs causing persistent palpitations.',
      dose: 'Verify local protocol.',
      route: 'Oral',
      cautions: ['Avoid if heart failure, severe bronchospasm, or bradycardia is present.'],
      source: 'Harrisons Cardiovascular Medicine, Junctional Premature Complexes, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Class IC drugs in structural heart disease', reason: 'Flecainide/propafenone can be proarrhythmic in coronary or structural heart disease.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['ECG monitoring when needed to distinguish PJCs from PACs/PVCs and assess frequency.'],
  reversibleCauses: ['Stress', 'Anxiety', 'Exhaustion', 'Myocardial ischemia', 'Digoxin effect'],
  consultTriggers: ['Frequent symptomatic PJCs', 'Known structural heart disease', 'Digitalis use/toxicity concern'],
  disposition: ['Stable asymptomatic patient: reassurance and routine follow-up.'],
  redFlags: ['Frequent PJCs with structural heart disease', 'Digitalis use with toxicity features'],
  patientEducation: ['These are rare early beats from the heart\'s middle junction and are usually harmless when isolated.'],
  missingEvidence: ['No exact PJC frequency threshold for cardiac imaging was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
