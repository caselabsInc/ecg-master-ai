import type { EcgReport } from '../../../db';
import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';

function countTerritories(leads: string[] | null | undefined) {
  const lowerLeads = (leads ?? []).map((lead) => lead.toLowerCase());
  const territories = [
    ['ii', 'iii', 'avf'],
    ['v1', 'v2'],
    ['v3', 'v4'],
    ['i', 'avl', 'v5', 'v6'],
  ];

  return territories.filter((territory) => territory.some((lead) => lowerLeads.includes(lead))).length;
}

export const pericarditisRule: DiagnosticRule = {
  id: 'pericarditis',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const stLeads = report.stSegment?.leads ?? [];
    const diffuseStElevation = report.stSegment?.status === 'elevated' &&
      (report.stSegment?.mimicConsiderations?.includes('pericarditis') || countTerritories(stLeads) >= 3);

    if (!diffuseStElevation) return [];

    return [createFinding({
      id: 'dx-pericarditis-pattern',
      label: 'Diagnostic suggestion: pericarditis pattern',
      finding: 'Pericarditis-like diffuse ST-elevation pattern suggested; correlate clinically and distinguish from territorial OMI.',
      basis: 'Manual decision tree adapted from the prior PHP Pericarditis rule: diffuse ST elevation across multiple lead territories or explicit pericarditis mimic selection.',
      inputs: [
        `ST status: ${formatValue(report.stSegment?.status)}`,
        `ST leads: ${formatValue(stLeads)}`,
        `Mimic considerations: ${formatValue(report.stSegment?.mimicConsiderations)}`,
        `PR segment status: ${formatValue(report.prInterval?.segmentStatus)}`,
      ],
    })];
  },
};
