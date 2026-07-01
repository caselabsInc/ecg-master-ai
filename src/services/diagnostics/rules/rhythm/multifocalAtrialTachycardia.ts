import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getSupraventricularRhythmContext, pWaveShapeCountAtLeastThree } from './supraventricularRhythmHelpers';

export const multifocalAtrialTachycardiaRule: DiagnosticRule = {
  id: 'multifocal-atrial-tachycardia',
  evaluate(report) {
    const ctx = getSupraventricularRhythmContext(report);
    const matOrWap = report.pWave?.presence === 'present' &&
      pWaveShapeCountAtLeastThree(report) &&
      report.heartRate?.regularity === 'irregular' &&
      report.prInterval?.regularity === 'not_constant' &&
      ctx.narrowQrs;

    if (matOrWap && typeof ctx.rate === 'number' && ctx.rate > 100) {
      return [
        createFinding({
          id: 'dx-multifocal-atrial-tachycardia',
          label: 'Diagnostic suggestion: Multifocal Atrial Tachycardia (MAT)',
          finding: 'Multifocal Atrial Tachycardia (MAT) pattern suggested.',
          basis: 'Manual MAT rule: rate >100 bpm, irregularly irregular rhythm, visible P waves with at least three morphologies, variable PR intervals, and narrow QRS.',
          inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`, `PR regularity: ${formatValue(report.prInterval?.regularity)}`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
        }),
        createFinding({
          id: 'alert-mat-pulmonary-disease',
          label: 'High-priority alert: MAT',
          finding: 'WARNING: MAT detected. Highly associated with severe pulmonary disease, COPD, and hypoxia. Avoid non-selective beta-blockers when bronchospastic disease is present.',
          basis: 'MAT is commonly driven by pulmonary disease, hypoxia, hypercapnia, or electrolyte deficiency.',
          inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }),
      ];
    }

    if (report.pWave?.morphology === 'variable' && report.pWave?.presence === 'absent') {
      return [createFinding({
        id: 'exclude-mat-no-distinct-p-waves',
        label: 'Safety exclusion: MAT/WAP',
        finding: 'No distinct P waves are documented. MAT/WAP are ruled out; evaluate for Atrial Fibrillation if the rhythm is irregular.',
        basis: 'MAT and WAP require visible, structured P waves with multiple morphologies.',
        inputs: [`P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`],
      })];
    }

    return [];
  },
};
