import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEcgStore } from '../../store/ecgStore';
import { FlowButtons } from '../../components/FlowButtons';
import { useAuth } from '../../context/AuthContext';
import { saveReportDraft, completeReport } from '../../services/db';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app } from '../../services/firebase';

export default function Step12() {
  const router = useRouter();
  const { draft, updateDraft, reportId, setReportId, resetDraft } = useEcgStore();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'You must be logged in to submit.');
      return;
    }

    setLoading(true);
    try {
      // 1. Save draft one last time to ensure we have the ID and latest data
      const savedId = await saveReportDraft(user.uid, draft, reportId || undefined);
      if (!reportId) {
        setReportId(savedId);
      }

      // 2. Call Gemini API via Firebase Cloud Functions
      const functions = getFunctions(app);
      const generateInterpretation = httpsCallable(functions, 'generateECGInterpretation');
      
      const response = await generateInterpretation({
        reportData: draft
      });

      const aiData = (response.data as any).interpretation;

      // 3. Mark as complete in Firestore
      await completeReport(user.uid, savedId, aiData);

      // 4. Navigate to results
      resetDraft();
      router.replace(`/(ecg-flow)/results?id=${savedId}`);

    } catch (error: any) {
      console.error('Submission error:', error);
      Alert.alert(
        'Interpretation Failed', 
        'Could not generate AI interpretation at this time. Your data is saved as a draft. You can try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Step 12: Additional Notes</Text>
        <Text style={styles.subtitle}>Add any other observations or clinical context.</Text>
        
        <View style={styles.field}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            style={styles.textArea}
            placeholder="e.g. Patient experienced chest pain during the scan..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            value={draft.additionalNotes || ''}
            onChangeText={(val) => updateDraft({ additionalNotes: val })}
          />
        </View>

        {loading && (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#2563eb" />
            <Text style={styles.loadingText}>Generating AI Interpretation...</Text>
          </View>
        )}

      </ScrollView>
      <View style={styles.footer}>
        <FlowButtons 
          onNext={handleSubmit} 
          nextLabel={loading ? 'Submitting...' : 'Generate AI Interpretation'} 
          isLast={true} 
          isValid={!loading} 
        />
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
  textArea: { 
    borderWidth: 1, 
    borderColor: '#cbd5e1', 
    borderRadius: 8, 
    padding: 16, 
    fontSize: 16, 
    backgroundColor: '#f8fafc',
    minHeight: 120 
  },
  loadingBox: {
    padding: 32,
    alignItems: 'center',
    marginTop: 20
  },
  loadingText: {
    marginTop: 16,
    color: '#2563eb',
    fontSize: 16,
    fontWeight: '500'
  },
  footer: { paddingHorizontal: 24, borderTopWidth: 1, borderColor: '#e2e8f0', backgroundColor: '#fff' }
});
