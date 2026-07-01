import type { EcgReport } from '../../../db';
import { hasInferiorQWaves, hasLateralQWaves, hasLeadMorphology, isSupraventricularConduction } from '../../helpers';

export function hasLafbCriteria(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return isSupraventricularConduction(report) &&
    (typeof qrsMs !== 'number' || qrsMs < 120 || report.qrsComplex?.bbb?.pattern === 'rbbb') &&
    report.axis?.concern === 'left_axis_deviation' &&
    !hasInferiorQWaves(report) &&
    (
      report.qrsComplex?.bbb?.fascicular === 'lafb' ||
      report.qrsComplex?.bbb?.fascicular === 'bifascicular' ||
      (report.qrsComplex?.bbb?.criteria?.lafbQrLateral && report.qrsComplex?.bbb?.criteria?.lafbRsInferior) ||
      (hasLeadMorphology(report, ['I', 'aVL'], ['qR']) && hasLeadMorphology(report, ['II', 'III', 'aVF'], ['rS']))
    );
}

export function hasLpfbCriteria(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return isSupraventricularConduction(report) &&
    (typeof qrsMs !== 'number' || qrsMs < 120 || report.qrsComplex?.bbb?.pattern === 'rbbb') &&
    report.axis?.concern === 'right_axis_deviation' &&
    !hasLateralQWaves(report) &&
    report.qrsComplex?.hypertrophy?.rvhRInV1 === undefined &&
    (
      report.qrsComplex?.bbb?.fascicular === 'lpfb' ||
      report.qrsComplex?.bbb?.fascicular === 'bifascicular' ||
      (report.qrsComplex?.bbb?.criteria?.lpfbRsLateral && report.qrsComplex?.bbb?.criteria?.lpfbQrInferior) ||
      (hasLeadMorphology(report, ['I', 'aVL'], ['rS']) && hasLeadMorphology(report, ['II', 'III', 'aVF'], ['qR']))
    );
}
