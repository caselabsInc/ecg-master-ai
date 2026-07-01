import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, hasDigoxinContext } from './supraventricularRhythmHelpers';

export const atrialTachycardiaRule: DiagnosticRule = {
  id: 'atrial-tachycardia',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const atrialTachycardia = typeof (ctx.atrialRate ?? ctx.rate) === 'number' &&
      (ctx.atrialRate ?? ctx.rate)! >= 101 &&
      (ctx.atrialRate ?? ctx.rate)! <= 250 &&
      ctx.regular &&
      ctx.narrowQrs &&
      report.pWave?.presence === 'present' &&
      ['abnormal', 'inverted', 'biphasic', 'notched', 'peaked'].includes(report.pWave?.morphology ?? '') &&
      ctx.pActivity !== 'flutter_waves';

    if (atrialTachycardia) {
      findings.push(createFinding({
        id: 'dx-atrial-tachycardia',
        label: 'Diagnostic suggestion: Atrial Tachycardia (AT)',
        finding: 'Atrial Tachycardia (AT) pattern suggested.',
        basis: 'Manual atrial tachycardia rule: atrial rate 101-250 bpm, regular atrial rhythm, visible non-sinus P waves, constant conducted PR interval, narrow QRS, and no sawtooth flutter baseline.',
        inputs: [`Atrial/ventricular rate: ${formatValue(ctx.atrialRate ?? ctx.rate)} bpm`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      if (hasDigoxinContext(report)) {
        findings.push(createFinding({
          id: 'alert-atrial-tachycardia-digoxin',
          label: 'High-priority alert: Atrial Tachycardia',
          finding: 'WARNING: Atrial Tachycardia detected with digoxin/digitalis context. Evaluate immediately for digoxin toxicity and check potassium/digoxin levels.',
          basis: 'Atrial tachycardia with block is a classic dangerous manifestation of digitalis excess.',
          inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }));
      }
    } else if (typeof ctx.rate === 'number' && ctx.rate > 100 && ctx.pActivity === 'flutter_waves') {
      findings.push(createFinding({
        id: 'exclude-atrial-tachycardia-flutter-waves',
        label: 'Safety exclusion: Atrial Tachycardia',
        finding: 'Sawtooth flutter waves detected. Diagnose as Atrial Flutter rather than Atrial Tachycardia.',
        basis: 'AT requires discrete P waves with an isoelectric baseline; flutter has continuous sawtooth atrial activity.',
        inputs: [`P-wave activity: ${formatValue(ctx.pActivity)}`],
      }));
    }

    return findings;
  },
};
