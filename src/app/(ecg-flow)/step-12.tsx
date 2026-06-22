import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { FlowHero, SectionHeader, flowStyles } from '@/components/ecg-flow-ui';
import { LearnableText, useLearningSheet } from '@/components/ecg-learning-sheet';
import { Layout, Palette, Radius } from '@/constants/design';
import { useAuth } from '@/context/AuthContext';
import { normalizeAiInterpretation } from '@/services/aiInterpretation';
import { buildDecisionSupportAudit } from '@/services/decisionSupportAudit';
import { completeReport, markReportAiFailed, saveReportDraft } from '@/services/db';
import { callAppCheckedFunction } from '@/services/protectedCallable';
import { useEcgStore } from '@/store/ecgStore';

export default function Step12() {
  const router = useRouter();
  const { draft, updateDraft, reportId, setReportId, resetDraft } = useEcgStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const learning = useLearningSheet();

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Sign-in required', 'Please sign in to save this ECG report.');
      return;
    }

    setLoading(true);
    try {
      const auditedDraft = {
        ...draft,
        decisionSupport: buildDecisionSupportAudit(draft),
      };
      const savedId = await saveReportDraft(user.uid, auditedDraft, reportId || undefined);
      if (!reportId) {
        setReportId(savedId);
      }

      let aiData;
      try {
        const response = await callAppCheckedFunction('generateECGInterpretation', {
          reportData: auditedDraft,
        });
        aiData = normalizeAiInterpretation(response);
        if (!aiData) {
          throw new Error('Interpretation support could not be generated from the saved ECG review.');
        }
      } catch (funcError: any) {
        console.warn('Firebase function failed.', funcError);
        await markReportAiFailed(user.uid, savedId, {
          code: funcError?.code,
          message: 'Interpretation support could not be generated for this report.',
        });
        resetDraft();
        router.replace(`/(ecg-flow)/results?id=${savedId}`);
        return;
      }

      await completeReport(user.uid, savedId, aiData);

      resetDraft();
      router.replace(`/(ecg-flow)/results?id=${savedId}`);
    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert(
        'Report could not be saved',
        'The ECG data could not be saved. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={flowStyles.screen}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={flowStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <FlowHero
          step={12}
          label="Step 12 · Final review"
          title="Add final context and prepare interpretation support."
          progress="100%"
          summaryLabel="Report status"
          summary={loading ? 'Preparing interpretation support' : 'Ready for final review'}
          pills={[
            { label: 'ECG data', complete: true },
            { label: 'Notes', complete: !!draft.additionalNotes },
          ]}
          learnTopicId="step.finalReview"
          onOpenLearning={learning.openTopic}
        />

        <View style={flowStyles.card}>
          <SectionHeader
            icon="create-outline"
            title="Additional observations"
            detail="Add symptoms, clinical context, or tracing nuance that was not captured in the structured steps."
          />
          <LearnableText topicId="step.finalReview" onOpen={learning.openTopic} style={styles.inputLabel}>Clinical context note</LearnableText>
          <TextInput
            style={styles.textArea}
            placeholder="Chest pain duration, comparison with prior ECG, medications, electrolytes, or other relevant context..."
            placeholderTextColor={Palette.subtle}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={draft.additionalNotes || ''}
            onChangeText={(additionalNotes) => updateDraft({ additionalNotes })}
          />
        </View>

        <View style={styles.synthesisCard}>
          <View style={styles.synthesisIcon}>
            <Ionicons name="sparkles-outline" size={22} color={Palette.paper} />
          </View>
          <View style={styles.synthesisCopy}>
          <Text style={styles.synthesisTitle}>Interpretation synthesis</Text>
          <Text style={styles.synthesisText}>
              ECG-Master will save the clinician-entered measurements, preserve the review basis, prepare interpretation support, and open the report for clinician review.
          </Text>
          </View>
        </View>

        <View style={styles.reviewGrid}>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Rhythm</Text>
            <Text style={styles.reviewValue}>
              {draft.rhythm?.rhythmCategory ? draft.rhythm.rhythmCategory.replaceAll('_', ' ') : 'Pending'}
            </Text>
          </View>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Rate</Text>
            <Text style={styles.reviewValue}>{draft.heartRate?.calculatedBpm ? `${draft.heartRate.calculatedBpm} bpm` : 'Pending'}</Text>
          </View>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>Axis</Text>
            <Text style={styles.reviewValue}>{draft.axis?.interpretedAxis || 'Pending'}</Text>
          </View>
          <View style={styles.reviewCard}>
            <Text style={styles.reviewLabel}>QTc</Text>
            <Text style={styles.reviewValue}>
              {draft.qtInterval?.measurementStatus === 'unmeasurable'
                ? 'Unmeasurable'
                : draft.qtInterval?.calculatedQtcMs
                  ? `${draft.qtInterval.calculatedQtcMs} ms`
                  : 'Pending'}
            </Text>
          </View>
        </View>

        {loading && (
          <View style={styles.loadingPanel}>
            <ActivityIndicator size="large" color={Palette.primary} />
            <Text style={styles.loadingText}>Preparing interpretation support...</Text>
          </View>
        )}
      </ScrollView>
      {learning.sheet}

      <View style={styles.footer}>
        <Pressable style={[styles.backButton, loading && styles.footerButtonDisabled]} onPress={() => router.back()} disabled={loading}>
          <Ionicons name="arrow-back" size={18} color={loading ? Palette.muted : Palette.primary} />
          <Text style={[styles.backButtonText, loading && styles.disabledButtonText]}>Back</Text>
        </Pressable>
        <Pressable style={[styles.submitButton, loading && styles.footerButtonDisabled]} onPress={handleSubmit} disabled={loading}>
          {loading ? (
            <ActivityIndicator size="small" color={Palette.paper} />
          ) : (
            <Ionicons name="flash-outline" size={18} color={Palette.paper} />
          )}
          <Text style={styles.submitButtonText}>{loading ? 'Preparing' : 'Prepare report'}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputLabel: { color: Palette.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  textArea: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    minHeight: 142,
    padding: 14,
  },
  synthesisCard: {
    alignItems: 'flex-start',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    boxShadow: Palette.shadow,
    flexDirection: 'row',
    gap: 13,
    padding: 18,
  },
  synthesisIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.14)',
    borderColor: 'rgba(255, 253, 248, 0.2)',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  synthesisCopy: { flex: 1, gap: 5 },
  synthesisTitle: { color: Palette.paper, fontSize: 17, fontWeight: '900' },
  synthesisText: { color: '#cfe6e2', fontSize: 13, fontWeight: '700', lineHeight: 19 },
  reviewGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  reviewCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    flexGrow: 1,
    flexBasis: '47%',
    gap: 5,
    minHeight: 74,
    padding: 14,
  },
  reviewLabel: { color: Palette.muted, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  reviewValue: { color: Palette.primary, fontSize: 15, fontWeight: '900', lineHeight: 20 },
  loadingPanel: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 22,
  },
  loadingText: { color: Palette.primary, fontSize: 14, fontWeight: '900' },
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
  backButtonText: { color: Palette.primary, fontSize: 15, fontWeight: '900' },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flex: 1.35,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 54,
  },
  submitButtonText: { color: Palette.paper, fontSize: 15, fontWeight: '900' },
  footerButtonDisabled: { opacity: 0.68 },
  disabledButtonText: { color: Palette.muted },
});
