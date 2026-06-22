import React from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { LearnableText, StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { useEcgStore } from '@/store/ecgStore';

type PrRegularity = 'constant' | 'not_constant';
type SegmentStatus = 'flat' | 'depressed' | 'elevated';
type PrCategory = 'short' | 'normal' | 'first_degree' | 'variable' | 'not_measurable';
type AvBlockConcern = 'none' | 'first_degree' | 'mobitz_i' | 'mobitz_ii' | 'high_grade' | 'complete' | 'unclear';

type TraceSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const TRACE_HEIGHT = 148;

const prSegments: TraceSegment[] = [
  { x1: 5, y1: 62, x2: 17, y2: 62 },
  { x1: 17, y1: 62, x2: 21, y2: 58 },
  { x1: 21, y1: 58, x2: 25, y2: 54 },
  { x1: 25, y1: 54, x2: 29, y2: 58 },
  { x1: 29, y1: 58, x2: 33, y2: 62 },
  { x1: 33, y1: 62, x2: 56, y2: 62 },
  { x1: 56, y1: 62, x2: 59, y2: 70 },
  { x1: 59, y1: 70, x2: 63, y2: 24 },
  { x1: 63, y1: 24, x2: 67, y2: 74 },
  { x1: 67, y1: 74, x2: 72, y2: 62 },
  { x1: 72, y1: 62, x2: 94, y2: 62 },
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

function PrReferenceView() {
  const [traceWidth, setTraceWidth] = React.useState(0);
  const hasLayout = traceWidth > 0;
  const startX = traceWidth * 0.17;
  const endX = traceWidth * 0.56;
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

      {hasLayout && prSegments.map((segment, index) => <TraceLine key={`pr-${index}`} segment={segment} width={traceWidth} />)}

      {hasLayout && (
        <>
          <View style={[styles.prBracket, { left: startX, width: endX - startX }]}>
            <Text style={styles.prBracketText}>PR interval</Text>
          </View>
          <View style={[styles.prStartMarker, { left: startX - 1 }]} />
          <View style={[styles.prEndMarker, { left: endX - 1 }]} />
        </>
      )}

      <View style={styles.traceCallout}>
        <Text style={styles.traceCalloutText}>start P to start QRS</Text>
      </View>
    </View>
  );
}

function MeasurementInput({
  label,
  value,
  placeholder,
  onChangeText,
  calculatedMs,
  onRemove,
  learnTopicId,
  onOpenLearning,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (text: string) => void;
  calculatedMs?: number;
  onRemove?: () => void;
  learnTopicId?: string;
  onOpenLearning?: (topicId: string) => void;
}) {
  return (
    <View style={styles.measurementBlock}>
      <View style={styles.measurementLabelRow}>
        {learnTopicId && onOpenLearning ? (
          <LearnableText topicId={learnTopicId} onOpen={onOpenLearning} style={styles.measurementLabel}>{label}</LearnableText>
        ) : (
          <Text style={styles.measurementLabel}>{label}</Text>
        )}
        {onRemove && (
          <Pressable style={styles.removeButton} onPress={onRemove}>
            <Ionicons name="trash-outline" size={16} color={Palette.accent} />
          </Pressable>
        )}
      </View>
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
          <Text style={styles.inputUnitText}>small boxes</Text>
        </View>
      </View>
      <View style={styles.calculatedPanel}>
        <Text style={styles.calculatedLabel}>Calculated</Text>
        <Text style={styles.calculatedValue} selectable>
          {calculatedMs ?? '--'} <Text style={styles.calculatedUnit}>ms</Text>
        </Text>
      </View>
    </View>
  );
}

function formatLabel(value?: string) {
  if (!value) return 'Pending';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function derivePrCategory(
  prInterval: NonNullable<ReturnType<typeof useEcgStore.getState>['draft']['prInterval']>,
  pWavePresence?: 'present' | 'absent' | 'unclear'
): PrCategory {
  if (pWavePresence === 'absent') return 'not_measurable';
  if (prInterval.regularity === 'not_constant') return 'variable';
  if (prInterval.calculatedMs === undefined) return 'not_measurable';
  if (prInterval.calculatedMs < 120) return 'short';
  if (prInterval.calculatedMs > 200) return 'first_degree';
  return 'normal';
}

function deriveAvBlockConcern({
  prCategory,
  droppedBeats,
  droppedBeatPattern,
}: {
  prCategory: PrCategory;
  droppedBeats?: boolean;
  droppedBeatPattern?: string;
}): AvBlockConcern {
  if (droppedBeats) {
    if (droppedBeatPattern === 'mobitz_i') return 'mobitz_i';
    if (droppedBeatPattern === 'mobitz_ii') return 'mobitz_ii';
    if (droppedBeatPattern === 'high_grade' || droppedBeatPattern === 'two_to_one') return 'high_grade';
    if (droppedBeatPattern === 'complete_av_block') return 'complete';
    return 'unclear';
  }

  if (droppedBeats === false) {
    return prCategory === 'first_degree' ? 'first_degree' : 'none';
  }

  return prCategory === 'first_degree' ? 'first_degree' : 'unclear';
}

function deriveConductionReasoning({
  prCategory,
  avBlockConcern,
  prInterval,
  pWavePresence,
}: {
  prCategory: PrCategory;
  avBlockConcern: AvBlockConcern;
  prInterval: NonNullable<ReturnType<typeof useEcgStore.getState>['draft']['prInterval']>;
  pWavePresence?: 'present' | 'absent' | 'unclear';
}) {
  const reasons: string[] = [];

  if (pWavePresence === 'absent') {
    reasons.push('Discrete P waves are absent, so the PR interval cannot be measured.');
  } else if (prInterval.regularity === 'not_constant') {
    reasons.push('PR regularity is variable, so the PR category is derived as variable.');
  } else if (prInterval.calculatedMs !== undefined) {
    reasons.push(`Measured PR is ${prInterval.calculatedMs} ms.`);
  } else {
    reasons.push('PR interval has not been measured yet.');
  }

  if (prCategory === 'short') reasons.push('PR is below 120 ms, so it is categorized as short.');
  if (prCategory === 'normal') reasons.push('PR is between 120 and 200 ms, so it is categorized as normal.');
  if (prCategory === 'first_degree') reasons.push('PR is above 200 ms, so first-degree AV delay is flagged.');
  if (prInterval.droppedBeats === true) {
    reasons.push(`Dropped QRS after P wave is present; pattern is ${formatLabel(prInterval.droppedBeatPattern)}.`);
  }
  if (prInterval.droppedBeats === false) {
    reasons.push('No dropped QRS after P wave was recorded.');
  }
  if (avBlockConcern === 'none') reasons.push('No AV block concern is derived from the entered data.');

  return reasons;
}

export default function Step3() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const prInterval = draft.prInterval || {};
  const pWavePresence = draft.pWave?.presence;
  const isPrUnmeasurable = pWavePresence === 'absent';

  const [boxesText, setBoxesText] = React.useState(prInterval.smallBoxes?.toString() || '');
  const [multipleText, setMultipleText] = React.useState<string[]>(
    prInterval.multipleIntervals?.map((interval) => interval.smallBoxes?.toString() || '') || ['']
  );

  React.useEffect(() => {
    if (prInterval.smallBoxes === undefined) {
      setBoxesText('');
    }
  }, [prInterval.smallBoxes]);

  React.useEffect(() => {
    if (!isPrUnmeasurable) return;

    if (
      prInterval.regularity !== undefined ||
      prInterval.smallBoxes !== undefined ||
      prInterval.calculatedMs !== undefined ||
      prInterval.multipleIntervals !== undefined ||
      prInterval.segmentStatus !== undefined ||
      prInterval.droppedBeats !== undefined ||
      prInterval.droppedBeatPattern !== undefined
    ) {
      updateDraft({
        prInterval: {
          prCategory: 'not_measurable',
          avBlockConcern: 'unclear',
        },
      });
    }
  }, [
    isPrUnmeasurable,
    prInterval.regularity,
    prInterval.smallBoxes,
    prInterval.calculatedMs,
    prInterval.multipleIntervals,
    prInterval.segmentStatus,
    prInterval.droppedBeats,
    prInterval.droppedBeatPattern,
    updateDraft,
  ]);

  const handleRegularityChange = (regularity: PrRegularity) => {
    const shouldCreateMultiple = regularity === 'not_constant' && !prInterval.multipleIntervals?.length;

    if (shouldCreateMultiple) {
      setMultipleText(['']);
    }

    updateDraft({
      prInterval: {
        ...prInterval,
        regularity,
        multipleIntervals: shouldCreateMultiple ? [{ smallBoxes: undefined, calculatedMs: undefined }] : prInterval.multipleIntervals,
      },
    });
  };

  const handleBoxesChange = (text: string) => {
    setBoxesText(text);
    const boxes = parseFloat(text);
    const nextValue = Number.isFinite(boxes) ? boxes : undefined;

    updateDraft({
      prInterval: {
        ...prInterval,
        smallBoxes: nextValue,
        calculatedMs: nextValue !== undefined ? Math.round(nextValue * 40) : undefined,
      },
    });
  };

  const handleMultipleChange = (text: string, index: number) => {
    const nextText = [...multipleText];
    nextText[index] = text;
    setMultipleText(nextText);

    const boxes = parseFloat(text);
    const nextValue = Number.isFinite(boxes) ? boxes : undefined;
    const nextIntervals = [...(prInterval.multipleIntervals || [])];
    nextIntervals[index] = {
      smallBoxes: nextValue,
      calculatedMs: nextValue !== undefined ? Math.round(nextValue * 40) : undefined,
    };

    updateDraft({
      prInterval: {
        ...prInterval,
        multipleIntervals: nextIntervals,
      },
    });
  };

  const addInterval = () => {
    setMultipleText([...multipleText, '']);
    updateDraft({
      prInterval: {
        ...prInterval,
        multipleIntervals: [
          ...(prInterval.multipleIntervals || []),
          { smallBoxes: undefined, calculatedMs: undefined },
        ],
      },
    });
  };

  const removeInterval = (index: number) => {
    const nextText = multipleText.filter((_, textIndex) => textIndex !== index);
    const nextIntervals = (prInterval.multipleIntervals || []).filter((_, intervalIndex) => intervalIndex !== index);

    setMultipleText(nextText.length ? nextText : ['']);
    updateDraft({
      prInterval: {
        ...prInterval,
        multipleIntervals: nextIntervals.length ? nextIntervals : [{ smallBoxes: undefined, calculatedMs: undefined }],
      },
    });
  };

  const handleSegmentStatusChange = (segmentStatus: SegmentStatus) => {
    updateDraft({
      prInterval: {
        ...prInterval,
        segmentStatus,
      },
    });
  };

  const setDroppedBeats = (droppedBeats: boolean) => {
    updateDraft({
      prInterval: {
        ...prInterval,
        droppedBeats,
        ...(!droppedBeats && { droppedBeatPattern: undefined }),
      },
    });
  };

  const intervalComplete =
    isPrUnmeasurable
      ? true
      : prInterval.regularity === 'constant'
      ? prInterval.smallBoxes !== undefined && prInterval.smallBoxes > 0
      : !!prInterval.multipleIntervals?.length &&
        prInterval.multipleIntervals.every((interval) => interval.smallBoxes !== undefined && interval.smallBoxes > 0);
  const regularityComplete = isPrUnmeasurable || !!prInterval.regularity;
  const segmentComplete = isPrUnmeasurable || !!prInterval.segmentStatus;
  const droppedBeatsComplete = isPrUnmeasurable || prInterval.droppedBeats !== undefined;
  const droppedBeatPatternComplete = isPrUnmeasurable || !prInterval.droppedBeats || !!prInterval.droppedBeatPattern;
  const derivedPrCategory = derivePrCategory(prInterval, pWavePresence);
  const derivedAvBlockConcern = deriveAvBlockConcern({
    prCategory: derivedPrCategory,
    droppedBeats: prInterval.droppedBeats,
    droppedBeatPattern: prInterval.droppedBeatPattern,
  });
  const conductionReasoning = deriveConductionReasoning({
    prCategory: derivedPrCategory,
    avBlockConcern: derivedAvBlockConcern,
    prInterval,
    pWavePresence,
  });
  const isValid = regularityComplete && intervalComplete && segmentComplete && droppedBeatsComplete && droppedBeatPatternComplete;
  const intervalLabel =
    isPrUnmeasurable
      ? 'PR unmeasurable'
      : prInterval.regularity === 'not_constant'
      ? 'Variable PR intervals'
      : prInterval.calculatedMs !== undefined
        ? `${prInterval.calculatedMs} ms PR interval`
        : 'Awaiting PR measurement';

  React.useEffect(() => {
    if (prInterval.prCategory !== derivedPrCategory || prInterval.avBlockConcern !== derivedAvBlockConcern) {
      updateDraft({
        prInterval: {
          ...prInterval,
          prCategory: derivedPrCategory,
          avBlockConcern: derivedAvBlockConcern,
        },
      });
    }
  }, [derivedPrCategory, derivedAvBlockConcern, prInterval.prCategory, prInterval.avBlockConcern]);

  const regularityOptions: Array<{ label: string; value: PrRegularity; detail: string; icon: keyof typeof Ionicons.glyphMap }> = [
    {
      label: 'Constant',
      value: 'constant',
      detail: 'PR interval stays consistent beat to beat.',
      icon: 'repeat-outline',
    },
    {
      label: 'Not constant',
      value: 'not_constant',
      detail: 'PR interval changes across the strip.',
      icon: 'git-compare-outline',
    },
  ];

  const segmentOptions: Array<{ label: string; value: SegmentStatus; detail: string; icon: keyof typeof Ionicons.glyphMap }> = [
    {
      label: 'Flat',
      value: 'flat',
      detail: 'Isoelectric PR segment.',
      icon: 'remove-outline',
    },
    {
      label: 'Depressed',
      value: 'depressed',
      detail: 'Below the baseline.',
      icon: 'trending-down-outline',
    },
    {
      label: 'Elevated',
      value: 'elevated',
      detail: 'Above the baseline.',
      icon: 'trending-up-outline',
    },
  ];

  const droppedBeatOptions = [
    { label: 'Mobitz I', value: 'mobitz_i' },
    { label: 'Mobitz II', value: 'mobitz_ii' },
    { label: '2:1 block', value: 'two_to_one' },
    { label: 'High-grade', value: 'high_grade' },
    { label: 'Complete AV block', value: 'complete_av_block' },
    { label: 'Blocked PAC', value: 'blocked_pac' },
    { label: 'Unclear', value: 'unclear' },
  ] as const;

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
              <Text style={styles.kicker}>Step 3 · PR interval</Text>
              <Text style={styles.heroTitle}>Measure conduction from atria to ventricles.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>3</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroSummary}>
            <View style={styles.heroSummaryCopy}>
              <Text style={styles.heroSummaryLabel}>PR read</Text>
              <Text style={styles.heroSummaryValue}>{intervalLabel}</Text>
            </View>
            <View style={styles.summaryPillColumn}>
              <SummaryPill label="Interval" complete={intervalComplete} />
              <SummaryPill label="Segment" complete={segmentComplete} />
              <SummaryPill label="AV evidence" complete={droppedBeatsComplete && droppedBeatPatternComplete} />
            </View>
          </View>
        </View>
        <StepLearningButton topicId="step.prInterval" onOpen={learning.openTopic} />

        <View style={styles.traceCard}>
          <View style={styles.traceHeader}>
            <View>
              <Text style={styles.traceTitle}>PR reference view</Text>
              <Text style={styles.traceSubtitle}>Measure from the first P wave deflection to the start of the QRS.</Text>
            </View>
            <View style={styles.traceBadge}>
              <Text style={styles.traceBadgeText}>120-200 ms</Text>
            </View>
          </View>

          <PrReferenceView />

          <View style={styles.referenceFooter}>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>1 small box = 40 ms</Text>
            </View>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>normal 3-5 boxes</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="repeat-outline"
            title="PR regularity"
            detail="Decide whether one measurement represents the strip or multiple intervals are needed."
          />

          {isPrUnmeasurable ? (
            <View style={styles.unmeasurablePanel}>
              <View style={styles.unmeasurableIcon}>
                <Ionicons name="remove-circle-outline" size={20} color={Palette.primary} />
              </View>
              <View style={styles.unmeasurableCopy}>
                <Text style={styles.unmeasurableTitle}>PR interval is unmeasurable</Text>
                <Text style={styles.unmeasurableText}>
                  Step 2 marks discrete P waves as absent, so there is no P-wave onset to measure from.
                </Text>
              </View>
            </View>
          ) : (
          <View style={styles.choiceGrid}>
            {regularityOptions.map((option) => {
              const selected = prInterval.regularity === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.choiceCard, selected && styles.choiceCardActive]}
                  onPress={() => handleRegularityChange(option.value)}
                >
                  <View style={[styles.choiceIcon, selected && styles.choiceIconActive]}>
                    <Ionicons name={option.icon} size={19} color={selected ? Palette.paper : Palette.primary} />
                  </View>
                  <Text style={[styles.choiceTitle, selected && styles.choiceTitleActive]}>{option.label}</Text>
                  <Text style={[styles.choiceText, selected && styles.choiceTextActive]}>{option.detail}</Text>
                </Pressable>
              );
            })}
          </View>
          )}
        </View>

        {!isPrUnmeasurable && (
        <View style={styles.card}>
          <SectionHeader
            icon="resize-outline"
            title="PR measurement"
            detail="Count small boxes and convert using 40 ms per small box."
          />

          {prInterval.regularity === 'not_constant' ? (
            <View style={styles.measurementStack}>
              {(prInterval.multipleIntervals || [{ smallBoxes: undefined, calculatedMs: undefined }]).map((interval, index) => (
                <MeasurementInput
                  key={`interval-${index}`}
                  label={`Interval ${index + 1}`}
                  value={multipleText[index] || ''}
                  placeholder="4.5"
                  calculatedMs={interval.calculatedMs}
                  onChangeText={(text) => handleMultipleChange(text, index)}
                  onRemove={index > 0 ? () => removeInterval(index) : undefined}
                  learnTopicId="input.pr.measurement"
                  onOpenLearning={learning.openTopic}
                />
              ))}

              <Pressable style={styles.addButton} onPress={addInterval}>
                <Ionicons name="add-circle-outline" size={18} color={Palette.primary} />
                <Text style={styles.addButtonText}>Add interval</Text>
              </Pressable>
            </View>
          ) : (
            <MeasurementInput
              label="Small boxes"
              value={boxesText}
              placeholder="4.0"
              calculatedMs={prInterval.calculatedMs}
              onChangeText={handleBoxesChange}
              learnTopicId="input.pr.measurement"
              onOpenLearning={learning.openTopic}
            />
          )}
        </View>
        )}

        {!isPrUnmeasurable && (
        <View style={styles.card}>
          <SectionHeader
            icon="analytics-outline"
            title="PR segment status"
            detail="Inspect the segment after the P wave and before QRS onset."
          />
          <LearnableText topicId="input.pr.segment" onOpen={learning.openTopic} style={styles.groupLabel}>PR segment input guide</LearnableText>

          <View style={styles.optionStack}>
            {segmentOptions.map((option) => {
              const selected = prInterval.segmentStatus === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionRow, selected && styles.optionRowActive]}
                  onPress={() => handleSegmentStatusChange(option.value)}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                    <Ionicons name={option.icon} size={18} color={selected ? Palette.paper : Palette.primary} />
                  </View>
                  <View style={styles.optionCopy}>
                    <LearnableText topicId="input.pr.segment" onOpen={learning.openTopic} style={[styles.optionTitle, selected && styles.optionTitleActive]}>
                      {option.label}
                    </LearnableText>
                    <Text style={[styles.optionDetail, selected && styles.optionDetailActive]}>{option.detail}</Text>
                  </View>
                  <Ionicons
                    name={selected ? 'radio-button-on' : 'radio-button-off'}
                    size={20}
                    color={selected ? Palette.primary : Palette.lineStrong}
                  />
                </Pressable>
              );
            })}
          </View>
        </View>
        )}

        <View style={styles.card}>
          <SectionHeader
            icon="git-compare-outline"
            title="AV conduction evidence"
            detail="Record dropped QRS complexes. PR category and AV-block concern are calculated from the entered measurements."
          />

          {isPrUnmeasurable ? (
            <View style={styles.unmeasurablePanel}>
              <View style={styles.unmeasurableIcon}>
                <Ionicons name="git-compare-outline" size={20} color={Palette.primary} />
              </View>
              <View style={styles.unmeasurableCopy}>
                <Text style={styles.unmeasurableTitle}>AV conduction cannot be graded from PR intervals</Text>
                <Text style={styles.unmeasurableText}>
                  Use rhythm synthesis for absent-P rhythms such as atrial fibrillation, flutter-like activity, junctional rhythms, or ventricular rhythms.
                </Text>
              </View>
            </View>
          ) : (
            <>
              <LearnableText topicId="input.av.droppedQrs" onOpen={learning.openTopic} style={styles.groupLabel}>Dropped QRS after P wave?</LearnableText>
              <View style={styles.toggleRow}>
                {[true, false].map((value) => (
                  <Pressable
                    key={String(value)}
                    style={[styles.toggleButton, prInterval.droppedBeats === value && styles.toggleButtonActive]}
                    onPress={() => setDroppedBeats(value)}
                  >
                    <Text style={[styles.toggleButtonText, prInterval.droppedBeats === value && styles.toggleButtonTextActive]}>
                      {value ? 'Yes' : 'No'}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {prInterval.droppedBeats && (
                <>
                  <LearnableText topicId="input.av.droppedQrs" onOpen={learning.openTopic} style={styles.groupLabel}>Dropped-beat pattern</LearnableText>
                  <View style={styles.chipGrid}>
                    {droppedBeatOptions.map((option) => {
                      const selected = prInterval.droppedBeatPattern === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          style={[styles.chip, selected && styles.chipActive]}
                          onPress={() => updateDraft({ prInterval: { ...prInterval, droppedBeatPattern: option.value } })}
                        >
                          <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </>
              )}
            </>
          )}

          <View style={styles.derivedPanel}>
            <View style={styles.derivedGrid}>
              <View style={styles.derivedTile}>
                <Text style={styles.derivedLabel}>PR category</Text>
                <Text style={styles.derivedValue}>{formatLabel(derivedPrCategory)}</Text>
              </View>
              <View style={styles.derivedTile}>
                <Text style={styles.derivedLabel}>AV block concern</Text>
                <Text style={styles.derivedValue}>{formatLabel(derivedAvBlockConcern)}</Text>
              </View>
            </View>

            <View style={styles.reasoningStack}>
              {conductionReasoning.map((reason, index) => (
                <View key={`${reason}-${index}`} style={styles.reasoningRow}>
                  <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                  <Text style={styles.reasoningText}>{reason}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            PR prolongation suggests delayed AV conduction. A short PR interval can occur with pre-excitation patterns
            such as WPW.
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
            if (isValid) router.push('/(ecg-flow)/step-4');
          }}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Complete PR'}</Text>
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
    width: '25%',
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
  prBracket: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: Palette.primary,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    bottom: 28,
    height: 18,
    position: 'absolute',
  },
  prBracketText: {
    backgroundColor: '#fff3ef',
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 6,
    position: 'absolute',
    top: 10,
  },
  prStartMarker: {
    backgroundColor: Palette.primary,
    height: 62,
    position: 'absolute',
    top: 54,
    width: 2,
  },
  prEndMarker: {
    backgroundColor: Palette.primary,
    height: 62,
    position: 'absolute',
    top: 54,
    width: 2,
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
  choiceGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  choiceCard: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: 8,
    minHeight: 126,
    padding: 14,
  },
  choiceCardActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  choiceIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  choiceIconActive: {
    backgroundColor: 'rgba(255, 253, 248, 0.16)',
  },
  choiceTitle: {
    color: Palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  choiceTitleActive: {
    color: Palette.paper,
  },
  choiceText: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  choiceTextActive: {
    color: '#d7ebe8',
  },
  unmeasurablePanel: {
    alignItems: 'flex-start',
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  unmeasurableIcon: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  unmeasurableCopy: {
    flex: 1,
    gap: 4,
  },
  unmeasurableTitle: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  unmeasurableText: {
    color: '#416f6c',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  measurementStack: {
    gap: 14,
  },
  measurementBlock: {
    gap: 8,
  },
  measurementLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurementLabel: {
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  removeButton: {
    alignItems: 'center',
    backgroundColor: Palette.accentSoft,
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
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
  addButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.lineStrong,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderStyle: 'dashed',
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 50,
  },
  addButtonText: {
    color: Palette.primary,
    fontSize: 14,
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
    minHeight: 72,
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
    gap: 2,
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
  chipText: { color: Palette.primary, fontSize: 12, fontWeight: '900' },
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
  derivedPanel: {
    backgroundColor: Palette.successSoft,
    borderColor: '#c5e4d8',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  derivedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  derivedTile: {
    backgroundColor: Palette.paper,
    borderColor: '#c5e4d8',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 4,
    minWidth: 130,
    padding: 12,
  },
  derivedLabel: {
    color: Palette.primaryMuted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  derivedValue: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
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
    color: '#255a49',
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
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
