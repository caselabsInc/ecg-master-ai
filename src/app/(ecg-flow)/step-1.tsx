import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { LearnableText, StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { EcgReferenceView } from '@/components/ecg-reference-view';
import { useEcgStore } from '@/store/ecgStore';

type Regularity = 'regular' | 'irregular';
type IntervalKind = 'rr' | 'pp';

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

function BpmStatus({ bpm }: { bpm: number }) {
  const status =
    bpm < 60
      ? { label: 'Bradycardia', color: Palette.accent, background: Palette.accentSoft }
      : bpm > 100
        ? { label: 'Tachycardia', color: Palette.accent, background: Palette.accentSoft }
        : { label: 'Normal range', color: Palette.success, background: Palette.successSoft };

  return (
    <View style={[styles.statusPill, { backgroundColor: status.background }]}>
      <Text style={[styles.statusPillText, { color: status.color }]}>{status.label}</Text>
    </View>
  );
}

function parsePositiveBoxes(text: string) {
  const value = parseFloat(text);
  return Number.isFinite(value) && value > 0 ? value : null;
}

function bpmFromLargeBoxes(boxes?: number | null) {
  return boxes && boxes > 0 ? Math.round(300 / boxes) : undefined;
}

function bpmFromIntervals(intervals?: number[] | null) {
  const validIntervals = (intervals || []).filter((interval) => Number.isFinite(interval) && interval > 0);
  if (!validIntervals.length) return undefined;
  const averageBoxes = validIntervals.reduce((sum, interval) => sum + interval, 0) / validIntervals.length;
  return bpmFromLargeBoxes(averageBoxes);
}

function averageBoxesText(intervals?: number[] | null) {
  const validIntervals = (intervals || []).filter((interval) => Number.isFinite(interval) && interval > 0);
  if (!validIntervals.length) return '--';
  return (validIntervals.reduce((sum, interval) => sum + interval, 0) / validIntervals.length).toFixed(1);
}

function rateSeverity(bpm?: number | null) {
  return bpm === undefined || bpm === null
    ? undefined
    : bpm < 40
      ? 'extreme_bradycardia'
      : bpm < 60
        ? 'bradycardia'
        : bpm > 150
          ? 'extreme_tachycardia'
          : bpm > 100
            ? 'tachycardia'
            : 'normal';
}

export default function Step1() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const heartRate = draft.heartRate || {};

  const [rrBoxesText, setRrBoxesText] = React.useState(heartRate.largeBoxesBetweenR?.toString() || '');
  const [ppBoxesText, setPpBoxesText] = React.useState(heartRate.largeBoxesBetweenP?.toString() || '');

  const isRegular = heartRate.regularity === 'regular';
  const isIrregular = heartRate.regularity === 'irregular';
  const rrIntervals = heartRate.rrIntervalLargeBoxes?.length ? heartRate.rrIntervalLargeBoxes : [0];
  const ppIntervals = heartRate.ppIntervalLargeBoxes || [];
  const calculatedBpm = heartRate.ventricularRateBpm ?? heartRate.calculatedBpm;
  const atrialRate = heartRate.atrialRateBpm;
  const isValid = !!heartRate.regularity && (isRegular ? !!heartRate.largeBoxesBetweenR : rrIntervals.some((interval) => interval > 0));

  const writeHeartRate = React.useCallback(
    (nextHeartRate: typeof heartRate) => {
      updateDraft({
        heartRate: {
          ...nextHeartRate,
          rateSeverity: rateSeverity(nextHeartRate.ventricularRateBpm ?? nextHeartRate.calculatedBpm),
        },
      });
    },
    [updateDraft]
  );

  const handleRegularityChange = (regularity: Regularity) => {
    setRrBoxesText('');
    setPpBoxesText('');
    writeHeartRate({
      ...heartRate,
      regularity,
      largeBoxesBetweenR: null,
      largeBoxesBetweenP: null,
      rrIntervalLargeBoxes: regularity === 'irregular' ? [0] : null,
      ppIntervalLargeBoxes: regularity === 'irregular' ? [] : null,
      qrsCountIn10Sec: null,
      calculatedBpm: undefined,
      atrialRateBpm: null,
      ventricularRateBpm: null,
    });
  };

  const handleRegularBoxesChange = (kind: IntervalKind, text: string) => {
    if (kind === 'rr') {
      setRrBoxesText(text);
    } else {
      setPpBoxesText(text);
    }

    const boxes = parsePositiveBoxes(text);
    const bpm = bpmFromLargeBoxes(boxes);
    writeHeartRate(
      kind === 'rr'
        ? {
            ...heartRate,
            largeBoxesBetweenR: boxes,
            ventricularRateBpm: bpm ?? null,
            calculatedBpm: bpm,
          }
        : {
            ...heartRate,
            largeBoxesBetweenP: boxes,
            atrialRateBpm: bpm ?? null,
          }
    );
  };

  const updateInterval = (kind: IntervalKind, index: number, text: string) => {
    const field = kind === 'rr' ? 'rrIntervalLargeBoxes' : 'ppIntervalLargeBoxes';
    const currentIntervals = [...((heartRate[field] as number[] | null | undefined) || [])];
    currentIntervals[index] = parsePositiveBoxes(text) ?? 0;
    const bpm = bpmFromIntervals(currentIntervals);

    writeHeartRate({
      ...heartRate,
      [field]: currentIntervals,
      ...(kind === 'rr'
        ? { ventricularRateBpm: bpm ?? null, calculatedBpm: bpm }
        : { atrialRateBpm: bpm ?? null }),
    });
  };

  const addInterval = (kind: IntervalKind) => {
    const field = kind === 'rr' ? 'rrIntervalLargeBoxes' : 'ppIntervalLargeBoxes';
    writeHeartRate({
      ...heartRate,
      [field]: [...((heartRate[field] as number[] | null | undefined) || []), 0],
    });
  };

  const removeInterval = (kind: IntervalKind, index: number) => {
    const field = kind === 'rr' ? 'rrIntervalLargeBoxes' : 'ppIntervalLargeBoxes';
    const currentIntervals = [...((heartRate[field] as number[] | null | undefined) || [])];
    const nextIntervals = currentIntervals.filter((_, currentIndex) => currentIndex !== index);
    const bpm = bpmFromIntervals(nextIntervals);

    writeHeartRate({
      ...heartRate,
      [field]: nextIntervals,
      ...(kind === 'rr'
        ? { ventricularRateBpm: bpm ?? null, calculatedBpm: bpm }
        : { atrialRateBpm: bpm ?? null }),
    });
  };

  const renderIntervalInput = (kind: IntervalKind, interval: number, index: number, intervals: number[]) => {
    const isRequiredSingleRr = kind === 'rr' && intervals.length <= 1;
    const label = kind === 'rr' ? `R-R interval ${index + 1}` : `P-P interval ${index + 1}`;

    return (
      <View key={`${kind}-${index}`} style={styles.intervalRow}>
        <View style={styles.intervalCopy}>
          <LearnableText topicId={kind === 'rr' ? 'input.rr' : 'input.pp'} onOpen={learning.openTopic} style={styles.intervalLabel}>{label}</LearnableText>
          <TextInput
            style={styles.intervalInput}
            placeholder="4"
            placeholderTextColor={Palette.subtle}
            keyboardType="decimal-pad"
            value={interval > 0 ? interval.toString() : ''}
            onChangeText={(text) => updateInterval(kind, index, text)}
          />
        </View>
        <Text style={styles.intervalUnit}>{kind === 'rr' ? 'R-R boxes' : 'P-P boxes'}</Text>
        <Pressable
          accessibilityLabel={`Delete ${label}`}
          disabled={isRequiredSingleRr}
          onPress={() => removeInterval(kind, index)}
          style={[styles.deleteIntervalButton, isRequiredSingleRr && styles.deleteIntervalButtonDisabled]}
        >
          <Ionicons name="trash-outline" size={18} color={isRequiredSingleRr ? Palette.subtle : Palette.accent} />
        </Pressable>
      </View>
    );
  };

  const formula = isRegular ? `300 / ${heartRate.largeBoxesBetweenR || '--'}` : `300 / ${averageBoxesText(rrIntervals)}`;
  const atrialFormula = isRegular
    ? `300 / ${heartRate.largeBoxesBetweenP || '--'}`
    : ppIntervals.some((interval) => interval > 0)
      ? `300 / ${averageBoxesText(ppIntervals)}`
      : 'P-P not measured';

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
              <Text style={styles.kicker}>Step 1 · Heart rate</Text>
              <Text style={styles.heroTitle}>Convert ECG squares into atrial and ventricular rates.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>1</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroResult}>
            <View>
              <Text style={styles.heroResultLabel}>Ventricular estimate</Text>
              <Text style={styles.heroResultValue} selectable>
                {calculatedBpm ?? '--'} <Text style={styles.heroResultUnit}>bpm</Text>
              </Text>
            </View>
            {calculatedBpm !== undefined ? <BpmStatus bpm={calculatedBpm} /> : <Text style={styles.pendingText}>Awaiting R-R</Text>}
          </View>
        </View>
        <StepLearningButton topicId="step.heartRate" onOpen={learning.openTopic} />

        <View style={styles.card}>
          <SectionHeader
            icon="pulse-outline"
            title="Rhythm regularity"
            detail="Choose whether one interval is representative, or whether several R-R/P-P intervals need sampling."
          />

          <View style={styles.choiceGrid}>
            <Pressable style={[styles.choiceCard, isRegular && styles.choiceCardActive]} onPress={() => handleRegularityChange('regular')}>
              <View style={[styles.choiceIcon, isRegular && styles.choiceIconActive]}>
                <Ionicons name="git-commit-outline" size={19} color={isRegular ? Palette.paper : Palette.primary} />
              </View>
              <Text style={[styles.choiceTitle, isRegular && styles.choiceTitleActive]}>Regular</Text>
              <Text style={[styles.choiceText, isRegular && styles.choiceTextActive]}>One R-R and one optional P-P interval.</Text>
            </Pressable>

            <Pressable style={[styles.choiceCard, isIrregular && styles.choiceCardActive]} onPress={() => handleRegularityChange('irregular')}>
              <View style={[styles.choiceIcon, isIrregular && styles.choiceIconActive]}>
                <Ionicons name="analytics-outline" size={19} color={isIrregular ? Palette.paper : Palette.primary} />
              </View>
              <Text style={[styles.choiceTitle, isIrregular && styles.choiceTitleActive]}>Irregular</Text>
              <Text style={[styles.choiceText, isIrregular && styles.choiceTextActive]}>Add measured interval samples.</Text>
            </Pressable>
          </View>
        </View>

        {heartRate.regularity && (
          <View style={styles.card}>
            <SectionHeader
              icon={isRegular ? 'grid-outline' : 'add-circle-outline'}
              title={isRegular ? 'Square-based rate calculation' : 'Irregular interval samples'}
              detail={
                isRegular
                  ? 'Count large boxes between R waves for ventricular rate, and P waves for atrial rate when visible.'
                  : 'Add R-R gaps for ventricular rate. Add P-P gaps only when atrial activity is measurable.'
              }
            />

            {isRegular ? (
              <>
                <View style={styles.rateMeasureBlock}>
                  <LearnableText topicId="input.rr" onOpen={learning.openTopic} style={styles.rateMeasureLabel}>Ventricular rate from R-R boxes</LearnableText>
                  <View style={styles.measureInputShell}>
                    <TextInput
                      style={styles.measureInput}
                      placeholder="4"
                      placeholderTextColor={Palette.subtle}
                      keyboardType="decimal-pad"
                      value={rrBoxesText}
                      onChangeText={(text) => handleRegularBoxesChange('rr', text)}
                    />
                    <View style={styles.measureUnit}>
                      <Text style={styles.measureUnitText}>R-R large boxes</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.rateMeasureBlock}>
                  <LearnableText topicId="input.pp" onOpen={learning.openTopic} style={styles.rateMeasureLabel}>Atrial rate from P-P boxes</LearnableText>
                  <View style={styles.measureInputShell}>
                    <TextInput
                      style={styles.measureInput}
                      placeholder="4"
                      placeholderTextColor={Palette.subtle}
                      keyboardType="decimal-pad"
                      value={ppBoxesText}
                      onChangeText={(text) => handleRegularBoxesChange('pp', text)}
                    />
                    <View style={styles.measureUnit}>
                      <Text style={styles.measureUnitText}>P-P large boxes</Text>
                    </View>
                  </View>
                </View>
              </>
            ) : (
              <>
                <View style={styles.intervalGroup}>
                  <View style={styles.intervalGroupHeader}>
                    <View style={styles.intervalGroupCopy}>
                      <Text style={styles.intervalGroupTitle}>Ventricular R-R samples</Text>
                      <Text style={styles.intervalGroupDetail}>Add each measured R-R gap in large boxes.</Text>
                    </View>
                    <Pressable style={styles.addIntervalButton} onPress={() => addInterval('rr')}>
                      <Ionicons name="add" size={18} color={Palette.paper} />
                      <Text style={styles.addIntervalText}>Add</Text>
                    </Pressable>
                  </View>
                  {rrIntervals.map((interval, index) => renderIntervalInput('rr', interval, index, rrIntervals))}
                </View>

                <View style={styles.intervalGroup}>
                  <View style={styles.intervalGroupHeader}>
                    <View style={styles.intervalGroupCopy}>
                      <Text style={styles.intervalGroupTitle}>Atrial P-P samples</Text>
                      <Text style={styles.intervalGroupDetail}>Use when P waves or flutter waves are measurable.</Text>
                    </View>
                    <Pressable style={styles.addIntervalButton} onPress={() => addInterval('pp')}>
                      <Ionicons name="add" size={18} color={Palette.paper} />
                      <Text style={styles.addIntervalText}>Add</Text>
                    </Pressable>
                  </View>
                  {ppIntervals.length > 0 ? (
                    ppIntervals.map((interval, index) => renderIntervalInput('pp', interval, index, ppIntervals))
                  ) : (
                    <Text style={styles.emptyIntervalText}>No P-P samples added.</Text>
                  )}
                </View>
              </>
            )}

            <View style={styles.formulaGrid}>
              <View style={styles.formulaPanel}>
                <Text style={styles.formulaLabel}>Ventricular formula</Text>
                <Text style={styles.formulaValue} selectable>
                  {formula} = {calculatedBpm ?? '--'} bpm
                </Text>
              </View>
              <View style={styles.formulaPanel}>
                <Text style={styles.formulaLabel}>Atrial formula</Text>
                <Text style={styles.formulaValue} selectable>
                  {atrialFormula} = {atrialRate ?? '--'} bpm
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.traceCard}>
          <View style={styles.traceHeader}>
            <View>
              <Text style={styles.traceTitle}>Counting reference</Text>
              <Text style={styles.traceSubtitle}>Large boxes give a fast bedside rate estimate.</Text>
            </View>
            <View style={styles.traceBadge}>
              <Text style={styles.traceBadgeText}>300 rule</Text>
            </View>
          </View>

          <EcgReferenceView variant="heart-rate" />

          <View style={styles.instructions}>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionNumber}>1</Text>
              <Text style={styles.instructionText}>Count large boxes from one R peak to the next R peak.</Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionNumber}>2</Text>
              <Text style={styles.instructionText}>If P waves are visible, count large boxes from P to P.</Text>
            </View>
            <View style={styles.instructionRow}>
              <Text style={styles.instructionNumber}>3</Text>
              <Text style={styles.instructionText}>Divide 300 by the large-box interval; sample multiple intervals when irregular.</Text>
            </View>
          </View>
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="bulb-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            When P waves are absent or chaotic, leave P-P blank here and classify the atrial activity in Step 4.
          </Text>
        </View>
      </ScrollView>
      {learning.sheet}

      <View style={styles.footer}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={18} color={Palette.primary} />
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>

        <Pressable style={[styles.nextButton, !isValid && styles.nextButtonDisabled]} onPress={() => router.push('/(ecg-flow)/step-2')} disabled={!isValid}>
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Enter R-R boxes'}</Text>
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
    width: '8%',
  },
  heroResult: {
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
  heroResultLabel: {
    color: '#cfe6e2',
    fontSize: 12,
    fontWeight: '800',
  },
  heroResultValue: {
    color: Palette.paper,
    fontSize: 30,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  heroResultUnit: {
    color: '#cfe6e2',
    fontSize: 14,
    fontWeight: '800',
  },
  pendingText: {
    color: '#cfe6e2',
    fontSize: 12,
    fontWeight: '800',
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
    minHeight: 120,
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
  rateMeasureBlock: {
    gap: 8,
  },
  rateMeasureLabel: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  measureInputShell: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 66,
    paddingHorizontal: 16,
  },
  measureInput: {
    color: Palette.ink,
    flex: 1,
    fontSize: 28,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    paddingVertical: 12,
  },
  measureUnit: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 11,
    paddingVertical: 7,
  },
  measureUnitText: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  intervalGroup: {
    gap: 10,
  },
  intervalGroupHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  intervalGroupCopy: {
    flex: 1,
    gap: 2,
  },
  intervalGroupTitle: {
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  intervalGroupDetail: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  addIntervalButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  addIntervalText: {
    color: Palette.paper,
    fontSize: 12,
    fontWeight: '900',
  },
  intervalRow: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 64,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  intervalCopy: {
    flex: 1,
    gap: 2,
  },
  intervalLabel: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  intervalInput: {
    color: Palette.ink,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    minHeight: 36,
    paddingVertical: 4,
  },
  intervalUnit: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
  },
  deleteIntervalButton: {
    alignItems: 'center',
    backgroundColor: Palette.accentSoft,
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  deleteIntervalButtonDisabled: {
    backgroundColor: Palette.line,
  },
  emptyIntervalText: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '700',
  },
  formulaGrid: {
    gap: 10,
  },
  formulaPanel: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#c9ddda',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 4,
    padding: 14,
  },
  formulaLabel: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  formulaValue: {
    color: Palette.ink,
    fontSize: 18,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  statusPill: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: '900',
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
  instructions: {
    gap: 12,
    padding: 18,
  },
  instructionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  instructionNumber: {
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    color: Palette.primary,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    height: 24,
    lineHeight: 24,
    textAlign: 'center',
    width: 24,
  },
  instructionText: {
    color: Palette.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
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
