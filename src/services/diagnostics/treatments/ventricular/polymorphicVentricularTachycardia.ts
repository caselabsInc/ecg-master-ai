import type { TreatmentGuidance } from '../types';

export const polymorphicVentricularTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'polymorphic_ventricular_tachycardia',
  conditionName: 'Polymorphic ventricular tachycardia',
  aliases: ['Polymorphic VT', 'PMVT'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Wide-complex tachycardia with changing QRS morphology, often linked to ischemia or repolarization instability.',
  immediateActions: ['Assess pulse and stability immediately.', 'Defibrillate if pulseless; synchronized cardioversion if unstable with a pulse when feasible.'],
  stableManagement: ['Evaluate QT interval: long-QT polymorphic VT suggests torsades; normal-QT polymorphic VT often suggests ischemia.', 'Correct electrolytes and remove proarrhythmic drugs.'],
  unstableManagement: ['Immediate shock therapy for instability or pulselessness.'],
  medications: [
    {
      name: 'Magnesium sulfate',
      role: 'First-line when torsades/long QT physiology is suspected.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Monitor renal function, blood pressure, and respiratory status.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'QT-prolonging antiarrhythmics in long-QT PMVT', reason: 'Can worsen repolarization instability and torsades.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Defibrillation if pulseless.', 'Synchronized cardioversion if unstable with a pulse.', 'Urgent ischemia management when QT is not prolonged.'],
  monitoring: ['Continuous ECG, defibrillator readiness, QTc and electrolyte monitoring, ischemia evaluation.'],
  reversibleCauses: ['Ischemia/ACS', 'Long QT', 'Hypokalemia', 'Hypomagnesemia', 'Drug toxicity', 'Bradycardia'],
  consultTriggers: ['All polymorphic VT warrants urgent cardiology/critical care review.'],
  disposition: ['Emergency/ICU monitored setting.'],
  redFlags: ['Pulselessness', 'Syncope', 'QT prolongation', 'Chest pain', 'Recurrent episodes', 'Electrolyte depletion'],
  patientEducation: ['This is a dangerous lower-chamber rhythm with changing shape, so urgent monitored treatment is required.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

