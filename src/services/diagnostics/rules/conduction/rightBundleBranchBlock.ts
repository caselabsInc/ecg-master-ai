import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm, hasClinicalKeyword, hasLeadIn, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getUnderlyingRhythmLabel, hasRbbbMorphology } from './bundleBranchBlockHelpers';

export const rightBundleBranchBlockRule: DiagnosticRule = {
  id: 'right-bundle-branch-block',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const qrsMs = report.qrsComplex?.calculatedMs;
    const rate = getBpm(report);
    const isRatePlausible = typeof rate !== 'number' || (rate >= 20 && rate <= 250);
    if (!isRatePlausible || !isSupraventricularConduction(report)) return findings;

    const rbbb = typeof qrsMs === 'number' && qrsMs >= 120 && hasRbbbMorphology(report);
    if (!rbbb) return findings;

    findings.push(createFinding({
      id: 'dx-rbbb',
      label: 'Diagnostic suggestion: complete RBBB',
      finding: `${getUnderlyingRhythmLabel(report)} with Complete Right Bundle Branch Block (RBBB) pattern suggested.`,
      basis: 'Manual conduction rule: QRS >=120 ms with right precordial rSR/M-shaped morphology and lateral terminal/wide slurred S-wave evidence, excluding ventricular or paced origin.',
      inputs: [
        `QRS duration: ${formatValue(qrsMs)} ms`,
        `V1 morphology: ${formatValue(report.qrsComplex?.v1Morphology)}`,
        `V6 morphology: ${formatValue(report.qrsComplex?.v6Morphology)}`,
        `BBB criteria: ${formatValue(report.qrsComplex?.bbb?.criteria)}`,
      ],
    }));

    const chestPain = hasClinicalKeyword(report, ['chest pain', 'stemi', 'ischemia', 'infarction', 'mi']);
    if (chestPain && (report.stSegment?.stemiCriteriaMet || hasLeadIn(report.stSegment?.leads, ['v1', 'v2', 'v3', 'v4']))) {
      findings.push(createFinding({
        id: 'alert-rbbb-anterior-ischemia',
        label: 'High-priority RBBB alert',
        finding: 'CRITICAL: New or symptomatic RBBB with anterior/septal ischemic clues may indicate acute septal ischemia/infarction. Correlate clinically.',
        basis: 'RBBB does not invalidate anterior MI assessment; symptomatic anterior/septal ST changes require high-priority review.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`, `ST leads: ${formatValue(report.stSegment?.leads)}`],
      }));
    }

    if (report.axis?.concern === 'left_axis_deviation' || report.prInterval?.prCategory === 'first_degree') {
      findings.push(createFinding({
        id: 'alert-rbbb-progressive-conduction-delay',
        label: 'RBBB conduction-system warning',
        finding: 'RBBB with left-axis deviation and/or prolonged PR suggests additional conduction-system disease.',
        basis: 'RBBB plus fascicular delay or PR prolongation may represent progressive conduction delay in remaining pathways.',
        inputs: [`Axis concern: ${formatValue(report.axis?.concern)}`, `PR category: ${formatValue(report.prInterval?.prCategory)}`],
      }));
    }

    return findings;
  },
};
