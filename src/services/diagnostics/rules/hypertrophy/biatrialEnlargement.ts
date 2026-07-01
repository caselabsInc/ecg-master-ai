import type { EcgReport } from '../../../db';
import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getAtrialMeasurements, pWavesAbsent } from './helpers';

export const biatrialEnlargementRule: DiagnosticRule = {
  id: 'biatrial-enlargement',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const atrial = getAtrialMeasurements(report);
    const hasAtrialFlags = report.pWave?.abnormalFeatures?.some((feature) => ['left_atrial_enlargement', 'right_atrial_enlargement', 'biatrial_enlargement'].includes(feature)) ||
      report.pWave?.morphology === 'notched' ||
      report.pWave?.morphology === 'peaked';

    if (pWavesAbsent(report) && hasAtrialFlags) {
      findings.push(createFinding({
        id: 'exclude-atrial-enlargement-absent-p-waves',
        label: 'Safety exclusion: atrial enlargement',
        finding: 'P waves are absent; atrial enlargement parameters cannot be evaluated.',
        basis: 'LAE/RAE/biatrial enlargement require visible, measurable P-wave morphology.',
        inputs: [`P waves: ${formatValue(report.pWave?.presence)}`, `Rhythm: ${formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory)}`],
      }));
      return findings;
    }

    if (!atrial.biatrialFlag) return findings;

    findings.push(createFinding({
      id: 'dx-biatrial-enlargement',
      label: 'Diagnostic suggestion: Biatrial Enlargement',
      finding: 'Combined Atrial Abnormality / Biatrial Enlargement.',
      basis: 'Manual biatrial rule: simultaneous right atrial voltage/amplitude clues and left atrial duration/terminal-force clues in visible P waves.',
      inputs: [`P-wave amplitude Lead II: ${formatValue(atrial.pAmplitude)} mm`, `P-wave duration: ${formatValue(atrial.pDurationMs)} ms`, `V1 terminal depth/width: ${formatValue(atrial.v1TerminalDepth)} mm / ${formatValue(atrial.v1TerminalWidthMs)} ms`, `P-wave features: ${formatValue(report.pWave?.abnormalFeatures)}`],
    }));
    findings.push(createFinding({
      id: 'alert-biatrial-enlargement',
      label: 'High-priority alert: Biatrial Enlargement',
      finding: 'WARNING: Biatrial enlargement detected. This pattern suggests advanced biatrial pressure overload. Evaluate for severe valvular dysfunction or cardiomyopathy.',
      basis: 'Combined atrial enlargement is associated with multivalvular disease and advanced cardiomyopathy.',
      inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
    }));

    return findings;
  },
};
