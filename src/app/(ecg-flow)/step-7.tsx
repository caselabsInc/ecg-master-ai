import React from 'react';
import { LayoutChangeEvent, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { LearnableText, StepLearningButton, useLearningSheet } from '@/components/ecg-learning-sheet';
import { extendedLeads, territoriesForLeads } from '@/constants/ecg';
import { useEcgStore } from '@/store/ecgStore';

type TraceSegment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

const TRACE_HEIGHT = 148;

const qWaveSegments: TraceSegment[] = [
  { x1: 5, y1: 62, x2: 27, y2: 62 },
  { x1: 27, y1: 62, x2: 31, y2: 58 },
  { x1: 31, y1: 58, x2: 35, y2: 62 },
  { x1: 35, y1: 62, x2: 46, y2: 62 },
  { x1: 46, y1: 62, x2: 50, y2: 78 },
  { x1: 50, y1: 78, x2: 55, y2: 22 },
  { x1: 55, y1: 22, x2: 61, y2: 74 },
  { x1: 61, y1: 74, x2: 68, y2: 62 },
  { x1: 68, y1: 62, x2: 94, y2: 62 },
];

function toTracePoint(segment: TraceSegment, width: number) {
  return {
    x1: (segment.x1 / 100) * width,
    y1: (segment.y1 / 100) * TRACE_HEIGHT,
    x2: (segment.x2 / 100) * width,
    y2: (segment.y2 / 100) * TRACE_HEIGHT,
  };
}

function TraceLine({ segment, width }: { segment: TraceSegment; width: number }) {
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

function QWaveReferenceView() {
  const [traceWidth, setTraceWidth] = React.useState(0);
  const hasLayout = traceWidth > 0;
  const startX = traceWidth * 0.46;
  const endX = traceWidth * 0.5;
  const handleLayout = (event: LayoutChangeEvent) => {
    setTraceWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.referenceTrace} onLayout={handleLayout}>
      {Array.from({ length: 12 }).map((_, index) => (
        <View
          key={`v-${index}`}
          style={[styles.verticalLine, index % 3 === 0 && styles.majorGridLine, { left: `${index * 9}%` }]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={`h-${index}`}
          style={[styles.horizontalLine, index % 2 === 0 && styles.majorGridLine, { top: `${index * 20}%` }]}
        />
      ))}

      {hasLayout && qWaveSegments.map((segment, index) => <TraceLine key={`q-wave-${index}`} segment={segment} width={traceWidth} />)}

      {hasLayout && (
        <>
          <View style={[styles.qWaveWindow, { left: startX - 8, width: endX - startX + 16 }]}>
            <Text style={styles.qWaveWindowText}>Q</Text>
          </View>
          <View style={[styles.qWaveBracket, { left: startX, width: endX - startX }]}>
            <Text style={styles.qWaveBracketText}>width</Text>
          </View>
        </>
      )}

      <View style={styles.traceCallout}>
        <Text style={styles.traceCalloutText}>deep + wide Q wave</Text>
      </View>
    </View>
  );
}

function MeasurementInput({
  label,
  value,
  placeholder,
  unit,
  helper,
  onChangeText,
  learnTopicId,
  onOpenLearning,
}: {
  label: string;
  value: string;
  placeholder: string;
  unit: string;
  helper: string;
  onChangeText: (text: string) => void;
  learnTopicId?: string;
  onOpenLearning?: (topicId: string) => void;
}) {
  return (
    <View style={styles.measurementBlock}>
      <View style={styles.measurementLabelRow}>
        {learnTopicId && onOpenLearning ? (
          <LearnableText topicId={learnTopicId} onOpen={onOpenLearning} style={styles.measurementLabel}>{label}</LearnableText>
        ) : (
          <Text style={styles.measurementLabel}>{label}</Text>
        )}
        <Text style={styles.measurementHelper}>{helper}</Text>
      </View>
      <View style={styles.inputShell}>
        <TextInput
          style={styles.inputField}
          placeholder={placeholder}
          placeholderTextColor={Palette.subtle}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={onChangeText}
        />
        <View style={styles.inputUnit}>
          <Text style={styles.inputUnitText}>{unit}</Text>
        </View>
      </View>
    </View>
  );
}

export default function Step7() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const learning = useLearningSheet();
  const qWaves = draft.qWaves || {};
  const leadFindings = qWaves.leadFindings || {};

  const setPresent = (present: boolean) => {
    updateDraft({
      qWaves: present
        ? { ...qWaves, present }
        : {
            present,
            leads: null,
            territories: [],
            leadFindings: {},
          },
    });
  };

  const updateGlobalWidth = (value: string) => {
    const widthSmallBoxes = parseFloat(value);
    updateDraft({
      qWaves: {
        ...qWaves,
        widthSmallBoxes: Number.isFinite(widthSmallBoxes) ? widthSmallBoxes : undefined,
      },
    });
  };

  const updateGlobalDepth = (value: string) => {
    const depthPercent = parseInt(value, 10);
    updateDraft({
      qWaves: {
        ...qWaves,
        depthPercent: Number.isFinite(depthPercent) ? depthPercent : undefined,
      },
    });
  };

  const toggleLeadPresent = (lead: string) => {
    const nextPresent = !leadFindings[lead]?.present;
    const nextLeadFindings = {
      ...leadFindings,
      [lead]: { ...leadFindings[lead], present: nextPresent },
    };
    const selectedLeads = Object.entries(nextLeadFindings)
      .filter(([, finding]) => finding.present)
      .map(([leadName]) => leadName);

    updateDraft({
      qWaves: {
        ...qWaves,
        leads: selectedLeads.length ? selectedLeads : null,
        territories: territoriesForLeads(selectedLeads),
        leadFindings: nextLeadFindings,
      },
    });
  };

  const updateLeadValue = (lead: string, field: 'width' | 'depth', value: string) => {
    updateDraft({
      qWaves: {
        ...qWaves,
        leadFindings: {
          ...leadFindings,
          [lead]: { ...leadFindings[lead], [field]: value },
        },
      },
    });
  };

  const selectedLeadCount = Object.values(leadFindings).filter((finding) => finding.present).length;
  const isValid = qWaves.present !== undefined && (qWaves.present === false || selectedLeadCount > 0);
  const qWaveLabel =
    qWaves.present === true
      ? selectedLeadCount
        ? `${selectedLeadCount} lead${selectedLeadCount === 1 ? '' : 's'} flagged`
        : 'Q waves present'
      : qWaves.present === false
        ? 'No pathological Q waves'
        : 'Awaiting Q wave assessment';

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
              <Text style={styles.kicker}>Step 7 · Q waves</Text>
              <Text style={styles.heroTitle}>Identify pathological Q waves across contiguous leads.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>7</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroSummary}>
            <View style={styles.heroSummaryCopy}>
              <Text style={styles.heroSummaryLabel}>Q wave read</Text>
              <Text style={styles.heroSummaryValue}>{qWaveLabel}</Text>
            </View>
            <View style={styles.summaryPillColumn}>
              <SummaryPill label="Presence" complete={qWaves.present !== undefined} />
              <SummaryPill label="Leads" complete={qWaves.present === false || selectedLeadCount > 0} />
            </View>
          </View>
        </View>
        <StepLearningButton topicId="step.qWaves" onOpen={learning.openTopic} />

        <View style={styles.traceCard}>
          <View style={styles.traceHeader}>
            <View>
              <Text style={styles.traceTitle}>Q wave reference</Text>
              <Text style={styles.traceSubtitle}>Pathological Q waves are wide, deep, or present in contiguous leads.</Text>
            </View>
            <View style={styles.traceBadge}>
              <Text style={styles.traceBadgeText}>&gt;40 ms</Text>
            </View>
          </View>

          <QWaveReferenceView />

          <View style={styles.referenceFooter}>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>&gt;1 small box wide</Text>
            </View>
            <View style={styles.referencePill}>
              <Text style={styles.referencePillText}>&gt;25% R height</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="search-outline"
            title="Presence"
            detail="Small septal Q waves can be normal. Flag Q waves that are wide, deep, or in contiguous leads."
          />

          <View style={styles.choiceGrid}>
            <Pressable style={[styles.choiceCard, qWaves.present === true && styles.choiceCardActive]} onPress={() => setPresent(true)}>
              <View style={[styles.choiceIcon, qWaves.present === true && styles.choiceIconActive]}>
                <Ionicons name="alert-circle-outline" size={19} color={qWaves.present === true ? Palette.paper : Palette.primary} />
              </View>
              <Text style={[styles.choiceTitle, qWaves.present === true && styles.choiceTitleActive]}>Present</Text>
              <Text style={[styles.choiceText, qWaves.present === true && styles.choiceTextActive]}>Pathological Q waves seen.</Text>
            </Pressable>

            <Pressable style={[styles.choiceCard, qWaves.present === false && styles.choiceCardActive]} onPress={() => setPresent(false)}>
              <View style={[styles.choiceIcon, qWaves.present === false && styles.choiceIconActive]}>
                <Ionicons name="checkmark-circle-outline" size={19} color={qWaves.present === false ? Palette.paper : Palette.primary} />
              </View>
              <Text style={[styles.choiceTitle, qWaves.present === false && styles.choiceTitleActive]}>Absent</Text>
              <Text style={[styles.choiceText, qWaves.present === false && styles.choiceTextActive]}>No pathological Q waves.</Text>
            </Pressable>
          </View>
        </View>

        {qWaves.present === true && (
          <>
            <View style={styles.card}>
              <SectionHeader
                icon="resize-outline"
                title="Global measurements"
                detail="Record the most representative Q wave width and depth."
              />

              <MeasurementInput
                label="Width"
                value={qWaves.widthSmallBoxes?.toString() || ''}
                placeholder="1.0"
                unit="small boxes"
                helper="40 ms each"
                onChangeText={updateGlobalWidth}
                learnTopicId="step.qWaves"
                onOpenLearning={learning.openTopic}
              />

              <MeasurementInput
                label="Depth"
                value={qWaves.depthPercent?.toString() || ''}
                placeholder="25"
                unit="%"
                helper="of following R"
                onChangeText={updateGlobalDepth}
                learnTopicId="step.qWaves"
                onOpenLearning={learning.openTopic}
              />
            </View>

            <View style={styles.card}>
              <SectionHeader
                icon="grid-outline"
                title="Lead-specific findings"
                detail="Mark all leads with pathological Q waves and capture optional local width/depth notes."
              />

              <View style={styles.leadGrid}>
                {extendedLeads.map((lead) => {
                  const finding = leadFindings[lead] || {};
                  return (
                    <View key={lead} style={[styles.leadRow, finding.present && styles.leadRowActive]}>
                      <Pressable style={styles.leadToggle} onPress={() => toggleLeadPresent(lead)}>
                        <View style={[styles.leadCheckbox, finding.present && styles.leadCheckboxActive]}>
                          {finding.present && <Ionicons name="checkmark" size={14} color={Palette.paper} />}
                        </View>
                        <Text style={[styles.leadName, finding.present && styles.leadNameActive]}>{lead}</Text>
                      </Pressable>

                      <View style={styles.leadMiniInputs}>
                        <TextInput
                          style={styles.tableInput}
                          placeholder="ms"
                          placeholderTextColor={Palette.subtle}
                          keyboardType="numeric"
                          value={finding.width || ''}
                          onChangeText={(value) => updateLeadValue(lead, 'width', value)}
                        />
                        <TextInput
                          style={styles.tableInput}
                          placeholder="%"
                          placeholderTextColor={Palette.subtle}
                          keyboardType="numeric"
                          value={finding.depth || ''}
                          onChangeText={(value) => updateLeadValue(lead, 'depth', value)}
                        />
                      </View>
                    </View>
                  );
                })}
              </View>

              <View style={styles.precordialNote}>
                <Ionicons name="information-circle-outline" size={18} color={Palette.primary} />
                <Text style={styles.precordialNoteText}>
                  Territories: {(qWaves.territories || []).join(', ') || 'select leads to map infarct territory'}.
                </Text>
              </View>
            </View>

            <View style={styles.card}>
              <SectionHeader
                icon="shield-outline"
                title="Pseudo-infarct checks"
                detail="Flag patterns that can mimic pathological Q waves before labeling old infarction."
              />
              <View style={styles.chipGrid}>
                {[
                  { label: 'LVH', value: 'lvh' },
                  { label: 'LBBB', value: 'lbbb' },
                  { label: 'WPW', value: 'wpw' },
                  { label: 'Lead misplacement', value: 'lead_misplacement' },
                  { label: 'HCM', value: 'hypertrophic_cardiomyopathy' },
                ].map((option) => {
                  const selected = qWaves.pseudoInfarctConcern?.includes(option.value as never);
                  return (
                    <Pressable
                      key={option.value}
                      style={[styles.chip, selected && styles.chipActive]}
                      onPress={() => {
                        const current = qWaves.pseudoInfarctConcern || [];
                        updateDraft({
                          qWaves: {
                            ...qWaves,
                            pseudoInfarctConcern: current.includes(option.value as never)
                              ? current.filter((item) => item !== option.value)
                              : [...current, option.value as any],
                          },
                        });
                      }}
                    >
                      <Text style={[styles.chipText, selected && styles.chipTextActive]}>{option.label}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </>
        )}

        <View style={styles.tipPanel}>
          <Ionicons name="information-circle-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>
            Pathological Q waves can indicate prior infarction. Normal small septal Q waves may appear in lateral leads
            I, aVL, V5, and V6.
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
            if (isValid) router.push('/(ecg-flow)/step-8');
          }}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>{isValid ? 'Next step' : 'Complete Q waves'}</Text>
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
    width: '58%',
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
  qWaveWindow: {
    alignItems: 'center',
    backgroundColor: 'rgba(196, 73, 61, 0.1)',
    borderColor: Palette.accent,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    height: 58,
    justifyContent: 'flex-end',
    paddingBottom: 8,
    position: 'absolute',
    top: 52,
  },
  qWaveWindowText: {
    color: Palette.accent,
    fontSize: 11,
    fontWeight: '900',
  },
  qWaveBracket: {
    alignItems: 'center',
    borderBottomWidth: 2,
    borderColor: Palette.accent,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    bottom: 22,
    height: 18,
    position: 'absolute',
  },
  qWaveBracketText: {
    backgroundColor: '#fff3ef',
    color: Palette.accent,
    fontSize: 10,
    fontWeight: '900',
    paddingHorizontal: 5,
    position: 'absolute',
    top: 9,
  },
  traceCallout: {
    backgroundColor: Palette.primary,
    borderRadius: 999,
    left: 16,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: 'absolute',
    top: 16,
  },
  traceCalloutText: {
    color: Palette.paper,
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
    minHeight: 126,
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
  measurementBlock: {
    gap: 8,
  },
  measurementLabelRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  measurementLabel: {
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  measurementHelper: {
    color: Palette.primaryMuted,
    fontSize: 12,
    fontWeight: '900',
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
  leadGrid: {
    gap: 10,
  },
  leadRow: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    minHeight: 62,
    padding: 10,
  },
  leadRowActive: {
    backgroundColor: Palette.primarySoft,
    borderColor: Palette.primary,
  },
  leadToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 9,
    minWidth: 70,
  },
  leadCheckbox: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.lineStrong,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    height: 26,
    justifyContent: 'center',
    width: 26,
  },
  leadCheckboxActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  leadName: {
    color: Palette.ink,
    fontSize: 14,
    fontWeight: '900',
  },
  leadNameActive: {
    color: Palette.primary,
  },
  leadMiniInputs: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  tableInput: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    color: Palette.ink,
    flex: 1,
    fontSize: 13,
    fontWeight: '900',
    minHeight: 42,
    paddingHorizontal: 9,
    textAlign: 'center',
  },
  precordialNote: {
    alignItems: 'flex-start',
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    padding: 12,
  },
  precordialNoteText: {
    color: Palette.primary,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
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
