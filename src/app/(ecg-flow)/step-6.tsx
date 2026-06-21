import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { useEcgStore } from '@/store/ecgStore';

type AxisLead = 'positive' | 'negative' | 'equiphasic';
type AxisField = 'leadI' | 'leadII' | 'leadAVF' | 'leadAVL';
type PAxisLead = 'positive' | 'negative' | 'biphasic' | 'flat' | 'unclear';
type PAxisField = 'pWaveLeadI' | 'pWaveLeadII' | 'pWaveLeadAVF';

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

function AxisCompass({ angle }: { angle: number | null }) {
  return (
    <View style={styles.compassWrap}>
      <View style={styles.compass}>
        <View style={styles.axisHorizontal} />
        <View style={styles.axisVertical} />
        <View style={[styles.axisDiagonal, { transform: [{ rotate: '30deg' }] }]} />
        <View style={[styles.axisDiagonal, { transform: [{ rotate: '60deg' }] }]} />
        <View style={[styles.axisDiagonal, { transform: [{ rotate: '-30deg' }] }]} />
        <View style={[styles.axisDiagonal, { transform: [{ rotate: '-60deg' }] }]} />

        <View style={styles.normalWedge} />
        <Text style={styles.axisLabelTop}>-90°</Text>
        <Text style={styles.axisLabelBottom}>+90°</Text>
        <Text style={styles.axisLabelLeft}>±180°</Text>
        <Text style={styles.axisLabelRight}>0°</Text>
        <Text style={styles.leadLabelTop}>aVF-</Text>
        <Text style={styles.leadLabelBottom}>aVF+</Text>
        <Text style={styles.leadLabelLeft}>I-</Text>
        <Text style={styles.leadLabelRight}>I+</Text>

        {angle !== null ? (
          <View style={[styles.arrowPointer, { transform: [{ rotate: `${angle}deg` }] }]}>
            <View style={styles.arrowLine} />
            <View style={styles.arrowHead} />
          </View>
        ) : (
          <View style={styles.compassCenterPending}>
            <Ionicons name="navigate-outline" size={22} color={Palette.primaryMuted} />
          </View>
        )}
      </View>
    </View>
  );
}

function LeadCard({
  name,
  value,
  onSelect,
}: {
  name: string;
  value?: AxisLead;
  onSelect: (value: AxisLead) => void;
}) {
  const options: Array<{ label: string; value: AxisLead; icon: keyof typeof Ionicons.glyphMap }> = [
    { label: 'Positive', value: 'positive', icon: 'arrow-up-circle-outline' },
    { label: 'Negative', value: 'negative', icon: 'arrow-down-circle-outline' },
    { label: 'Equiphasic', value: 'equiphasic', icon: 'remove-circle-outline' },
  ];

  return (
    <View style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <Text style={styles.leadTitle}>{name}</Text>
        <View style={[styles.leadStatus, value && styles.leadStatusDone]}>
          <Text style={[styles.leadStatusText, value && styles.leadStatusTextDone]}>{value ? 'Set' : 'Needed'}</Text>
        </View>
      </View>

      <View style={styles.leadOptionGrid}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.leadOption, selected && styles.leadOptionActive]}
              onPress={() => onSelect(option.value)}
            >
              <Ionicons name={option.icon} size={17} color={selected ? Palette.paper : Palette.primary} />
              <Text style={[styles.leadOptionText, selected && styles.leadOptionTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function PAxisLeadCard({
  name,
  helper,
  value,
  onSelect,
}: {
  name: string;
  helper: string;
  value?: PAxisLead;
  onSelect: (value: PAxisLead) => void;
}) {
  const options: Array<{ label: string; value: PAxisLead; icon: keyof typeof Ionicons.glyphMap }> = [
    { label: 'Positive', value: 'positive', icon: 'arrow-up-circle-outline' },
    { label: 'Negative', value: 'negative', icon: 'arrow-down-circle-outline' },
    { label: 'Biphasic', value: 'biphasic', icon: 'swap-vertical-outline' },
    { label: 'Flat', value: 'flat', icon: 'remove-circle-outline' },
    { label: 'Unclear', value: 'unclear', icon: 'help-circle-outline' },
  ];

  return (
    <View style={styles.leadCard}>
      <View style={styles.leadHeader}>
        <View style={styles.pAxisLeadTitleBlock}>
          <Text style={styles.leadTitle}>{name}</Text>
          <Text style={styles.pAxisLeadHelper}>{helper}</Text>
        </View>
        <View style={[styles.leadStatus, value && styles.leadStatusDone]}>
          <Text style={[styles.leadStatusText, value && styles.leadStatusTextDone]}>{value ? 'Set' : 'Needed'}</Text>
        </View>
      </View>

      <View style={styles.pAxisOptionGrid}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <Pressable
              key={option.value}
              style={[styles.pAxisOption, selected && styles.leadOptionActive]}
              onPress={() => onSelect(option.value)}
            >
              <Ionicons name={option.icon} size={16} color={selected ? Palette.paper : Palette.primary} />
              <Text style={[styles.leadOptionText, selected && styles.leadOptionTextActive]}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function derivePWaveAxis(leadI?: PAxisLead, leadII?: PAxisLead, leadAVF?: PAxisLead) {
  if (!leadI || !leadII || !leadAVF || leadI === 'unclear' || leadII === 'unclear' || leadAVF === 'unclear') {
    return 'indeterminate';
  }
  if (leadII === 'positive' && leadAVF === 'positive' && leadI !== 'negative') {
    return 'normal';
  }
  if (leadII === 'negative' && leadAVF === 'negative') {
    return 'superior';
  }
  if (leadI === 'positive' && leadAVF === 'negative') {
    return 'leftward';
  }
  if (leadI === 'negative' && leadAVF === 'positive') {
    return 'rightward';
  }
  return 'indeterminate';
}

export default function Step6() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const axis = draft.axis || {};
  const pWavePresence = draft.pWave?.presence;
  const [visualAngle, setVisualAngle] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (axis.leadI && axis.leadAVF && axis.leadII && axis.leadAVL) {
      let text = 'Indeterminate';
      let exactAngle: number | null = null;
      let approximateDegrees: number | null = null;

      if (axis.leadI === 'equiphasic') {
        exactAngle = axis.leadAVF === 'positive' ? 90 : -90;
      } else if (axis.leadII === 'equiphasic') {
        exactAngle = axis.leadAVL === 'positive' ? -30 : 150;
      } else if (axis.leadAVF === 'equiphasic') {
        exactAngle = axis.leadI === 'positive' ? 0 : 180;
      } else if (axis.leadAVL === 'equiphasic') {
        exactAngle = axis.leadII === 'positive' ? 60 : -120;
      }

      if (exactAngle !== null) {
        if (exactAngle >= 0 && exactAngle <= 90) text = `Normal Axis (${exactAngle}°)`;
        else if (exactAngle < 0 && exactAngle >= -30) text = `Normal Variant / Physiologic Left (${exactAngle}°)`;
        else if (exactAngle < -30 && exactAngle >= -90) text = `Pathologic Left Axis Deviation (${exactAngle}°)`;
        else if (exactAngle > 90 && exactAngle <= 180) text = `Right Axis Deviation (${exactAngle}°)`;
        else text = `Extreme Axis Deviation (${exactAngle}°)`;

        setVisualAngle(exactAngle);
        approximateDegrees = exactAngle;
      } else if (axis.leadI === 'positive' && axis.leadAVF === 'positive') {
        text = 'Normal Axis (0° to +90°)';
        setVisualAngle(45);
        approximateDegrees = 45;
      } else if (axis.leadI === 'positive' && axis.leadAVF === 'negative') {
        if (axis.leadII === 'positive') {
          text = 'Normal Variant / Physiologic Left (-0° to -30°)';
          setVisualAngle(-15);
          approximateDegrees = -15;
        } else if (axis.leadII === 'negative') {
          text = 'Pathologic Left Axis Deviation (-30° to -90°)';
          setVisualAngle(-60);
          approximateDegrees = -60;
        } else {
          text = 'Possible Left Axis Deviation (Check Lead II)';
          setVisualAngle(-45);
          approximateDegrees = -45;
        }
      } else if (axis.leadI === 'negative' && axis.leadAVF === 'positive') {
        text = 'Right Axis Deviation (+90° to +180°)';
        setVisualAngle(135);
        approximateDegrees = 135;
      } else if (axis.leadI === 'negative' && axis.leadAVF === 'negative') {
        text = 'Extreme Axis Deviation (-90° to -180°)';
        setVisualAngle(-135);
        approximateDegrees = -135;
      }

      const concern =
        text.includes('Pathologic Left')
          ? 'left_axis_deviation'
          : text.includes('Right Axis')
            ? 'right_axis_deviation'
            : text.includes('Extreme')
              ? 'extreme_axis'
              : text.includes('Indeterminate')
                ? 'indeterminate'
                : 'normal';

      if (axis.interpretedAxis !== text || axis.approximateDegrees !== approximateDegrees || axis.concern !== concern) {
        updateDraft({ axis: { ...axis, interpretedAxis: text, approximateDegrees, concern } });
      }
    } else {
      setVisualAngle(null);
      if (axis.interpretedAxis) {
        updateDraft({ axis: { ...axis, interpretedAxis: undefined } });
      }
    }
  }, [axis.leadI, axis.leadAVF, axis.leadII, axis.leadAVL]);

  const setLead = (field: AxisField, value: AxisLead) => {
    updateDraft({ axis: { ...axis, [field]: value } });
  };

  const setPWaveLead = (field: PAxisField, value: PAxisLead) => {
    const nextAxis = { ...axis, [field]: value };
    updateDraft({
      axis: {
        ...nextAxis,
        interpretedPWaveAxis: derivePWaveAxis(nextAxis.pWaveLeadI, nextAxis.pWaveLeadII, nextAxis.pWaveLeadAVF),
      },
    });
  };

  const leadIComplete = !!axis.leadI;
  const leadAVFComplete = !!axis.leadAVF;
  const secondaryComplete = !!axis.leadII && !!axis.leadAVL;
  const pAxisRequired = pWavePresence === 'present';
  const pAxisComplete = !pAxisRequired || (!!axis.pWaveLeadI && !!axis.pWaveLeadII && !!axis.pWaveLeadAVF);
  const isValid = leadIComplete && leadAVFComplete && secondaryComplete && pAxisComplete;
  const axisLabel = axis.interpretedAxis || 'Awaiting lead polarity';
  const pAxisLabel = axis.interpretedPWaveAxis
    ? axis.interpretedPWaveAxis.replace('_', ' ')
    : pAxisRequired
      ? 'Awaiting P-wave deflections'
      : 'Not required without discrete P waves';

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
              <Text style={styles.kicker}>Step 6 · Cardiac axis</Text>
              <Text style={styles.heroTitle}>Map limb-lead polarity into an electrical axis.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>6</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroSummary}>
            <View style={styles.heroSummaryCopy}>
              <Text style={styles.heroSummaryLabel}>Axis read</Text>
              <Text style={styles.heroSummaryValue}>{axisLabel}</Text>
            </View>
            <View style={styles.summaryPillColumn}>
              <SummaryPill label="I/aVF" complete={leadIComplete && leadAVFComplete} />
              <SummaryPill label="II/aVL" complete={secondaryComplete} />
              <SummaryPill label="P axis" complete={pAxisComplete} />
            </View>
          </View>
        </View>
        <StepLearningButton topicId="step.axis" onOpen={learning.openTopic} />

        <View style={styles.card}>
          <SectionHeader
            icon="navigate-outline"
            title="Deflection method"
            detail="Use the net QRS deflection in limb leads. R-dominant is positive, S-dominant is negative, and balanced is equiphasic."
          />

          <View style={styles.methodGrid}>
            <View style={styles.methodPill}>
              <Ionicons name="arrow-up" size={14} color={Palette.success} />
              <Text style={styles.methodPillText}>Positive</Text>
            </View>
            <View style={styles.methodPill}>
              <Ionicons name="arrow-down" size={14} color={Palette.accent} />
              <Text style={styles.methodPillText}>Negative</Text>
            </View>
            <View style={styles.methodPill}>
              <Ionicons name="remove" size={14} color={Palette.amber} />
              <Text style={styles.methodPillText}>Equiphasic</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="git-compare-outline"
            title="Lead polarity"
            detail="Start with Lead I and aVF, then use Lead II and aVL to refine the axis."
          />

          <View style={styles.leadStack}>
            <LeadCard name="Lead I" value={axis.leadI} onSelect={(value) => setLead('leadI', value)} />
            <LeadCard name="Lead aVF" value={axis.leadAVF} onSelect={(value) => setLead('leadAVF', value)} />
            <LeadCard name="Lead II" value={axis.leadII} onSelect={(value) => setLead('leadII', value)} />
            <LeadCard name="Lead aVL" value={axis.leadAVL} onSelect={(value) => setLead('leadAVL', value)} />
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="navigate-circle-outline"
            title="P-wave axis"
            detail="Use net P-wave deflection in limb leads, so all frontal axis work lives on this screen."
          />

          {pAxisRequired ? (
            <>
              <View style={styles.leadStack}>
                <PAxisLeadCard
                  name="Lead I P deflection"
                  helper="left-right limb axis"
                  value={axis.pWaveLeadI}
                  onSelect={(value) => setPWaveLead('pWaveLeadI', value)}
                />
                <PAxisLeadCard
                  name="Lead II P deflection"
                  helper="inferior limb axis"
                  value={axis.pWaveLeadII}
                  onSelect={(value) => setPWaveLead('pWaveLeadII', value)}
                />
                <PAxisLeadCard
                  name="aVF P deflection"
                  helper="inferior limb axis"
                  value={axis.pWaveLeadAVF}
                  onSelect={(value) => setPWaveLead('pWaveLeadAVF', value)}
                />
              </View>

              <View style={styles.interpretationPanel}>
                <Text style={styles.interpretationLabel}>P-axis interpretation</Text>
                <Text
                  style={[
                    styles.interpretationResult,
                    !axis.interpretedPWaveAxis && styles.interpretationHint,
                  ]}
                  selectable
                >
                  {pAxisLabel}
                </Text>
              </View>
            </>
          ) : (
            <View style={styles.pAxisNotRequiredPanel}>
              <Ionicons name="information-circle-outline" size={19} color={Palette.primary} />
              <Text style={styles.pAxisNotRequiredText}>
                P-axis is not required because Step 2 did not identify discrete P waves. Rhythm synthesis can use the
                absent or unclear P-wave finding instead.
              </Text>
            </View>
          )}
        </View>

        <View style={styles.visualizationCard}>
          <View style={styles.visualizationHeader}>
            <View>
              <Text style={styles.visualizationTitle}>Axis visualization</Text>
              <Text style={styles.visualizationSubtitle}>Normal quadrant is highlighted for quick orientation.</Text>
            </View>
            <View style={[styles.statusBadge, axis.interpretedAxis && styles.statusBadgeDone]}>
              <Text style={[styles.statusBadgeText, axis.interpretedAxis && styles.statusBadgeTextDone]}>
                {axis.interpretedAxis ? 'Calculated' : 'Pending'}
              </Text>
            </View>
          </View>

          <AxisCompass angle={visualAngle} />

          <View style={styles.interpretationPanel}>
            <Text style={styles.interpretationLabel}>Interpretation</Text>
            <Text style={[styles.interpretationResult, !axis.interpretedAxis && styles.interpretationHint]} selectable>
              {axis.interpretedAxis || 'Select all four limb-lead values to calculate the cardiac axis.'}
            </Text>
          </View>
        </View>

        <Pressable
          style={[styles.reversalCard, axis.leadReversalConcern && styles.reversalCardActive]}
          onPress={() => updateDraft({ axis: { ...axis, leadReversalConcern: !axis.leadReversalConcern } })}
        >
          <Ionicons name="swap-horizontal-outline" size={20} color={axis.leadReversalConcern ? Palette.paper : Palette.accent} />
          <View style={styles.reversalCopy}>
            <Text style={[styles.reversalTitle, axis.leadReversalConcern && styles.reversalTitleActive]}>Lead reversal concern</Text>
            <Text style={[styles.reversalText, axis.leadReversalConcern && styles.reversalTextActive]}>
              Flag if axis, aVR, or limb-lead morphology suggests misplaced limb leads.
            </Text>
          </View>
        </Pressable>

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            Lead I positive with aVF positive usually places the axis in the normal quadrant. Lead II helps separate
            physiologic leftward axis from pathologic left axis deviation.
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
            if (isValid) router.push('/(ecg-flow)/step-7');
          }}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Complete axis'}</Text>
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
    width: '50%',
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
  methodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  methodPill: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  methodPillText: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
  },
  leadStack: {
    gap: 12,
  },
  leadCard: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 14,
  },
  leadHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leadTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  leadStatus: {
    backgroundColor: Palette.line,
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  leadStatusDone: {
    backgroundColor: Palette.successSoft,
  },
  leadStatusText: {
    color: Palette.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  leadStatusTextDone: {
    color: Palette.success,
  },
  pAxisLeadTitleBlock: {
    flex: 1,
    gap: 3,
  },
  pAxisLeadHelper: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  leadOptionGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  leadOption: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 1,
    gap: 5,
    minHeight: 62,
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  leadOptionActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  leadOptionText: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    textAlign: 'center',
  },
  leadOptionTextActive: {
    color: Palette.paper,
  },
  pAxisOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pAxisOption: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexBasis: '30%',
    flexGrow: 1,
    gap: 5,
    justifyContent: 'center',
    minHeight: 58,
    minWidth: 92,
    paddingHorizontal: 8,
  },
  pAxisNotRequiredPanel: {
    alignItems: 'flex-start',
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    padding: 14,
  },
  pAxisNotRequiredText: {
    color: Palette.primary,
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 19,
  },
  visualizationCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 16,
    padding: 18,
  },
  visualizationHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  visualizationTitle: {
    color: Palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  visualizationSubtitle: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 18,
    maxWidth: 220,
  },
  statusBadge: {
    backgroundColor: Palette.line,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  statusBadgeDone: {
    backgroundColor: Palette.successSoft,
  },
  statusBadgeText: {
    color: Palette.muted,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  statusBadgeTextDone: {
    color: Palette.success,
  },
  compassWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
  },
  compass: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.lineStrong,
    borderRadius: 105,
    borderWidth: 2,
    height: 210,
    position: 'relative',
    width: 210,
  },
  normalWedge: {
    backgroundColor: 'rgba(38, 115, 91, 0.12)',
    borderBottomRightRadius: 105,
    bottom: 0,
    height: 105,
    position: 'absolute',
    right: 0,
    width: 105,
  },
  axisHorizontal: {
    backgroundColor: Palette.primaryMuted,
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 104,
  },
  axisVertical: {
    backgroundColor: Palette.primaryMuted,
    bottom: 0,
    left: 104,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  axisDiagonal: {
    backgroundColor: Palette.lineStrong,
    height: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 104,
  },
  axisLabelTop: {
    color: Palette.ink,
    fontSize: 11,
    fontWeight: '900',
    left: 82,
    position: 'absolute',
    top: -24,
  },
  axisLabelBottom: {
    bottom: -24,
    color: Palette.ink,
    fontSize: 11,
    fontWeight: '900',
    left: 82,
    position: 'absolute',
  },
  axisLabelLeft: {
    color: Palette.ink,
    fontSize: 11,
    fontWeight: '900',
    left: -42,
    position: 'absolute',
    top: 96,
  },
  axisLabelRight: {
    color: Palette.ink,
    fontSize: 11,
    fontWeight: '900',
    position: 'absolute',
    right: -23,
    top: 96,
  },
  leadLabelTop: {
    color: Palette.primaryMuted,
    fontSize: 10,
    fontWeight: '900',
    left: 91,
    position: 'absolute',
    top: 16,
  },
  leadLabelBottom: {
    bottom: 16,
    color: Palette.primaryMuted,
    fontSize: 10,
    fontWeight: '900',
    left: 91,
    position: 'absolute',
  },
  leadLabelLeft: {
    color: Palette.primaryMuted,
    fontSize: 10,
    fontWeight: '900',
    left: 18,
    position: 'absolute',
    top: 96,
  },
  leadLabelRight: {
    color: Palette.primaryMuted,
    fontSize: 10,
    fontWeight: '900',
    position: 'absolute',
    right: 18,
    top: 96,
  },
  arrowPointer: {
    alignItems: 'center',
    flexDirection: 'row',
    height: 12,
    left: 105,
    position: 'absolute',
    top: 99,
    transformOrigin: 'left center',
    width: 86,
  },
  arrowLine: {
    backgroundColor: Palette.accent,
    borderRadius: 999,
    height: 4,
    width: 76,
  },
  arrowHead: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderBottomWidth: 7,
    borderLeftColor: Palette.accent,
    borderLeftWidth: 11,
    borderStyle: 'solid',
    borderTopColor: 'transparent',
    borderTopWidth: 7,
    height: 0,
    marginLeft: -1,
    width: 0,
  },
  compassCenterPending: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    height: 44,
    justifyContent: 'center',
    left: 83,
    position: 'absolute',
    top: 83,
    width: 44,
  },
  interpretationPanel: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 5,
    padding: 14,
  },
  interpretationLabel: {
    color: Palette.primaryMuted,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  interpretationResult: {
    color: Palette.primary,
    fontSize: 16,
    fontWeight: '900',
    lineHeight: 22,
  },
  interpretationHint: {
    color: Palette.muted,
    fontSize: 14,
    fontWeight: '700',
  },
  reversalCard: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    flexDirection: 'row',
    gap: 12,
    padding: 15,
  },
  reversalCardActive: { backgroundColor: Palette.accent, borderColor: Palette.accent },
  reversalCopy: { flex: 1, gap: 3 },
  reversalTitle: { color: Palette.ink, fontSize: 14, fontWeight: '900' },
  reversalTitleActive: { color: Palette.paper },
  reversalText: { color: Palette.muted, fontSize: 12, fontWeight: '700', lineHeight: 17 },
  reversalTextActive: { color: '#ffe4df' },
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
