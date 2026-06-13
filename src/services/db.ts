import { collection, addDoc, serverTimestamp, getDocs, query, orderBy, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';

// Interfaces for our Data Model
export interface EcgReport {
  id?: string;
  createdAt: any;
  status: 'draft' | 'completed';
  context: {
    age?: number;
    dob?: string | null;
    gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
    indication?: string;
    ecgDateTime?: any;
    paperSpeedStandard?: boolean;
    calibrationStandard?: boolean;
    calibrationNote?: string | null;
  };
  heartRate: {
    regularity?: 'regular' | 'irregular';
    largeBoxesBetweenR?: number | null;
    qrsCountIn10Sec?: number | null;
    calculatedBpm?: number;
  };
  rhythm: {
    rrIntervals?: 'constant' | 'not_constant';
    pBeforeQrs?: 'yes' | 'no' | 'unclear';
  };
  pWave: {
    morphology?: 'normal' | 'abnormal';
    durationSmallBoxes?: number;
    amplitudeSmallBoxes?: number;
  };
  prInterval: {
    smallBoxes?: number;
    calculatedMs?: number;
  };
  qrsComplex: {
    durationSmallBoxes?: number;
    calculatedMs?: number;
    notes?: string[];
  };
  axis: {
    leadI?: 'positive' | 'negative' | 'equiphasic';
    leadAVF?: 'positive' | 'negative' | 'equiphasic';
    interpretedAxis?: string;
  };
  qWaves: {
    present?: boolean;
    widthSmallBoxes?: number | null;
    depthPercent?: number | null;
    leads?: string[] | null;
  };
  stSegment: {
    status?: 'normal' | 'elevated' | 'depressed';
    smallBoxes?: number | null;
    leads?: string[] | null;
  };
  tWaves: {
    status?: 'normal' | 'inverted' | 'tall_peaked';
    leads?: string[] | null;
  };
  qtInterval: {
    smallBoxes?: number;
    calculatedQtMs?: number;
    calculatedQtcMs?: number;
  };
  rWaveProgression?: 'normal' | 'abnormal' | 'not_assessed';
  uWaves: {
    present?: boolean | 'not_assessed';
    note?: string | null;
  };
  additionalNotes?: string;
  aiInterpretation?: {
    summary: string;
    possibleFindings: string;
    educationalNotes: string;
    disclaimer: string;
    rawResponse?: string;
  };
}

export const saveReportDraft = async (userId: string, report: Partial<EcgReport>, reportId?: string) => {
  const reportsRef = collection(db, 'users', userId, 'reports');
  const reportData = {
    ...report,
    status: 'draft',
    updatedAt: serverTimestamp(),
  };

  if (reportId) {
    const docRef = doc(db, 'users', userId, 'reports', reportId);
    await updateDoc(docRef, reportData);
    return reportId;
  } else {
    const docRef = await addDoc(reportsRef, {
      ...reportData,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  }
};

export const completeReport = async (userId: string, reportId: string, aiInterpretation: EcgReport['aiInterpretation']) => {
  const docRef = doc(db, 'users', userId, 'reports', reportId);
  await updateDoc(docRef, {
    status: 'completed',
    aiInterpretation,
    completedAt: serverTimestamp()
  });
};

export const getUserReports = async (userId: string) => {
  const reportsRef = collection(db, 'users', userId, 'reports');
  const q = query(reportsRef, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  
  const reports: EcgReport[] = [];
  querySnapshot.forEach((doc) => {
    reports.push({ id: doc.id, ...doc.data() } as EcgReport);
  });
  
  return reports;
};
