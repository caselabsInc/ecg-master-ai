import type { TreatmentGuidance } from '../types';

export const wellensSyndromeTreatment: TreatmentGuidance = {
  conditionId: 'wellens_syndrome',
  conditionName: 'Wellens syndrome',
  aliases: ['Wellens T waves', 'LAD stenosis pattern', 'Anterior MI warning sign'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Pain-free anterior T-wave pattern suggesting critical proximal LAD stenosis and high risk of impending anterior MI.',
  immediateActions: ['Obtain serial ECGs, especially when pain-free.', 'Admit and consult cardiology urgently for coronary angiography.', 'Avoid stress testing.'],
  stableManagement: ['Use ACS medical therapy while awaiting angiography: antiplatelet, anticoagulation, statin, and anti-ischemic therapy per protocol.'],
  unstableManagement: ['If chest pain recurs or anterior STEMI evolves, activate cath lab immediately.'],
  medications: [{ name: 'Aspirin', role: 'Antiplatelet therapy for unstable LAD lesion.', dose: '325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active severe bleeding'] }],
  avoidOrContraindications: [
    { therapy: 'Exercise or pharmacologic stress testing', reason: 'Can precipitate complete LAD occlusion and massive anterior MI.', dangerLevel: 'contraindicated' },
    { therapy: 'Fibrinolytics without active ST elevation', reason: 'Wellens is usually critical subtotal stenosis; urgent angiography is definitive.', dangerLevel: 'avoid' },
  ],
  procedures: ['Urgent coronary angiography and revascularization planning.'],
  monitoring: ['Telemetry and serial ECGs; watch for T-wave pseudonormalization during recurrent pain.'],
  reversibleCauses: ['Proximal LAD atherosclerotic stenosis', 'Coronary spasm'],
  consultTriggers: ['Wellens pattern on pain-free ECG: urgent cardiology/interventional review.'],
  disposition: ['Wellens pattern: inpatient telemetry and urgent angiography, even if currently pain-free.'],
  redFlags: ['Recurrent chest pain', 'T-wave pseudonormalization', 'Dyspnea/rales', 'Frequent ventricular ectopy'],
  patientEducation: ['This pain-free ECG pattern is a warning sign of a severe LAD narrowing, so stress testing is unsafe and angiography is needed.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

