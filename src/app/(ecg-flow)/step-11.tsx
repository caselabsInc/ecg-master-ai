import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step11() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  
  const handleNext = () => {
    router.push('/(ecg-flow)/step-12');
  };

  const isValid = !!draft.rWaveProgression && !!draft.uWaves?.present;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 11: R Wave & U Waves</Text>
        <Text style={styles.subtitle}>Evaluate R-wave progression in precordial leads and presence of U waves.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>R-Wave progression (V1-V6)</Text>
          <OptionSelect
            options={[
              { label: 'Normal progression', value: 'normal' },
              { label: 'Poor / Abnormal progression', value: 'abnormal' },
              { label: 'Not assessed', value: 'not_assessed' }
            ]}
            selectedValue={draft.rWaveProgression}
            onSelect={(val) => updateDraft({ rWaveProgression: val as any })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>U waves present?</Text>
          <OptionSelect
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
              { label: 'Not assessed', value: 'not_assessed' }
            ]}
            selectedValue={
              draft.uWaves?.present === true ? 'yes' : 
              draft.uWaves?.present === false ? 'no' : 
              draft.uWaves?.present === 'not_assessed' ? 'not_assessed' : undefined
            }
            onSelect={(val) => {
              const present = val === 'yes' ? true : val === 'no' ? false : 'not_assessed';
              updateDraft({ uWaves: { ...draft.uWaves, present } });
            }}
          />
        </View>

        {draft.uWaves?.present === true && (
          <View style={styles.field}>
            <Text style={styles.label}>Notes on U waves (optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Prominent in V2-V3"
              value={draft.uWaves.note || ''}
              onChangeText={(val) => updateDraft({ uWaves: { ...draft.uWaves, note: val, present: true } })}
            />
          </View>
        )}

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
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
