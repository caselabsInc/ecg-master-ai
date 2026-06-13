import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step9() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const tWaves = draft.tWaves || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-10');
  };

  const handleToggleLead = (val: string) => {
    const currentLeads = tWaves.leads || [];
    let newLeads;
    if (currentLeads.includes(val)) {
      newLeads = currentLeads.filter(n => n !== val);
    } else {
      newLeads = [...currentLeads, val];
    }
    updateDraft({ tWaves: { ...tWaves, leads: newLeads } });
  };

  const isValid = !!tWaves.status;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 9: T Waves</Text>
        <Text style={styles.subtitle}>Determine the overall direction and shape of the T waves.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>T Wave Direction (Overall)</Text>
          <OptionSelect
            options={[
              { label: 'Normal (concordant with QRS)', value: 'normal' },
              { label: 'Inverted in some leads', value: 'inverted' },
              { label: 'Tall / peaked', value: 'tall_peaked' }
            ]}
            selectedValue={tWaves.status}
            onSelect={(val) => updateDraft({ tWaves: { ...tWaves, status: val as any } })}
          />
        </View>

        {(tWaves.status === 'inverted' || tWaves.status === 'tall_peaked') && (
          <View style={styles.field}>
            <Text style={styles.label}>Which leads affected? (Select all that apply)</Text>
            <OptionSelect
              options={[
                { label: 'I', value: 'I' }, { label: 'II', value: 'II' }, { label: 'III', value: 'III' },
                { label: 'aVR', value: 'aVR' }, { label: 'aVL', value: 'aVL' }, { label: 'aVF', value: 'aVF' },
                { label: 'V1', value: 'V1' }, { label: 'V2', value: 'V2' }, { label: 'V3', value: 'V3' },
                { label: 'V4', value: 'V4' }, { label: 'V5', value: 'V5' }, { label: 'V6', value: 'V6' }
              ]}
              multiSelect
              selectedValues={tWaves.leads || []}
              onToggleSelect={handleToggleLead}
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
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
