import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step10() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const qtInterval = draft.qtInterval || {};
  const heartRate = draft.heartRate?.calculatedBpm;

  const handleNext = () => {
    router.push('/(ecg-flow)/step-11');
  };

  const handleChange = (val: string) => {
    const boxes = parseFloat(val);
    const qtMs = isNaN(boxes) ? undefined : boxes * 40;
    
    let qtcMs: number | undefined = undefined;

    if (qtMs && heartRate) {
      // Bazett's formula: QTc = QT / sqrt(RR in seconds)
      const rrSeconds = 60 / heartRate;
      qtcMs = Math.round(qtMs / Math.sqrt(rrSeconds));
    }

    updateDraft({ 
      qtInterval: { 
        smallBoxes: isNaN(boxes) ? undefined : boxes,
        calculatedQtMs: qtMs,
        calculatedQtcMs: qtcMs
      } 
    });
  };

  const isValid = qtInterval.smallBoxes !== undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 10: QT Interval</Text>
        <Text style={styles.subtitle}>Measure from the start of the Q wave to the end of the T wave.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Number of small boxes</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 10"
            keyboardType="decimal-pad"
            value={qtInterval.smallBoxes?.toString() || ''}
            onChangeText={handleChange}
          />
        </View>

        {qtInterval.calculatedQtMs !== undefined && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Calculated QT Interval</Text>
            <Text style={styles.resultValue}>{qtInterval.calculatedQtMs} ms</Text>
            
            {qtInterval.calculatedQtcMs !== undefined ? (
              <>
                <View style={styles.divider} />
                <Text style={styles.resultLabel}>Calculated QTc (Bazett's)</Text>
                <Text style={styles.resultValue}>{qtInterval.calculatedQtcMs} ms</Text>
                {(qtInterval.calculatedQtcMs > 450) && (
                  <Text style={styles.resultWarning}>
                    Prolonged QTc flag (>450ms)
                  </Text>
                )}
              </>
            ) : (
              <Text style={styles.noteText}>Heart rate not available to calculate QTc.</Text>
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
  resultValue: { fontSize: 24, fontWeight: 'bold', color: '#1d4ed8' },
  resultWarning: { color: '#dc2626', fontSize: 12, marginTop: 8, fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#bfdbfe', width: '100%', marginVertical: 12 },
  noteText: { color: '#64748b', fontSize: 12, marginTop: 8 }
});
