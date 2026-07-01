import type { EcgReport } from '../../../db';
import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getAtrialMeasurements, pWavesAbsent } from './helpers';

export const leftAtrialEnlargementRule: DiagnosticRule = {
  id: 'left-atrial-enlargement',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    if (pWavesAbsent(report)) return findings;

    const atrial = getAtrialMeasurements(report);
    if (!atrial.laeFlag || atrial.biatrialFlag) return findings;

    findings.push(createFinding({
      id: 'dx-left-atrial-enlargement',
      label: 'Diagnostic suggestion: Left Atrial Enlargement',
      finding: 'Left Atrial Abnormality (LAA) / Left Atrial Enlargement.',
      basis: 'Manual LAE rule: prolonged/notched P wave in limb leads or deep, wide terminal negative V1 P-wave force.',
      inputs: [`P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `P-wave duration: ${formatValue(atrial.pDurationMs)} ms`, `V1 terminal depth/width: ${formatValue(atrial.v1TerminalDepth)} mm / ${formatValue(atrial.v1TerminalWidthMs)} ms`],
    }));
    findings.push(createFinding({
      id: 'alert-left-atrial-enlargement-af-risk',
      label: 'High-priority alert: Left Atrial Enlargement',
      finding: 'WARNING: Left Atrial Abnormality detected. Atrial stretch increases the risk of developing Atrial Fibrillation and thromboembolic stroke.',
      basis: 'Left atrial stretch is a substrate for AFib and loss of atrial mechanical contribution.',
      inputs: [`Rhythm: ${formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory)}`],
    }));

    return findings;
  },
};
