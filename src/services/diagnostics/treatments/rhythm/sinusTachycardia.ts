import type { TreatmentGuidance } from '../types';

export const sinusTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'sinus_tachycardia',
  conditionName: 'Sinus tachycardia',
  aliases: ['Sinus tach'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Sinus rhythm faster than 100 bpm, usually a physiologic response to stress, illness, hypovolemia, pain, or hypoxia.',
  immediateActions: ['If shock, hypoxia, ischemia, or sepsis is present, treat the underlying emergency first.'],
  stableManagement: ['Identify and treat the underlying trigger rather than treating the rate as the primary disease.', 'For inappropriate sinus tachycardia, consider hydration, salt loading, and cautious beta-blocker titration.'],
  unstableManagement: ['Manage the cause of instability such as shock, hypoxia, fever, bleeding, or ACS.'],
  medications: [
    {
      name: 'Beta blocker',
      role: 'Selected symptomatic inappropriate sinus tachycardia after compensatory causes are excluded.',
      dose: 'Verify local protocol; careful titration.',
      route: 'Oral',
      cautions: ['Avoid in decompensated heart failure, severe bronchospasm, or compensatory shock.'],
      source: 'Harrisons Cardiovascular Medicine, Tachyarrhythmias, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Empiric rate slowing in undifferentiated shock', reason: 'Sinus tachycardia may be preserving cardiac output in hypovolemia, sepsis, or bleeding.', dangerLevel: 'avoid' },
  ],
  procedures: ['Sinus node modification is a second-line option only for refractory inappropriate sinus tachycardia.'],
  monitoring: ['Monitor oxygen saturation, temperature, fluid balance, pain, hemoglobin, and signs of infection or ischemia.'],
  reversibleCauses: ['Fever', 'Sepsis', 'Hypovolemia', 'Bleeding', 'Pain', 'Hypoxia', 'Anemia', 'ACS', 'Pulmonary embolism', 'Stimulants'],
  consultTriggers: ['Chest pain or ischemia', 'Persistent unexplained resting HR >120 bpm', 'Suspected inappropriate sinus tachycardia'],
  disposition: ['Stable with reversible trigger: treat cause and follow up.', 'Shock, severe hypoxia, or ACS: urgent admission.'],
  redFlags: ['Chest pain', 'Hypotension', 'Altered mental status', 'Cold extremities', 'Severe dyspnea'],
  patientEducation: ['The fast rate is often the body reacting to another problem, so treatment focuses on the trigger.'],
  missingEvidence: ['No exact target heart rate for physiologic sinus tachycardia was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

