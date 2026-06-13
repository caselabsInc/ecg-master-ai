import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step7() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const qWaves = draft.qWaves || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-8');
  };

  const handleToggleLead = (val: string) => {
    const currentLeads = qWaves.leads || [];
    let newLeads;
    if (currentLeads.includes(val)) {
      newLeads = currentLeads.filter(n => n !== val);
    } else {
      newLeads = [...currentLeads, val];
    }
    updateDraft({ qWaves: { ...qWaves, leads: newLeads } });
  };

  const isValid = qWaves.present !== undefined;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 7: Pathological Q Waves</Text>
        <Text style={styles.subtitle}>Identify the presence of any significant Q waves indicating previous infarction.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Q waves present?</Text>
          <OptionSelect
            options={[
              { label: 'Yes', value: 'yes' },
              { label: 'No', value: 'no' }
            ]}
            selectedValue={qWaves.present ? 'yes' : qWaves.present === false ? 'no' : undefined}
            onSelect={(val) => updateDraft({ qWaves: { ...qWaves, present: val === 'yes' } })}
          />
        </View>

        {qWaves.present && (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Q wave width (small boxes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 1"
                keyboardType="decimal-pad"
                value={qWaves.widthSmallBoxes?.toString() || ''}
                onChangeText={(val) => updateDraft({ qWaves: { ...qWaves, widthSmallBoxes: parseFloat(val) || undefined } })}
              />
              {qWaves.widthSmallBoxes !== undefined && qWaves.widthSmallBoxes >= 1 && (
                <Text style={styles.warningText}>Flags: width ≥ 40ms (1 small box)</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Q wave depth as % of QRS height</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 30"
                keyboardType="number-pad"
                value={qWaves.depthPercent?.toString() || ''}
                onChangeText={(val) => updateDraft({ qWaves: { ...qWaves, depthPercent: parseInt(val) || undefined } })}
              />
              {qWaves.depthPercent !== undefined && qWaves.depthPercent >= 25 && (
                <Text style={styles.warningText}>Flags: depth ≥ 25% of QRS</Text>
              )}
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Which leads? (Select all that apply)</Text>
              <OptionSelect
                options={[
                  { label: 'I', value: 'I' }, { label: 'II', value: 'II' }, { label: 'III', value: 'III' },
                  { label: 'aVR', value: 'aVR' }, { label: 'aVL', value: 'aVL' }, { label: 'aVF', value: 'aVF' },
                  { label: 'V1', value: 'V1' }, { label: 'V2', value: 'V2' }, { label: 'V3', value: 'V3' },
                  { label: 'V4', value: 'V4' }, { label: 'V5', value: 'V5' }, { label: 'V6', value: 'V6' }
                ]}
                multiSelect
                selectedValues={qWaves.leads || []}
                onToggleSelect={handleToggleLead}
              />
            </View>
          </>
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
  warningText: { color: '#dc2626', fontSize: 14, marginTop: 4, fontWeight: '500' },
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
