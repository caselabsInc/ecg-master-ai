import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, pWaveShapeCountAtLeastThree } from './supraventricularRhythmHelpers';

export const wanderingAtrialPacemakerRule: DiagnosticRule = {
  id: 'wandering-atrial-pacemaker',
  evaluate(report) {
    const ctx = getSupraventricularRhythmContext(report);
    const matOrWap = report.pWave?.presence === 'present' &&
      pWaveShapeCountAtLeastThree(report) &&
      report.heartRate?.regularity === 'irregular' &&
      report.prInterval?.regularity === 'not_constant' &&
      ctx.narrowQrs;

    if (matOrWap && (typeof ctx.rate !== 'number' || ctx.rate <= 100)) {
      return [createFinding({
        id: 'dx-wandering-atrial-pacemaker',
        label: 'Diagnostic suggestion: Wandering Atrial Pacemaker (WAP)',
        finding: 'Wandering Atrial Pacemaker (WAP) / Multiform Atrial Rhythm pattern suggested.',
        basis: 'Manual WAP rule: rate <=100 bpm, irregular rhythm, at least three P-wave morphologies, variable PR intervals, and narrow QRS.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR regularity: ${formatValue(report.prInterval?.regularity)}`],
      })];
    }

    return [];
  },
};
