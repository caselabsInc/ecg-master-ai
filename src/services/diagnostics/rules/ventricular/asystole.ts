import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasPositivePulseOrResponsiveness, hasPulselessArrestContext, pulseSafetyExclusion, qrsIsAbsent } from './ventricularHelpers';

export const asystoleRule: DiagnosticRule = {
  id: 'asystole',
  evaluate(report) {
    const rate = getBpm(report);
    const qrsAbsentReason = report.qrsComplex?.absentReason;

    if ((qrsAbsentReason === 'asystole' || (rate === 0 && qrsIsAbsent(report))) && hasPositivePulseOrResponsiveness(report)) {
      return [pulseSafetyExclusion('exclude-asystole-pulse-or-responsive', 'Safety exclusion: asystole', 'Flatline/absent QRS pattern documented, but the patient is conscious or has a pulse. Check cables, electrodes, power supply, and maximize gain.', 'Asystole is an arrest rhythm. Pulse or responsiveness should block a definitive asystole diagnosis and trigger equipment/artifact verification.', report)];
    }

    if (!(qrsAbsentReason === 'asystole' || (rate === 0 && qrsIsAbsent(report)))) return [];

    const pWaveAsystole = report.pWave?.presence === 'present';
    return [
      createFinding({
        id: pWaveAsystole ? 'dx-p-wave-asystole' : 'dx-asystole',
        label: 'Diagnostic suggestion: Asystole (Ventricular Standstill)',
        finding: pWaveAsystole ? 'P-wave Asystole / Ventricular Standstill pattern suggested: atrial activity persists without ventricular complexes.' : 'Asystole (Ventricular Standstill) pattern suggested by absent ventricular electrical activity.',
        basis: 'Manual emergency rhythm rule: heart rate 0 or absent QRS complexes with absent ventricular electrical deflections after excluding pulse/responsiveness and false-flatline concerns.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS presence: ${formatValue(report.qrsComplex?.presence)}`, `Absent QRS reason: ${formatValue(qrsAbsentReason)}`, `P waves: ${formatValue(report.pWave?.presence)}`],
      }),
      createFinding({
        id: 'alert-asystole',
        label: 'High-priority alert: Asystole',
        finding: "CRITICAL EMERGENCY: Asystole detected. Patient is in Cardiac Arrest. Begin immediate CPR. Administer Epinephrine. Do NOT shock. Search for H's and T's.",
        basis: 'Asystole is a nonshockable cardiac arrest rhythm requiring CPR, epinephrine, and reversible-cause assessment.',
        inputs: [`Pulseless/cardiac arrest context: ${formatValue(hasPulselessArrestContext(report))}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }),
    ];
  },
};
