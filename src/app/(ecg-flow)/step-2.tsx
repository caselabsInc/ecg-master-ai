import React from 'react';
import { LayoutChangeEvent, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { LearnableText, StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { useEcgStore } from '@/store/ecgStore';

type Morphology = 'normal' | 'peaked' | 'notched' | 'biphasic' | 'inverted' | 'retrograde' | 'variable' | 'abnormal';

type MorphologyOption = {
  label: string;
  value: Morphology;
  detail: string;
  icon: keyof typeof Ionicons.glyphMap;
};

type AbnormalAtrialActivity = 'fibrillatory_waves' | 'flutter_waves' | 'artifact' | 'unclear' | 'other';

type TraceSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const TRACE_HEIGHT = 148;

const pWaveSegments: TraceSegment[] = [
  { x1: 5, y1: 62, x2: 22, y2: 62 },
  { x1: 22, y1: 62, x2: 26, y2: 58 },
  { x1: 26, y1: 58, x2: 30, y2: 54 },
  { x1: 30, y1: 54, x2: 34, y2: 58 },
  { x1: 34, y1: 58, x2: 38, y2: 62 },
  { x1: 38, y1: 62, x2: 58, y2: 62 },
  { x1: 58, y1: 62, x2: 61, y2: 70 },
  { x1: 61, y1: 70, x2: 65, y2: 24 },
  { x1: 65, y1: 24, x2: 69, y2: 74 },
  { x1: 69, y1: 74, x2: 74, y2: 62 },
  { x1: 74, y1: 62, x2: 94, y2: 62 },
];

function toTracePoint(segment: TraceSegment, width: number) {
  return {
    x1: (segment.x1 / 100) * width,
    y1: (segment.y1 / 100) * TRACE_HEIGHT,
    x2: (segment.x2 / 100) * width,
    y2: (segment.y2 / 100) * TRACE_HEIGHT,
  };
}

function PWaveTraceSegment({ segment, width }: { segment: TraceSegment; width: number }) {
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

function legacyAbsentPToAtrialActivity(value?: string | null): AbnormalAtrialActivity | undefined {
  if (value === 'atrial_fibrillation') return 'fibrillatory_waves';
  if (value === 'atrial_flutter') return 'flutter_waves';
  if (value === 'artifact' || value === 'unclear' || value === 'other') return value;
  return undefined;
}

function MeasurementInput({
  label,
  value,
  placeholder,
  unit,
  helper,
  onChange,
  learnTopicId,
  onOpenLearning,
}: {
  label: string;
  value: number | undefined;
  placeholder: string;
  unit: string;
  helper: string;
  onChange: (value: number | undefined) => void;
  learnTopicId?: string;
  onOpenLearning?: (topicId: string) => void;
}) {
  const [inputText, setInputText] = React.useState(value?.toString() || '');

  React.useEffect(() => {
    const nextText = value?.toString() || '';
    const normalizedInput = inputText.replace(',', '.');

    if (normalizedInput !== nextText && !inputText.endsWith('.') && !inputText.endsWith(',')) {
      setInputText(nextText);
    }
  }, [value]);

  return (
    <View style={styles.measurementBlock}>
      <View style={styles.measurementLabelRow}>
        <View style={styles.measurementLabelCopy}>
          {learnTopicId && onOpenLearning ? (
            <LearnableText topicId={learnTopicId} onOpen={onOpenLearning} style={styles.measurementLabel}>{label}</LearnableText>
          ) : (
            <Text style={styles.measurementLabel}>{label}</Text>
          )}
        </View>
        <Text style={styles.measurementHelper}>{helper}</Text>
      </View>
      <View style={styles.inputShell}>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor={Palette.subtle}
          keyboardType="decimal-pad"
          value={inputText}
          onChangeText={(text) => {
            const sanitizedText = text.replace(/[^0-9.,]/g, '');
            const normalizedText = sanitizedText.replace(',', '.');
            setInputText(sanitizedText);

            if (normalizedText === '' || normalizedText === '.' || normalizedText.endsWith('.')) {
              onChange(undefined);
              return;
            }

            const nextValue = Number(normalizedText);
            onChange(Number.isFinite(nextValue) ? nextValue : undefined);
          }}
          onBlur={() => {
            const normalizedText = inputText.replace(',', '.');
            const trimmedText = normalizedText.endsWith('.') ? normalizedText.slice(0, -1) : normalizedText;

            if (trimmedText === '') {
              setInputText('');
              onChange(undefined);
              return;
            }

            const nextValue = Number(trimmedText);
            if (Number.isFinite(nextValue)) {
              setInputText(nextValue.toString());
              onChange(nextValue);
            }
          }}
        />
        <View style={styles.inputUnit}>
          <Text style={styles.inputUnitText}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

function PWaveReference() {
  const [traceWidth, setTraceWidth] = React.useState(0);
  const hasLayout = traceWidth > 0;
  const pWindowLeft = traceWidth * 0.215;
  const pWindowWidth = traceWidth * 0.18;
  const handleLayout = (event: LayoutChangeEvent) => {
    setTraceWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.referenceTrace} onLayout={handleLayout}>
      {Array.from({ length: 12 }).map((_, index) => (
        <View
          key={`v-${index}`}
          style={[
            styles.verticalLine,
            index % 3 === 0 && styles.majorGridLine,
            { left: `${index * 9}%` },
          ]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={`h-${index}`}
          style={[
            styles.horizontalLine,
            index % 2 === 0 && styles.majorGridLine,
            { top: `${index * 20}%` },
          ]}
        />
      ))}

      {hasLayout &&
        pWaveSegments.map((segment, index) => <PWaveTraceSegment key={`p-wave-${index}`} segment={segment} width={traceWidth} />)}

      {hasLayout && (
        <>
          <View
            style={[
              styles.pWaveWindow,
              {
                left: pWindowLeft,
                width: pWindowWidth,
              },
            ]}
          >
            <Text style={styles.pWaveLabel}>P</Text>
          </View>
          <View style={[styles.durationGuide, { left: pWindowLeft - 2, width: pWindowWidth + 4 }]}>
            <Text style={styles.durationGuideText}>width</Text>
          </View>
        </>
      )}
      <View style={styles.amplitudeGuide}>
        <Text style={styles.amplitudeGuideText}>height</Text>
      </View>
    </View>
  );
}

export default function Step2() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const pWave = draft.pWave || {};
  const [morphologyPickerOpen, setMorphologyPickerOpen] = React.useState(false);

  const pPresenceComplete = !!pWave.presence;
  const pPresent = pWave.presence === 'present';
  const durationComplete = !pPresent || !!pWave.leadIIDurationSmallBoxes;
  const amplitudeComplete = !pPresent || !!pWave.leadIIAmplitudeSmallBoxes;
  const morphologyComplete = !pPresent || !!pWave.morphology;
  const absentExplanationComplete = pWave.presence !== 'absent' || !!pWave.abnormalAtrialActivity || !!pWave.absentPExplanation;
  const isValid = pPresenceComplete && morphologyComplete && durationComplete && amplitudeComplete && absentExplanationComplete;
  const pWaveLabel =
    pWave.presence === 'absent'
      ? 'No discrete P waves'
      : pWave.presence === 'unclear'
        ? 'P waves unclear'
        : pWave.morphology === 'normal'
      ? 'Normal P wave profile'
      : pWave.morphology
        ? 'Atrial abnormality documented'
        : 'Awaiting P wave checks';

  const setPresence = (presence: 'present' | 'absent' | 'unclear') => {
    updateDraft({
      pWave: {
        ...pWave,
        presence,
        ...(presence !== 'present' && {
          morphology: undefined,
          leadIIDurationSmallBoxes: undefined,
          leadIIAmplitudeSmallBoxes: undefined,
          v1TerminalNegativeDurationSmallBoxes: undefined,
          v1TerminalNegativeDepthSmallBoxes: undefined,
          abnormalFeatures: undefined,
        }),
        ...(presence === 'present' && {
          abnormalAtrialActivity: undefined,
          absentPExplanation: undefined,
        }),
      },
      ...(presence === 'absent' && {
        prInterval: {
          prCategory: 'not_measurable',
          avBlockConcern: 'unclear',
        },
      }),
    });
  };

  const deriveFeatures = (nextPWave: typeof pWave) => {
    const duration = nextPWave.leadIIDurationSmallBoxes ?? 0;
    const amplitude = nextPWave.leadIIAmplitudeSmallBoxes ?? 0;
    const v1NegativeDuration = nextPWave.v1TerminalNegativeDurationSmallBoxes ?? 0;
    const v1NegativeDepth = nextPWave.v1TerminalNegativeDepthSmallBoxes ?? 0;
    const hasRightAtrialEnlargement = amplitude > 2.5;
    const hasLeftAtrialEnlargement = duration >= 3 || (v1NegativeDuration >= 1 && v1NegativeDepth >= 1);
    const hasLowAmplitude = amplitude > 0 && amplitude < 0.5;
    const derivedFeatures: NonNullable<typeof pWave.abnormalFeatures> = [];

    if (hasLeftAtrialEnlargement && hasRightAtrialEnlargement) {
      derivedFeatures.push('biatrial_enlargement');
    } else {
      if (hasLeftAtrialEnlargement) derivedFeatures.push('left_atrial_enlargement');
      if (hasRightAtrialEnlargement) derivedFeatures.push('right_atrial_enlargement');
    }
    if (hasLowAmplitude) derivedFeatures.push('low_amplitude');

    return derivedFeatures;
  };

  const updateMeasurement = (
    field:
      | 'leadIIDurationSmallBoxes'
      | 'leadIIAmplitudeSmallBoxes'
      | 'v1TerminalNegativeDurationSmallBoxes'
      | 'v1TerminalNegativeDepthSmallBoxes',
    value: number | undefined
  ) => {
    const nextPWave = { ...pWave, [field]: value ?? null };
    updateDraft({
      pWave: {
        ...nextPWave,
        abnormalFeatures: deriveFeatures(nextPWave),
      },
    });
  };

  const morphologyOptions: MorphologyOption[] = [
    {
      label: 'Normal / upright',
      value: 'normal',
      detail: 'Smooth, rounded, upright P wave in Lead II.',
      icon: 'checkmark-circle-outline',
    },
    {
      label: 'Peaked',
      value: 'peaked',
      detail: 'Tall P wave suggesting right atrial enlargement.',
      icon: 'alert-circle-outline',
    },
    {
      label: 'Notched',
      value: 'notched',
      detail: 'Bifid P wave suggesting left atrial enlargement.',
      icon: 'git-branch-outline',
    },
    {
      label: 'Biphasic',
      value: 'biphasic',
      detail: 'Biphasic P, especially terminal negativity in V1.',
      icon: 'swap-vertical-outline',
    },
    {
      label: 'Inverted',
      value: 'inverted',
      detail: 'Non-sinus atrial activation or limb-lead issue.',
      icon: 'trending-down-outline',
    },
    {
      label: 'Retrograde',
      value: 'retrograde',
      detail: 'P after QRS or inverted inferior P waves.',
      icon: 'return-down-back-outline',
    },
    {
      label: 'Variable',
      value: 'variable',
      detail: 'Changing P morphology across beats.',
      icon: 'alert-circle-outline',
    },
  ];
  const selectedMorphologyOption = morphologyOptions.find((option) => option.value === pWave.morphology);

  const presenceOptions = [
    { label: 'Present', value: 'present' },
    { label: 'Absent', value: 'absent' },
    { label: 'Unclear', value: 'unclear' },
  ] as const;

  const absentPOptions = [
    { label: 'Fibrillatory waves', value: 'fibrillatory_waves' },
    { label: 'Flutter waves', value: 'flutter_waves' },
    { label: 'Artifact', value: 'artifact' },
    { label: 'Unclear', value: 'unclear' },
    { label: 'Other', value: 'other' },
  ] as const;

  const derivedFeatureLabels =
    pWave.abnormalFeatures && pWave.abnormalFeatures.length > 0
      ? pWave.abnormalFeatures.map((feature) => feature.replaceAll('_', ' ')).join(' · ')
      : 'No enlargement or low amplitude criteria met yet';

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
              <Text style={styles.kicker}>Step 2 · P wave</Text>
              <Text style={styles.heroTitle}>Measure atrial activity before the PR interval.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>2</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroSummary}>
            <View style={styles.heroSummaryCopy}>
              <Text style={styles.heroSummaryLabel}>P wave read</Text>
              <Text style={styles.heroSummaryValue}>{pWaveLabel}</Text>
            </View>
            <View style={styles.summaryPillColumn}>
              <SummaryPill label="Presence" complete={pPresenceComplete} />
              <SummaryPill
                label="Atrial data"
                complete={morphologyComplete && durationComplete && amplitudeComplete && absentExplanationComplete}
              />
            </View>
          </View>
        </View>
        <StepLearningButton topicId="step.pWave" onOpen={learning.openTopic} />

        <View style={styles.traceCard}>
          <View style={styles.traceHeader}>
            <View>
              <Text style={styles.traceTitle}>Lead II reference</Text>
              <Text style={styles.traceSubtitle}>Use the small boxes around the P wave to check width and height.</Text>
            </View>
            <View style={styles.traceBadge}>
              <Text style={styles.traceBadgeText}>P wave</Text>
            </View>
          </View>

          <PWaveReference />

          <View style={styles.referenceFooter}>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>normal &lt;3 boxes wide</Text>
            </View>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>normal &lt;2.5 boxes tall</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="pulse-outline"
            title="P wave presence"
            detail="Confirm whether discrete atrial depolarizations can be identified before classifying morphology."
          />

          <View style={styles.chipGrid}>
            {presenceOptions.map((option) => {
              const selected = pWave.presence === option.value;
              return (
                <Pressable key={option.value} style={[styles.chip, selected && styles.chipActive]} onPress={() => setPresence(option.value)}>
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {pWave.presence === 'absent' && (
          <View style={styles.card}>
            <SectionHeader
              icon="help-circle-outline"
              title="Abnormal atrial activity"
              detail="When discrete P waves are absent, document what replaces them before rhythm synthesis."
            />
            <View style={styles.chipGrid}>
              {absentPOptions.map((option) => {
                const selected = pWave.abnormalAtrialActivity === option.value || legacyAbsentPToAtrialActivity(pWave.absentPExplanation) === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateDraft({ pWave: { ...pWave, abnormalAtrialActivity: option.value, absentPExplanation: undefined } })}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        {pPresent && (
          <View style={styles.card}>
            <SectionHeader
              icon="pulse-outline"
              title="P wave morphology"
              detail="Record the visible P-wave shape here. Frontal P-axis is handled with the other axis measurements."
            />

            <Pressable style={styles.selectTrigger} onPress={() => setMorphologyPickerOpen(true)}>
              <View style={[styles.optionIcon, selectedMorphologyOption && styles.optionIconActive]}>
                <Ionicons
                  name={selectedMorphologyOption?.icon || 'pulse-outline'}
                  size={18}
                  color={selectedMorphologyOption ? Palette.paper : Palette.primary}
                />
              </View>
              <View style={styles.selectCopy}>
                <Text style={styles.selectLabel}>Morphology</Text>
                <Text style={[styles.selectValue, !selectedMorphologyOption && styles.selectPlaceholder]}>
                  {selectedMorphologyOption?.label || 'Select P-wave morphology'}
                </Text>
                {selectedMorphologyOption && <Text style={styles.selectDetail}>{selectedMorphologyOption.detail}</Text>}
              </View>
              <Ionicons name="chevron-down" size={20} color={Palette.primary} />
            </Pressable>

            <Modal
              animationType="slide"
              onRequestClose={() => setMorphologyPickerOpen(false)}
              transparent
              visible={morphologyPickerOpen}
            >
              <Pressable style={styles.modalBackdrop} onPress={() => setMorphologyPickerOpen(false)}>
                <Pressable style={styles.pickerSheet} onPress={(event) => event.stopPropagation()}>
                  <View style={styles.pickerHeader}>
                    <View>
                      <Text style={styles.pickerTitle}>P-wave morphology</Text>
                      <Text style={styles.pickerSubtitle}>Choose the best visible morphology.</Text>
                    </View>
                    <Pressable style={styles.pickerCloseButton} onPress={() => setMorphologyPickerOpen(false)}>
                      <Ionicons name="close" size={20} color={Palette.primary} />
                    </Pressable>
                  </View>

                  <ScrollView contentContainerStyle={styles.optionStack} showsVerticalScrollIndicator={false}>
                    {morphologyOptions.map((option) => {
                      const selected = pWave.morphology === option.value;
                      return (
                        <Pressable
                          key={option.value}
                          style={[styles.optionRow, selected && styles.optionRowActive]}
                          onPress={() => {
                            updateDraft({ pWave: { ...pWave, morphology: option.value } });
                            setMorphologyPickerOpen(false);
                          }}
                        >
                          <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                            <Ionicons name={option.icon} size={18} color={selected ? Palette.paper : Palette.primary} />
                          </View>
                          <View style={styles.optionCopy}>
                            <Text style={[styles.optionTitle, selected && styles.optionTitleActive]}>{option.label}</Text>
                            <Text style={[styles.optionDetail, selected && styles.optionDetailActive]}>{option.detail}</Text>
                          </View>
                          <Ionicons
                            name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={selected ? Palette.primary : Palette.lineStrong}
                          />
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </Pressable>
              </Pressable>
            </Modal>
          </View>
        )}

        {pPresent && (
          <View style={styles.card}>
            <SectionHeader
              icon="resize-outline"
              title="Lead measurements for atrial enlargement"
              detail="Use Lead II for P duration/amplitude and V1 terminal negativity for left atrial enlargement."
            />

            <MeasurementInput
              label="Lead II P duration"
              value={pWave.leadIIDurationSmallBoxes ?? undefined}
              placeholder="2.0"
              unit="small boxes"
              helper="LAE if >=3"
              onChange={(value) => updateMeasurement('leadIIDurationSmallBoxes', value)}
              learnTopicId="input.pWave.measurements"
              onOpenLearning={learning.openTopic}
            />

            <MeasurementInput
              label="Lead II P amplitude"
              value={pWave.leadIIAmplitudeSmallBoxes ?? undefined}
              placeholder="1.5"
              unit="small boxes"
              helper="RAE if >2.5"
              onChange={(value) => updateMeasurement('leadIIAmplitudeSmallBoxes', value)}
              learnTopicId="input.pWave.measurements"
              onOpenLearning={learning.openTopic}
            />

            <MeasurementInput
              label="V1 terminal negative duration"
              value={pWave.v1TerminalNegativeDurationSmallBoxes ?? undefined}
              placeholder="1.0"
              unit="small boxes"
              helper="LAE support"
              onChange={(value) => updateMeasurement('v1TerminalNegativeDurationSmallBoxes', value)}
              learnTopicId="input.pWave.measurements"
              onOpenLearning={learning.openTopic}
            />

            <MeasurementInput
              label="V1 terminal negative depth"
              value={pWave.v1TerminalNegativeDepthSmallBoxes ?? undefined}
              placeholder="1.0"
              unit="small boxes"
              helper="LAE support"
              onChange={(value) => updateMeasurement('v1TerminalNegativeDepthSmallBoxes', value)}
              learnTopicId="input.pWave.measurements"
              onOpenLearning={learning.openTopic}
            />

            <View style={styles.derivedPanel}>
              <Text style={styles.derivedLabel}>Derived atrial findings</Text>
              <Text style={styles.derivedValue}>{derivedFeatureLabels}</Text>
            </View>
          </View>
        )}

        <View style={styles.educationPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <View style={styles.educationCopy}>
            <Text style={styles.educationTitle}>Clinical thresholds</Text>
            <Text style={styles.educationText}>
              Notched P waves wider than 3 small boxes suggest left atrial enlargement. Peaked P waves taller than
              2.5 small boxes suggest right atrial enlargement.
            </Text>
          </View>
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
            if (isValid) router.push('/(ecg-flow)/step-3');
          }}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Complete P wave'}</Text>
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
    width: '16%',
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
  pWaveWindow: {
    alignItems: 'center',
    backgroundColor: 'rgba(18, 60, 64, 0.1)',
    borderColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    height: 52,
    justifyContent: 'flex-start',
    left: '25%',
    paddingTop: 5,
    position: 'absolute',
    top: 54,
    width: '20%',
  },
  pWaveLabel: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  durationGuide: {
    backgroundColor: Palette.primary,
    borderRadius: 999,
    left: '22%',
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    top: 22,
  },
  durationGuideText: {
    color: Palette.paper,
    fontSize: 10,
    fontWeight: '900',
  },
  amplitudeGuide: {
    backgroundColor: Palette.accentSoft,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
    position: 'absolute',
    right: 16,
    top: 18,
  },
  amplitudeGuideText: {
    color: Palette.accent,
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
  selectTrigger: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 78,
    padding: 14,
  },
  selectCopy: {
    flex: 1,
    gap: 3,
  },
  selectLabel: {
    color: Palette.primaryMuted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  selectValue: {
    color: Palette.ink,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 21,
  },
  selectPlaceholder: {
    color: Palette.muted,
    fontWeight: '800',
  },
  selectDetail: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(10, 30, 32, 0.45)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  pickerSheet: {
    backgroundColor: Palette.paper,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    gap: 16,
    maxHeight: '82%',
    padding: 18,
  },
  pickerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  pickerTitle: {
    color: Palette.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  pickerSubtitle: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  pickerCloseButton: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
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
  measurementBlock: {
    gap: 8,
  },
  measurementLabelRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'space-between',
  },
  measurementLabel: {
    color: Palette.ink,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    lineHeight: 19,
  },
  measurementLabelCopy: {
    flex: 1,
    minWidth: 0,
  },
  measurementHelper: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    color: Palette.primaryMuted,
    flexShrink: 0,
    fontSize: 11,
    fontWeight: '900',
    lineHeight: 14,
    maxWidth: '42%',
    paddingHorizontal: 8,
    paddingVertical: 4,
    textAlign: 'center',
    textTransform: 'uppercase',
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
  derivedPanel: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#c9ddda',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  derivedLabel: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  derivedValue: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 21,
    textTransform: 'capitalize',
  },
  educationPanel: {
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
  educationCopy: {
    flex: 1,
    gap: 3,
  },
  educationTitle: {
    color: '#255a49',
    fontSize: 14,
    fontWeight: '900',
  },
  educationText: {
    color: '#255a49',
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
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
