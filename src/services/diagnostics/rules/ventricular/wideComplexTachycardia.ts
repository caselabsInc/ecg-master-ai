import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getVentricularTachycardiaState, hasPulselessArrestContext, hasUnstableContext, hasVtMarkers, rateInRange } from './ventricularHelpers';

export const wideComplexTachycardiaRule: DiagnosticRule = {
  id: 'wide-complex-tachycardia',
  evaluate(report) {
    const rate = getBpm(report);
    const qrsMs = report.qrsComplex?.calculatedMs;
    const state = getVentricularTachycardiaState(report, rate);

    if (state.wideTachycardia && !state.monomorphic && !state.polymorphic && !state.torsades) {
      const isRegularWct = report.heartRate?.regularity === 'regular';
      const vtMarkers = hasVtMarkers(report);
      return [
        createFinding({
          id: isRegularWct ? 'dx-undifferentiated-regular-wide-complex-tachycardia' : 'dx-undifferentiated-wide-complex-tachycardia',
          label: isRegularWct ? 'Diagnostic suggestion: Undifferentiated Regular Wide-Complex Tachycardia (WCT)' : 'Diagnostic suggestion: Undifferentiated Wide-Complex Tachycardia (WCT)',
          finding: isRegularWct ? 'Undifferentiated Regular Wide-Complex Tachycardia (WCT) detected.' : 'Undifferentiated Wide-Complex Tachycardia (WCT) detected.',
          basis: 'Manual WCT gatekeeper rule: rate >100 bpm and QRS >=120 ms. If the clinical origin is uncertain, treat wide-complex tachycardia as VT until proven otherwise.',
          inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(qrsMs)} ms`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `VT markers: ${formatValue(vtMarkers)}`],
        }),
        createFinding({
          id: 'alert-wide-complex-tachycardia',
          label: 'High-priority alert: Wide-Complex Tachycardia',
          finding: 'WARNING: Wide-Complex Tachycardia detected. If the patient is unstable, prepare for immediate electrical therapy. If clinical origin is uncertain, treat strictly as Ventricular Tachycardia (VT).',
          basis: 'Wide-complex tachycardia has high-risk VT mimics, and symptomatic uncertainty should not delay treatment.',
          inputs: [`Pulseless context: ${formatValue(hasPulselessArrestContext(report))}`, `Unstable context: ${formatValue(hasUnstableContext(report))}`],
        }),
      ];
    }

    if (rateInRange(rate, 101, 350) && typeof qrsMs === 'number' && qrsMs < 120) {
      return [createFinding({
        id: 'exclude-wide-complex-tachycardia-narrow-qrs',
        label: 'Safety exclusion: wide-complex tachycardia',
        finding: 'QRS duration is narrow (<0.12s). WCT/monomorphic VT differentiation protocol is bypassed; evaluate for supraventricular tachycardia.',
        basis: 'WCT and monomorphic VT rules require QRS duration >=120 ms.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(qrsMs)} ms`],
      })];
    }

    return [];
  },
};
