import { createFinding, formatValue, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getPreExcitationInputs } from './preExcitationHelpers';

export const wolffParkinsonWhiteRule: DiagnosticRule = {
  id: 'wolff-parkinson-white',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const inputs = getPreExcitationInputs(report);

    if (!isSupraventricularConduction(report) && !inputs.deltaWave && !inputs.preExcitedAf) return findings;

    if (inputs.shortPr && inputs.deltaWave && inputs.qrsWideForWpw) {
      findings.push(createFinding({
        id: 'dx-wolff-parkinson-white',
        label: 'Diagnostic suggestion: WPW / pre-excitation',
        finding: 'Wolff-Parkinson-White (WPW) pre-excitation pattern suggested by short PR interval, delta wave, and widened QRS.',
        basis: 'Manual pre-excitation rule: classic WPW triad is PR <120 ms, visible delta wave, and QRS >=110 ms from slurred early ventricular activation.',
        inputs: [
          `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`,
          `PR category: ${formatValue(report.prInterval?.prCategory)}`,
          `Delta wave: ${formatValue(report.qrsComplex?.deltaWave)}`,
          `QRS duration: ${formatValue(inputs.qrsMs)} ms`,
        ],
      }));

      if ((inputs.afib || inputs.irregularRapid) && !inputs.preExcitedAf) {
        findings.push(createFinding({
          id: 'alert-pre-excited-atrial-fibrillation',
          label: 'Critical pre-excitation alert',
          finding: 'CRITICAL EMERGENCY: Pre-excited atrial fibrillation suspected. AV nodal blocking drugs are contraindicated; prepare for immediate synchronized cardioversion review.',
          basis: 'WPW with rapid irregular rhythm may conduct dangerously over the accessory pathway and degenerate to ventricular fibrillation if AV nodal blockers are used.',
          inputs: [
            `Rhythm category: ${formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory)}`,
            `R-R regularity: ${formatValue(report.heartRate?.regularity)}`,
            `Rate: ${formatValue(inputs.bpm)} bpm`,
          ],
        }));
      }
    } else if (inputs.shortPr && !inputs.deltaWave) {
      findings.push(createFinding({
        id: 'exclude-wpw-no-delta-wave',
        label: 'Safety exclusion: WPW criteria incomplete',
        finding: 'Short PR interval is present, but ventricular pre-excitation/WPW is not diagnosed without a delta wave.',
        basis: 'WPW requires a delta wave; short PR with narrow QRS and no delta wave may be a normal variant or other short-PR pattern.',
        inputs: [
          `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`,
          `Delta wave: ${formatValue(report.qrsComplex?.deltaWave)}`,
          `QRS duration: ${formatValue(inputs.qrsMs)} ms`,
        ],
      }));
    }

    return findings;
  },
};
