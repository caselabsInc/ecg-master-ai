import type { EcgReport } from '../../../db';
import {
  getBpm,
  getClinicalText,
  getRhythmCategory,
  hasClinicalKeyword,
  intervalsAreRegular,
  isSupraventricularConduction,
  valuesAreConstant,
} from '../../helpers';

export function textIncludes(report: Partial<EcgReport>, keywords: string[]) {
  const text = `${getClinicalText(report)} ${report.pWave?.notes ?? ''} ${report.qrsComplex?.otherDetails ?? ''}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function isNarrowQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs === 'number' && qrsMs < 120;
}

export function isWideQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs === 'number' && qrsMs >= 120;
}

export function isRegular(report: Partial<EcgReport>) {
  return report.heartRate?.regularity === 'regular' ||
    intervalsAreRegular(report.heartRate?.rrIntervalLargeBoxes) ||
    intervalsAreRegular(report.heartRate?.ppIntervalLargeBoxes);
}

export function hasNormalSinusPWave(report: Partial<EcgReport>) {
  return report.pWave?.presence === 'present' &&
    report.pWave?.morphology === 'normal' &&
    (report.axis?.pWaveLeadII === 'positive' || report.axis?.interpretedPWaveAxis === 'normal');
}

export function hasRetrogradePWave(report: Partial<EcgReport>) {
  return report.pWave?.morphology === 'retrograde' ||
    report.pWave?.morphology === 'inverted' ||
    report.rhythm?.pQrsRelationship === 'p_after_qrs';
}

export function hasNormalPr(report: Partial<EcgReport>) {
  const prMs = report.prInterval?.calculatedMs;
  const intervals = report.prInterval?.multipleIntervals?.map((interval) => interval.calculatedMs).filter((value): value is number => typeof value === 'number') ?? [];
  const prInRange = typeof prMs === 'number' ? prMs >= 120 && prMs <= 200 : report.prInterval?.prCategory === 'normal';
  const prConstant = report.prInterval?.regularity === 'constant' || valuesAreConstant(intervals);
  return prInRange && prConstant;
}

export function hasShortPr(report: Partial<EcgReport>) {
  return (report.prInterval?.calculatedMs ?? Infinity) < 120 || report.prInterval?.prCategory === 'short';
}

export function oneToOne(report: Partial<EcgReport>) {
  return report.rhythm?.pQrsRelationship === 'one_to_one';
}

export function atrialActivity(report: Partial<EcgReport>) {
  return report.pWave?.abnormalAtrialActivity ?? report.pWave?.absentPExplanation;
}

export function afResponseLabel(rate: number | null) {
  if (typeof rate !== 'number') return 'Unknown Ventricular Response';
  if (rate < 60) return 'Slow Ventricular Response';
  if (rate <= 100) return 'Controlled Ventricular Response';
  return 'Rapid Ventricular Response';
}

export function flutterConductionLabel(report: Partial<EcgReport>) {
  const atrialRate = report.heartRate?.atrialRateBpm;
  const ventricularRate = report.heartRate?.ventricularRateBpm ?? report.heartRate?.calculatedBpm;
  if (typeof atrialRate === 'number' && typeof ventricularRate === 'number' && ventricularRate > 0) {
    const ratio = Math.round(atrialRate / ventricularRate);
    if (ratio >= 1 && ratio <= 8) return `${ratio}:1`;
  }
  if (report.heartRate?.regularity === 'irregular') return 'variable';
  return 'unknown';
}

export function isSymptomaticOrUnstable(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['hypotension', 'cold sweat', 'shortness of breath', 'dyspnea', 'altered consciousness', 'altered mental', 'syncope', 'chest pain', 'pulmonary edema', 'unstable']);
}

export function hasDigoxinContext(report: Partial<EcgReport>) {
  return textIncludes(report, ['digoxin', 'digitalis', 'dig toxicity', 'digitalis toxicity']);
}

export function pWaveShapeCountAtLeastThree(report: Partial<EcgReport>) {
  return report.pWave?.morphology === 'variable' ||
    report.pWave?.abnormalFeatures?.includes('wandering_atrial_pacemaker') ||
    textIncludes(report, ['three p wave', '3 p wave', 'three distinct p', 'at least three', 'multiple p-wave morphologies']);
}

export function getSupraventricularRhythmContext(report: Partial<EcgReport>) {
  const rate = getBpm(report);
  const rhythm = getRhythmCategory(report);
  const narrowQrs = isNarrowQrs(report);
  const regular = isRegular(report);
  const normalSinusP = hasNormalSinusPWave(report);
  const normalPr = hasNormalPr(report);
  const strictOneToOne = oneToOne(report);

  return {
    rate,
    atrialRate: report.heartRate?.atrialRateBpm,
    rhythm,
    qrsMs: report.qrsComplex?.calculatedMs,
    pActivity: atrialActivity(report),
    regular,
    narrowQrs,
    normalSinusP,
    normalPr,
    strictOneToOne,
    supraventricular: isSupraventricularConduction(report),
    symptomatic: isSymptomaticOrUnstable(report),
  };
}
