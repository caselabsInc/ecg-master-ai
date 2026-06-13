import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step5() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const qrsComplex = draft.qrsComplex || { notes: [] };

  const handleNext = () => {
    router.push('/(ecg-flow)/step-6');
  };

  const handleChange = (val: string) => {
    const boxes = parseFloat(val);
    const ms = isNaN(boxes) ? undefined : boxes * 40;
    updateDraft({ 
      qrsComplex: { 
        ...qrsComplex,
        durationSmallBoxes: isNaN(boxes) ? undefined : boxes,
        calculatedMs: ms
      } 
    });
  };

  const handleToggleNote = (val: string) => {
    const currentNotes = qrsComplex.notes || [];
    let newNotes;
    if (currentNotes.includes(val)) {
      newNotes = currentNotes.filter(n => n !== val);
    } else {
      newNotes = [...currentNotes, val];
    }
    updateDraft({ qrsComplex: { ...qrsComplex, notes: newNotes } });
  };

  const isValid = qrsComplex.durationSmallBoxes !== undefined && (qrsComplex.notes || []).length > 0;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 5: QRS Complex</Text>
        <Text style={styles.subtitle}>Measure the duration and note any morphological abnormalities.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>QRS duration (small boxes)</Text>
          <TextInput
            style={styles.input}
            placeholder="e.g. 2"
            keyboardType="decimal-pad"
            value={qrsComplex.durationSmallBoxes?.toString() || ''}
            onChangeText={handleChange}
          />
          {qrsComplex.calculatedMs !== undefined && (
            <Text style={[styles.calcText, qrsComplex.calculatedMs > 120 && styles.warningText]}>
              = {qrsComplex.calculatedMs} ms
              {qrsComplex.calculatedMs > 120 && ' (> 120ms flag)'}
            </Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>QRS voltage / notes (Select all that apply)</Text>
          <OptionSelect
            options={[
              { label: 'Normal', value: 'normal' },
              { label: 'Possible hypertrophy', value: 'possible_hypertrophy' },
              { label: 'Possible bundle branch block pattern', value: 'possible_bbb' },
              { label: 'Other', value: 'other' }
            ]}
            multiSelect
            selectedValues={qrsComplex.notes}
            onToggleSelect={handleToggleNote}
          />
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
  calcText: { marginTop: 8, fontSize: 14, color: '#1d4ed8', fontWeight: '500' },
  warningText: { color: '#dc2626' },
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
