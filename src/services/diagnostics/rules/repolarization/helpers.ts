import type { EcgReport } from '../../../db';
import { getBpm, getClinicalText, hasClinicalKeyword, hasLeadIn } from '../../helpers';

export function normalizedLeads(leads: string[] | null | undefined) {
  return (leads ?? []).map((lead) => lead.toLowerCase().replaceAll(' ', ''));
}

export function getDeviation(report: Partial<EcgReport>, lead: string) {
  const deviations = report.stSegment?.leadDeviationMm ?? {};
  const normalized = lead.toLowerCase().replaceAll(' ', '');
  const candidates = [lead, lead.toUpperCase(), lead.toLowerCase(), normalized];
  for (const candidate of candidates) {
    const value = deviations[candidate];
    if (typeof value === 'number') return value;
  }
  return null;
}

export function getQtcMs(report: Partial<EcgReport>) {
  return report.qtInterval?.calculatedQtcMs ??
    report.qtInterval?.qtcBazettMs ??
    report.qtInterval?.qtcFridericiaMs ??
    report.qtInterval?.qtcFraminghamMs ??
    null;
}

export function textIncludes(report: Partial<EcgReport>, keywords: string[]) {
  const text = `${getClinicalText(report)} ${report.pWave?.notes ?? ''} ${report.qrsComplex?.otherDetails ?? ''} ${report.uWaves?.note ?? ''} ${report.rhythm?.rhythmImpression ?? ''}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function hasSinusPWave(report: Partial<EcgReport>) {
  return report.pWave?.presence === 'present' &&
    (report.pWave?.morphology === 'normal' || report.axis?.pWaveLeadII === 'positive' || report.axis?.interpretedPWaveAxis === 'normal');
}

export function hasOneToOneConduction(report: Partial<EcgReport>) {
  return report.rhythm?.pQrsRelationship === 'one_to_one';
}

export function hasNormalPrMs(report: Partial<EcgReport>) {
  const prMs = report.prInterval?.calculatedMs;
  return report.prInterval?.prCategory === 'normal' || (typeof prMs === 'number' && prMs >= 120 && prMs <= 200);
}

export function hasProlongedPr(report: Partial<EcgReport>) {
  return report.prInterval?.prCategory === 'first_degree' || (report.prInterval?.calculatedMs ?? 0) > 200;
}

export function isNarrowQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs !== 'number' || qrsMs < 120;
}

export function isWideQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs === 'number' && qrsMs >= 120;
}

export function stElevationLeads(report: Partial<EcgReport>) {
  const deviationLeads = Object.keys(report.stSegment?.leadDeviationMm ?? {})
    .filter((lead) => (getDeviation(report, lead) ?? 0) > 0)
    .map((lead) => lead.toLowerCase().replaceAll(' ', ''));
  if (deviationLeads.length) return deviationLeads;
  return report.stSegment?.status === 'elevated' ? normalizedLeads(report.stSegment?.leads) : [];
}

export function stDepressionLeads(report: Partial<EcgReport>) {
  const deviationLeads = Object.keys(report.stSegment?.leadDeviationMm ?? {})
    .filter((lead) => (getDeviation(report, lead) ?? 0) < 0)
    .map((lead) => lead.toLowerCase().replaceAll(' ', ''));
  if (deviationLeads.length) return deviationLeads;
  return report.stSegment?.status === 'depressed' ? normalizedLeads(report.stSegment?.leads) : [];
}

export function countStTerritories(leads: string[]) {
  const territories = [
    ['ii', 'iii', 'avf'],
    ['v1', 'v2'],
    ['v3', 'v4'],
    ['i', 'avl', 'v5', 'v6'],
  ];
  return territories.filter((territory) => territory.some((lead) => leads.includes(lead))).length;
}

export function hasReciprocalDepressionOutsideAvrV1(report: Partial<EcgReport>) {
  return stDepressionLeads(report).some((lead) => lead !== 'avr' && lead !== 'v1') || report.stSegment?.hasReciprocalChanges === true;
}

export function hasLowVoltage(report: Partial<EcgReport>) {
  return report.qrsComplex?.voltage?.lowLimb === true ||
    report.qrsComplex?.voltage?.lowPrecordial === true ||
    report.qrsComplex?.morphology === 'low_voltage' ||
    report.qrsComplex?.findings?.includes('low_voltage');
}

export function hasRightPrecordialOnlyElevation(report: Partial<EcgReport>) {
  const leads = stElevationLeads(report);
  return leads.length > 0 && leads.every((lead) => ['v1', 'v2', 'v3'].includes(lead));
}

export function hasInferiorElevation(report: Partial<EcgReport>) {
  return hasLeadIn(stElevationLeads(report), ['ii', 'iii', 'avf']);
}

export function hasLateralOrPrecordialBerLeads(report: Partial<EcgReport>) {
  return hasLeadIn(stElevationLeads(report), ['v3', 'v4', 'v5', 'v6', 'i', 'ii']);
}

export function hasClinicalAny(report: Partial<EcgReport>, keywords: string[]) {
  return hasClinicalKeyword(report, keywords) || textIncludes(report, keywords);
}

export function rate(report: Partial<EcgReport>) {
  return getBpm(report);
}
