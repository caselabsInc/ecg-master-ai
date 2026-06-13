import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step6() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const axis = draft.axis || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-7');
  };

  useEffect(() => {
    if (axis.leadI && axis.leadAVF) {
      let interpretedAxis = 'Indeterminate';
      if (axis.leadI === 'positive' && axis.leadAVF === 'positive') {
        interpretedAxis = 'Normal Axis';
      } else if (axis.leadI === 'positive' && axis.leadAVF === 'negative') {
        interpretedAxis = 'Possible Left Axis Deviation';
      } else if (axis.leadI === 'negative' && axis.leadAVF === 'positive') {
        interpretedAxis = 'Right Axis Deviation';
      } else if (axis.leadI === 'negative' && axis.leadAVF === 'negative') {
        interpretedAxis = 'Extreme Axis Deviation';
      }
      
      if (axis.interpretedAxis !== interpretedAxis) {
        updateDraft({ axis: { ...axis, interpretedAxis } });
      }
    }
  }, [axis.leadI, axis.leadAVF]);

  const isValid = !!axis.leadI && !!axis.leadAVF;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 6: Cardiac Axis</Text>
        <Text style={styles.subtitle}>Determine the overall direction of the heart's electrical activity.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>QRS in Lead I</Text>
          <OptionSelect
            options={[
              { label: 'Predominantly positive', value: 'positive' },
              { label: 'Predominantly negative', value: 'negative' },
              { label: 'Equiphasic', value: 'equiphasic' }
            ]}
            selectedValue={axis.leadI}
            onSelect={(val) => updateDraft({ axis: { ...axis, leadI: val as any } })}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>QRS in Lead aVF</Text>
          <OptionSelect
            options={[
              { label: 'Predominantly positive', value: 'positive' },
              { label: 'Predominantly negative', value: 'negative' },
              { label: 'Equiphasic', value: 'equiphasic' }
            ]}
            selectedValue={axis.leadAVF}
            onSelect={(val) => updateDraft({ axis: { ...axis, leadAVF: val as any } })}
          />
        </View>

        {axis.interpretedAxis && (
          <View style={styles.resultBox}>
            <Text style={styles.resultLabel}>Quadrant Interpretation</Text>
            <Text style={styles.resultValue}>{axis.interpretedAxis}</Text>
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
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' },
  resultBox: { padding: 16, backgroundColor: '#eff6ff', borderRadius: 8, marginTop: 16, alignItems: 'center' },
  resultLabel: { fontSize: 14, color: '#1e40af', marginBottom: 4 },
  resultValue: { fontSize: 20, fontWeight: 'bold', color: '#1d4ed8' },
});
