import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasFrequentEctopy, hasIschemicOrStructuralContext, hasPrematureVentricularClues, isWideQrs, pvcDangerInputs, textIncludes, underlyingRhythmLabel } from './ectopyHelpers';

export const prematureVentricularComplexesRule: DiagnosticRule = {
  id: 'premature-ventricular-complexes',
  evaluate(report) {
    const findings = [];
    const wideQrs = isWideQrs(report);

    if (hasPrematureVentricularClues(report) && wideQrs && report.pWave?.presence !== 'present') {
      findings.push(createFinding({
        id: 'dx-premature-ventricular-complexes',
        label: 'Diagnostic suggestion: Premature Ventricular Complexes (PVCs)',
        finding: `${underlyingRhythmLabel(report)} with Premature Ventricular Complexes (PVCs) pattern suggested.`,
        basis: 'Manual PVC rule: premature wide/bizarre QRS complex without preceding P wave, absent PR relationship, ventricular-origin morphology, and discordant ST/T clues when documented.',
        inputs: pvcDangerInputs(report),
      }));
    } else if (hasPrematureVentricularClues(report) && wideQrs) {
      findings.push(createFinding({
        id: 'dx-premature-ventricular-complexes',
        label: 'Diagnostic suggestion: Premature Ventricular Complexes (PVCs)',
        finding: `${underlyingRhythmLabel(report)} with Premature Ventricular Complexes (PVCs) pattern possible; verify no early P wave precedes the wide complex.`,
        basis: 'Manual PVC rule support is present from PVC/ventricular-origin flags and wide QRS; preceding P-wave status should be confirmed to exclude aberrantly conducted PAC.',
        inputs: pvcDangerInputs(report),
      }));
    } else if (hasPrematureVentricularClues(report) && !wideQrs) {
      findings.push(createFinding({
        id: 'exclude-pvc-narrow-qrs',
        label: 'Safety exclusion: PVC',
        finding: 'Premature complex is not wide. PVC is excluded; evaluate for PAC/PJC if the premature beat is narrow.',
        basis: 'PVC criteria require a wide ventricular-origin QRS complex.',
        inputs: [`QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `QRS morphology: ${formatValue(report.qrsComplex?.morphology)}`],
      }));
    }

    if (hasPrematureVentricularClues(report) && wideQrs && (hasFrequentEctopy(report) || hasIschemicOrStructuralContext(report) || textIncludes(report, ['multiform', 'multifocal', 'r-on-t', 'ron-t']))) {
      findings.push(createFinding({
        id: 'alert-malignant-pvc-pattern',
        label: 'High-priority alert: malignant PVC pattern',
        finding: 'WARNING: Malignant PVC pattern detected in a patient with heart disease or high-risk PVC features. Assess hemodynamic perfusion immediately.',
        basis: 'Frequent, multiform, ischemia-associated, or R-on-T PVCs can trigger VT/VF and warrant urgent clinician review.',
        inputs: pvcDangerInputs(report),
      }));
    }

    return findings;
  },
};
