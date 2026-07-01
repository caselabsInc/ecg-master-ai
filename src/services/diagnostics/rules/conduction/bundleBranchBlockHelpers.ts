import type { EcgReport } from '../../../db';
import { formatValue, hasLeadMorphology, isSupraventricularConduction } from '../../helpers';

export function hasRbbbMorphology(report: Partial<EcgReport>) {
  const criteria = report.qrsComplex?.bbb?.criteria;
  return (
    report.qrsComplex?.bbb?.pattern === 'rbbb' ||
    (criteria?.rSrInV1V3 && criteria?.wideSlurredSLateral) ||
    (hasLeadMorphology(report, ['V1', 'V2', 'V3'], ['rsr_prime', 'm_shaped_qrs']) &&
      hasLeadMorphology(report, ['I', 'aVL', 'V6'], ['wide_slurred_s']))
  );
}

export function hasLbbbMorphology(report: Partial<EcgReport>) {
  const criteria = report.qrsComplex?.bbb?.criteria;
  return (
    report.qrsComplex?.bbb?.pattern === 'lbbb' ||
    (criteria?.dominantSInV1 && criteria?.broadMonophasicRLateral && criteria?.absentLateralQWaves) ||
    ((report.qrsComplex?.v1Morphology === 'qs' || report.qrsComplex?.v1Morphology === 'rS') &&
      (report.qrsComplex?.v6Morphology === 'broad_r' || hasLeadMorphology(report, ['I', 'aVL', 'V5', 'V6'], ['broad_monophasic_r', 'notched_r'])) &&
      criteria?.absentLateralQWaves)
  );
}

export function hasIncompleteRbbbMorphology(report: Partial<EcgReport>) {
  return (
    report.qrsComplex?.bbb?.pattern === 'incomplete_rbbb' ||
    report.qrsComplex?.bbb?.criteria?.rSrInV1V3 === true ||
    hasLeadMorphology(report, ['V1', 'V2', 'V3'], ['rsr_prime', 'm_shaped_qrs'])
  );
}

export function getUnderlyingRhythmLabel(report: Partial<EcgReport>) {
  return formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory ?? 'rhythm');
}

export function hasCompleteRbbbForConductionRules(report: Partial<EcgReport>) {
  return typeof report.qrsComplex?.calculatedMs === 'number' &&
    report.qrsComplex.calculatedMs >= 120 &&
    isSupraventricularConduction(report) &&
    hasRbbbMorphology(report);
}

export function hasCompleteLbbbForConductionRules(report: Partial<EcgReport>) {
  return typeof report.qrsComplex?.calculatedMs === 'number' &&
    report.qrsComplex.calculatedMs >= 120 &&
    isSupraventricularConduction(report) &&
    hasLbbbMorphology(report);
}
