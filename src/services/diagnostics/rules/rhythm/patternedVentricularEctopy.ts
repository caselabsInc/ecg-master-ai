import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { ectopyIncludes, hasPrematureVentricularClues, isSymptomatic, isWideQrs, textIncludes, underlyingRhythmLabel } from './ectopyHelpers';

export const patternedVentricularEctopyRule: DiagnosticRule = {
  id: 'patterned-ventricular-ectopy',
  evaluate(report) {
    const findings: DiagnosticFinding[] = [];
    const ectopy = report.rhythm?.ectopy ?? [];
    if (!(ectopyIncludes(report, 'bigeminy') || ectopyIncludes(report, 'trigeminy') || textIncludes(report, ['quadrigeminy', 'quadrigeminal']))) {
      return findings;
    }

    const pattern = ectopyIncludes(report, 'bigeminy') ? 'Ventricular Bigeminy' : ectopyIncludes(report, 'trigeminy') ? 'Ventricular Trigeminy' : 'Ventricular Quadrigeminy';
    if (isWideQrs(report) || hasPrematureVentricularClues(report)) {
      findings.push(createFinding({
        id: `dx-${pattern.toLowerCase().replaceAll(' ', '-')}`,
        label: `Diagnostic suggestion: ${pattern}`,
        finding: `${underlyingRhythmLabel(report)} with ${pattern} pattern suggested.`,
        basis: 'Manual PVC pattern rule: repeating premature ventricular complex pattern, such as every other beat (bigeminy), every third beat (trigeminy), or every fourth beat (quadrigeminy), with PVC morphology support.',
        inputs: [`Ectopy: ${formatValue(ectopy)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `Details text: ${formatValue(report.qrsComplex?.otherDetails ?? report.additionalNotes)}`],
      }));
      findings.push(createFinding({
        id: 'alert-patterned-ventricular-ectopy',
        label: 'High-priority alert: patterned ventricular ectopy',
        finding: 'WARNING: Ventricular Bigeminy/Trigeminy detected. Highly irritable myocardium; monitor blood pressure closely for falling cardiac output.',
        basis: 'Patterned ventricular ectopy can reduce effective stroke volume and signals ventricular irritability.',
        inputs: [`Pattern: ${pattern}`, `Symptoms/instability: ${formatValue(isSymptomatic(report))}`],
      }));
    } else {
      findings.push(createFinding({
        id: 'exclude-ventricular-patterned-ectopy-narrow',
        label: 'Safety exclusion: ventricular patterned ectopy',
        finding: 'Patterned premature beats are narrow or preceded by P waves. Ventricular pattern is excluded; evaluate for atrial or junctional bigeminy/trigeminy.',
        basis: 'Ventricular bigeminy/trigeminy requires PVC criteria for the ectopic beats.',
        inputs: [`Ectopy: ${formatValue(ectopy)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }));
    }

    return findings;
  },
};
