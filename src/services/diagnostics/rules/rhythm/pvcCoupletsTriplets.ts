import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { ectopyIncludes, pvcDangerInputs, textIncludes, underlyingRhythmLabel } from './ectopyHelpers';

export const pvcCoupletsTripletsRule: DiagnosticRule = {
  id: 'pvc-couplets-triplets',
  evaluate(report) {
    const ectopy = report.rhythm?.ectopy ?? [];
    if (!(ectopyIncludes(report, 'couplet') || textIncludes(report, ['couplet', 'doublet', 'paired pvc', 'pvc pair', 'triplet']))) {
      return [];
    }

    const rate = getBpm(report);
    const triplet = textIncludes(report, ['triplet', 'three consecutive pvc', '3 consecutive pvc']);
    return [
      createFinding({
        id: triplet ? 'dx-pvc-triplets' : 'dx-pvc-couplets',
        label: triplet ? 'Diagnostic suggestion: PVC Triplets' : 'Diagnostic suggestion: PVC Couplets',
        finding: `${underlyingRhythmLabel(report)} with ${triplet ? 'PVC Triplets' : 'PVC Couplets'} pattern suggested.`,
        basis: 'Manual PVC grouping rule: two consecutive PVCs form a couplet; three consecutive PVCs form a triplet when the run rate is <=100 bpm, otherwise it becomes nonsustained VT.',
        inputs: [`Ectopy: ${formatValue(ectopy)}`, `Rate: ${formatValue(rate)} bpm`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `Details text: ${formatValue(report.qrsComplex?.otherDetails ?? report.additionalNotes)}`],
      }),
      createFinding({
        id: 'alert-pvc-couplet-triplet',
        label: 'Critical alert: PVC couplet/triplet',
        finding: 'CRITICAL ALERT: PVC Couplet/Triplet detected. High risk of degeneration into Ventricular Tachycardia or Ventricular Fibrillation. Monitor patient stability immediately.',
        basis: 'Back-to-back PVCs represent high ventricular irritability.',
        inputs: pvcDangerInputs(report),
      }),
    ];
  },
};
