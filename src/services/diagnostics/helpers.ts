import type { EcgReport } from '../db';
import type { DiagnosticFinding } from './types';

export function formatValue(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'not documented';
  if (Array.isArray(value)) return value.length ? value.join(', ') : 'not documented';
  if (typeof value === 'boolean') return value ? 'yes' : 'no';
  if (typeof value === 'object') {
    const entries: string[] = Object.entries(value as Record<string, unknown>)
      .filter(([, entryValue]) => entryValue !== undefined && entryValue !== null && entryValue !== false)
      .map(([key, entryValue]) => {
        const label = key
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replaceAll('_', ' ')
          .replace(/\b\w/g, (letter) => letter.toUpperCase());
        return `${label}: ${formatValue(entryValue)}`;
      });
    return entries.length ? entries.join('; ') : 'not documented';
  }
  return String(value).replaceAll('_', ' ');
}

export function createFinding(finding: Omit<DiagnosticFinding, 'source'> & { source?: DiagnosticFinding['source'] }): DiagnosticFinding {
  return {
    source: 'rule_derived',
    ...finding,
  };
}

export function intervalsAreRegular(intervals: number[] | null | undefined) {
  const numericIntervals = (intervals ?? []).filter((interval) => typeof interval === 'number' && Number.isFinite(interval));
  if (numericIntervals.length < 2) return false;

  const firstInterval = numericIntervals[0];
  if (!firstInterval) return false;

  return numericIntervals.every((interval) => Math.abs(interval - firstInterval) <= Math.max(0.5, firstInterval * 0.1));
}

export function getRhythmCategory(report: Partial<EcgReport>) {
  return report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory;
}

export function getBpm(report: Partial<EcgReport>) {
  return report.heartRate?.calculatedBpm ?? report.heartRate?.ventricularRateBpm ?? null;
}

export function getClinicalText(report: Partial<EcgReport>) {
  return `${report.context?.indication ?? ''} ${report.additionalNotes ?? ''}`.toLowerCase();
}

export function hasClinicalKeyword(report: Partial<EcgReport>, keywords: string[]) {
  const text = getClinicalText(report);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function isSupraventricularConduction(report: Partial<EcgReport>) {
  return !(
    report.qrsComplex?.morphology === 'ventricular' ||
    report.qrsComplex?.morphology === 'paced' ||
    report.qrsComplex?.findings?.includes('ventricular_origin') ||
    report.qrsComplex?.findings?.includes('paced') ||
    report.rhythm?.rhythmCategory === 'ventricular' ||
    report.rhythm?.derivedRhythmCategory === 'ventricular' ||
    report.rhythm?.rhythmCategory === 'paced' ||
    report.rhythm?.derivedRhythmCategory === 'paced'
  );
}

export function getConductedPrIntervals(report: Partial<EcgReport>) {
  const multipleIntervals = report.prInterval?.multipleIntervals
    ?.map((interval) => interval.calculatedMs)
    .filter((interval): interval is number => typeof interval === 'number' && Number.isFinite(interval));

  if (multipleIntervals?.length) return multipleIntervals;
  return typeof report.prInterval?.calculatedMs === 'number' ? [report.prInterval.calculatedMs] : [];
}

export function valuesAreConstant(values: number[], toleranceMs = 20) {
  if (values.length < 2) return false;

  const firstValue = values[0];
  return values.every((value) => Math.abs(value - firstValue) <= toleranceMs);
}

export function valuesShowProgressiveLengthening(values: number[], toleranceMs = 20) {
  if (values.length < 2) return false;

  const hasMeaningfulVariance = Math.max(...values) - Math.min(...values) >= toleranceMs;
  const mostlyLengthening = values.slice(1).every((value, index) => value + toleranceMs >= values[index]);
  return hasMeaningfulVariance && mostlyLengthening;
}

export function getBlockLocationByQrs(qrsMs: number | undefined) {
  if (typeof qrsMs !== 'number') return 'unknown';
  return qrsMs >= 120 ? 'His-Purkinje / infranodal more likely' : 'AV nodal more likely';
}

export function hasLeadIn(leads: string[] | null | undefined, targets: string[]) {
  return (leads ?? []).some((lead) => targets.includes(lead.toLowerCase()));
}

export function hasLeadMorphology(
  report: Partial<EcgReport>,
  leads: string[],
  morphologies: NonNullable<EcgReport['qrsComplex']['leadMorphology']>[string]
) {
  const leadMorphology = report.qrsComplex?.leadMorphology ?? {};
  return leads.some((lead) => {
    const values = leadMorphology[lead] ?? leadMorphology[lead.toUpperCase()] ?? leadMorphology[lead.toLowerCase()];
    return values?.some((value) => morphologies.includes(value));
  });
}

export function hasInferiorQWaves(report: Partial<EcgReport>) {
  return report.qWaves?.present === true && hasLeadIn(report.qWaves?.leads, ['ii', 'iii', 'avf']);
}

export function hasLateralQWaves(report: Partial<EcgReport>) {
  return report.qWaves?.present === true && hasLeadIn(report.qWaves?.leads, ['i', 'avl', 'v5', 'v6']);
}
