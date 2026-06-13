import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    key: '1',
    title: 'Welcome to ECG-MasterAi',
    description: 'Your step-by-step assistant for reading and understanding 12-lead ECGs.',
    icon: 'heart-outline' as const,
  },
  {
    key: '2',
    title: 'How It Works',
    description: 'We will guide you through a 12-step structured workflow. Just count the boxes and enter the measurements!',
    icon: 'list-outline' as const,
  },
  {
    key: '3',
    title: 'Understanding Boxes',
    description: 'At standard speed (25 mm/s):\n1 Small Box = 0.04s (40ms)\n1 Large Box = 0.20s (200ms)',
    icon: 'grid-outline' as const,
  },
  {
    key: '4',
    title: 'Disclaimer',
    description: 'This is an educational tool. It is NOT a substitute for clinical judgment and should not be used for diagnosis on real patients without independent verification.',
    icon: 'warning-outline' as const,
  }
];

export default function Onboarding() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const router = useRouter();
  const { user, refreshUserData } = useAuth();

  const handleNext = () => {
    if (currentPage < ONBOARDING_SLIDES.length - 1) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handleGetStarted = async () => {
    if (user) {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        isFirstLogin: false
      });
      // Update local context
      await refreshUserData();
      router.replace('/(tabs)');
    }
  };

  return (
    <View style={styles.container}>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {ONBOARDING_SLIDES.map((slide, index) => (
          <View key={slide.key} style={styles.page}>
            <Ionicons name={slide.icon} size={100} color="#2563eb" style={styles.icon} />
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.description}>{slide.description}</Text>
            
            {index === ONBOARDING_SLIDES.length - 1 && (
              <TouchableOpacity 
                style={styles.checkboxContainer}
                onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
              >
                <Ionicons 
                  name={disclaimerAccepted ? 'checkbox' : 'square-outline'} 
                  size={24} 
                  color="#2563eb" 
                />
                <Text style={styles.checkboxLabel}>I acknowledge and agree</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </PagerView>

      <View style={styles.footer}>
        <View style={styles.dotsContainer}>
          {ONBOARDING_SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentPage === index && styles.activeDot
              ]}
            />
          ))}
        </View>

        {currentPage === ONBOARDING_SLIDES.length - 1 ? (
          <TouchableOpacity 
            style={[styles.button, !disclaimerAccepted && styles.buttonDisabled]} 
            onPress={handleGetStarted}
            disabled={!disclaimerAccepted}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>Next</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pagerView: {
    flex: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  icon: {
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    color: '#0f172a',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#64748b',
    lineHeight: 24,
  },
  footer: {
    padding: 32,
    paddingBottom: 64,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#cbd5e1',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: '#2563eb',
    width: 24,
  },
  button: {
    backgroundColor: '#2563eb',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#94a3b8',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    padding: 16,
    backgroundColor: '#f8fafc',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  checkboxLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#334155',
    fontWeight: '500',
  }
});
