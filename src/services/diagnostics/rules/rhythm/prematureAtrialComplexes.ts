import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasEarlyAbnormalP, hasFrequentEctopy, hasIschemicOrStructuralContext, hasNormalOrConductedPr, hasPrematureAtrialClues, isNarrowQrs, isWideQrs, underlyingRhythmLabel } from './ectopyHelpers';

export const prematureAtrialComplexesRule: DiagnosticRule = {
  id: 'premature-atrial-complexes',
  evaluate(report) {
    const findings = [];
    const ectopy = report.rhythm?.ectopy ?? [];
    const narrowQrs = isNarrowQrs(report);
    const wideQrs = isWideQrs(report);

    if (hasPrematureAtrialClues(report) && hasEarlyAbnormalP(report) && narrowQrs && hasNormalOrConductedPr(report)) {
      findings.push(createFinding({
        id: 'dx-premature-atrial-complexes',
        label: 'Diagnostic suggestion: Premature Atrial Complexes (PACs)',
        finding: `${underlyingRhythmLabel(report)} with Premature Atrial Complexes (PACs) pattern suggested.`,
        basis: 'Manual PAC rule: premature abnormal atrial P wave, conducted 1:1 with measurable PR interval, narrow QRS, and non-compensatory pause clues when documented.',
        inputs: [`Ectopy: ${formatValue(ectopy)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }));
      if (hasFrequentEctopy(report) && hasIschemicOrStructuralContext(report)) {
        findings.push(createFinding({
          id: 'alert-frequent-pacs-ischemic-heart-disease',
          label: 'High-priority alert: frequent PACs',
          finding: 'WARNING: Frequent PACs detected in a patient with coronary/ischemic heart disease context. Monitor for heart failure, electrolyte imbalance, or progression to AFib/Atrial Flutter.',
          basis: 'Frequent PACs in ischemic or structurally stressed hearts may signal atrial irritability and can trigger sustained atrial arrhythmias.',
          inputs: [`Frequent ectopy clues: ${formatValue(hasFrequentEctopy(report))}`, `Ischemic/structural context: ${formatValue(hasIschemicOrStructuralContext(report))}`],
        }));
      }
    } else if ((hasPrematureAtrialClues(report) || hasEarlyAbnormalP(report)) && wideQrs && report.pWave?.presence !== 'absent') {
      findings.push(createFinding({
        id: 'exclude-pvc-aberrant-pac',
        label: 'Safety exclusion: PVC',
        finding: 'Wide premature complex is preceded by an early P wave. PVC is excluded; evaluate for aberrantly conducted PAC.',
        basis: 'PVC diagnosis requires absence of a preceding premature P wave.',
        inputs: [`P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }));
    }

    return findings;
  },
};
