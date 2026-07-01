import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getDepressedLeads, getDeviation, getElevatedLeads, hasActiveChestPain } from './ischemiaHelpers';

export const leftMainMultivesselIschemiaRule: DiagnosticRule = {
  id: 'left-main-multivessel-ischemia',
  evaluate(report) {
    const depressedLeads = getDepressedLeads(report);
    const elevatedLeads = getElevatedLeads(report);
    const avrElevation = getDeviation(report, 'aVR') ?? (elevatedLeads.includes('avr') ? 1 : 0);
    const v1Elevation = getDeviation(report, 'V1') ?? (elevatedLeads.includes('v1') ? 1 : 0);
    const diffuseDepressionCount = depressedLeads.filter((lead) => Math.abs(getDeviation(report, lead) ?? -1) >= 1 || report.stSegment?.status === 'depressed').length;
    const leftMainPattern = report.stSegment?.omiPattern === 'left_main_or_multivessel' || (avrElevation >= 1 && avrElevation >= v1Elevation && diffuseDepressionCount >= 6);
    if (!leftMainPattern) return [];

    return [
      createFinding({
        id: 'dx-left-main-multivessel-ischemia',
        label: 'Diagnostic suggestion: Left Main / Multivessel ischemia',
        finding: 'Diffuse Subendocardial Ischemia: Suspected Left Main Coronary Artery (LMCA) Occlusion or Severe Triple-Vessel Disease.',
        basis: 'Manual ischemia rule: aVR ST elevation >=1 mm, aVR elevation >= V1, and diffuse horizontal/downsloping ST depression in six or more leads indicates global subendocardial ischemia.',
        inputs: [`aVR STE: ${formatValue(avrElevation)} mm`, `V1 STE: ${formatValue(v1Elevation)} mm`, `Depressed leads: ${formatValue(depressedLeads)}`, `Rate: ${formatValue(getBpm(report))} bpm`],
      }),
      createFinding({
        id: 'alert-left-main-multivessel-ischemia',
        label: 'Critical alert: Left Main pattern',
        finding: 'CRITICAL EMERGENCY: Left Main Coronary Artery (LMCA) occlusion pattern detected. Extremely high risk of cardiogenic shock and cardiac arrest. Activate emergency cardiothoracic surgery / cath lab services immediately.',
        basis: 'LMCA/triple-vessel ischemia can deprive a large proportion of LV myocardium of blood flow.',
        inputs: [`Active chest pain: ${formatValue(hasActiveChestPain(report))}`],
      }),
    ];
  },
};
