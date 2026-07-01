import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getVentricularTachycardiaState, hasPulselessArrestContext, hasUnstableContext } from './ventricularHelpers';

export const torsadesDePointesRule: DiagnosticRule = {
  id: 'torsades-de-pointes',
  evaluate(report) {
    const rate = getBpm(report);
    if (!getVentricularTachycardiaState(report, rate).torsades) return [];

    return [
      createFinding({
        id: 'dx-torsades-de-pointes',
        label: 'Diagnostic suggestion: Torsades de Pointes',
        finding: 'Torsades de Pointes (Polymorphic VT with Prolonged QT) pattern suggested.',
        basis: 'Manual TdP rule: rapid wide-complex polymorphic rhythm with twisting/spindle morphology or documented torsades clues plus prolonged baseline QTc.',
        inputs: [`Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `QTc: ${formatValue(report.qtInterval?.calculatedQtcMs ?? report.qtInterval?.qtcBazettMs ?? report.qtInterval?.qtcFridericiaMs ?? report.qtInterval?.qtcFraminghamMs)} ms`, `QT risk: ${formatValue(report.qtInterval?.qtRisk)}`, `Clinical/details text: ${formatValue(report.context?.indication ?? report.additionalNotes ?? report.qrsComplex?.otherDetails)}`],
      }),
      createFinding({
        id: 'alert-torsades-de-pointes',
        label: 'High-priority alert: Torsades de Pointes',
        finding: 'CRITICAL EMERGENCY: Torsades de Pointes detected. Discontinue all QT-prolonging drugs immediately. Administer IV Magnesium Sulfate 1-2g over 5-60 minutes. Prepare for possible defibrillation.',
        basis: 'TdP is unstable polymorphic VT associated with prolonged repolarization and can degenerate into VF or asystole.',
        inputs: [`Pulseless context: ${formatValue(hasPulselessArrestContext(report))}`, `Unstable context: ${formatValue(hasUnstableContext(report))}`],
      }),
    ];
  },
};
