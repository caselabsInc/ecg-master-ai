import type { TreatmentGuidance } from '../types';

export const pulselessElectricalActivityTreatment: TreatmentGuidance = {
  conditionId: 'pulseless_electrical_activity',
  conditionName: 'Pulseless electrical activity',
  aliases: ['PEA', 'Electromechanical dissociation'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Organized electrical activity without a palpable pulse; a non-shockable cardiac arrest rhythm.',
  immediateActions: ['Confirm no pulse, start high-quality CPR, and activate resuscitation response.', 'Search aggressively for reversible causes.'],
  stableManagement: [],
  unstableManagement: ['Follow local PEA/asystole cardiac arrest algorithm: CPR, epinephrine per protocol, and reversible-cause treatment.'],
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
    { therapy: 'Defibrillation for true PEA', reason: 'PEA is non-shockable; priority is CPR and reversible causes.', dangerLevel: 'avoid' },
    { therapy: 'Failing to confirm pulse status', reason: 'Organized rhythm with a pulse is not PEA and changes management.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['High-quality CPR.', 'Airway/ventilation support.', 'Bedside ultrasound or targeted evaluation for reversible causes where available without delaying CPR.'],
  monitoring: ['Rhythm, pulse checks at protocol intervals, CPR quality, end-tidal CO2 if available.'],
  reversibleCauses: ['Hypoxia', 'Hypovolemia', 'Acidosis', 'Hypo/hyperkalemia', 'Hypothermia', 'Tension pneumothorax', 'Cardiac tamponade', 'Toxins', 'Coronary thrombosis', 'Pulmonary thrombosis'],
  consultTriggers: ['Resuscitation team immediately; post-ROSC critical care if circulation returns.'],
  disposition: ['Cardiac arrest resuscitation; ICU/post-arrest care if ROSC.'],
  redFlags: ['No pulse with organized rhythm', 'Severe hypoxia', 'Massive PE/tamponade/tension pneumothorax clues'],
  patientEducation: ['For survivors/family: electrical signals were present but the heart was not pumping, so CPR and cause-directed treatment were required.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

