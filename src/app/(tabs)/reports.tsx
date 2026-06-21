import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { EcgReport, getUserReports } from '@/services/db';
import { ReportCard } from '@/components/report-card';
import { Layout, Palette, Radius } from '@/constants/design';

export default function ReportsList() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<EcgReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'draft'>('all');

  useEffect(() => {
    const fetchReports = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const data = await getUserReports(user.uid);
        setReports(data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [user]);

  const visibleReports = useMemo(() => {
    if (filter === 'all') return reports;
    return reports.filter((report) => report.status === filter);
  }, [filter, reports]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Palette.primary} />
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={styles.content}
      data={visibleReports}
      renderItem={({ item }) => (
        <ReportCard report={item} onPress={() => router.push(`/(ecg-flow)/results?id=${item.id}`)} />
      )}
      keyExtractor={(item) => item.id!}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text style={styles.title}>Report archive</Text>
          <Text style={styles.subtitle}>Review completed ECG summaries and continue reports that are still in progress.</Text>

          <View style={styles.filterRow}>
            {(['all', 'completed', 'draft'] as const).map((item) => {
              const selected = filter === item;
              return (
                <Pressable
                  key={item}
                  style={[styles.filterButton, selected && styles.filterButtonActive]}
                  onPress={() => setFilter(item)}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextActive]}>
                    {item === 'all' ? 'All' : item === 'completed' ? 'Reviewed' : 'In progress'}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      }
      ListEmptyComponent={
        <View style={styles.emptyState}>
          <Ionicons name="file-tray-outline" size={30} color={Palette.primaryMuted} />
          <Text style={styles.emptyTitle}>Nothing here yet</Text>
          <Text style={styles.emptyText}>Reports matching this view will appear here.</Text>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.canvas,
    flex: 1,
  },
  centered: {
    alignItems: 'center',
    backgroundColor: Palette.canvas,
    flex: 1,
    justifyContent: 'center',
  },
  content: {
    padding: Layout.pagePadding,
    paddingBottom: 36,
  },
  header: {
    gap: 12,
    paddingBottom: 18,
  },
  title: {
    color: Palette.ink,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    color: Palette.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  filterRow: {
    backgroundColor: '#ebe7dc',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 4,
    padding: 4,
  },
  filterButton: {
    alignItems: 'center',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flex: 1,
    paddingVertical: 10,
  },
  filterButtonActive: {
    backgroundColor: Palette.paper,
    boxShadow: '0 4px 12px rgba(17, 24, 39, 0.07)',
  },
  filterText: {
    color: Palette.muted,
    fontSize: 13,
    fontWeight: '800',
  },
  filterTextActive: {
    color: Palette.primary,
  },
  separator: {
    height: 12,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 30,
  },
  emptyTitle: {
    color: Palette.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  emptyText: {
    color: Palette.muted,
    fontSize: 13,
    textAlign: 'center',
  },
});
