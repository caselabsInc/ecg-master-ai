import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, textIncludes } from './supraventricularRhythmHelpers';

export const sinusArrhythmiaRule: DiagnosticRule = {
  id: 'sinus-arrhythmia',
  evaluate(report) {
    const ctx = getSupraventricularRhythmContext(report);
    const sinusArrhythmia = ctx.normalSinusP && ctx.strictOneToOne && ctx.normalPr && ctx.narrowQrs && report.heartRate?.regularity === 'irregular' && report.pWave?.morphology !== 'variable' && !report.prInterval?.droppedBeats && (ctx.rhythm === 'sinus_arrhythmia' || textIncludes(report, ['respiratory sinus arrhythmia', 'phasic with respiration', 'sinus arrhythmia']));

    if (sinusArrhythmia) {
      return [createFinding({
        id: 'dx-sinus-arrhythmia',
        label: 'Diagnostic suggestion: Sinus Arrhythmia',
        finding: 'Sinus Arrhythmia pattern suggested, originating from the SA node and likely phasic with respiration when clinically documented.',
        basis: 'Manual sinus arrhythmia rule: irregular R-R/P-P rhythm with uniform upright sinus P waves, strict 1:1 conduction, normal constant PR interval, and QRS <120 ms, excluding variable P-wave morphology and dropped beats.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR regularity: ${formatValue(report.prInterval?.regularity)}`],
      })];
    }

    if (report.heartRate?.regularity === 'irregular' && (report.pWave?.morphology === 'variable' || report.prInterval?.regularity === 'not_constant') && ctx.rhythm === 'sinus_arrhythmia') {
      return [createFinding({
        id: 'exclude-sinus-arrhythmia-variable-p-or-pr',
        label: 'Safety exclusion: Sinus Arrhythmia',
        finding: 'Rhythm is irregular, but PR intervals or P-wave morphology are variable. Re-evaluate for Wandering Atrial Pacemaker or MAT.',
        basis: 'Sinus arrhythmia requires uniform sinus P waves and constant PR intervals despite cyclic rate variation.',
        inputs: [`P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR regularity: ${formatValue(report.prInterval?.regularity)}`],
      })];
    }

    return [];
  },
};
