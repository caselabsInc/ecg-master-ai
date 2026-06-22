import { EcgReport } from './db';

type DecisionSupport = NonNullable<EcgReport['decisionSupport']>;
type RuleFinding = NonNullable<DecisionSupport['ruleFindings']>[number];

const APP_VERSION = '1.0.0';

function formatValue(value: unknown): string {
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

function formatQrsCriteria(criteria: NonNullable<NonNullable<EcgReport['qrsComplex']['bbb']>['criteria']>) {
  const labels: Record<string, string> = {
    dominantSInV1: 'Dominant S in V1',
    rSrInV1V3: "rsR'/M-shaped QRS in V1-V3",
    broadMonophasicRLateral: 'Broad monophasic/notched R in lateral leads',
    absentLateralQWaves: 'Absent Q waves in lateral leads',
    rwptV5V6Over60: 'RWPT >60 ms in V5-V6',
    wideSlurredSLateral: 'Wide/slurred S in lateral leads',
    lafbQrLateral: 'qR in I/aVL',
    lafbRsInferior: 'rS in II/III/aVF',
    rwptAvlOver45: 'RWPT >45 ms in aVL',
    lpfbRsLateral: 'rS in I/aVL',
    lpfbQrInferior: 'qR in II/III/aVF',
    rwptAvfProlonged: 'Prolonged RWPT in aVF',
  };

  const selected = Object.entries(criteria)
    .filter(([, value]) => value)
    .map(([criterion]) => labels[criterion] || formatValue(criterion));

  return selected.length ? selected.join('; ') : 'not documented';
}

function formatLeadMorphology(leadMorphology: EcgReport['qrsComplex']['leadMorphology']) {
  const labels: Record<string, string> = {
    dominant_s: 'Dominant S',
    rsr_prime: "rsR'",
    m_shaped_qrs: 'M-shaped QRS',
    broad_monophasic_r: 'Broad monophasic R',
    notched_r: 'Notched R',
    absent_q_wave: 'Absent Q wave',
    rwpt_over_60: 'RWPT >60 ms',
    wide_slurred_s: 'Wide/slurred S',
    qR: 'qR complex',
    rS: 'rS complex',
    rwpt_over_45: 'RWPT >45 ms',
    rwpt_prolonged: 'Prolonged RWPT',
  };

  const rows = Object.entries(leadMorphology || {})
    .filter(([, morphologies]) => morphologies.length)
    .map(([lead, morphologies]) => `${lead}: ${morphologies.map((morphology) => labels[morphology] || formatValue(morphology)).join(', ')}`);

  return rows.length ? rows.join('; ') : 'not documented';
}

function addFinding(
  findings: RuleFinding[],
  finding: Omit<RuleFinding, 'source'> & { source?: RuleFinding['source'] }
) {
  findings.push({
    source: 'rule_derived',
    ...finding,
  });
}

export function buildDecisionSupportAudit(report: Partial<EcgReport>): DecisionSupport {
  const missingOrUncertainInputs: string[] = [];
  const ruleFindings: RuleFinding[] = [];

  const bpm = report.heartRate?.calculatedBpm ?? report.heartRate?.ventricularRateBpm;
  if (typeof bpm === 'number') {
    const rateFinding = bpm < 60 ? 'bradycardic range' : bpm > 100 ? 'tachycardic range' : 'normal adult resting range';
    addFinding(ruleFindings, {
      id: 'heart-rate',
      label: 'Heart rate',
      finding: `${Math.round(bpm)} bpm, ${rateFinding}`,
      basis: 'Large-box rate calculation entered by the clinician.',
      inputs: [`R-R large boxes: ${formatValue(report.heartRate?.largeBoxesBetweenR ?? report.heartRate?.rrIntervalLargeBoxes)}`],
    });
  } else {
    missingOrUncertainInputs.push('Ventricular rate');
  }

  if (report.rhythm?.derivedRhythmCategory || report.rhythm?.rhythmCategory) {
    addFinding(ruleFindings, {
      id: 'rhythm',
      label: 'Rhythm',
      finding: formatValue(report.rhythm?.derivedRhythmCategory ?? report.rhythm?.rhythmCategory),
      basis: 'Structured rhythm rule using rate regularity, P-wave presence, P/QRS relationship, PR behavior, and pacer data.',
      inputs: [
        `R-R regularity: ${formatValue(report.heartRate?.regularity)}`,
        `P waves: ${formatValue(report.pWave?.presence)}`,
        `Abnormal atrial activity: ${formatValue(report.pWave?.abnormalAtrialActivity ?? report.pWave?.absentPExplanation)}`,
        `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`,
        `PR regularity: ${formatValue(report.prInterval?.regularity)}`,
      ],
    });
  } else {
    missingOrUncertainInputs.push('Rhythm category');
  }

  if (report.prInterval?.calculatedMs || report.prInterval?.prCategory || report.prInterval?.avBlockConcern) {
    addFinding(ruleFindings, {
      id: 'av-conduction',
      label: 'AV conduction',
      finding: `${formatValue(report.prInterval?.prCategory)} PR category; AV block concern: ${formatValue(report.prInterval?.avBlockConcern)}`,
      basis: 'PR interval category and AV block concern are derived from clinician-entered PR boxes, PR consistency, and dropped-beat pattern.',
      inputs: [
        `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`,
        `Dropped beats: ${formatValue(report.prInterval?.droppedBeats)}`,
        `Dropped-beat pattern: ${formatValue(report.prInterval?.droppedBeatPattern)}`,
      ],
    });
  } else {
    missingOrUncertainInputs.push('PR interval and AV conduction');
  }

  if (report.qrsComplex?.presence === 'absent') {
    addFinding(ruleFindings, {
      id: 'qrs-complex-absent',
      label: 'QRS complex',
      finding: `QRS complexes absent or not organised; reason: ${formatValue(report.qrsComplex?.absentReason)}`,
      basis: 'Clinician marked QRS complexes as absent, so QRS duration, BBB morphology, ventricular axis, ST segment, and QT interval are not reliably assessable.',
      inputs: [
        `QRS presence: ${formatValue(report.qrsComplex?.presence)}`,
        `Absent reason: ${formatValue(report.qrsComplex?.absentReason)}`,
      ],
    });
  } else if (report.qrsComplex?.calculatedMs || report.qrsComplex?.derivedSummary?.length || report.qrsComplex?.findings?.length) {
    addFinding(ruleFindings, {
      id: 'qrs-complex',
      label: 'QRS complex',
      finding: report.qrsComplex?.derivedSummary?.join('; ') || formatValue(report.qrsComplex?.findings),
      basis: 'QRS findings are separated into clinician-entered morphology flags and transparent rule summaries.',
      inputs: [
        `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`,
        `Selected findings: ${formatValue(report.qrsComplex?.findings)}`,
        `BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`,
        `BBB/fascicular pattern: ${formatValue(report.qrsComplex?.bbb?.fascicular)}`,
        `BBB criteria: ${formatQrsCriteria(report.qrsComplex?.bbb?.criteria || {})}`,
        `Lead-specific QRS morphology: ${formatLeadMorphology(report.qrsComplex?.leadMorphology)}`,
      ],
    });
  } else {
    missingOrUncertainInputs.push('QRS duration and morphology');
  }

  if (report.axis?.interpretedAxis || report.axis?.interpretedPWaveAxis) {
    addFinding(ruleFindings, {
      id: 'axis',
      label: 'Axis',
      finding: `QRS axis: ${formatValue(report.axis?.interpretedAxis)}; P axis: ${formatValue(report.axis?.interpretedPWaveAxis)}`,
      basis: 'Axis values are derived from clinician-entered lead deflection directions.',
      inputs: [
        `Lead I QRS: ${formatValue(report.axis?.leadI)}`,
        `aVF QRS: ${formatValue(report.axis?.leadAVF)}`,
        `Lead II P: ${formatValue(report.axis?.pWaveLeadII)}`,
      ],
    });
  }

  if (report.stSegment?.stemiCriteriaMet || report.stSegment?.omiPattern || report.stSegment?.status) {
    addFinding(ruleFindings, {
      id: 'st-segment',
      label: 'ST segment',
      finding: `${formatValue(report.stSegment?.status)}; OMI pattern: ${formatValue(report.stSegment?.omiPattern)}; STEMI criteria met: ${formatValue(report.stSegment?.stemiCriteriaMet)}`,
      basis: 'ST assessment is based on clinician-entered lead deviations, morphology, reciprocal changes, and selected OMI patterns.',
      inputs: [
        `ST status: ${formatValue(report.stSegment?.status)}`,
        `Leads: ${formatValue(report.stSegment?.leads)}`,
        `Reciprocal changes: ${formatValue(report.stSegment?.hasReciprocalChanges)}`,
      ],
    });
  }

  if (report.tWaves?.presence === 'absent') {
    addFinding(ruleFindings, {
      id: 't-waves-absent',
      label: 'T waves',
      finding: `T waves absent or not visible; reason: ${formatValue(report.tWaves?.absentReason)}`,
      basis: 'Clinician marked T waves as absent, so T-wave morphology and QT endpoint assessment are limited.',
      inputs: [
        `T-wave presence: ${formatValue(report.tWaves?.presence)}`,
        `Absent reason: ${formatValue(report.tWaves?.absentReason)}`,
      ],
    });
  } else if (report.tWaves?.status || report.tWaves?.syndromePattern) {
    addFinding(ruleFindings, {
      id: 't-waves',
      label: 'T waves',
      finding: `${formatValue(report.tWaves?.status)}; syndrome pattern: ${formatValue(report.tWaves?.syndromePattern)}`,
      basis: 'T-wave assessment is based on clinician-entered morphology, distribution, and named pattern selection.',
      inputs: [
        `T-wave presence: ${formatValue(report.tWaves?.presence)}`,
        `Leads: ${formatValue(report.tWaves?.leads)}`,
        `Morphology: ${formatValue(report.tWaves?.morphology)}`,
      ],
    });
  }

  if (report.qtInterval?.measurementStatus === 'unmeasurable') {
    addFinding(ruleFindings, {
      id: 'qt-interval-unmeasurable',
      label: 'QT interval',
      finding: `QT interval not measurable; reason: ${formatValue(report.qtInterval?.unmeasurableReason)}`,
      basis: 'Clinician marked QT interval as unmeasurable because reliable QRS onset or T-wave end could not be identified.',
      inputs: [
        `Measurement status: ${formatValue(report.qtInterval?.measurementStatus)}`,
        `Reason: ${formatValue(report.qtInterval?.unmeasurableReason)}`,
      ],
    });
  } else if (report.qtInterval?.calculatedQtcMs || report.qtInterval?.qtRisk) {
    addFinding(ruleFindings, {
      id: 'qt-interval',
      label: 'QT interval',
      finding: `QTc ${formatValue(report.qtInterval?.calculatedQtcMs)} ms; risk: ${formatValue(report.qtInterval?.qtRisk)}`,
      basis: 'QTc is calculated from clinician-entered QT and rate values using the selected correction method.',
      inputs: [
        `QT: ${formatValue(report.qtInterval?.calculatedQtMs)} ms`,
        `Correction: ${formatValue(report.qtInterval?.correctionMethod)}`,
      ],
    });
  }

  return {
    intendedUse: 'clinician_education_decision_support',
    clinicianOnly: true,
    ruleFindings,
    auditTrail: {
      generatedAt: new Date().toISOString(),
      appVersion: APP_VERSION,
      inputSnapshot: {
        context: report.context ?? {},
        heartRate: report.heartRate ?? {},
        rhythm: report.rhythm ?? {},
        pWave: report.pWave ?? {},
        prInterval: report.prInterval ?? {},
        qrsComplex: report.qrsComplex ?? {},
        axis: report.axis ?? {},
        stSegment: report.stSegment ?? {},
        tWaves: report.tWaves ?? {},
        qtInterval: report.qtInterval ?? {},
      },
      missingOrUncertainInputs,
    },
    aiStatus: report.decisionSupport?.aiStatus ?? 'not_requested',
    regulatoryPosition: 'educational_support_only',
  };
}
