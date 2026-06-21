import React, { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/context/AuthContext';
import { EcgReport, getUserReports } from '@/services/db';
import { Layout, Palette, Radius } from '@/constants/design';
import { ReportCard } from '@/components/report-card';
import { EcgReferenceView } from '@/components/ecg-reference-view';

export default function Home() {
  const { userData, user } = useAuth();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [reports, setReports] = useState<EcgReport[]>([]);
  const [loading, setLoading] = useState(true);

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

  const completedCount = useMemo(() => reports.filter((report) => report.status === 'completed').length, [reports]);
  const inProgressCount = reports.length - completedCount;

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={[
        styles.content,
        {
          paddingTop: insets.top + 12,
          paddingBottom: Math.max(36, insets.bottom + 24),
        },
      ]}
      data={reports.slice(0, 3)}
      keyExtractor={(item) => item.id!}
      renderItem={({ item }) => (
        <ReportCard report={item} onPress={() => router.push(`/(ecg-flow)/results?id=${item.id}`)} />
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={
        <View style={styles.headerContent}>
          <View style={styles.hero}>
            <View style={styles.heroTopRow}>
              <Text style={styles.kicker}>ECG-Master</Text>
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>Ready</Text>
              </View>
            </View>
            <Text style={styles.greeting}>Good to see you, {userData?.displayName || 'Clinician'}</Text>

            <View style={styles.tracePanel}>
              <View style={styles.traceGrid}>
                <EcgReferenceView variant="heart-rate" />
              </View>
              <Text style={styles.traceCaption}>Guided 12-step interpretation</Text>
            </View>

            <Pressable style={styles.primaryAction} onPress={() => router.push('/(ecg-flow)/pre-step')}>
              <View style={styles.primaryIcon}>
                <Ionicons name="add" size={22} color={Palette.primary} />
              </View>
              <View style={styles.primaryCopy}>
                <Text style={styles.primaryTitle}>Start new ECG</Text>
                <Text style={styles.primarySubtitle}>Document context, measurements, and interpretation support.</Text>
              </View>
              <Ionicons name="arrow-forward" size={20} color={Palette.paper} />
            </Pressable>
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue} selectable>
                {reports.length}
              </Text>
              <Text style={styles.statLabel}>Reports</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue} selectable>
                {completedCount}
              </Text>
              <Text style={styles.statLabel}>Reviewed</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue} selectable>
                {inProgressCount}
              </Text>
              <Text style={styles.statLabel}>In progress</Text>
            </View>
          </View>

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent reports</Text>
            <Pressable style={styles.textButton} onPress={() => router.push('/(tabs)/reports')}>
              <Text style={styles.textButtonLabel}>View all</Text>
              <Ionicons name="arrow-forward" size={14} color={Palette.primary} />
            </Pressable>
          </View>
        </View>
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator color={Palette.primary} style={styles.loader} />
        ) : (
          <View style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={28} color={Palette.primaryMuted} />
            <Text style={styles.emptyTitle}>No reports yet</Text>
            <Text style={styles.emptyText}>Completed ECG reviews and works in progress will appear here.</Text>
          </View>
        )
      }
    />
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.canvas,
    flex: 1,
  },
  content: {
    gap: 0,
    padding: Layout.pagePadding,
    paddingBottom: 36,
  },
  headerContent: {
    gap: 18,
  },
  hero: {
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    boxShadow: Palette.shadow,
    gap: 18,
    overflow: 'hidden',
    padding: 20,
  },
  heroTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  kicker: {
    color: '#b9d8d4',
    flex: 1,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  greeting: {
    color: Palette.paper,
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 33,
    maxWidth: 360,
  },
  liveBadge: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.12)',
    borderColor: 'rgba(255, 253, 248, 0.18)',
    borderRadius: 999,
    borderWidth: 1,
    flexShrink: 0,
    flexDirection: 'row',
    gap: 7,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  liveDot: {
    backgroundColor: '#9be3c7',
    borderRadius: 999,
    height: 7,
    width: 7,
  },
  liveText: {
    color: Palette.paper,
    fontSize: 12,
    fontWeight: '700',
  },
  tracePanel: {
    backgroundColor: 'rgba(255, 253, 248, 0.1)',
    borderColor: 'rgba(255, 253, 248, 0.16)',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 14,
  },
  traceGrid: {
    backgroundColor: '#f7e8df',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 148,
    overflow: 'hidden',
  },
  traceCaption: {
    color: '#d7ebe8',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryAction: {
    alignItems: 'center',
    backgroundColor: Palette.accent,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 12,
    padding: 14,
  },
  primaryIcon: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderRadius: 999,
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  primaryCopy: {
    flex: 1,
    gap: 2,
  },
  primaryTitle: {
    color: Palette.paper,
    fontSize: 16,
    fontWeight: '800',
  },
  primarySubtitle: {
    color: '#f9dad6',
    fontSize: 12,
    lineHeight: 16,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flex: 1,
    gap: 3,
    padding: 14,
  },
  statValue: {
    color: Palette.ink,
    fontSize: 22,
    fontVariant: ['tabular-nums'],
    fontWeight: '800',
  },
  statLabel: {
    color: Palette.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  sectionTitle: {
    color: Palette.ink,
    fontSize: 19,
    fontWeight: '800',
  },
  textButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 5,
    padding: 8,
  },
  textButtonLabel: {
    color: Palette.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  separator: {
    height: 12,
  },
  loader: {
    padding: 32,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 8,
    padding: 28,
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
