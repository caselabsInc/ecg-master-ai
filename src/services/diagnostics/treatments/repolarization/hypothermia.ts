import type { TreatmentGuidance } from '../types';

export const hypothermiaTreatment: TreatmentGuidance = {
  conditionId: 'hypothermia',
  conditionName: 'Hypothermia / Osborn waves',
  aliases: ['Osborn waves', 'J waves of hypothermia', 'Systemic hypothermia'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Core temperature below 35 C can slow conduction and repolarization, causing bradycardia, prolonged PR/QRS/QT intervals, artifact from shivering, and Osborn J waves.',
  immediateActions: ['Confirm core temperature with a low-reading probe.', 'Handle gently, remove wet clothing, begin rewarming, and place on continuous monitoring.'],
  stableManagement: ['Mild hypothermia is managed with passive and active external rewarming plus observation until temperature and ECG normalize.'],
  unstableManagement: ['Moderate/severe hypothermia or arrest requires active internal rewarming, warmed oxygen/IV fluids, prolonged resuscitation, and ECMO/bypass consideration where available.'],
  medications: [
    { name: 'None for hypothermia itself', role: 'Primary therapy is rewarming and supportive care.', dose: 'Not applicable.', route: 'Not applicable.', cautions: ['Standard ACLS medications may accumulate when core temperature is very low; verify hypothermia ACLS protocol.'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Aggressive treatment of hypothermia-related bradycardia/slow AF', reason: 'These rhythms often resolve with rewarming; drugs may be ineffective or harmful in a cold irritable myocardium.', dangerLevel: 'avoid' },
    { therapy: 'Rough movement', reason: 'Can precipitate ventricular fibrillation in severe hypothermia.', dangerLevel: 'avoid' },
  ],
  procedures: ['Active external rewarming.', 'Active internal rewarming for severe hypothermia.', 'ECMO/cardiopulmonary bypass consideration for hypothermic arrest where available.'],
  monitoring: ['Continuous core temperature.', 'Telemetry.', 'Electrolytes, glucose, acid-base status, and rewarming response.'],
  reversibleCauses: ['Environmental exposure', 'Myxedema coma', 'Sepsis', 'Hypoglycemia', 'Adrenal insufficiency', 'Drug or alcohol intoxication'],
  consultTriggers: ['Core temperature < 30 C', 'Cardiac arrest or refractory VF', 'Severe bradyarrhythmia', 'Suspected myxedema coma/adrenal crisis'],
  disposition: ['Mild hypothermia after rewarming and stable ECG: observation or discharge per local protocol.', 'Moderate/severe hypothermia or arrhythmia: ICU/rewarming-capable facility.'],
  redFlags: ['Core temperature < 30 C', 'VF/asystole', 'Loss of shivering', 'Marked QRS/QT prolongation', 'Altered mental status'],
  patientEducation: ['The heart rhythm changes are from low body temperature. Gentle rewarming is the main treatment, and the ECG usually improves as temperature normalizes.'],
  missingEvidence: ['Ideal rewarming rate varies by exposure duration, arrest status, and available resources.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
