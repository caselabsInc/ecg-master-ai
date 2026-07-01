import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, hasDigoxinContext, hasRetrogradePWave, hasShortPr, isWideQrs } from './supraventricularRhythmHelpers';

export const junctionalTachycardiaRule: DiagnosticRule = {
  id: 'junctional-tachycardia',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const junctionalP = report.pWave?.presence === 'absent' || hasRetrogradePWave(report);
    const junctionalPr = report.pWave?.presence === 'absent' || report.rhythm?.pQrsRelationship === 'p_after_qrs' || hasShortPr(report);

    if (ctx.regular && junctionalP && junctionalPr && ctx.narrowQrs && typeof ctx.rate === 'number' && ctx.rate > 100 && ctx.rate <= 180) {
      findings.push(createFinding({
        id: 'dx-junctional-tachycardia',
        label: 'Diagnostic suggestion: Junctional Tachycardia',
        finding: 'Junctional Tachycardia pattern suggested.',
        basis: 'Manual junctional tachycardia rule: regular rate 101-180 bpm with absent/hidden or retrograde inverted P waves, absent/short PR interval, and narrow QRS.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      findings.push(createFinding({
        id: 'alert-junctional-tachycardia',
        label: 'High-priority alert: Junctional Tachycardia',
        finding: 'WARNING: Junctional Tachycardia detected. Assess for potential digoxin toxicity. Withhold digitalis drugs immediately if toxicity is suspected clinically.',
        basis: 'Junctional tachycardia can compromise output and may reflect digoxin toxicity or enhanced junctional automaticity.',
        inputs: [`Digoxin context: ${formatValue(hasDigoxinContext(report))}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    } else if (typeof ctx.rate === 'number' && ctx.rate > 100 && isWideQrs(report) && junctionalP) {
      findings.push(createFinding({
        id: 'exclude-junctional-tachycardia-wide-qrs',
        label: 'Safety exclusion: Junctional Tachycardia',
        finding: 'Wide QRS complexes detected. Junctional Tachycardia is excluded; evaluate for Ventricular Tachycardia or WCT.',
        basis: 'Junctional tachycardia requires narrow QRS unless an established conduction delay is separately documented.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
    }

    return findings;
  },
};
