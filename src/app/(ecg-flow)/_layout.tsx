import React from 'react';
import { Stack, usePathname, useRouter } from 'expo-router';
import { ActivityIndicator, Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GlassView, isGlassEffectAPIAvailable } from 'expo-glass-effect';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEcgStore } from '../../store/ecgStore';
import { useAuth } from '@/context/AuthContext';
import { saveReportDraft } from '@/services/db';
import { Palette, Radius } from '@/constants/design';

export default function EcgFlowLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [saving, setSaving] = React.useState(false);
  const [closeSheetOpen, setCloseSheetOpen] = React.useState(false);
  const nativeGlassAvailable = React.useMemo(() => {
    try {
      return isGlassEffectAPIAvailable();
    } catch {
      return false;
    }
  }, []);
  const draft = useEcgStore((state) => state.draft);
  const reportId = useEcgStore((state) => state.reportId);
  const resetDraft = useEcgStore((state) => state.resetDraft);
  const shouldShowClose = !pathname.endsWith('/results') && !pathname.includes('/results?');

  const goDashboard = () => {
    router.replace('/(tabs)');
  };

  const saveAndClose = async () => {
    if (!user) {
      setCloseSheetOpen(false);
      Alert.alert('Sign-in required', 'Please sign in to save this ECG review.');
      return;
    }

    setSaving(true);
    try {
      await saveReportDraft(user.uid, draft, reportId || undefined);
      setCloseSheetOpen(false);
      resetDraft();
      goDashboard();
    } catch (error) {
      console.error('Could not save ECG draft before closing.', error);
      Alert.alert('Could not save review', 'Please check your connection and try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (saving) return;

    setCloseSheetOpen(true);
  };

  const discardAndClose = () => {
    setCloseSheetOpen(false);
    resetDraft();
    goDashboard();
  };

  const closeOptionsSheet = () => {
    if (saving) return;

    setCloseSheetOpen(false);
  };

  return (
    <View style={styles.container}>
      <Stack screenOptions={{
        headerShown: false,
        headerTintColor: '#2563eb',
      }}>
        <Stack.Screen name="pre-step" options={{ title: 'Patient Context' }} />
        <Stack.Screen name="step-1" options={{ title: 'Step 1: Heart Rate' }} />
        <Stack.Screen name="step-2" options={{ title: 'Step 2: P Wave' }} />
        <Stack.Screen name="step-3" options={{ title: 'Step 3: PR Interval' }} />
        <Stack.Screen name="step-4" options={{ title: 'Step 4: Rhythm' }} />
        <Stack.Screen name="step-5" options={{ title: 'Step 5: QRS Complex' }} />
        <Stack.Screen name="step-6" options={{ title: 'Step 6: Cardiac Axis' }} />
        <Stack.Screen name="step-7" options={{ headerShown: false }} />
        <Stack.Screen name="step-8" options={{ title: 'Step 8: ST Segment' }} />
        <Stack.Screen name="step-9" options={{ title: 'Step 9: T Waves' }} />
        <Stack.Screen name="step-10" options={{ title: 'Step 10: QT Interval' }} />
        <Stack.Screen name="step-11" options={{ title: 'Step 11: R Wave & U Waves' }} />
        <Stack.Screen name="step-12" options={{ title: 'Step 12: Notes' }} />
        <Stack.Screen name="results" options={{ title: 'Interpretation', headerRight: undefined, headerLeft: () => null, gestureEnabled: false }} />
      </Stack>

      {shouldShowClose ? (
        <Pressable
          accessibilityLabel="Close ECG review"
          disabled={saving}
          onPress={handleClose}
          style={[styles.closeButton, { top: Math.max(8, insets.top - 8) }, saving && styles.closeButtonDisabled]}
        >
          {nativeGlassAvailable ? (
            <GlassView
              colorScheme="light"
              glassEffectStyle="clear"
              isInteractive
              pointerEvents="none"
              style={styles.closeGlassLayer}
              tintColor="rgba(255, 253, 248, 0.08)"
            />
          ) : null}
          <View style={styles.closeButtonContent}>
            {saving ? (
              <ActivityIndicator size="small" color={Palette.primary} />
            ) : (
              <Ionicons name="close" size={18} color={Palette.primary} />
            )}
          </View>
        </Pressable>
      ) : null}

      <Modal animationType="slide" onRequestClose={closeOptionsSheet} transparent visible={closeSheetOpen}>
        <View style={styles.sheetBackdrop}>
          <Pressable
            accessibilityLabel="Keep editing ECG review"
            disabled={saving}
            onPress={closeOptionsSheet}
            style={StyleSheet.absoluteFill}
          />
          <View style={[styles.closeSheet, { paddingBottom: insets.bottom + 18 }]}>
            <View style={styles.sheetGrabber} />
            <View style={styles.sheetHeader}>
              <View style={styles.sheetHeaderIcon}>
                <Ionicons name="exit-outline" size={20} color={Palette.primary} />
              </View>
              <View style={styles.sheetHeaderCopy}>
                <Text style={styles.sheetTitle}>Close ECG review?</Text>
                <Text style={styles.sheetText}>
                  Save this review as an in-progress report, or discard it and return to the dashboard.
                </Text>
              </View>
            </View>

            <View style={styles.sheetActions}>
              <Pressable
                accessibilityLabel="Save ECG review and close"
                disabled={saving}
                onPress={saveAndClose}
                style={[styles.sheetActionPrimary, saving && styles.sheetActionDisabled]}
              >
                {saving ? (
                  <ActivityIndicator size="small" color={Palette.paper} />
                ) : (
                  <Ionicons name="save-outline" size={19} color={Palette.paper} />
                )}
                <Text style={styles.sheetActionPrimaryText}>{saving ? 'Saving review' : 'Save and close'}</Text>
              </Pressable>

              <Pressable
                accessibilityLabel="Discard ECG review"
                disabled={saving}
                onPress={discardAndClose}
                style={[styles.sheetActionSecondary, styles.sheetActionDanger, saving && styles.sheetActionDisabled]}
              >
                <Ionicons name="trash-outline" size={19} color={Palette.accent} />
                <Text style={styles.sheetActionDangerText}>Discard review</Text>
              </Pressable>

              <Pressable
                accessibilityLabel="Cancel close ECG review"
                disabled={saving}
                onPress={closeOptionsSheet}
                style={[styles.sheetActionSecondary, saving && styles.sheetActionDisabled]}
              >
                <Ionicons name="arrow-back-outline" size={19} color={Palette.primary} />
                <Text style={styles.sheetActionSecondaryText}>Keep editing</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.06)',
    borderColor: 'rgba(18, 60, 64, 0.16)',
    borderCurve: 'continuous',
    borderRadius: 999,
    borderWidth: 1,
    boxShadow: '0 8px 18px rgba(18, 60, 64, 0.09)',
    height: 38,
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'absolute',
    right: 18,
    width: 38,
    zIndex: 30,
  },
  closeGlassLayer: {
    borderRadius: 999,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  closeButtonContent: {
    alignItems: 'center',
    height: 38,
    justifyContent: 'center',
    width: 38,
  },
  closeButtonDisabled: {
    backgroundColor: 'rgba(255, 253, 248, 0.14)',
  },
  sheetBackdrop: {
    backgroundColor: 'rgba(17, 24, 39, 0.42)',
    flex: 1,
    justifyContent: 'flex-end',
  },
  closeSheet: {
    backgroundColor: Palette.paper,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    boxShadow: '0 -18px 42px rgba(18, 60, 64, 0.16)',
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  sheetGrabber: {
    alignSelf: 'center',
    backgroundColor: Palette.lineStrong,
    borderRadius: 999,
    height: 5,
    marginBottom: 16,
    width: 44,
  },
  sheetHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 18,
  },
  sheetHeaderIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderRadius: Radius.md,
    height: 44,
    justifyContent: 'center',
    width: 44,
  },
  sheetHeaderCopy: {
    flex: 1,
    gap: 5,
  },
  sheetTitle: {
    color: Palette.ink,
    fontSize: 22,
    fontWeight: '900',
    lineHeight: 27,
  },
  sheetText: {
    color: Palette.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  sheetActions: {
    gap: 10,
  },
  sheetActionPrimary: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderRadius: Radius.lg,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 54,
    paddingHorizontal: 16,
  },
  sheetActionPrimaryText: {
    color: Palette.paper,
    fontSize: 16,
    fontWeight: '900',
  },
  sheetActionSecondary: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 9,
    justifyContent: 'center',
    minHeight: 52,
    paddingHorizontal: 16,
  },
  sheetActionDanger: {
    backgroundColor: Palette.accentSoft,
    borderColor: '#edc4bf',
  },
  sheetActionSecondaryText: {
    color: Palette.primary,
    fontSize: 15,
    fontWeight: '900',
  },
  sheetActionDangerText: {
    color: Palette.accent,
    fontSize: 15,
    fontWeight: '900',
  },
  sheetActionDisabled: {
    opacity: 0.68,
  },
});
