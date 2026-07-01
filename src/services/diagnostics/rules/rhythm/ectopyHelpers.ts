import type { EcgReport } from '../../../db';
import { formatValue, getClinicalText, hasClinicalKeyword } from '../../helpers';

export function detailsText(report: Partial<EcgReport>) {
  return `${getClinicalText(report)} ${report.pWave?.notes ?? ''} ${report.qrsComplex?.otherDetails ?? ''} ${report.rhythm?.rhythmImpression ?? ''}`.toLowerCase();
}

export function textIncludes(report: Partial<EcgReport>, keywords: string[]) {
  const text = detailsText(report);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function ectopyIncludes(report: Partial<EcgReport>, value: NonNullable<EcgReport['rhythm']['ectopy']>[number]) {
  return report.rhythm?.ectopy?.includes(value) === true;
}

export function isNarrowQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs === 'number' && qrsMs < 120;
}

export function isWideQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs === 'number' && qrsMs >= 120;
}

export function hasPrematureAtrialClues(report: Partial<EcgReport>) {
  return ectopyIncludes(report, 'pac') || textIncludes(report, ['pac', 'premature atrial', 'atrial premature', 'atrial ectopy']);
}

export function hasPrematureJunctionalClues(report: Partial<EcgReport>) {
  return textIncludes(report, ['pjc', 'premature junctional', 'junctional premature', 'junctional ectopy']);
}

export function hasPrematureVentricularClues(report: Partial<EcgReport>) {
  return ectopyIncludes(report, 'pvc') ||
    report.qrsComplex?.findings?.includes('ventricular_origin') ||
    textIncludes(report, ['pvc', 'premature ventricular', 'ventricular premature', 'ventricular ectopy']);
}

export function hasEarlyAbnormalP(report: Partial<EcgReport>) {
  return report.pWave?.presence === 'present' &&
    ['abnormal', 'biphasic', 'notched', 'peaked', 'inverted', 'variable'].includes(report.pWave?.morphology ?? '');
}

export function hasRetrogradeP(report: Partial<EcgReport>) {
  return report.pWave?.morphology === 'retrograde' ||
    report.pWave?.morphology === 'inverted' ||
    report.rhythm?.pQrsRelationship === 'p_after_qrs';
}

export function hasShortPr(report: Partial<EcgReport>) {
  return (report.prInterval?.calculatedMs ?? Infinity) < 120 || report.prInterval?.prCategory === 'short';
}

export function hasNormalOrConductedPr(report: Partial<EcgReport>) {
  const prMs = report.prInterval?.calculatedMs;
  return report.prInterval?.prCategory === 'normal' || (typeof prMs === 'number' && prMs >= 120 && prMs <= 200);
}

export function hasFrequentEctopy(report: Partial<EcgReport>) {
  return textIncludes(report, ['frequent', '>6 per minute', 'more than 6 per minute', '>30 per hour', 'more than 30 per hour']);
}

export function hasIschemicOrStructuralContext(report: Partial<EcgReport>) {
  return report.stSegment?.stemiCriteriaMet === true ||
    (report.stSegment?.omiPattern !== undefined && !['none', 'unclear'].includes(report.stSegment.omiPattern)) ||
    hasClinicalKeyword(report, ['ischemic heart disease', 'ischaemic heart disease', 'coronary heart disease', 'myocardial infarction', 'acute mi', 'stemi', 'heart failure']);
}

export function underlyingRhythmLabel(report: Partial<EcgReport>) {
  return formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory ?? 'underlying rhythm');
}

export function pvcDangerInputs(report: Partial<EcgReport>) {
  return [
    `Ectopy: ${formatValue(report.rhythm?.ectopy)}`,
    `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`,
    `QRS morphology: ${formatValue(report.qrsComplex?.morphology)}`,
    `Clinical/details text: ${formatValue(report.context?.indication ?? report.additionalNotes ?? report.qrsComplex?.otherDetails)}`,
  ];
}

export function isSymptomatic(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['hypotension', 'syncope', 'lightheaded', 'dizzy', 'palpitation', 'dyspnea', 'shortness of breath', 'chest pain', 'unstable']);
}
