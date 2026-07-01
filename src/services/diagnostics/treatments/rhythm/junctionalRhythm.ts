import type { TreatmentGuidance } from '../types';

export const junctionalRhythmTreatment: TreatmentGuidance = {
  conditionId: 'junctional_rhythm',
  conditionName: 'Junctional rhythm',
  aliases: ['Junctional escape rhythm', 'Nodal rhythm'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Backup rhythm from the AV junction, usually 40-60 bpm, often with absent or retrograde P waves.',
  immediateActions: ['If symptomatic bradycardia or hypoperfusion is present, follow local bradycardia protocol.'],
  stableManagement: ['Observe if asymptomatic and search for underlying causes such as drug effect or sinus node dysfunction.'],
  unstableManagement: ['Use atropine where protocol supports it and prepare transcutaneous pacing if refractory.'],
  medications: [
    {
      name: 'Atropine',
      role: 'Symptomatic junctional bradycardia with poor perfusion.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Ensure pacing equipment is available.', 'Do not suppress a necessary escape rhythm.'],
      source: 'Harrisons Cardiovascular Medicine, Bradyarrhythmias, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Antiarrhythmics to suppress stable escape rhythm', reason: 'Junctional escape may be preserving cardiac output when the sinus node fails.', dangerLevel: 'contraindicated' },
    { therapy: 'Negative chronotropes/AV blockers', reason: 'Can worsen sinus node suppression or AV conduction.', dangerLevel: 'caution' },
  ],
  procedures: ['Temporary pacing if unstable and refractory.', 'Permanent pacemaker for symptomatic sinus node dysfunction causing dependent junctional escape.'],
  monitoring: ['Telemetry if symptomatic, HR <40, suspected pauses, ischemia, or toxicity.'],
  reversibleCauses: ['Beta blocker/CCB toxicity', 'Digoxin toxicity', 'Sick sinus syndrome', 'SA block', 'Inferior MI'],
  consultTriggers: ['Rate <40 bpm', 'Syncope', 'Chest pain', 'Suspected digoxin toxicity'],
  disposition: ['Stable transient drug-related rhythm: hold offending drug and follow up.', 'Symptomatic, HR <40, or ischemic: inpatient telemetry.'],
  redFlags: ['Rate <40 bpm', 'Syncope', 'Hypotension', 'Ischemic chest pain'],
  patientEducation: ['This is a backup rhythm from the heart\'s middle junction; treatment focuses on why the main pacemaker slowed.'],
  missingEvidence: ['No exact target heart rate for chronic junctional escape pacing was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
