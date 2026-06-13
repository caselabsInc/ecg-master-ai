import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getUserReports, EcgReport } from '../../services/db';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const { userData, user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<EcgReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      if (user) {
        try {
          const data = await getUserReports(user.uid);
          setReports(data);
        } catch (error) {
          console.error('Error fetching reports:', error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchReports();
  }, [user]);

  const renderReportItem = ({ item }: { item: EcgReport }) => (
    <TouchableOpacity 
      style={styles.reportCard}
      onPress={() => router.push(`/(ecg-flow)/results?id=${item.id}`)}
    >
      <View style={styles.reportHeader}>
        <Text style={styles.reportDate}>
          {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString() : 'Draft'}
        </Text>
        <View style={[styles.statusBadge, item.status === 'completed' ? styles.statusCompleted : styles.statusDraft]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
      </View>
      <Text style={styles.reportContext}>
        Age: {item.context?.age || 'N/A'} • Indication: {item.context?.indication || 'None'}
      </Text>
      {item.status === 'completed' && item.aiInterpretation?.summary && (
        <Text style={styles.reportSummary} numberOfLines={2}>
          {item.aiInterpretation.summary}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hello, {userData?.displayName || 'Clinician'}</Text>
        <Text style={styles.subtitle}>Ready to read some ECGs?</Text>
      </View>

      <TouchableOpacity 
        style={styles.newReadingCard}
        onPress={() => router.push('/(ecg-flow)/pre-step')}
      >
        <View style={styles.iconContainer}>
          <Ionicons name="pulse" size={32} color="#fff" />
        </View>
        <View style={styles.newReadingTextContainer}>
          <Text style={styles.newReadingTitle}>New ECG Reading</Text>
          <Text style={styles.newReadingSubtitle}>Start a step-by-step guided interpretation</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.reportsSection}>
        <View style={styles.reportsHeader}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          <TouchableOpacity onPress={() => router.push('/(tabs)/reports')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 32 }} />
        ) : reports.length > 0 ? (
          <FlatList
            data={reports.slice(0, 3)}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id!}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
            <Text style={styles.emptyStateText}>No reports yet. Start a new reading above!</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 24,
    paddingTop: 32,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#64748b',
  },
  newReadingCard: {
    margin: 20,
    backgroundColor: '#2563eb',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  iconContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 12,
    borderRadius: 12,
  },
  newReadingTextContainer: {
    flex: 1,
    marginLeft: 16,
  },
  newReadingTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  newReadingSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  reportsSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  reportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0f172a',
  },
  seeAllText: {
    color: '#2563eb',
    fontSize: 14,
    fontWeight: '500',
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  reportHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reportDate: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusCompleted: {
    backgroundColor: '#dcfce7',
  },
  statusDraft: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  reportContext: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
  },
  reportSummary: {
    fontSize: 14,
    color: '#475569',
    fontStyle: 'italic',
  },
  emptyState: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    marginTop: 16,
    color: '#64748b',
    textAlign: 'center',
  }
});
