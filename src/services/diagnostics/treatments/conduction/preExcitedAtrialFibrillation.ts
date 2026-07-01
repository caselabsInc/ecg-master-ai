import type { TreatmentGuidance } from '../types';

export const preExcitedAtrialFibrillationTreatment: TreatmentGuidance = {
  conditionId: 'pre_excited_atrial_fibrillation',
  conditionName: 'Pre-excited atrial fibrillation',
  aliases: ['AF with WPW', 'Pre-excited AF'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Atrial fibrillation conducting through an accessory pathway, often producing an irregular wide-complex tachycardia with risk of ventricular fibrillation.',
  immediateActions: ['Assess stability immediately.', 'Prepare synchronized cardioversion if unstable.', 'Avoid AV nodal blockers.'],
  stableManagement: ['Urgent expert consultation; rhythm-control strategy should avoid AV nodal blockade.', 'Use local protocol for accessory-pathway-safe antiarrhythmic therapy.'],
  unstableManagement: ['Immediate synchronized cardioversion for hypotension, shock, ischemic chest pain, altered mental status, or acute heart failure.'],
  medications: [
    {
      name: 'Procainamide',
      role: 'Stable pre-excited AF where supported by local protocol and no contraindication.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Avoid delaying cardioversion if unstable.', 'Specialist/local protocol guidance required.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers', reason: 'May accelerate accessory pathway conduction and precipitate ventricular fibrillation.', dangerLevel: 'contraindicated' },
    { therapy: 'Adenosine, beta blockers, diltiazem, verapamil, digoxin', reason: 'These can block the AV node while leaving the accessory pathway unchecked.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Definitive accessory pathway ablation after acute stabilization when indicated.'],
  monitoring: ['Continuous cardiac monitoring, defibrillator readiness, frequent blood pressure/perfusion checks.'],
  reversibleCauses: ['Electrolyte disturbance', 'Stimulants', 'Acute illness', 'Accessory pathway substrate'],
  consultTriggers: ['All suspected pre-excited AF warrants urgent expert review.'],
  disposition: ['Emergency monitored setting with cardioversion capability.'],
  redFlags: ['Irregular wide-complex tachycardia', 'Very rapid ventricular rates', 'Syncope', 'Hypotension', 'Chest pain', 'Heart failure'],
  patientEducation: ['This rhythm can become dangerous quickly because an extra pathway may conduct very fast; urgent monitored care is needed.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

