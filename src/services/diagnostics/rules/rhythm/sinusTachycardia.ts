import { createFinding, formatValue, hasClinicalKeyword } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext } from './supraventricularRhythmHelpers';

export const sinusTachycardiaRule: DiagnosticRule = {
  id: 'sinus-tachycardia',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);

    if (ctx.normalSinusP && ctx.strictOneToOne && ctx.normalPr && ctx.narrowQrs && ctx.regular && typeof ctx.rate === 'number' && ctx.rate > 100 && ctx.rate <= 180) {
      findings.push(createFinding({
        id: 'dx-sinus-tachycardia',
        label: 'Diagnostic suggestion: Sinus Tachycardia',
        finding: 'Sinus Tachycardia pattern suggested.',
        basis: 'Manual sinus tachycardia rule: rate >100 bpm, regular rhythm, discernible upright Lead II sinus P waves before each QRS, normal constant PR interval, and QRS <120 ms.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`],
      }));
      if (hasClinicalKeyword(report, ['chest pain', 'anterior infarction', 'anterior mi', 'stemi', 'ischemia', 'hypoxia', 'blood loss', 'fever', 'dehydration'])) {
        findings.push(createFinding({
          id: 'alert-sinus-tachycardia-underlying-cause',
          label: 'High-priority alert: Sinus Tachycardia',
          finding: 'WARNING: Sinus Tachycardia detected. Evaluate for underlying causes such as fever, dehydration, hypoxia, or blood loss. If active chest pain is present, notify a physician immediately.',
          basis: 'Sinus tachycardia is usually a physiologic response and should prompt treatment of the underlying cause rather than rhythm suppression.',
          inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }));
      }
    } else if (typeof ctx.rate === 'number' && ctx.rate > 100 && report.pWave?.presence !== 'present' && ctx.narrowQrs) {
      findings.push(createFinding({
        id: 'exclude-sinus-tachycardia-hidden-p-waves',
        label: 'Safety exclusion: Sinus Tachycardia',
        finding: 'No discernible sinus P waves. Suspect SVT or Atrial Flutter rather than Sinus Tachycardia.',
        basis: 'Sinus tachycardia requires discernible upright sinus P waves preceding each QRS.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P waves: ${formatValue(report.pWave?.presence)}`, `P-wave activity: ${formatValue(ctx.pActivity)}`],
      }));
    }

    return findings;
  },
};
