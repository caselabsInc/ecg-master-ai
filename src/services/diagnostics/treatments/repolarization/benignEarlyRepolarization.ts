import type { TreatmentGuidance } from '../types';

export const benignEarlyRepolarizationTreatment: TreatmentGuidance = {
  conditionId: 'benign_early_repolarization',
  conditionName: 'Benign early repolarization',
  aliases: ['BER pattern', 'Normal variant ST elevation', 'J-point elevation pattern', 'Early repolarization pattern'],
  clinicalPriority: 'normal_variant',
  briefClinicalMeaning: 'A common normal variant with stable concave J-point/ST elevation and terminal QRS notching or slurring, often seen in young healthy adults and athletes.',
  immediateActions: ['No acute treatment is needed for incidentally discovered asymptomatic BER.', 'If chest pain, dyspnea, syncope, reciprocal ST depression, or dynamic ST evolution is present, evaluate for ACS, pericarditis, or malignant early repolarization syndrome.'],
  stableManagement: ['Reassure asymptomatic patients and avoid unnecessary restrictions.', 'Compare with prior ECGs when available and document stability of the pattern.'],
  unstableManagement: ['BER pattern with unexplained syncope or family history of early sudden death warrants telemetry and electrophysiology/cardiology evaluation.'],
  medications: [
    { name: 'None', role: 'No medication is indicated for isolated benign early repolarization.', dose: 'Not applicable.', route: 'Not applicable.' },
  ],
  avoidOrContraindications: [
    { therapy: 'Unnecessary anti-ischemic or antiarrhythmic therapy', reason: 'Asymptomatic BER is not myocardial injury or a primary arrhythmia.', dangerLevel: 'avoid' },
    { therapy: 'Thrombolysis based on concave ST elevation alone', reason: 'BER can mimic STEMI; treatment decisions must consider symptoms, reciprocal changes, and serial evolution.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Transthoracic echocardiography only if LVH, structural disease, or symptoms raise concern.', 'Serial ECG/troponins when ACS symptoms are present.'],
  monitoring: ['Routine outpatient follow-up if asymptomatic.', 'Telemetry if syncope, palpitations, or high-risk family history is present.'],
  reversibleCauses: ['Athletic conditioning', 'High vagal tone', 'Young age', 'Baseline normal variant'],
  consultTriggers: ['Unexplained syncope', 'Family history of sudden cardiac death under age 45', 'Dynamic ST changes', 'Horizontal/convex ST elevation or reciprocal ST depression'],
  disposition: ['Asymptomatic stable BER: reassurance and outpatient follow-up.', 'BER pattern with syncope, chest pain, or malignant features: ED/cardiology evaluation.'],
  redFlags: ['Syncope', 'Chest pain', 'Reciprocal ST depression', 'Dynamic ECG evolution', 'Horizontal or convex ST elevation'],
  patientEducation: ['This ECG pattern is usually a harmless normal variant. New fainting, chest pain, or shortness of breath should still be evaluated urgently.'],
  missingEvidence: ['Genetic and ECG markers that reliably separate benign early repolarization from rare malignant early repolarization syndrome remain limited.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
