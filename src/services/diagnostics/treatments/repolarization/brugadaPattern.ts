import type { TreatmentGuidance } from '../types';

export const brugadaPatternTreatment: TreatmentGuidance = {
  conditionId: 'brugada_pattern',
  conditionName: 'Brugada pattern',
  aliases: ['Brugada syndrome', 'Type 1 Brugada pattern', 'Right precordial coved ST elevation', 'SUDS pattern'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'A right-precordial channelopathy pattern with pseudo-RBBB morphology and coved or saddleback ST elevation in V1-V3, associated with polymorphic VT/VF risk, especially with fever or sodium-channel blockers.',
  immediateActions: ['Place symptomatic or Type 1 Brugada patients on telemetry with defibrillator availability.', 'Treat fever promptly and review medications for sodium-channel blockers or other Brugada-provoking drugs.'],
  stableManagement: ['Educate on fever control, drug avoidance, and family history screening.', 'Arrange electrophysiology/cardiology risk stratification, especially for spontaneous Type 1 pattern.'],
  unstableManagement: ['Defibrillate VF/pulseless VT immediately.', 'For recurrent ventricular arrhythmias/electrical storm, use specialist-guided isoproterenol and urgent EP/cardiology management.'],
  medications: [
    { name: 'Isoproterenol', role: 'Specialist-guided acute suppression of recurrent ventricular arrhythmias/electrical storm in Brugada syndrome.', dose: 'Verify local protocol.', route: 'IV infusion', cautions: ['Tachycardia', 'Ischemia', 'Hypotension'] },
    { name: 'Quinidine', role: 'Specialist-guided longer-term arrhythmia suppression when ICD is not available/appropriate or for recurrent shocks.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['QT prolongation', 'Torsades risk', 'GI adverse effects'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Sodium-channel blockers', reason: 'Flecainide, propafenone, procainamide, and related drugs can unmask/worsen Brugada and trigger VF.', dangerLevel: 'contraindicated' },
    { therapy: 'Untreated fever', reason: 'Fever can worsen sodium-channel dysfunction and precipitate ventricular arrhythmias.', dangerLevel: 'avoid' },
  ],
  procedures: ['ICD evaluation for spontaneous Type 1 pattern with syncope, aborted sudden death, or documented ventricular arrhythmia.', 'Family screening/genetic counseling where available.'],
  monitoring: ['Telemetry for symptomatic patients or fever with Brugada pattern.', 'Home fever plan and medication avoidance list.'],
  reversibleCauses: ['Fever', 'Sodium-channel blocking drugs', 'Electrolyte abnormalities', 'Alcohol excess or large meals', 'High vagal tone during sleep/rest'],
  consultTriggers: ['Type 1 coved pattern', 'Syncope or nocturnal agonal respirations', 'Family history of sudden death', 'Palpitations or ventricular ectopy'],
  disposition: ['Asymptomatic incidental pattern: outpatient EP/cardiology follow-up and education.', 'Syncope, fever with Type 1 pattern, or ventricular arrhythmia: admit with telemetry/ICU as appropriate.'],
  redFlags: ['Type 1 coved ST elevation >= 2 mm in V1-V3', 'Syncope', 'Nocturnal agonal breathing', 'Family sudden death', 'Fever'],
  patientEducation: ['This pattern can make dangerous rhythms more likely under triggers such as fever or certain medicines. Treat fever early and avoid listed medications.'],
  missingEvidence: ['Risk stratification for asymptomatic non-Type 1 Brugada patterns remains individualized.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
