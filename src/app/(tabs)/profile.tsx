import React from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { getFunctions, httpsCallable } from 'firebase/functions';
import { app, auth } from '@/services/firebase';
import { useAuth } from '@/context/AuthContext';
import { Layout, Palette, Radius } from '@/constants/design';

export default function Profile() {
  const { user, userData } = useAuth();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = React.useState(false);
  const initials = (userData?.displayName || userData?.email || 'U')
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const handleSignOut = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: () => signOut(auth),
      },
    ]);
  };

  const handleDeleteAccount = () => {
    if (!user) {
      Alert.alert('Sign-in required', 'Please sign in again before deleting your account.');
      return;
    }

    Alert.alert(
      'Delete account?',
      'This permanently deletes your account and saved ECG reports. This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Confirm deletion',
              'Your account, profile, and saved report archive will be removed.',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Delete account',
                  style: 'destructive',
                  onPress: async () => {
                    setIsDeleting(true);
                    try {
                      const functions = getFunctions(app);
                      const deleteAccount = httpsCallable(functions, 'deleteAccount');
                      await deleteAccount();
                      await signOut(auth).catch(() => {});
                    } catch (error: any) {
                      console.error('Account deletion failed:', error);
                      Alert.alert(
                        'Account could not be deleted',
                        error?.message || 'Please try again or contact support.'
                      );
                    } finally {
                      setIsDeleting(false);
                    }
                  },
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profilePanel}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.name}>{userData?.displayName || 'User'}</Text>
          <Text style={styles.email} selectable>
            {userData?.email}
          </Text>
        </View>

        <View style={styles.infoPanel}>
          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="school-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Clinician-only interpretation support</Text>
              <Text style={styles.infoText}>Criteria-based findings and AI-assisted text require independent clinician review.</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <Pressable style={styles.infoRow} onPress={() => router.push('/support')}>
            <View style={styles.infoIcon}>
              <Ionicons name="help-buoy-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Support</Text>
              <Text style={styles.infoText}>Open help topics or create a support ticket for account, privacy, or testing help.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.subtle} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.infoRow} onPress={() => router.push('/privacy')}>
            <View style={styles.infoIcon}>
              <Ionicons name="lock-closed-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Privacy policy</Text>
              <Text style={styles.infoText}>Review how ECG report data is collected, stored, and protected.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.subtle} />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.infoRow} onPress={() => router.push('/terms')}>
            <View style={styles.infoIcon}>
              <Ionicons name="document-text-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Terms of use</Text>
              <Text style={styles.infoText}>Review intended use, limitations, and clinician responsibility.</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Palette.subtle} />
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIcon}>
              <Ionicons name="shield-checkmark-outline" size={18} color={Palette.primary} />
            </View>
            <View style={styles.infoCopy}>
              <Text style={styles.infoTitle}>Version</Text>
              <Text style={styles.infoText}>ECG-Master v1.0.0</Text>
            </View>
          </View>
        </View>

        <Pressable style={styles.signOutButton} onPress={handleSignOut}>
          <Ionicons name="log-out-outline" size={20} color={Palette.accent} />
          <Text style={styles.signOutText}>Sign out</Text>
        </Pressable>

        <Pressable style={[styles.deleteButton, isDeleting && styles.disabledButton]} onPress={handleDeleteAccount} disabled={isDeleting}>
          {isDeleting ? (
            <ActivityIndicator size="small" color={Palette.accent} />
          ) : (
            <Ionicons name="trash-outline" size={20} color={Palette.accent} />
          )}
          <Text style={styles.deleteText}>{isDeleting ? 'Deleting account...' : 'Delete account'}</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.canvas,
    flex: 1,
  },
  content: {
    gap: 18,
    padding: Layout.pagePadding,
    paddingBottom: 132,
  },
  profilePanel: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    boxShadow: Palette.shadow,
    gap: 8,
    padding: 26,
  },
  avatar: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderCurve: 'continuous',
    borderRadius: 28,
    height: 72,
    justifyContent: 'center',
    marginBottom: 8,
    width: 72,
  },
  avatarText: {
    color: Palette.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  name: {
    color: Palette.paper,
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
  },
  email: {
    color: '#cfe6e2',
    fontSize: 14,
    textAlign: 'center',
  },
  infoPanel: {
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
  },
  infoIcon: {
    alignItems: 'center',
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  infoCopy: {
    flex: 1,
    gap: 2,
  },
  infoTitle: {
    color: Palette.ink,
    fontSize: 15,
    fontWeight: '800',
  },
  infoText: {
    color: Palette.muted,
    fontSize: 13,
    lineHeight: 19,
  },
  divider: {
    backgroundColor: Palette.line,
    height: 1,
    marginVertical: 16,
  },
  signOutButton: {
    alignItems: 'center',
    backgroundColor: Palette.accentSoft,
    borderColor: '#efc3bd',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    padding: 15,
  },
  signOutText: {
    color: Palette.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  deleteButton: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: '#efc3bd',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'center',
    padding: 15,
  },
  deleteText: {
    color: Palette.accent,
    fontSize: 15,
    fontWeight: '800',
  },
  disabledButton: {
    opacity: 0.65,
  },
});
