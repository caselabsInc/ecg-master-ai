import type { TreatmentGuidance } from '../types';

export const ventricularEctopyRunsTreatment: TreatmentGuidance = {
  conditionId: 'ventricular_ectopy_runs',
  conditionName: 'Ventricular ectopy runs',
  aliases: ['Nonsustained VT', 'Ventricular runs', 'Run of PVCs'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Consecutive ventricular beats lasting less than sustained VT duration, indicating increased ventricular irritability.',
  immediateActions: ['Assess stability, duration, symptoms, ischemia, and structural heart disease risk.'],
  stableManagement: ['Correct electrolytes, evaluate for ischemia and LV dysfunction, and consider beta blocker if symptomatic or structural disease is present.'],
  unstableManagement: ['If sustained, symptomatic, or hemodynamically compromising, manage as ventricular tachycardia.'],
  medications: [
    {
      name: 'Beta blocker',
      role: 'Symptom/risk reduction in selected nonsustained ventricular runs, especially ischemic or cardiomyopathic substrate.',
      dose: 'Verify local protocol.',
      route: 'Oral or IV',
      cautions: ['Hypotension', 'Bradycardia', 'Bronchospasm'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Class IC drugs in structural heart disease', reason: 'Can provoke lethal ventricular arrhythmias in scarred myocardium.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Echocardiogram and ambulatory monitoring; ICD risk evaluation when LV dysfunction or prior MI is present.'],
  monitoring: ['Telemetry for acute symptomatic runs; Holter/event monitor for burden assessment.'],
  reversibleCauses: ['Ischemia', 'Hypokalemia', 'Hypomagnesemia', 'Hypoxia', 'Stimulants', 'Drug toxicity'],
  consultTriggers: ['Syncope', 'Prior MI', 'Reduced EF', 'Frequent runs', 'Sustained VT transition'],
  disposition: ['Low-risk asymptomatic nonsustained runs: outpatient cardiology evaluation.', 'Symptoms, ischemia, low EF, or sustained runs: inpatient monitoring.'],
  redFlags: ['Syncope', 'Chest pain', 'Reduced EF', 'Runs lasting longer or becoming sustained', 'Family history of sudden death'],
  patientEducation: ['Short bursts of lower-chamber beats may be benign or risky depending on heart structure, symptoms, and triggers.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

