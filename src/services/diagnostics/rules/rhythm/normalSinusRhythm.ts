import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext } from './supraventricularRhythmHelpers';

export const normalSinusRhythmRule: DiagnosticRule = {
  id: 'normal-sinus-rhythm',
  evaluate(report) {
    const ctx = getSupraventricularRhythmContext(report);
    if (ctx.normalSinusP && ctx.strictOneToOne && ctx.normalPr && ctx.narrowQrs && ctx.regular && typeof ctx.rate === 'number' && ctx.rate >= 60 && ctx.rate <= 100 && !report.rhythm?.ectopy?.length) {
      return [createFinding({
        id: 'dx-normal-sinus-rhythm',
        label: 'Diagnostic suggestion: Normal Sinus Rhythm (NSR)',
        finding: 'Normal Sinus Rhythm (NSR) pattern suggested.',
        basis: 'Manual NSR rule: adult rate 60-100 bpm, regular P-P/R-R rhythm, normal upright Lead II sinus P waves, strict 1:1 P-QRS relationship, constant PR 120-200 ms, and QRS <120 ms.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `P-wave axis Lead II: ${formatValue(report.axis?.pWaveLeadII)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      })];
    }

    if ((ctx.rhythm === 'sinus' || ctx.rhythm === 'sinus_bradycardia' || ctx.rhythm === 'sinus_tachycardia') && (report.prInterval?.prCategory === 'first_degree' || report.rhythm?.ectopy?.length)) {
      return [createFinding({
        id: 'exclude-isolated-nsr',
        label: 'Safety exclusion: isolated NSR',
        finding: 'Conduction delay, ectopy, or rate abnormality detected. Isolated NSR is excluded; report the sinus rhythm with the co-existing condition.',
        basis: 'NSR must be cleanly isolated. Prolonged PR is first-degree AV block, and premature ectopy should be appended to the sinus rhythm rather than hidden under NSR.',
        inputs: [`PR category: ${formatValue(report.prInterval?.prCategory)}`, `Ectopy: ${formatValue(report.rhythm?.ectopy)}`, `Rhythm category: ${formatValue(ctx.rhythm)}`],
      })];
    }

    return [];
  },
};
