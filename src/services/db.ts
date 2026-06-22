import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { normalizeAiInterpretation } from './aiInterpretation';

function removeUndefined(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  }

  if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        newObj[key] = removeUndefined(obj[key]);
      }
    }
    return newObj;
  }

  return obj;
}

// Interfaces for our Data Model
export interface EcgReport {
  id?: string;
  createdAt: any;
  status: 'draft' | 'completed';
  context: {
    age?: number;
    dob?: string | null;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    indication?: string;
    ecgDateTime?: any;
    paperSpeedStandard?: boolean;
    calibrationStandard?: boolean;
    calibrationNote?: string | null;
  };
  heartRate: {
    regularity?: 'regular' | 'irregular';
    largeBoxesBetweenR?: number | null;
    largeBoxesBetweenP?: number | null;
    rrIntervalLargeBoxes?: number[] | null;
    ppIntervalLargeBoxes?: number[] | null;
    qrsCountIn10Sec?: number | null;
    calculatedBpm?: number;
    atrialRateBpm?: number | null;
    ventricularRateBpm?: number | null;
    rateSeverity?: 'normal' | 'bradycardia' | 'tachycardia' | 'extreme_bradycardia' | 'extreme_tachycardia';
  };
  rhythm: {
    rhythmCategory?: 'sinus' | 'sinus_bradycardia' | 'sinus_tachycardia' | 'sinus_arrhythmia' | 'atrial_fibrillation' | 'atrial_flutter' | 'svt' | 'junctional' | 'ventricular' | 'paced' | 'escape' | 'unclear' | 'other';
    derivedRhythmCategory?: 'sinus' | 'sinus_bradycardia' | 'sinus_tachycardia' | 'sinus_arrhythmia' | 'atrial_fibrillation' | 'atrial_flutter' | 'svt' | 'junctional' | 'ventricular' | 'paced' | 'escape' | 'unclear' | 'other';
    rhythmConfidence?: 'definite' | 'probable' | 'possible' | 'insufficient';
    pQrsRelationship?: 'one_to_one' | 'more_p_than_qrs' | 'more_qrs_than_p' | 'p_after_qrs' | 'no_consistent_relationship' | 'cannot_assess';
    rhythmReasoning?: string[];
    ectopy?: Array<'pac' | 'pvc' | 'couplet' | 'bigeminy' | 'trigeminy' | 'runs'>;
    pacerSpikes?: 'none' | 'atrial' | 'ventricular' | 'dual' | 'unclear';
    rhythmImpression?: string | null;
  };
  pWave: {
    presence?: 'present' | 'absent' | 'unclear';
    morphology?: 'normal' | 'peaked' | 'notched' | 'biphasic' | 'inverted' | 'retrograde' | 'variable' | 'abnormal';
    leadIIDurationSmallBoxes?: number | null;
    leadIIAmplitudeSmallBoxes?: number | null;
    v1TerminalNegativeDurationSmallBoxes?: number | null;
    v1TerminalNegativeDepthSmallBoxes?: number | null;
    abnormalAtrialActivity?: 'fibrillatory_waves' | 'flutter_waves' | 'artifact' | 'unclear' | 'other';
    absentPExplanation?: 'atrial_fibrillation' | 'atrial_flutter' | 'junctional_rhythm' | 'ventricular_rhythm' | 'artifact' | 'unclear' | 'other';
    abnormalFeatures?: Array<'left_atrial_enlargement' | 'right_atrial_enlargement' | 'biatrial_enlargement' | 'low_amplitude' | 'wandering_atrial_pacemaker'>;
    notes?: string | null;
  };
  prInterval: {
    regularity?: 'constant' | 'not_constant';
    smallBoxes?: number;
    calculatedMs?: number;
    multipleIntervals?: { smallBoxes?: number; calculatedMs?: number }[];
    segmentStatus?: 'flat' | 'depressed' | 'elevated';
    droppedBeats?: boolean;
    droppedBeatPattern?: 'mobitz_i' | 'mobitz_ii' | 'two_to_one' | 'high_grade' | 'complete_av_block' | 'blocked_pac' | 'unclear';
    prCategory?: 'short' | 'normal' | 'first_degree' | 'variable' | 'not_measurable';
    avBlockConcern?: 'none' | 'first_degree' | 'mobitz_i' | 'mobitz_ii' | 'high_grade' | 'complete' | 'unclear';
  };
  qrsComplex: {
    presence?: 'present' | 'absent' | 'unclear';
    absentReason?: 'asystole' | 'ventricular_fibrillation' | 'artifact' | 'lead_disconnection' | 'unclear' | 'other';
    durationSmallBoxes?: number;
    calculatedMs?: number;
    morphology?: 'normal' | 'hypertrophy' | 'bbb' | 'paced' | 'ventricular' | 'low_voltage' | 'alternans' | 'toxicologic' | 'other';
    findings?: Array<'normal_conduction' | 'hypertrophy' | 'bbb' | 'paced' | 'ventricular_origin' | 'low_voltage' | 'alternans' | 'toxicologic' | 'pre_excitation' | 'wide_complex_tachycardia' | 'other'>;
    derivedSummary?: string[];
    cautions?: string[];
    v1Morphology?: 'rS' | 'rsR' | 'dominant_r' | 'qs' | 'paced' | 'unclear';
    v6Morphology?: 'qRs' | 'broad_r' | 'deep_s' | 'paced' | 'unclear';
    leadMorphology?: Record<string, ('dominant_s' | 'rsr_prime' | 'm_shaped_qrs' | 'broad_monophasic_r' | 'notched_r' | 'absent_q_wave' | 'rwpt_over_60' | 'wide_slurred_s' | 'qR' | 'rS' | 'rwpt_over_45' | 'rwpt_prolonged')[]>;
    voltage?: {
      lowLimb?: boolean;
      lowPrecordial?: boolean;
      electricalAlternans?: boolean;
    };
    hypertrophy?: {
      lvhSInV1?: number;
      lvhRInV5V6?: number;
      rvhRInV1?: number;
      rvhSInV5V6?: number;
      cornellRaVL?: number;
      cornellSV3?: number;
      strainPattern?: boolean;
    };
    bbb?: {
      pattern?: 'rbbb' | 'lbbb' | 'incomplete_rbbb' | 'ivcd';
      fascicular?: 'lafb' | 'lpfb' | 'bifascicular' | 'trifascicular';
      criteria?: {
        dominantSInV1?: boolean;
        rSrInV1V3?: boolean;
        broadMonophasicRLateral?: boolean;
        absentLateralQWaves?: boolean;
        rwptV5V6Over60?: boolean;
        wideSlurredSLateral?: boolean;
        lafbQrLateral?: boolean;
        lafbRsInferior?: boolean;
        rwptAvlOver45?: boolean;
        lpfbRsLateral?: boolean;
        lpfbQrInferior?: boolean;
        rwptAvfProlonged?: boolean;
      };
    };
    wideComplexTachycardia?: {
      present?: boolean;
      concordance?: 'positive' | 'negative' | 'absent' | 'unclear';
      captureFusionBeats?: boolean;
      extremeAxis?: boolean;
      vtConcern?: 'low' | 'intermediate' | 'high';
    };
    otherDetails?: string;
    deltaWave?: boolean;
  };
  axis: {
    leadI?: 'positive' | 'negative' | 'equiphasic';
    leadAVF?: 'positive' | 'negative' | 'equiphasic';
    leadII?: 'positive' | 'negative' | 'equiphasic';
    leadAVL?: 'positive' | 'negative' | 'equiphasic';
    interpretedAxis?: string;
    approximateDegrees?: number | null;
    concern?: 'normal' | 'left_axis_deviation' | 'right_axis_deviation' | 'extreme_axis' | 'indeterminate';
    pWaveLeadI?: 'positive' | 'negative' | 'biphasic' | 'flat' | 'unclear';
    pWaveLeadII?: 'positive' | 'negative' | 'biphasic' | 'flat' | 'unclear';
    pWaveLeadAVF?: 'positive' | 'negative' | 'biphasic' | 'flat' | 'unclear';
    interpretedPWaveAxis?: 'normal' | 'leftward' | 'rightward' | 'superior' | 'indeterminate';
    leadReversalConcern?: boolean;
  };
  qWaves: {
    present?: boolean;
    widthSmallBoxes?: number | null;
    depthPercent?: number | null;
    leads?: string[] | null;
    leadFindings?: Record<string, {
      present?: boolean;
      width?: string;
      depth?: string;
    }>;
    territories?: Array<'septal' | 'anterior' | 'lateral' | 'inferior' | 'posterior' | 'right_ventricular'>;
    pseudoInfarctConcern?: Array<'lvh' | 'lbbb' | 'wpw' | 'lead_misplacement' | 'hypertrophic_cardiomyopathy'>;
  };
  stSegment: {
    status?: 'normal' | 'elevated' | 'depressed' | 'not_assessable';
    smallBoxes?: number | null;
    leads?: string[] | null;
    hasReciprocalChanges?: boolean;
    reciprocalLeads?: string[] | null;
    leadDeviationMm?: Record<string, number | null>;
    morphology?: 'concave' | 'convex' | 'horizontal' | 'upsloping' | 'downsloping' | 'saddleback' | 'coved' | 'unclear';
    jPointLeads?: string[] | null;
    posteriorLeadsUsed?: boolean;
    rightSidedLeadsUsed?: boolean;
    stemiCriteriaMet?: boolean;
    omiPattern?: 'none' | 'stemi' | 'posterior_omi' | 'right_ventricular_mi' | 'de_winter' | 'wellens' | 'left_main_or_multivessel' | 'sgarbossa_positive' | 'modified_sgarbossa_positive' | 'unclear';
    mimicConsiderations?: Array<'pericarditis' | 'early_repolarization' | 'lvh_strain' | 'lbbb' | 'paced_rhythm' | 'brugada' | 'hyperkalemia' | 'ventricular_aneurysm'>;
  };
  tWaves: {
    presence?: 'present' | 'absent' | 'unclear';
    absentReason?: 'asystole' | 'ventricular_fibrillation' | 'low_amplitude' | 'artifact' | 'merged_with_qrs_or_st' | 'unclear' | 'other';
    status?: 'normal' | 'inverted' | 'tall_peaked' | 'hyperacute' | 'biphasic' | 'flattened' | 'deep_symmetric';
    leads?: string[] | null;
    morphology?: 'asymmetric' | 'symmetric' | 'broad_based' | 'narrow_tented' | 'biphasic_a' | 'biphasic_b' | 'camel_hump' | 'unclear';
    syndromePattern?: 'none' | 'wellens_a' | 'wellens_b' | 'de_winter' | 'strain' | 'juvenile_pattern' | 'pe' | 'hyperkalemia' | 'hypokalemia' | 'cns_pattern';
  };
  qtInterval: {
    measurementStatus?: 'measured' | 'unmeasurable';
    unmeasurableReason?: 'irregular_rhythm' | 'unclear_t_end' | 'prominent_u_waves' | 'wide_qrs_or_paced' | 'tachycardia_overlap' | 'artifact' | 'no_organized_complexes' | 'absent_qrs_complexes' | 'absent_t_waves' | 'other';
    smallBoxes?: number;
    calculatedQtMs?: number;
    calculatedQtcMs?: number;
    qtcBazettMs?: number;
    qtcFridericiaMs?: number;
    qtcFraminghamMs?: number;
    jtMs?: number | null;
    jtcMs?: number | null;
    qtRisk?: 'short' | 'normal' | 'borderline_long' | 'long' | 'markedly_long';
    correctionMethod?: 'bazett' | 'fridericia' | 'framingham';
  };
  rWaveProgression?: 'normal' | 'abnormal' | 'not_assessed';
  lateWaveFindings?: {
    transitionZone?: 'early' | 'normal' | 'late' | 'absent' | 'reversed' | 'not_assessed';
    jWaves?: 'absent' | 'early_repolarization' | 'osborn' | 'brugada_coved' | 'brugada_saddleback' | 'unclear';
    epsilonWave?: 'absent' | 'present' | 'unclear';
    leadMisplacementConcern?: boolean;
  };
  uWaves: {
    present?: boolean | 'not_assessed';
    prominence?: 'subtle' | 'prominent' | 'giant' | 'inverted' | 'unclear';
    leads?: string[] | null;
    note?: string | null;
  };
  additionalNotes?: string;
  decisionSupport?: {
    intendedUse?: 'clinician_education_decision_support';
    clinicianOnly?: boolean;
    ruleFindings?: Array<{
      id: string;
      label: string;
      source: 'rule_derived' | 'clinician_entered';
      finding: string;
      basis: string;
      inputs: string[];
    }>;
    auditTrail?: {
      generatedAt?: string;
      appVersion?: string;
      inputSnapshot?: Record<string, unknown>;
      missingOrUncertainInputs?: string[];
    };
    aiStatus?: 'not_requested' | 'generated' | 'failed';
    aiError?: {
      message: string;
      code?: string;
      occurredAt: string;
    };
    regulatoryPosition?: 'non_device_cds_candidate' | 'educational_support_only' | 'medical_device_review_required';
  };
  aiInterpretation?: {
    primaryInterpretation?: string;
    dangerousFindings?: string;
    missingDataWarnings?: string;
    urgencyLevel?: 'emergency' | 'urgent' | 'routine' | 'normal_variant' | 'insufficient_data';
    teachingExplanation?: string;
    stepByStepInterpretation: string;
    differentialsAndExplanation: string;
    nextSteps: {
      investigations: string;
      management: string;
    };
    disclaimer: string;
    rawResponse?: string;
  };
}

export const saveReportDraft = async (userId: string, report: Partial<EcgReport>, reportId?: string) => {
  const reportsRef = collection(db, 'users', userId, 'reports');

  const reportData = removeUndefined({
    ...report,
    status: 'draft',
    updatedAt: serverTimestamp(),
  });

  if (reportId) {
    const docRef = doc(db, 'users', userId, 'reports', reportId);
    await updateDoc(docRef, reportData);
    return reportId;
  } else {
    const docRef = await addDoc(reportsRef, {
      ...reportData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
};

export const completeReport = async (userId: string, reportId: string, aiInterpretation: EcgReport['aiInterpretation']) => {
  const normalizedInterpretation = normalizeAiInterpretation(aiInterpretation);
  if (!normalizedInterpretation) {
    throw new Error('Cannot complete report without a generated AI interpretation.');
  }

  const docRef = doc(db, 'users', userId, 'reports', reportId);
  await updateDoc(docRef, removeUndefined({
    status: 'completed',
    aiInterpretation: normalizedInterpretation,
    'decisionSupport.aiStatus': 'generated',
    'decisionSupport.aiError': null,
    completedAt: serverTimestamp()
  }));
};

export const markReportAiFailed = async (
  userId: string,
  reportId: string,
  error: { message: string; code?: string }
) => {
  const docRef = doc(db, 'users', userId, 'reports', reportId);
  await updateDoc(docRef, removeUndefined({
    status: 'draft',
    'decisionSupport.aiStatus': 'failed',
    'decisionSupport.aiError': {
      ...error,
      occurredAt: new Date().toISOString(),
    },
    updatedAt: serverTimestamp(),
  }));
};

export const getUserReports = async (userId: string) => {
  const reportsRef = collection(db, 'users', userId, 'reports');
  const q = query(reportsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const reports: EcgReport[] = [];
  querySnapshot.forEach((doc) => {
    reports.push({ id: doc.id, ...doc.data() } as EcgReport);
  });
  
  return reports;
};
