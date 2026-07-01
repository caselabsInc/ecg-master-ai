import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getStemiTerritories, hasLbbbOrPaced, hasVentricularAneurysmClue, isDiffusePericarditisLike } from './ischemiaHelpers';

export const stemiMimicsRule: DiagnosticRule = {
  id: 'stemi-mimics',
  evaluate(report) {
    const findings = [];
    const stemiTerritories = getStemiTerritories(report);
    if (!hasLbbbOrPaced(report) && isDiffusePericarditisLike(report) && stemiTerritories.length > 0) {
      findings.push(createFinding({
        id: 'exclude-stemi-pericarditis-pattern',
        label: 'Safety exclusion: regional STEMI',
        finding: 'Diffuse concave ST elevation with PR depression suggests Acute Pericarditis. Regional STEMI criteria should be withheld unless reciprocal/territorial occlusion evidence is present.',
        basis: 'Pericarditis is a false-positive STEMI trap with diffuse concave elevation and PR depression.',
        inputs: [`ST morphology: ${formatValue(report.stSegment?.morphology)}`, `PR segment: ${formatValue(report.prInterval?.segmentStatus)}`, `ST leads: ${formatValue(report.stSegment?.leads)}`],
      }));
    }
    if (!hasLbbbOrPaced(report) && hasVentricularAneurysmClue(report) && stemiTerritories.length > 0) {
      findings.push(createFinding({
        id: 'exclude-stemi-ventricular-aneurysm',
        label: 'Safety exclusion: persistent ST elevation',
        finding: 'Persistent ST elevation with old pathological Q-wave context may represent chronic left ventricular aneurysm rather than acute STEMI.',
        basis: 'LV aneurysm can cause chronic ST elevation weeks after infarction and should be distinguished from new occlusion.',
        inputs: [`Q waves: ${formatValue(report.qWaves?.leads)}`, `Mimics: ${formatValue(report.stSegment?.mimicConsiderations)}`],
      }));
    }
    return findings;
  },
};
