import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlowFooter, FlowHero, SectionHeader, flowStyles } from '@/components/ecg-flow-ui';
import { LearnableText, useLearningSheet } from '@/components/ecg-learning-sheet';
import { Palette, Radius } from '@/constants/design';
import { standardLeads } from '@/constants/ecg';
import { useEcgStore } from '@/store/ecgStore';

type RWaveProgression = 'normal' | 'abnormal' | 'not_assessed';
type UWavePresence = boolean | 'not_assessed';

export default function Step11() {
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const uWaves = draft.uWaves || {};
  const lateWaveFindings = draft.lateWaveFindings || {};

  const setUWavePresent = (present: UWavePresence) => {
    updateDraft({
      uWaves: {
        ...uWaves,
        present,
        ...(present !== true && { note: null }),
      },
    });
  };

  const isValid = draft.rWaveProgression !== undefined && uWaves.present !== undefined;
  const summary =
    draft.rWaveProgression === 'normal'
      ? 'Normal precordial progression'
      : draft.rWaveProgression === 'abnormal'
        ? 'Poor R-wave progression noted'
        : draft.rWaveProgression === 'not_assessed'
          ? 'Progression not assessed'
          : 'Awaiting R-wave review';

  return (
    <View style={flowStyles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={flowStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHero
          step={11}
          label="Step 11 · R wave and U waves"
          title="Assess precordial progression and late repolarization."
          progress="91%"
          summaryLabel="Late-wave read"
          summary={summary}
          pills={[
            { label: 'R wave', complete: draft.rWaveProgression !== undefined },
            { label: 'U wave', complete: uWaves.present !== undefined },
          ]}
          learnTopicId="step.lateWaves"
          onOpenLearning={learning.openTopic}
        />

        <View style={flowStyles.card}>
          <SectionHeader
            icon="trending-up-outline"
            title="R-wave progression"
            detail="Across V1-V6, the R wave should generally increase in amplitude toward the left chest leads."
          />
          <View style={styles.optionStack}>
            {[
              {
                label: 'Normal progression',
                value: 'normal',
                icon: 'checkmark-circle-outline' as const,
                detail: 'R waves increase appropriately from V1 toward V5-V6.',
              },
              {
                label: 'Poor or abnormal',
                value: 'abnormal',
                icon: 'alert-circle-outline' as const,
                detail: 'Delayed transition, low R in V3, or reversed progression.',
              },
              {
                label: 'Not assessed',
                value: 'not_assessed',
                icon: 'remove-circle-outline' as const,
                detail: 'Lead placement or trace quality prevents a confident read.',
              },
            ].map((option) => {
              const selected = draft.rWaveProgression === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionRow, selected && styles.optionRowActive]}
                  onPress={() => updateDraft({ rWaveProgression: option.value as RWaveProgression })}
                >
                  <View style={[styles.optionIcon, selected && styles.optionIconActive]}>
                    <Ionicons name={option.icon} size={18} color={selected ? Palette.paper : Palette.primary} />
                  </View>
                  <View style={styles.optionCopy}>
                    <Text style={[styles.optionTitle, selected && styles.optionTitleActive]}>{option.label}</Text>
                    <Text style={styles.optionDetail}>{option.detail}</Text>
                  </View>
                  <Ionicons name={selected ? 'radio-button-on' : 'radio-button-off'} size={20} color={selected ? Palette.primary : Palette.lineStrong} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={flowStyles.card}>
          <SectionHeader
            icon="analytics-outline"
            title="Transition, J waves, and epsilon waves"
            detail="Capture late depolarization and early repolarization patterns that can change risk."
          />
          <LearnableText topicId="step.lateWaves" onOpen={learning.openTopic} style={styles.groupLabel}>Transition zone</LearnableText>
          <View style={styles.chipGrid}>
            {(['early', 'normal', 'late', 'absent', 'reversed', 'not_assessed'] as const).map((value) => {
              const selected = lateWaveFindings.transitionZone === value;
              return (
                <Pressable
                  key={value}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => updateDraft({ lateWaveFindings: { ...lateWaveFindings, transitionZone: value } })}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value.replace('_', ' ')}</Text>
                </Pressable>
              );
            })}
          </View>

          <LearnableText topicId="step.lateWaves" onOpen={learning.openTopic} style={styles.groupLabel}>J-wave / Brugada pattern</LearnableText>
          <View style={styles.chipGrid}>
            {(['absent', 'early_repolarization', 'osborn', 'brugada_coved', 'brugada_saddleback', 'unclear'] as const).map((value) => {
              const selected = lateWaveFindings.jWaves === value;
              return (
                <Pressable
                  key={value}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => updateDraft({ lateWaveFindings: { ...lateWaveFindings, jWaves: value } })}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value.replace('_', ' ')}</Text>
                </Pressable>
              );
            })}
          </View>

          <LearnableText topicId="step.lateWaves" onOpen={learning.openTopic} style={styles.groupLabel}>Epsilon wave</LearnableText>
          <View style={styles.chipGrid}>
            {(['absent', 'present', 'unclear'] as const).map((value) => {
              const selected = lateWaveFindings.epsilonWave === value;
              return (
                <Pressable
                  key={value}
                  style={[styles.chip, selected && styles.chipActive]}
                  onPress={() => updateDraft({ lateWaveFindings: { ...lateWaveFindings, epsilonWave: value } })}
                >
                  <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value}</Text>
                </Pressable>
              );
            })}
          </View>

          <Pressable
            style={[styles.flagRow, lateWaveFindings.leadMisplacementConcern && styles.flagRowActive]}
            onPress={() =>
              updateDraft({
                lateWaveFindings: {
                  ...lateWaveFindings,
                  leadMisplacementConcern: !lateWaveFindings.leadMisplacementConcern,
                },
              })
            }
          >
            <Text style={[styles.flagText, lateWaveFindings.leadMisplacementConcern && styles.flagTextActive]}>
              Lead misplacement concern
            </Text>
          </Pressable>
        </View>

        <View style={flowStyles.card}>
          <SectionHeader
            icon="pulse-outline"
            title="U waves"
            detail="Check after the T wave, especially in precordial leads, for a small extra deflection."
          />
          <View style={styles.segmentedRow}>
            {[
              { label: 'Present', value: true },
              { label: 'Absent', value: false },
              { label: 'Not assessed', value: 'not_assessed' as const },
            ].map((option) => {
              const selected = uWaves.present === option.value;
              return (
                <Pressable
                  key={option.label}
                  style={[styles.segmentButton, selected && styles.segmentButtonActive]}
                  onPress={() => setUWavePresent(option.value)}
                >
                  <Text style={[styles.segmentButtonText, selected && styles.segmentButtonTextActive]}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>

          {uWaves.present === true && (
            <View style={styles.noteBlock}>
              <LearnableText topicId="step.lateWaves" onOpen={learning.openTopic} style={styles.groupLabel}>Prominence</LearnableText>
              <View style={styles.chipGrid}>
                {(['subtle', 'prominent', 'giant', 'inverted', 'unclear'] as const).map((value) => {
                  const selected = uWaves.prominence === value;
                  return (
                    <Pressable
                      key={value}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => updateDraft({ uWaves: { ...uWaves, present: true, prominence: value } })}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <LearnableText topicId="step.lateWaves" onOpen={learning.openTopic} style={styles.groupLabel}>Leads</LearnableText>
              <View style={styles.chipGrid}>
                {standardLeads.map((lead) => {
                  const selected = uWaves.leads?.includes(lead);
                  return (
                    <Pressable
                      key={lead}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => {
                        const current = uWaves.leads || [];
                        updateDraft({
                          uWaves: {
                            ...uWaves,
                            present: true,
                            leads: selected ? current.filter((item) => item !== lead) : [...current, lead],
                          },
                        });
                      }}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{lead}</Text>
                    </Pressable>
                  );
                })}
              </View>

              <LearnableText topicId="step.lateWaves" onOpen={learning.openTopic} style={styles.inputLabel}>Optional U-wave note</LearnableText>
              <TextInput
                style={styles.input}
                placeholder="Example: prominent in V2-V3"
                placeholderTextColor={Palette.subtle}
                value={uWaves.note || ''}
                onChangeText={(note) => updateDraft({ uWaves: { ...uWaves, present: true, note } })}
              />
            </View>
          )}
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            Poor R-wave progression can reflect old anterior infarction, LVH, COPD, or lead placement. Prominent U waves can appear with hypokalemia or bradycardia.
          </Text>
        </View>
      </ScrollView>
      {learning.sheet}
      <FlowFooter isValid={isValid} disabledLabel="Complete wave review" nextLabel="Final review" nextHref="/(ecg-flow)/step-12" />
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
    minHeight: 78,
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
  segmentedRow: { flexDirection: 'row', gap: 8 },
  segmentButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 8,
  },
  segmentButtonActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  segmentButtonText: { color: Palette.primary, fontSize: 13, fontWeight: '900', textAlign: 'center' },
  segmentButtonTextActive: { color: Palette.paper },
  noteBlock: { gap: 8 },
  inputLabel: { color: Palette.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  input: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '800',
    minHeight: 54,
    paddingHorizontal: 14,
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
  flagRow: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 46,
  },
  flagRowActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  flagText: { color: Palette.primary, fontSize: 13, fontWeight: '900' },
  flagTextActive: { color: Palette.paper },
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
  tipText: { color: '#255a49', flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 19 },
});
