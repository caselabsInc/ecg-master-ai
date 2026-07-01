import type { TreatmentGuidance } from '../types';

export const svtWithAberrancyTreatment: TreatmentGuidance = {
  conditionId: 'svt_with_aberrancy',
  conditionName: 'SVT with aberrancy',
  aliases: ['Aberrant SVT', 'SVT with bundle branch block', 'Wide-complex SVT'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Supraventricular tachycardia conducted with a wide QRS due to bundle branch block or rate-related aberrancy.',
  immediateActions: ['Assess stability; if uncertain or unstable, treat as wide-complex tachycardia/VT until proven otherwise.'],
  stableManagement: ['Confirm supraventricular origin before AV nodal blocker use.', 'Use vagal maneuvers/adenosine only when regular rhythm and local protocol support.'],
  unstableManagement: ['Synchronized cardioversion for unstable wide-complex tachycardia with pulse.'],
  medications: [
    {
      name: 'Adenosine',
      role: 'Diagnostic/therapeutic option for stable regular monomorphic WCT when SVT with aberrancy is suspected and protocol supports use.',
      dose: 'Verify local protocol.',
      route: 'Rapid IV bolus',
      cautions: ['Avoid in irregular wide-complex tachycardia or pre-excited AF concern.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Verapamil/diltiazem in uncertain WCT', reason: 'If rhythm is VT, calcium channel blockers can cause collapse.', dangerLevel: 'contraindicated' },
    { therapy: 'AV nodal blockers in irregular/pre-excited WCT', reason: 'May precipitate VF through accessory pathway conduction.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Expert ECG review after stabilization.'],
  monitoring: ['Continuous ECG and blood pressure monitoring during therapy.'],
  reversibleCauses: ['Rate-related BBB', 'Pre-existing BBB', 'Accessory pathway', 'Electrolyte disturbance'],
  consultTriggers: ['Uncertain WCT', 'Structural heart disease', 'Pre-excitation concern', 'Refractory tachycardia'],
  disposition: ['Stable confirmed SVT with aberrancy after conversion: cardiology follow-up.', 'Uncertain/new/unstable WCT: monitored emergency care.'],
  redFlags: ['Irregular wide tachycardia', 'Hypotension', 'Syncope', 'Chest pain', 'Structural heart disease'],
  patientEducation: ['A fast rhythm from above the ventricles can look wide when conduction is delayed, but clinicians treat uncertainty carefully.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

