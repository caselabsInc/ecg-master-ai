import React from 'react';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlowFooter, FlowHero, SectionHeader, flowStyles } from '@/components/ecg-flow-ui';
import { LearnableText, useLearningSheet } from '@/components/ecg-learning-sheet';
import { Palette, Radius } from '@/constants/design';
import { useEcgStore } from '@/store/ecgStore';

export default function Step10() {
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const qtInterval = draft.qtInterval || {};
  const heartRate = draft.heartRate?.calculatedBpm;
  const rrIntervalMs = heartRate ? Math.round(60000 / heartRate) : undefined;

  const handleChange = (text: string) => {
    const boxes = parseFloat(text);
    const smallBoxes = Number.isFinite(boxes) ? boxes : undefined;
    const qtMs = smallBoxes !== undefined ? Math.round(smallBoxes * 40) : undefined;
    const rrSeconds = heartRate ? 60 / heartRate : undefined;
    const qtcBazettMs = qtMs && rrSeconds ? Math.round(qtMs / Math.sqrt(rrSeconds)) : undefined;
    const qtcFridericiaMs = qtMs && rrSeconds ? Math.round(qtMs / Math.cbrt(rrSeconds)) : undefined;
    const qtcFraminghamMs = qtMs && heartRate ? Math.round(qtMs + 154 * (1 - 60 / heartRate)) : undefined;
    const qrsMs = draft.qrsComplex?.calculatedMs;
    const jtMs = qtMs && qrsMs ? qtMs - qrsMs : null;
    const jtcMs = qtcFridericiaMs && qrsMs ? qtcFridericiaMs - qrsMs : null;
    const primaryQtc = qtcFridericiaMs || qtcBazettMs;
    const qtRisk =
      primaryQtc === undefined
        ? undefined
        : primaryQtc < 350
          ? 'short'
          : primaryQtc < 450
            ? 'normal'
            : primaryQtc < 480
              ? 'borderline_long'
              : primaryQtc < 500
                ? 'long'
                : 'markedly_long';

    updateDraft({
      qtInterval: {
        smallBoxes,
        calculatedQtMs: qtMs,
        calculatedQtcMs: primaryQtc,
        qtcBazettMs,
        qtcFridericiaMs,
        qtcFraminghamMs,
        jtMs,
        jtcMs,
        qtRisk,
        correctionMethod: 'fridericia',
      },
    });
  };

  const isValid = qtInterval.smallBoxes !== undefined;
  const summary = qtInterval.calculatedQtcMs !== undefined ? `${qtInterval.calculatedQtcMs} ms QTc` : 'Awaiting QT measurement';

  return (
    <View style={flowStyles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={flowStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHero
          step={10}
          label="Step 10 · QT interval"
          title="Measure QT and correct it against heart rate."
          progress="83%"
          summaryLabel="QT read"
          summary={summary}
          pills={[
            { label: 'QT', complete: qtInterval.calculatedQtMs !== undefined },
            { label: 'QTc', complete: qtInterval.calculatedQtcMs !== undefined },
          ]}
          learnTopicId="step.qtInterval"
          onOpenLearning={learning.openTopic}
        />

        <View style={flowStyles.card}>
          <SectionHeader
            icon="resize-outline"
            title="QT measurement"
            detail="Measure from the start of QRS to the end of the T wave, then count small boxes."
          />
          <LearnableText topicId="step.qtInterval" onOpen={learning.openTopic} style={styles.inputLabel}>QT small boxes</LearnableText>
          <View style={styles.inputShell}>
            <TextInput
              style={styles.input}
              placeholder="10"
              placeholderTextColor={Palette.subtle}
              keyboardType="decimal-pad"
              value={qtInterval.smallBoxes?.toString() || ''}
              onChangeText={handleChange}
            />
            <View style={styles.unitPill}>
              <Text style={styles.unitText}>small boxes</Text>
            </View>
          </View>
        </View>

        <View style={styles.resultGrid}>
          <View style={styles.resultCard}>
            <Text style={styles.resultLabel}>QT</Text>
            <Text style={styles.resultValue} selectable>
              {qtInterval.calculatedQtMs ?? '--'} <Text style={styles.resultUnit}>ms</Text>
            </Text>
          </View>
          <View style={[styles.resultCard, styles.resultPrimary]}>
            <Text style={styles.resultLabelPrimary}>QTc Bazett</Text>
            <Text style={styles.resultValuePrimary} selectable>
              {qtInterval.calculatedQtcMs ?? '--'} <Text style={styles.resultUnitPrimary}>ms</Text>
            </Text>
          </View>
        </View>

        <View style={flowStyles.card}>
          <SectionHeader
            icon="calculator-outline"
            title="Correction methods and risk"
            detail="Fridericia is used as the primary QTc here; Bazett remains visible because clinicians commonly expect it."
          />
          <View style={styles.referenceRow}>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Bazett</Text>
              <Text style={styles.referenceValue}>{qtInterval.qtcBazettMs ?? '--'} ms</Text>
            </View>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Fridericia</Text>
              <Text style={styles.referenceValue}>{qtInterval.qtcFridericiaMs ?? '--'} ms</Text>
            </View>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Framingham</Text>
              <Text style={styles.referenceValue}>{qtInterval.qtcFraminghamMs ?? '--'} ms</Text>
            </View>
          </View>
          <View style={styles.referenceRow}>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>JT</Text>
              <Text style={styles.referenceValue}>{qtInterval.jtMs ?? '--'} ms</Text>
            </View>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>JTc</Text>
              <Text style={styles.referenceValue}>{qtInterval.jtcMs ?? '--'} ms</Text>
            </View>
            <View style={[styles.referenceItem, qtInterval.qtRisk === 'markedly_long' && styles.riskItem]}>
              <Text style={styles.referenceLabel}>Risk</Text>
              <Text style={styles.referenceValue}>{qtInterval.qtRisk?.replace('_', ' ') || '--'}</Text>
            </View>
          </View>
        </View>

        <View style={flowStyles.card}>
          <SectionHeader
            icon="heart-outline"
            title="Correction reference"
            detail="Bazett correction uses the R-R interval derived from the heart rate entered earlier."
          />
          <View style={styles.referenceRow}>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>Heart rate</Text>
              <Text style={styles.referenceValue}>{heartRate ?? '--'} bpm</Text>
            </View>
            <View style={styles.referenceItem}>
              <Text style={styles.referenceLabel}>R-R interval</Text>
              <Text style={styles.referenceValue}>{rrIntervalMs ?? '--'} ms</Text>
            </View>
          </View>
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            A prolonged QTc increases risk for ventricular arrhythmias. Always check medications, potassium, magnesium,
            and calcium.
          </Text>
        </View>
      </ScrollView>
      {learning.sheet}
      <FlowFooter isValid={isValid} disabledLabel="Complete QT" nextHref="/(ecg-flow)/step-11" />
    </View>
  );
}

const styles = StyleSheet.create({
  inputLabel: { color: Palette.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
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
  resultGrid: { flexDirection: 'row', gap: 12 },
  resultCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    flex: 1,
    gap: 8,
    padding: 16,
  },
  resultPrimary: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  resultLabel: { color: Palette.muted, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  resultLabelPrimary: { color: '#cfe6e2', fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  resultValue: { color: Palette.ink, fontSize: 24, fontVariant: ['tabular-nums'], fontWeight: '900' },
  resultValuePrimary: { color: Palette.paper, fontSize: 24, fontVariant: ['tabular-nums'], fontWeight: '900' },
  resultUnit: { fontSize: 13, fontWeight: '900' },
  resultUnitPrimary: { fontSize: 13, fontWeight: '900' },
  referenceRow: { flexDirection: 'row', gap: 10 },
  referenceItem: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    padding: 13,
  },
  referenceLabel: { color: Palette.muted, fontSize: 12, fontWeight: '900' },
  referenceValue: { color: Palette.primary, fontSize: 17, fontVariant: ['tabular-nums'], fontWeight: '900' },
  riskItem: { backgroundColor: Palette.accentSoft, borderColor: '#e8b9b2' },
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
