import type { TreatmentGuidance } from '../types';

export const avnrtTreatment: TreatmentGuidance = {
  conditionId: 'avnrt',
  conditionName: 'Atrioventricular nodal reentrant tachycardia',
  aliases: ['AVNRT', 'PSVT', 'Narrow-complex SVT'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Regular narrow-complex SVT caused by a reentrant circuit using fast and slow AV nodal pathways.',
  immediateActions: ['If stable, start with vagal maneuvers.', 'If unstable, perform synchronized cardioversion.'],
  stableManagement: ['Use adenosine if vagal maneuvers fail and rhythm is regular narrow-complex SVT.', 'Use IV beta blocker or non-dihydropyridine calcium channel blocker as second-line when appropriate.'],
  unstableManagement: ['Immediate synchronized cardioversion for hypotension, altered mental status, pulmonary edema, or ischemic chest pain.'],
  medications: [
    {
      name: 'Adenosine',
      role: 'Acute termination of stable AV-node-dependent reentrant SVT.',
      dose: '6 mg rapid IV bolus, then 12 mg if unsuccessful, where supported by local protocol.',
      route: 'Rapid IV bolus',
      cautions: ['Transient chest pressure/dyspnea/flushing.', 'Use caution with bronchospasm and wide/irregular tachycardia.'],
      source: 'Harrisons Cardiovascular Medicine, Commonly Used Antiarrhythmic Agents, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Verapamil in wide-complex regular tachycardia', reason: 'If the rhythm is VT, verapamil can cause cardiovascular collapse.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Slow-pathway catheter ablation for recurrent symptomatic AVNRT.'],
  monitoring: ['Continuous ECG during acute episode and after conversion.'],
  reversibleCauses: ['Stimulants', 'Stress', 'Physical exertion', 'Hormonal triggers'],
  consultTriggers: ['First episode', 'Adenosine-refractory SVT', 'Recurrent symptomatic episodes', 'Need for ablation evaluation'],
  disposition: ['Stable and converted: outpatient cardiology referral.', 'Unstable, cardioverted, or refractory: inpatient telemetry.'],
  redFlags: ['Rate >200 bpm', 'Hypotension', 'Syncope', 'Chest pain/ST depression', 'Refractory SVT'],
  patientEducation: ['This is a fast electrical loop in the AV node; simple maneuvers, adenosine, or ablation can stop or prevent it.'],
  missingEvidence: ['No source-supported details were found for Valsalva use in pregnancy.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

