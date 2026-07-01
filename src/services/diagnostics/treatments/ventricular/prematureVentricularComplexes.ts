import type { TreatmentGuidance } from '../types';

export const prematureVentricularComplexesTreatment: TreatmentGuidance = {
  conditionId: 'premature_ventricular_complexes',
  conditionName: 'Premature ventricular complexes',
  aliases: ['PVCs', 'Premature ventricular contractions', 'VPBs', 'Ventricular premature beats'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Early ectopic ventricular beats producing wide premature QRS complexes, often with a compensatory pause.',
  immediateActions: ['Assess hemodynamic stability, ischemic symptoms, structural heart disease history, and PVC complexity.'],
  stableManagement: ['Reassure if isolated, asymptomatic, and structural heart disease is not suspected.', 'Reduce triggers such as caffeine, nicotine, stimulants, stress, and sleep deprivation.', 'Assess LV function if PVC burden is very high.'],
  unstableManagement: ['If PVCs occur with chest pain, syncope, acute MI, heart failure, or hypotension, manage the underlying emergency and monitor continuously.'],
  medications: [
    {
      name: 'Beta blocker',
      role: 'First-line symptom suppression for highly symptomatic PVCs.',
      dose: 'Metoprolol succinate 25-50 mg PO daily or atenolol 25-50 mg PO daily where supported by local protocol.',
      route: 'Oral',
      cautions: ['Bradycardia', 'Hypotension', 'Severe bronchospastic disease'],
      source: 'Harrisons Principles of Internal Medicine, Ventricular Premature Complexes, 2012',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Class IC antiarrhythmics after MI or in structural heart disease', reason: 'PVC suppression with Class IC drugs can increase proarrhythmia and sudden death risk.', dangerLevel: 'contraindicated' },
    { therapy: 'Routine antiarrhythmic suppression of benign PVCs', reason: 'Drug toxicity/proarrhythmia outweighs benefit in asymptomatic normal hearts.', dangerLevel: 'avoid' },
  ],
  procedures: ['Echocardiogram if frequent PVCs or structural disease is suspected.', 'Catheter ablation for refractory symptomatic PVCs or PVC-induced cardiomyopathy.'],
  monitoring: ['Holter or telemetry to quantify PVC burden and identify couplets, triplets, or VT runs.'],
  reversibleCauses: ['Hypokalemia', 'Hypomagnesemia', 'Ischemia/ACS', 'Stimulants', 'Hyperthyroidism', 'Digoxin toxicity'],
  consultTriggers: ['PVC burden >10%', 'LV dysfunction', 'Prior MI', 'Syncope', 'Family history of sudden death', 'Progression to nonsustained or sustained VT'],
  disposition: ['Isolated asymptomatic PVCs with normal LV function: outpatient follow-up.', 'Frequent/symptomatic PVCs or PVCs with acute MI: telemetry evaluation.'],
  redFlags: ['Syncope', 'Chest pain', 'Dyspnea/heart failure', 'Multiform PVCs', 'R-on-T PVC', 'Runs of ventricular beats'],
  patientEducation: ['PVCs are extra early beats from the lower chambers and are often harmless in a healthy heart, but fainting, chest pressure, or breathlessness should be reported.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

