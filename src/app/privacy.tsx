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

export default function PrivacyPolicy() {
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
          <Text style={styles.title}>Privacy policy</Text>
          <Text style={styles.updated}>Last updated: 20 Jun 2026</Text>
        </View>

        <Section title="Purpose">
          ECG-Master is a clinician-only ECG interpretation-support app. It stores structured ECG observations entered by the user, saved reports, review-basis records, and AI-assisted interpretation text for the signed-in user.
        </Section>

        <Section title="Information we collect">
          We may collect account details such as email and display name, ECG report content entered by the clinician, patient context entered into a report, criteria-based findings, review-basis metadata, interpretation status, and app usage records required to operate the service.
        </Section>

        <Section title="How information is used">
          Information is used to authenticate users, save ECG reports, generate clinician-reviewable interpretation support, show report history, troubleshoot errors, and improve safety and reliability.
        </Section>

        <Section title="Storage and access">
          Reports are stored under the signed-in account. Access controls are intended to restrict authenticated users to their own report data.
        </Section>

        <Section title="AI processing">
          Structured report data may be sent to the configured AI generation service to create interpretation-support text. AI-assisted output is not an autonomous diagnosis and must be reviewed by a qualified clinician.
        </Section>

        <Section title="Clinical data responsibility">
          Users should avoid entering unnecessary patient identifiers. Where clinical data is entered, the user is responsible for ensuring they have authority to process that data under applicable institutional, privacy, and health-data laws.
        </Section>

        <Section title="Contact">
          For privacy, account, access, or data-deletion requests during internal testing, use Support on the Profile screen to create a support ticket, contact the TestFlight invitation sender, or use the support channel provided by your organization.
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
