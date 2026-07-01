import type { TreatmentGuidance } from '../types';

export const secondDegreeMobitzITreatment: TreatmentGuidance = {
  conditionId: 'second_degree_av_block_mobitz_i',
  conditionName: 'Second-degree AV block Mobitz I',
  aliases: ['Wenckebach block', 'Mobitz type I'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Progressive PR prolongation followed by a non-conducted P wave; usually AV-nodal and often benign when asymptomatic.',
  immediateActions: [],
  stableManagement: ['Observe if asymptomatic.', 'Review AV nodal blockers, ischemia, vagal tone, electrolytes, and digoxin toxicity.'],
  unstableManagement: ['Treat symptomatic bradycardia with local bradycardia protocol.', 'Prepare pacing if refractory to medication or hypoperfusion persists.'],
  medications: [
    {
      name: 'Atropine',
      role: 'Symptomatic nodal bradycardia or hypoperfusion.',
      dose: '0.5-1 mg IV every 3-5 min to max 3 mg where supported by local ACLS protocol.',
      route: 'IV',
      cautions: ['May worsen ischemia by increasing heart rate.', 'Often ineffective below the AV node.'],
      source: 'Blueprints Medicine, Bradyarrhythmias, 2010',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blocking agents', reason: 'Can worsen bradycardia or AV block.', dangerLevel: 'caution' },
    { therapy: 'Pacemaker for asymptomatic nodal Mobitz I', reason: 'Usually no benefit and exposes patient to procedural risk.', dangerLevel: 'avoid' },
  ],
  procedures: ['Transcutaneous pacing if unstable and refractory.', 'Permanent pacemaker only for persistent symptomatic irreversible block.'],
  monitoring: ['Telemetry during acute coronary syndrome, drug toxicity, or symptomatic episodes.'],
  reversibleCauses: ['AV nodal blockers', 'Inferior MI', 'Increased vagal tone', 'Hyperkalemia', 'Myocarditis or Lyme disease'],
  consultTriggers: ['Symptoms', 'Wide QRS', 'Acute coronary syndrome', 'Persistent or recurrent block'],
  disposition: ['Asymptomatic physiologic Mobitz I: reassurance/outpatient follow-up.', 'Symptomatic, ischemic, or toxicologic Mobitz I: inpatient telemetry.'],
  redFlags: ['Syncope', 'Exertional symptoms', 'Wide QRS', 'Progression to high-grade or complete AV block'],
  patientEducation: ['This pattern often does not need treatment when you feel well, but dizziness, fainting, or breathlessness should be reported promptly.'],
  missingEvidence: ['Long-term risk in older patients without structural heart disease is incompletely defined.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

