import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasFrequentEctopy, hasNormalOrConductedPr, hasPrematureJunctionalClues, hasRetrogradeP, hasShortPr, isNarrowQrs, isWideQrs, textIncludes, underlyingRhythmLabel } from './ectopyHelpers';

export const prematureJunctionalComplexesRule: DiagnosticRule = {
  id: 'premature-junctional-complexes',
  evaluate(report) {
    const findings = [];
    const ectopy = report.rhythm?.ectopy ?? [];
    const narrowQrs = isNarrowQrs(report);
    const wideQrs = isWideQrs(report);
    const digoxin = textIncludes(report, ['digoxin', 'digitalis', 'dig toxicity', 'digitalis toxicity']);

    if (hasPrematureJunctionalClues(report) || (ectopy.length > 0 && hasRetrogradeP(report) && hasShortPr(report) && narrowQrs)) {
      findings.push(createFinding({
        id: 'dx-premature-junctional-complexes',
        label: 'Diagnostic suggestion: Premature Junctional Complexes (PJCs)',
        finding: `${underlyingRhythmLabel(report)} with Premature Junctional Complexes (PJCs) pattern suggested.`,
        basis: 'Manual PJC rule: premature narrow complex with retrograde inverted P wave before/after QRS or hidden P wave, and short/absent PR interval.',
        inputs: [`Ectopy: ${formatValue(ectopy)}`, `P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }));
      if (digoxin || hasFrequentEctopy(report)) {
        findings.push(createFinding({
          id: 'alert-frequent-pjcs-digoxin',
          label: 'High-priority alert: PJCs',
          finding: 'WARNING: Frequent PJCs or PJC pattern with digoxin context detected. Evaluate for potential digitalis toxicity.',
          basis: 'Frequent junctional ectopy can cause symptoms and may reflect digitalis toxicity.',
          inputs: [`Digoxin context: ${formatValue(digoxin)}`, `Frequent ectopy clues: ${formatValue(hasFrequentEctopy(report))}`],
        }));
      }
    } else if ((hasPrematureJunctionalClues(report) || hasRetrogradeP(report)) && report.pWave?.morphology === 'normal' && hasNormalOrConductedPr(report)) {
      findings.push(createFinding({
        id: 'exclude-pjc-upright-p-normal-pr',
        label: 'Safety exclusion: PJC',
        finding: 'Upright P wave with normal PR interval detected. PJC is excluded; evaluate for PAC.',
        basis: 'PJC requires retrograde/hidden P-wave activation or short PR interval.',
        inputs: [`P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`],
      }));
    } else if ((hasPrematureJunctionalClues(report) || hasRetrogradeP(report)) && wideQrs) {
      findings.push(createFinding({
        id: 'exclude-pjc-wide-qrs',
        label: 'Safety exclusion: PJC',
        finding: 'Wide premature QRS detected. PJC is excluded; evaluate for PVC or wide-complex rhythm.',
        basis: 'PJC normally conducts through the His-Purkinje system and should be narrow unless a separate conduction delay is documented.',
        inputs: [`QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }));
    }

    return findings;
  },
};
