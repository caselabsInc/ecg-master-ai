import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getElevatedLeads, hasActiveChestPain, hasLbbbOrPaced } from './ischemiaHelpers';

export const sgarbossaRule: DiagnosticRule = {
  id: 'sgarbossa',
  evaluate(report) {
    const findings: DiagnosticFinding[] = [];
    const lbbbOrPaced = hasLbbbOrPaced(report);
    const elevatedLeads = getElevatedLeads(report);
    if (!(lbbbOrPaced && (report.stSegment?.stemiCriteriaMet || elevatedLeads.length > 0))) return findings;

    findings.push(createFinding({
      id: 'exclude-standard-stemi-lbbb-paced',
      label: 'Safety exclusion: standard STEMI criteria',
      finding: 'Concomitant LBBB or paced ventricular rhythm detected. Standard STEMI criteria are invalid; Sgarbossa sub-routine activated.',
      basis: 'LBBB and paced rhythms produce secondary ST-T changes; acute MI assessment should use Sgarbossa/modified Sgarbossa rather than ordinary ST elevation thresholds.',
      inputs: [`BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`, `Pacer spikes: ${formatValue(report.rhythm?.pacerSpikes)}`, `OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`],
    }));

    if (report.stSegment?.omiPattern === 'modified_sgarbossa_positive' || report.stSegment?.omiPattern === 'sgarbossa_positive') {
      const modified = report.stSegment.omiPattern === 'modified_sgarbossa_positive';
      findings.push(createFinding({
        id: modified ? 'dx-modified-sgarbossa-positive' : 'dx-sgarbossa-positive',
        label: modified ? 'Diagnostic suggestion: Smith-Modified Sgarbossa positive' : 'Diagnostic suggestion: Sgarbossa positive',
        finding: modified ? 'Acute Myocardial Infarction in the presence of LBBB/Paced Rhythm (Smith-Modified Sgarbossa Positive).' : 'Acute Myocardial Infarction in the presence of LBBB/Paced Rhythm (Sgarbossa Positive).',
        basis: 'Manual ischemia rule: LBBB/paced baseline with selected Sgarbossa-positive OMI pattern indicates a STEMI equivalent masked by abnormal ventricular activation.',
        inputs: [`OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }));
      findings.push(createFinding({
        id: 'alert-sgarbossa-positive',
        label: 'Critical alert: Sgarbossa positive',
        finding: modified ? 'CRITICAL: Smith-Modified Sgarbossa criteria met. Proportional extreme discordance confirms acute coronary occlusion behind the bundle branch block. Activate cardiac catheterisation protocol immediately.' : 'CRITICAL: Sgarbossa criteria met. Evolving STEMI equivalent confirmed in LBBB/Paced rhythm. Prepare for urgent coronary reperfusion therapy.',
        basis: 'Positive Sgarbossa criteria in LBBB/paced rhythm indicate acute coronary occlusion physiology.',
        inputs: [`Active chest pain: ${formatValue(hasActiveChestPain(report))}`],
      }));
    }

    return findings;
  },
};
