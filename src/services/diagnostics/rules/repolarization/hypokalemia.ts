import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getQtcMs, hasClinicalAny, stDepressionLeads, textIncludes } from './helpers';

export const hypokalemiaRule: DiagnosticRule = {
  id: 'hypokalemia-repolarization',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const prominentU = report.uWaves?.present === true &&
      (report.uWaves?.prominence === 'prominent' || report.uWaves?.prominence === 'giant' || textIncludes(report, ['u wave exceeds t', 'u waves exceed t', 'prominent u', 'giant u']));
    const stDepressed = report.stSegment?.status === 'depressed' || stDepressionLeads(report).length >= 2;
    const flatOrInvertedT = report.tWaves?.status === 'flattened' || report.tWaves?.status === 'inverted';
    const qtcMs = getQtcMs(report);
    const frequentPvcs = report.rhythm?.ectopy?.includes('pvc') || report.rhythm?.ectopy?.includes('bigeminy') || report.rhythm?.ectopy?.includes('trigeminy') || textIncludes(report, ['frequent pvc', 'r-on-t', 'ron-t']);

    if (stDepressed && !prominentU && report.tWaves?.syndromePattern === 'hypokalemia') {
      findings.push(createFinding({
        id: 'exclude-hypokalemia-no-u-waves',
        label: 'Safety exclusion: Hypokalemia',
        finding: 'ST depression is present, but U waves are absent. Hypokalemia is excluded; evaluate for Myocardial Ischemia.',
        basis: 'Classic hypokalemia requires prominent U waves, often exceeding T-wave amplitude, alongside ST depression and T-wave flattening/inversion.',
        inputs: [`U waves: ${formatValue(report.uWaves)}`, `ST depressed leads: ${formatValue(stDepressionLeads(report))}`],
      }));
      return findings;
    }

    if (!(prominentU && stDepressed && (flatOrInvertedT || report.tWaves?.syndromePattern === 'hypokalemia'))) return findings;

    findings.push(createFinding({
      id: 'dx-hypokalemia-ecg-changes',
      label: 'Diagnostic suggestion: Hypokalemia ECG changes',
      finding: 'ECG changes suggestive of Hypokalemia.',
      basis: 'Manual hypokalemia rule: ST depression, decreased/flattened or inverted T-wave amplitude, and prominent U waves in the precordial leads.',
      inputs: [`ST depressed leads: ${formatValue(stDepressionLeads(report))}`, `T-wave status: ${formatValue(report.tWaves?.status)}`, `U waves: ${formatValue(report.uWaves)}`, `QT/QU risk: ${formatValue(report.qtInterval?.qtRisk)}`],
    }));

    if ((typeof qtcMs === 'number' && qtcMs > 500) || report.qtInterval?.qtRisk === 'markedly_long' || (frequentPvcs && hasClinicalAny(report, ['diuretic', 'lasix', 'furosemide', 'vomiting', 'diarrhea', 'low potassium', 'hypokalemia']))) {
      findings.push(createFinding({
        id: 'alert-severe-hypokalemia-torsades-risk',
        label: 'High-priority alert: severe Hypokalemia',
        finding: 'WARNING: Severe Hypokalemia with prolonged QU interval and frequent PVCs detected. Extreme risk of degenerating into Torsades de Pointes. Administer intravenous Potassium Chloride and Magnesium Sulfate immediately.',
        basis: 'Prominent U waves with prolonged QT/QU and ventricular ectopy can trigger torsades or VF.',
        inputs: [`QTc/QU: ${formatValue(qtcMs)} ms`, `PVC clues: ${formatValue(frequentPvcs)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
