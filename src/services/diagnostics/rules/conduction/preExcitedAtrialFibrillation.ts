import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getPreExcitationInputs, textIncludes } from './preExcitationHelpers';

export const preExcitedAtrialFibrillationRule: DiagnosticRule = {
  id: 'pre-excited-atrial-fibrillation',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const inputs = getPreExcitationInputs(report);

    if (inputs.preExcitedAf) {
      findings.push(createFinding({
        id: 'dx-pre-excited-atrial-fibrillation',
        label: 'Diagnostic suggestion: Pre-Excited Atrial Fibrillation (AF + WPW)',
        finding: 'Pre-Excited Atrial Fibrillation (Atrial Fibrillation with Wolff-Parkinson-White Syndrome / AF + WPW) pattern suggested.',
        basis: 'Manual pre-excited AF rule: irregularly irregular rapid rhythm, absent true P waves/fibrillatory atrial activity, QRS >=120 ms, and variable/bizarre QRS morphology suggesting changing accessory-pathway conduction.',
        inputs: [
          `Rhythm category: ${formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory)}`,
          `R-R regularity: ${formatValue(report.heartRate?.regularity)}`,
          `Rate: ${formatValue(inputs.bpm)} bpm`,
          `P waves: ${formatValue(report.pWave?.presence)}`,
          `QRS duration: ${formatValue(inputs.qrsMs)} ms`,
          `Variable QRS clues: ${formatValue(report.qrsComplex?.morphology ?? report.qrsComplex?.otherDetails)}`,
        ],
      }));
      findings.push(createFinding({
        id: 'alert-pre-excited-atrial-fibrillation',
        label: 'Critical pre-excitation alert',
        finding: 'CRITICAL EMERGENCY: Pre-Excited Atrial Fibrillation detected. AV nodal blocking drugs (Adenosine, Digoxin, Diltiazem, Verapamil, and Beta-blockers) are strictly CONTRAINDICATED. Prepare for immediate synchronized cardioversion or expert cardiology consultation.',
        basis: 'Pre-excited AF can conduct rapidly down an accessory pathway and degenerate into ventricular fibrillation if AV nodal blockers are used.',
        inputs: [
          `Rate: ${formatValue(inputs.bpm)} bpm`,
          `QRS duration: ${formatValue(inputs.qrsMs)} ms`,
          `Delta/pre-excitation clue: ${formatValue(inputs.deltaWave || textIncludes(report, ['wpw', 'pre-excitation', 'preexcitation']))}`,
        ],
      }));
      return findings;
    }

    if (inputs.irregularRapid && inputs.afib && typeof inputs.qrsMs === 'number' && inputs.qrsMs < 110) {
      findings.push(createFinding({
        id: 'exclude-pre-excited-af-narrow-qrs',
        label: 'Safety exclusion: Pre-Excited Atrial Fibrillation',
        finding: 'Irregular narrow-complex rhythm detected. Pre-excited AFib is ruled out; manage as standard atrial fibrillation unless other accessory-pathway evidence is documented.',
        basis: 'Pre-excited AF requires a markedly wide, varying QRS pattern; narrow uniform QRS favors standard AF with rapid ventricular response.',
        inputs: [`Rate: ${formatValue(inputs.bpm)} bpm`, `QRS duration: ${formatValue(inputs.qrsMs)} ms`],
      }));
    }

    return findings;
  },
};
