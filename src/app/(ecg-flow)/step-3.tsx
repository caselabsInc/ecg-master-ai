import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step3() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const pWave = draft.pWave || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-4');
  };

  const isValid = !!pWave.morphology && pWave.durationSmallBoxes !== undefined && pWave.amplitudeSmallBoxes !== undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 3: P Wave Assessment</Text>
        <Text style={styles.subtitle}>Assess the morphology, duration, and amplitude of the P wave.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>P wave shape in Lead II</Text>
          <OptionSelect
            options={[
              { label: 'Normal/smooth & upright', value: 'normal' },
              { label: 'Abnormal (notched, inverted, absent, etc.)', value: 'abnormal' }
            ]}
            selectedValue={pWave.morphology}
            onSelect={(val) => updateDraft({ pWave: { ...pWave, morphology: val as any } })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>P wave duration (small boxes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2.5"
            keyboardType="decimal-pad"
            value={pWave.durationSmallBoxes?.toString() || ''}
            onChangeText={(val) => updateDraft({ pWave: { ...pWave, durationSmallBoxes: parseFloat(val) || undefined } })}
          />
          {pWave.durationSmallBoxes !== undefined && pWave.durationSmallBoxes > 3 && (
            <Text style={styles.warningText}>Flags: duration > 120ms (3 small boxes)</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>P wave amplitude (small boxes height)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            keyboardType="decimal-pad"
            value={pWave.amplitudeSmallBoxes?.toString() || ''}
            onChangeText={(val) => updateDraft({ pWave: { ...pWave, amplitudeSmallBoxes: parseFloat(val) || undefined } })}
          />
          {pWave.amplitudeSmallBoxes !== undefined && pWave.amplitudeSmallBoxes > 2.5 && (
            <Text style={styles.warningText}>Flags: amplitude > 2.5mm (2.5 small boxes)</Text>
          )}
        </View>

      </ScrollView>
      <View style={styles.footer}>
        <FlowButtons onNext={handleNext} isValid={isValid} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#64748b', marginBottom: 24 },
  field: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: '600', color: '#334155', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 8, padding: 12, fontSize: 16, backgroundColor: '#f8fafc' },
  warningText: { color: '#dc2626', fontSize: 14, marginTop: 4, fontWeight: '500' },
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
