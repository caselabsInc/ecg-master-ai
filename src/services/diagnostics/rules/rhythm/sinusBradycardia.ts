import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, hasRetrogradePWave, hasShortPr } from './supraventricularRhythmHelpers';

export const sinusBradycardiaRule: DiagnosticRule = {
  id: 'sinus-bradycardia',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);

    if (ctx.normalSinusP && ctx.strictOneToOne && ctx.normalPr && ctx.narrowQrs && ctx.regular && typeof ctx.rate === 'number' && ctx.rate < 60) {
      findings.push(createFinding({
        id: 'dx-sinus-bradycardia',
        label: 'Diagnostic suggestion: Sinus Bradycardia',
        finding: 'Sinus Bradycardia pattern suggested.',
        basis: 'Manual sinus bradycardia rule: sinus P waves with strict 1:1 conduction, regular rhythm, normal constant PR interval, QRS <120 ms, and rate below 60 bpm.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      if (ctx.rate < 50 && ctx.symptomatic) {
        findings.push(createFinding({
          id: 'alert-symptomatic-sinus-bradycardia',
          label: 'High-priority alert: symptomatic bradycardia',
          finding: 'WARNING: Symptomatic bradycardia detected. Check blood pressure and perfusion. Prepare Atropine 1 mg IV if hemodynamically compromised.',
          basis: 'Sinus bradycardia below 50 bpm with symptoms may compromise perfusion and requires urgent clinical assessment.',
          inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }));
      }
    } else if (typeof ctx.rate === 'number' && ctx.rate < 60 && (report.pWave?.presence === 'absent' || (hasRetrogradePWave(report) && hasShortPr(report)))) {
      findings.push(createFinding({
        id: 'exclude-sinus-bradycardia-junctional-clues',
        label: 'Safety exclusion: Sinus Bradycardia',
        finding: 'Inverted/absent P waves or short PR interval detected. Sinus Bradycardia is excluded; evaluate for junctional escape rhythm.',
        basis: 'Sinus bradycardia requires upright sinus P waves and a normal PR interval.',
        inputs: [`P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`],
      }));
    }

    return findings;
  },
};
