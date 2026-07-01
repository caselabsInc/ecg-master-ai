import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasAtrialFlutterPattern } from './atrialFlutter';
import { getSupraventricularRhythmContext, isWideQrs } from './supraventricularRhythmHelpers';

export const avnrtRule: DiagnosticRule = {
  id: 'avnrt',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const avnrt = typeof ctx.rate === 'number' &&
      ctx.rate >= 150 &&
      ctx.rate <= 250 &&
      ctx.regular &&
      ctx.narrowQrs &&
      (report.pWave?.presence === 'absent' || report.pWave?.morphology === 'retrograde' || report.rhythm?.pQrsRelationship === 'p_after_qrs') &&
      !hasAtrialFlutterPattern(report);

    if (avnrt) {
      findings.push(createFinding({
        id: 'dx-avnrt',
        label: 'Diagnostic suggestion: Atrioventricular Nodal Reentrant Tachycardia (AVNRT)',
        finding: 'Atrioventricular Nodal Reentrant Tachycardia (AVNRT) pattern suggested.',
        basis: 'Manual AVNRT rule: rate 150-250 bpm, very regular narrow-complex tachycardia, hidden P waves or immediate retrograde inverted P waves, and unmeasurable/short RP relationship.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `P waves: ${formatValue(report.pWave?.presence)}`, `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      findings.push(createFinding({
        id: 'alert-avnrt',
        label: 'High-priority alert: AVNRT',
        finding: 'WARNING: AVNRT detected. If stable, attempt vagal maneuvers; if refractory, prepare Adenosine 6 mg rapid IV push. If unstable, perform immediate synchronized cardioversion.',
        basis: 'Regular narrow-complex SVT may require urgent rate termination depending on stability.',
        inputs: [`Unstable/symptomatic context: ${formatValue(ctx.symptomatic)}`],
      }));
    } else if (typeof ctx.rate === 'number' && ctx.rate >= 150 && isWideQrs(report) && (report.pWave?.presence === 'absent' || report.pWave?.morphology === 'retrograde')) {
      findings.push(createFinding({
        id: 'exclude-avnrt-wide-qrs',
        label: 'Safety exclusion: AVNRT',
        finding: 'QRS complex is wide. AVNRT is excluded unless a known pre-existing bundle branch block is present; manage as Wide-Complex Tachycardia.',
        basis: 'AVNRT is typically narrow-complex; wide-complex tachycardia must be treated conservatively as VT/WCT until proven otherwise.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
    }

    return findings;
  },
};
