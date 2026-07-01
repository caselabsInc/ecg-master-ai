import type { TreatmentGuidance } from '../types';

export const sinusBradycardiaTreatment: TreatmentGuidance = {
  conditionId: 'sinus_bradycardia',
  conditionName: 'Sinus bradycardia',
  aliases: ['Slow heart rate', 'Sinus bradyarrhythmia'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Sinus rhythm slower than 60 bpm; often physiologic in athletes or sleep, but concerning when symptomatic.',
  immediateActions: ['If symptomatic or unstable, assess perfusion and follow local bradycardia protocol.'],
  stableManagement: ['Observe if asymptomatic, especially in athletes or during sleep.', 'Review medications and reversible causes.'],
  unstableManagement: ['Use atropine when local protocol supports it.', 'Prepare transcutaneous pacing if symptomatic bradycardia is refractory or severe.'],
  medications: [
    {
      name: 'Atropine',
      role: 'Acute rate support for symptomatic bradycardia with hypoperfusion.',
      dose: 'Verify local ACLS protocol.',
      route: 'IV',
      cautions: ['Use caution in active myocardial ischemia.', 'May cause anticholinergic effects.'],
      source: 'Harrisons Cardiovascular Medicine, Bradyarrhythmias, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Unnecessary pacemaker for asymptomatic bradycardia', reason: 'Asymptomatic sinus bradycardia often has no pacing benefit.', dangerLevel: 'avoid' },
    { therapy: 'Negative chronotropes', reason: 'Beta blockers, non-dihydropyridine CCBs, digoxin, lithium, and antiarrhythmics can worsen sinus node dysfunction.', dangerLevel: 'caution' },
  ],
  procedures: ['Permanent pacemaker evaluation if symptoms clearly correlate with bradycardia and reversible causes are excluded.'],
  monitoring: ['Telemetry for symptomatic bradycardia, pauses, suspected tachy-brady syndrome, or inpatient evaluation.'],
  reversibleCauses: ['High vagal tone', 'Medication effect', 'Hypothermia', 'Hypothyroidism', 'Increased intracranial pressure'],
  consultTriggers: ['Awake HR persistently <40 bpm in non-athletes', 'Syncope or unexplained falls', 'Tachy-brady syndrome'],
  disposition: ['Asymptomatic athlete/young adult: reassurance.', 'Symptomatic or unstable patient: telemetry and pacing evaluation.'],
  redFlags: ['Awake HR <40 bpm', 'Syncope', 'Heart failure symptoms', 'Ischemic chest discomfort', 'Sinus pauses >3 seconds'],
  patientEducation: ['A slow sinus rhythm may be normal in fit people, but dizziness, fainting, fatigue, or chest pain should prompt review.'],
  missingEvidence: ['Exact atropine dosing was marked for local protocol verification in the source batch.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

