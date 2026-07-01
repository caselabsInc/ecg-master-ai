import type { TreatmentGuidance } from '../types';

export const wolffParkinsonWhiteTreatment: TreatmentGuidance = {
  conditionId: 'wolff_parkinson_white_pattern',
  conditionName: 'Wolff-Parkinson-White pattern',
  aliases: ['WPW pattern', 'Ventricular pre-excitation'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Accessory-pathway pre-excitation with short PR, delta wave, and widened QRS, creating risk for re-entrant tachyarrhythmias.',
  immediateActions: ['If tachyarrhythmia is present, determine stability and whether AF is pre-excited.'],
  stableManagement: ['Asymptomatic WPW pattern needs risk assessment and follow-up.', 'Symptomatic palpitations or documented tachyarrhythmia warrants electrophysiology review.'],
  unstableManagement: ['Use synchronized cardioversion for unstable tachyarrhythmia.'],
  medications: [
    {
      name: 'Adenosine',
      role: 'May terminate regular narrow-complex AVRT when local protocol and rhythm assessment support use.',
      dose: 'Verify local protocol.',
      route: 'IV rapid push',
      cautions: ['Avoid in irregular wide-complex/pre-excited AF.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers in pre-excited AF', reason: 'Can increase accessory pathway conduction and precipitate ventricular fibrillation.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Vagal maneuvers for stable regular SVT.', 'Synchronized cardioversion if unstable.', 'Radiofrequency ablation for definitive accessory pathway management when indicated.'],
  monitoring: ['Telemetry during symptomatic tachyarrhythmia; assess for AF, very rapid rates, and wide irregular rhythm.'],
  reversibleCauses: ['Accessory pathway is structural; triggers include stimulants, stress, illness, and electrolyte abnormalities.'],
  consultTriggers: ['Syncope', 'Pre-excited AF', 'Very rapid tachycardia', 'Symptomatic recurrent SVT', 'High-risk occupation/athlete risk assessment'],
  disposition: ['Asymptomatic pattern: outpatient EP/cardiology risk assessment.', 'Symptomatic or pre-excited AF: urgent evaluation.'],
  redFlags: ['Irregular wide-complex tachycardia', 'Syncope', 'Hypotension', 'Shortest pre-excited RR very short if measured by specialist'],
  patientEducation: ['An extra electrical pathway is present; most people do well, but fast rhythms or fainting need urgent review.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

