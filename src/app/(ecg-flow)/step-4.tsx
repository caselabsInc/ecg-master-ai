import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step4() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const prInterval = draft.prInterval || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-5');
  };

  const handleChange = (val: string) => {
    const boxes = parseFloat(val);
    const ms = isNaN(boxes) ? undefined : boxes * 40;
    updateDraft({ 
      prInterval: { 
        smallBoxes: isNaN(boxes) ? undefined : boxes,
        calculatedMs: ms
      } 
    });
  };

  const isValid = prInterval.smallBoxes !== undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 4: PR Interval</Text>
        <Text style={styles.subtitle}>Measure the interval from the start of the P wave to the start of the QRS complex.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Number of small boxes</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 4"
            keyboardType="decimal-pad"
            value={prInterval.smallBoxes?.toString() || ''}
            onChangeText={handleChange}
          />
        </View>

        {prInterval.calculatedMs !== undefined && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Calculated PR Interval</Text>
            <Text style={styles.resultValue}>{prInterval.calculatedMs} ms</Text>
            {(prInterval.calculatedMs < 120 || prInterval.calculatedMs > 200) && (
              <Text style={styles.resultWarning}>
                Outside normal range (120-200 ms / 3-5 small boxes)
              </Text>
            )}
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
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  resultBox: { padding: 16, backgroundColor: '#eff6ff', borderRadius: 8, marginTop: 16, alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#1e40af', marginBottom: 4 },
  resultValue: { fontSize: 32, fontWeight: 'bold', color: '#1d4ed8' },
  resultWarning: { color: '#dc2626', fontSize: 12, marginTop: 8, fontWeight: '500' }
});
