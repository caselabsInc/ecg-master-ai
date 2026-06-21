import { create } from 'zustand';
import { EcgReport } from '../services/db';

interface EcgStore {
  reportId: string | null;
  draft: Partial<EcgReport>;
  setReportId: (id: string) => void;
  updateDraft: (update: Partial<EcgReport>) => void;
  resetDraft: () => void;
}

const initialDraft: Partial<EcgReport> = {
  context: {},
  heartRate: {},
  rhythm: {},
  pWave: {},
  prInterval: {},
  qrsComplex: {},
  axis: {},
  qWaves: {},
  stSegment: {},
  tWaves: {},
  qtInterval: {},
  lateWaveFindings: {},
  uWaves: {},
};

export const useEcgStore = create<EcgStore>((set) => ({
  reportId: null,
  draft: { ...initialDraft },
  setReportId: (id) => set({ reportId: id }),
  updateDraft: (update) => set((state) => ({
    draft: {
      ...state.draft,
      ...update,
      // Handle nested merges if needed for deep objects, but standard spread is often enough 
      // if we update at the top level of each section (e.g. updateDraft({ pWave: { ...state.draft.pWave, morphology: 'normal' } }))
    }
  })),
  resetDraft: () => set({ draft: { ...initialDraft }, reportId: null })
}));
