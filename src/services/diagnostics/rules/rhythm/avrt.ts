import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, textIncludes } from './supraventricularRhythmHelpers';

export const avrtRule: DiagnosticRule = {
  id: 'avrt',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const avrt = typeof ctx.rate === 'number' &&
      ctx.rate >= 150 &&
      ctx.rate <= 250 &&
      ctx.regular &&
      report.pWave?.morphology === 'retrograde' &&
      report.rhythm?.pQrsRelationship === 'p_after_qrs' &&
      (report.qrsComplex?.deltaWave === true || textIncludes(report, ['wpw', 'accessory pathway', 'bypass tract', 'avrt']));

    if (avrt) {
      findings.push(createFinding({
        id: 'dx-avrt',
        label: 'Diagnostic suggestion: Atrioventricular Reentrant Tachycardia (AVRT)',
        finding: 'Atrioventricular Reentrant Tachycardia (AVRT) / Bypass-Tract SVT pattern suggested.',
        basis: 'Manual AVRT rule: regular 150-250 bpm tachycardia with retrograde P waves after the QRS/ST segment and accessory-pathway/WPW evidence.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`, `Delta wave: ${formatValue(report.qrsComplex?.deltaWave)}`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      findings.push(createFinding({
        id: 'alert-avrt-accessory-pathway',
        label: 'High-priority alert: AVRT',
        finding: 'WARNING: AVRT detected. Check for underlying WPW bypass tract. Avoid AV nodal blockers if pre-excited atrial fibrillation is suspected.',
        basis: 'Accessory pathways can create dangerous pre-excited AF physiology where AV nodal blockers are contraindicated.',
        inputs: [`Delta wave: ${formatValue(report.qrsComplex?.deltaWave)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    } else if (typeof ctx.rate === 'number' && ctx.rate >= 150 && report.heartRate?.regularity === 'irregular' && report.qrsComplex?.deltaWave === true) {
      findings.push(createFinding({
        id: 'exclude-avrt-irregular-rhythm',
        label: 'Safety exclusion: AVRT',
        finding: 'Rhythm is irregular; AFib or Atrial Flutter must be evaluated rather than AVRT.',
        basis: 'AVRT is a regular reentrant tachycardia; irregular accessory-pathway rhythms raise concern for pre-excited AF.',
        inputs: [`Regularity: ${formatValue(report.heartRate?.regularity)}`, `Delta wave: ${formatValue(report.qrsComplex?.deltaWave)}`],
      }));
    }

    return findings;
  },
};
