import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function PreStep() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const context = draft.context || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-1');
  };

  const isValid = !!context.age && !!context.gender;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Patient Context</Text>
        <Text style={styles.subtitle}>Enter basic information to provide context for the interpretation.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 45"
            keyboardType="number-pad"
            value={context.age?.toString() || ''}
            onChangeText={(text) => updateDraft({ context: { ...context, age: parseInt(text) || undefined } })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Gender</Text>
          <OptionSelect
            options={[
              { label: 'Male', value: 'male' },
              { label: 'Female', value: 'female' },
              { label: 'Other', value: 'other' },
              { label: 'Prefer not to say', value: 'prefer_not_to_say' }
            ]}
            selectedValue={context.gender}
            onSelect={(val) => updateDraft({ context: { ...context, gender: val as any } })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Indication for ECG</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. Chest pain, Routine check"
            value={context.indication || ''}
            onChangeText={(text) => updateDraft({ context: { ...context, indication: text } })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Calibration Standard (10mm/mV & 25mm/s)?</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>{context.calibrationStandard !== false ? 'Yes (Standard)' : 'No'}</Text>
            <Switch
              value={context.calibrationStandard !== false}
              onValueChange={(val) => updateDraft({ context: { ...context, calibrationStandard: val, paperSpeedStandard: val } })}
            />
          </View>
        </View>
        
      </ScrollView>
      <View style={styles.footer}>
        <FlowButtons onNext={handleNext} isValid={isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f8fafc',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    backgroundColor: '#f8fafc',
  },
  switchLabel: {
    fontSize: 16,
    color: '#334155',
  },
  footer: {
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#fff',
  }
});
