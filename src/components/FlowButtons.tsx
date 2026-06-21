import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Palette, Radius } from '@/constants/design';

interface FlowButtonsProps {
  onNext: () => void;
  nextLabel?: string;
  isLast?: boolean;
  isValid?: boolean;
}

export function FlowButtons({ onNext, nextLabel = 'Next', isLast = false, isValid = true }: FlowButtonsProps) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={18} color={Palette.primary} />
        <Text style={styles.backText}>Back</Text>
      </Pressable>

      <Pressable style={[styles.nextButton, !isValid && styles.disabledButton]} onPress={onNext} disabled={!isValid}>
        <Text style={styles.nextText}>{nextLabel}</Text>
        {!isLast && <Ionicons name="arrow-forward" size={18} color={Palette.paper} />}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginTop: 'auto',
    paddingVertical: 24,
  },
  backButton: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.lineStrong,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  backText: {
    color: Palette.primary,
    fontWeight: '800',
  },
  nextButton: {
    alignItems: 'center',
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 13,
  },
  disabledButton: {
    backgroundColor: Palette.subtle,
  },
  nextText: {
    color: Palette.paper,
    fontSize: 16,
    fontWeight: '800',
  },
});
