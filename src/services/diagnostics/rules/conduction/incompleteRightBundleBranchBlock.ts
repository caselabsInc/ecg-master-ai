import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm, hasClinicalKeyword, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getUnderlyingRhythmLabel, hasIncompleteRbbbMorphology } from './bundleBranchBlockHelpers';

export const incompleteRightBundleBranchBlockRule: DiagnosticRule = {
  id: 'incomplete-right-bundle-branch-block',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const qrsMs = report.qrsComplex?.calculatedMs;
    const rate = getBpm(report);
    const isRatePlausible = typeof rate !== 'number' || (rate >= 20 && rate <= 250);
    if (!isRatePlausible || !isSupraventricularConduction(report)) return findings;

    const incompleteRbbb = typeof qrsMs === 'number' && qrsMs >= 100 && qrsMs < 120 && hasIncompleteRbbbMorphology(report);
    if (!incompleteRbbb) return findings;

    findings.push(createFinding({
      id: 'dx-incomplete-rbbb',
      label: 'Diagnostic suggestion: incomplete RBBB',
      finding: `${getUnderlyingRhythmLabel(report)} with Incomplete Right Bundle Branch Block (IRBBB) pattern suggested.`,
      basis: 'Manual conduction rule: QRS 100-119 ms with right precordial rSR/notched morphology and compatible lateral terminal S-wave delay.',
      inputs: [
        `QRS duration: ${formatValue(qrsMs)} ms`,
        `V1 morphology: ${formatValue(report.qrsComplex?.v1Morphology)}`,
        `BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`,
      ],
    }));

    const dyspneaOrPe = hasClinicalKeyword(report, ['dyspnea', 'shortness of breath', 'pleuritic', 'pulmonary embolism', 'pe']);
    if (dyspneaOrPe && report.heartRate?.rateSeverity?.includes('tachycardia')) {
      findings.push(createFinding({
        id: 'alert-irbbb-pe-strain',
        label: 'Incomplete RBBB strain correlation',
        finding: 'Incomplete RBBB with acute dyspnea/pleuritic symptoms and tachycardia may reflect acute right ventricular strain; correlate for pulmonary embolism.',
        basis: 'IRBBB can appear with acute right ventricular strain patterns in pulmonary embolism.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`, `Rate severity: ${formatValue(report.heartRate?.rateSeverity)}`],
      }));
    }

    return findings;
  },
};
