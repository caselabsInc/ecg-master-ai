import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getVentricularTachycardiaState, hasPulselessArrestContext, hasUnstableContext } from './ventricularHelpers';

export const monomorphicVentricularTachycardiaRule: DiagnosticRule = {
  id: 'monomorphic-ventricular-tachycardia',
  evaluate(report) {
    const rate = getBpm(report);
    const state = getVentricularTachycardiaState(report, rate);
    if (!state.monomorphic || state.polymorphic || state.torsades) return [];

    const pulseless = hasPulselessArrestContext(report);
    return [
      createFinding({
        id: 'dx-monomorphic-ventricular-tachycardia',
        label: 'Diagnostic suggestion: Monomorphic Ventricular Tachycardia (VT)',
        finding: 'Monomorphic Ventricular Tachycardia (VT) pattern suggested by rapid wide-complex rhythm with uniform/non-polymorphic ventricular morphology or VT markers.',
        basis: 'Manual monomorphic VT rule: ventricular rate 100-250 bpm, QRS >=120 ms, regular/slightly irregular rhythm, absent or dissociated P-QRS relationship, and uniform QRS morphology.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`, `VT concern: ${formatValue(report.qrsComplex?.wideComplexTachycardia?.vtConcern)}`],
      }),
      createFinding({
        id: pulseless ? 'alert-pulseless-monomorphic-vt' : 'alert-monomorphic-vt',
        label: 'High-priority alert: Monomorphic VT',
        finding: pulseless ? 'CRITICAL EMERGENCY: Pulseless Ventricular Tachycardia detected. Begin CPR and prepare for unsynchronised defibrillation.' : 'WARNING: Monomorphic VT detected. Check patient responsiveness and pulse immediately. If pulseless, begin CPR and prepare for defibrillation.',
        basis: 'VT is a high-risk rhythm; pulseless VT is a shockable cardiac arrest rhythm, while unstable VT with a pulse requires urgent synchronized cardioversion review.',
        inputs: [`Pulseless context: ${formatValue(pulseless)}`, `Unstable context: ${formatValue(hasUnstableContext(report))}`],
      }),
    ];
  },
};
