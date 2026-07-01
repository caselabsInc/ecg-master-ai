import type { TreatmentGuidance } from '../types';

export const asystoleTreatment: TreatmentGuidance = {
  conditionId: 'asystole',
  conditionName: 'Asystole',
  aliases: ['Ventricular standstill', 'Flatline', 'P-wave asystole'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Absent organized ventricular electrical activity; a non-shockable cardiac arrest rhythm.',
  immediateActions: ['Confirm true asystole in more than one lead and check connections/gain.', 'Confirm pulselessness, start high-quality CPR, and activate resuscitation response.'],
  stableManagement: [],
  unstableManagement: ['Follow local asystole/PEA cardiac arrest algorithm with CPR, epinephrine per protocol, and reversible-cause treatment.'],
  medications: [
    {
      name: 'Epinephrine',
      role: 'Cardiac arrest vasopressor in non-shockable rhythm pathway.',
      dose: 'Verify local ACLS protocol.',
      route: 'IV or IO',
      cautions: ['Do not interrupt CPR to administer.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Defibrillation for true asystole', reason: 'Asystole is non-shockable; CPR and reversible causes are priorities.', dangerLevel: 'avoid' },
    { therapy: 'Stopping before checking equipment/leads', reason: 'Lead disconnection or low gain can mimic asystole.', dangerLevel: 'avoid' },
  ],
  procedures: ['High-quality CPR.', 'Airway/ventilation support.', 'Transcutaneous pacing is generally not useful in true asystole but may be considered only for specific P-wave asystole/local protocol scenarios.'],
  monitoring: ['Confirm rhythm in multiple leads, CPR quality, end-tidal CO2 if available, reversible causes.'],
  reversibleCauses: ['Hypoxia', 'Hypovolemia', 'Acidosis', 'Hypo/hyperkalemia', 'Hypothermia', 'Tension pneumothorax', 'Tamponade', 'Toxins', 'Thrombosis coronary/pulmonary'],
  consultTriggers: ['Resuscitation team immediately; post-ROSC critical care if circulation returns.'],
  disposition: ['Cardiac arrest resuscitation; ICU/post-arrest care if ROSC.'],
  redFlags: ['Pulselessness', 'Unresponsiveness', 'No ventricular complexes', 'Possible equipment artifact'],
  patientEducation: ['For survivors/family: the heart had no effective ventricular electrical activity, so CPR and cause-directed resuscitation were required.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

