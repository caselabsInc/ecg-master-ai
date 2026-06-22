import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { LearnableText, StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { EcgReferenceView } from '@/components/ecg-reference-view';
import { useEcgStore } from '@/store/ecgStore';

type RhythmCategory =
  | 'sinus'
  | 'sinus_bradycardia'
  | 'sinus_tachycardia'
  | 'sinus_arrhythmia'
  | 'atrial_fibrillation'
  | 'atrial_flutter'
  | 'svt'
  | 'junctional'
  | 'ventricular'
  | 'paced'
  | 'escape'
  | 'unclear'
  | 'other';

type EctopyValue = 'pac' | 'pvc' | 'couplet' | 'bigeminy' | 'trigeminy' | 'runs';
type RhythmConfidence = 'definite' | 'probable' | 'possible' | 'insufficient';
type PqrsRelationship =
  | 'one_to_one'
  | 'more_p_than_qrs'
  | 'more_qrs_than_p'
  | 'p_after_qrs'
  | 'no_consistent_relationship'
  | 'cannot_assess';

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

function formatLabel(value?: string) {
  if (!value) return 'Pending';
  return value
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function ratesMatch(first?: number | null, second?: number | null) {
  if (!first || !second) return false;
  return Math.abs(first - second) <= Math.max(5, Math.round(Math.max(first, second) * 0.1));
}

function inferPqrsRelationship({
  atrialRate,
  ventricularRate,
  pPresence,
  pMorphology,
  rrRegularity,
}: {
  atrialRate?: number | null;
  ventricularRate?: number | null;
  pPresence?: string;
  pMorphology?: string;
  rrRegularity?: string;
}): PqrsRelationship {
  if (pPresence === 'absent' || pPresence === 'unclear') return 'cannot_assess';
  if (pMorphology === 'retrograde') return 'p_after_qrs';
  if (!atrialRate || !ventricularRate) return 'cannot_assess';
  if (ratesMatch(atrialRate, ventricularRate)) return 'one_to_one';
  if (atrialRate > ventricularRate) return 'more_p_than_qrs';
  if (ventricularRate > atrialRate) return 'more_qrs_than_p';
  return rrRegularity === 'irregular' ? 'no_consistent_relationship' : 'cannot_assess';
}

function deriveRhythm({
  ventricularRate,
  atrialRate,
  rrRegularity,
  pPresence,
  pMorphology,
  abnormalAtrialActivity,
  absentPExplanation,
  prRegularity,
  droppedBeats,
  avBlockConcern,
  pacerSpikes,
  pQrsRelationship,
}: {
  ventricularRate?: number | null;
  atrialRate?: number | null;
  rrRegularity?: string;
  pPresence?: string;
  pMorphology?: string;
  abnormalAtrialActivity?: string;
  absentPExplanation?: string;
  prRegularity?: string;
  droppedBeats?: boolean;
  avBlockConcern?: string;
  pacerSpikes?: string;
  pQrsRelationship: PqrsRelationship;
}): { category: RhythmCategory; confidence: RhythmConfidence; reasoning: string[] } {
  const reasoning: string[] = [];

  if (pacerSpikes && pacerSpikes !== 'none') {
    return {
      category: 'paced',
      confidence: pacerSpikes === 'unclear' ? 'possible' : 'probable',
      reasoning: [`Pacer spikes recorded as ${formatLabel(pacerSpikes)}.`],
    };
  }

  if (pPresence === 'absent') {
    reasoning.push('Step 2 records absent discrete P waves.');

    if (abnormalAtrialActivity === 'fibrillatory_waves' || absentPExplanation === 'atrial_fibrillation' || rrRegularity === 'irregular') {
      reasoning.push('R-R rhythm is irregular or fibrillatory waves were selected as the abnormal atrial activity.');
      return { category: 'atrial_fibrillation', confidence: abnormalAtrialActivity === 'fibrillatory_waves' || absentPExplanation === 'atrial_fibrillation' ? 'probable' : 'possible', reasoning };
    }

    if (abnormalAtrialActivity === 'flutter_waves' || absentPExplanation === 'atrial_flutter' || (atrialRate !== null && atrialRate !== undefined && atrialRate >= 240 && atrialRate <= 360)) {
      reasoning.push('Flutter waves were selected or atrial rate falls in the usual flutter range.');
      return { category: 'atrial_flutter', confidence: abnormalAtrialActivity === 'flutter_waves' || absentPExplanation === 'atrial_flutter' ? 'probable' : 'possible', reasoning };
    }

    if (absentPExplanation === 'junctional_rhythm') {
      reasoning.push('Absent-P explanation points to a junctional rhythm.');
      return { category: 'junctional', confidence: 'probable', reasoning };
    }

    if (absentPExplanation === 'ventricular_rhythm') {
      reasoning.push('Absent-P explanation points to a ventricular rhythm.');
      return { category: 'ventricular', confidence: 'probable', reasoning };
    }
  }

  if (pPresence === 'present') {
    reasoning.push(`P waves are present with ${formatLabel(pMorphology)} morphology.`);
    reasoning.push(`Inferred P/QRS relationship: ${formatLabel(pQrsRelationship)}.`);

    if (pMorphology === 'retrograde' || pQrsRelationship === 'p_after_qrs') {
      reasoning.push('Retrograde or post-QRS P waves support a junctional source.');
      return { category: 'junctional', confidence: 'probable', reasoning };
    }

    if (pQrsRelationship === 'more_p_than_qrs' || droppedBeats || (avBlockConcern && avBlockConcern !== 'none')) {
      reasoning.push('Atrial activity exceeds ventricular conduction or AV block concern is recorded.');
      return { category: 'sinus', confidence: 'possible', reasoning };
    }

    if (pQrsRelationship === 'one_to_one' && prRegularity === 'constant') {
      reasoning.push('Atrial and ventricular rates match with constant PR behavior.');
      if (ventricularRate !== null && ventricularRate !== undefined && ventricularRate < 60) {
        return { category: 'sinus_bradycardia', confidence: 'probable', reasoning };
      }
      if (ventricularRate !== null && ventricularRate !== undefined && ventricularRate > 100) {
        return { category: 'sinus_tachycardia', confidence: 'probable', reasoning };
      }
      if (rrRegularity === 'irregular') {
        reasoning.push('R-R intervals are irregular but P/QRS relation remains matched.');
        return { category: 'sinus_arrhythmia', confidence: 'probable', reasoning };
      }
      return { category: 'sinus', confidence: 'probable', reasoning };
    }
  }

  if (rrRegularity === 'regular' && ventricularRate !== null && ventricularRate !== undefined && ventricularRate > 150 && pPresence !== 'present') {
    reasoning.push('Regular tachycardia over 150 bpm without confirmed sinus P waves.');
    return { category: 'svt', confidence: 'possible', reasoning };
  }

  reasoning.push('Current inputs do not support a confident rule-based rhythm category.');
  return { category: 'unclear', confidence: 'insufficient', reasoning };
}

export default function Step4() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const rhythm = draft.rhythm || {};
  const heartRate = draft.heartRate || {};
  const pWave = draft.pWave || {};
  const prInterval = draft.prInterval || {};

  const updateRhythm = (nextRhythm: typeof rhythm) => {
    updateDraft({ rhythm: nextRhythm });
  };

  const toggleEctopy = (value: EctopyValue) => {
    const current = rhythm.ectopy || [];
    updateRhythm({
      ...rhythm,
      ectopy: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    });
  };

  const rhythmComplete = !!rhythm.rhythmCategory;
  const isValid = rhythmComplete;
  const rhythmLabel = rhythm.rhythmCategory ? formatLabel(rhythm.rhythmCategory) : 'Awaiting rhythm classification';
  const ventricularRate = heartRate.ventricularRateBpm ?? heartRate.calculatedBpm;
  const atrialRate = heartRate.atrialRateBpm;
  const inferredPqrsRelationship = inferPqrsRelationship({
    atrialRate,
    ventricularRate,
    pPresence: pWave.presence,
    pMorphology: pWave.morphology,
    rrRegularity: heartRate.regularity,
  });
  const derivedRhythm = deriveRhythm({
    ventricularRate,
    atrialRate,
    rrRegularity: heartRate.regularity,
    pPresence: pWave.presence,
    pMorphology: pWave.morphology,
    abnormalAtrialActivity: pWave.abnormalAtrialActivity,
    absentPExplanation: pWave.absentPExplanation,
    prRegularity: prInterval.regularity,
    droppedBeats: prInterval.droppedBeats,
    avBlockConcern: prInterval.avBlockConcern,
    pacerSpikes: rhythm.pacerSpikes,
    pQrsRelationship: inferredPqrsRelationship,
  });

  React.useEffect(() => {
    const nextReasoning = derivedRhythm.reasoning;
    const reasoningChanged = JSON.stringify(rhythm.rhythmReasoning || []) !== JSON.stringify(nextReasoning);

    if (
      rhythm.derivedRhythmCategory !== derivedRhythm.category ||
      rhythm.rhythmConfidence !== derivedRhythm.confidence ||
      rhythm.pQrsRelationship !== inferredPqrsRelationship ||
      reasoningChanged
    ) {
      updateRhythm({
        ...rhythm,
        derivedRhythmCategory: derivedRhythm.category,
        rhythmConfidence: derivedRhythm.confidence,
        pQrsRelationship: inferredPqrsRelationship,
        rhythmReasoning: nextReasoning,
      });
    }
  }, [
    derivedRhythm.category,
    derivedRhythm.confidence,
    inferredPqrsRelationship,
    JSON.stringify(derivedRhythm.reasoning),
  ]);

  const rhythmOptions: Array<{
    label: string;
    value: RhythmCategory;
    detail: string;
    icon: keyof typeof Ionicons.glyphMap;
  }> = [
    {
      label: 'Sinus rhythm',
      value: 'sinus',
      detail: 'Use when the rhythm strip looks sinus and Step 2 supports sinus P waves.',
      icon: 'pulse-outline',
    },
    {
      label: 'Sinus bradycardia',
      value: 'sinus_bradycardia',
      detail: 'Sinus pattern with slow ventricular rate from Step 1.',
      icon: 'trending-down-outline',
    },
    {
      label: 'Sinus tachycardia',
      value: 'sinus_tachycardia',
      detail: 'Sinus pattern with fast ventricular rate from Step 1.',
      icon: 'trending-up-outline',
    },
    {
      label: 'Sinus arrhythmia',
      value: 'sinus_arrhythmia',
      detail: 'Sinus rhythm with cyclical rate variation.',
      icon: 'swap-horizontal-outline',
    },
    {
      label: 'Atrial fibrillation',
      value: 'atrial_fibrillation',
      detail: 'Irregular rhythm where Step 2 documents absent discrete P waves.',
      icon: 'analytics-outline',
    },
    {
      label: 'Atrial flutter',
      value: 'atrial_flutter',
      detail: 'Atrial activity should be supported by the Step 2 P/flutter-wave assessment.',
      icon: 'reorder-three-outline',
    },
    {
      label: 'SVT',
      value: 'svt',
      detail: 'Regular narrow-complex tachy rhythm impression.',
      icon: 'flash-outline',
    },
    {
      label: 'Junctional',
      value: 'junctional',
      detail: 'Escape or accelerated junctional rhythm impression.',
      icon: 'git-branch-outline',
    },
    {
      label: 'Ventricular rhythm',
      value: 'ventricular',
      detail: 'Ventricular rhythm impression; QRS evidence is captured in Step 5.',
      icon: 'pulse',
    },
    {
      label: 'Paced rhythm',
      value: 'paced',
      detail: 'Use with pacer-spike type below.',
      icon: 'hardware-chip-outline',
    },
    {
      label: 'Escape rhythm',
      value: 'escape',
      detail: 'Escape rhythm impression when the dominant pacemaker is unclear.',
      icon: 'return-down-forward-outline',
    },
    {
      label: 'Unclear',
      value: 'unclear',
      detail: 'Use when artifact or limited leads prevent confident classification.',
      icon: 'help-circle-outline',
    },
    {
      label: 'Other',
      value: 'other',
      detail: 'Describe the rhythm in the note field.',
      icon: 'ellipsis-horizontal-circle-outline',
    },
  ];

  const pacerOptions = [
    { label: 'None', value: 'none' },
    { label: 'Atrial', value: 'atrial' },
    { label: 'Ventricular', value: 'ventricular' },
    { label: 'Dual', value: 'dual' },
    { label: 'Unclear', value: 'unclear' },
  ] as const;

  const ectopyOptions = [
    { label: 'PAC', value: 'pac' },
    { label: 'PVC', value: 'pvc' },
    { label: 'Couplets', value: 'couplet' },
    { label: 'Bigeminy', value: 'bigeminy' },
    { label: 'Trigeminy', value: 'trigeminy' },
    { label: 'Runs', value: 'runs' },
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
              <Text style={styles.kicker}>Step 4 · Rhythm</Text>
              <Text style={styles.heroTitle}>Classify the rhythm without re-measuring the strip.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>4</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroSummary}>
            <View style={styles.heroSummaryCopy}>
              <Text style={styles.heroSummaryLabel}>Rhythm read</Text>
              <Text style={styles.heroSummaryValue}>{rhythmLabel}</Text>
            </View>
            <View style={styles.summaryPillColumn}>
              <SummaryPill label="Category" complete={rhythmComplete} />
              <SummaryPill label="Modifiers" complete={!!rhythm.pacerSpikes || !!rhythm.ectopy?.length} />
            </View>
          </View>
        </View>
        <StepLearningButton topicId="step.rhythm" onOpen={learning.openTopic} />

        <View style={styles.contextCard}>
          <SectionHeader
            icon="calculator-outline"
            title="Step 1 context"
            detail="These values come from square counting. Use them to guide rhythm classification; do not re-enter them here."
          />
          <View style={styles.contextGrid}>
            <View style={styles.contextTile}>
              <Text style={styles.contextLabel}>Regularity</Text>
              <Text style={styles.contextValue}>{formatLabel(heartRate.regularity)}</Text>
            </View>
            <View style={styles.contextTile}>
              <Text style={styles.contextLabel}>Ventricular rate</Text>
              <Text style={styles.contextValue}>{ventricularRate ? `${ventricularRate} bpm` : 'Pending'}</Text>
            </View>
            <View style={styles.contextTile}>
              <Text style={styles.contextLabel}>Atrial rate</Text>
              <Text style={styles.contextValue}>{atrialRate ? `${atrialRate} bpm` : 'Not measured'}</Text>
            </View>
            <View style={styles.contextTile}>
              <Text style={styles.contextLabel}>P waves</Text>
              <Text style={styles.contextValue}>{formatLabel(pWave.presence)}</Text>
            </View>
            <View style={styles.contextTile}>
              <Text style={styles.contextLabel}>PR behavior</Text>
              <Text style={styles.contextValue}>{formatLabel(prInterval.regularity)}</Text>
            </View>
            <View style={styles.contextTile}>
              <Text style={styles.contextLabel}>AV concern</Text>
              <Text style={styles.contextValue}>{formatLabel(prInterval.avBlockConcern)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.ruleCard}>
          <SectionHeader
            icon="sparkles-outline"
            title="Suggested rhythm"
            detail="Based on the recorded rate, P-wave, and PR-conduction findings. Use it when it matches the strip, or choose a better rhythm below."
          />

          <View style={styles.ruleSummaryGrid}>
            <View style={styles.ruleSummaryTile}>
              <Text style={styles.contextLabel}>P/QRS relation</Text>
              <Text style={styles.ruleSummaryValue}>{formatLabel(inferredPqrsRelationship)}</Text>
            </View>
            <View style={styles.ruleSummaryTile}>
              <Text style={styles.contextLabel}>Suggested rhythm</Text>
              <Text style={styles.ruleSummaryValue}>{formatLabel(derivedRhythm.category)}</Text>
            </View>
            <View style={styles.ruleSummaryTile}>
              <Text style={styles.contextLabel}>Confidence</Text>
              <Text style={styles.ruleSummaryValue}>{formatLabel(derivedRhythm.confidence)}</Text>
            </View>
          </View>

          <View style={styles.reasoningPanel}>
            {derivedRhythm.reasoning.map((reason, index) => (
              <View key={`${reason}-${index}`} style={styles.reasoningRow}>
                <Ionicons name="checkmark-circle" size={16} color={Palette.success} />
                <Text style={styles.reasoningText}>{reason}</Text>
              </View>
            ))}
          </View>

          <Pressable
            style={styles.applyRuleButton}
            onPress={() =>
              updateRhythm({
                ...rhythm,
                rhythmCategory: derivedRhythm.category,
                derivedRhythmCategory: derivedRhythm.category,
                rhythmConfidence: derivedRhythm.confidence,
                pQrsRelationship: inferredPqrsRelationship,
                rhythmReasoning: derivedRhythm.reasoning,
              })
            }
          >
            <Ionicons name="checkmark-circle-outline" size={18} color={Palette.paper} />
            <Text style={styles.applyRuleButtonText}>Use recommendation</Text>
          </Pressable>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="git-network-outline"
            title="Rhythm category"
            detail="Confirm the suggested category or choose a better match when the rhythm strip supports it."
          />

          <View style={styles.optionStack}>
            {rhythmOptions.map((option) => {
              const selected = rhythm.rhythmCategory === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionRow, selected && styles.optionRowActive]}
                  onPress={() => updateRhythm({ ...rhythm, rhythmCategory: option.value })}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                    <Ionicons name={option.icon} size={18} color={selected ? Palette.paper : Palette.primary} />
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={[styles.optionTitle, selected && styles.optionTitleActive]}>{option.label}</Text>
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

        <View style={styles.card}>
          <SectionHeader
            icon="options-outline"
            title="Rhythm modifiers"
            detail="Add rhythm-strip features that change interpretation without duplicating rate or P-wave measurements."
          />

          <LearnableText topicId="step.rhythm" onOpen={learning.openTopic} style={styles.groupLabel}>Ectopy</LearnableText>
          <View style={styles.chipGrid}>
            {ectopyOptions.map((option) => {
              const selected = rhythm.ectopy?.includes(option.value);
              return (
                <Pressable
                  key={option.value}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => toggleEctopy(option.value)}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <LearnableText topicId="step.rhythm" onOpen={learning.openTopic} style={styles.groupLabel}>Pacer spikes</LearnableText>
          <View style={styles.chipGrid}>
            {pacerOptions.map((option) => {
              const selected = rhythm.pacerSpikes === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => updateRhythm({ ...rhythm, pacerSpikes: option.value })}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            style={styles.notesInput}
            placeholder="Short rhythm impression, e.g. irregular narrow-complex rhythm most consistent with AF"
            placeholderTextColor={Palette.subtle}
            multiline
            value={rhythm.rhythmImpression || ''}
            onChangeText={(rhythmImpression) => updateRhythm({ ...rhythm, rhythmImpression })}
          />
        </View>

        <View style={styles.traceCard}>
          <View style={styles.traceHeader}>
            <View>
              <Text style={styles.traceTitle}>ECG reference view</Text>
              <Text style={styles.traceSubtitle}>Use the rhythm strip pattern together with the P-wave proof already recorded.</Text>
            </View>
            <View style={styles.traceBadge}>
              <Text style={styles.traceBadgeText}>Lead II</Text>
            </View>
          </View>

          <EcgReferenceView variant="rhythm" />

          <View style={styles.referenceFooter}>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>25 mm/s</Text>
            </View>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>10 mm/mV</Text>
            </View>
          </View>
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            Step 4 names the rhythm after rate, P-wave, and PR-conduction evidence are available.
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
            if (isValid) router.push('/(ecg-flow)/step-5');
          }}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Choose rhythm'}</Text>
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
    width: '33%',
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
  contextCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 14,
    padding: 18,
  },
  contextGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  contextTile: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexBasis: '31%',
    flexGrow: 1,
    gap: 5,
    minWidth: 130,
    padding: 12,
  },
  contextLabel: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  contextValue: {
    color: Palette.ink,
    fontSize: 15,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  ruleCard: {
    backgroundColor: Palette.paper,
    borderColor: '#c5e4d8',
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 14,
    padding: 18,
  },
  ruleSummaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ruleSummaryTile: {
    backgroundColor: Palette.successSoft,
    borderColor: '#c5e4d8',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexBasis: '31%',
    flexGrow: 1,
    gap: 5,
    minWidth: 130,
    padding: 12,
  },
  ruleSummaryValue: {
    color: '#255a49',
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 20,
  },
  reasoningPanel: {
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
  applyRuleButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 14,
  },
  applyRuleButtonText: {
    color: Palette.paper,
    fontSize: 14,
    fontWeight: '900',
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
  groupLabel: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
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
  chipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  chipText: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  chipTextActive: {
    color: Palette.paper,
  },
  notesInput: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 20,
    minHeight: 76,
    padding: 13,
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
  referenceFooter: {
    flexDirection: 'row',
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
