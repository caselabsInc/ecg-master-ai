import type { TreatmentGuidance } from '../types';

export const atrialTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'atrial_tachycardia',
  conditionName: 'Atrial tachycardia',
  aliases: ['AT', 'Focal atrial tachycardia', 'Macroreentrant atrial tachycardia'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Supraventricular tachycardia from an atrial focus or reentry circuit outside the sinus node.',
  immediateActions: ['If hypotension, acute heart failure, severe ischemia, or collapse occurs, use synchronized cardioversion.'],
  stableManagement: ['Rate-control ventricular response with beta blocker or non-dihydropyridine calcium channel blocker when appropriate.', 'Use vagal maneuver/adenosine response diagnostically to reveal atrial activity.'],
  unstableManagement: ['Synchronized cardioversion for unstable atrial tachycardia.'],
  medications: [
    {
      name: 'Diltiazem',
      role: 'Ventricular rate control in stable atrial tachycardia.',
      dose: 'Verify local protocol.',
      route: 'Oral or IV',
      cautions: ['Avoid in decompensated HFrEF or hypotension.'],
      source: 'Harrisons Cardiovascular Medicine, Atrial Tachycardias, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Rate slowing before excluding compensatory sinus tachycardia', reason: 'Sinus tachycardia from shock or bleeding can mimic atrial tachycardia.', dangerLevel: 'avoid' },
  ],
  procedures: ['Catheter ablation for recurrent, symptomatic, or drug-refractory atrial tachycardia.'],
  monitoring: ['Telemetry and 12-lead ECG to assess P-wave morphology and distinguish from sinus tachycardia.'],
  reversibleCauses: ['Pulmonary strain', 'Ischemia', 'Hypokalemia', 'Hypomagnesemia', 'Digitalis toxicity'],
  consultTriggers: ['New-onset rapid AT', 'Refractory rate', 'Post-surgical macroreentrant concern', 'Unstable symptoms'],
  disposition: ['Stable rate-controlled AT: outpatient cardiology.', 'Unstable or ischemic AT: inpatient telemetry.'],
  redFlags: ['Atrial rate >200 with 1:1 conduction', 'Chest pain/ST depression', 'New heart failure'],
  patientEducation: ['An irritable area in the upper chamber is firing fast; medicines or ablation may be used when symptoms recur.'],
  missingEvidence: ['No exact target rate or ablation line boundary was found for atypical macroreentrant AT.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

