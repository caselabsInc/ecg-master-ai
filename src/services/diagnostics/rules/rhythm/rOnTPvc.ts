import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasIschemicOrStructuralContext, hasPrematureVentricularClues, isWideQrs, pvcDangerInputs, textIncludes, underlyingRhythmLabel } from './ectopyHelpers';

export const rOnTPvcRule: DiagnosticRule = {
  id: 'r-on-t-pvc',
  evaluate(report) {
    if (!(hasPrematureVentricularClues(report) && isWideQrs(report) && textIncludes(report, ['r-on-t', 'ron-t', 'r on t', 'falls on t', 'downslope of t', 't wave peak']))) {
      return [];
    }

    return [
      createFinding({
        id: 'dx-r-on-t-pvc',
        label: 'Diagnostic suggestion: R-on-T PVC',
        finding: `${underlyingRhythmLabel(report)} with Premature Ventricular Complexes (PVCs) displaying R-on-T Phenomenon.`,
        basis: 'Manual R-on-T rule: a wide premature ventricular complex without preceding P wave falls on the peak or downslope of the preceding T wave.',
        inputs: [`QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `QTc: ${formatValue(report.qtInterval?.calculatedQtcMs ?? report.qtInterval?.qtcBazettMs ?? report.qtInterval?.qtcFridericiaMs ?? report.qtInterval?.qtcFraminghamMs)} ms`, `QT risk: ${formatValue(report.qtInterval?.qtRisk)}`, `Details text: ${formatValue(report.qrsComplex?.otherDetails ?? report.additionalNotes)}`],
      }),
      createFinding({
        id: 'alert-r-on-t-pvc',
        label: 'Critical alert: R-on-T PVC',
        finding: 'CRITICAL EMERGENCY: R-on-T PVC detected. Extremely high risk of triggering VT/VF, especially in acute coronary syndromes. Evaluate hemodynamics and cardiac markers immediately.',
        basis: 'R-on-T occurs during the vulnerable repolarization period and can trigger life-threatening ventricular arrhythmias.',
        inputs: [`Ischemic context: ${formatValue(hasIschemicOrStructuralContext(report))}`, `QT risk: ${formatValue(report.qtInterval?.qtRisk)}`, ...pvcDangerInputs(report)],
      }),
    ];
  },
};
