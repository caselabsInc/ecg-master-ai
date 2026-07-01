import type { TreatmentGuidance } from '../types';

export const hyperkalemiaTreatment: TreatmentGuidance = {
  conditionId: 'hyperkalemia',
  conditionName: 'Hyperkalemia ECG changes',
  aliases: ['Hyperkalemia', 'Potassium toxicity', 'High serum potassium'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Elevated serum potassium causing progressive conduction slowing, peaked T waves, PR prolongation, QRS widening, loss of P waves, sine-wave rhythm, and arrest risk.',
  immediateActions: ['Check serum potassium urgently and place on continuous telemetry.', 'If QRS widening, loss of P waves, bradycardia, or sine-wave pattern is present, give IV calcium immediately per protocol, then potassium-shifting and potassium-removal therapy.'],
  stableManagement: ['For mild hyperkalemia with normal ECG, hold potassium supplements and potassium-raising medications and arrange potassium elimination/recheck per protocol.'],
  unstableManagement: ['IV calcium for membrane stabilization, insulin with dextrose and nebulized albuterol for intracellular shift, and urgent dialysis when severe renal failure or refractory hyperkalemia is present.'],
  medications: [
    { name: 'Calcium gluconate or calcium chloride', role: 'Immediate myocardial membrane stabilization for ECG changes; does not lower serum potassium.', dose: 'Verify local protocol.', route: 'IV', cautions: ['Use caution in digoxin toxicity context.'] },
    { name: 'Regular insulin with dextrose', role: 'Rapid intracellular potassium shift.', dose: 'Verify local protocol.', route: 'IV', cautions: ['Monitor for hypoglycemia.'] },
    { name: 'Nebulized albuterol', role: 'Adjunct intracellular potassium shift.', dose: 'Verify local protocol.', route: 'Nebulized', cautions: ['Tachycardia', 'Tremor', 'Variable response.'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Calcium alone as definitive therapy', reason: 'Calcium stabilizes myocardium temporarily but does not remove or lower total body potassium.', dangerLevel: 'contraindicated' },
    { therapy: 'Potassium-raising drugs during active hyperkalemia', reason: 'ACE inhibitors, ARBs, aldosterone antagonists, potassium supplements, and trimethoprim can worsen hyperkalemia.', dangerLevel: 'avoid' },
  ],
  procedures: ['Emergency hemodialysis for refractory hyperkalemia, anuric renal failure, or severe ECG changes not resolving with medical therapy.'],
  monitoring: ['Continuous telemetry.', 'Serial potassium and renal function.', 'Blood glucose monitoring after insulin.'],
  reversibleCauses: ['Acute kidney injury', 'End-stage renal disease', 'Rhabdomyolysis/crush injury', 'Metabolic acidosis', 'Adrenal insufficiency', 'Potassium-sparing drugs'],
  consultTriggers: ['K >= 6.0 mEq/L', 'QRS widening or loss of P waves', 'Sine-wave pattern', 'Oliguric/anuric renal failure', 'Failure to improve after initial therapy'],
  disposition: ['Mild hyperkalemia with normal ECG: local protocol-directed outpatient or ward management.', 'Any hyperkalemic ECG changes or severe potassium elevation: urgent ED/ICU-level monitoring.'],
  redFlags: ['Sine-wave pattern', 'Loss of P waves', 'QRS widening', 'Profound bradycardia', 'Muscle weakness/paralysis'],
  patientEducation: ['High potassium can directly slow the heart electrical system. Treatment protects the heart immediately and then removes or shifts potassium while the cause is corrected.'],
  missingEvidence: ['Bicarbonate benefit is context-dependent and strongest when metabolic acidosis is present.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
