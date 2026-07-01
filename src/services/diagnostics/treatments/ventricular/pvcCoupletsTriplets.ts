import type { TreatmentGuidance } from '../types';

export const pvcCoupletsTripletsTreatment: TreatmentGuidance = {
  conditionId: 'pvc_couplets_triplets',
  conditionName: 'PVC couplets and triplets',
  aliases: ['Paired PVCs', 'Doublet PVCs', 'Triplet PVCs', 'Grouped ventricular ectopy'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Two or three consecutive PVCs, suggesting increased ventricular irritability.',
  immediateActions: ['Place on cardiac monitoring and assess vital signs, ischemia, and structural heart disease risk.'],
  stableManagement: ['Correct potassium and magnesium abnormalities.', 'Consider beta blocker for symptomatic grouped ectopy after structural risk assessment.'],
  unstableManagement: ['If chest pain, hypotension, or recurrent runs occur, manage as possible ischemia/ventricular tachyarrhythmia and use monitored care.'],
  medications: [
    {
      name: 'Amiodarone',
      role: 'Suppression of severe refractory ventricular ectopy in structural heart disease when specialist/protocol supported.',
      dose: '150 mg IV over 10 min, then infusion where supported by local protocol.',
      route: 'IV',
      cautions: ['QT prolongation', 'Bradycardia', 'Hypotension', 'Pulmonary/hepatic/thyroid toxicity'],
      source: 'Harrisons Principles of Internal Medicine, Antiarrhythmic Drugs, 2012',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Class IC antiarrhythmics in structural heart disease', reason: 'Increased sudden death risk after MI or ventricular scar.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Transthoracic echocardiogram to assess LV function and structural disease.', 'Escalate to VT pathway if triplets progress to sustained runs.'],
  monitoring: ['Continuous telemetry to detect progression to nonsustained/sustained VT.'],
  reversibleCauses: ['Acute ischemia/MI', 'Hypokalemia', 'Hypomagnesemia', 'Hypoxia', 'Hypercapnia', 'Cocaine/amphetamine use', 'Digoxin toxicity'],
  consultTriggers: ['Prior MI', 'EF <40%', 'Syncope', 'Angina', 'Triplets progressing to VT', 'Structural heart disease'],
  disposition: ['Normal heart and asymptomatic: outpatient cardiology follow-up.', 'Ischemia, low EF, syncope, or frequent runs: telemetry/ICU depending severity.'],
  redFlags: ['Syncope', 'Ischemic chest discomfort', 'Dyspnea', 'Longer VT runs', 'R-on-T ectopy'],
  patientEducation: ['Grouped PVCs mean extra lower-chamber beats are occurring back-to-back, so we check heart structure and electrolytes carefully.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

