import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm, getRhythmCategory, intervalsAreRegular } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';

function evaluateFirstDegreeAvBlockCriteria(report: Partial<EcgReport>) {
  const rhythm = getRhythmCategory(report);
  const bpm = getBpm(report);
  const ppRegular = intervalsAreRegular(report.heartRate?.ppIntervalLargeBoxes);
  const rrRegular = report.heartRate?.regularity === 'regular' || intervalsAreRegular(report.heartRate?.rrIntervalLargeBoxes);
  const pWaveNormal =
    report.pWave?.presence === 'present' &&
    report.pWave?.morphology === 'normal' &&
    report.axis?.pWaveLeadII === 'positive';
  const droppedBeatPattern = report.prInterval?.droppedBeatPattern;
  const hasDroppedBeatEvidence =
    report.prInterval?.droppedBeats === true ||
    report.rhythm?.pQrsRelationship === 'more_p_than_qrs' ||
    droppedBeatPattern === 'mobitz_i' ||
    droppedBeatPattern === 'mobitz_ii' ||
    droppedBeatPattern === 'two_to_one' ||
    droppedBeatPattern === 'high_grade' ||
    droppedBeatPattern === 'complete_av_block' ||
    report.prInterval?.avBlockConcern === 'mobitz_i' ||
    report.prInterval?.avBlockConcern === 'mobitz_ii' ||
    report.prInterval?.avBlockConcern === 'high_grade' ||
    report.prInterval?.avBlockConcern === 'complete';
  const oneToOneConduction = report.rhythm?.pQrsRelationship === 'one_to_one' && !hasDroppedBeatEvidence;
  const prProlonged = (report.prInterval?.calculatedMs ?? 0) > 200 || (report.prInterval?.smallBoxes ?? 0) > 5;
  const prConstant = report.prInterval?.regularity === 'constant';
  const qrsIsWide = typeof report.qrsComplex?.calculatedMs === 'number' && report.qrsComplex.calculatedMs >= 120;
  const qrsCompatible = typeof report.qrsComplex?.calculatedMs === 'number' ? report.qrsComplex.calculatedMs <= 110 || qrsIsWide : true;
  const underlyingRhythm =
    rhythm === 'sinus_bradycardia' || (rhythm === 'sinus' && typeof bpm === 'number' && bpm < 60)
      ? 'Sinus bradycardia'
      : rhythm === 'sinus_tachycardia' || (rhythm === 'sinus' && typeof bpm === 'number' && bpm > 100)
        ? 'Sinus tachycardia'
        : 'Sinus rhythm';

  return {
    meetsCriteria: ppRegular && rrRegular && pWaveNormal && oneToOneConduction && prProlonged && prConstant && qrsCompatible && !hasDroppedBeatEvidence,
    ppRegular,
    rrRegular,
    pWaveNormal,
    oneToOneConduction,
    prProlonged,
    prConstant,
    qrsCompatible,
    qrsIsWide,
    hasDroppedBeatEvidence,
    underlyingRhythm,
    compositeLabel: `${underlyingRhythm} with first-degree AV block`,
    qrsNote:
      qrsIsWide
        ? 'QRS is wide, compatible with co-existing BBB/IVCD; this does not exclude first-degree AV block but should be flagged separately.'
        : 'QRS is narrow/normal or not documented as widened.',
  };
}

export const firstDegreeAvBlockRule: DiagnosticRule = {
  id: 'first-degree-av-block',
  evaluate(report) {
    const criteria = evaluateFirstDegreeAvBlockCriteria(report);
    if (!criteria.meetsCriteria) return [];

    const findings: DiagnosticFinding[] = [
      createFinding({
        id: 'dx-first-degree-av-block',
        label: 'Diagnostic suggestion: first-degree AV block',
        finding: `${criteria.compositeLabel} pattern suggested by regular atrial and ventricular rhythms, normal upright Lead II P waves, strict 1:1 P-QRS conduction, prolonged constant PR interval, and compatible QRS duration.`,
        basis: 'Safety-bounded manual decision tree: first-degree AV block is appended to the underlying sinus rhythm and requires regular P-P/R-R rhythm, normal upright Lead II P waves, strict 1:1 conduction, zero dropped beats/Mobitz evidence, PR >200 ms or >5 small boxes, constant PR, and QRS duration compatible with narrow conduction or co-existing BBB/IVCD.',
        inputs: [
          `Composite output: ${criteria.compositeLabel}`,
          `P-P intervals regular: ${formatValue(criteria.ppRegular)}`,
          `R-R intervals regular: ${formatValue(criteria.rrRegular)}`,
          `P waves normal/upright Lead II: ${formatValue(criteria.pWaveNormal)}`,
          `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`,
          `Dropped-beat/Mobitz evidence present: ${formatValue(criteria.hasDroppedBeatEvidence)}`,
          `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`,
          `PR small boxes: ${formatValue(report.prInterval?.smallBoxes)}`,
          `PR category: ${formatValue(report.prInterval?.prCategory)}`,
          `PR regularity: ${formatValue(report.prInterval?.regularity)}`,
          `Dropped beats: ${formatValue(report.prInterval?.droppedBeats)}`,
          `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`,
          criteria.qrsNote,
        ],
      }),
    ];

    if (criteria.qrsIsWide) {
      findings.push(createFinding({
        id: 'dx-first-degree-av-block-wide-qrs-coexisting',
        label: 'Co-existing conduction warning',
        finding: 'Wide QRS is present with first-degree AV block criteria; flag co-existing intraventricular conduction delay or bundle-branch block.',
        basis: 'Safety boundary for first-degree AV block: QRS >=120 ms does not remove the AV nodal delay diagnosis, but it suggests an additional lower conduction abnormality that should be reviewed separately.',
        inputs: [
          `Composite output: ${criteria.compositeLabel}`,
          `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`,
          `BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`,
          `BBB/fascicular pattern: ${formatValue(report.qrsComplex?.bbb?.fascicular)}`,
        ],
      }));
    }

    return findings;
  },
};

