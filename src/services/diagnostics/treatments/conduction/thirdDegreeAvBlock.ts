import type { TreatmentGuidance } from '../types';

export const thirdDegreeAvBlockTreatment: TreatmentGuidance = {
  conditionId: 'third_degree_av_block',
  conditionName: 'Third-degree AV block',
  aliases: ['Complete heart block', 'Complete AV block'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Complete AV dissociation with atria and ventricles driven by independent pacemakers.',
  immediateActions: ['Assess perfusion immediately.', 'Apply pacing pads and obtain urgent pacing-capable review.'],
  stableManagement: ['Continuous monitoring and urgent cardiology assessment.', 'Evaluate for reversible causes while preparing definitive pacing.'],
  unstableManagement: ['Immediate transcutaneous pacing for shock, hypotension, ischemia, altered mental status, or heart failure.', 'Bridge with protocol-directed vasoactive infusion if pacing delayed.'],
  medications: [
    {
      name: 'Dopamine or epinephrine infusion',
      role: 'Temporary bridge to pacing in symptomatic bradycardia.',
      dose: 'Verify local protocol.',
      route: 'IV infusion',
      cautions: ['Do not delay pacing.', 'Monitor for ischemia and tachyarrhythmias.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blocking agents', reason: 'Can worsen escape rhythm reliability and bradycardia.', dangerLevel: 'contraindicated' },
    { therapy: 'Atropine as definitive therapy', reason: 'Often ineffective in infranodal complete block.', dangerLevel: 'avoid' },
  ],
  procedures: ['Transcutaneous pacing', 'Transvenous pacing', 'Permanent pacemaker if persistent or irreversible.'],
  monitoring: ['Continuous telemetry, blood pressure/perfusion reassessment, ischemia evaluation, electrolyte review.'],
  reversibleCauses: ['Inferior MI', 'Anterior MI', 'Drug toxicity', 'Hyperkalemia', 'Myocarditis', 'Lyme disease'],
  consultTriggers: ['All complete heart block patterns warrant urgent specialist review.'],
  disposition: ['Emergency/inpatient monitoring with pacing capability.'],
  redFlags: ['Ventricular escape <40 bpm', 'Wide escape QRS', 'Syncope', 'Hypotension', 'Chest pain', 'Heart failure'],
  patientEducation: ['The upper and lower chambers are not communicating normally, so urgent monitored care and pacing may be needed.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

