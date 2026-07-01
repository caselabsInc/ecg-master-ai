import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBlockLocationByQrs, getConductedPrIntervals, hasLeadIn, intervalsAreRegular, valuesAreConstant, valuesShowProgressiveLengthening } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';

function evaluateSecondDegreeAvBlockCriteria(report: Partial<EcgReport>) {
  const prIntervals = getConductedPrIntervals(report);
  const qrsMs = report.qrsComplex?.calculatedMs;
  const qrsIsWide = typeof qrsMs === 'number' && qrsMs >= 120;
  const ppRegular = intervalsAreRegular(report.heartRate?.ppIntervalLargeBoxes);
  const rrRegular = report.heartRate?.regularity === 'regular' || intervalsAreRegular(report.heartRate?.rrIntervalLargeBoxes);
  const ventricularIrregular = report.heartRate?.regularity === 'irregular';
  const droppedBeatPattern = report.prInterval?.droppedBeatPattern;
  const avBlockConcern = report.prInterval?.avBlockConcern;
  const hasDroppedBeats =
    report.prInterval?.droppedBeats === true ||
    report.rhythm?.pQrsRelationship === 'more_p_than_qrs' ||
    !!droppedBeatPattern && droppedBeatPattern !== 'unclear';
  const prConstant = report.prInterval?.regularity === 'constant' || valuesAreConstant(prIntervals);
  const progressivePr = report.prInterval?.regularity === 'not_constant' && valuesShowProgressiveLengthening(prIntervals);
  const blockedPacLikely = droppedBeatPattern === 'blocked_pac' || (hasDroppedBeats && !ppRegular);
  const hasSecondDegreeEvidence = hasDroppedBeats && ppRegular && report.rhythm?.pQrsRelationship !== 'no_consistent_relationship';

  if (blockedPacLikely) {
    return {
      type: 'blocked_pac_or_uncertain',
      diagnosis: 'Blocked premature atrial complex or uncertain non-conducted atrial beat pattern',
      urgency: 'Monitor and verify P-P timing',
      location: 'AV node/refractory timing more likely than fixed AV block',
      inputs: { ppRegular, rrRegular, prConstant, progressivePr, qrsIsWide, hasDroppedBeats, droppedBeatPattern, avBlockConcern, prIntervals },
    };
  }

  if (!hasSecondDegreeEvidence) return null;

  if (droppedBeatPattern === 'high_grade' || avBlockConcern === 'high_grade') {
    return {
      type: 'high_grade',
      diagnosis: 'Advanced/high-grade second-degree AV block',
      urgency: 'High priority: prepare for urgent pacing review',
      location: getBlockLocationByQrs(qrsMs),
      inputs: { ppRegular, rrRegular, prConstant, progressivePr, qrsIsWide, hasDroppedBeats, droppedBeatPattern, avBlockConcern, prIntervals },
    };
  }

  if (droppedBeatPattern === 'two_to_one') {
    return {
      type: 'two_to_one',
      diagnosis: qrsIsWide ? 'Second-degree 2:1 AV block, probable Mobitz II/infranodal pattern' : 'Second-degree 2:1 AV block, probable Mobitz I/AV nodal pattern',
      urgency: qrsIsWide ? 'High priority: prepare for urgent pacing review' : 'Monitor and correlate clinically',
      location: getBlockLocationByQrs(qrsMs),
      inputs: { ppRegular, rrRegular, prConstant, progressivePr, qrsIsWide, hasDroppedBeats, droppedBeatPattern, avBlockConcern, prIntervals },
    };
  }

  if (droppedBeatPattern === 'mobitz_i' || avBlockConcern === 'mobitz_i' || (progressivePr && ventricularIrregular)) {
    return {
      type: 'mobitz_i',
      diagnosis: 'Second-degree AV block Type I (Mobitz I / Wenckebach)',
      urgency: 'Monitor and correlate clinically',
      location: 'AV node more likely',
      inputs: { ppRegular, rrRegular, prConstant, progressivePr, qrsIsWide, hasDroppedBeats, droppedBeatPattern, avBlockConcern, prIntervals },
    };
  }

  if (droppedBeatPattern === 'mobitz_ii' || avBlockConcern === 'mobitz_ii' || prConstant) {
    return {
      type: 'mobitz_ii',
      diagnosis: 'Second-degree AV block Type II (Mobitz II)',
      urgency: 'High priority: prepare for urgent pacing review',
      location: getBlockLocationByQrs(qrsMs),
      inputs: { ppRegular, rrRegular, prConstant, progressivePr, qrsIsWide, hasDroppedBeats, droppedBeatPattern, avBlockConcern, prIntervals },
    };
  }

  return {
    type: 'unclassified_second_degree',
    diagnosis: 'Second-degree AV block pattern present but not safely classifiable',
    urgency: 'Review rhythm strip manually',
    location: 'Unknown',
    inputs: { ppRegular, rrRegular, prConstant, progressivePr, qrsIsWide, hasDroppedBeats, droppedBeatPattern, avBlockConcern, prIntervals },
  };
}

export const secondDegreeAvBlockRule: DiagnosticRule = {
  id: 'second-degree-av-block',
  evaluate(report) {
    const criteria = evaluateSecondDegreeAvBlockCriteria(report);
    if (!criteria) return [];

    if (criteria.type === 'blocked_pac_or_uncertain') {
      return [createFinding({
        id: 'dx-blocked-pac-or-uncertain-nonconducted-p',
        label: 'Safety exclusion: blocked PAC / uncertain non-conducted P wave',
        finding: 'Second-degree AV block is not classified because P-P timing is irregular or the dropped beat was marked as a blocked PAC.',
        basis: 'Second-degree AV block guardrail: non-conducted PACs must be ruled out first; true AV block requires regular P-P timing, while an early premature P wave can be benign refractory AV nodal timing.',
        inputs: [
          `P-P intervals regular: ${formatValue(criteria.inputs.ppRegular)}`,
          `Dropped beats: ${formatValue(criteria.inputs.hasDroppedBeats)}`,
          `Dropped-beat pattern: ${formatValue(criteria.inputs.droppedBeatPattern)}`,
          `AV block concern: ${formatValue(criteria.inputs.avBlockConcern)}`,
        ],
      })];
    }

    const idByType: Record<string, string> = {
      high_grade: 'dx-high-grade-second-degree-av-block',
      two_to_one: 'dx-two-to-one-second-degree-av-block',
      mobitz_i: 'dx-mobitz-i',
      mobitz_ii: 'dx-mobitz-ii',
      unclassified_second_degree: 'dx-unclassified-second-degree-av-block',
    };
    const qrsMs = report.qrsComplex?.calculatedMs;
    const stLeads = report.stSegment?.leads ?? [];
    const qWaveLeads = report.qWaves?.leads ?? [];
    const findings: DiagnosticFinding[] = [
      createFinding({
        id: idByType[criteria.type],
        label: `Diagnostic suggestion: ${criteria.diagnosis}`,
        finding: `${criteria.diagnosis} suggested by regular atrial timing with intermittent non-conducted P waves. Location: ${criteria.location}. Urgency: ${criteria.urgency}.`,
        basis: 'Safety-bounded manual decision tree for second-degree AV block: rule out blocked PAC first, then classify high-grade block, 2:1 block, Mobitz I, Mobitz II, or leave unclassified if the recorded pattern is insufficient.',
        inputs: [
          `P-P intervals regular: ${formatValue(criteria.inputs.ppRegular)}`,
          `R-R intervals regular: ${formatValue(criteria.inputs.rrRegular)}`,
          `Dropped beats: ${formatValue(criteria.inputs.hasDroppedBeats)}`,
          `Dropped-beat pattern: ${formatValue(criteria.inputs.droppedBeatPattern)}`,
          `AV block concern: ${formatValue(criteria.inputs.avBlockConcern)}`,
          `Conducted PR intervals: ${formatValue(criteria.inputs.prIntervals)}`,
          `Conducted PR intervals constant: ${formatValue(criteria.inputs.prConstant)}`,
          `Progressive PR lengthening evidence: ${formatValue(criteria.inputs.progressivePr)}`,
          `QRS duration: ${formatValue(qrsMs)} ms`,
          `QRS wide: ${formatValue(criteria.inputs.qrsIsWide)}`,
        ],
      }),
    ];

    if (criteria.type === 'mobitz_ii' || criteria.type === 'high_grade' || (criteria.type === 'two_to_one' && criteria.inputs.qrsIsWide)) {
      findings.push(createFinding({
        id: `alert-${criteria.type}-pacing-safety`,
        label: 'High-priority conduction alert',
        finding: 'Mobitz II, high-grade second-degree block, or wide-QRS 2:1 block pattern can progress to complete heart block; prepare for urgent pacing-capable review.',
        basis: 'Second-degree AV block safety boundary: infranodal or high-grade patterns require high-priority clinician review and pacing readiness rather than routine monitoring.',
        inputs: [
          `Diagnosis: ${criteria.diagnosis}`,
          `Urgency: ${criteria.urgency}`,
          `QRS duration: ${formatValue(qrsMs)} ms`,
          `Block location estimate: ${criteria.location}`,
        ],
      }));
    }

    if (criteria.type === 'mobitz_i' && (hasLeadIn(stLeads, ['ii', 'iii', 'avf']) || hasLeadIn(qWaveLeads, ['ii', 'iii', 'avf']))) {
      findings.push(createFinding({
        id: 'alert-mobitz-i-inferior-ischemia-correlation',
        label: 'Inferior ischemia correlation',
        finding: 'Mobitz I pattern coexists with inferior-lead ischemia/infarct clues; correlate for RCA/AV-nodal involvement.',
        basis: 'Second-degree AV block safety boundary: Wenckebach may correlate with inferior wall/RCA ischemia affecting the AV node.',
        inputs: [`ST leads: ${formatValue(stLeads)}`, `Q-wave leads: ${formatValue(qWaveLeads)}`],
      }));
    }

    if ((criteria.type === 'mobitz_ii' || criteria.type === 'high_grade') && (hasLeadIn(stLeads, ['v1', 'v2', 'v3', 'v4']) || hasLeadIn(qWaveLeads, ['v1', 'v2', 'v3', 'v4']))) {
      findings.push(createFinding({
        id: 'alert-mobitz-ii-anteroseptal-ischemia-correlation',
        label: 'Anteroseptal ischemia correlation',
        finding: 'Mobitz II/high-grade pattern coexists with anteroseptal ischemia/infarct clues; correlate for LAD/bundle-system involvement.',
        basis: 'Second-degree AV block safety boundary: Mobitz II is often infranodal and should be correlated with anteroseptal/LAD ischemic patterns when present.',
        inputs: [`ST leads: ${formatValue(stLeads)}`, `Q-wave leads: ${formatValue(qWaveLeads)}`],
      }));
    }

    return findings;
  },
};

