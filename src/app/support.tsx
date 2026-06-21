import React from 'react';
import { ActivityIndicator, Alert, Linking, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useRouter } from 'expo-router';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';
import { Layout, Palette, Radius } from '@/constants/design';

const SUPPORT_EMAIL = process.env.EXPO_PUBLIC_SUPPORT_EMAIL || '';

const categories = [
  'Account access',
  'Account deletion',
  'Privacy or data request',
  'Report or AI output',
  'Bug or crash',
  'Clinical wording feedback',
] as const;

const helpTopics = [
  {
    icon: 'person-circle-outline' as const,
    title: 'Account and deletion',
    detail: 'Use Delete account on Profile for immediate account removal, or submit a ticket if you need help before deleting.',
  },
  {
    icon: 'shield-checkmark-outline' as const,
    title: 'Privacy and data',
    detail: 'Submit a privacy or data request for access, correction, deletion assistance, or questions about saved reports.',
  },
  {
    icon: 'pulse-outline' as const,
    title: 'Report feedback',
    detail: 'Flag confusing clinical wording, unexpected AI text, missing audit basis, or anything that feels too directive.',
  },
];

function appVersion() {
  return Constants.expoConfig?.version || '1.0.0';
}

function deviceInfo() {
  const model = Device.modelName || 'Unknown device';
  const os = `${Device.osName || 'Unknown OS'} ${Device.osVersion || ''}`.trim();
  return `${model}; ${os}`;
}

export default function Support() {
  const router = useRouter();
  const { user, userData } = useAuth();
  const [category, setCategory] = React.useState<(typeof categories)[number]>('Bug or crash');
  const [subject, setSubject] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  const canSubmit = subject.trim().length >= 4 && message.trim().length >= 10 && !submitting;

  const openEmailFallback = async () => {
    if (!SUPPORT_EMAIL) {
      Alert.alert('Support email not configured', 'Please use the ticket form or contact your TestFlight invitation sender.');
      return;
    }

    const url = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject || 'ECG-Master support request')}&body=${encodeURIComponent(
      `Account: ${userData?.email || user?.email || 'not signed in'}\nDevice: ${deviceInfo()}\n\n${message}`
    )}`;

    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Mail unavailable', `Please email ${SUPPORT_EMAIL} for support.`);
      return;
    }

    await Linking.openURL(url);
  };

  const submitTicket = async () => {
    if (!canSubmit) {
      Alert.alert('Add more detail', 'Enter a short subject and at least a few details so support can follow up.');
      return;
    }

    setSubmitting(true);
    try {
      const functions = getFunctions(app);
      const createSupportTicket = httpsCallable(functions, 'createSupportTicket');
      const response = await createSupportTicket({
        category,
        subject,
        message,
        appVersion: appVersion(),
        deviceInfo: deviceInfo(),
      });
      const ticketId = (response.data as { ticketId?: string })?.ticketId;

      setSubject('');
      setMessage('');
      Alert.alert(
        'Support ticket sent',
        ticketId ? `Ticket ${ticketId} was created. Support can follow up using your account email.` : 'Support can follow up using your account email.'
      );
    } catch (error: any) {
      console.error('Support ticket failed:', error);
      Alert.alert(
        'Ticket could not be sent',
        error?.message || 'Check your connection and try again, or use the email fallback.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={19} color={Palette.primary} />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <View style={styles.hero}>
          <Text style={styles.kicker}>ECG-Master</Text>
          <Text style={styles.title}>Support</Text>
          <Text style={styles.subtitle}>Get help with account access, data requests, bugs, and internal testing feedback.</Text>
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Help center</Text>
          {helpTopics.map((topic) => (
            <View key={topic.title} style={styles.helpRow}>
              <View style={styles.helpIcon}>
                <Ionicons name={topic.icon} size={18} color={Palette.primary} />
              </View>
              <View style={styles.helpCopy}>
                <Text style={styles.helpTitle}>{topic.title}</Text>
                <Text style={styles.helpText}>{topic.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Create a ticket</Text>
          <Text style={styles.fieldLabel}>Category</Text>
          <View style={styles.categoryGrid}>
            {categories.map((item) => {
              const selected = item === category;
              return (
                <Pressable key={item} style={[styles.categoryChip, selected && styles.categoryChipSelected]} onPress={() => setCategory(item)}>
                  <Text style={[styles.categoryText, selected && styles.categoryTextSelected]}>{item}</Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={styles.fieldLabel}>Subject</Text>
          <TextInput
            style={styles.input}
            placeholder="Short summary"
            placeholderTextColor={Palette.subtle}
            value={subject}
            onChangeText={setSubject}
            maxLength={140}
          />

          <Text style={styles.fieldLabel}>Details</Text>
          <TextInput
            style={styles.textArea}
            placeholder="What happened? What were you trying to do? Include report context if relevant, but avoid patient identifiers."
            placeholderTextColor={Palette.subtle}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={4000}
            textAlignVertical="top"
          />

          <View style={styles.contextBox}>
            <Text style={styles.contextLabel}>Included with ticket</Text>
            <Text style={styles.contextText} selectable>
              {userData?.email || user?.email || 'Signed-in account'} · v{appVersion()} · {deviceInfo()}
            </Text>
          </View>

          <Pressable style={[styles.submitButton, !canSubmit && styles.submitButtonDisabled]} onPress={submitTicket} disabled={!canSubmit}>
            {submitting ? <ActivityIndicator size="small" color={Palette.paper} /> : <Ionicons name="send-outline" size={18} color={Palette.paper} />}
            <Text style={styles.submitButtonText}>{submitting ? 'Sending ticket' : 'Send ticket'}</Text>
          </Pressable>

          <Pressable style={styles.emailButton} onPress={openEmailFallback}>
            <Ionicons name="mail-outline" size={18} color={Palette.primary} />
            <Text style={styles.emailButtonText}>Use email instead</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: Palette.canvas, flex: 1 },
  content: { gap: 16, padding: Layout.pagePadding, paddingBottom: 56 },
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
  title: { color: Palette.paper, fontSize: 30, fontWeight: '900', lineHeight: 35 },
  subtitle: { color: '#d7ebe8', fontSize: 14, fontWeight: '700', lineHeight: 20 },
  panel: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  panelTitle: { color: Palette.ink, fontSize: 18, fontWeight: '900' },
  helpRow: { flexDirection: 'row', gap: 12 },
  helpIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  helpCopy: { flex: 1, gap: 3 },
  helpTitle: { color: Palette.primary, fontSize: 15, fontWeight: '900' },
  helpText: { color: Palette.muted, fontSize: 13, fontWeight: '700', lineHeight: 19 },
  fieldLabel: { color: Palette.primary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  categoryChip: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  categoryChipSelected: { backgroundColor: Palette.primary, borderColor: Palette.primary },
  categoryText: { color: Palette.muted, fontSize: 12, fontWeight: '800' },
  categoryTextSelected: { color: Palette.paper },
  input: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '700',
    minHeight: 50,
    paddingHorizontal: 13,
  },
  textArea: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 21,
    minHeight: 132,
    padding: 13,
  },
  contextBox: {
    backgroundColor: Palette.primarySoft,
    borderColor: '#cce2df',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    gap: 3,
    padding: 12,
  },
  contextLabel: { color: Palette.primary, fontSize: 11, fontWeight: '900', textTransform: 'uppercase' },
  contextText: { color: Palette.primary, fontSize: 12, fontWeight: '700', lineHeight: 18 },
  submitButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 52,
  },
  submitButtonDisabled: { opacity: 0.5 },
  submitButtonText: { color: Palette.paper, fontSize: 15, fontWeight: '900' },
  emailButton: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.lineStrong,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 50,
  },
  emailButtonText: { color: Palette.primary, fontSize: 15, fontWeight: '900' },
});
