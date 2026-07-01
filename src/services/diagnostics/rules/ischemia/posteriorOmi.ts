import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getDepressedLeads, hasActiveChestPain, leadMeetsStdThreshold } from './ischemiaHelpers';

export const posteriorOmiRule: DiagnosticRule = {
  id: 'posterior-omi',
  evaluate(report) {
    const findings = [];
    const depressedLeads = getDepressedLeads(report);
    const posteriorDepression = ['v1', 'v2', 'v3'].filter((lead) => leadMeetsStdThreshold(report, lead)).length >= 2;
    const posteriorOmi = report.stSegment?.omiPattern === 'posterior_omi' ||
      (posteriorDepression && (report.tWaves?.status === 'hyperacute' || report.tWaves?.morphology === 'symmetric' || report.stSegment?.posteriorLeadsUsed));

    if (posteriorOmi) {
      findings.push(createFinding({
        id: 'dx-posterior-omi',
        label: 'Diagnostic suggestion: Posterior OMI',
        finding: 'Acute Posterior Wall Myocardial Infarction (Posterior OMI) [STEMI Equivalent].',
        basis: 'Manual posterior OMI rule: horizontal/downsloping ST depression in V1-V3 with posterior reciprocal clues, tall upright T-wave/R-wave clues when documented, or confirming posterior lead elevation.',
        inputs: [`Depressed leads: ${formatValue(depressedLeads)}`, `Posterior leads used: ${formatValue(report.stSegment?.posteriorLeadsUsed)}`, `OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`],
      }));
      findings.push(createFinding({
        id: 'alert-posterior-omi',
        label: 'Critical alert: Posterior OMI',
        finding: 'CRITICAL: Posterior STEMI equivalent suspected. Standard anterior ST depressions represent posterior injury. Do not wait for standard ST elevation; activate emergency cardiac catheterisation protocol.',
        basis: 'Posterior OMI is a STEMI equivalent that can be missed on standard 12-lead ECG.',
        inputs: [`Active chest pain: ${formatValue(hasActiveChestPain(report))}`],
      }));
    } else if (posteriorDepression && report.tWaves?.status === 'inverted') {
      findings.push(createFinding({
        id: 'exclude-posterior-omi-anterior-ischemia',
        label: 'Safety exclusion: Posterior OMI',
        finding: 'Anterior ST depressions detected, but T waves are inverted or posterior R-wave criteria are not met. Suspect primary anterior subendocardial ischemia rather than posterior OMI.',
        basis: 'Posterior OMI mirror pattern usually has upright prominent anterior T waves rather than narrow inverted T waves.',
        inputs: [`T-wave status: ${formatValue(report.tWaves?.status)}`, `Depressed leads: ${formatValue(depressedLeads)}`],
      }));
    }
    return findings;
  },
};
