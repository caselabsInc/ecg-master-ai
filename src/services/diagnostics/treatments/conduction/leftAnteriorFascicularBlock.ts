import type { TreatmentGuidance } from '../types';

export const leftAnteriorFascicularBlockTreatment: TreatmentGuidance = {
  conditionId: 'left_anterior_fascicular_block',
  conditionName: 'Left anterior fascicular block',
  aliases: ['LAFB', 'Left anterior hemiblock'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Delay in the left anterior fascicle, typically causing left axis deviation with compatible QRS morphology.',
  immediateActions: ['If new with ischemic symptoms or syncope, assess for structural/ischemic disease.'],
  stableManagement: ['No acute treatment for isolated asymptomatic LAFB.', 'Compare with prior ECGs and clinical context.'],
  unstableManagement: ['Treat associated ACS, bradyarrhythmia, or structural disease rather than the fascicular block itself.'],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Treating isolated LAFB as a rhythm requiring suppression', reason: 'It is a conduction finding, not a tachyarrhythmia.', dangerLevel: 'avoid' },
  ],
  procedures: ['Pacing only if combined with symptomatic high-grade conduction disease.'],
  monitoring: ['Telemetry if new, symptomatic, or combined with RBBB/AV block.'],
  reversibleCauses: ['Ischemia', 'Hypertensive/structural heart disease', 'Degenerative conduction disease'],
  consultTriggers: ['Syncope', 'New LAFB with chest pain', 'Bifascicular/trifascicular pattern'],
  disposition: ['Isolated asymptomatic LAFB: outpatient follow-up.', 'New symptomatic LAFB: urgent evaluation.'],
  redFlags: ['Syncope', 'Chest pain', 'Co-existing RBBB', 'PR prolongation or higher-grade AV block'],
  patientEducation: ['This is a delay in one branch of the heart’s wiring and usually only needs treatment if linked to symptoms or other disease.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

