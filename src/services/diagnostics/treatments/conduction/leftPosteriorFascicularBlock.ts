import type { TreatmentGuidance } from '../types';

export const leftPosteriorFascicularBlockTreatment: TreatmentGuidance = {
  conditionId: 'left_posterior_fascicular_block',
  conditionName: 'Left posterior fascicular block',
  aliases: ['LPFB', 'Left posterior hemiblock'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Delay in the left posterior fascicle, typically producing right axis deviation after excluding other causes.',
  immediateActions: ['If new, assess for ischemia or structural disease because isolated LPFB is uncommon.'],
  stableManagement: ['Confirm criteria and exclude right ventricular hypertrophy, PE, lateral MI, and limb lead reversal.'],
  unstableManagement: ['Treat associated ACS, pulmonary embolism, or conduction instability.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Diagnosing LPFB without exclusions', reason: 'Right axis deviation has multiple mimics that alter management.', dangerLevel: 'caution' },
  ],
  procedures: ['Pacing only if associated with symptomatic advanced conduction disease.'],
  monitoring: ['Telemetry if new, symptomatic, ischemic, or combined with RBBB/AV block.'],
  reversibleCauses: ['Ischemia', 'Right ventricular strain mimics', 'Lead reversal', 'Degenerative conduction disease'],
  consultTriggers: ['New LPFB', 'Syncope', 'Chest pain', 'Co-existing RBBB or AV block'],
  disposition: ['Isolated confirmed LPFB: outpatient cardiology follow-up.', 'New/symptomatic LPFB: urgent evaluation.'],
  redFlags: ['Syncope', 'Chest pain', 'Dyspnea/PE concern', 'Bifascicular pattern'],
  patientEducation: ['This is an uncommon conduction delay and should be interpreted with the clinical picture.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

