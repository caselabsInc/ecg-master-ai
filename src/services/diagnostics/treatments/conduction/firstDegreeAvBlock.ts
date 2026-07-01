import type { TreatmentGuidance } from '../types';

export const firstDegreeAvBlockTreatment: TreatmentGuidance = {
  conditionId: 'first_degree_av_block',
  conditionName: 'First-degree AV block',
  aliases: ['First-degree heart block', '1st-degree AV block', 'PR prolongation'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Delayed AV conduction with PR >200 ms while every P wave conducts to a QRS.',
  immediateActions: [],
  stableManagement: [
    'Usually observe only if asymptomatic.',
    'Review AV nodal blocking drugs and reversible contributors.',
  ],
  unstableManagement: [
    'If symptomatic bradycardia or hypoperfusion is present, follow the local bradycardia pathway.',
  ],
  medications: [
    {
      name: 'Atropine',
      role: 'Symptomatic bradycardia with hypoperfusion as a protocol-directed bridge.',
      dose: '0.5-1 mg IV every 3-5 min to max 3 mg where supported by local ACLS protocol.',
      route: 'IV',
      cautions: ['May be ineffective in infranodal disease.', 'Use caution with acute ischemia.'],
      source: 'Blueprints Medicine, Bradyarrhythmias, 2010',
    },
  ],
  avoidOrContraindications: [
    {
      therapy: 'Unnecessary pacemaker implantation',
      reason: 'Asymptomatic isolated first-degree AV block usually has no pacing benefit.',
      dangerLevel: 'avoid',
    },
    {
      therapy: 'AV nodal blocking agents',
      reason: 'May worsen AV conduction delay or reveal higher-grade block.',
      dangerLevel: 'caution',
    },
  ],
  procedures: ['Permanent pacing only for selected symptomatic marked PR prolongation or specialist-directed indications.'],
  monitoring: ['Telemetry if new block occurs with acute coronary syndrome, drug toxicity, or symptoms.'],
  reversibleCauses: ['AV nodal blockers', 'Increased vagal tone', 'Inferior MI', 'Hyperkalemia', 'Myocarditis or Lyme disease'],
  consultTriggers: ['PR >300 ms with symptoms', 'Syncope', 'New block with ischemic symptoms', 'Co-existing BBB/fascicular block'],
  disposition: ['Asymptomatic isolated cases: outpatient follow-up.', 'Symptomatic, ischemic, or toxicologic cases: urgent evaluation/telemetry.'],
  redFlags: ['Syncope', 'Hypotension', 'PR >300 ms', 'Wide QRS with AV conduction disease', 'Progression to higher-grade block'],
  patientEducation: ['This is delayed electrical conduction, not skipped beats; seek care for fainting, dizziness, chest pain, or shortness of breath.'],
  missingEvidence: ['Benefit of pacing in borderline PR prolongation with moderate heart failure remains uncertain.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

