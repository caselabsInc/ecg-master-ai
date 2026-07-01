import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getAdvancedConductionState } from './advancedConductionHelpers';

export const bifascicularBlockRule: DiagnosticRule = {
  id: 'bifascicular-block',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const state = getAdvancedConductionState(report);
    if (!state.bifascicularType) return findings;

    findings.push(createFinding({
      id: 'dx-bifascicular-block',
      label: 'Diagnostic suggestion: bifascicular block',
      finding: `Bifascicular Block (${state.bifascicularType}) pattern suggested.`,
      basis: 'Manual conduction rule: complete RBBB plus either LAFB or LPFB morphology/axis criteria indicates bifascicular conduction-system disease.',
      inputs: [
        `RBBB criteria met: ${formatValue(state.rbbb)}`,
        `LAFB criteria met: ${formatValue(state.lafb)}`,
        `LPFB criteria met: ${formatValue(state.lpfb)}`,
        `Axis concern: ${formatValue(report.axis?.concern)}`,
      ],
    }));

    findings.push(createFinding({
      id: 'alert-bifascicular-block',
      label: 'High-priority conduction alert',
      finding: 'WARNING: Bifascicular block detected. Monitor closely for progression toward complete heart block, especially with syncope.',
      basis: 'Bifascicular block means two of the three infranodal conduction pathways are impaired.',
      inputs: [`Syncope clues: ${formatValue(state.syncope)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
    }));

    return findings;
  },
};
