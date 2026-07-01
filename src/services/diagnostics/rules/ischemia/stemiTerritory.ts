import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getDepressedLeads, getElevatedLeads, getStemiTerritories, hasActiveChestPain, hasLbbbOrPaced, hasReciprocalChangesForTerritory, hasVentricularAneurysmClue, isDiffusePericarditisLike } from './ischemiaHelpers';

export const stemiTerritoryRule: DiagnosticRule = {
  id: 'stemi-territory',
  evaluate(report) {
    const findings = [];
    const depressedLeads = getDepressedLeads(report);
    const elevatedLeads = getElevatedLeads(report);
    const activeChestPain = hasActiveChestPain(report);
    for (const territory of getStemiTerritories(report)) {
      if (hasLbbbOrPaced(report) || isDiffusePericarditisLike(report) || hasVentricularAneurysmClue(report)) continue;
      const reciprocal = hasReciprocalChangesForTerritory(territory.key, depressedLeads) || report.stSegment?.hasReciprocalChanges === true;
      findings.push(createFinding({
        id: `dx-${territory.key}-stemi`,
        label: `Diagnostic suggestion: Acute ${territory.label} STEMI`,
        finding: `Acute ${territory.label} ST-Elevation Myocardial Infarction (STEMI).`,
        basis: 'Manual STEMI territory rule: J-point ST elevation meeting demographic lead thresholds in two or more contiguous leads, grouped by coronary territory.',
        inputs: [`Territory leads: ${formatValue(territory.leads)}`, `Suspected artery: ${territory.artery}`, `Reciprocal changes: ${formatValue(reciprocal)}`, `ST deviations: ${formatValue(report.stSegment?.leadDeviationMm)}`],
      }));
      findings.push(createFinding({
        id: `alert-${territory.key}-stemi`,
        label: `Critical alert: ${territory.label} STEMI`,
        finding: 'CRITICAL EMERGENCY: Evolving acute STEMI detected. Initiate immediate emergency protocol, administer aspirin if clinically indicated, and activate the cardiac catheterisation lab.',
        basis: 'Territorial STEMI indicates acute coronary occlusion requiring emergent reperfusion evaluation.',
        inputs: [`Suspected artery: ${territory.artery}`, `Active chest pain: ${formatValue(activeChestPain)}`],
      }));
      if (reciprocal) {
        findings.push(createFinding({
          id: `dx-${territory.key}-stemi-reciprocal-confirmation`,
          label: 'Diagnostic suggestion: reciprocal STEMI confirmation',
          finding: 'ST-Elevation Myocardial Infarction (STEMI) confirmed by regional reciprocal ST-segment depression.',
          basis: 'Reciprocal ST depression in anatomically opposite leads strongly supports active regional transmural injury.',
          inputs: [`Elevated leads: ${formatValue(elevatedLeads)}`, `Depressed leads: ${formatValue(depressedLeads)}`],
        }));
      }
    }
    return findings;
  },
};
