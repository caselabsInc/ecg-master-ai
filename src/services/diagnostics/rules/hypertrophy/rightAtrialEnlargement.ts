import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getAtrialMeasurements, pWavesAbsent } from './helpers';

export const rightAtrialEnlargementRule: DiagnosticRule = {
  id: 'right-atrial-enlargement',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    if (pWavesAbsent(report)) return findings;

    const atrial = getAtrialMeasurements(report);
    if (!atrial.raeFlag || atrial.biatrialFlag) return findings;

    const rate = getBpm(report);
    findings.push(createFinding({
      id: 'dx-right-atrial-enlargement',
      label: 'Diagnostic suggestion: Right Atrial Enlargement',
      finding: 'Right Atrial Abnormality (RAA) / Right Atrial Enlargement (P-Pulmonale).',
      basis: 'Manual RAE rule: tall peaked inferior P waves >2.5 mm with normal duration, or selected right atrial enlargement feature.',
      inputs: [`P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `P-wave amplitude Lead II: ${formatValue(atrial.pAmplitude)} mm`, `P-wave duration: ${formatValue(atrial.pDurationMs)} ms`, `Rate: ${formatValue(rate)} bpm`],
    }));

    if (typeof rate === 'number' && rate > 100) {
      findings.push(createFinding({
        id: 'caution-rae-rate-related-p-waves',
        label: 'Safety caution: Right Atrial Enlargement',
        finding: 'Elevated heart rate (>100 bpm) may cause physiological P-wave peaking. Interpret tall P waves cautiously.',
        basis: 'Sinus tachycardia and sympathetic tone can mimic P-pulmonale.',
        inputs: [`Rate: ${formatValue(rate)} bpm`],
      }));
    }

    return findings;
  },
};
