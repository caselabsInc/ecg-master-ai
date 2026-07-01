import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getDeviation, getStemiTerritories } from './ischemiaHelpers';

export const rightVentricularMiRule: DiagnosticRule = {
  id: 'right-ventricular-mi',
  evaluate(report) {
    const findings = [];
    const inferiorStemi = getStemiTerritories(report).some((territory) => territory.key === 'inferior');
    const leadIII = getDeviation(report, 'III') ?? 0;
    const leadII = getDeviation(report, 'II') ?? 0;
    const v1Elevation = getDeviation(report, 'V1') ?? 0;
    const v4r = getDeviation(report, 'V4R') ?? 0;
    const v2Depression = Math.abs(Math.min(getDeviation(report, 'V2') ?? 0, 0));
    const rvmi = report.stSegment?.omiPattern === 'right_ventricular_mi' || (inferiorStemi && (v4r >= 0.5 || (leadIII > leadII && v1Elevation >= 0.5 && v2Depression >= 0.5)));

    if (rvmi) {
      findings.push(createFinding({
        id: 'dx-right-ventricular-mi',
        label: 'Diagnostic suggestion: RVMI',
        finding: 'Acute Inferior Myocardial Infarction with Right Ventricular Involvement (RVMI).',
        basis: 'Manual RVMI rule: inferior STEMI with lead III elevation greater than lead II and/or right-sided V4R ST elevation >=0.5 mm, with V1 STE/V2 STD as standard 12-lead surrogate.',
        inputs: [`Lead III STE: ${formatValue(leadIII)} mm`, `Lead II STE: ${formatValue(leadII)} mm`, `V4R STE: ${formatValue(v4r)} mm`, `Right-sided leads used: ${formatValue(report.stSegment?.rightSidedLeadsUsed)}`],
      }));
      findings.push(createFinding({
        id: 'alert-rvmi-preload-contraindication',
        label: 'Critical contraindication: RVMI',
        finding: 'CRITICAL CONTRAINDICATION: Acute Right Ventricular Infarction confirmed. Patient is highly preload-dependent. Nitroglycerin, Morphine, and Diuretics are strictly CONTRAINDICATED. Prepare for volume resuscitation if hypotensive.',
        basis: 'RV infarction can cause preload-dependent shock; venodilators/diuretics can precipitate collapse.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    } else if (inferiorStemi && report.stSegment?.rightSidedLeadsUsed && v4r < 0.5) {
      findings.push(createFinding({
        id: 'exclude-rvmi-v4r-negative',
        label: 'Safety exclusion: RVMI',
        finding: 'Right-sided precordial lead V4R does not show significant ST elevation (<0.5mm). Isolated inferior MI is suspected; RVMI is excluded.',
        basis: 'V4R is the key right-sided confirmation lead for RVMI.',
        inputs: [`V4R STE: ${formatValue(v4r)} mm`],
      }));
    }

    return findings;
  },
};
