import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step2() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const rhythm = draft.rhythm || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-3');
  };

  const isValid = !!rhythm.rrIntervals && !!rhythm.pBeforeQrs;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 2: Rhythm</Text>
        <Text style={styles.subtitle}>Assess the basic rhythm pattern.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>R-R Intervals</Text>
          <OptionSelect
            options={[
              { label: 'Constant', value: 'constant' },
              { label: 'Not constant', value: 'not_constant' }
            ]}
            selectedValue={rhythm.rrIntervals}
            onSelect={(val) => updateDraft({ rhythm: { ...rhythm, rrIntervals: val as any } })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>P wave before every QRS?</Text>
          <OptionSelect
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' },
              { label: 'Not clearly visible', value: 'unclear' }
            ]}
            selectedValue={rhythm.pBeforeQrs}
            onSelect={(val) => updateDraft({ rhythm: { ...rhythm, pBeforeQrs: val as any } })}
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
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
