import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm, getRhythmCategory, hasLeadIn } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';

function isTachycardic(report: Partial<EcgReport>) {
  const bpm = getBpm(report);
  return report.heartRate?.rateSeverity === 'tachycardia' ||
    report.heartRate?.rateSeverity === 'extreme_tachycardia' ||
    (typeof bpm === 'number' && bpm > 100);
}

function hasLead(leads: string[] | null | undefined, target: string) {
  return (leads ?? []).some((lead) => lead.toLowerCase() === target.toLowerCase());
}

export const pulmonaryEmbolismRule: DiagnosticRule = {
  id: 'pulmonary-embolism',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const rhythm = getRhythmCategory(report);
    const bpm = getBpm(report);
    const tWaveLeads = report.tWaves?.leads ?? [];
    const qWaveLeads = report.qWaves?.leads ?? [];
    const leadMorphology = report.qrsComplex?.leadMorphology ?? {};
    const rightHeartStrain =
      report.tWaves?.syndromePattern === 'pe' ||
      (hasLead(tWaveLeads, 'III') && hasLead(qWaveLeads, 'III') && hasLeadIn(Object.keys(leadMorphology), ['I'])) ||
      (report.axis?.concern === 'right_axis_deviation' && hasLeadIn(tWaveLeads, ['v1', 'v2', 'v3', 'v4']));

    if (!((rhythm === 'sinus_tachycardia' || (rhythm === 'sinus' && isTachycardic(report))) && rightHeartStrain)) {
      return [];
    }

    return [createFinding({
      id: 'dx-pulmonary-embolism-strain-pattern',
      label: 'Diagnostic suggestion: pulmonary embolism/right-heart strain pattern',
      finding: 'Pulmonary embolism/right-heart strain ECG pattern possible from sinus tachycardia plus right-heart strain clues.',
      basis: 'Manual decision tree adapted from the prior PHP PulmonaryEmbolism rule: sinus tachycardia with anteroseptal T-wave inversion, right-axis deviation, or S1Q3T3/right-heart strain pattern.',
      inputs: [
        `Rhythm category: ${formatValue(rhythm)}`,
        `Rate: ${formatValue(bpm)} bpm`,
        `Axis concern: ${formatValue(report.axis?.concern)}`,
        `T-wave leads/pattern: ${formatValue(tWaveLeads)}; ${formatValue(report.tWaves?.syndromePattern)}`,
      ],
    })];
  },
};
