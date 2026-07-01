import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getClinicalText, hasClinicalKeyword } from '../../helpers';
import type { DiagnosticFinding } from '../../types';
import { hasCompleteLbbbForConductionRules, hasCompleteRbbbForConductionRules } from '../conduction/bundleBranchBlock';

export function textMatches(report: Partial<EcgReport>, keywords: string[]) {
  const text = getClinicalText(report);
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function hasPositivePulseOrResponsiveness(report: Partial<EcgReport>) {
  return textMatches(report, ['palpable pulse', 'central pulse present', 'pulse present', 'has pulse', 'carotid pulse present', 'femoral pulse present', 'responsive', 'alert', 'conscious', 'blood pressure obtainable']);
}

export function hasPulselessArrestContext(report: Partial<EcgReport>) {
  return textMatches(report, ['pulseless', 'no pulse', 'without pulse', 'no palpable pulse', 'no central pulse', 'unresponsive', 'cardiac arrest', 'cpr']);
}

export function hasUnstableContext(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['hypotension', 'shock', 'altered mental', 'syncope', 'chest pain', 'dyspnea', 'unstable']);
}

export function hasArtifactContext(report: Partial<EcgReport>) {
  return textMatches(report, ['artifact', 'artefact', 'tremor', 'shivering', 'electrical interference', '60-cycle', 'sixty-cycle', 'electric razor', 'lead disconnection', 'loose electrode']);
}

export function qrsIsAbsent(report: Partial<EcgReport>) {
  return report.qrsComplex?.presence === 'absent';
}

export function qrsIsPresent(report: Partial<EcgReport>) {
  return report.qrsComplex?.presence === 'present' || typeof report.qrsComplex?.calculatedMs === 'number';
}

export function qrsIsWide(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs === 'number' && qrsMs >= 120;
}

export function rateInRange(rate: number | null, min: number, max: number) {
  return typeof rate === 'number' && rate >= min && rate <= max;
}

export function hasVtMarkers(report: Partial<EcgReport>) {
  return report.qrsComplex?.morphology === 'ventricular' ||
    report.qrsComplex?.findings?.includes('ventricular_origin') ||
    report.qrsComplex?.findings?.includes('wide_complex_tachycardia') ||
    report.qrsComplex?.wideComplexTachycardia?.vtConcern === 'high' ||
    report.rhythm?.pQrsRelationship === 'no_consistent_relationship' ||
    report.qrsComplex?.wideComplexTachycardia?.captureFusionBeats === true ||
    report.qrsComplex?.wideComplexTachycardia?.concordance === 'positive' ||
    report.qrsComplex?.wideComplexTachycardia?.concordance === 'negative' ||
    (report.qrsComplex?.calculatedMs ?? 0) > 160;
}

export function hasPolymorphicMarkers(report: Partial<EcgReport>) {
  return report.qrsComplex?.morphology === 'alternans' ||
    report.qrsComplex?.voltage?.electricalAlternans === true ||
    textMatches(report, ['polymorphic', 'varying qrs', 'variable qrs', 'varying morphology', 'variable morphology', 'twisting', 'spindle', 'torsades']);
}

export function hasTorsadesMarkers(report: Partial<EcgReport>) {
  const qtcMs = report.qtInterval?.calculatedQtcMs ?? report.qtInterval?.qtcBazettMs ?? report.qtInterval?.qtcFridericiaMs ?? report.qtInterval?.qtcFraminghamMs;
  const prolongedQtc = typeof qtcMs === 'number' ? qtcMs >= 450 : report.qtInterval?.qtRisk === 'long' || report.qtInterval?.qtRisk === 'markedly_long';
  return prolongedQtc && (textMatches(report, ['torsades', 'twisting', 'spindle', 'twisting of points']) || hasPolymorphicMarkers(report));
}

export function hasClassicBbbAberrancyPattern(report: Partial<EcgReport>) {
  return hasCompleteRbbbForConductionRules(report) ||
    hasCompleteLbbbForConductionRules(report) ||
    report.qrsComplex?.bbb?.pattern === 'rbbb' ||
    report.qrsComplex?.bbb?.pattern === 'lbbb';
}

export function underlyingRhythmLabel(report: Partial<EcgReport>) {
  return formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory ?? 'organised electrical rhythm');
}

export function pulseSafetyExclusion(id: string, label: string, finding: string, basis: string, report: Partial<EcgReport>): DiagnosticFinding {
  return createFinding({
    id,
    label,
    finding,
    basis,
    inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`, `QRS presence: ${formatValue(report.qrsComplex?.presence)}`, `QRS absent reason: ${formatValue(report.qrsComplex?.absentReason)}`],
  });
}

export function getVentricularTachycardiaState(report: Partial<EcgReport>, rate: number | null) {
  const wideTachycardia = rateInRange(rate, 101, 350) && qrsIsWide(report);
  const polymorphic = wideTachycardia && hasPolymorphicMarkers(report);
  const torsades = rateInRange(rate, 150, 350) && qrsIsWide(report) && hasTorsadesMarkers(report);
  const monomorphic = rateInRange(rate, 100, 250) && qrsIsWide(report) && !polymorphic && (report.heartRate?.regularity === 'regular' || hasVtMarkers(report));
  return { wideTachycardia, polymorphic, torsades, monomorphic };
}
