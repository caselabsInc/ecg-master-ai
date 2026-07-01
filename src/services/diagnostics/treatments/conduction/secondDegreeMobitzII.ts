import type { TreatmentGuidance } from '../types';

export const secondDegreeMobitzIITreatment: TreatmentGuidance = {
  conditionId: 'second_degree_av_block_mobitz_ii',
  conditionName: 'Second-degree AV block Mobitz II',
  aliases: ['Mobitz type II', 'Infranodal second-degree AV block'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Sudden dropped QRS complexes with constant conducted PR intervals; usually infranodal and high risk for complete heart block.',
  immediateActions: ['Place pacing pads and ensure pacing-capable review immediately.', 'Assess perfusion, ischemia, medications, and reversible causes.'],
  stableManagement: ['Urgent cardiology/electrophysiology review even if asymptomatic.', 'Plan permanent pacing when not reversible.'],
  unstableManagement: ['Immediate transcutaneous pacing for hypoperfusion.', 'Use chronotropic infusion only as a bridge when pacing is delayed or ineffective.'],
  medications: [
    {
      name: 'Dopamine',
      role: 'Temporary bridge for severe symptomatic bradycardia with hypotension.',
      dose: '2-20 mcg/kg/min IV infusion where supported by local protocol.',
      route: 'IV infusion',
      cautions: ['Can provoke tachyarrhythmias.', 'Increases myocardial oxygen demand.'],
      source: 'Blueprints Medicine, Shock, 2010',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Atropine as definitive therapy', reason: 'Often ineffective in infranodal block and may worsen conduction ratio.', dangerLevel: 'avoid' },
    { therapy: 'AV nodal blocking agents', reason: 'Can precipitate complete heart block or asystole.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Transcutaneous pacing immediately if unstable.', 'Transvenous pacing or permanent pacemaker per specialist pathway.'],
  monitoring: ['Continuous telemetry and defibrillator/pacing readiness.'],
  reversibleCauses: ['Ischemia, especially anterior/anteroseptal MI', 'Drug toxicity', 'Hyperkalemia', 'Myocarditis'],
  consultTriggers: ['All Mobitz II patterns', 'Wide QRS', 'Syncope', 'Ischemic symptoms'],
  disposition: ['Emergency department or inpatient telemetry with pacing capability.'],
  redFlags: ['Syncope', 'Hypotension', 'Wide QRS', 'Anterior ischemia', 'Progression to complete heart block'],
  patientEducation: ['This block can suddenly worsen, so urgent monitoring and pacing-capable care are important even if symptoms are mild.'],
  missingEvidence: ['Specific bridge therapy varies by local bradycardia protocol and pacing availability.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

