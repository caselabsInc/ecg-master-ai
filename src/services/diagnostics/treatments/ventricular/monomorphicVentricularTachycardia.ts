import type { TreatmentGuidance } from '../types';

export const monomorphicVentricularTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'monomorphic_ventricular_tachycardia',
  conditionName: 'Monomorphic ventricular tachycardia',
  aliases: ['Monomorphic VT', 'Regular VT'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Regular wide-complex ventricular tachycardia with uniform QRS morphology, often due to scar-related reentry.',
  immediateActions: ['Assess pulse and stability immediately.', 'If unstable with pulse, perform synchronized cardioversion.', 'If pulseless, defibrillate and follow cardiac arrest pathway.'],
  stableManagement: ['Use protocol-supported antiarrhythmic therapy and urgent cardiology review in stable sustained VT.', 'Evaluate ischemia, electrolytes, and structural heart disease.'],
  unstableManagement: ['Synchronized cardioversion if hypotension, shock, ischemia, heart failure, or altered mental status is present.'],
  medications: [
    {
      name: 'Amiodarone',
      role: 'Stable sustained monomorphic VT or recurrent VT where local protocol supports use.',
      dose: '150 mg IV over 10 min then infusion where supported by local protocol.',
      route: 'IV',
      cautions: ['Hypotension', 'Bradycardia', 'QT prolongation', 'Long-term organ toxicity'],
      source: 'Harrisons Principles of Internal Medicine, Ventricular Tachyarrhythmias, 2012',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers for presumed SVT', reason: 'Misclassified VT can deteriorate with calcium channel blockers or other nodal agents.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Defibrillation if pulseless.', 'ICD evaluation and possible ablation after stabilization.'],
  monitoring: ['Continuous telemetry, defibrillator readiness, electrolytes, troponin/ischemia evaluation, LV function assessment.'],
  reversibleCauses: ['Ischemia/scar', 'Hypokalemia', 'Hypomagnesemia', 'Drug toxicity', 'Cardiomyopathy'],
  consultTriggers: ['All sustained monomorphic VT warrants urgent cardiology/electrophysiology review.'],
  disposition: ['Emergency/inpatient monitored care; ICU/CCU if unstable, recurrent, or requiring cardioversion/infusion.'],
  redFlags: ['Pulselessness', 'Hypotension', 'Syncope', 'Chest pain', 'Heart failure', 'Recurrent VT'],
  patientEducation: ['This fast rhythm starts in the lower chambers and can become dangerous, so urgent monitored treatment is needed.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

