import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlowFooter, FlowHero, SectionHeader, flowStyles } from '@/components/ecg-flow-ui';
import { LearnableText, useLearningSheet } from '@/components/ecg-learning-sheet';
import { Palette, Radius } from '@/constants/design';
import { useEcgStore } from '@/store/ecgStore';

type TWaveStatus = 'normal' | 'inverted' | 'tall_peaked' | 'hyperacute' | 'biphasic' | 'flattened' | 'deep_symmetric';
const leadsList = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

function LeadChips({ selected, onToggle }: { selected: string[]; onToggle: (lead: string) => void }) {
  return (
    <View style={styles.chipGrid}>
      {leadsList.map((lead) => {
        const active = selected.includes(lead);
        return (
          <Pressable key={lead} style={[styles.chip, active && styles.chipActive]} onPress={() => onToggle(lead)}>
            <Text style={[styles.chipText, active && styles.chipTextActive]}>{lead}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export default function Step9() {
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const tWaves = draft.tWaves || {};
  const tWaveAbsent = tWaves.presence === 'absent';

  const markTWavePresence = (presence: 'present' | 'absent' | 'unclear') => {
    if (presence === 'absent') {
      updateDraft({
        tWaves: {
          presence,
          absentReason: tWaves.absentReason,
        },
        qtInterval: {
          measurementStatus: 'unmeasurable',
          unmeasurableReason: 'absent_t_waves',
        },
        stSegment: draft.stSegment?.status === 'not_assessable'
          ? draft.stSegment
          : {
              ...draft.stSegment,
              status: 'not_assessable',
              leads: [],
              reciprocalLeads: [],
              hasReciprocalChanges: false,
              smallBoxes: undefined,
            },
      });
      return;
    }

    updateDraft({
      tWaves: {
        ...tWaves,
        presence,
        ...(presence === 'present' && { absentReason: undefined }),
      },
    });
  };

  const setStatus = (status: TWaveStatus) => {
    updateDraft({ tWaves: { ...tWaves, presence: 'present', absentReason: undefined, status, ...(status === 'normal' && { leads: [] }) } });
  };

  const toggleLead = (lead: string) => {
    const current = tWaves.leads || [];
    updateDraft({
      tWaves: {
        ...tWaves,
        leads: current.includes(lead) ? current.filter((item) => item !== lead) : [...current, lead],
      },
    });
  };

  const involved = tWaves.leads || [];
  const isAbnormal = !tWaveAbsent && tWaves.status && tWaves.status !== 'normal';
  const isValid = tWaveAbsent || (!!tWaves.status && (!isAbnormal || involved.length > 0));
  const summary =
    tWaveAbsent
      ? 'T waves absent / not visible'
      : tWaves.status === 'normal'
      ? 'Normal concordant T waves'
      : tWaves.status === 'inverted'
        ? 'T wave inversion recorded'
        : tWaves.status
          ? `${tWaves.status.replace('_', ' ')} T waves recorded`
        : 'Awaiting T wave morphology';
  const morphologyLearningTopics: Record<TWaveStatus, string> = {
    normal: 'input.tWave.normal',
    inverted: 'input.tWave.inverted',
    tall_peaked: 'input.tWave.tallPeaked',
    hyperacute: 'input.tWave.hyperacute',
    biphasic: 'input.tWave.biphasic',
    flattened: 'input.tWave.flattened',
    deep_symmetric: 'input.tWave.deepSymmetric',
  };

  return (
    <View style={flowStyles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={flowStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHero
          step={9}
          label="Step 9 · T waves"
          title="Assess T-wave direction, shape, and involved leads."
          progress="75%"
          summaryLabel="T wave read"
          summary={summary}
          pills={[
            { label: 'Shape', complete: tWaveAbsent || !!tWaves.status },
            { label: 'Visible', complete: tWaves.presence === 'present' || tWaveAbsent },
            { label: 'Leads', complete: !isAbnormal || involved.length > 0 },
          ]}
          learnTopicId="step.tWaves"
          onOpenLearning={learning.openTopic}
        />

        <View style={flowStyles.card}>
          <SectionHeader
            icon="eye-outline"
            title="T-wave visibility"
            detail="Confirm whether T waves are visible before assessing morphology or measuring QT."
          />
          <View style={styles.toggleRow}>
            {[
              { label: 'Present', value: 'present' as const },
              { label: 'Absent', value: 'absent' as const },
              { label: 'Unclear', value: 'unclear' as const },
            ].map((option) => (
              <Pressable
                key={option.value}
                style={[styles.toggleButton, tWaves.presence === option.value && styles.toggleButtonActive]}
                onPress={() => markTWavePresence(option.value)}
              >
                <Text style={[styles.toggleButtonText, tWaves.presence === option.value && styles.toggleButtonTextActive]}>{option.label}</Text>
              </Pressable>
            ))}
          </View>
          {tWaveAbsent && (
            <>
              <Text style={styles.groupLabel}>Reason T waves are absent or not visible</Text>
              <View style={styles.chipGrid}>
                {[
                  { label: 'Asystole', value: 'asystole' },
                  { label: 'VF / no organised cycle', value: 'ventricular_fibrillation' },
                  { label: 'Very low amplitude', value: 'low_amplitude' },
                  { label: 'Artifact', value: 'artifact' },
                  { label: 'Merged with QRS/ST', value: 'merged_with_qrs_or_st' },
                  { label: 'Unclear', value: 'unclear' },
                  { label: 'Other', value: 'other' },
                ].map((reason) => {
                  const selected = tWaves.absentReason === reason.value;
                  return (
                    <Pressable
                      key={reason.value}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => updateDraft({ tWaves: { ...tWaves, presence: 'absent', absentReason: reason.value as any } })}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{reason.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          )}
        </View>

        {!tWaveAbsent && (
        <View style={flowStyles.card}>
          <SectionHeader
            icon="pulse-outline"
            title="T wave morphology"
            detail="Normal T waves are usually asymmetric and concordant with the QRS direction."
          />
          <View style={styles.optionStack}>
            {[
              { label: 'Normal', value: 'normal', icon: 'checkmark-circle-outline' as const, detail: 'Upright or expected direction for lead.' },
              { label: 'Inverted', value: 'inverted', icon: 'trending-down-outline' as const, detail: 'Downward deflection suggesting ischemia or strain.' },
              { label: 'Tall peaked', value: 'tall_peaked', icon: 'chevron-up-circle-outline' as const, detail: 'Tall, narrow, or broad-based T waves.' },
              { label: 'Hyperacute', value: 'hyperacute', icon: 'flash-outline' as const, detail: 'Broad, bulky early ischemic T waves.' },
              { label: 'Biphasic', value: 'biphasic', icon: 'swap-vertical-outline' as const, detail: 'Two-phase T wave, including Wellens-type patterns.' },
              { label: 'Flattened', value: 'flattened', icon: 'remove-outline' as const, detail: 'Low-amplitude repolarization abnormality.' },
              { label: 'Deep symmetric', value: 'deep_symmetric', icon: 'alert-circle-outline' as const, detail: 'Deep symmetric inversion pattern.' },
            ].map((option) => {
              const selected = tWaves.status === option.value;
              return (
                <Pressable key={option.value} style={[styles.optionRow, selected && styles.optionRowActive]} onPress={() => setStatus(option.value as TWaveStatus)}>
                  <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                    <Ionicons name={option.icon} size={18} color={selected ? Palette.paper : Palette.primary} />
                  </View>
                  <View style={styles.optionCopy}>
                    <LearnableText topicId={morphologyLearningTopics[option.value as TWaveStatus]} onOpen={learning.openTopic} style={[styles.optionTitle, selected && styles.optionTitleActive]}>
                      {option.label}
                    </LearnableText>
                    <Text style={styles.optionDetail}>{option.detail}</Text>
                  </View>
                  <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? Palette.primary : Palette.lineStrong} />
                </Pressable>
              );
            })}
          </View>
        </View>
        )}

        {isAbnormal && (
          <View style={flowStyles.card}>
            <SectionHeader
              icon="grid-outline"
              title="Involved leads"
              detail="Select leads where the abnormal T wave morphology is present."
            />
            <LeadChips selected={involved} onToggle={toggleLead} />
          </View>
        )}

        {isAbnormal && (
          <View style={flowStyles.card}>
            <SectionHeader
              icon="analytics-outline"
              title="T-wave pattern"
              detail="Capture the morphology and named syndrome pattern when present."
            />
            <LearnableText topicId="step.tWaves" onOpen={learning.openTopic} style={styles.groupLabel}>Morphology</LearnableText>
            <View style={styles.chipGrid}>
              {(['asymmetric', 'symmetric', 'broad_based', 'narrow_tented', 'biphasic_a', 'biphasic_b', 'camel_hump', 'unclear'] as const).map((value) => {
                const selected = tWaves.morphology === value;
                return (
                  <Pressable
                    key={value}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateDraft({ tWaves: { ...tWaves, morphology: value } })}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value.replace('_', ' ')}</Text>
                  </Pressable>
                );
              })}
            </View>
            <LearnableText topicId="step.tWaves" onOpen={learning.openTopic} style={styles.groupLabel}>Syndrome pattern</LearnableText>
            <View style={styles.chipGrid}>
              {[
                { label: 'None', value: 'none' },
                { label: 'Wellens A', value: 'wellens_a' },
                { label: 'Wellens B', value: 'wellens_b' },
                { label: 'de Winter', value: 'de_winter' },
                { label: 'Strain', value: 'strain' },
                { label: 'Juvenile', value: 'juvenile_pattern' },
                { label: 'PE', value: 'pe' },
                { label: 'Hyperkalemia', value: 'hyperkalemia' },
                { label: 'Hypokalemia', value: 'hypokalemia' },
                { label: 'CNS', value: 'cns_pattern' },
              ].map((option) => {
                const selected = tWaves.syndromePattern === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateDraft({ tWaves: { ...tWaves, syndromePattern: option.value as any } })}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.guideCard}>
          <Ionicons name="bulb-outline" size={20} color={Palette.success} />
          <View style={styles.guideCopy}>
            <Text style={styles.guideTitle}>Morphology guide</Text>
            <Text style={styles.guideText}>
              Tall peaked T waves may suggest hyperkalemia. Deep symmetric inversions can suggest ischemia, strain, or Wellens pattern depending on distribution.
            </Text>
          </View>
        </View>

        <View style={styles.contextCard}>
          <Text style={styles.contextTitle}>Current context</Text>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Rhythm</Text>
            <Text style={styles.contextValue}>
              {draft.rhythm?.rhythmCategory ? draft.rhythm.rhythmCategory.replaceAll('_', ' ') : 'Pending'}
            </Text>
          </View>
          <View style={styles.contextRow}>
            <Text style={styles.contextLabel}>Axis</Text>
            <Text style={styles.contextValue}>{draft.axis?.interpretedAxis || 'Pending'}</Text>
          </View>
        </View>
      </ScrollView>
      {learning.sheet}
      <FlowFooter isValid={isValid} disabledLabel="Complete T waves" nextHref="/(ecg-flow)/step-10" />
    </View>
  );
}

const styles = StyleSheet.create({
  optionStack: { gap: 10 },
  optionRow: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 76,
    padding: 13,
  },
  optionRowActive: { backgroundColor: Palette.primarySoft, borderColor: Palette.primary },
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
  optionIconActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  optionCopy: { flex: 1, gap: 2 },
  optionTitle: { color: Palette.ink, fontSize: 15, fontWeight: '900' },
  optionTitleActive: { color: Palette.primary },
  optionDetail: { color: Palette.muted, fontSize: 12, fontWeight: '700', lineHeight: 17 },
  chipGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderRadius: 999,
    borderWidth: 1,
    minWidth: 49,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  chipActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  chipText: { color: Palette.primary, fontSize: 12, fontWeight: '900' },
  chipTextActive: { color: Palette.paper },
  toggleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  toggleButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexGrow: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  toggleButtonActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  toggleButtonText: { color: Palette.primary, fontSize: 13, fontWeight: '900' },
  toggleButtonTextActive: { color: Palette.paper },
  guideCard: {
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
  guideCopy: { flex: 1, gap: 3 },
  guideTitle: { color: '#255a49', fontSize: 14, fontWeight: '900' },
  guideText: { color: '#255a49', fontSize: 13, fontWeight: '700', lineHeight: 19 },
  contextCard: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 10,
    padding: 15,
  },
  contextTitle: { color: Palette.primary, fontSize: 13, fontWeight: '900', textTransform: 'uppercase' },
  contextRow: { flexDirection: 'row', gap: 14, justifyContent: 'space-between' },
  contextLabel: { color: Palette.primaryMuted, fontSize: 13, fontWeight: '800' },
  contextValue: { color: Palette.primary, flex: 1, fontSize: 13, fontWeight: '900', textAlign: 'right' },
  groupLabel: { color: Palette.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
});
