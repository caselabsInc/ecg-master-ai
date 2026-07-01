import type { TreatmentGuidance } from '../types';

export const highGradeAvBlockTreatment: TreatmentGuidance = {
  conditionId: 'high_grade_av_block',
  conditionName: 'High-grade AV block',
  aliases: ['Advanced second-degree AV block', 'High-grade second-degree block'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Multiple consecutive atrial impulses fail to conduct, creating high risk of profound bradycardia and complete heart block.',
  immediateActions: ['Apply pacing pads immediately.', 'Assess hemodynamic stability and reversible causes.'],
  stableManagement: ['Urgent pacing-capable clinician review even if currently stable.', 'Avoid outpatient-only management.'],
  unstableManagement: ['Immediate transcutaneous pacing for hypoperfusion.', 'Prepare transvenous pacing if persistent or recurrent.'],
  medications: [
    {
      name: 'Epinephrine or dopamine infusion',
      role: 'Bridge to pacing when local bradycardia protocol supports use.',
      dose: 'Verify local protocol.',
      route: 'IV infusion',
      cautions: ['Bridge only; do not delay pacing.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blocking agents', reason: 'Can worsen conduction failure.', dangerLevel: 'contraindicated' },
    { therapy: 'Delayed pacing preparation', reason: 'High-grade block may deteriorate abruptly.', dangerLevel: 'avoid' },
  ],
  procedures: ['Transcutaneous pacing', 'Transvenous pacing', 'Permanent pacemaker if irreversible.'],
  monitoring: ['Continuous telemetry, frequent perfusion checks, pacing/defibrillation readiness.'],
  reversibleCauses: ['Acute MI', 'Drug toxicity', 'Hyperkalemia', 'Myocarditis', 'Post-procedure conduction injury'],
  consultTriggers: ['All high-grade AV block patterns warrant urgent cardiology review.'],
  disposition: ['Emergency/inpatient setting with pacing capability.'],
  redFlags: ['Very slow ventricular rate', 'Syncope', 'Hypotension', 'Wide QRS', 'Ischemic symptoms'],
  patientEducation: ['This rhythm may not deliver enough beats to the body and needs urgent monitored care.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

