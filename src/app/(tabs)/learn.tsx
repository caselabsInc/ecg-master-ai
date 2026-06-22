import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLearningSheet } from '@/components/ecg-learning-sheet';
import { ScreenHeroBanner } from '@/components/screen-hero-banner';
import { Layout, Palette, Radius } from '@/constants/design';
import {
  ecgConditionItems,
  EcgConditionItem,
  ecgStudySources,
  ecgStudySteps,
  EcgStudyStep,
  redFlagTrainerItems,
  RedFlagTrainerItem,
} from '@/constants/ecgStudy';

type PhaseId = 'all' | 'foundation' | 'depolarization' | 'repolarization' | 'synthesis';
type LearnSectionId = 'steps' | 'redFlags' | 'conditions';

const phases: { id: PhaseId; label: string; steps?: number[] }[] = [
  { id: 'all', label: 'All' },
  { id: 'foundation', label: '1-4', steps: [1, 2, 3, 4] },
  { id: 'depolarization', label: '5-7', steps: [5, 6, 7] },
  { id: 'repolarization', label: '8-11', steps: [8, 9, 10, 11] },
  { id: 'synthesis', label: '12', steps: [12] },
];

const learnSections: { id: LearnSectionId; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: 'steps', label: 'Steps', icon: 'school-outline' },
  { id: 'redFlags', label: 'Red flags', icon: 'warning-outline' },
  { id: 'conditions', label: 'Criteria', icon: 'list-circle-outline' },
];

function matchesSearch(item: EcgStudyStep, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) {
    return true;
  }

  return [
    item.step.toString(),
    item.title,
    item.focus,
    item.clinicalPearl,
    ...item.checkpoints,
  ].some((value) => value.toLowerCase().includes(normalized));
}

function matchesCondition(item: EcgConditionItem, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    item.title,
    item.category,
    item.definition,
    item.pathophysiology,
    ...item.symptoms,
    ...item.criteria.flatMap((criterion) => [criterion.label, criterion.value]),
    ...item.pearls,
  ].some((value) => value.toLowerCase().includes(normalized));
}

function matchesRedFlag(item: RedFlagTrainerItem, query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return true;

  return [
    item.title,
    item.urgency,
    item.cue,
    item.risk,
    item.action,
    ...item.pattern,
    ...item.immediateActions,
    ...item.clinicalTips,
    ...item.mimics.flatMap((mimic) => [mimic.name, mimic.differentiation]),
  ].some((value) => value.toLowerCase().includes(normalized));
}

function LearnSectionTabs({
  activeSection,
  onChange,
}: {
  activeSection: LearnSectionId;
  onChange: (section: LearnSectionId) => void;
}) {
  return (
    <View style={styles.sectionTabs}>
      {learnSections.map((section) => {
        const selected = activeSection === section.id;
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected }}
            key={section.id}
            style={[styles.sectionTab, selected && styles.sectionTabActive]}
            onPress={() => onChange(section.id)}
          >
            <Ionicons name={section.icon} size={17} color={selected ? Palette.paper : Palette.primary} />
            <Text numberOfLines={1} style={[styles.sectionTabText, selected && styles.sectionTabTextActive]}>{section.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function StepTile({
  item,
  selected,
  onPress,
}: {
  item: EcgStudyStep;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      style={[styles.stepTile, selected && styles.stepTileSelected]}
      onPress={onPress}
    >
      <View style={[styles.stepNumber, selected && styles.stepNumberSelected]}>
        <Text style={[styles.stepNumberText, selected && styles.stepNumberTextSelected]}>{item.step}</Text>
      </View>
      <Text numberOfLines={2} style={[styles.tileTitle, selected && styles.tileTitleSelected]}>
        {item.title}
      </Text>
    </Pressable>
  );
}

function StepDetail({
  item,
  onOpen,
  onStartEcg,
}: {
  item: EcgStudyStep;
  onOpen: (topicId: string) => void;
  onStartEcg: () => void;
}) {
  return (
    <View style={styles.detailPanel}>
      <View style={styles.detailHeader}>
        <View style={styles.detailBadge}>
          <Text style={styles.detailBadgeText}>Step {item.step}</Text>
        </View>
        <View style={styles.detailTitleBlock}>
          <Text style={styles.detailTitle}>{item.title}</Text>
          <Text style={styles.detailFocus}>{item.focus}</Text>
        </View>
      </View>

      <View style={styles.checkpointList}>
        {item.checkpoints.slice(0, 4).map((checkpoint) => (
          <View key={checkpoint} style={styles.checkpointRow}>
            <Ionicons name="checkmark-circle" size={15} color={Palette.success} />
            <Text style={styles.checkpointText}>{checkpoint}</Text>
          </View>
        ))}
      </View>

      <View style={styles.pearlPanel}>
        <Ionicons name="bulb-outline" size={16} color={Palette.amber} />
        <Text style={styles.pearlText} numberOfLines={3}>{item.clinicalPearl}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable style={styles.primaryAction} onPress={() => onOpen(item.topicId)}>
          <Ionicons name="book-outline" size={18} color={Palette.paper} />
          <Text style={styles.primaryActionText}>Open lesson</Text>
        </Pressable>
        <Pressable style={styles.secondaryAction} onPress={onStartEcg}>
          <Ionicons name="add" size={18} color={Palette.primary} />
          <Text style={styles.secondaryActionText}>New ECG</Text>
        </Pressable>
      </View>
    </View>
  );
}

function RedFlagTrainer({
  items,
  onSelect,
}: {
  items: RedFlagTrainerItem[];
  onSelect: (item: RedFlagTrainerItem) => void;
}) {
  return (
    <View style={styles.trainerPanel}>
      <View style={styles.trainerHeader}>
        <View style={styles.trainerIcon}>
          <Ionicons name="warning-outline" size={18} color={Palette.accent} />
        </View>
        <View style={styles.trainerHeaderCopy}>
          <Text style={styles.trainerTitle}>Red flag trainer</Text>
          <Text style={styles.trainerText}>Rapid review for dangerous ECG patterns that should not be missed.</Text>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trainerCardRow}>
        {items.map((item) => (
          <Pressable
            accessibilityRole="button"
            key={item.id}
            style={styles.trainerCard}
            onPress={() => onSelect(item)}
          >
            <View style={styles.trainerCardTop}>
              <Text style={styles.trainerCardTitle} numberOfLines={2}>{item.title}</Text>
              <Ionicons name="chevron-forward" size={17} color={Palette.accent} />
            </View>
            <View style={styles.trainerUrgencyPill}>
              <Ionicons name="alert-circle" size={13} color={Palette.accent} />
              <Text style={styles.trainerUrgencyText} numberOfLines={1}>{item.urgency}</Text>
            </View>
            <Text style={styles.trainerCue} numberOfLines={3}>{item.cue}</Text>
            <View style={styles.trainerRiskPanel}>
              <Text style={styles.trainerRiskLabel}>Danger cue</Text>
              <Text style={styles.trainerRisk} numberOfLines={3}>{item.risk}</Text>
            </View>
            <Text style={styles.trainerAction} numberOfLines={3}>{item.action}</Text>
          </Pressable>
        ))}
      </ScrollView>
      {!items.length ? (
        <View style={styles.emptyInlinePanel}>
          <Ionicons name="search-outline" size={18} color={Palette.muted} />
          <Text style={styles.emptyInlineText}>No red flags match this search.</Text>
        </View>
      ) : null}
    </View>
  );
}

function ConditionLibrary({
  items,
  onSelect,
}: {
  items: EcgConditionItem[];
  onSelect: (item: EcgConditionItem) => void;
}) {
  const categoryGroups = React.useMemo(
    () =>
      Array.from(new Set(items.map((item) => item.category))).map((category) => ({
        category,
        items: items.filter((item) => item.category === category),
      })),
    [items],
  );
  const [expandedCategories, setExpandedCategories] = React.useState<string[]>([categoryGroups[0]?.category ?? '']);

  function toggleCategory(category: string) {
    setExpandedCategories((current) =>
      current.includes(category) ? current.filter((item) => item !== category) : [...current, category],
    );
  }

  return (
    <View style={styles.conditionPanel}>
      <View style={styles.trainerHeader}>
        <View style={styles.conditionIcon}>
          <Ionicons name="list-circle-outline" size={18} color={Palette.primary} />
        </View>
        <View style={styles.trainerHeaderCopy}>
          <Text style={styles.trainerTitle}>ECG condition criteria</Text>
          <Text style={styles.trainerText}>Common diagnoses with concise ECG criteria, symptoms, and interpretation clues.</Text>
        </View>
      </View>

      {categoryGroups.map((group) => {
        const expanded = expandedCategories.includes(group.category);
        const examples = group.items.slice(0, 3).map((item) => item.title).join(' • ');

        return (
          <View key={group.category} style={styles.conditionGroup}>
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded }}
              style={[styles.conditionGroupHeader, expanded && styles.conditionGroupHeaderActive]}
              onPress={() => toggleCategory(group.category)}
            >
              <View style={styles.conditionGroupIcon}>
                <Ionicons name={expanded ? 'chevron-down' : 'chevron-forward'} size={17} color={Palette.primary} />
              </View>
              <View style={styles.conditionGroupCopy}>
                <Text style={styles.conditionGroupTitle}>{group.category}</Text>
                <Text style={styles.conditionGroupExamples} numberOfLines={1}>{examples}</Text>
              </View>
              <View style={styles.conditionGroupCount}>
                <Text style={styles.conditionGroupCountText}>{group.items.length}</Text>
              </View>
            </Pressable>

            {expanded ? (
              <View style={styles.conditionList}>
                {group.items.map((item) => (
                  <Pressable
                    accessibilityRole="button"
                    key={item.id}
                    style={styles.conditionCard}
                    onPress={() => onSelect(item)}
                  >
                    <View style={styles.conditionCardTop}>
                      <View style={styles.conditionBadge}>
                        <Ionicons name="analytics-outline" size={15} color={Palette.primary} />
                      </View>
                      <View style={styles.conditionCardCopy}>
                        <Text style={styles.conditionTitle} numberOfLines={2}>{item.title}</Text>
                        <Text style={styles.conditionDefinition} numberOfLines={2}>{item.definition}</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={Palette.primaryMuted} />
                    </View>
                    <View style={styles.conditionCriteriaPreview}>
                      {item.criteria.slice(0, 2).map((criterion) => (
                        <Text key={criterion.label} style={styles.conditionCriteriaText} numberOfLines={1}>
                          {criterion.label}: {criterion.value}
                        </Text>
                      ))}
                    </View>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>
        );
      })}

      {!items.length ? (
        <View style={styles.emptyInlinePanel}>
          <Ionicons name="search-outline" size={18} color={Palette.muted} />
          <Text style={styles.emptyInlineText}>No conditions match this search.</Text>
        </View>
      ) : null}
    </View>
  );
}

function DetailSection({
  icon,
  title,
  children,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sheetSection}>
      <View style={styles.sheetSectionHeader}>
        <Ionicons name={icon} size={16} color={Palette.primary} />
        <Text style={styles.sheetSectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function RedFlagDetailSheet({
  item,
  visible,
  bottomInset,
  onClose,
  onOpenLesson,
}: {
  item?: RedFlagTrainerItem;
  visible: boolean;
  bottomInset: number;
  onClose: () => void;
  onOpenLesson: (topicId: string) => void;
}) {
  if (!item) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable accessibilityLabel="Close red flag details" style={styles.sheetScrim} onPress={onClose} />
        <View style={[styles.redFlagSheet, { paddingBottom: Math.max(18, bottomInset + 12) }]}>
          <View style={styles.sheetGrabber} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleBlock}>
              <View style={styles.sheetUrgencyPill}>
                <Ionicons name="warning" size={14} color={Palette.paper} />
                <Text style={styles.sheetUrgencyText}>{item.urgency}</Text>
              </View>
              <Text style={styles.sheetTitle}>{item.title}</Text>
              <Text style={styles.sheetSubtitle}>{item.cue}</Text>
            </View>
            <Pressable accessibilityLabel="Close" hitSlop={10} style={styles.sheetCloseButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Palette.ink} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScrollContent}>
            <DetailSection icon="pulse-outline" title="Recognition pattern">
              {item.pattern.map((point) => (
                <View key={point} style={styles.sheetBulletRow}>
                  <View style={styles.sheetBulletDot} />
                  <Text style={styles.sheetBulletText}>{point}</Text>
                </View>
              ))}
            </DetailSection>

            <DetailSection icon="flame-outline" title="Why it is dangerous">
              <Text style={styles.sheetBodyText}>{item.risk}</Text>
            </DetailSection>

            <DetailSection icon="medkit-outline" title="First response">
              {item.immediateActions.map((point) => (
                <View key={point} style={styles.sheetActionRow}>
                  <Ionicons name="checkmark-circle" size={15} color={Palette.success} />
                  <Text style={styles.sheetBulletText}>{point}</Text>
                </View>
              ))}
            </DetailSection>

            <DetailSection icon="bulb-outline" title="Clinical tips">
              {item.clinicalTips.map((point) => (
                <View key={point} style={styles.sheetBulletRow}>
                  <View style={styles.sheetAmberDot} />
                  <Text style={styles.sheetBulletText}>{point}</Text>
                </View>
              ))}
            </DetailSection>

            <DetailSection icon="git-compare-outline" title="Dangerous mimics">
              {item.mimics.map((mimic) => (
                <View key={mimic.name} style={styles.mimicCard}>
                  <Text style={styles.mimicTitle}>{mimic.name}</Text>
                  <Text style={styles.mimicText}>{mimic.differentiation}</Text>
                </View>
              ))}
            </DetailSection>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <Pressable
              accessibilityRole="button"
              style={styles.sheetLessonButton}
              onPress={() => {
                onClose();
                onOpenLesson(item.topicId);
              }}
            >
              <Ionicons name="book-outline" size={18} color={Palette.paper} />
              <Text style={styles.sheetLessonButtonText}>Open related lesson</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function ConditionDetailSheet({
  item,
  visible,
  bottomInset,
  onClose,
  onOpenLesson,
}: {
  item?: EcgConditionItem;
  visible: boolean;
  bottomInset: number;
  onClose: () => void;
  onOpenLesson: (topicId: string) => void;
}) {
  if (!item) return null;

  return (
    <Modal animationType="slide" transparent visible={visible} onRequestClose={onClose}>
      <View style={styles.sheetOverlay}>
        <Pressable accessibilityLabel="Close condition criteria" style={styles.sheetScrim} onPress={onClose} />
        <View style={[styles.redFlagSheet, { paddingBottom: Math.max(18, bottomInset + 12) }]}>
          <View style={styles.sheetGrabber} />
          <View style={styles.sheetHeader}>
            <View style={styles.sheetTitleBlock}>
              <View style={styles.conditionSheetPill}>
                <Ionicons name="list-circle" size={14} color={Palette.paper} />
                <Text style={styles.sheetUrgencyText}>{item.category}</Text>
              </View>
              <Text style={styles.sheetTitle}>{item.title}</Text>
              <Text style={styles.sheetSubtitle}>{item.definition}</Text>
            </View>
            <Pressable accessibilityLabel="Close" hitSlop={10} style={styles.sheetCloseButton} onPress={onClose}>
              <Ionicons name="close" size={20} color={Palette.ink} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScrollContent}>
            <DetailSection icon="pulse-outline" title="ECG criteria">
              {item.criteria.map((criterion) => (
                <View key={criterion.label} style={styles.criteriaRow}>
                  <Text style={styles.criteriaLabel}>{criterion.label}</Text>
                  <Text style={styles.criteriaValue}>{criterion.value}</Text>
                </View>
              ))}
            </DetailSection>

            <DetailSection icon="git-network-outline" title="Pathophysiology">
              <Text style={styles.sheetBodyText}>{item.pathophysiology}</Text>
            </DetailSection>

            <DetailSection icon="person-outline" title="Common symptoms">
              <View style={styles.symptomWrap}>
                {item.symptoms.map((symptom) => (
                  <View key={symptom} style={styles.symptomChip}>
                    <Text style={styles.symptomChipText}>{symptom}</Text>
                  </View>
                ))}
              </View>
            </DetailSection>

            <DetailSection icon="bulb-outline" title="Interpretation pearls">
              {item.pearls.map((pearl) => (
                <View key={pearl} style={styles.sheetBulletRow}>
                  <View style={styles.sheetAmberDot} />
                  <Text style={styles.sheetBulletText}>{pearl}</Text>
                </View>
              ))}
            </DetailSection>
          </ScrollView>

          <View style={styles.sheetFooter}>
            <Pressable
              accessibilityRole="button"
              style={styles.sheetLessonButton}
              onPress={() => {
                onClose();
                onOpenLesson(item.topicId);
              }}
            >
              <Ionicons name="book-outline" size={18} color={Palette.paper} />
              <Text style={styles.sheetLessonButtonText}>Open related lesson</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

export default function Learn() {
  const router = useRouter();
  const learning = useLearningSheet();
  const insets = useSafeAreaInsets();
  const [activePhase, setActivePhase] = React.useState<PhaseId>('all');
  const [activeSection, setActiveSection] = React.useState<LearnSectionId>('steps');
  const [query, setQuery] = React.useState('');
  const [selectedStep, setSelectedStep] = React.useState(ecgStudySteps[0].step);
  const [selectedRedFlag, setSelectedRedFlag] = React.useState<RedFlagTrainerItem | undefined>();
  const [selectedCondition, setSelectedCondition] = React.useState<EcgConditionItem | undefined>();

  const visibleSteps = React.useMemo(() => {
    const phase = phases.find((item) => item.id === activePhase);
    return ecgStudySteps.filter((item) => {
      const inPhase = !phase?.steps || phase.steps.includes(item.step);
      return inPhase && matchesSearch(item, query);
    });
  }, [activePhase, query]);

  const selectedItem = visibleSteps.find((item) => item.step === selectedStep) ?? visibleSteps[0] ?? ecgStudySteps[0];
  const visibleRedFlags = React.useMemo(() => redFlagTrainerItems.filter((item) => matchesRedFlag(item, query)), [query]);
  const visibleConditions = React.useMemo(() => ecgConditionItems.filter((item) => matchesCondition(item, query)), [query]);
  const searchPlaceholder =
    activeSection === 'steps'
      ? 'Find a step, finding, or measurement'
      : activeSection === 'redFlags'
        ? 'Find a red flag pattern or risk'
        : 'Find a condition, rhythm, or criterion';

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: Math.max(Layout.pagePadding, insets.top + 12) },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <ScreenHeroBanner
          description="Study the ECG-Master workflow in order, from rate and rhythm evidence through ischemia patterns, intervals, late waves, and final synthesis."
          icon="school-outline"
          kicker="ECG learning"
          title="12-step ECG reading"
        >
          <Pressable style={styles.heroPrimaryAction} onPress={() => learning.openTopic(ecgStudySteps[0].topicId)}>
            <Ionicons name="play-outline" size={18} color={Palette.primary} />
            <Text style={styles.heroPrimaryActionText}>Start step 1</Text>
          </Pressable>
          <Pressable style={styles.heroSecondaryAction} onPress={() => router.push('/(ecg-flow)/pre-step')}>
            <Ionicons name="add" size={18} color={Palette.paper} />
            <Text style={styles.heroSecondaryActionText}>New ECG</Text>
          </Pressable>
        </ScreenHeroBanner>

        <LearnSectionTabs activeSection={activeSection} onChange={setActiveSection} />

        <View style={styles.searchPanel}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color={Palette.muted} />
            <TextInput
              autoCapitalize="none"
              autoCorrect={false}
              placeholder={searchPlaceholder}
              placeholderTextColor={Palette.subtle}
              returnKeyType="search"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
            />
            {query ? (
              <Pressable accessibilityLabel="Clear search" hitSlop={8} onPress={() => setQuery('')}>
                <Ionicons name="close-circle" size={18} color={Palette.subtle} />
              </Pressable>
            ) : null}
          </View>

          {activeSection === 'steps' ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.phaseRow}>
              {phases.map((phase) => {
                const selected = activePhase === phase.id;
                return (
                  <Pressable
                    key={phase.id}
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    style={[styles.phaseChip, selected && styles.phaseChipActive]}
                    onPress={() => setActivePhase(phase.id)}
                  >
                    <Text style={[styles.phaseChipText, selected && styles.phaseChipTextActive]}>{phase.label}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          ) : null}
        </View>

        {activeSection === 'redFlags' ? (
          <RedFlagTrainer items={visibleRedFlags} onSelect={setSelectedRedFlag} />
        ) : activeSection === 'conditions' ? (
          <ConditionLibrary items={visibleConditions} onSelect={setSelectedCondition} />
        ) : (
          <>
            <View style={styles.stepGridHeader}>
              <Text style={styles.sectionTitle}>Pick a lesson</Text>
              <Text style={styles.sectionMeta}>{visibleSteps.length} shown</Text>
            </View>

            <View style={styles.stepGrid}>
              {visibleSteps.map((item) => (
                <StepTile
                  key={item.step}
                  item={item}
                  selected={item.step === selectedItem.step}
                  onPress={() => setSelectedStep(item.step)}
                />
              ))}
            </View>

            {!visibleSteps.length ? (
              <View style={styles.emptyPanel}>
                <Ionicons name="search-outline" size={22} color={Palette.muted} />
                <Text style={styles.emptyTitle}>No matching lesson</Text>
                <Text style={styles.emptyText}>Try a measurement, waveform, rhythm, or step number.</Text>
              </View>
            ) : (
              <StepDetail
                item={selectedItem}
                onOpen={learning.openTopic}
                onStartEcg={() => router.push('/(ecg-flow)/pre-step')}
              />
            )}
          </>
        )}

        <View style={styles.sourcePanel}>
          <Ionicons name="library-outline" size={17} color={Palette.primaryMuted} />
          <Text style={styles.sourceText} numberOfLines={2}>{ecgStudySources.join(' · ')}</Text>
        </View>
      </ScrollView>
      <RedFlagDetailSheet
        bottomInset={insets.bottom}
        item={selectedRedFlag}
        visible={!!selectedRedFlag}
        onClose={() => setSelectedRedFlag(undefined)}
        onOpenLesson={learning.openTopic}
      />
      <ConditionDetailSheet
        bottomInset={insets.bottom}
        item={selectedCondition}
        visible={!!selectedCondition}
        onClose={() => setSelectedCondition(undefined)}
        onOpenLesson={learning.openTopic}
      />
      {learning.sheet}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.canvas,
    flex: 1,
  },
  content: {
    gap: 14,
    padding: Layout.pagePadding,
    paddingBottom: 32,
  },
  heroPrimaryAction: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  heroPrimaryActionText: {
    color: Palette.primary,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  heroSecondaryAction: {
    alignItems: 'center',
    backgroundColor: Palette.accent,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  heroSecondaryActionText: {
    color: Palette.paper,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionTabs: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    flexDirection: 'row',
    gap: 8,
    padding: 8,
  },
  sectionTab: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
    minHeight: 44,
    minWidth: 0,
    paddingHorizontal: 6,
  },
  sectionTabActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  sectionTabText: {
    color: Palette.primary,
    flexShrink: 1,
    fontSize: 12,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionTabTextActive: {
    color: Palette.paper,
  },
  searchPanel: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 12,
    padding: 12,
  },
  searchBox: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    minHeight: 46,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: Palette.ink,
    flex: 1,
    fontSize: 14,
    fontWeight: '800',
    minWidth: 0,
  },
  phaseRow: {
    gap: 8,
    paddingRight: 2,
  },
  phaseChip: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 58,
    paddingHorizontal: 13,
  },
  phaseChipActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  phaseChipText: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '900',
  },
  phaseChipTextActive: {
    color: Palette.paper,
  },
  trainerPanel: {
    backgroundColor: Palette.paper,
    borderColor: '#edbeb8',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 12,
    padding: 12,
  },
  trainerHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  trainerIcon: {
    alignItems: 'center',
    backgroundColor: Palette.accentSoft,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  trainerHeaderCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  trainerTitle: {
    color: Palette.ink,
    fontSize: 17,
    fontWeight: '900',
  },
  trainerText: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  trainerCardRow: {
    gap: 10,
    paddingRight: 2,
  },
  trainerCard: {
    backgroundColor: Palette.accentSoft,
    borderColor: '#edbeb8',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 9,
    minHeight: 198,
    padding: 12,
    width: 238,
  },
  trainerCardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  trainerCardTitle: {
    color: Palette.accent,
    flex: 1,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 19,
  },
  trainerUrgencyPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Palette.paper,
    borderColor: '#edbeb8',
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 5,
    maxWidth: '100%',
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  trainerUrgencyText: {
    color: Palette.accent,
    flexShrink: 1,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  trainerCue: {
    color: Palette.ink,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  trainerRiskPanel: {
    backgroundColor: Palette.paper,
    borderColor: '#edbeb8',
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: 3,
    padding: 9,
  },
  trainerRiskLabel: {
    color: Palette.accent,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  trainerRisk: {
    color: '#7f2e27',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  trainerAction: {
    color: '#7f2e27',
    fontSize: 11,
    fontWeight: '800',
    lineHeight: 15,
  },
  conditionPanel: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 14,
    padding: 12,
  },
  conditionIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  conditionGroup: {
    gap: 8,
  },
  conditionGroupHeader: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    minHeight: 58,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  conditionGroupHeaderActive: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#b8d8d4',
  },
  conditionGroupIcon: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
  conditionGroupCopy: {
    flex: 1,
    gap: 2,
    minWidth: 0,
  },
  conditionGroupTitle: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0,
    textTransform: 'uppercase',
  },
  conditionGroupExamples: {
    color: Palette.muted,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 15,
  },
  conditionGroupCount: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    minWidth: 34,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  conditionGroupCountText: {
    color: Palette.primary,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  conditionList: {
    gap: 9,
  },
  conditionCard: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 9,
    padding: 11,
  },
  conditionCardTop: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 9,
  },
  conditionBadge: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    height: 32,
    justifyContent: 'center',
    width: 32,
  },
  conditionCardCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  conditionTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
    lineHeight: 19,
  },
  conditionDefinition: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  conditionCriteriaPreview: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: 4,
    padding: 8,
  },
  conditionCriteriaText: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '800',
  },
  emptyInlinePanel: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    padding: 14,
  },
  emptyInlineText: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '800',
  },
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetScrim: {
    backgroundColor: 'rgba(17, 24, 39, 0.36)',
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  redFlagSheet: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    borderWidth: 1,
    boxShadow: '0 -18px 40px rgba(17, 24, 39, 0.18)',
    gap: 12,
    maxHeight: '88%',
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sheetGrabber: {
    alignSelf: 'center',
    backgroundColor: '#d8d2c3',
    borderRadius: 999,
    height: 4,
    width: 42,
  },
  sheetHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
  },
  sheetTitleBlock: {
    flex: 1,
    gap: 7,
    minWidth: 0,
  },
  sheetUrgencyPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Palette.accent,
    borderCurve: 'continuous',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  conditionSheetPill: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  sheetUrgencyText: {
    color: Palette.paper,
    flexShrink: 1,
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sheetTitle: {
    color: Palette.ink,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  sheetSubtitle: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 18,
  },
  sheetCloseButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  sheetScrollContent: {
    gap: 11,
    paddingBottom: 4,
  },
  sheetSection: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 8,
    padding: 12,
  },
  sheetSectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 7,
  },
  sheetSectionTitle: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sheetBodyText: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '800',
    lineHeight: 19,
  },
  sheetBulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  sheetActionRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 8,
  },
  sheetBulletDot: {
    backgroundColor: Palette.primary,
    borderRadius: 999,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  sheetAmberDot: {
    backgroundColor: Palette.amber,
    borderRadius: 999,
    height: 6,
    marginTop: 7,
    width: 6,
  },
  sheetBulletText: {
    color: Palette.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  mimicCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  mimicTitle: {
    color: Palette.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  mimicText: {
    color: '#7f2e27',
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  criteriaRow: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    borderWidth: 1,
    gap: 4,
    padding: 10,
  },
  criteriaLabel: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  criteriaValue: {
    color: Palette.ink,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 18,
  },
  symptomWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  symptomChip: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  symptomChipText: {
    color: Palette.ink,
    fontSize: 11,
    fontWeight: '800',
  },
  sheetFooter: {
    borderColor: Palette.line,
    borderTopWidth: 1,
    paddingTop: 12,
  },
  sheetLessonButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 14,
  },
  sheetLessonButtonText: {
    color: Palette.paper,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
    textAlign: 'center',
  },
  stepGridHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: Palette.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  sectionMeta: {
    color: Palette.primaryMuted,
    fontSize: 13,
    fontWeight: '900',
  },
  stepGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  stepTile: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexBasis: '31.5%',
    flexGrow: 1,
    gap: 8,
    minHeight: 92,
    minWidth: 96,
    padding: 10,
  },
  stepTileSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  stepNumber: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  stepNumberSelected: {
    backgroundColor: 'rgba(255, 253, 248, 0.16)',
  },
  stepNumberText: {
    color: Palette.primary,
    fontSize: 12,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  stepNumberTextSelected: {
    color: Palette.paper,
  },
  tileTitle: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '900',
    lineHeight: 17,
  },
  tileTitleSelected: {
    color: Palette.paper,
  },
  detailPanel: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    gap: 13,
    padding: 14,
  },
  detailHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  detailBadge: {
    backgroundColor: Palette.accentSoft,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },
  detailBadgeText: {
    color: Palette.accent,
    fontSize: 12,
    fontWeight: '900',
  },
  detailTitleBlock: {
    flex: 1,
    gap: 4,
    minWidth: 0,
  },
  detailTitle: {
    color: Palette.ink,
    fontSize: 20,
    fontWeight: '900',
    lineHeight: 24,
  },
  detailFocus: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  checkpointList: {
    gap: 7,
  },
  checkpointRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 7,
  },
  checkpointText: {
    color: Palette.ink,
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  pearlPanel: {
    alignItems: 'flex-start',
    backgroundColor: Palette.amberSoft,
    borderColor: '#ead4a8',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 10,
  },
  pearlText: {
    color: '#6c4b12',
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    lineHeight: 17,
  },
  actions: {
    flexDirection: 'row',
    gap: 9,
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 10,
  },
  primaryActionText: {
    color: Palette.paper,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
  },
  secondaryAction: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 46,
    paddingHorizontal: 10,
  },
  secondaryActionText: {
    color: Palette.primary,
    flexShrink: 1,
    fontSize: 14,
    fontWeight: '900',
  },
  emptyPanel: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 6,
    padding: 20,
  },
  emptyTitle: {
    color: Palette.ink,
    fontSize: 16,
    fontWeight: '900',
  },
  emptyText: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  sourcePanel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 2,
  },
  sourceText: {
    color: Palette.muted,
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    lineHeight: 16,
  },
});
