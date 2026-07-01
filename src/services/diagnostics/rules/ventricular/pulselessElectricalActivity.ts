import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasPositivePulseOrResponsiveness, hasPulselessArrestContext, hasVtMarkers, qrsIsPresent, qrsIsWide, rateInRange, underlyingRhythmLabel } from './ventricularHelpers';

export const pulselessElectricalActivityRule: DiagnosticRule = {
  id: 'pulseless-electrical-activity',
  evaluate(report) {
    const rate = getBpm(report);
    const pulseless = hasPulselessArrestContext(report);
    const organizedElectricalRhythm = qrsIsPresent(report);
    const likelyPulselessVt = pulseless && qrsIsWide(report) && rateInRange(rate, 100, 300) && hasVtMarkers(report);

    if (organizedElectricalRhythm && hasPositivePulseOrResponsiveness(report) && !pulseless) {
      return [createFinding({
        id: 'exclude-pea-pulse-present',
        label: 'Safety exclusion: Pulseless Electrical Activity',
        finding: 'Organised electrical rhythm with a palpable pulse detected. PEA is ruled out; monitor hemodynamic stability.',
        basis: 'PEA requires organised electrical activity without a palpable central pulse or measurable mechanical perfusion.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`, `Underlying rhythm: ${underlyingRhythmLabel(report)}`],
      })];
    }

    if (!(pulseless && organizedElectricalRhythm && !likelyPulselessVt)) return [];

    return [
      createFinding({
        id: 'dx-pulseless-electrical-activity',
        label: 'Diagnostic suggestion: Pulseless Electrical Activity (PEA)',
        finding: `Pulseless Electrical Activity (PEA) with ${underlyingRhythmLabel(report)}.`,
        basis: 'Manual emergency rhythm rule: organised electrical morphology is present, but clinical context documents pulseless arrest, excluding VF/asystole/pulseless VT.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS presence: ${formatValue(report.qrsComplex?.presence)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `Pulseless/cardiac arrest context: ${formatValue(pulseless)}`],
      }),
      createFinding({
        id: 'alert-pea',
        label: 'High-priority alert: Pulseless Electrical Activity',
        finding: "CRITICAL EMERGENCY: Pulseless Electrical Activity (PEA) detected. Patient is in Cardiac Arrest. Start immediate CPR. Administer Epinephrine. Do NOT shock. Check and treat reversible Hs and Ts.",
        basis: 'PEA is a nonshockable cardiac arrest rhythm with electrical activity but absent effective mechanical output.',
        inputs: [`Underlying rhythm: ${underlyingRhythmLabel(report)}`],
      }),
    ];
  },
};
