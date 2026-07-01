import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, hasRetrogradePWave, hasShortPr } from './supraventricularRhythmHelpers';

export const junctionalRhythmRule: DiagnosticRule = {
  id: 'junctional-rhythm',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const junctionalP = report.pWave?.presence === 'absent' || hasRetrogradePWave(report);
    const junctionalPr = report.pWave?.presence === 'absent' || report.rhythm?.pQrsRelationship === 'p_after_qrs' || hasShortPr(report);

    if (ctx.regular && junctionalP && junctionalPr && ctx.narrowQrs && typeof ctx.rate === 'number' && ctx.rate <= 100) {
      const label = ctx.rate < 40 ? 'Junctional Bradycardia' : ctx.rate <= 60 ? 'Junctional Escape Rhythm' : 'Accelerated Junctional Rhythm';
      findings.push(createFinding({
        id: 'dx-junctional-rhythm',
        label: `Diagnostic suggestion: ${label}`,
        finding: `${label} pattern suggested.`,
        basis: 'Manual junctional rhythm rule: regular rhythm with absent/hidden or retrograde inverted P waves, absent or short PR interval, narrow QRS, and junctional escape/accelerated rate range.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      if (ctx.rate < 40 && ctx.symptomatic) {
        findings.push(createFinding({
          id: 'alert-slow-junctional-rhythm',
          label: 'High-priority alert: slow Junctional Rhythm',
          finding: 'WARNING: Slow Junctional Rhythm detected. Monitor hemodynamic parameters closely. Do NOT suppress this backup junctional pacemaker.',
          basis: 'A slow junctional escape rhythm may be a life-saving backup pacemaker when the SA node fails or slows.',
          inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }));
      }
    } else if (report.pWave?.morphology === 'normal' && ctx.normalPr && ctx.rhythm === 'junctional') {
      findings.push(createFinding({
        id: 'exclude-junctional-upright-p-wave',
        label: 'Safety exclusion: Junctional Rhythm',
        finding: 'Upright sinus P wave detected with normal PR interval. Junctional rhythm is ruled out.',
        basis: 'Junctional rhythm requires retrograde/absent P waves or short/absent PR interval.',
        inputs: [`P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`],
      }));
    }

    return findings;
  },
};
