import type { EcgReport } from '../../../db';
import { createFinding, formatValue, hasLateralQWaves } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { hasLpfbCriteria } from './fascicularBlockHelpers';

export const leftPosteriorFascicularBlockRule: DiagnosticRule = {
  id: 'left-posterior-fascicular-block',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];

    if (report.axis?.concern === 'right_axis_deviation' && !hasLpfbCriteria(report)) {
      findings.push(createFinding({
        id: 'exclude-lpfb-incomplete-criteria',
        label: 'Safety exclusion: LPFB criteria incomplete',
        finding: 'Right-axis deviation is present, but LPFB cannot be diagnosed until RVH, lateral MI, and pulmonary strain are clinically excluded.',
        basis: 'LPFB is a diagnosis of exclusion and requires RAD with high-lateral rS / inferior qR morphology after excluding RVH, lateral MI, and pulmonary strain.',
        inputs: [
          `Axis concern: ${formatValue(report.axis?.concern)}`,
          `Lateral Q waves: ${formatValue(hasLateralQWaves(report))}`,
          `RVH voltage: ${formatValue(report.qrsComplex?.hypertrophy?.rvhRInV1)}`,
          `Fascicular pattern: ${formatValue(report.qrsComplex?.bbb?.fascicular)}`,
        ],
      }));
      return findings;
    }

    if (!hasLpfbCriteria(report)) return findings;

    findings.push(createFinding({
      id: 'dx-lpfb',
      label: 'Diagnostic suggestion: LPFB',
      finding: 'Left Posterior Fascicular Block (LPFB) pattern suggested.',
      basis: 'Manual fascicular rule: supraventricular conduction with right-axis deviation, high-lateral rS / inferior qR morphology, and no lateral MI/RVH exclusion.',
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
