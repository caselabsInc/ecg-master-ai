import type { EcgReport } from '../../../db';
import { hasClinicalKeyword, hasLeadIn } from '../../helpers';

export function hasLbbbOrPacing(report: Partial<EcgReport>) {
  return report.qrsComplex?.bbb?.pattern === 'lbbb' ||
    report.qrsComplex?.morphology === 'paced' ||
    report.qrsComplex?.findings?.includes('paced') ||
    report.rhythm?.pacerSpikes === 'ventricular' ||
    report.rhythm?.pacerSpikes === 'dual';
}

export function hasRbbb(report: Partial<EcgReport>) {
  return report.qrsComplex?.bbb?.pattern === 'rbbb' ||
    report.qrsComplex?.bbb?.pattern === 'incomplete_rbbb' ||
    report.qrsComplex?.bbb?.criteria?.rSrInV1V3 === true ||
    report.qrsComplex?.leadMorphology?.V1?.includes('rsr_prime') ||
    report.qrsComplex?.leadMorphology?.v1?.includes('rsr_prime');
}

export function isStandardCalibration(report: Partial<EcgReport>) {
  return report.context?.calibrationStandard !== false;
}

export function activeChestPain(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['chest pain', 'angina', 'ischemia', 'ischaemia', 'acs']);
}

export function dyspneaOrPeContext(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['dyspnea', 'shortness of breath', 'pulmonary embolism', 'pe', 'hypoxia', 'copd', 'pulmonary hypertension']);
}

export function tamponadeContext(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['hypotension', 'jvd', 'jugular venous', 'muffled heart', 'beck', 'tamponade', 'pericardial effusion', 'distant heart sounds']);
}

export function getCornellThreshold(report: Partial<EcgReport>) {
  return report.context?.gender === 'female' ? 20 : 28;
}

export function isNarrowQrs(report: Partial<EcgReport>) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  return typeof qrsMs !== 'number' || qrsMs < 120;
}

export function hasLateralStrain(report: Partial<EcgReport>) {
  return report.qrsComplex?.hypertrophy?.strainPattern === true ||
    report.tWaves?.syndromePattern === 'strain' ||
    report.stSegment?.mimicConsiderations?.includes('lvh_strain') ||
    (report.stSegment?.status === 'depressed' &&
      report.stSegment?.morphology === 'downsloping' &&
      hasLeadIn(report.stSegment?.leads, ['i', 'avl', 'v5', 'v6']) &&
      report.tWaves?.status === 'inverted');
}

export function hasRightVentricularStrain(report: Partial<EcgReport>) {
  return report.tWaves?.syndromePattern === 'pe' ||
    (report.stSegment?.status === 'depressed' &&
      hasLeadIn(report.stSegment?.leads, ['v1', 'v2', 'v3']) &&
      report.tWaves?.status === 'inverted' &&
      hasLeadIn(report.tWaves?.leads, ['v1', 'v2', 'v3']));
}

export function pWavesAbsent(report: Partial<EcgReport>) {
  return report.pWave?.presence === 'absent' ||
    report.rhythm?.rhythmCategory === 'atrial_fibrillation' ||
    report.rhythm?.derivedRhythmCategory === 'atrial_fibrillation' ||
    report.rhythm?.rhythmCategory === 'atrial_flutter' ||
    report.rhythm?.derivedRhythmCategory === 'atrial_flutter';
}

export function getAtrialMeasurements(report: Partial<EcgReport>) {
  const pPresent = report.pWave?.presence === 'present';
  const pDurationMs = (report.pWave?.leadIIDurationSmallBoxes ?? 0) * 40;
  const pAmplitude = report.pWave?.leadIIAmplitudeSmallBoxes ?? 0;
  const v1TerminalWidthMs = (report.pWave?.v1TerminalNegativeDurationSmallBoxes ?? 0) * 40;
  const v1TerminalDepth = report.pWave?.v1TerminalNegativeDepthSmallBoxes ?? 0;
  const laeFlag = report.pWave?.abnormalFeatures?.includes('left_atrial_enlargement') ||
    report.pWave?.abnormalFeatures?.includes('biatrial_enlargement') ||
    (pPresent && report.pWave?.morphology === 'notched' && pDurationMs >= 120) ||
    (pPresent && report.pWave?.morphology === 'biphasic' && v1TerminalDepth >= 1 && v1TerminalWidthMs >= 40);
  const raeFlag = report.pWave?.abnormalFeatures?.includes('right_atrial_enlargement') ||
    report.pWave?.abnormalFeatures?.includes('biatrial_enlargement') ||
    (pPresent && report.pWave?.morphology === 'peaked' && pAmplitude > 2.5 && pDurationMs < 120);

  return {
    pAmplitude,
    pDurationMs,
    v1TerminalDepth,
    v1TerminalWidthMs,
    laeFlag,
    raeFlag,
    biatrialFlag: report.pWave?.abnormalFeatures?.includes('biatrial_enlargement') || (laeFlag && raeFlag),
  };
}
