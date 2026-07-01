import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getVentricularTachycardiaState, hasPulselessArrestContext, hasUnstableContext, rateInRange } from './ventricularHelpers';

export const polymorphicVentricularTachycardiaRule: DiagnosticRule = {
  id: 'polymorphic-ventricular-tachycardia',
  evaluate(report) {
    const rate = getBpm(report);
    const state = getVentricularTachycardiaState(report, rate);
    if (!state.polymorphic || state.torsades || !rateInRange(rate, 100, 300)) return [];

    return [
      createFinding({
        id: 'dx-polymorphic-ventricular-tachycardia',
        label: 'Diagnostic suggestion: Polymorphic Ventricular Tachycardia (PMVT)',
        finding: 'Polymorphic Ventricular Tachycardia (PMVT) pattern suggested by wide-complex tachycardia with varying QRS morphology.',
        basis: 'Manual PMVT rule: rate >=100 bpm, QRS >=120 ms, and continuously varying QRS shape/amplitude/direction, with TdP separated when prolonged QT/twisting criteria are present.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `QT risk: ${formatValue(report.qtInterval?.qtRisk)}`, `QRS morphology: ${formatValue(report.qrsComplex?.morphology)}`, `Other QRS details: ${formatValue(report.qrsComplex?.otherDetails)}`],
      }),
      createFinding({
        id: 'alert-polymorphic-ventricular-tachycardia',
        label: 'High-priority alert: Polymorphic VT',
        finding: 'WARNING: Polymorphic VT detected. PMVT is highly unstable and can rapidly degenerate into Ventricular Fibrillation. Prepare for immediate treatment.',
        basis: 'PMVT is a life-threatening wide-complex tachycardia that may rapidly deteriorate.',
        inputs: [`Pulseless context: ${formatValue(hasPulselessArrestContext(report))}`, `Unstable context: ${formatValue(hasUnstableContext(report))}`],
      }),
    ];
  },
};
