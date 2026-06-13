import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

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
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={20} color="#64748b" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={[styles.nextButton, !isValid && styles.disabledButton]}
        onPress={onNext}
        disabled={!isValid}
      >
        <Text style={styles.nextText}>{nextLabel}</Text>
        {!isLast && <Ionicons name="arrow-forward" size={20} color="#fff" />}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 24,
    marginTop: 'auto',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f1f5f9',
  },
  backText: {
    color: '#64748b',
    marginLeft: 8,
    fontWeight: '600',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    backgroundColor: '#2563eb',
  },
  disabledButton: {
    backgroundColor: '#94a3b8',
  },
  nextText: {
    color: '#fff',
    marginRight: 8,
    fontWeight: '600',
    fontSize: 16,
  }
});
