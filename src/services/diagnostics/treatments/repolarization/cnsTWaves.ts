import type { TreatmentGuidance } from '../types';

export const cnsTWavesTreatment: TreatmentGuidance = {
  conditionId: 'cns_t_waves',
  conditionName: 'CNS T-wave pattern',
  aliases: ['Cerebral T waves', 'Neurogenic T waves', 'CVA T waves'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Deep, broad, symmetric T-wave inversion with QT prolongation caused by acute intracranial pathology such as subarachnoid hemorrhage, stroke, traumatic brain injury, or raised intracranial pressure.',
  immediateActions: ['Perform urgent neurologic assessment and obtain non-contrast head CT when neurologic symptoms, thunderclap headache, syncope, or altered mental status are present.', 'Place on telemetry because QT prolongation can predispose to ventricular arrhythmia.'],
  stableManagement: ['Treat the underlying neurologic disorder; ECG changes often improve as intracranial pathology stabilizes.', 'Avoid assuming the T waves are primary ACS without neurologic context assessment.'],
  unstableManagement: ['Cushing reflex, deteriorating mental status, or focal neurologic emergency requires urgent neurocritical care/neurosurgical management.'],
  medications: [
    { name: 'None for CNS T waves themselves', role: 'Medication management targets the intracranial process and QT risk factors.', dose: 'Not applicable.', route: 'Not applicable.' },
  ],
  avoidOrContraindications: [
    { therapy: 'Thrombolytics or therapeutic heparin based solely on T-wave inversion', reason: 'Neurogenic T waves may reflect intracranial hemorrhage; anticoagulation/fibrinolysis can be catastrophic if bleeding is present.', dangerLevel: 'contraindicated' },
    { therapy: 'QT-prolonging medications', reason: 'Baseline QT prolongation raises torsades risk.', dangerLevel: 'avoid' },
  ],
  procedures: ['Urgent non-contrast head CT when neurologic symptoms are present.', 'Serial ECG/QTc monitoring.', 'Neurosurgical or neurocritical care intervention as indicated.'],
  monitoring: ['Telemetry.', 'Neurologic observations.', 'QTc and electrolytes, especially potassium and magnesium.'],
  reversibleCauses: ['Subarachnoid hemorrhage', 'Intracranial hemorrhage', 'Ischemic stroke', 'Traumatic brain injury', 'Raised intracranial pressure', 'Meningitis/encephalitis'],
  consultTriggers: ['Thunderclap headache', 'Altered mental status', 'Focal neurologic deficit', 'QTc > 500 ms', 'Cushing reflex'],
  disposition: ['CNS T waves with neurologic symptoms: urgent ED/neuro-ICU evaluation.', 'Incidental pattern without symptoms: clinician-directed cardiac and neurologic assessment.'],
  redFlags: ['Thunderclap headache', 'Cushing reflex', 'Coma or confusion', 'Unilateral pupil dilation', 'QTc > 550 ms'],
  patientEducation: ['These ECG changes can come from stress or pressure in the brain, so neurologic evaluation may be more urgent than heart treatment.'],
  missingEvidence: ['Evidence for preventive cardiac drugs in neurogenic T-wave patterns is limited and context-specific.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
