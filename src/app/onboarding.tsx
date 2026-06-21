import React, { useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function Onboarding() {
  const pagerRef = useRef<PagerView>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false);
  const router = useRouter();
  const { user, refreshUserData } = useAuth();

  const handleNext = () => {
    if (currentPage < 2) {
      pagerRef.current?.setPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      pagerRef.current?.setPage(currentPage - 1);
    }
  };

  const handleSkip = () => {
    pagerRef.current?.setPage(2);
  };

  const handleGetStarted = async () => {
    if (user && disclaimerAccepted) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          isFirstLogin: false
        });
        await refreshUserData();
        router.replace('/(tabs)');
      } catch (err) {
        console.error("Error updating first login:", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      
      {/* Dynamic Header */}
      {currentPage < 2 ? (
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={handlePrevious} style={{ width: 40 }}>
            {currentPage > 0 && <Ionicons name="arrow-back" size={24} color="#034a9e" />}
          </TouchableOpacity>
          <Text style={styles.topHeaderTitle}>ECG-Master</Text>
          <TouchableOpacity onPress={handleSkip} style={{ width: 40, alignItems: 'flex-end' }}>
          <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.step3HeaderContainer}>
          <View style={styles.step3HeaderTop}>
            <Text style={styles.step3TitleLeft}>Step 3 of 3</Text>
            <Text style={styles.step3TitleRight}>Clinician review</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressSegment, { backgroundColor: '#4ade80' }]} />
            <View style={[styles.progressSegment, { backgroundColor: '#4ade80' }]} />
            <View style={[styles.progressSegment, { backgroundColor: '#034a9e' }]} />
          </View>
        </View>
      )}

      {currentPage < 2 && (
        <View style={styles.dashProgressContainer}>
          <View style={[styles.dash, currentPage >= 0 ? styles.dashActiveGreen : styles.dashInactive]} />
          <View style={[styles.dash, currentPage >= 1 ? styles.dashActiveBlue : styles.dashInactive]} />
          <View style={[styles.dash, currentPage >= 2 ? styles.dashActiveBlue : styles.dashInactive]} />
        </View>
      )}

      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageSelected={(e) => setCurrentPage(e.nativeEvent.position)}
        scrollEnabled={false} // Force using buttons
      >
        
        {/* Step 1: Welcome / How It Works */}
        <View key="1" style={styles.page}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.slideHeader}>
              <Text style={styles.slideTitle}>Welcome to ECG-Master</Text>
              <Text style={styles.slideSubtitle}>Clinician-only interpretation support for structured 12-lead ECG review.</Text>
            </View>
            
            <View style={styles.featureBox}>
              <View style={styles.featureIconBox}>
                <Ionicons name="git-network-outline" size={24} color="#034a9e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>12-step ECG workflow</Text>
                <Text style={styles.featureDesc}>Review the tracing from rate and rhythm through repolarization and ischemia patterns.</Text>
              </View>
            </View>

            <View style={styles.featureBox}>
              <View style={styles.featureIconBox}>
                <Ionicons name="hardware-chip-outline" size={24} color="#034a9e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.featureTitle}>Transparent interpretation support</Text>
                <Text style={styles.featureDesc}>Keep clinician observations, criteria-based findings, and AI-assisted interpretation text clearly separated.</Text>
              </View>
            </View>
            
          </ScrollView>
        </View>

        {/* Step 2: Understanding ECG Paper */}
        <View key="2" style={styles.page}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.slideHeader}>
              <Text style={styles.slideTitle}>Understand ECG paper</Text>
              <Text style={styles.slideSubtitle}>Use standard paper speed and calibration to support reliable measurements.</Text>
            </View>

            <View style={styles.imageCard}>
              {/* Fallback to custom vector shapes representing the graph */}
              <View style={styles.graphMockup}>
                <View style={styles.graphSmallBox} />
                <View style={[styles.pillDark, { top: -10, left: -20 }]}>
                  <Text style={styles.pillDarkText}>1 small box</Text>
                </View>
                <Text style={styles.mockupText04}>0.04s</Text>
                <Text style={styles.mockupTextmm}>1mm²</Text>

                <View style={[styles.pillDark, { bottom: -10, right: -40 }]}>
                  <Text style={styles.pillDarkText}>1 large box</Text>
                </View>
                <Text style={styles.mockupText02}>0.2s</Text>
                <Text style={styles.mockupText5x5}>5 x 5 small boxes</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Ionicons name="time-outline" size={20} color="#034a9e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Time axis</Text>
                <Text style={styles.infoDesc}>At 25 mm/s, horizontal distance represents duration.</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoIconBox}>
                <Ionicons name="barcode-outline" size={20} color="#034a9e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.infoTitle}>Voltage axis</Text>
                <Text style={styles.infoDesc}>At standard calibration, 10 mm represents 1 mV.</Text>
              </View>
            </View>

            <View style={styles.ruleCard}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#15803d" />
              <Text style={styles.ruleText}>5 small boxes = 1 large box = 0.2 seconds</Text>
            </View>
          </ScrollView>
        </View>

        {/* Step 3: Final Validation */}
        <View key="3" style={styles.pageStep3}>
          <ScrollView contentContainerStyle={styles.scrollContentStep3} showsVerticalScrollIndicator={false}>
            <View style={styles.disclaimerCard}>
              <View style={styles.disclaimerHeader}>
                <View style={styles.alertIconBox}>
                  <Ionicons name="warning-outline" size={24} color="#b91c1c" />
                </View>
                <Text style={styles.disclaimerMainTitle}>Clinician-only use</Text>
              </View>
              
              <Text style={styles.disclaimerIntro}>
                Please review these use limits before proceeding. ECG-Master supports trained health care professionals during structured ECG review.
              </Text>
              
              <View style={styles.separator} />

              <View style={styles.termBlock}>
                <Text style={styles.termTitle}>1. Clinician-only interpretation support</Text>
                <Text style={styles.termDesc}>
                  ECG-Master is intended for licensed or supervised health care professionals using their own ECG observations. It supports teaching, documentation, and independent review.
                </Text>
              </View>

              <View style={styles.termBlock}>
                <Text style={styles.termTitle}>2. Not an autonomous diagnostic tool</Text>
                <Text style={styles.termDesc}>
                  The app does not replace clinical judgment, emergency assessment, ECG machine interpretation, cardiology review, diagnosis, or treatment decisions.
                </Text>
              </View>

              <View style={styles.termBlock}>
                <Text style={styles.termTitle}>3. Review the basis</Text>
                <Text style={styles.termDesc}>
                  Results show clinician observations, criteria-based findings, AI-assisted interpretation text, missing data, and the review basis so the clinician can independently verify the output.
                </Text>
              </View>

              {/* Faded out effect in real design, here we just show lighter text */}

              <TouchableOpacity
                style={[styles.checkboxCard, disclaimerAccepted && styles.checkboxCardActive]}
                onPress={() => setDisclaimerAccepted(!disclaimerAccepted)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, disclaimerAccepted && styles.checkboxChecked]}>
                  {disclaimerAccepted && <Ionicons name="checkmark" size={16} color="#034a9e" />}
                </View>
                <Text style={styles.checkboxText}>
                  <Text style={{ fontWeight: 'bold', color: '#0f172a' }}>I understand and agree </Text>
                  that this clinician-only tool provides interpretation support and does not make autonomous diagnoses or treatment decisions.
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.getStartedBtn, !disclaimerAccepted && styles.getStartedBtnDisabled]}
                onPress={handleGetStarted}
                disabled={!disclaimerAccepted}
              >
                <Text style={[styles.getStartedBtnText, !disclaimerAccepted && { color: '#f8fafc' }]}>Get started</Text>
                <Ionicons name="arrow-forward" size={18} color={disclaimerAccepted ? "#fff" : "#f8fafc"} style={{ marginLeft: 8 }} />
              </TouchableOpacity>

              <TouchableOpacity style={styles.backOverviewBtn} onPress={handlePrevious}>
                <Text style={styles.backOverviewText}>Back to overview</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.badgesRow}>
              <View style={styles.badge}>
                <Ionicons name="shield-checkmark-outline" size={16} color="#94a3b8" />
                <Text style={styles.badgeText}>Encrypted{'\n'}storage</Text>
              </View>
              <View style={styles.badge}>
                <Ionicons name="school-outline" size={16} color="#94a3b8" />
                <Text style={styles.badgeText}>Clinical{'\n'}education</Text>
              </View>
            </View>

          </ScrollView>
        </View>

      </PagerView>

      {/* Footer Navigation for Steps 1 & 2 */}
      {currentPage < 2 && (
        <View style={styles.footerNav}>
          <View style={styles.dotsContainer}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={[styles.dot, currentPage === i && styles.dotActive]} />
            ))}
          </View>
          <View style={styles.footerButtonsRow}>
            <TouchableOpacity style={styles.prevBtn} onPress={handlePrevious}>
              <Text style={styles.prevBtnText}>Previous</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
              <Text style={styles.nextBtnText}>Next</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },
  
  // Headers
  topHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  topHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#034a9e' },
  skipText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  
  step3HeaderContainer: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 16 },
  step3HeaderTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  step3TitleLeft: { fontSize: 12, fontWeight: 'bold', color: '#034a9e', letterSpacing: 1 },
  step3TitleRight: { fontSize: 12, fontWeight: 'bold', color: '#475569', letterSpacing: 1 },
  progressBarContainer: { flexDirection: 'row', gap: 4, height: 4 },
  progressSegment: { flex: 1, borderRadius: 2 },

  dashProgressContainer: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 12 },
  dash: { height: 3, width: 32, borderRadius: 2 },
  dashActiveGreen: { backgroundColor: '#15803d' },
  dashActiveBlue: { backgroundColor: '#034a9e' },
  dashInactive: { backgroundColor: '#dbeafe' },

  pagerView: { flex: 1 },
  page: { flex: 1, paddingHorizontal: 16 },
  pageStep3: { flex: 1, paddingHorizontal: 16, backgroundColor: '#f8fafc' },
  
  scrollContent: { paddingVertical: 16, paddingBottom: 40 },
  scrollContentStep3: { paddingVertical: 8, paddingBottom: 40 },

  slideHeader: { alignItems: 'center', marginBottom: 32, paddingHorizontal: 12 },
  slideTitle: { fontSize: 28, fontWeight: 'bold', color: '#034a9e', textAlign: 'center', marginBottom: 12 },
  slideSubtitle: { fontSize: 15, color: '#475569', textAlign: 'center', lineHeight: 22 },

  // Step 1 features
  featureBox: { flexDirection: 'row', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e2e8f0' },
  featureIconBox: { width: 48, height: 48, backgroundColor: '#f0f5ff', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  featureTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  featureDesc: { fontSize: 14, color: '#64748b', lineHeight: 20 },

  // Step 2 content
  imageCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', padding: 16, height: 200, marginBottom: 16, justifyContent: 'center', alignItems: 'center', overflow: 'hidden' },
  graphMockup: { width: 140, height: 140, borderWidth: 1, borderColor: '#034a9e', position: 'relative' },
  graphSmallBox: { width: 28, height: 28, borderWidth: 1, borderColor: '#93c5fd', position: 'absolute', top: 0, left: 0 },
  pillDark: { backgroundColor: '#034a9e', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 12, position: 'absolute', zIndex: 10 },
  pillDarkText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  mockupText04: { position: 'absolute', top: 20, left: -25, fontSize: 14, fontWeight: 'bold', color: '#034a9e' },
  mockupTextmm: { position: 'absolute', top: 38, left: -25, fontSize: 10, color: '#64748b' },
  mockupText02: { position: 'absolute', bottom: 10, right: -25, fontSize: 14, fontWeight: 'bold', color: '#034a9e' },
  mockupText5x5: { position: 'absolute', bottom: -5, right: -35, fontSize: 10, color: '#64748b' },

  infoCard: { flexDirection: 'row', backgroundColor: '#f0f5ff', padding: 16, borderRadius: 12, marginBottom: 16, borderWidth: 1, borderColor: '#e0e7ff', alignItems: 'center' },
  infoIconBox: { width: 40, height: 40, backgroundColor: '#dbeafe', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#0f172a', marginBottom: 4 },
  infoDesc: { fontSize: 13, color: '#cbd5e1' }, // Overridden slightly inline to look faded, wait let's fix it
  ruleCard: { flexDirection: 'row', backgroundColor: '#dcfce7', padding: 16, borderRadius: 12, borderWidth: 1, borderColor: '#bbf7d0', alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  ruleText: { fontSize: 12, fontWeight: 'bold', color: '#14532d', marginLeft: 8 },

  // Step 3 Content
  disclaimerCard: { backgroundColor: '#fff', borderRadius: 12, borderWidth: 1, borderColor: '#cbd5e1', padding: 24, marginBottom: 24, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 3 },
  disclaimerHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  alertIconBox: { width: 40, height: 40, backgroundColor: '#fee2e2', borderRadius: 8, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  disclaimerMainTitle: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  disclaimerIntro: { fontSize: 15, color: '#334155', lineHeight: 22 },
  separator: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 20 },
  
  termBlock: { marginBottom: 20 },
  termTitle: { fontSize: 13, fontWeight: 'bold', color: '#0f172a', marginBottom: 8 },
  termDesc: { fontSize: 14, color: '#475569', lineHeight: 22 },

  checkboxCard: { flexDirection: 'row', backgroundColor: '#f0f5ff', padding: 16, borderRadius: 8, marginBottom: 24, alignItems: 'flex-start' },
  checkboxCardActive: { backgroundColor: '#e0eaff', borderWidth: 1, borderColor: '#bfdbfe' },
  checkbox: { width: 22, height: 22, borderWidth: 1, borderColor: '#94a3b8', borderRadius: 4, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', marginTop: 2, marginRight: 12 },
  checkboxChecked: { borderColor: '#034a9e' },
  checkboxText: { flex: 1, fontSize: 13, color: '#334155', lineHeight: 20 },

  getStartedBtn: { backgroundColor: '#034a9e', paddingVertical: 16, borderRadius: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  getStartedBtnDisabled: { backgroundColor: '#94a3b8' },
  getStartedBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold', letterSpacing: 0.5 },
  backOverviewBtn: { paddingVertical: 12, alignItems: 'center' },
  backOverviewText: { color: '#034a9e', fontSize: 13, fontWeight: 'bold', letterSpacing: 0.5 },

  badgesRow: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 20 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  badgeText: { fontSize: 10, color: '#94a3b8', fontWeight: 'bold', letterSpacing: 0.5 },

  // Footer
  footerNav: { paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#f8fafc', borderTopWidth: 1, borderTopColor: '#f1f5f9' },
  dotsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 16, gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#cbd5e1' },
  dotActive: { backgroundColor: '#034a9e', width: 24 },
  footerButtonsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 12 },
  prevBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, borderWidth: 1, borderColor: '#034a9e', alignItems: 'center' },
  prevBtnText: { color: '#034a9e', fontSize: 14, fontWeight: 'bold' },
  nextBtn: { flex: 1, paddingVertical: 14, borderRadius: 8, backgroundColor: '#034a9e', alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  nextBtnText: { color: '#fff', fontSize: 14, fontWeight: 'bold' }
});
