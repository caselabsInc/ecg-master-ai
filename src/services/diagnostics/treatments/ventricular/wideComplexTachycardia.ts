import type { TreatmentGuidance } from '../types';

export const wideComplexTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'wide_complex_tachycardia',
  conditionName: 'Wide-complex tachycardia',
  aliases: ['WCT', 'Undifferentiated wide-complex tachycardia'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Tachycardia with wide QRS complexes; ventricular tachycardia must be assumed until proven otherwise.',
  immediateActions: ['Assess pulse and hemodynamic stability immediately.', 'If unstable with a pulse, perform synchronized cardioversion.', 'If pulseless, follow cardiac arrest defibrillation pathway.'],
  stableManagement: ['Treat uncertain regular WCT as VT unless expert confirmation supports SVT with aberrancy.', 'Use rhythm strip/12-lead and expert review without delaying emergency care.'],
  unstableManagement: ['Synchronized cardioversion for unstable WCT with a pulse; defibrillation for pulseless VT/VF.'],
  medications: [
    {
      name: 'Amiodarone or procainamide',
      role: 'Stable monomorphic WCT/VT where supported by local protocol.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Do not delay cardioversion if unstable.', 'Monitor QT, QRS, blood pressure.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Verapamil/diltiazem for undifferentiated WCT', reason: 'If WCT is VT, calcium channel blockers can cause cardiovascular collapse.', dangerLevel: 'contraindicated' },
    { therapy: 'Assuming SVT with aberrancy in structural heart disease', reason: 'Most regular WCT in structural heart disease is VT.', dangerLevel: 'avoid' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Defibrillation if pulseless.', 'Expert ECG review and cardiology/electrophysiology evaluation after stabilization.'],
  monitoring: ['Continuous ECG, defibrillator readiness, pulse checks, electrolytes, ischemia evaluation.'],
  reversibleCauses: ['Ischemia', 'Electrolyte abnormalities', 'Drug toxicity', 'Accessory pathway rhythms', 'Structural heart disease'],
  consultTriggers: ['All WCT patterns warrant urgent expert review unless clearly benign and stable.'],
  disposition: ['Emergency/inpatient monitored setting for new or uncertain WCT.'],
  redFlags: ['Hypotension', 'Syncope', 'Chest pain', 'Heart failure', 'Pulselessness', 'Polymorphic morphology'],
  patientEducation: ['A fast wide rhythm can be dangerous, so clinicians treat it urgently while determining the exact source.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

