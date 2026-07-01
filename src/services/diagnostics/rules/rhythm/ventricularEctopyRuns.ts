import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { ectopyIncludes, textIncludes } from './ectopyHelpers';

export const ventricularEctopyRunsRule: DiagnosticRule = {
  id: 'ventricular-ectopy-runs',
  evaluate(report) {
    if (!(ectopyIncludes(report, 'runs') || textIncludes(report, ['nonsustained vt', 'non-sustained vt', 'nsvt', 'run of pvc', 'salvo']))) {
      return [];
    }

    return [createFinding({
      id: 'dx-ventricular-ectopy-runs',
      label: 'Diagnostic suggestion: Runs of ventricular ectopy / NSVT concern',
      finding: 'Runs of ventricular ectopy documented; if three or more consecutive PVCs run above 100 bpm and last under 30 seconds, classify as nonsustained VT.',
      basis: 'PVC grouping rule: three or more consecutive ventricular premature beats at >100 bpm constitute nonsustained VT rather than isolated triplets.',
      inputs: [`Ectopy: ${formatValue(report.rhythm?.ectopy ?? [])}`, `Rate: ${formatValue(getBpm(report))} bpm`, `Details text: ${formatValue(report.qrsComplex?.otherDetails ?? report.additionalNotes)}`],
    })];
  },
};
