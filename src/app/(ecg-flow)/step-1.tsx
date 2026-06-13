import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step1() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const heartRate = draft.heartRate || {};

  const calculateBpm = (regularity: string, boxes: number | null, count: number | null) => {
    if (regularity === 'regular' && boxes && boxes > 0) {
      return Math.round(300 / boxes);
    }
    if (regularity === 'irregular' && count && count > 0) {
      return count * 6;
    }
    return undefined;
  };

  const handleNext = () => {
    router.push('/(ecg-flow)/step-2');
  };

  const handleRegularityChange = (val: string) => {
    updateDraft({
      heartRate: {
        ...heartRate,
        regularity: val as any,
        largeBoxesBetweenR: null,
        qrsCountIn10Sec: null,
        calculatedBpm: undefined
      }
    });
  };

  const handleBoxesChange = (text: string) => {
    const val = parseFloat(text);
    const bpm = calculateBpm('regular', val, null);
    updateDraft({
      heartRate: {
        ...heartRate,
        largeBoxesBetweenR: isNaN(val) ? null : val,
        calculatedBpm: bpm
      }
    });
  };

  const handleCountChange = (text: string) => {
    const val = parseInt(text, 10);
    const bpm = calculateBpm('irregular', null, val);
    updateDraft({
      heartRate: {
        ...heartRate,
        qrsCountIn10Sec: isNaN(val) ? null : val,
        calculatedBpm: bpm
      }
    });
  };

  const isValid = !!heartRate.regularity && (!!heartRate.largeBoxesBetweenR || !!heartRate.qrsCountIn10Sec);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 1: Heart Rate</Text>
        <Text style={styles.subtitle}>Determine the regularity and calculate the rate.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Rhythm regularity</Text>
          <OptionSelect
            options={[
              { label: 'Regular', value: 'regular' },
              { label: 'Irregular', value: 'irregular' }
            ]}
            selectedValue={heartRate.regularity}
            onSelect={handleRegularityChange}
          />
        </View>

        {heartRate.regularity === 'regular' && (
          <View style={styles.field}>
            <Text style={styles.label}>Large boxes between two R waves</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 4.5"
              keyboardType="decimal-pad"
              value={heartRate.largeBoxesBetweenR?.toString() || ''}
              onChangeText={handleBoxesChange}
            />
          </View>
        )}

        {heartRate.regularity === 'irregular' && (
          <View style={styles.field}>
            <Text style={styles.label}>Number of QRS complexes in a 10-second strip</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 12"
              keyboardType="number-pad"
              value={heartRate.qrsCountIn10Sec?.toString() || ''}
              onChangeText={handleCountChange}
            />
          </View>
        )}

        {heartRate.calculatedBpm !== undefined && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Calculated Heart Rate</Text>
            <Text style={styles.resultValue}>{heartRate.calculatedBpm} bpm</Text>
            {(heartRate.calculatedBpm < 60 || heartRate.calculatedBpm > 100) && (
              <Text style={styles.resultWarning}>Outside normal range (60-100 bpm)</Text>
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
