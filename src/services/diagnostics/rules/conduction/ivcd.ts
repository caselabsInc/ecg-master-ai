import { createFinding, formatValue, hasClinicalKeyword, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasCompleteLbbbForConductionRules, hasCompleteRbbbForConductionRules } from './bundleBranchBlock';

export const ivcdRule: DiagnosticRule = {
  id: 'ivcd',
  evaluate(report) {
    const qrsMs = report.qrsComplex?.calculatedMs;
    const isWide = typeof qrsMs === 'number' && qrsMs >= 120;
    const hasSpecificBbb = hasCompleteRbbbForConductionRules(report) || hasCompleteLbbbForConductionRules(report);
    const isIvcd = isWide && isSupraventricularConduction(report) && !hasSpecificBbb && (report.qrsComplex?.bbb?.pattern === 'ivcd' || report.qrsComplex?.findings?.includes('bbb') || report.qrsComplex?.morphology === 'bbb');
    const chestPain = hasClinicalKeyword(report, ['chest pain', 'ischemia', 'infarction', 'stemi']);

    if (!isWide) {
      return [];
    }

    if (!isSupraventricularConduction(report)) {
      return [createFinding({
        id: 'exclude-ivcd-ventricular-origin',
        label: 'Safety exclusion: nonspecific IVCD',
        finding: 'Wide QRS of ventricular or paced origin detected; nonspecific IVCD cannot be confidently evaluated.',
        basis: 'Nonspecific IVCD applies to supraventricular impulses with delayed intraventricular conduction, not ventricular-origin or paced complexes.',
        inputs: [`QRS morphology: ${formatValue(report.qrsComplex?.morphology)}`, `QRS findings: ${formatValue(report.qrsComplex?.findings)}`],
      })];
    }

    if (!isIvcd) return [];

    const findings = [createFinding({
      id: 'dx-nonspecific-ivcd',
      label: 'Diagnostic suggestion: nonspecific IVCD',
      finding: 'Nonspecific Intraventricular Conduction Delay (IVCD) pattern suggested.',
      basis: 'Manual conduction rule: QRS >=120 ms with supraventricular conduction and without complete RBBB or complete LBBB morphology.',
      inputs: [
        `QRS duration: ${formatValue(qrsMs)} ms`,
        `BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`,
        `V1 morphology: ${formatValue(report.qrsComplex?.v1Morphology)}`,
        `V6 morphology: ${formatValue(report.qrsComplex?.v6Morphology)}`,
      ],
    })];

    if (chestPain) {
      findings.push(createFinding({
        id: 'alert-ivcd-ischemic-symptoms',
        label: 'IVCD ischemia correlation',
        finding: 'New or symptomatic nonspecific IVCD with ischemic symptoms may reflect diffuse Purkinje/intraventricular conduction injury; correlate urgently.',
        basis: 'Nonspecific IVCD can occur with acute diffuse or multivessel ischemic injury.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
