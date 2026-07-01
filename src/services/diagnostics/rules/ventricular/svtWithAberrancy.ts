import { createFinding, formatValue, getBpm, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getVentricularTachycardiaState, hasClassicBbbAberrancyPattern, hasPulselessArrestContext, hasUnstableContext, hasVtMarkers } from './ventricularHelpers';

export const svtWithAberrancyRule: DiagnosticRule = {
  id: 'svt-with-aberrancy',
  evaluate(report) {
    const rate = getBpm(report);
    const state = getVentricularTachycardiaState(report, rate);
    if (!state.wideTachycardia) return [];

    const isRegularWct = report.heartRate?.regularity === 'regular';
    const vtMarkers = hasVtMarkers(report);
    const bbbAberrancy = isRegularWct && !vtMarkers && isSupraventricularConduction(report) && hasClassicBbbAberrancyPattern(report);
    const pulseless = hasPulselessArrestContext(report);
    const unstable = hasUnstableContext(report);

    if (bbbAberrancy && !pulseless && !unstable) {
      return [createFinding({
        id: 'dx-svt-with-aberrancy',
        label: 'Diagnostic suggestion: Supraventricular Tachycardia with Aberrant Conduction (SVT with Aberrancy)',
        finding: 'Supraventricular Tachycardia with Aberrant Conduction (SVT with Aberrancy) pattern suspected.',
        basis: 'Manual WCT differential rule: regular wide-complex tachycardia without AV dissociation/fusion/concordance VT markers, with classic BBB morphology and supraventricular conduction clues.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`, `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`],
      })];
    }

    if (bbbAberrancy && (pulseless || unstable)) {
      return [createFinding({
        id: 'exclude-svt-aberrancy-unstable',
        label: 'Safety exclusion: SVT with aberrancy',
        finding: 'Wide-QRS tachycardia is present with pulselessness or hemodynamic instability; do not rely on SVT-with-aberrancy differentiation. Treat as VT until proven otherwise.',
        basis: 'The WCT safety rule prioritizes immediate VT management when the patient is unstable or pulseless.',
        inputs: [`Pulseless context: ${formatValue(pulseless)}`, `Unstable context: ${formatValue(unstable)}`],
      })];
    }

    return [];
  },
};
