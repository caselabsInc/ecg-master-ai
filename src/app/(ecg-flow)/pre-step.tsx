import React, { useMemo, useState } from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, TextInput, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Layout, Palette, Radius } from '@/constants/design';
import { useEcgStore } from '@/store/ecgStore';

const genderOptions = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Other', value: 'other' },
  { label: 'Prefer not', value: 'prefer_not_to_say' },
] as const;

const indicationOptions = ['Chest Pain', 'Palpitations', 'Syncope', 'Routine Check', 'Pre-op'];

function formatDateTime(date: Date) {
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

export default function PreStep() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const context = draft.context || {};
  const [showPicker, setShowPicker] = useState(false);
  const [androidPickerMode, setAndroidPickerMode] = useState<'date' | 'time'>('date');

  const initialDate = useMemo(() => {
    if (context.ecgDateTime) {
      const parsed = new Date(context.ecgDateTime);
      if (!isNaN(parsed.getTime())) return parsed;
    }

    return new Date();
  }, [context.ecgDateTime]);

  const [dateObj, setDateObj] = useState(initialDate);
  const isValid = !!context.age && !!context.gender;
  const isOtherIndication = !!context.indication && !indicationOptions.includes(context.indication);
  const completedBasics = [context.age, context.gender, context.indication, context.ecgDateTime].filter(Boolean).length;

  const updateContext = (nextContext: typeof context) => {
    updateDraft({ context: nextContext });
  };

  const handleDateValueChange = (_event: unknown, selectedDate: Date) => {
    const nextDate =
      Platform.OS === 'android' && androidPickerMode === 'time'
        ? new Date(
            dateObj.getFullYear(),
            dateObj.getMonth(),
            dateObj.getDate(),
            selectedDate.getHours(),
            selectedDate.getMinutes()
          )
        : selectedDate;

    setDateObj(nextDate);
    updateContext({ ...context, ecgDateTime: formatDateTime(nextDate) });

    if (Platform.OS === 'android') {
      if (androidPickerMode === 'date') {
        setAndroidPickerMode('time');
      } else {
        setShowPicker(false);
        setAndroidPickerMode('date');
      }
    }
  };

  const handleDateDismiss = () => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      setAndroidPickerMode('date');
    }
  };

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
              <Text style={styles.kicker}>Patient context</Text>
              <Text style={styles.heroTitle}>Set the clinical frame before measuring the trace.</Text>
            </View>
            <View style={styles.stepBadge}>
              <Text style={styles.stepBadgeValue}>0</Text>
              <Text style={styles.stepBadgeLabel}>of 12</Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.heroStats}>
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>{completedBasics}/4</Text>
              <Text style={styles.heroStatLabel}>Fields ready</Text>
            </View>
            <View style={styles.heroStatDivider} />
            <View style={styles.heroStat}>
              <Text style={styles.heroStatValue}>25 mm/s</Text>
              <Text style={styles.heroStatLabel}>Default speed</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="person-outline"
            title="Patient basics"
            detail="Only the essentials needed to contextualize intervals and rhythm."
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Age</Text>
            <View style={styles.ageInputRow}>
              <TextInput
                style={styles.ageInput}
                placeholder="45"
                placeholderTextColor={Palette.subtle}
                keyboardType="number-pad"
                value={context.age?.toString() || ''}
                onChangeText={(text) => updateContext({ ...context, age: parseInt(text, 10) || undefined })}
              />
              <Text style={styles.inputSuffix}>years</Text>
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Gender</Text>
            <View style={styles.segmentGrid}>
              {genderOptions.map((option) => {
                const selected = context.gender === option.value;
                return (
                  <Pressable
                    key={option.value}
                    style={[styles.segmentButton, selected && styles.segmentButtonActive]}
                    onPress={() => updateContext({ ...context, gender: option.value })}
                  >
                    <Text style={[styles.segmentText, selected && styles.segmentTextActive]}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="medical-outline"
            title="Clinical context"
            detail="Capture why the ECG was ordered and when the recording happened."
          />

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Indication</Text>
            <View style={styles.pillGrid}>
              {indicationOptions.map((indication) => {
                const selected = context.indication === indication;
                return (
                  <Pressable
                    key={indication}
                    style={[styles.pill, selected && styles.pillActive]}
                    onPress={() => updateContext({ ...context, indication })}
                  >
                    <Text style={[styles.pillText, selected && styles.pillTextActive]}>{indication}</Text>
                  </Pressable>
                );
              })}
              <Pressable
                style={[styles.pill, isOtherIndication && styles.pillActive]}
                onPress={() => updateContext({ ...context, indication: 'Other' })}
              >
                <Text style={[styles.pillText, isOtherIndication && styles.pillTextActive]}>Other</Text>
              </Pressable>
            </View>
          </View>

          {isOtherIndication && (
            <View style={styles.textInputShell}>
              <TextInput
                style={styles.textInput}
                placeholder="Specify indication"
                placeholderTextColor={Palette.subtle}
                value={context.indication === 'Other' ? '' : context.indication}
                onChangeText={(text) => updateContext({ ...context, indication: text || 'Other' })}
                autoFocus
              />
            </View>
          )}

          <View style={styles.fieldGroup}>
            <Text style={styles.inputLabel}>Recording date and time</Text>
            <Pressable
              style={styles.dateButton}
              onPress={() => {
                if (Platform.OS === 'android') setAndroidPickerMode('date');
                setShowPicker((value) => !value);
              }}
            >
              <View style={styles.dateIcon}>
                <Ionicons name="calendar-outline" size={18} color={Palette.primary} />
              </View>
              <View style={styles.dateCopy}>
                <Text style={[styles.dateValue, !context.ecgDateTime && styles.placeholderText]} selectable>
                  {context.ecgDateTime || 'Select recording time'}
                </Text>
                <Text style={styles.dateHint}>Tap to update timestamp</Text>
              </View>
              <Ionicons name={showPicker ? 'chevron-up' : 'chevron-down'} size={18} color={Palette.muted} />
            </Pressable>
          </View>

          {showPicker && (
            <View style={styles.pickerContainer}>
              <DateTimePicker
                value={dateObj}
                mode={Platform.OS === 'ios' ? 'datetime' : androidPickerMode}
                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                themeVariant="light"
                style={styles.datePicker}
                onValueChange={handleDateValueChange}
                onDismiss={handleDateDismiss}
              />
              {Platform.OS === 'ios' && (
                <Pressable onPress={() => setShowPicker(false)} style={styles.pickerDoneButton}>
                  <Text style={styles.pickerDoneText}>Done</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>

        <View style={styles.card}>
          <SectionHeader
            icon="options-outline"
            title="Calibration"
            detail="Confirm the paper standards used for measurement."
          />

          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Paper speed</Text>
              <Text style={styles.settingDescription}>25 mm/s standard diagnostic speed</Text>
            </View>
            <View style={styles.settingValuePill}>
              <Text style={styles.settingValueText}>25</Text>
            </View>
            <Switch
              value={context.paperSpeedStandard !== false}
              onValueChange={(value) => updateContext({ ...context, paperSpeedStandard: value })}
              trackColor={{ false: Palette.lineStrong, true: Palette.primaryMuted }}
              thumbColor={Palette.paper}
              ios_backgroundColor={Palette.lineStrong}
            />
          </View>

          <View style={styles.settingDivider} />

          <View style={styles.settingRow}>
            <View style={styles.settingCopy}>
              <Text style={styles.settingTitle}>Voltage calibration</Text>
              <Text style={styles.settingDescription}>10 mm/mV vertical sensitivity</Text>
            </View>
            <View style={styles.settingValuePill}>
              <Text style={styles.settingValueText}>10</Text>
            </View>
            <Switch
              value={context.calibrationStandard !== false}
              onValueChange={(value) => updateContext({ ...context, calibrationStandard: value })}
              trackColor={{ false: Palette.lineStrong, true: Palette.primaryMuted }}
              thumbColor={Palette.paper}
              ios_backgroundColor={Palette.lineStrong}
            />
          </View>
        </View>

        <View style={styles.tipPanel}>
          <Ionicons name="shield-checkmark-outline" size={20} color={Palette.success} />
          <Text style={styles.tipText}>This context improves the teaching interpretation but does not replace clinical judgment.</Text>
        </View>

        <Pressable style={[styles.startButton, !isValid && styles.startButtonDisabled]} onPress={() => router.push('/(ecg-flow)/step-1')} disabled={!isValid}>
          <Text style={styles.startButtonText}>{isValid ? 'Begin waveform analysis' : 'Add age and gender to continue'}</Text>
          <Ionicons name="arrow-forward" size={18} color={Palette.paper} />
        </Pressable>
      </ScrollView>
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
    paddingBottom: 36,
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
    width: '5%',
  },
  heroStats: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.1)',
    borderColor: 'rgba(255, 253, 248, 0.16)',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 14,
  },
  heroStat: {
    flex: 1,
    gap: 2,
  },
  heroStatValue: {
    color: Palette.paper,
    fontSize: 16,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
  },
  heroStatLabel: {
    color: '#cfe6e2',
    fontSize: 12,
    fontWeight: '700',
  },
  heroStatDivider: {
    backgroundColor: 'rgba(255, 253, 248, 0.18)',
    height: 34,
    width: 1,
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
  fieldGroup: {
    gap: 9,
  },
  inputLabel: {
    color: Palette.ink,
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  ageInputRow: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    minHeight: 58,
    paddingHorizontal: 16,
  },
  ageInput: {
    color: Palette.ink,
    flex: 1,
    fontSize: 24,
    fontVariant: ['tabular-nums'],
    fontWeight: '900',
    paddingVertical: 12,
  },
  inputSuffix: {
    color: Palette.muted,
    fontSize: 14,
    fontWeight: '800',
  },
  segmentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  segmentButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexBasis: '47%',
    flexGrow: 1,
    minHeight: 46,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  segmentButtonActive: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  segmentText: {
    color: Palette.muted,
    fontSize: 14,
    fontWeight: '800',
    textAlign: 'center',
  },
  segmentTextActive: {
    color: Palette.paper,
  },
  pillGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 9,
  },
  pill: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  pillActive: {
    backgroundColor: Palette.accentSoft,
    borderColor: '#efc3bd',
  },
  pillText: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  pillTextActive: {
    color: Palette.accent,
  },
  textInputShell: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    minHeight: 54,
    paddingHorizontal: 15,
  },
  textInput: {
    color: Palette.ink,
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    paddingVertical: 14,
  },
  dateButton: {
    alignItems: 'center',
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    minHeight: 64,
    padding: 12,
  },
  dateIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  dateCopy: {
    flex: 1,
    gap: 2,
  },
  dateValue: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  placeholderText: {
    color: Palette.subtle,
  },
  dateHint: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  pickerContainer: {
    backgroundColor: '#f9f6ef',
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  datePicker: {
    height: 320,
    width: '100%',
  },
  pickerDoneButton: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderTopColor: Palette.line,
    borderTopWidth: 1,
    padding: 13,
  },
  pickerDoneText: {
    color: Palette.primary,
    fontSize: 16,
    fontWeight: '900',
  },
  settingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  settingCopy: {
    flex: 1,
    gap: 3,
  },
  settingTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '900',
  },
  settingDescription: {
    color: Palette.muted,
    fontSize: 12,
    lineHeight: 17,
  },
  settingValuePill: {
    alignItems: 'center',
    backgroundColor: Palette.amberSoft,
    borderRadius: 999,
    minWidth: 36,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },
  settingValueText: {
    color: Palette.amber,
    fontSize: 12,
    fontWeight: '900',
  },
  settingDivider: {
    backgroundColor: Palette.line,
    height: 1,
  },
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
  startButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
    minHeight: 56,
    paddingHorizontal: 18,
  },
  startButtonDisabled: {
    backgroundColor: Palette.subtle,
  },
  startButtonText: {
    color: Palette.paper,
    fontSize: 15,
    fontWeight: '900',
    textAlign: 'center',
  },
});
