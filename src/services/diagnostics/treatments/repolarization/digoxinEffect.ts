import type { TreatmentGuidance } from '../types';

export const digoxinEffectTreatment: TreatmentGuidance = {
  conditionId: 'digoxin_effect',
  conditionName: 'Digoxin effect',
  aliases: ['Digitalis effect', 'Dig dip', 'Scooped ST depression', 'Therapeutic digoxin changes'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Therapeutic digoxin can cause characteristic scooped ST depression and shortened QT; this is expected drug effect, not necessarily toxicity or ischemia.',
  immediateActions: ['Confirm digoxin context and distinguish benign scooped ST depression from ischemic horizontal/downsloping ST depression.', 'Screen for toxicity symptoms, bradyarrhythmias, junctional rhythms, renal dysfunction, and electrolyte abnormalities.'],
  stableManagement: ['If asymptomatic with therapeutic level and normal electrolytes, continue routine monitoring.', 'Check renal function, potassium, magnesium, and drug interactions when clinically indicated.'],
  unstableManagement: ['With suspected toxicity causing hemodynamic compromise, high-grade block, severe bradycardia, ventricular arrhythmia, or hyperkalemia, withhold digoxin and treat urgently with Digoxin Immune Fab per protocol.'],
  medications: [
    { name: 'Digoxin Immune Fab', role: 'Specific antidote for severe digoxin toxicity.', dose: 'Verify local protocol or calculate from level/ingestion.', route: 'IV', cautions: ['Can precipitate worsening heart failure or rapid AF after reversal.'] },
    { name: 'Potassium replacement', role: 'Corrects hypokalemia that worsens digoxin toxicity.', dose: 'Verify local protocol.', route: 'Oral or IV', cautions: ['Avoid inappropriate replacement when hyperkalemia or severe renal failure is present.'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Additional AV nodal blockers before ruling out toxicity', reason: 'Can worsen digoxin-related AV block or bradyarrhythmia.', dangerLevel: 'avoid' },
    { therapy: 'Digoxin/verapamil/beta-blocker use in pre-excited AF', reason: 'Can enhance accessory pathway conduction and precipitate VF.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Temporary pacing for refractory symptomatic bradycardia or high-grade block despite antidote/supportive care.'],
  monitoring: ['Telemetry for suspected toxicity.', 'Serum digoxin level, potassium, magnesium, renal function, and serial ECGs.'],
  reversibleCauses: ['Renal impairment', 'Hypokalemia', 'Hypomagnesemia', 'Drug interactions such as amiodarone, verapamil, or quinidine', 'Hypoxia'],
  consultTriggers: ['Visual halos, severe nausea/vomiting, or confusion on digoxin.', 'HR < 40 bpm', 'High-grade AV block', 'Junctional tachycardia', 'Bidirectional VT', 'Hyperkalemia'],
  disposition: ['Asymptomatic therapeutic digoxin effect: outpatient follow-up.', 'Suspected toxicity or unstable rhythm: telemetry/ICU depending on severity.'],
  redFlags: ['Profound bradycardia', 'Sinus arrest', 'High-grade AV block', 'Atrial tachycardia with block', 'Junctional tachycardia', 'Yellow-green visual halos'],
  patientEducation: ['This ECG shape can be an expected effect of digoxin, but toxicity can occur if the level rises, especially with dehydration, kidney problems, or low potassium.'],
  missingEvidence: ['Fab dosing depends on acuity, serum level timing, and local antidote protocol.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
