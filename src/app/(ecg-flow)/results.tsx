import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebase';
import { useAuth } from '../../context/AuthContext';
import { EcgReport } from '../../services/db';
import { Ionicons } from '@expo/vector-icons';

export default function Results() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const router = useRouter();
  const [report, setReport] = useState<EcgReport | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      if (user && id) {
        try {
          const docRef = doc(db, 'users', user.uid, 'reports', id as string);
          const snap = await getDoc(docRef);
          if (snap.exists()) {
            setReport(snap.data() as EcgReport);
          }
        } catch (error) {
          console.error('Error fetching report:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReport();
  }, [user, id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!report) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Report not found.</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.replace('/(tabs)')}>
          <Text style={styles.backButtonText}>Go Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const ai = report.aiInterpretation;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.replace('/(tabs)')}>
          <Ionicons name="arrow-back" size={24} color="#0f172a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>ECG Interpretation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Context Info */}
        <View style={styles.contextBox}>
          <Text style={styles.contextText}>
            Date: {report.createdAt?.toDate ? report.createdAt.toDate().toLocaleDateString() : 'N/A'}
          </Text>
          <Text style={styles.contextText}>
            Patient: {report.context?.age || '?'} yo {report.context?.gender || 'Unknown'}
          </Text>
          <Text style={styles.contextText}>
            Indication: {report.context?.indication || 'None'}
          </Text>
        </View>

        {ai ? (
          <>
            {/* Disclaimer */}
            <View style={styles.disclaimerBox}>
              <Ionicons name="warning" size={20} color="#b45309" />
              <Text style={styles.disclaimerText}>{ai.disclaimer}</Text>
            </View>

            {/* Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Summary</Text>
              <Text style={styles.bodyText}>{ai.summary}</Text>
            </View>

            {/* Possible Findings */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Possible Findings</Text>
              <Text style={styles.bodyText}>{ai.possibleFindings}</Text>
            </View>

            {/* Educational Notes */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Educational Notes</Text>
              <Text style={styles.bodyText}>{ai.educationalNotes}</Text>
            </View>
          </>
        ) : (
          <View style={styles.pendingBox}>
            <Text style={styles.pendingText}>
              This is a draft report or interpretation failed.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: '#dc2626', marginBottom: 16 },
  backButton: { padding: 12, backgroundColor: '#2563eb', borderRadius: 8 },
  backButtonText: { color: '#fff', fontWeight: 'bold' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    padding: 16, 
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9'
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  contextBox: { 
    backgroundColor: '#f8fafc', 
    padding: 16, 
    borderRadius: 8, 
    marginBottom: 20 
  },
  contextText: { fontSize: 14, color: '#475569', marginBottom: 4 },
  disclaimerBox: {
    flexDirection: 'row',
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    alignItems: 'flex-start'
  },
  disclaimerText: { flex: 1, marginLeft: 12, fontSize: 14, color: '#92400e', lineHeight: 20 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1e293b', marginBottom: 8 },
  bodyText: { fontSize: 16, color: '#334155', lineHeight: 24 },
  pendingBox: { padding: 24, backgroundColor: '#f1f5f9', borderRadius: 8, alignItems: 'center' },
  pendingText: { color: '#64748b' }
});
