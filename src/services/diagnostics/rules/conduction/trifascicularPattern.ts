import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getAdvancedConductionState } from './advancedConductionHelpers';

export const trifascicularPatternRule: DiagnosticRule = {
  id: 'trifascicular-pattern',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const state = getAdvancedConductionState(report);
    if (!state.bifascicularType || !state.prProlonged) return findings;

    findings.push(createFinding({
      id: 'dx-trifascicular-pattern',
      label: 'Diagnostic suggestion: trifascicular pattern',
      finding: 'First-degree AV block with bifascicular block (trifascicular pattern) suggested.',
      basis: 'Manual conduction rule: bifascicular block plus constant PR prolongation suggests conduction delay across all three fascicular pathways, while remaining distinct from complete heart block.',
      inputs: [
        `Bifascicular type: ${formatValue(state.bifascicularType)}`,
        `PR interval: ${formatValue(report.prInterval?.calculatedMs)} ms`,
        `PR category: ${formatValue(report.prInterval?.prCategory)}`,
        `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`,
      ],
    }));

    findings.push(createFinding({
      id: 'alert-trifascicular-pattern',
      label: 'Critical conduction alert',
      finding: 'CRITICAL: Trifascicular pattern detected. High risk of progression to complete heart block; prepare pacing-capable clinician review.',
      basis: 'Trifascicular pattern indicates severe conduction-system disease, especially with syncope or chest pain.',
      inputs: [`Syncope clues: ${formatValue(state.syncope)}`, `Chest pain/ischemia clues: ${formatValue(state.chestPain)}`],
    }));

    return findings;
  },
};
