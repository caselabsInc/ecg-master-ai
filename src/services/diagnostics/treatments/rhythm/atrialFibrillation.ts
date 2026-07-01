import type { TreatmentGuidance } from '../types';

export const atrialFibrillationTreatment: TreatmentGuidance = {
  conditionId: 'atrial_fibrillation',
  conditionName: 'Atrial fibrillation',
  aliases: ['AFib', 'A-fib'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Disorganized atrial activation causing an irregularly irregular ventricular rhythm and thromboembolic risk.',
  immediateActions: ['If hypotension, shock, pulmonary edema, ischemic chest pain, or altered mental status is present, prepare urgent synchronized cardioversion.'],
  stableManagement: ['Control ventricular rate with an appropriate agent when stable.', 'Assess thromboembolic risk and anticoagulation need.', 'Evaluate rhythm-control options and reversible causes.'],
  unstableManagement: ['Immediate synchronized cardioversion for unstable rapid AF.', 'Treat ischemia, heart failure, hypoxia, or sepsis if present.'],
  medications: [
    {
      name: 'Diltiazem',
      role: 'Acute ventricular rate control in stable AF with rapid ventricular response.',
      dose: '0.25 mg/kg IV over 3-5 min, max 20 mg, where supported by local protocol.',
      route: 'IV',
      cautions: ['Avoid in decompensated heart failure, severe bradycardia, and pre-excited AF.'],
      source: 'Harrisons Cardiovascular Medicine, Commonly Used Antiarrhythmic Agents, 2013',
    },
    {
      name: 'Amiodarone',
      role: 'Rhythm control or selected rate-control strategy in structural heart disease/heart failure.',
      dose: 'Verify local protocol.',
      route: 'IV or oral',
      cautions: ['QT prolongation and thyroid, pulmonary, hepatic toxicity.'],
      source: 'Harrisons Cardiovascular Medicine, Atrial Fibrillation, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers in pre-excited AF', reason: 'May accelerate accessory pathway conduction and precipitate ventricular fibrillation.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Pulmonary vein isolation for selected symptomatic recurrent AF failing drug therapy.'],
  monitoring: ['Telemetry for acute rapid AF; assess stroke risk score and anticoagulation monitoring needs.'],
  reversibleCauses: ['Hypertension', 'Heart failure', 'Valvular disease', 'Hypoxia/chronic lung disease', 'Hyperthyroidism', 'Sleep apnea', 'Alcohol intoxication'],
  consultTriggers: ['New-onset AF', 'Refractory rapid ventricular response', 'Pre-excitation/WPW concern', 'Unstable symptoms'],
  disposition: ['Stable, rate-controlled, anticoagulation plan: outpatient/cardiology follow-up.', 'Unstable or uncontrolled rapid AF: inpatient telemetry.'],
  redFlags: ['HR >150 bpm', 'Chest pain', 'Pulmonary edema', 'Syncope', 'Altered mental status', 'Wide irregular tachycardia suggesting pre-excitation'],
  patientEducation: ['The upper chambers are quivering irregularly, which can raise stroke risk; treatment focuses on rate/rhythm and clot prevention.'],
  missingEvidence: ['Source batch did not define strict versus lenient target rate thresholds.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

