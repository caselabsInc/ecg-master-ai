import type { TreatmentGuidance } from '../types';

export const lowVoltageTreatment: TreatmentGuidance = {
  conditionId: 'low_voltage',
  conditionName: 'Low QRS voltage',
  aliases: ['Low voltage', 'Low QRS amplitude', 'Decreased ECG voltage'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Reduced QRS amplitude, often from electrical dampening by fluid, air, or body habitus, or from myocardial/infiltrative disease such as amyloidosis, hypothyroidism, or large prior infarction.',
  immediateActions: ['If low voltage is new or paired with tachycardia, dyspnea, hypotension, JVD, or muffled heart sounds, perform urgent bedside ultrasound/echocardiography to assess for pericardial effusion or tamponade.'],
  stableManagement: ['Investigate common non-emergent causes such as COPD/hyperinflation, obesity, hypothyroidism, prior MI, and infiltrative cardiomyopathy.', 'Use echocardiography when structural disease or pericardial effusion is possible.'],
  unstableManagement: ['If tamponade is confirmed with hypotension or obstructive shock, prepare immediate ultrasound-guided pericardiocentesis while preserving preload.'],
  medications: [
    {
      name: 'Cause-directed therapy',
      role: 'Treats confirmed causes such as hypothyroidism, COPD, infiltrative disease, or pericardial disease.',
      dose: 'Verify local protocol.',
      route: 'Condition dependent',
      cautions: ['Start thyroid replacement cautiously in elderly patients or known coronary disease.', 'Avoid preload-reducing drugs when tamponade is suspected.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Diuretics or vasodilators in suspected tamponade', reason: 'Tamponade patients depend on preload; preload reduction can cause cardiovascular collapse.', dangerLevel: 'contraindicated' },
    { therapy: 'Beta-blockers, calcium channel blockers, or digoxin in suspected cardiac amyloidosis without specialist oversight', reason: 'These agents may be poorly tolerated or toxic in amyloid restrictive cardiomyopathy.', dangerLevel: 'avoid' },
  ],
  procedures: ['Bedside ultrasound or transthoracic echocardiography.', 'Urgent pericardiocentesis for hemodynamically significant tamponade.', 'Cardiac MRI or specialist workup when infiltrative cardiomyopathy is suspected.'],
  monitoring: ['Continuous monitoring for unstable patients.', 'Blood pressure, pulsus paradoxus, JVP, and tachycardia when effusion/tamponade is possible.', 'TSH, renal function, and disease-specific labs guided by suspected cause.'],
  reversibleCauses: ['Pericardial effusion/tamponade', 'COPD/emphysema', 'Obesity', 'Hypothyroidism/myxedema', 'Amyloidosis or infiltrative cardiomyopathy', 'Massive prior MI'],
  consultTriggers: ['Moderate-to-large pericardial effusion.', 'Pulsus paradoxus or hypotension.', 'Restrictive heart-failure pattern or suspected infiltrative cardiomyopathy.'],
  disposition: ['Stable chronic low voltage with known COPD/obesity: outpatient workup as appropriate.', 'New low voltage with dyspnea, tachycardia, hypotension, or JVD: urgent ED/echo evaluation.'],
  redFlags: ['Pulsus paradoxus', 'Beck triad', 'Electrical alternans', 'Progressive sinus tachycardia', 'Hypotension or syncope'],
  patientEducation: ['The ECG signal is smaller than expected. This can happen from lung air, body habitus, thyroid disease, weak heart muscle, or fluid around the heart, so symptoms determine urgency.'],
  missingEvidence: ['Low voltage has limited sensitivity for pericardial effusion; absence of low voltage does not rule out effusion.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
