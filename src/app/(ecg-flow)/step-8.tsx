import React from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { OptionSelect } from '../../components/OptionSelect';
import { FlowButtons } from '../../components/FlowButtons';

export default function Step8() {
  const router = useRouter();
  const { draft, updateDraft } = useEcgStore();
  const stSegment = draft.stSegment || {};

  const handleNext = () => {
    router.push('/(ecg-flow)/step-9');
  };

  const handleToggleLead = (val: string) => {
    const currentLeads = stSegment.leads || [];
    let newLeads;
    if (currentLeads.includes(val)) {
      newLeads = currentLeads.filter(n => n !== val);
    } else {
      newLeads = [...currentLeads, val];
    }
    updateDraft({ stSegment: { ...stSegment, leads: newLeads } });
  };

  const isValid = !!stSegment.status;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 8: ST Segment</Text>
        <Text style={styles.subtitle}>Assess the ST segment for elevation or depression relative to the isoelectric line.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>ST Segment Status</Text>
          <OptionSelect
            options={[
              { label: 'Normal (Isoelectric)', value: 'normal' },
              { label: 'Elevated', value: 'elevated' },
              { label: 'Depressed', value: 'depressed' }
            ]}
            selectedValue={stSegment.status}
            onSelect={(val) => updateDraft({ stSegment: { ...stSegment, status: val as any } })}
          />
        </View>

        {(stSegment.status === 'elevated' || stSegment.status === 'depressed') && (
          <>
            <View style={styles.field}>
              <Text style={styles.label}>Amount (small boxes)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 2"
                keyboardType="decimal-pad"
                value={stSegment.smallBoxes?.toString() || ''}
                onChangeText={(val) => updateDraft({ stSegment: { ...stSegment, smallBoxes: parseFloat(val) || undefined } })}
              />
              {stSegment.smallBoxes !== undefined && (
                <Text style={styles.calcText}>
                  = {stSegment.smallBoxes} mm {stSegment.status}
                </Text>
              )}
            </View>

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
                selectedValues={stSegment.leads || []}
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
  calcText: { marginTop: 8, fontSize: 14, color: '#1d4ed8', fontWeight: '500' },
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
