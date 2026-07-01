import { createFinding, formatValue, hasLeadIn } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getDeviation, isNarrowQrs, stDepressionLeads } from './helpers';

function getCornellThreshold(report: Parameters<DiagnosticRule['evaluate']>[0]) {
  return report.context?.gender === 'female' ? 20 : 28;
}

export const lvhStrainPatternRule: DiagnosticRule = {
  id: 'lvh-strain-repolarization',
  evaluate(report): DiagnosticFinding[] {
    const qrsMs = report.qrsComplex?.calculatedMs;
    const hypertrophy = report.qrsComplex?.hypertrophy;
    const sokolowLyon = (hypertrophy?.lvhSInV1 ?? 0) + (hypertrophy?.lvhRInV5V6 ?? 0);
    const cornell = (hypertrophy?.cornellRaVL ?? 0) + (hypertrophy?.cornellSV3 ?? 0);
    const lvhVoltage = sokolowLyon >= 35 || (report.context?.gender === 'female' ? cornell > 20 : cornell >= 28);
    const lateralStDepression = stDepressionLeads(report).filter((lead) => ['i', 'avl', 'v5', 'v6'].includes(lead));
    const asymmetricLateralStrain = lvhVoltage &&
      report.stSegment?.morphology === 'downsloping' &&
      hasLeadIn(lateralStDepression, ['i', 'avl', 'v5', 'v6']) &&
      (report.tWaves?.status === 'inverted' || report.tWaves?.syndromePattern === 'strain') &&
      (report.tWaves?.morphology === 'asymmetric' || report.tWaves?.syndromePattern === 'strain' || hypertrophy?.strainPattern === true);

    if ((lvhVoltage || hypertrophy?.strainPattern) && !isNarrowQrs(report)) {
      return [createFinding({
        id: 'exclude-lvh-strain-wide-qrs',
        label: 'Safety exclusion: LVH strain',
        finding: 'QRS duration is prolonged (>=0.12s). LVH strain pattern is bypassed; evaluate for LBBB.',
        basis: 'LVH strain criteria require a narrow QRS so secondary LBBB/paced repolarisation is not misclassified.',
        inputs: [`QRS duration: ${formatValue(qrsMs)} ms`, `BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`],
      })];
    }

    if (!asymmetricLateralStrain) return [];

    const maxLateralStd = Math.max(...lateralStDepression.map((lead) => Math.abs(getDeviation(report, lead) ?? 0)), 0);
    const findings: DiagnosticFinding[] = [createFinding({
      id: 'dx-lvh-lateral-strain-repolarization',
      label: 'Diagnostic suggestion: LVH with lateral strain',
      finding: 'Left Ventricular Hypertrophy (LVH) with Lateral Strain Pattern (Secondary Repolarisation Abnormality).',
      basis: 'Manual LVH strain rule: LVH voltage, QRS <120 ms, asymmetric downsloping ST depression and asymmetric T-wave inversion in lateral leads I/aVL/V5/V6.',
      inputs: [`Sokolow-Lyon: ${formatValue(sokolowLyon)} mm`, `Cornell: ${formatValue(cornell)} mm`, `Cornell threshold: ${formatValue(getCornellThreshold(report))} mm`, `Lateral depressed leads: ${formatValue(lateralStDepression)}`],
    })];

    if (maxLateralStd > 2 || report.stSegment?.morphology === 'horizontal' || report.tWaves?.morphology === 'symmetric') {
      findings.push(createFinding({
        id: 'alert-lvh-strain-possible-superimposed-ischemia',
        label: 'High-priority alert: LVH strain mimic',
        finding: 'WARNING: Asymmetric ST depression is expected with severe LVH. However, if ST depression is horizontal or newly symmetric, correlate clinically for acute subendocardial ischemia.',
        basis: 'Marked, horizontal, or newly symmetric ST depression may indicate acute ischemia superimposed on chronic LVH strain.',
        inputs: [`Max lateral ST depression: ${formatValue(maxLateralStd)} mm`, `ST morphology: ${formatValue(report.stSegment?.morphology)}`, `T-wave morphology: ${formatValue(report.tWaves?.morphology)}`],
      }));
    }

    return findings;
  },
};
