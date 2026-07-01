import type { EcgReport } from '../../../db';
import { createFinding, formatValue, hasInferiorQWaves } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { hasLafbCriteria } from './fascicularBlockHelpers';

export const leftAnteriorFascicularBlockRule: DiagnosticRule = {
  id: 'left-anterior-fascicular-block',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];

    if (report.axis?.concern === 'left_axis_deviation' && !hasLafbCriteria(report)) {
      findings.push(createFinding({
        id: 'exclude-lafb-incomplete-criteria',
        label: 'Safety exclusion: LAFB criteria incomplete',
        finding: 'Left-axis deviation is present, but morphologic criteria for LAFB are not fully met. Evaluate for co-existing inferior MI or LVH.',
        basis: 'LAFB requires LAD with high-lateral qR and inferior rS morphology after excluding inferior pathological Q waves and non-supraventricular rhythms.',
        inputs: [
          `Axis concern: ${formatValue(report.axis?.concern)}`,
          `Inferior Q waves: ${formatValue(hasInferiorQWaves(report))}`,
          `Fascicular pattern: ${formatValue(report.qrsComplex?.bbb?.fascicular)}`,
        ],
      }));
      return findings;
    }

    if (!hasLafbCriteria(report)) return findings;

    findings.push(createFinding({
      id: 'dx-lafb',
      label: 'Diagnostic suggestion: LAFB',
      finding: 'Left Anterior Fascicular Block (LAFB) pattern suggested.',
      basis: 'Manual fascicular rule: supraventricular conduction with left-axis deviation, high-lateral qR / inferior rS morphology, and no inferior pathological Q-wave exclusion.',
      inputs: [
        `Axis concern: ${formatValue(report.axis?.concern)}`,
        `Approximate axis: ${formatValue(report.axis?.approximateDegrees)}`,
        `Fascicular pattern: ${formatValue(report.qrsComplex?.bbb?.fascicular)}`,
        `Criteria: ${formatValue(report.qrsComplex?.bbb?.criteria)}`,
      ],
    }));

    return findings;
  },
};
