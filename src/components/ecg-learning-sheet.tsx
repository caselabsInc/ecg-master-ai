import React from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius } from '@/constants/design';
import { getLearningTopic, LearningTopicId, LearningTopic } from '@/constants/ecgLearning';

type LearningSheetController = {
  openTopic: (topicId: LearningTopicId | string) => void;
  closeTopic: () => void;
  sheet: React.ReactNode;
};

export function useLearningSheet(): LearningSheetController {
  const [topic, setTopic] = React.useState<LearningTopic | undefined>();

  return {
    openTopic: (topicId) => setTopic(getLearningTopic(topicId)),
    closeTopic: () => setTopic(undefined),
    sheet: <LearningBottomSheet topic={topic} onClose={() => setTopic(undefined)} />,
  };
}

export function StepLearningButton({
  topicId,
  onOpen,
}: {
  topicId: LearningTopicId | string;
  onOpen: (topicId: LearningTopicId | string) => void;
}) {
  return (
    <Pressable style={styles.stepButton} onPress={() => onOpen(topicId)}>
      <View style={styles.stepButtonIcon}>
        <Ionicons name="school-outline" size={18} color={Palette.primary} />
      </View>
      <View style={styles.stepButtonCopy}>
        <Text style={styles.stepButtonTitle}>Understand this step</Text>
        <Text style={styles.stepButtonText}>How to read it, why it matters, and what abnormal patterns can mean.</Text>
      </View>
      <Ionicons name="chevron-up-outline" size={18} color={Palette.primary} />
    </Pressable>
  );
}

export function LearnableText({
  children,
  topicId,
  onOpen,
  style,
}: {
  children: React.ReactNode;
  topicId: LearningTopicId | string;
  onOpen: (topicId: LearningTopicId | string) => void;
  style?: object;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      hitSlop={12}
      style={styles.learnableLabel}
      onPress={(event) => {
        event.stopPropagation();
        onOpen(topicId);
      }}
    >
      <Text style={style}>{children}</Text>
      <View style={styles.learnableIconHitArea}>
        <Ionicons name="information-circle-outline" size={17} color={Palette.primaryMuted} />
      </View>
    </Pressable>
  );
}

function LearningBottomSheet({ topic, onClose }: { topic?: LearningTopic; onClose: () => void }) {
  return (
    <Modal animationType="slide" onRequestClose={onClose} transparent visible={!!topic}>
      <View style={styles.backdrop}>
        <Pressable accessibilityLabel="Close learning sheet" style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.sheet}>
          {topic && (
            <>
              <View style={styles.grabber} />
              <View style={styles.header}>
                <View style={styles.headerCopy}>
                  <Text style={styles.title}>{topic.title}</Text>
                  {!!topic.subtitle && <Text style={styles.subtitle}>{topic.subtitle}</Text>}
                </View>
                <Pressable style={styles.closeButton} onPress={onClose}>
                  <Ionicons name="close" size={20} color={Palette.primary} />
                </Pressable>
              </View>

              <ScrollView
                bounces
                contentContainerStyle={styles.content}
                nestedScrollEnabled
                scrollEventThrottle={16}
                showsVerticalScrollIndicator
                style={styles.scrollArea}
              >
                {topic.sections.map((section) => (
                  <View key={section.heading} style={styles.section}>
                    <Text style={styles.sectionHeading}>{section.heading}</Text>
                    {section.body.map((paragraph) => (
                      <View key={paragraph} style={styles.bulletRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.bodyText}>{paragraph}</Text>
                      </View>
                    ))}
                  </View>
                ))}

                {!!topic.redFlags?.length && (
                  <View style={styles.redFlagPanel}>
                    <View style={styles.redFlagHeader}>
                      <Ionicons name="alert-circle-outline" size={18} color={Palette.accent} />
                      <Text style={styles.redFlagTitle}>Escalation cues</Text>
                    </View>
                    {topic.redFlags.map((flag) => (
                      <Text key={flag} style={styles.redFlagText}>
                        {flag}
                      </Text>
                    ))}
                  </View>
                )}

                {!!topic.sources?.length && (
                  <View style={styles.sourcePanel}>
                    <Text style={styles.sourceTitle}>Evidence base</Text>
                    <Text style={styles.sourceText}>{topic.sources.join(' · ')}</Text>
                  </View>
                )}
              </ScrollView>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: 'rgba(17, 24, 39, 0.38)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Palette.paper,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    flexShrink: 1,
    maxHeight: '84%',
    minHeight: '44%',
    paddingTop: 10,
  },
  grabber: {
    alignSelf: 'center',
    backgroundColor: Palette.lineStrong,
    borderRadius: 999,
    height: 5,
    marginBottom: 12,
    width: 44,
  },
  header: {
    alignItems: 'flex-start',
    borderBottomColor: Palette.line,
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerCopy: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: Palette.ink,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  scrollArea: {
    flexGrow: 0,
    flexShrink: 1,
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 36,
  },
  section: {
    gap: 10,
  },
  sectionHeading: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  bulletRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
  },
  bullet: {
    backgroundColor: Palette.primaryMuted,
    borderRadius: 999,
    height: 6,
    marginTop: 8,
    width: 6,
  },
  bodyText: {
    color: Palette.ink,
    flex: 1,
    fontSize: 15,
    lineHeight: 22,
  },
  redFlagPanel: {
    backgroundColor: Palette.accentSoft,
    borderColor: '#edbeb8',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  redFlagHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  redFlagTitle: {
    color: Palette.accent,
    fontSize: 14,
    fontWeight: '900',
  },
  redFlagText: {
    color: '#7f2e27',
    fontSize: 14,
    lineHeight: 20,
  },
  sourcePanel: {
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    gap: 4,
    padding: 14,
  },
  sourceTitle: {
    color: Palette.primary,
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  sourceText: {
    color: Palette.primary,
    fontSize: 13,
    lineHeight: 18,
  },
  stepButton: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    boxShadow: Palette.smallShadow,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  stepButtonIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderRadius: Radius.md,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  stepButtonCopy: {
    flex: 1,
    gap: 2,
  },
  stepButtonTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  stepButtonText: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  learnableLabel: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    minHeight: 32,
    paddingRight: 4,
  },
  learnableIconHitArea: {
    alignItems: 'center',
    borderRadius: 999,
    height: 30,
    justifyContent: 'center',
    width: 30,
  },
});
