import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm, hasClinicalKeyword, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getUnderlyingRhythmLabel, hasLbbbMorphology } from './bundleBranchBlockHelpers';

export const leftBundleBranchBlockRule: DiagnosticRule = {
  id: 'left-bundle-branch-block',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const qrsMs = report.qrsComplex?.calculatedMs;
    const rate = getBpm(report);
    const isRatePlausible = typeof rate !== 'number' || (rate >= 20 && rate <= 250);
    if (!isRatePlausible || !isSupraventricularConduction(report)) return findings;

    const lbbb = typeof qrsMs === 'number' && qrsMs >= 120 && hasLbbbMorphology(report);
    if (!lbbb) return findings;

    findings.push(createFinding({
      id: 'dx-lbbb',
      label: 'Diagnostic suggestion: complete LBBB',
      finding: `${getUnderlyingRhythmLabel(report)} with Complete Left Bundle Branch Block (LBBB) pattern suggested.`,
      basis: 'Manual conduction rule: QRS >=120 ms with predominantly negative V1 pattern and broad/notched/slurred lateral R-wave morphology with absent lateral Q waves, excluding paced or ventricular origin.',
      inputs: [
        `QRS duration: ${formatValue(qrsMs)} ms`,
        `V1 morphology: ${formatValue(report.qrsComplex?.v1Morphology)}`,
        `V6 morphology: ${formatValue(report.qrsComplex?.v6Morphology)}`,
        `BBB criteria: ${formatValue(report.qrsComplex?.bbb?.criteria)}`,
      ],
    }));
    findings.push(createFinding({
      id: 'exclude-lbbb-standard-stemi',
      label: 'Safety exclusion: standard STEMI criteria in LBBB',
      finding: "LBBB is present. Standard ST-segment elevation criteria for acute MI are unreliable; apply Sgarbossa/modified Sgarbossa criteria if clinically indicated.",
      basis: 'LBBB can produce chronic discordant ST elevation/depression and mask anterior infarction patterns.',
      inputs: [`OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`, `ST status: ${formatValue(report.stSegment?.status)}`],
    }));

    if (hasClinicalKeyword(report, ['chest pain', 'stemi', 'ischemia', 'infarction', 'mi'])) {
      findings.push(createFinding({
        id: 'alert-lbbb-chest-pain',
        label: 'High-priority LBBB alert',
        finding: 'CRITICAL: Presumed new or symptomatic LBBB with active ischemic symptoms requires urgent clinician review for acute coronary occlusion.',
        basis: 'New or symptomatic LBBB can indicate acute coronary occlusion and makes ordinary ST criteria unreliable.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
