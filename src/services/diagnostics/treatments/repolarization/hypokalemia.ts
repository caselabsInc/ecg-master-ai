import type { TreatmentGuidance } from '../types';

export const hypokalemiaTreatment: TreatmentGuidance = {
  conditionId: 'hypokalemia',
  conditionName: 'Hypokalemia ECG changes',
  aliases: ['Hypokalemia', 'Potassium deficiency', 'Prominent U waves'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Low serum potassium prolonging repolarization, often causing ST depression, flattened T waves, prominent U waves, QT/QU prolongation, ectopy, and torsades risk.',
  immediateActions: ['Place symptomatic patients or patients with ECG changes on telemetry.', 'Check serum potassium, magnesium, renal function, and medication causes urgently.'],
  stableManagement: ['Use oral potassium replacement for mild/moderate stable hypokalemia when tolerated.', 'Correct hypomagnesemia and stop potassium-wasting contributors when possible.'],
  unstableManagement: ['Use slow IV potassium under continuous ECG monitoring for severe hypokalemia, arrhythmias, marked U waves, or inability to take oral therapy; give magnesium when QT prolongation or torsades risk exists.'],
  medications: [
    { name: 'Potassium chloride', role: 'Potassium repletion; oral route preferred when stable, IV for severe/symptomatic cases.', dose: 'Verify local protocol.', route: 'Oral or IV', cautions: ['Never give IV push/bolus.', 'Renal impairment', 'Peripheral IV pain/phlebitis.'] },
    { name: 'Magnesium sulfate', role: 'Corrects coexisting hypomagnesemia and reduces torsades risk.', dose: 'Verify local protocol.', route: 'IV', cautions: ['Renal impairment', 'Monitor reflexes/respiratory status for toxicity.'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Rapid IV potassium push', reason: 'Can cause fatal hyperkalemic arrest.', dangerLevel: 'contraindicated' },
    { therapy: 'QT-prolonging drugs during active hypokalemia', reason: 'Further increases torsades risk.', dangerLevel: 'contraindicated' },
    { therapy: 'Potassium-wasting diuretics without reassessment', reason: 'Can perpetuate or worsen hypokalemia.', dangerLevel: 'avoid' },
  ],
  procedures: ['Overdrive pacing for refractory pause-dependent torsades when magnesium/electrolyte correction is insufficient.'],
  monitoring: ['Telemetry during severe hypokalemia or IV repletion.', 'Serial potassium and magnesium.', 'Repeat ECG for QT/QU and U-wave resolution.'],
  reversibleCauses: ['Loop/thiazide diuretics', 'Vomiting/diarrhea', 'Poor intake', 'Hyperaldosteronism', 'Refeeding syndrome', 'Metabolic alkalosis', 'Hypomagnesemia'],
  consultTriggers: ['K < 2.5 mEq/L', 'Prominent U waves with prolonged QT/QU', 'Ventricular ectopy or torsades', 'Refractory hypokalemia despite replacement'],
  disposition: ['Mild hypokalemia without ECG changes: outpatient or ward replacement per protocol.', 'Severe hypokalemia, ECG changes, or arrhythmia: telemetry/ICU depending on instability.'],
  redFlags: ['QT/QU prolongation', 'Prominent U waves', 'PVCs or VT runs', 'Severe weakness', 'K < 2.5 mEq/L'],
  patientEducation: ['Low potassium can make the heart electrically irritable. Replacement must be controlled and monitored, especially through an IV.'],
  missingEvidence: ['Replacement rates and targets vary by renal function, magnesium status, and local protocol.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
