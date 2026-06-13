import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { getUserReports, EcgReport } from '../../services/db';

export default function ReportsList() {
  const { user } = useAuth();
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
    // Add listener to refresh on focus if needed, or just fetch once
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

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={reports}
        renderItem={renderReportItem}
        keyExtractor={(item) => item.id!}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>No reports found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
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
  },
  emptyText: {
    color: '#64748b',
  }
});
