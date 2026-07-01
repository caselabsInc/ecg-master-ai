import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getQtcMs, hasClinicalAny, hasProlongedPr, isNarrowQrs, rate, stDepressionLeads, textIncludes } from './helpers';

export const digoxinEffectRule: DiagnosticRule = {
  id: 'digoxin-effect',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const bpm = rate(report);
    const qtcMs = getQtcMs(report);
    const digoxinContext = hasClinicalAny(report, ['digoxin', 'digitalis', 'lanoxin', 'digibind', 'digoxin level']);
    const scoopedStd = report.stSegment?.status === 'depressed' &&
      (report.stSegment?.morphology === 'saddleback' || textIncludes(report, ['scooped', 'dig dip', 'digitalis effect', 'salvador dali', 'slurred st']));
    const shortenedQt = report.qtInterval?.qtRisk === 'short' || (typeof qtcMs === 'number' && qtcMs < 350);
    const toxicityClues = (typeof bpm === 'number' && bpm < 40) ||
      report.rhythm?.rhythmCategory === 'junctional' ||
      report.rhythm?.derivedRhythmCategory === 'junctional' ||
      report.rhythm?.ectopy?.includes('bigeminy') ||
      report.rhythm?.ectopy?.includes('trigeminy') ||
      textIncludes(report, ['visual halos', 'yellow halos', 'green halos', 'nausea', 'vomiting', 'anorexia', 'bidirectional vt', 'digoxin toxicity']);

    if (report.stSegment?.status === 'depressed' && (report.stSegment?.morphology === 'horizontal' || report.stSegment?.morphology === 'downsloping') && !shortenedQt && digoxinContext) {
      findings.push(createFinding({
        id: 'exclude-digoxin-effect-ischemic-st-depression',
        label: 'Safety exclusion: Digoxin effect',
        finding: 'ST depression is horizontal or downsloping with a prolonged QT interval. Digoxin effect is excluded; evaluate for Myocardial Ischemia.',
        basis: 'Therapeutic digoxin effect produces scooped ST depression and shortened QT; ischemia is flat/horizontal/downsloping and often prolongs QT.',
        inputs: [`ST morphology: ${formatValue(report.stSegment?.morphology)}`, `QTc: ${formatValue(qtcMs)} ms`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
      return findings;
    }

    if (digoxinContext && toxicityClues) {
      findings.push(createFinding({
        id: 'alert-digoxin-toxicity',
        label: 'Critical alert: Digoxin Toxicity',
        finding: 'CRITICAL EMERGENCY: Digoxin Toxicity suspected. Heart rate is slow, or new-onset sinus/junctional arrhythmia is present, paired with visual or gastrointestinal symptoms. Withhold digoxin immediately. Check serum digoxin and electrolyte levels. Administer Digibind if indicated.',
        basis: 'Profound bradycardia, junctional tachycardia, patterned ventricular ectopy, visual halos, nausea/vomiting, or bidirectional VT in a digoxin context indicate toxicity rather than benign therapeutic effect.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `Rhythm: ${formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory)}`, `Ectopy: ${formatValue(report.rhythm?.ectopy)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    if (digoxinContext && scoopedStd && isNarrowQrs(report) && (hasProlongedPr(report) || report.prInterval?.prCategory === 'normal') && shortenedQt) {
      findings.push(createFinding({
        id: 'dx-therapeutic-digoxin-effect',
        label: 'Diagnostic suggestion: Digoxin effect',
        finding: "Therapeutic Digoxin (Digitalis) Effect (ST-segment 'dig dip' and shortened QT interval).",
        basis: 'Manual digoxin effect rule: digoxin context, narrow QRS, slightly prolonged PR, scooped/slurred ST depression in inferior/lateral leads, low/flattened T waves, and shortened QT.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`, `ST depressed leads: ${formatValue(stDepressionLeads(report))}`, `QTc: ${formatValue(qtcMs)} ms`, `U waves: ${formatValue(report.uWaves)}`],
      }));
    }

    return findings;
  },
};
