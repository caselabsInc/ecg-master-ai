import type { TreatmentGuidance } from '../types';

export const biatrialEnlargementTreatment: TreatmentGuidance = {
  conditionId: 'biatrial_enlargement',
  conditionName: 'Biatrial enlargement',
  aliases: ['BAE', 'Combined atrial enlargement', 'Biatrial abnormality'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'ECG evidence suggesting enlargement or abnormality of both atria, usually from combined left- and right-sided pressure/volume overload such as valve disease, cardiomyopathy, pulmonary hypertension, or congenital disease.',
  immediateActions: ['Stable isolated biatrial enlargement has no acute ECG-specific treatment; assess for decompensated heart failure, hypoxia, pulmonary hypertension, or atrial arrhythmia.'],
  stableManagement: ['Obtain echocardiography to assess both atria, valves, ventricular function, pulmonary pressures, and shunt clues.', 'Treat the underlying valve, cardiomyopathy, pulmonary, hypertensive, or congenital cause.'],
  unstableManagement: ['If pulmonary edema, hypoxia, hypotension, syncope, or rapid atrial arrhythmia is present, manage the acute syndrome urgently and involve cardiology.'],
  medications: [
    {
      name: 'Cause-directed therapy',
      role: 'Manages the structural or hemodynamic disorder causing both atria to enlarge.',
      dose: 'Verify local protocol.',
      route: 'Condition dependent',
      cautions: ['Anticoagulation requires a specific indication such as AF/flutter or another thromboembolic risk state.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Pulmonary vasodilators for pulmonary hypertension due to left-heart disease', reason: 'Can worsen pulmonary edema or cause harm when pulmonary hypertension is WHO Group 2 rather than pulmonary arterial hypertension.', dangerLevel: 'avoid' },
    { therapy: 'Treating biatrial enlargement as a primary rhythm diagnosis', reason: 'It is a marker of underlying structural disease, not a standalone arrhythmia.', dangerLevel: 'caution' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Ambulatory rhythm monitoring if palpitations or intermittent atrial arrhythmia symptoms are present.'],
  monitoring: ['Blood pressure, oxygen saturation, volume status, and heart-failure symptoms.', 'Rhythm monitoring when palpitations, stroke/TIA, or irregular pulse occurs.'],
  reversibleCauses: ['Mitral valve disease', 'Tricuspid valve disease', 'Cardiomyopathy', 'Hypertension', 'Pulmonary hypertension', 'Congenital shunt disease'],
  consultTriggers: ['Moderate-to-severe valve disease.', 'Pulmonary hypertension.', 'New AF/flutter.', 'Heart failure symptoms or suspected congenital heart disease.'],
  disposition: ['Stable incidental biatrial enlargement: outpatient echo and follow-up.', 'Biatrial enlargement with heart failure, hypoxia, syncope, or rapid atrial arrhythmia: urgent evaluation.'],
  redFlags: ['Pulmonary edema', 'Rapid irregular rhythm', 'Syncope', 'Severe dyspnea', 'Marked JVD or peripheral edema'],
  patientEducation: ['The ECG suggests both upper chambers may be enlarged. This is usually a clue to another heart or lung condition, so an ultrasound helps identify the cause.'],
  missingEvidence: ['ECG criteria alone cannot reliably size the atria; echocardiography is needed for confirmation.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
