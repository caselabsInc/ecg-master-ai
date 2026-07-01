import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EcgReport } from '@/services/db';
import { normalizeAiInterpretation } from '@/services/aiInterpretation';
import { Palette, Radius } from '@/constants/design';

type ReportCardProps = {
  report: EcgReport;
  onPress: () => void;
};

function formatReportDate(report: EcgReport) {
  if (report.createdAt?.toDate) {
    return report.createdAt.toDate().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }

  return 'Report in progress';
}

export function ReportCard({ report, onPress }: ReportCardProps) {
  const isCompleted = report.status === 'completed';
  const heartRate = report.heartRate?.calculatedBpm;
  const indication = report.context?.indication || 'Indication not documented';
  const aiInterpretation = normalizeAiInterpretation(report.aiInterpretation);
  const firstRuleFinding = report.decisionSupport?.ruleFindings?.[0];
  const summaryText = aiInterpretation?.stepByStepInterpretation
    || (firstRuleFinding ? `${firstRuleFinding.label}: ${firstRuleFinding.finding}` : null);

  return (
    <Pressable style={styles.card} onPress={onPress}>
      <View style={styles.topRow}>
        <View style={styles.iconFrame}>
          <Ionicons name="pulse" size={18} color={isCompleted ? Palette.success : Palette.amber} />
        </View>
        <View style={styles.reportMeta}>
          <Text style={styles.date} selectable>
            {formatReportDate(report)}
          </Text>
          <Text style={styles.context} numberOfLines={1}>
            {report.context?.age ? `${report.context.age} years` : 'Age not documented'} · {indication}
          </Text>
        </View>
        <View style={[styles.badge, isCompleted ? styles.badgeComplete : styles.badgeDraft]}>
          <Text style={[styles.badgeText, isCompleted ? styles.badgeTextComplete : styles.badgeTextDraft]}>
            {isCompleted ? 'Reviewed' : 'In progress'}
          </Text>
        </View>
      </View>

      {isCompleted && summaryText ? (
        <Text style={styles.summary} numberOfLines={2}>
          {summaryText}
        </Text>
      ) : (
        <Text style={styles.summary} numberOfLines={2}>
          {isCompleted ? 'Manual criteria summary available.' : 'Continue the ECG review when ready.'}
        </Text>
      )}

      <View style={styles.footerRow}>
        <Text style={styles.metric} selectable>
          HR {heartRate ?? '--'} bpm
        </Text>
        <Ionicons name="chevron-forward" size={18} color={Palette.subtle} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 14,
    padding: 16,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconFrame: {
    alignItems: 'center',
    backgroundColor: '#f4efe5',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  reportMeta: {
    flex: 1,
    gap: 3,
  },
  date: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '700',
  },
  context: {
    color: Palette.muted,
    fontSize: 12,
  },
  badge: {
    borderCurve: 'continuous',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeComplete: {
    backgroundColor: Palette.successSoft,
  },
  badgeDraft: {
    backgroundColor: Palette.amberSoft,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
  },
  badgeTextComplete: {
    color: Palette.success,
  },
  badgeTextDraft: {
    color: Palette.amber,
  },
  summary: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  footerRow: {
    alignItems: 'center',
    borderTopColor: Palette.line,
    borderTopWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
  },
  metric: {
    color: Palette.primary,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
  },
});
