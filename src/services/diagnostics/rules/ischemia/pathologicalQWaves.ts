import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getElevatedLeads, getQWaveTerritory, getStemiTerritories, normalizedLeads } from './ischemiaHelpers';

export const pathologicalQWavesRule: DiagnosticRule = {
  id: 'pathological-q-waves',
  evaluate(report) {
    const findings = [];
    const elevatedLeads = getElevatedLeads(report);
    const stemiTerritories = getStemiTerritories(report);
    const qWaveLeads = normalizedLeads(report.qWaves?.leads).filter((lead) => lead !== 'avr');
    const pathologicalQ = report.qWaves?.present === true &&
      ((report.qWaves?.widthSmallBoxes ?? 0) >= 1 || Object.values(report.qWaves?.leadFindings ?? {}).some((finding) => finding.width === 'pathological')) &&
      ((report.qWaves?.depthPercent ?? 0) >= 25 || Object.values(report.qWaves?.leadFindings ?? {}).some((finding) => finding.depth === 'pathological')) &&
      (qWaveLeads.length >= 2 || (report.qWaves?.territories?.length ?? 0) > 0);

    if (pathologicalQ) {
      findings.push(createFinding({
        id: 'dx-pathological-q-waves-prior-infarct',
        label: 'Diagnostic suggestion: pathological Q waves / prior infarct',
        finding: `Pathological Q waves suggesting prior ${getQWaveTerritory(report)} Myocardial Infarction (Old MI).`,
        basis: 'Manual Q-wave rule: Q-wave duration >=0.04 s or pathological width flag, depth >=25% of R-wave height or pathological depth flag, and pattern in two or more contiguous leads excluding aVR.',
        inputs: [`Q-wave leads: ${formatValue(qWaveLeads)}`, `Width small boxes: ${formatValue(report.qWaves?.widthSmallBoxes)}`, `Depth percent: ${formatValue(report.qWaves?.depthPercent)}`, `Territories: ${formatValue(report.qWaves?.territories)}`],
      }));
      if (report.stSegment?.status === 'elevated' || stemiTerritories.length > 0) {
        findings.push(createFinding({
          id: 'alert-q-waves-with-active-stemi',
          label: 'High-priority alert: Q waves with ST elevation',
          finding: 'WARNING: Pathological Q waves are accompanied by active ST-segment elevation. Acute evolving transmural infarction suspected. Initiate emergency STEMI protocols.',
          basis: 'Q waves with active ST elevation may represent acute evolving transmural infarction rather than old scar alone.',
          inputs: [`ST leads: ${formatValue(elevatedLeads)}`, `Q-wave leads: ${formatValue(qWaveLeads)}`],
        }));
      }
    } else if (report.qWaves?.present === true) {
      findings.push(createFinding({
        id: 'exclude-pathological-q-waves-physiologic',
        label: 'Safety exclusion: pathological Q waves',
        finding: 'Q-wave duration is less than 0.04 seconds or depth is less than 25% of R-wave height. Bypassed as physiological septal Q wave unless other pathological criteria are documented.',
        basis: 'Small narrow lateral q waves and isolated lead III/aVR Q waves can be physiological.',
        inputs: [`Q-wave leads: ${formatValue(report.qWaves?.leads)}`, `Width small boxes: ${formatValue(report.qWaves?.widthSmallBoxes)}`, `Depth percent: ${formatValue(report.qWaves?.depthPercent)}`],
      }));
    }

    return findings;
  },
};
