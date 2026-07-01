import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { TERRITORIES, getElevatedLeads, hasActiveChestPain, hasLbbbOrPaced } from './ischemiaHelpers';

export const deWinterPatternRule: DiagnosticRule = {
  id: 'de-winter-pattern',
  evaluate(report) {
    const elevatedLeads = getElevatedLeads(report);
    const deWinter = report.stSegment?.omiPattern === 'de_winter' || report.tWaves?.syndromePattern === 'de_winter';
    if (!(deWinter && !hasLbbbOrPaced(report) && !elevatedLeads.some((lead) => TERRITORIES.anterior.includes(lead) || TERRITORIES.septal.includes(lead)))) return [];

    return [
      createFinding({
        id: 'dx-de-winter-pattern',
        label: 'Diagnostic suggestion: De Winter pattern',
        finding: 'De Winter Hyperacute Precordial T-wave Pattern [LAD Occlusion STEMI Equivalent].',
        basis: 'Manual ischemia rule: upsloping precordial ST depression with broad hyperacute T waves and aVR elevation, without ordinary precordial ST elevation, is a proximal LAD occlusion equivalent.',
        inputs: [`OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`, `T-wave syndrome: ${formatValue(report.tWaves?.syndromePattern)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`],
      }),
      createFinding({
        id: 'alert-de-winter-pattern',
        label: 'Critical alert: De Winter pattern',
        finding: 'CRITICAL EMERGENCY: De Winter hyperacute T-wave pattern detected. This is a STEMI equivalent indicating acute proximal LAD artery occlusion. Activate emergency catheterisation protocol immediately.',
        basis: 'de Winter pattern is a STEMI equivalent requiring emergent reperfusion evaluation.',
        inputs: [`Active chest pain: ${formatValue(hasActiveChestPain(report))}`],
      }),
    ];
  },
};
