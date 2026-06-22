import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlowFooter, FlowHero, SectionHeader, flowStyles } from '@/components/ecg-flow-ui';
import { LearnableText, useLearningSheet } from '@/components/ecg-learning-sheet';
import { Palette, Radius } from '@/constants/design';
import { extendedLeads } from '@/constants/ecg';
import { useEcgStore } from '@/store/ecgStore';

type StStatus = 'normal' | 'elevated' | 'depressed' | 'not_assessable';

const leadsList = extendedLeads;
const reciprocalMap: Record<string, string[]> = {
  II: ['I', 'aVL'],
  III: ['I', 'aVL'],
  aVF: ['I', 'aVL'],
  I: ['II', 'III', 'aVF'],
  aVL: ['II', 'III', 'aVF'],
  V1: ['II', 'III', 'aVF'],
  V2: ['II', 'III', 'aVF'],
  V3: ['II', 'III', 'aVF'],
  V4: ['II', 'III', 'aVF'],
  V5: ['II', 'III', 'aVF'],
  V6: ['II', 'III', 'aVF'],
};

function LeadChips({
  selected,
  options,
  onToggle,
}: {
  selected: string[];
  options: string[];
  onToggle: (lead: string) => void;
}) {
  return (
    <View style={styles.chipGrid}>
      {options.map((lead) => {
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

export default function Step8() {
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const stSegment = draft.stSegment || {};
  const stNotAssessableFromDependencies = draft.qrsComplex?.presence === 'absent' || draft.tWaves?.presence === 'absent';
  const primaryLeads = stSegment.leads || [];
  const expectedReciprocalLeads = Array.from(
    new Set(primaryLeads.flatMap((lead) => reciprocalMap[lead] || []))
  ).filter((lead) => !primaryLeads.includes(lead));
  const reciprocalOptions = expectedReciprocalLeads.length ? expectedReciprocalLeads : leadsList;

  const setStatus = (status: StStatus) => {
    updateDraft({
      stSegment: {
        ...stSegment,
        status,
        ...((status === 'normal' || status === 'not_assessable') && { leads: [], reciprocalLeads: [], hasReciprocalChanges: false, smallBoxes: undefined }),
      },
    });
  };

  const toggleLead = (lead: string, type: 'primary' | 'reciprocal') => {
    const key = type === 'primary' ? 'leads' : 'reciprocalLeads';
    const current = stSegment[key] || [];
    updateDraft({
      stSegment: {
        ...stSegment,
        [key]: current.includes(lead) ? current.filter((item) => item !== lead) : [...current, lead],
      },
    });
  };

  const setHasReciprocal = (hasReciprocalChanges: boolean) => {
    updateDraft({
      stSegment: {
        ...stSegment,
        hasReciprocalChanges,
        ...(!hasReciprocalChanges && { reciprocalLeads: [] }),
      },
    });
  };

  const isAbnormal = stSegment.status === 'elevated' || stSegment.status === 'depressed';
  const isValid =
    (stNotAssessableFromDependencies || !!stSegment.status) &&
    (!isAbnormal || (primaryLeads.length > 0 && stSegment.smallBoxes !== undefined && stSegment.smallBoxes !== null));
  const summary =
    stNotAssessableFromDependencies || stSegment.status === 'not_assessable'
      ? 'ST segment not assessable'
      : stSegment.status === 'normal'
      ? 'ST segment normal'
      : stSegment.status === 'elevated'
        ? 'ST elevation recorded'
        : stSegment.status === 'depressed'
          ? 'ST depression recorded'
          : 'Awaiting ST assessment';

  return (
    <View style={flowStyles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={flowStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHero
          step={8}
          label="Step 8 · ST segment"
          title="Check the ST segment against the isoelectric baseline."
          progress="66%"
          summaryLabel="ST read"
          summary={summary}
          pills={[
            { label: 'Status', complete: !!stSegment.status },
            { label: 'Leads', complete: !isAbnormal || primaryLeads.length > 0 },
          ]}
          learnTopicId="step.stSegment"
          onOpenLearning={learning.openTopic}
        />

        <View style={flowStyles.card}>
          {stNotAssessableFromDependencies && (
            <View style={styles.dependencyNotice}>
              <Ionicons name="alert-circle-outline" size={18} color={Palette.accent} />
              <Text style={styles.dependencyNoticeText}>
                ST assessment depends on identifiable QRS complexes and T-wave onset. It is marked not assessable because a required waveform was marked absent.
              </Text>
            </View>
          )}
          <SectionHeader
            icon="analytics-outline"
            title="ST status"
            detail="Look for elevation or depression in two or more contiguous leads."
          />
          <View style={styles.optionStack}>
            {[
              { label: 'Normal', value: 'normal', icon: 'checkmark-circle-outline' as const, detail: 'Flat and level with baseline.' },
              { label: 'Elevated', value: 'elevated', icon: 'trending-up-outline' as const, detail: 'Above the isoelectric line.' },
              { label: 'Depressed', value: 'depressed', icon: 'trending-down-outline' as const, detail: 'Below the isoelectric line.' },
              { label: 'Not assessable', value: 'not_assessable', icon: 'remove-circle-outline' as const, detail: 'QRS or T-wave landmarks are absent or unreliable.' },
            ].map((option) => {
              const selected = (stNotAssessableFromDependencies && option.value === 'not_assessable') || stSegment.status === option.value;
              return (
                <Pressable
                  key={option.value}
                  style={[styles.optionRow, selected && styles.optionRowActive]}
                  onPress={() => setStatus(option.value as StStatus)}
                  disabled={stNotAssessableFromDependencies && option.value !== 'not_assessable'}
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

        {isAbnormal && (
          <View style={flowStyles.card}>
          <SectionHeader
            icon="grid-outline"
            title={`${stSegment.status === 'elevated' ? 'Elevation' : 'Depression'} leads`}
            detail="Select the leads with the primary ST abnormality and record the maximum deviation."
          />
          <LearnableText topicId="input.st.leadsTerritories" onOpen={learning.openTopic} style={styles.groupLabel}>
            Contiguous leads and territories
          </LearnableText>
          <LeadChips selected={primaryLeads} options={leadsList} onToggle={(lead) => toggleLead(lead, 'primary')} />
            <View style={styles.inputShell}>
              <TextInput
                style={styles.input}
                placeholder="2"
                placeholderTextColor={Palette.subtle}
                keyboardType="decimal-pad"
                value={stSegment.smallBoxes?.toString() || ''}
                onChangeText={(text) => {
                  const value = parseFloat(text);
                  updateDraft({ stSegment: { ...stSegment, smallBoxes: Number.isFinite(value) ? value : undefined } });
                }}
              />
              <View style={styles.unitPill}>
                <Text style={styles.unitText}>small boxes</Text>
              </View>
            </View>
          </View>
        )}

        {isAbnormal && primaryLeads.length > 0 && (
          <View style={flowStyles.card}>
          <SectionHeader
            icon="git-compare-outline"
            title="Reciprocal changes"
            detail={`Check for opposite ST ${stSegment.status === 'elevated' ? 'depression' : 'elevation'} in related leads.`}
          />
          <LearnableText topicId="input.st.leadsTerritories" onOpen={learning.openTopic} style={styles.groupLabel}>
            Reciprocal lead guide
          </LearnableText>
          <View style={styles.toggleRow}>
              {[true, false].map((value) => (
                <Pressable
                  key={String(value)}
                  style={[styles.toggleButton, stSegment.hasReciprocalChanges === value && styles.toggleButtonActive]}
                  onPress={() => setHasReciprocal(value)}
                >
                  <Text style={[styles.toggleButtonText, stSegment.hasReciprocalChanges === value && styles.toggleButtonTextActive]}>
                    {value ? 'Yes' : 'No'}
                  </Text>
                </Pressable>
              ))}
            </View>
            {stSegment.hasReciprocalChanges && (
              <LeadChips selected={stSegment.reciprocalLeads || []} options={reciprocalOptions} onToggle={(lead) => toggleLead(lead, 'reciprocal')} />
            )}
          </View>
        )}

        {isAbnormal && (
          <View style={flowStyles.card}>
            <SectionHeader
              icon="analytics-outline"
              title="ST morphology and OMI patterns"
              detail="Capture high-risk occlusion patterns, J-point shape, and common STEMI mimics."
            />
            <LearnableText topicId="step.stSegment" onOpen={learning.openTopic} style={styles.groupLabel}>ST shape</LearnableText>
            <View style={styles.chipGrid}>
              {(['concave', 'convex', 'horizontal', 'upsloping', 'downsloping', 'saddleback', 'coved', 'unclear'] as const).map((value) => {
                const selected = stSegment.morphology === value;
                return (
                  <Pressable
                    key={value}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateDraft({ stSegment: { ...stSegment, morphology: value } })}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{value}</Text>
                  </Pressable>
                );
              })}
            </View>

            <LearnableText topicId="step.stSegment" onOpen={learning.openTopic} style={styles.groupLabel}>OMI / STEMI-equivalent concern</LearnableText>
            <View style={styles.chipGrid}>
              {[
                { label: 'None', value: 'none' },
                { label: 'STEMI', value: 'stemi' },
                { label: 'Posterior OMI', value: 'posterior_omi' },
                { label: 'RV MI', value: 'right_ventricular_mi' },
                { label: 'de Winter', value: 'de_winter' },
                { label: 'Wellens', value: 'wellens' },
                { label: 'aVR/LMCA', value: 'left_main_or_multivessel' },
                { label: 'Sgarbossa +', value: 'sgarbossa_positive' },
                { label: 'Modified Sgarbossa +', value: 'modified_sgarbossa_positive' },
                { label: 'Unclear', value: 'unclear' },
              ].map((option) => {
                const selected = stSegment.omiPattern === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() => updateDraft({ stSegment: { ...stSegment, omiPattern: option.value as any } })}
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <LearnableText topicId="input.st.leadsTerritories" onOpen={learning.openTopic} style={styles.groupLabel}>Additional leads used</LearnableText>
            <View style={styles.toggleRow}>
              {[
                { label: 'Posterior V7-V9', field: 'posteriorLeadsUsed' as const },
                { label: 'Right-sided V3R/V4R', field: 'rightSidedLeadsUsed' as const },
                { label: 'STEMI criteria met', field: 'stemiCriteriaMet' as const },
              ].map((option) => {
                const selected = stSegment[option.field];
                return (
                  <Pressable
                    key={option.field}
                    style={[styles.toggleButton, selected && styles.toggleButtonActive]}
                    onPress={() => updateDraft({ stSegment: { ...stSegment, [option.field]: !selected } })}
                  >
                    <LearnableText topicId="input.st.leadsTerritories" onOpen={learning.openTopic} style={[styles.toggleButtonText, selected && styles.toggleButtonTextActive]}>
                      {option.label}
                    </LearnableText>
                  </Pressable>
                );
              })}
            </View>

            <LearnableText topicId="step.stSegment" onOpen={learning.openTopic} style={styles.groupLabel}>Mimics / confounders</LearnableText>
            <View style={styles.chipGrid}>
              {[
                { label: 'Pericarditis', value: 'pericarditis' },
                { label: 'Early repolarization', value: 'early_repolarization' },
                { label: 'LVH strain', value: 'lvh_strain' },
                { label: 'LBBB', value: 'lbbb' },
                { label: 'Paced rhythm', value: 'paced_rhythm' },
                { label: 'Brugada', value: 'brugada' },
                { label: 'Hyperkalemia', value: 'hyperkalemia' },
                { label: 'Ventricular aneurysm', value: 'ventricular_aneurysm' },
              ].map((option) => {
                const current = stSegment.mimicConsiderations || [];
                const selected = current.includes(option.value as never);
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.chip, selected && styles.chipActive]}
                    onPress={() =>
                      updateDraft({
                        stSegment: {
                          ...stSegment,
                          mimicConsiderations: selected
                            ? current.filter((item) => item !== option.value)
                            : [...current, option.value as any],
                        },
                      })
                    }
                  >
                    <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        )}

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            ST elevation suggests acute injury or pericarditis. ST depression can represent ischemia or reciprocal change.
          </Text>
        </View>
      </ScrollView>
      {learning.sheet}
      <FlowFooter isValid={isValid} disabledLabel="Complete ST" nextHref="/(ecg-flow)/step-9" />
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
    minHeight: 72,
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
  input: { color: Palette.ink, flex: 1, fontSize: 22, fontVariant: ['tabular-nums'], fontWeight: '900' },
  unitPill: { backgroundColor: Palette.primarySoft, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 7 },
  unitText: { color: Palette.primary, fontSize: 12, fontWeight: '900' },
  toggleRow: { flexDirection: 'row', gap: 10 },
  toggleButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    minHeight: 50,
    justifyContent: 'center',
  },
  toggleButtonActive: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  toggleButtonText: { color: Palette.primary, fontSize: 14, fontWeight: '900' },
  toggleButtonTextActive: { color: Palette.paper },
  dependencyNotice: {
    alignItems: 'flex-start',
    backgroundColor: '#fff4df',
    borderColor: '#f3d49b',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  dependencyNoticeText: {
    color: '#7a4b00',
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
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
  tipText: { color: '#255a49', flex: 1, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  groupLabel: { color: Palette.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
});
