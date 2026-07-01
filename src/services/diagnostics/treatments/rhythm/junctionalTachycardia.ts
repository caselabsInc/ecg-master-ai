import type { TreatmentGuidance } from '../types';

export const junctionalTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'junctional_tachycardia',
  conditionName: 'Junctional tachycardia',
  aliases: ['Accelerated junctional rhythm', 'Nonparoxysmal junctional tachycardia', 'Junctional ectopic tachycardia'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Automatic tachyarrhythmia from the AV junction, strongly associated with digoxin toxicity or high catecholamine states.',
  immediateActions: ['Assess for digoxin toxicity, medication exposure, ischemia, and hemodynamic compromise.'],
  stableManagement: ['Stop/review digoxin if toxicity suspected and check serum digoxin, potassium, and magnesium.', 'Use beta blocker only in selected symptomatic non-toxic patients.'],
  unstableManagement: ['Treat toxicity, ischemia, or shock; obtain urgent monitored care if rapid or symptomatic.'],
  medications: [
    {
      name: 'Beta blocker',
      role: 'Symptomatic stable junctional tachycardia when digoxin toxicity is excluded.',
      dose: 'Verify local protocol.',
      route: 'Oral',
      cautions: ['Rule out toxicity and compensatory rhythm first.'],
      source: 'Harrisons Cardiovascular Medicine, Junctional Tachyarrhythmias, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Continuing digoxin when toxicity suspected', reason: 'Junctional tachycardia may be a manifestation of lethal digitalis toxicity.', dangerLevel: 'contraindicated' },
  ],
  procedures: [],
  monitoring: ['Telemetry plus potassium, magnesium, and digoxin level when relevant.'],
  reversibleCauses: ['Digoxin toxicity', 'High catecholamine state', 'Postoperative cardiac surgery', 'Electrolyte disturbance'],
  consultTriggers: ['Rate >120 bpm', 'Digoxin toxicity symptoms', 'Elevated digoxin level', 'Ischemic symptoms'],
  disposition: ['Stable non-toxic accelerated junctional rhythm: outpatient follow-up.', 'Suspected digoxin toxicity or ischemia: inpatient telemetry.'],
  redFlags: ['Regularized rhythm in chronic AF on digoxin', 'Yellow-green vision', 'Severe nausea/vomiting', 'Bradycardia or ventricular arrhythmias'],
  patientEducation: ['A rhythm from the heart\'s middle junction may be related to medicine levels, so blood tests and medication review are important.'],
  missingEvidence: ['No source-supported utility for Class IC agents in digoxin-toxic junctional tachycardia was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
