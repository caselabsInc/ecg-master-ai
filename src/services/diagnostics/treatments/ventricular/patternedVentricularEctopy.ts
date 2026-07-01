import type { TreatmentGuidance } from '../types';

export const patternedVentricularEctopyTreatment: TreatmentGuidance = {
  conditionId: 'patterned_ventricular_ectopy',
  conditionName: 'Patterned ventricular ectopy',
  aliases: ['Ventricular bigeminy', 'Ventricular trigeminy', 'Ventricular quadrigeminy'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'PVCs repeating in a fixed pattern with normal beats, such as every second or third beat.',
  immediateActions: ['Assess symptoms, blood pressure, pulse deficit, ischemia, and digoxin exposure.'],
  stableManagement: ['Reassure if asymptomatic with normal structural heart assessment.', 'Review digoxin and obtain level if applicable.', 'Correct electrolytes and reduce triggers.'],
  unstableManagement: ['If bigeminy causes hypotension or severe symptoms, use monitored care and consider beta blocker when appropriate.'],
  medications: [
    {
      name: 'Metoprolol',
      role: 'First-line suppression for symptomatic patterned ventricular ectopy.',
      dose: 'Verify local protocol.',
      route: 'Oral or IV',
      cautions: ['Bradycardia', 'Heart block', 'Hypotension', 'Bronchospasm'],
      source: 'Medstudy IM Core Curriculum, Ventricular Arrhythmias, 2015',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Verapamil/diltiazem with beta blocker', reason: 'Combined nodal and negative inotropic effects can cause bradycardia, heart block, or shock.', dangerLevel: 'avoid' },
  ],
  procedures: ['Echocardiogram or ambulatory monitoring if frequent burden or cardiomyopathy concern.'],
  monitoring: ['Telemetry or Holter to quantify ectopic burden and pulse deficit.'],
  reversibleCauses: ['Digoxin toxicity', 'Hypokalemia', 'Hypomagnesemia', 'Stimulants', 'Ischemia'],
  consultTriggers: ['Symptoms', 'High ectopy burden', 'LV dysfunction', 'Suspected digoxin toxicity'],
  disposition: ['Asymptomatic normal heart: outpatient follow-up.', 'Symptomatic, toxicologic, ischemic, or LV dysfunction: monitored evaluation.'],
  redFlags: ['Hypotension', 'Chest pain', 'Syncope', 'Digoxin toxicity', 'Frequent bigeminy causing low effective pulse'],
  patientEducation: ['Extra lower-chamber beats are occurring in a repeating pattern; treatment depends on symptoms, heart function, and triggers.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

