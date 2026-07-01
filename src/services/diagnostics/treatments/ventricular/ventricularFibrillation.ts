import type { TreatmentGuidance } from '../types';

export const ventricularFibrillationTreatment: TreatmentGuidance = {
  conditionId: 'ventricular_fibrillation',
  conditionName: 'Ventricular fibrillation',
  aliases: ['VF', 'V-fib'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Chaotic ventricular electrical activity with no organized cardiac output; a shockable cardiac arrest rhythm.',
  immediateActions: ['Confirm unresponsiveness, absent normal breathing, and no pulse.', 'Start high-quality CPR and defibrillate as soon as possible.', 'Activate resuscitation team/emergency response.'],
  stableManagement: [],
  unstableManagement: ['Follow local cardiac arrest VF/pulseless VT algorithm: CPR, defibrillation, vasopressor/antiarrhythmic therapy, and reversible-cause treatment.'],
  medications: [
    {
      name: 'Epinephrine',
      role: 'Cardiac arrest vasopressor in VF algorithm.',
      dose: 'Verify local ACLS protocol.',
      route: 'IV or IO',
      cautions: ['Do not interrupt CPR/defibrillation to administer.'],
    },
    {
      name: 'Amiodarone or lidocaine',
      role: 'Shock-refractory VF/pulseless VT where local protocol supports use.',
      dose: 'Verify local ACLS protocol.',
      route: 'IV or IO',
      cautions: ['Protocol-dependent; prioritize CPR and defibrillation.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Delaying defibrillation', reason: 'VF survival depends on rapid shock and high-quality CPR.', dangerLevel: 'contraindicated' },
    { therapy: 'Pulse-check interruptions', reason: 'Interruptions reduce coronary/cerebral perfusion during arrest.', dangerLevel: 'avoid' },
  ],
  procedures: ['Immediate defibrillation.', 'Advanced airway and vascular/IO access per resuscitation protocol after CPR/defibrillation priorities.'],
  monitoring: ['Continuous rhythm monitoring, CPR quality, end-tidal CO2 if available, reversible causes.'],
  reversibleCauses: ['Hypoxia', 'Hypovolemia', 'Hydrogen ion/acidosis', 'Hypo/hyperkalemia', 'Hypothermia', 'Tension pneumothorax', 'Tamponade', 'Toxins', 'Thrombosis coronary/pulmonary'],
  consultTriggers: ['Post-ROSC critical care/cardiology review; recurrent VF or suspected acute coronary occlusion.'],
  disposition: ['Cardiac arrest resuscitation and post-ROSC ICU/cardiac care if circulation returns.'],
  redFlags: ['Pulselessness', 'Unresponsiveness', 'Agonal/absent breathing', 'Recurrent VF after shocks'],
  patientEducation: ['For survivors/family: this was a life-threatening rhythm requiring CPR and shocks; further evaluation looks for the cause and prevention.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

