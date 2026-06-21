import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Text style={styles.body} selectable>
        {children}
      </Text>
    </View>
  );
}

export default function TermsOfUse() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={19} color={Palette.primary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.kicker}>ECG-Master</Text>
          <Text style={styles.title}>Terms of use</Text>
          <Text style={styles.updated}>Last updated: 20 Jun 2026</Text>
        </View>

        <Section title="Intended users">
          ECG-Master is intended only for licensed, registered, certified, or supervised health care professionals and clinical learners using the app under appropriate supervision.
        </Section>

        <Section title="Interpretation support">
          The app helps organize clinician-entered ECG observations, criteria-based findings, and AI-assisted explanatory text for clinician review. It does not independently diagnose, treat, monitor, prevent, cure, or mitigate disease.
        </Section>

        <Section title="Clinician responsibility">
          Users must independently review the ECG tracing, patient context, entered observations, criteria basis, missing data, and AI-assisted text before making any clinical decision. Do not rely primarily on app output.
        </Section>

        <Section title="Emergency and time-critical care">
          ECG-Master is not an emergency alerting system and is not intended for time-critical decisions. Follow local emergency protocols, institutional pathways, and qualified clinician judgment.
        </Section>

        <Section title="No autonomous ECG analysis">
          The app should not be used to acquire, scan, process, or analyze ECG waveforms or medical images. The clinician is responsible for entering observations they have independently assessed.
        </Section>

        <Section title="AI limitations">
          AI-assisted text can be incomplete or wrong. It may miss dangerous findings, overstate confidence, or produce unsuitable recommendations. The app separates AI-assisted text from criteria-based findings to support independent review.
        </Section>

        <Section title="Account and data requests">
          For account, access, or data-deletion requests during internal testing, use Support to create a ticket or Delete account on the Profile screen, contact the TestFlight invitation sender, or use the support channel provided by your organization.
        </Section>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Palette.canvas, flex: 1 },
  content: { gap: 14, padding: Layout.pagePadding, paddingBottom: 40 },
  backButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  backText: { color: Palette.primary, fontSize: 14, fontWeight: '900' },
  hero: {
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    gap: 7,
    padding: 20,
  },
  kicker: { color: '#b9d8d4', fontSize: 11, fontWeight: '900', letterSpacing: 0.8, textTransform: 'uppercase' },
  title: { color: Palette.paper, fontSize: 28, fontWeight: '900', lineHeight: 33 },
  updated: { color: '#d7ebe8', fontSize: 13, fontWeight: '800' },
  section: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  sectionTitle: { color: Palette.primary, fontSize: 16, fontWeight: '900' },
  body: { color: Palette.ink, fontSize: 14, fontWeight: '700', lineHeight: 22 },
});
