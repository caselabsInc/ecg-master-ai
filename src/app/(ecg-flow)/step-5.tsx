import React from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { LearnableText, StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { useEcgStore } from '@/store/ecgStore';

type QrsFinding =
  | 'normal_conduction'
  | 'hypertrophy'
  | 'bbb'
  | 'paced'
  | 'ventricular_origin'
  | 'low_voltage'
  | 'alternans'
  | 'toxicologic'
  | 'pre_excitation'
  | 'wide_complex_tachycardia'
  | 'other';
type BbbPattern = 'rbbb' | 'lbbb' | 'incomplete_rbbb' | 'ivcd';
type Fascicular = 'lafb' | 'lpfb' | 'bifascicular' | 'trifascicular';
type BbbCriterion =
  | 'dominantSInV1'
  | 'rSrInV1V3'
  | 'broadMonophasicRLateral'
  | 'absentLateralQWaves'
  | 'rwptV5V6Over60'
  | 'wideSlurredSLateral'
  | 'lafbQrLateral'
  | 'lafbRsInferior'
  | 'rwptAvlOver45'
  | 'lpfbRsLateral'
  | 'lpfbQrInferior'
  | 'rwptAvfProlonged';
type LeadQrsMorphology =
  | 'dominant_s'
  | 'rsr_prime'
  | 'm_shaped_qrs'
  | 'broad_monophasic_r'
  | 'notched_r'
  | 'absent_q_wave'
  | 'rwpt_over_60'
  | 'wide_slurred_s'
  | 'qR'
  | 'rS'
  | 'rwpt_over_45'
  | 'rwpt_prolonged';
type HypertrophyField = 'lvhSInV1' | 'lvhRInV5V6' | 'rvhRInV1' | 'rvhSInV5V6' | 'cornellRaVL' | 'cornellSV3';

type TraceSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const TRACE_HEIGHT = 148;

const bbbCriterionLabels: Record<BbbCriterion, string> = {
  dominantSInV1: 'Dominant S in V1',
  rSrInV1V3: "rsR'/M-shaped QRS in V1-V3",
  broadMonophasicRLateral: 'Broad monophasic/notched R in I, aVL, V5-V6',
  absentLateralQWaves: 'Absent Q waves in I, aVL, V5-V6',
  rwptV5V6Over60: 'R-wave peak time >60 ms in V5-V6',
  wideSlurredSLateral: 'Wide/slurred S in I, aVL, V5-V6',
  lafbQrLateral: 'qR complexes in I and aVL',
  lafbRsInferior: 'rS complexes in II, III, aVF',
  rwptAvlOver45: 'R-wave peak time >45 ms in aVL',
  lpfbRsLateral: 'rS complexes in I and aVL',
  lpfbQrInferior: 'qR complexes in II, III, aVF',
  rwptAvfProlonged: 'Prolonged R-wave peak time in aVF',
};

const leadMorphologyLabels: Record<LeadQrsMorphology, string> = {
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

const criterionLeadMorphology: Record<
  BbbCriterion,
  { lead: string; morphologies: LeadQrsMorphology[]; autoSelect?: LeadQrsMorphology }[]
> = {
  dominantSInV1: [{ lead: 'V1', morphologies: ['dominant_s'], autoSelect: 'dominant_s' }],
  rSrInV1V3: [
    { lead: 'V1', morphologies: ['rsr_prime', 'm_shaped_qrs'] },
    { lead: 'V2', morphologies: ['rsr_prime', 'm_shaped_qrs'] },
    { lead: 'V3', morphologies: ['rsr_prime', 'm_shaped_qrs'] },
  ],
  broadMonophasicRLateral: [
    { lead: 'I', morphologies: ['broad_monophasic_r', 'notched_r'] },
    { lead: 'aVL', morphologies: ['broad_monophasic_r', 'notched_r'] },
    { lead: 'V5', morphologies: ['broad_monophasic_r', 'notched_r'] },
    { lead: 'V6', morphologies: ['broad_monophasic_r', 'notched_r'] },
  ],
  absentLateralQWaves: [
    { lead: 'I', morphologies: ['absent_q_wave'] },
    { lead: 'aVL', morphologies: ['absent_q_wave'] },
    { lead: 'V5', morphologies: ['absent_q_wave'] },
    { lead: 'V6', morphologies: ['absent_q_wave'] },
  ],
  rwptV5V6Over60: [
    { lead: 'V5', morphologies: ['rwpt_over_60'] },
    { lead: 'V6', morphologies: ['rwpt_over_60'] },
  ],
  wideSlurredSLateral: [
    { lead: 'I', morphologies: ['wide_slurred_s'] },
    { lead: 'aVL', morphologies: ['wide_slurred_s'] },
    { lead: 'V5', morphologies: ['wide_slurred_s'] },
    { lead: 'V6', morphologies: ['wide_slurred_s'] },
  ],
  lafbQrLateral: [
    { lead: 'I', morphologies: ['qR'] },
    { lead: 'aVL', morphologies: ['qR'] },
  ],
  lafbRsInferior: [
    { lead: 'II', morphologies: ['rS'] },
    { lead: 'III', morphologies: ['rS'] },
    { lead: 'aVF', morphologies: ['rS'] },
  ],
  rwptAvlOver45: [{ lead: 'aVL', morphologies: ['rwpt_over_45'], autoSelect: 'rwpt_over_45' }],
  lpfbRsLateral: [
    { lead: 'I', morphologies: ['rS'] },
    { lead: 'aVL', morphologies: ['rS'] },
  ],
  lpfbQrInferior: [
    { lead: 'II', morphologies: ['qR'] },
    { lead: 'III', morphologies: ['qR'] },
    { lead: 'aVF', morphologies: ['qR'] },
  ],
  rwptAvfProlonged: [{ lead: 'aVF', morphologies: ['rwpt_prolonged'], autoSelect: 'rwpt_prolonged' }],
};

const bbbCriterionGroups: {
  title: string;
  detail: string;
  criteria: BbbCriterion[];
  bbbPatterns?: BbbPattern[];
  fascicularPatterns?: Fascicular[];
}[] = [
  {
    title: 'LBBB evidence',
    detail: 'Use lateral leads plus V1, not V5/V6 alone.',
    criteria: ['dominantSInV1', 'broadMonophasicRLateral', 'absentLateralQWaves', 'rwptV5V6Over60'],
    bbbPatterns: ['lbbb'],
  },
  {
    title: 'RBBB evidence',
    detail: 'Capture right precordial pattern and lateral terminal S waves.',
    criteria: ['rSrInV1V3', 'wideSlurredSLateral'],
    bbbPatterns: ['rbbb', 'incomplete_rbbb'],
  },
  {
    title: 'LAFB evidence',
    detail: 'Axis is refined in Step 6; these are the QRS morphology clues.',
    criteria: ['lafbQrLateral', 'lafbRsInferior', 'rwptAvlOver45'],
    fascicularPatterns: ['lafb', 'bifascicular', 'trifascicular'],
  },
  {
    title: 'LPFB evidence',
    detail: 'Axis is refined in Step 6; these are the QRS morphology clues.',
    criteria: ['lpfbRsLateral', 'lpfbQrInferior', 'rwptAvfProlonged'],
    fascicularPatterns: ['lpfb', 'bifascicular', 'trifascicular'],
  },
];

function getVisibleBbbCriterionGroups(pattern?: BbbPattern, fascicular?: Fascicular) {
  return bbbCriterionGroups.filter((group) => {
    const matchesPattern = pattern && group.bbbPatterns?.includes(pattern);
    const matchesFascicular = fascicular && group.fascicularPatterns?.includes(fascicular);
    return matchesPattern || matchesFascicular;
  });
}

function pruneBbbCriteria(
  criteria: Partial<Record<BbbCriterion, boolean>> | undefined,
  pattern?: BbbPattern,
  fascicular?: Fascicular
) {
  const allowedCriteria = new Set(getVisibleBbbCriterionGroups(pattern, fascicular).flatMap((group) => group.criteria));
  return Object.fromEntries(
    Object.entries(criteria || {}).filter(([criterion, selected]) => selected && allowedCriteria.has(criterion as BbbCriterion))
  );
}

function selectedBbbCriteria(criteria: Partial<Record<BbbCriterion, boolean>> | undefined) {
  return Object.entries(criteria || {})
    .filter(([, selected]) => selected)
    .map(([criterion]) => criterion as BbbCriterion);
}

function getLeadShapeRows(criteria: Partial<Record<BbbCriterion, boolean>> | undefined) {
  const rows = new Map<string, { lead: string; options: Set<LeadQrsMorphology>; sourceCriteria: BbbCriterion[] }>();

  selectedBbbCriteria(criteria).forEach((criterion) => {
    criterionLeadMorphology[criterion].forEach(({ lead, morphologies }) => {
      const row = rows.get(lead) || { lead, options: new Set<LeadQrsMorphology>(), sourceCriteria: [] };
      morphologies.forEach((morphology) => row.options.add(morphology));
      if (!row.sourceCriteria.includes(criterion)) row.sourceCriteria.push(criterion);
      rows.set(lead, row);
    });
  });

  return Array.from(rows.values()).sort((a, b) => {
    const order = ['I', 'II', 'III', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V5', 'V6'];
    return order.indexOf(a.lead) - order.indexOf(b.lead);
  });
}

function normalizeLeadMorphologyForCriteria(
  leadMorphology: Record<string, LeadQrsMorphology[]> | undefined,
  criteria: Partial<Record<BbbCriterion, boolean>> | undefined
) {
  const allowedByLead = new Map<string, Set<LeadQrsMorphology>>();
  const selectedCriteria = selectedBbbCriteria(criteria);

  selectedCriteria.forEach((criterion) => {
    criterionLeadMorphology[criterion].forEach(({ lead, morphologies }) => {
      const allowed = allowedByLead.get(lead) || new Set<LeadQrsMorphology>();
      morphologies.forEach((morphology) => allowed.add(morphology));
      allowedByLead.set(lead, allowed);
    });
  });

  const next: Record<string, LeadQrsMorphology[]> = {};
  Object.entries(leadMorphology || {}).forEach(([lead, morphologies]) => {
    const allowed = allowedByLead.get(lead);
    const kept = morphologies.filter((morphology) => allowed?.has(morphology));
    if (kept.length) next[lead] = Array.from(new Set(kept));
  });

  selectedCriteria.forEach((criterion) => {
    const entries = criterionLeadMorphology[criterion];
    if (entries.length === 1 && entries[0].autoSelect) {
      const { lead, autoSelect } = entries[0];
      next[lead] = Array.from(new Set([...(next[lead] || []), autoSelect]));
    }
  });

  return next;
}

const qrsSegments: TraceSegment[] = [
  { x1: 5, y1: 62, x2: 25, y2: 62 },
  { x1: 25, y1: 62, x2: 29, y2: 58 },
  { x1: 29, y1: 58, x2: 33, y2: 62 },
  { x1: 33, y1: 62, x2: 49, y2: 62 },
  { x1: 49, y1: 62, x2: 52, y2: 72 },
  { x1: 52, y1: 72, x2: 57, y2: 18 },
  { x1: 57, y1: 18, x2: 62, y2: 76 },
  { x1: 62, y1: 76, x2: 68, y2: 62 },
  { x1: 68, y1: 62, x2: 94, y2: 62 },
];

function toTracePoint(segment: TraceSegment, width: number) {
  return {
    x1: (segment.x1 / 100) * width,
    y1: (segment.y1 / 100) * TRACE_HEIGHT,
    x2: (segment.x2 / 100) * width,
    y2: (segment.y2 / 100) * TRACE_HEIGHT,
  };
}

function TraceLine({ segment, width }: { segment: TraceSegment; width: number }) {
  const point = toTracePoint(segment, width);
  const dx = point.x2 - point.x1;
  const dy = point.y2 - point.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <View
      style={[
        styles.traceSegment,
        {
          left: point.x1,
          top: point.y1 - 1.5,
          transform: [{ rotate: `${angle}deg` }],
          transformOrigin: 'left center',
          width: length,
        },
      ]}
    />
  );
}

function SectionHeader({
  icon,
  title,
  detail,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  detail: string;
}) {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionIcon}>
        <Ionicons name={icon} size={18} color={Palette.primary} />
      </View>
      <View style={styles.sectionCopy}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <Text style={styles.sectionDetail}>{detail}</Text>
      </View>
    </View>
  );
}

function SummaryPill({ label, complete }: { label: string; complete: boolean }) {
  return (
    <View style={[styles.summaryPill, complete ? styles.summaryPillComplete : styles.summaryPillPending]}>
      <Ionicons
        name={complete ? 'checkmark-circle' : 'ellipse-outline'}
        size={14}
        color={complete ? Palette.success : '#cfe6e2'}
      />
      <Text style={[styles.summaryPillText, complete && styles.summaryPillTextComplete]}>{label}</Text>
    </View>
  );
}

function QrsReferenceView() {
  const [traceWidth, setTraceWidth] = React.useState(0);
  const hasLayout = traceWidth > 0;
  const startX = traceWidth * 0.49;
  const endX = traceWidth * 0.68;
  const handleLayout = (event: LayoutChangeEvent) => {
    setTraceWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.referenceTrace} onLayout={handleLayout}>
      {Array.from({ length: 12 }).map((_, index) => (
        <View
          key={`v-${index}`}
          style={[styles.verticalLine, index % 3 === 0 && styles.majorGridLine, { left: `${index * 9}%` }]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={`h-${index}`}
          style={[styles.horizontalLine, index % 2 === 0 && styles.majorGridLine, { top: `${index * 20}%` }]}
        />
      ))}

      {hasLayout && qrsSegments.map((segment, index) => <TraceLine key={`qrs-${index}`} segment={segment} width={traceWidth} />)}

      {hasLayout && (
        <>
          <View style={[styles.qrsWindow, { left: startX - 6, width: endX - startX + 12 }]}>
            <Text style={styles.qrsWindowText}>QRS</Text>
          </View>
          <View style={[styles.qrsBracket, { left: startX, width: endX - startX }]}>
            <Text style={styles.qrsBracketText}>duration</Text>
          </View>
        </>
      )}

      <View style={styles.traceCallout}>
        <Text style={styles.traceCalloutText}>first deflection to J point</Text>
      </View>
    </View>
  );
}

function MeasurementInput({
  label,
  value,
  unit,
  placeholder,
  onChangeText,
  learnTopicId,
  onOpenLearning,
}: {
  label: string;
  value: string;
  unit: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  learnTopicId?: string;
  onOpenLearning?: (topicId: string) => void;
}) {
  return (
    <View style={styles.measurementBlock}>
      {learnTopicId && onOpenLearning ? (
        <LearnableText topicId={learnTopicId} onOpen={onOpenLearning} style={styles.measurementLabel}>{label}</LearnableText>
      ) : (
        <Text style={styles.measurementLabel}>{label}</Text>
      )}
      <View style={styles.inputShell}>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor={Palette.subtle}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChangeText}
        />
        <View style={styles.inputUnit}>
          <Text style={styles.inputUnitText}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

function formatFinding(value: string) {
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function deriveQrsFindings(qrsComplex: ReturnType<typeof useEcgStore.getState>['draft']['qrsComplex']) {
  if (qrsComplex?.presence === 'absent') {
    return {
      findings: [],
      summary: ['QRS complexes absent or no organised ventricular complexes documented'],
      cautions: ['QRS duration, BBB morphology, ventricular axis, ST segment, and QT interval cannot be assessed reliably without identifiable QRS complexes.'],
    };
  }

  const findings = new Set<QrsFinding>(qrsComplex?.findings || []);
  const summary: string[] = [];
  const cautions: string[] = [];
  const qrsMs = qrsComplex?.calculatedMs;
  const voltage = qrsComplex?.voltage;
  const hypertrophy = qrsComplex?.hypertrophy;
  const bbbCriteria = qrsComplex?.bbb?.criteria || {};

  if (qrsMs !== undefined) {
    if (qrsMs >= 120) summary.push(`Wide QRS (${qrsMs} ms)`);
    else if (qrsMs >= 100) summary.push(`Borderline QRS duration (${qrsMs} ms)`);
    else summary.push(`Narrow QRS (${qrsMs} ms)`);
  }

  if (qrsComplex?.bbb?.pattern) {
    findings.add('bbb');
    summary.push(`${formatFinding(qrsComplex.bbb.pattern)} pattern`);
  }
  if (qrsComplex?.bbb?.fascicular) {
    findings.add('bbb');
    summary.push(`${formatFinding(qrsComplex.bbb.fascicular)} conduction pattern`);
  }
  bbbCriterionGroups.forEach((group) => {
    const selected = group.criteria.filter((criterion) => bbbCriteria[criterion]);
    if (selected.length) {
      findings.add('bbb');
      summary.push(`${group.title}: ${selected.map((criterion) => bbbCriterionLabels[criterion]).join('; ')}`);
    }
  });
  const leadShapeSummary = Object.entries(qrsComplex?.leadMorphology || {})
    .filter(([, morphologies]) => morphologies.length)
    .map(([lead, morphologies]) => `${lead}: ${morphologies.map((morphology) => leadMorphologyLabels[morphology]).join(', ')}`);
  if (leadShapeSummary.length) {
    findings.add('bbb');
    summary.push(`Lead-specific QRS morphology: ${leadShapeSummary.join('; ')}`);
  }
  if (findings.has('bbb') && !summary.some((item) => item.includes('BBB') || item.includes('conduction pattern'))) {
    summary.push('BBB/conduction delay assessment flagged');
  }

  const sokolowLyon =
    (hypertrophy?.lvhSInV1 ?? 0) + (hypertrophy?.lvhRInV5V6 ?? 0);
  const cornell = (hypertrophy?.cornellRaVL ?? 0) + (hypertrophy?.cornellSV3 ?? 0);
  const rvhVoltage = (hypertrophy?.rvhRInV1 ?? 0) > 7 || (hypertrophy?.rvhRInV1 ?? 0) > (hypertrophy?.rvhSInV5V6 ?? Infinity);

  if (sokolowLyon >= 35 || cornell >= 28 || hypertrophy?.strainPattern) {
    findings.add('hypertrophy');
    summary.push('LVH voltage/strain criteria present');
  }
  if (rvhVoltage) {
    findings.add('hypertrophy');
    summary.push('RVH voltage criteria present');
  }
  if (findings.has('hypertrophy') && !summary.some((item) => item.includes('HV') || item.includes('hypertrophy'))) {
    summary.push('Hypertrophy assessment flagged');
  }

  if (voltage?.lowLimb || voltage?.lowPrecordial) {
    findings.add('low_voltage');
    summary.push('Low voltage present');
  }
  if (voltage?.electricalAlternans) {
    findings.add('alternans');
    summary.push('Electrical alternans present');
  }
  if (findings.has('low_voltage') && !summary.some((item) => item.includes('Low voltage'))) {
    summary.push('Low voltage flagged');
  }
  if (findings.has('alternans') && !summary.some((item) => item.includes('alternans'))) {
    summary.push('Electrical alternans flagged');
  }
  if (qrsComplex?.deltaWave) {
    findings.add('pre_excitation');
    summary.push('Delta wave / pre-excitation pattern');
  }
  if (qrsComplex?.wideComplexTachycardia?.present) {
    findings.add('wide_complex_tachycardia');
    summary.push('Wide-complex tachycardia assessment positive');
    if (qrsComplex.wideComplexTachycardia.vtConcern) {
      summary.push(`${formatFinding(qrsComplex.wideComplexTachycardia.vtConcern)} VT concern`);
    }
  }
  if (findings.has('paced')) summary.push('Paced QRS pattern');
  if (findings.has('ventricular_origin')) summary.push('Ventricular-origin QRS pattern');
  if (findings.has('toxicologic')) summary.push('Toxicologic/sodium-channel blockade pattern flagged');
  if (findings.has('other') && qrsComplex?.otherDetails) summary.push(qrsComplex.otherDetails);

  if (findings.has('bbb') && findings.has('hypertrophy')) {
    cautions.push('Hypertrophy voltage can coexist with BBB, but interpret criteria cautiously in wide QRS or LBBB.');
  }
  if (!summary.length) summary.push('Awaiting QRS findings');

  return { findings: Array.from(findings), summary, cautions };
}

function appendFinding(findings: QrsFinding[] | undefined, finding: QrsFinding) {
  return Array.from(new Set([...(findings || []).filter((item) => item !== 'normal_conduction'), finding]));
}

export default function Step5() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const qrsComplex = draft.qrsComplex || {};

  const [boxesText, setBoxesText] = React.useState(qrsComplex.durationSmallBoxes?.toString() || '');

  React.useEffect(() => {
    if (qrsComplex.durationSmallBoxes === undefined) {
      setBoxesText('');
    }
  }, [qrsComplex.durationSmallBoxes]);

  const handleBoxesChange = (text: string) => {
    setBoxesText(text);
    const boxes = parseFloat(text);
    const nextValue = Number.isFinite(boxes) ? boxes : undefined;

    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        presence: 'present',
        absentReason: undefined,
        durationSmallBoxes: nextValue,
        calculatedMs: nextValue !== undefined ? Math.round(nextValue * 40) : undefined,
      },
    });
  };

  const markQrsPresence = (presence: 'present' | 'absent' | 'unclear') => {
    if (presence === 'absent') {
      setBoxesText('');
      updateDraft({
        qrsComplex: {
          presence,
          absentReason: qrsComplex.absentReason,
          derivedSummary: ['QRS complexes absent or no organised ventricular complexes documented'],
          cautions: ['QRS-dependent measurements and morphology are not assessable.'],
        },
        stSegment: {
          ...draft.stSegment,
          status: 'not_assessable',
          leads: [],
          reciprocalLeads: [],
          hasReciprocalChanges: false,
          smallBoxes: undefined,
        },
        qtInterval: {
          measurementStatus: 'unmeasurable',
          unmeasurableReason: 'absent_qrs_complexes',
        },
      });
      return;
    }

    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        presence,
        ...(presence === 'present' && { absentReason: undefined }),
      },
    });
  };

  const toggleFinding = (finding: QrsFinding) => {
    const currentFindings = qrsComplex.findings || [];
    const isSelected = currentFindings.includes(finding);
    const nextFindings: QrsFinding[] =
      finding === 'normal_conduction'
        ? isSelected
          ? currentFindings.filter((item) => item !== finding)
          : ['normal_conduction']
        : isSelected
          ? currentFindings.filter((item) => item !== finding)
          : [...currentFindings.filter((item) => item !== 'normal_conduction'), finding];

    updateDraft({ qrsComplex: { ...qrsComplex, presence: 'present', absentReason: undefined, findings: nextFindings } });
  };

  const updateHypertrophy = (field: HypertrophyField, value: string) => {
    const num = parseFloat(value);
    const currentFindings = qrsComplex.findings || [];
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: Number.isFinite(num)
          ? appendFinding(currentFindings, 'hypertrophy')
          : currentFindings,
        hypertrophy: {
          ...qrsComplex.hypertrophy,
          [field]: Number.isFinite(num) ? num : undefined,
        },
      },
    });
  };

  const setBbbPattern = (pattern: BbbPattern) => {
    const fascicular = qrsComplex.bbb?.fascicular;
    const criteria = pruneBbbCriteria(qrsComplex.bbb?.criteria, pattern, fascicular);
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: appendFinding(qrsComplex.findings, 'bbb'),
        leadMorphology: normalizeLeadMorphologyForCriteria(qrsComplex.leadMorphology, criteria),
        bbb: {
          ...qrsComplex.bbb,
          pattern,
          criteria,
        },
      },
    });
  };

  const setFascicular = (fascicular: Fascicular) => {
    const current = qrsComplex.bbb?.fascicular;
    const nextFascicular = current === fascicular ? undefined : fascicular;
    const criteria = pruneBbbCriteria(qrsComplex.bbb?.criteria, qrsComplex.bbb?.pattern, nextFascicular);
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: appendFinding(qrsComplex.findings, 'bbb'),
        leadMorphology: normalizeLeadMorphologyForCriteria(qrsComplex.leadMorphology, criteria),
        bbb: {
          ...qrsComplex.bbb,
          fascicular: nextFascicular,
          criteria,
        },
      },
    });
  };

  const toggleBbbCriterion = (criterion: BbbCriterion) => {
    const criteria = {
      ...qrsComplex.bbb?.criteria,
      [criterion]: !qrsComplex.bbb?.criteria?.[criterion],
    };
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: appendFinding(qrsComplex.findings, 'bbb'),
        leadMorphology: normalizeLeadMorphologyForCriteria(qrsComplex.leadMorphology, criteria),
        bbb: {
          ...qrsComplex.bbb,
          criteria,
        },
      },
    });
  };

  const toggleLeadMorphology = (lead: string, morphology: LeadQrsMorphology) => {
    const current = qrsComplex.leadMorphology?.[lead] || [];
    const nextForLead = current.includes(morphology)
      ? current.filter((item) => item !== morphology)
      : [...current, morphology];
    const nextLeadMorphology = {
      ...(qrsComplex.leadMorphology || {}),
      [lead]: nextForLead,
    };
    if (!nextForLead.length) delete nextLeadMorphology[lead];

    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: appendFinding(qrsComplex.findings, 'bbb'),
        leadMorphology: nextLeadMorphology,
      },
    });
  };

  const toggleDeltaWave = () => {
    const nextDeltaWave = !qrsComplex.deltaWave;
    const currentFindings = qrsComplex.findings || [];
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: nextDeltaWave
          ? appendFinding(currentFindings, 'pre_excitation')
          : currentFindings.filter((item) => item !== 'pre_excitation'),
        deltaWave: nextDeltaWave,
      },
    });
  };

  const setVoltageFlag = (field: 'lowLimb' | 'lowPrecordial' | 'electricalAlternans') => {
    const nextValue = !qrsComplex.voltage?.[field];
    const finding: QrsFinding = field === 'electricalAlternans' ? 'alternans' : 'low_voltage';
    const currentFindings = qrsComplex.findings || [];
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: nextValue
          ? appendFinding(currentFindings, finding)
          : currentFindings,
        voltage: {
          ...qrsComplex.voltage,
          [field]: nextValue,
        },
      },
    });
  };

  const updateWideComplex = (
    field: 'present' | 'captureFusionBeats' | 'extremeAxis',
    value?: boolean
  ) => {
    const currentFindings = qrsComplex.findings || [];
    const nextPresent = field === 'present' ? value ?? !qrsComplex.wideComplexTachycardia?.present : qrsComplex.wideComplexTachycardia?.present;
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings:
          field === 'present'
            ? nextPresent
              ? appendFinding(currentFindings, 'wide_complex_tachycardia')
              : currentFindings.filter((item) => item !== 'wide_complex_tachycardia')
            : currentFindings,
        wideComplexTachycardia: {
          ...qrsComplex.wideComplexTachycardia,
          [field]: value ?? !qrsComplex.wideComplexTachycardia?.[field],
        },
      },
    });
  };

  const updateOtherDetails = (otherDetails: string) => {
    updateDraft({
      qrsComplex: {
        ...qrsComplex,
        findings: otherDetails
          ? appendFinding(qrsComplex.findings, 'other')
          : qrsComplex.findings,
        otherDetails,
      },
    });
  };

  const qrsAbsent = qrsComplex.presence === 'absent';
  const durationComplete = qrsAbsent || (qrsComplex.durationSmallBoxes !== undefined && qrsComplex.durationSmallBoxes > 0);
  const findingsComplete = qrsAbsent || !!qrsComplex.findings?.length || !!qrsComplex.bbb?.pattern || !!qrsComplex.deltaWave || !!qrsComplex.voltage?.lowLimb || !!qrsComplex.voltage?.lowPrecordial || !!qrsComplex.voltage?.electricalAlternans;
  const derivedQrs = deriveQrsFindings(qrsComplex);
  const isValid = durationComplete && findingsComplete;
  const qrsLabel =
    qrsAbsent
      ? 'QRS absent / not assessable'
      : qrsComplex.calculatedMs !== undefined
      ? `${qrsComplex.calculatedMs} ms QRS`
      : findingsComplete
        ? 'Findings selected'
        : 'Awaiting QRS checks';
  const visibleBbbCriterionGroups = getVisibleBbbCriterionGroups(qrsComplex.bbb?.pattern, qrsComplex.bbb?.fascicular);
  const leadShapeRows = getLeadShapeRows(qrsComplex.bbb?.criteria);

  React.useEffect(() => {
    const summaryChanged = JSON.stringify(qrsComplex.derivedSummary || []) !== JSON.stringify(derivedQrs.summary);
    const cautionsChanged = JSON.stringify(qrsComplex.cautions || []) !== JSON.stringify(derivedQrs.cautions);
    const findingsChanged = JSON.stringify(qrsComplex.findings || []) !== JSON.stringify(derivedQrs.findings);

    if (summaryChanged || cautionsChanged || findingsChanged) {
      updateDraft({
        qrsComplex: {
          ...qrsComplex,
          findings: derivedQrs.findings,
          derivedSummary: derivedQrs.summary,
          cautions: derivedQrs.cautions,
        },
      });
    }
  }, [JSON.stringify(derivedQrs.findings), JSON.stringify(derivedQrs.summary), JSON.stringify(derivedQrs.cautions)]);

  const findingOptions: Array<{
    label: string;
    value: QrsFinding;
    detail: string;
    icon: keyof typeof Ionicons.glyphMap;
    badge?: string;
  }> = [
    {
      label: 'Normal conduction',
      value: 'normal_conduction',
      detail: 'No BBB, hypertrophy voltage, pacing, pre-excitation, or low voltage identified.',
      icon: 'checkmark-circle-outline',
    },
    {
      label: 'Hypertrophy',
      value: 'hypertrophy',
      detail: 'Voltage criteria suggest chamber enlargement.',
      icon: 'bar-chart-outline',
      badge: 'Voltage',
    },
    {
      label: 'BBB pattern',
      value: 'bbb',
      detail: 'Wide or patterned ventricular conduction delay.',
      icon: 'git-branch-outline',
      badge: 'Wide',
    },
    {
      label: 'Other',
      value: 'other',
      detail: 'Capture morphology that does not fit the common buckets.',
      icon: 'ellipsis-horizontal-circle-outline',
    },
    {
      label: 'Paced',
      value: 'paced',
      detail: 'Pacer spike or paced QRS morphology.',
      icon: 'flash-outline',
    },
    {
      label: 'Ventricular',
      value: 'ventricular_origin',
      detail: 'Ventricular escape, AIVR, or ventricular tachycardia pattern.',
      icon: 'warning-outline',
      badge: 'High risk',
    },
    {
      label: 'Low voltage',
      value: 'low_voltage',
      detail: 'Low QRS amplitude in limb or precordial leads.',
      icon: 'remove-circle-outline',
    },
    {
      label: 'Alternans',
      value: 'alternans',
      detail: 'Beat-to-beat QRS amplitude alternation.',
      icon: 'swap-horizontal-outline',
    },
    {
      label: 'Toxicologic',
      value: 'toxicologic',
      detail: 'QRS widening pattern concerning for sodium-channel blockade.',
      icon: 'flask-outline',
      badge: 'Tox',
    },
  ];
  const qrsFindingLearningTopics: Record<QrsFinding, string> = {
    normal_conduction: 'input.qrs.finding.normal',
    hypertrophy: 'input.qrs.finding.hypertrophy',
    bbb: 'input.qrs.finding.bbb',
    paced: 'input.qrs.finding.paced',
    ventricular_origin: 'input.qrs.finding.ventricularOrigin',
    low_voltage: 'input.qrs.finding.lowVoltage',
    alternans: 'input.qrs.finding.alternans',
    toxicologic: 'input.qrs.finding.toxicologic',
    pre_excitation: 'input.qrs.deltaWave',
    wide_complex_tachycardia: 'input.qrs.wctSafety',
    other: 'input.qrs.finding.other',
  };
  const bbbPatternLearningTopics: Record<BbbPattern, string> = {
    rbbb: 'input.qrs.bbb.rbbb',
    lbbb: 'input.qrs.bbb.lbbb',
    incomplete_rbbb: 'input.qrs.bbb.incompleteRbbb',
    ivcd: 'input.qrs.bbb.ivcd',
  };

  const bbbOptions: Array<{ label: string; value: BbbPattern; detail: string }> = [
    { label: 'RBBB', value: 'rbbb', detail: "rsR' in V1-V3 plus wide/slurred S in I, aVL, V5-V6" },
    { label: 'LBBB', value: 'lbbb', detail: 'Dominant S in V1 plus broad lateral R, absent lateral Q, or prolonged lateral RWPT' },
    { label: 'Incomplete RBBB', value: 'incomplete_rbbb', detail: "RBBB-like V1-V3 pattern with QRS <120 ms" },
    { label: 'IVCD', value: 'ivcd', detail: 'Non-specific intraventricular delay' },
  ];

  const hypertrophyInputs: Array<{ label: string; field: HypertrophyField; value?: number }> = [
    { label: 'S in V1', field: 'lvhSInV1', value: qrsComplex.hypertrophy?.lvhSInV1 },
    { label: 'R in V5/V6', field: 'lvhRInV5V6', value: qrsComplex.hypertrophy?.lvhRInV5V6 },
    { label: 'R in V1', field: 'rvhRInV1', value: qrsComplex.hypertrophy?.rvhRInV1 },
    { label: 'S in V5/V6', field: 'rvhSInV5V6', value: qrsComplex.hypertrophy?.rvhSInV5V6 },
    { label: 'R in aVL', field: 'cornellRaVL', value: qrsComplex.hypertrophy?.cornellRaVL },
    { label: 'S in V3', field: 'cornellSV3', value: qrsComplex.hypertrophy?.cornellSV3 },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroTitleBlock}>
              <Text style={styles.kicker}>Step 5 · QRS complex</Text>
              <Text style={styles.heroTitle}>Assess ventricular depolarization and conduction.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>5</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroSummary}>
            <View style={styles.heroSummaryCopy}>
              <Text style={styles.heroSummaryLabel}>QRS read</Text>
              <Text style={styles.heroSummaryValue}>{qrsLabel}</Text>
            </View>
            <View style={styles.summaryPillColumn}>
              <SummaryPill label="Duration" complete={durationComplete} />
              <SummaryPill label="Findings" complete={findingsComplete} />
            </View>
          </View>
        </View>

        <View style={styles.traceCard}>
          <View style={styles.traceHeader}>
            <View>
              <Text style={styles.traceTitle}>QRS reference view</Text>
              <Text style={styles.traceSubtitle}>Measure from the first QRS deflection to the J point.</Text>
            </View>
            <View style={styles.traceBadge}>
              <Text style={styles.traceBadgeText}>&lt;120 ms</Text>
            </View>
          </View>

          <QrsReferenceView />

          <View style={styles.referenceFooter}>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>1 small box = 40 ms</Text>
            </View>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>normal &lt;3 boxes</Text>
            </View>
          </View>
        </View>
        <StepLearningButton topicId="step.qrs" onOpen={learning.openTopic} />

        <View style={styles.card}>
          <SectionHeader
            icon="pulse-outline"
            title="QRS visibility"
            detail="First confirm whether organised QRS complexes can be identified."
          />
          <View style={styles.toggleRow}>
            {[
              { label: 'Present', value: 'present' as const },
              { label: 'Absent', value: 'absent' as const },
              { label: 'Unclear', value: 'unclear' as const },
            ].map((option) => (
              <Pressable
                key={option.value}
                style={[styles.toggleButton, qrsComplex.presence === option.value && styles.toggleButtonActive]}
                onPress={() => markQrsPresence(option.value)}
              >
                <Text style={[styles.toggleButtonText, qrsComplex.presence === option.value && styles.toggleButtonTextActive]}>
                  {option.label}
                </Text>
              </Pressable>
            ))}
          </View>
          {qrsAbsent && (
            <>
              <Text style={styles.groupLabel}>Reason QRS is absent or not organised</Text>
              <View style={styles.chipGrid}>
                {[
                  { label: 'Asystole', value: 'asystole' },
                  { label: 'VF / chaotic baseline', value: 'ventricular_fibrillation' },
                  { label: 'Artifact', value: 'artifact' },
                  { label: 'Lead issue', value: 'lead_disconnection' },
                  { label: 'Unclear', value: 'unclear' },
                  { label: 'Other', value: 'other' },
                ].map((reason) => {
                  const selected = qrsComplex.absentReason === reason.value;
                  return (
                    <Pressable
                      key={reason.value}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => updateDraft({ qrsComplex: { ...qrsComplex, presence: 'absent', absentReason: reason.value as any } })}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{reason.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {!qrsAbsent && (
        <View style={styles.card}>
          <SectionHeader
            icon="resize-outline"
            title="QRS duration"
            detail="Count small boxes from the first deflection to the J point."
          />

          <MeasurementInput
            label="Small boxes"
            value={boxesText}
            unit="small boxes"
            placeholder="2.0"
            onChangeText={handleBoxesChange}
            learnTopicId="input.qrs.measurement"
            onOpenLearning={learning.openTopic}
          />

          <View style={styles.calculatedPanel}>
            <Text style={styles.calculatedLabel}>Calculated</Text>
            <Text style={styles.calculatedValue} selectable>
              {qrsComplex.calculatedMs ?? '--'} <Text style={styles.calculatedUnit}>ms</Text>
            </Text>
          </View>
        </View>
        )}

        {!qrsAbsent && (
        <View style={styles.card}>
          <SectionHeader
            icon="analytics-outline"
            title="QRS findings"
            detail="Select all that apply. BBB, hypertrophy, low voltage, paced rhythm, and other findings can coexist."
          />
          <LearnableText topicId="input.qrs.findings" onOpen={learning.openTopic} style={styles.groupLabel}>QRS findings input guide</LearnableText>

          <View style={styles.optionStack}>
            {findingOptions.map((option) => {
              const selected = qrsComplex.findings?.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionRow, selected && styles.optionRowActive]}
                  onPress={() => toggleFinding(option.value)}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                    <Ionicons name={option.icon} size={18} color={selected ? Palette.paper : Palette.primary} />
                  </View>
                  <View style={styles.optionCopy}>
                    <View style={styles.optionTitleRow}>
                      <LearnableText topicId={qrsFindingLearningTopics[option.value]} onOpen={learning.openTopic} style={[styles.optionTitle, selected && styles.optionTitleActive]}>
                        {option.label}
                      </LearnableText>
                      {option.badge && (
                        <View style={option.value === 'bbb' || option.value === 'ventricular_origin' ? styles.warningBadge : styles.neutralBadge}>
                          <Text style={option.value === 'bbb' || option.value === 'ventricular_origin' ? styles.warningBadgeText : styles.neutralBadgeText}>
                            {option.badge}
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text style={[styles.optionDetail, selected && styles.optionDetailActive]}>{option.detail}</Text>
                  </View>
                  <Ionicons
                    name={selected ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={selected ? Palette.primary : Palette.lineStrong}
                  />
                </Pressable>
              );
            })}
          </View>

          {qrsComplex.findings?.includes('hypertrophy') && (
            <View style={styles.detailPanel}>
              <LearnableText topicId="input.qrs.finding.hypertrophy" onOpen={learning.openTopic} style={styles.detailPanelTitle}>Voltage measurements</LearnableText>
              <View style={styles.hypertrophyGrid}>
                {hypertrophyInputs.map((input) => (
                  <View key={input.field} style={styles.hypertrophyInput}>
                    <LearnableText topicId="input.qrs.finding.hypertrophy" onOpen={learning.openTopic} style={styles.hypertrophyLabel}>{input.label}</LearnableText>
                    <View style={styles.compactInputShell}>
                      <TextInput
                        style={styles.compactInput}
                        keyboardType="decimal-pad"
                        placeholder="0"
                        placeholderTextColor={Palette.subtle}
                        value={input.value?.toString() || ''}
                        onChangeText={(text) => updateHypertrophy(input.field, text)}
                      />
                      <Text style={styles.compactUnit}>mm</Text>
                    </View>
                  </View>
                ))}
              </View>
              <Pressable
                style={[styles.strainCard, qrsComplex.hypertrophy?.strainPattern && styles.strainCardActive]}
                onPress={() =>
                  updateDraft({
                    qrsComplex: {
                      ...qrsComplex,
                      hypertrophy: {
                        ...qrsComplex.hypertrophy,
                        strainPattern: !qrsComplex.hypertrophy?.strainPattern,
                      },
                    },
                  })
                }
              >
                <LearnableText topicId="input.qrs.finding.hypertrophy" onOpen={learning.openTopic} style={[styles.strainText, qrsComplex.hypertrophy?.strainPattern && styles.strainTextActive]}>
                  LVH/RVH strain pattern present
                </LearnableText>
              </Pressable>
              <Text style={styles.detailHint}>RVH is suggested if R in V1 is greater than 7 mm or R:S ratio in V1 is greater than 1.</Text>
            </View>
          )}

          {qrsComplex.findings?.includes('bbb') && (
            <View style={styles.detailPanel}>
              <LearnableText topicId="input.qrs.finding.bbb" onOpen={learning.openTopic} style={styles.detailPanelTitle}>Bundle branch pattern</LearnableText>
              <View style={styles.bbbStack}>
                {bbbOptions.map((option) => {
                  const selected = qrsComplex.bbb?.pattern === option.value;
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.bbbOption, selected && styles.bbbOptionActive]}
                      onPress={() => setBbbPattern(option.value)}
                    >
                      <LearnableText topicId={bbbPatternLearningTopics[option.value]} onOpen={learning.openTopic} style={[styles.bbbOptionBadge, selected && styles.bbbOptionBadgeActive]}>
                        {option.label}
                      </LearnableText>
                      <Text style={[styles.bbbOptionText, selected && styles.bbbOptionTextActive]}>{option.detail}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.fascicularRow}>
                {(['lafb', 'lpfb', 'bifascicular', 'trifascicular'] as Fascicular[]).map((fascicular) => {
                  const selected = qrsComplex.bbb?.fascicular === fascicular;
                  const label =
                    fascicular === 'lafb'
                      ? 'LAFB'
                      : fascicular === 'lpfb'
                        ? 'LPFB'
                        : fascicular === 'bifascicular'
                          ? 'Bifascicular'
                          : 'Trifascicular';
                  return (
                    <Pressable
                      key={fascicular}
                      style={[styles.fascicularButton, selected && styles.fascicularButtonActive]}
                      onPress={() => setFascicular(fascicular)}
                    >
                      <Text style={[styles.fascicularText, selected && styles.fascicularTextActive]}>{label}</Text>
                      <Pressable
                        accessibilityLabel={`Learn about ${label}`}
                        hitSlop={12}
                        style={[styles.fascicularInfoButton, selected && styles.fascicularInfoButtonActive]}
                        onPress={(event) => {
                          event.stopPropagation();
                          learning.openTopic('input.qrs.bbb.fascicular');
                        }}
                      >
                        <Ionicons name="information-circle-outline" size={18} color={selected ? Palette.paper : Palette.primaryMuted} />
                      </Pressable>
                    </Pressable>
                  );
                })}
              </View>

              {visibleBbbCriterionGroups.length > 0 ? (
                <View style={styles.criteriaStack}>
                  {visibleBbbCriterionGroups.map((group) => (
                    <View key={group.title} style={styles.criteriaGroup}>
                      <View style={styles.criteriaHeader}>
                        <LearnableText topicId={group.title.includes('RBBB') ? 'input.qrs.bbb.rbbb' : group.title.includes('LBBB') ? 'input.qrs.bbb.lbbb' : 'input.qrs.bbb.fascicular'} onOpen={learning.openTopic} style={styles.criteriaTitle}>
                          {group.title}
                        </LearnableText>
                        <Text style={styles.criteriaDetail}>{group.detail}</Text>
                      </View>
                      <View style={styles.criteriaChipGrid}>
                        {group.criteria.map((criterion) => {
                          const selected = !!qrsComplex.bbb?.criteria?.[criterion];
                          return (
                            <Pressable
                              key={criterion}
                              style={[styles.criteriaChip, selected && styles.criteriaChipActive]}
                              onPress={() => toggleBbbCriterion(criterion)}
                            >
                              <Ionicons
                                name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                                size={16}
                                color={selected ? Palette.paper : Palette.primary}
                              />
                              <Text style={[styles.criteriaChipText, selected && styles.criteriaChipTextActive]}>
                                {bbbCriterionLabels[criterion]}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <View style={styles.criteriaEmptyState}>
                  <Ionicons name="git-branch-outline" size={17} color={Palette.primaryMuted} />
                  <Text style={styles.criteriaEmptyText}>
                    Select RBBB, LBBB, or a fascicular pattern to enter the matching lead-specific evidence.
                  </Text>
                </View>
              )}
            </View>
          )}

          {qrsComplex.findings?.includes('other') && (
            <View style={styles.detailPanel}>
              <Text style={styles.detailPanelTitle}>Other morphology notes</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Describe the observed QRS morphology"
                placeholderTextColor={Palette.subtle}
                multiline
                value={qrsComplex.otherDetails || ''}
                onChangeText={updateOtherDetails}
              />
            </View>
          )}
        </View>
        )}

        <View style={styles.derivedPanel}>
          <SectionHeader
            icon="sparkles-outline"
            title="QRS summary"
            detail="Based on QRS duration, selected findings, lead shapes, voltage, bundle-branch evidence, and wide-complex tachycardia clues."
          />
          <View style={styles.reasoningStack}>
            {derivedQrs.summary.map((item, index) => (
              <View key={`${item}-${index}`} style={styles.reasoningRow}>
                <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                <Text style={styles.reasoningText}>{item}</Text>
              </View>
            ))}
          </View>
          {derivedQrs.cautions.length > 0 && (
            <View style={styles.cautionPanel}>
              {derivedQrs.cautions.map((item, index) => (
                <View key={`${item}-${index}`} style={styles.reasoningRow}>
                  <Ionicons name="warning-outline" size={16} color={Palette.accent} />
                  <Text style={styles.cautionText}>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {!qrsAbsent && (
        <View style={styles.card}>
          <SectionHeader
            icon="git-compare-outline"
            title="Lead-shape evidence"
            detail="Lead-specific morphology is based on the bundle-branch or fascicular evidence selected above."
          />
          {leadShapeRows.length > 0 ? (
            <View style={styles.leadShapeStack}>
              {leadShapeRows.map((row) => (
                <View key={row.lead} style={styles.leadShapeRow}>
                  <View style={styles.leadShapeHeader}>
                    <View style={styles.leadBadge}>
                      <Text style={styles.leadBadgeText}>{row.lead}</Text>
                    </View>
                    <Text style={styles.leadShapeSource}>
                      {row.sourceCriteria.map((criterion) => bbbCriterionLabels[criterion]).join(' / ')}
                    </Text>
                  </View>
                  <View style={styles.chipGrid}>
                    {Array.from(row.options).map((morphology) => {
                      const selected = qrsComplex.leadMorphology?.[row.lead]?.includes(morphology);
                      return (
                        <Pressable
                          key={`${row.lead}-${morphology}`}
                          style={[styles.chip, selected && styles.chipActive]}
                          onPress={() => toggleLeadMorphology(row.lead, morphology)}
                        >
                          <Text style={[styles.chipText, selected && styles.chipTextActive]}>
                            {leadMorphologyLabels[morphology]}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={styles.criteriaEmptyState}>
              <Ionicons name="list-outline" size={17} color={Palette.primaryMuted} />
              <Text style={styles.criteriaEmptyText}>
                Select BBB or fascicular evidence above to generate lead-specific QRS morphology choices.
              </Text>
            </View>
          )}
        </View>
        )}

        {!qrsAbsent && (
        <View style={styles.card}>
          <SectionHeader
            icon="remove-circle-outline"
            title="Voltage and WCT safety checks"
            detail="Flag low voltage, alternans, and wide-complex tachycardia clues that change urgency."
          />
          <LearnableText topicId="input.qrs.wctSafety" onOpen={learning.openTopic} style={styles.groupLabel}>Voltage and WCT input guide</LearnableText>
          <View style={styles.chipGrid}>
            {[
              { label: 'Low limb voltage', field: 'lowLimb' as const },
              { label: 'Low precordial voltage', field: 'lowPrecordial' as const },
              { label: 'Electrical alternans', field: 'electricalAlternans' as const },
            ].map((option) => {
              const selected = qrsComplex.voltage?.[option.field];
              return (
                <Pressable key={option.field} style={[styles.chip, selected && styles.chipActive]} onPress={() => setVoltageFlag(option.field)}>
                  <LearnableText topicId="input.qrs.wctSafety" onOpen={learning.openTopic} style={[styles.chipText, selected && styles.chipTextActive]}>
                    {option.label}
                  </LearnableText>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.toggleRow}>
            {[true, false].map((value) => (
              <Pressable
                key={String(value)}
                style={[styles.toggleButton, qrsComplex.wideComplexTachycardia?.present === value && styles.toggleButtonActive]}
                onPress={() => updateWideComplex('present', value)}
              >
                <LearnableText topicId="input.qrs.wctSafety" onOpen={learning.openTopic} style={[styles.toggleButtonText, qrsComplex.wideComplexTachycardia?.present === value && styles.toggleButtonTextActive]}>
                  {value ? 'WCT present' : 'No WCT'}
                </LearnableText>
              </Pressable>
            ))}
          </View>

          {qrsComplex.wideComplexTachycardia?.present && (
            <>
              <View style={styles.chipGrid}>
                {[
                  { label: 'Capture/fusion beats', field: 'captureFusionBeats' as const },
                  { label: 'Extreme axis', field: 'extremeAxis' as const },
                ].map((option) => {
                  const selected = qrsComplex.wideComplexTachycardia?.[option.field];
                  return (
                    <Pressable key={option.field} style={[styles.chip, selected && styles.chipActive]} onPress={() => updateWideComplex(option.field)}>
                      <LearnableText topicId="input.qrs.wctSafety" onOpen={learning.openTopic} style={[styles.chipText, selected && styles.chipTextActive]}>
                        {option.label}
                      </LearnableText>
                    </Pressable>
                  );
                })}
              </View>
              <LearnableText topicId="input.qrs.wctSafety" onOpen={learning.openTopic} style={styles.groupLabel}>Concordance</LearnableText>
              <View style={styles.chipGrid}>
                {(['positive', 'negative', 'absent', 'unclear'] as const).map((value) => {
                  const selected = qrsComplex.wideComplexTachycardia?.concordance === value;
                  return (
                    <Pressable
                      key={value}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() =>
                        updateDraft({
                          qrsComplex: {
                            ...qrsComplex,
                            wideComplexTachycardia: { ...qrsComplex.wideComplexTachycardia, concordance: value },
                          },
                        })
                      }
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value}</Text>
                    </Pressable>
                  );
                })}
              </View>
              <LearnableText topicId="input.qrs.wctSafety" onOpen={learning.openTopic} style={styles.groupLabel}>VT concern</LearnableText>
              <View style={styles.chipGrid}>
                {(['low', 'intermediate', 'high'] as const).map((value) => {
                  const selected = qrsComplex.wideComplexTachycardia?.vtConcern === value;
                  return (
                    <Pressable
                      key={value}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() =>
                        updateDraft({
                          qrsComplex: {
                            ...qrsComplex,
                            wideComplexTachycardia: { ...qrsComplex.wideComplexTachycardia, vtConcern: value },
                          },
                        })
                      }
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>
        )}

        {!qrsAbsent && (
        <Pressable style={[styles.deltaCard, qrsComplex.deltaWave && styles.deltaCardActive]} onPress={toggleDeltaWave}>
          <View style={[styles.deltaIcon, qrsComplex.deltaWave && styles.deltaIconActive]}>
            <Ionicons name="warning-outline" size={20} color={qrsComplex.deltaWave ? Palette.paper : Palette.accent} />
          </View>
          <View style={styles.deltaCopy}>
            <LearnableText topicId="input.qrs.deltaWave" onOpen={learning.openTopic} style={[styles.deltaTitle, qrsComplex.deltaWave && styles.deltaTitleActive]}>
              Delta wave
            </LearnableText>
            <Text style={[styles.deltaDetail, qrsComplex.deltaWave && styles.deltaDetailActive]}>
              Slurred QRS upstroke suggesting pre-excitation.
            </Text>
          </View>
          <Ionicons
            name={qrsComplex.deltaWave ? 'checkmark-circle' : 'ellipse-outline'}
            size={22}
            color={qrsComplex.deltaWave ? Palette.accent : Palette.lineStrong}
          />
        </Pressable>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Interpretive context</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Rate</Text>
            <Text style={styles.summaryValue}>{draft.heartRate?.calculatedBpm || '--'} bpm</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>P wave</Text>
            <Text style={styles.summaryValue}>{draft.pWave?.morphology === 'normal' ? 'Normal' : draft.pWave?.morphology || '--'}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>PR interval</Text>
            <Text style={styles.summaryValue}>{draft.prInterval?.calculatedMs || '--'} ms</Text>
          </View>
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            A wide QRS greater than 120 ms suggests ventricular origin or delayed conduction through the His-Purkinje
            system.
          </Text>
        </View>
      </ScrollView>
      {learning.sheet}

      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={Palette.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <Pressable
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={() => {
            if (isValid) router.push('/(ecg-flow)/step-6');
          }}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Complete QRS'}</Text>
          <Ionicons name="arrow-forward" size={18} color={Palette.paper} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.canvas,
    flex: 1,
  },
  scrollContent: {
    gap: 16,
    padding: Layout.pagePadding,
    paddingBottom: 24,
  },
  hero: {
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    boxShadow: Palette.shadow,
    gap: 18,
    overflow: 'hidden',
    padding: 20,
  },
  heroTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'space-between',
  },
  heroTitleBlock: {
    flex: 1,
    gap: 7,
  },
  kicker: {
    color: '#b9d8d4',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Palette.paper,
    fontSize: 26,
    fontWeight: '900',
    lineHeight: 31,
  },
  stepBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.12)',
    borderColor: 'rgba(255, 253, 248, 0.2)',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    minWidth: 58,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  stepBadgeValue: {
    color: Palette.paper,
    fontSize: 20,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  stepBadgeLabel: {
    color: '#cfe6e2',
    fontSize: 11,
    fontWeight: '800',
  },
  progressTrack: {
    backgroundColor: 'rgba(255, 253, 248, 0.16)',
    borderRadius: 999,
    height: 7,
    overflow: 'hidden',
  },
  progressFill: {
    backgroundColor: Palette.accent,
    borderRadius: 999,
    height: '100%',
    width: '41%',
  },
  heroSummary: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.1)',
    borderColor: 'rgba(255, 253, 248, 0.16)',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
  heroSummaryCopy: {
    flex: 1,
    gap: 4,
  },
  heroSummaryLabel: {
    color: '#cfe6e2',
    fontSize: 12,
    fontWeight: '800',
  },
  heroSummaryValue: {
    color: Palette.paper,
    fontSize: 17,
    fontWeight: '900',
    lineHeight: 22,
  },
  summaryPillColumn: {
    alignItems: 'flex-end',
    gap: 7,
  },
  summaryPill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  summaryPillComplete: {
    backgroundColor: Palette.successSoft,
  },
  summaryPillPending: {
    backgroundColor: 'rgba(255, 253, 248, 0.12)',
  },
  summaryPillText: {
    color: '#cfe6e2',
    fontSize: 11,
    fontWeight: '900',
  },
  summaryPillTextComplete: {
    color: Palette.success,
  },
  traceCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    overflow: 'hidden',
  },
  traceHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 18,
  },
  traceTitle: {
    color: Palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  traceSubtitle: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 230,
  },
  traceBadge: {
    backgroundColor: Palette.amberSoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  traceBadgeText: {
    color: Palette.amber,
    fontSize: 11,
    fontWeight: '900',
  },
  referenceTrace: {
    backgroundColor: '#fff3ef',
    height: 148,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  verticalLine: {
    backgroundColor: '#f4d8d2',
    height: '100%',
    opacity: 0.72,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  horizontalLine: {
    backgroundColor: '#f4d8d2',
    height: 1,
    left: 0,
    opacity: 0.72,
    position: 'absolute',
    width: '100%',
  },
  majorGridLine: {
    backgroundColor: '#edbdb5',
    opacity: 0.95,
  },
  traceSegment: {
    backgroundColor: Palette.accent,
    borderRadius: 999,
    height: 3,
    position: 'absolute',
  },
  qrsWindow: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 60, 64, 0.1)',
    borderColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    height: 78,
    justifyContent: 'flex-start',
    paddingTop: 6,
    position: 'absolute',
    top: 27,
  },
  qrsWindowText: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  qrsBracket: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: Palette.primary,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    bottom: 18,
    height: 18,
    position: 'absolute',
  },
  qrsBracketText: {
    backgroundColor: '#fff3ef',
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 6,
    position: 'absolute',
    top: 10,
  },
  traceCallout: {
    backgroundColor: Palette.primary,
    borderRadius: 999,
    left: 16,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: 'absolute',
    top: 16,
  },
  traceCalloutText: {
    color: Palette.paper,
    fontSize: 10,
    fontWeight: '900',
  },
  referenceFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    padding: 18,
  },
  referencePill: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  referencePillText: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  card: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 18,
    padding: 18,
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  sectionIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  sectionCopy: {
    flex: 1,
    gap: 2,
  },
  sectionTitle: {
    color: Palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  sectionDetail: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  measurementBlock: {
    gap: 8,
  },
  measurementLabel: {
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  inputShell: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 14,
  },
  inputField: {
    color: Palette.ink,
    flex: 1,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  inputUnit: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  inputUnitText: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  calculatedPanel: {
    alignItems: 'baseline',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  calculatedLabel: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  calculatedValue: {
    color: Palette.primary,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  calculatedUnit: {
    fontSize: 13,
    fontWeight: '900',
  },
  optionStack: {
    gap: 10,
  },
  optionRow: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
    padding: 13,
  },
  optionRowActive: {
    backgroundColor: Palette.primarySoft,
    borderColor: Palette.primary,
  },
  optionIcon: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  optionIconActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  optionCopy: {
    flex: 1,
    gap: 3,
  },
  optionTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  optionTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  optionTitleActive: {
    color: Palette.primary,
  },
  optionDetail: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  optionDetailActive: {
    color: '#416f6c',
  },
  neutralBadge: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  neutralBadgeText: {
    color: Palette.primary,
    fontSize: 10,
    fontWeight: '900',
  },
  warningBadge: {
    backgroundColor: Palette.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  warningBadgeText: {
    color: Palette.accent,
    fontSize: 10,
    fontWeight: '900',
  },
  detailPanel: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  detailPanelTitle: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  derivedPanel: {
    backgroundColor: Palette.paper,
    borderColor: '#c5e4d8',
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 14,
    padding: 18,
  },
  reasoningStack: {
    gap: 8,
  },
  reasoningRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  reasoningText: {
    color: Palette.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  cautionPanel: {
    backgroundColor: Palette.accentSoft,
    borderColor: '#ffd3cc',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  cautionText: {
    color: Palette.accent,
    flex: 1,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  hypertrophyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  hypertrophyInput: {
    flexBasis: '47%',
    flexGrow: 1,
    gap: 6,
  },
  hypertrophyLabel: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '900',
  },
  compactInputShell: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 46,
    paddingHorizontal: 10,
  },
  compactInput: {
    color: Palette.ink,
    flex: 1,
    fontSize: 17,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  compactUnit: {
    color: Palette.primaryMuted,
    fontSize: 12,
    fontWeight: '900',
  },
  detailHint: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  bbbStack: {
    gap: 8,
  },
  bbbOption: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 3,
    padding: 12,
  },
  bbbOptionActive: {
    backgroundColor: Palette.primarySoft,
    borderColor: Palette.primary,
  },
  bbbOptionBadge: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  bbbOptionBadgeActive: {
    color: Palette.primary,
  },
  bbbOptionText: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  bbbOptionTextActive: {
    color: '#416f6c',
  },
  fascicularRow: {
    gap: 8,
  },
  fascicularButton: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  fascicularButtonActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  fascicularText: {
    color: Palette.primary,
    flex: 1,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 18,
  },
  fascicularTextActive: {
    color: Palette.paper,
  },
  fascicularInfoButton: {
    alignItems: 'center',
    borderRadius: 999,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  fascicularInfoButtonActive: {
    backgroundColor: 'rgba(255, 253, 248, 0.12)',
  },
  criteriaStack: {
    gap: 12,
  },
  criteriaEmptyState: {
    alignItems: 'flex-start',
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  criteriaEmptyText: {
    color: Palette.primaryMuted,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  criteriaGroup: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  criteriaHeader: {
    gap: 3,
  },
  criteriaTitle: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  criteriaDetail: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  criteriaChipGrid: {
    gap: 8,
  },
  criteriaChip: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 42,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  criteriaChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  criteriaChipText: {
    color: Palette.primary,
    flex: 1,
    fontSize: 12,
    fontWeight: '900',
    lineHeight: 17,
  },
  criteriaChipTextActive: {
    color: Palette.paper,
  },
  leadShapeStack: {
    gap: 12,
  },
  leadShapeRow: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 10,
    padding: 12,
  },
  leadShapeHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  leadBadge: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 999,
    minWidth: 42,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  leadBadgeText: {
    color: Palette.paper,
    fontSize: 12,
    fontWeight: '900',
  },
  leadShapeSource: {
    color: Palette.muted,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  notesInput: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '700',
    minHeight: 96,
    padding: 12,
    textAlignVertical: 'top',
  },
  groupLabel: { color: Palette.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderRadius: 999,
    borderWidth: 1,
    minHeight: 38,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  chipText: { color: Palette.primary, fontSize: 12, fontWeight: '900', textTransform: 'capitalize' },
  chipTextActive: { color: Palette.paper },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
  },
  toggleButtonActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  toggleButtonText: { color: Palette.primary, fontSize: 14, fontWeight: '900' },
  toggleButtonTextActive: { color: Palette.paper },
  strainCard: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 12,
  },
  strainCardActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  strainText: { color: Palette.primary, fontSize: 13, fontWeight: '900' },
  strainTextActive: { color: Palette.paper },
  deltaCard: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    flexDirection: 'row',
    gap: 12,
    padding: 16,
  },
  deltaCardActive: {
    backgroundColor: Palette.accentSoft,
    borderColor: '#e8b9b2',
  },
  deltaIcon: {
    alignItems: 'center',
    backgroundColor: Palette.accentSoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  deltaIconActive: {
    backgroundColor: Palette.accent,
  },
  deltaCopy: {
    flex: 1,
    gap: 2,
  },
  deltaTitle: {
    color: Palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  deltaTitleActive: {
    color: Palette.accent,
  },
  deltaDetail: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  deltaDetailActive: {
    color: '#8f3b33',
  },
  summaryCard: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 10,
    padding: 15,
  },
  summaryTitle: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: Palette.primaryMuted,
    fontSize: 13,
    fontWeight: '800',
  },
  summaryValue: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '900',
  },
  tipPanel: {
    alignItems: 'flex-start',
    backgroundColor: Palette.successSoft,
    borderColor: '#c5e4d8',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  tipText: {
    color: '#255a49',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  footer: {
    backgroundColor: Palette.canvas,
    borderColor: Palette.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: Layout.pagePadding,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.lineStrong,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 54,
  },
  backButtonText: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flex: 1.3,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 54,
  },
  nextButtonDisabled: {
    backgroundColor: Palette.subtle,
  },
  nextButtonText: {
    color: Palette.paper,
    fontSize: 15,
    fontWeight: '900',
  },
});
