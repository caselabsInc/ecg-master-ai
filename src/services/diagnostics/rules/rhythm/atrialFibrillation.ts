import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { afResponseLabel, getSupraventricularRhythmContext } from './supraventricularRhythmHelpers';

export const atrialFibrillationRule: DiagnosticRule = {
  id: 'atrial-fibrillation',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const afib = ctx.rhythm === 'atrial_fibrillation' ||
      (report.pWave?.presence === 'absent' && ctx.pActivity === 'fibrillatory_waves' && report.heartRate?.regularity === 'irregular');

    if (afib) {
      findings.push(createFinding({
        id: 'dx-atrial-fibrillation',
        label: 'Diagnostic suggestion: Atrial Fibrillation (AFib)',
        finding: `Atrial Fibrillation (AFib) with ${afResponseLabel(ctx.rate)} pattern suggested.`,
        basis: 'Manual AFib rule: absent organised P waves, fibrillatory atrial activity or quivering baseline, unmeasurable PR relationship, and irregularly irregular ventricular response.',
        inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Atrial rate: ${formatValue(ctx.atrialRate)} bpm`, `Regularity: ${formatValue(report.heartRate?.regularity)}`, `P-wave activity: ${formatValue(ctx.pActivity)}`, `QRS duration: ${formatValue(ctx.qrsMs)} ms`],
      }));
      findings.push(createFinding({
        id: 'alert-atrial-fibrillation-stroke-risk',
        label: 'High-priority alert: Atrial Fibrillation',
        finding: 'WARNING: Atrial Fibrillation detected. Patient is at increased thromboembolic stroke risk; anticoagulant prophylaxis must be evaluated by the treating clinician.',
        basis: 'AFib eliminates coordinated atrial contraction and can promote atrial blood pooling and thrombus formation.',
        inputs: [`Rate response: ${afResponseLabel(ctx.rate)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
      if (typeof ctx.rate === 'number' && ctx.rate > 150 && ctx.symptomatic) {
        findings.push(createFinding({
          id: 'alert-unstable-rapid-afib',
          label: 'High-priority alert: unstable rapid AFib',
          finding: 'WARNING: Rapid AFib with instability symptoms may require immediate synchronized cardioversion.',
          basis: 'Rapid ventricular response above 150 bpm with hemodynamic compromise is an emergency rhythm scenario.',
          inputs: [`Rate: ${formatValue(ctx.rate)} bpm`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }));
      }
    } else if (report.heartRate?.regularity === 'irregular' && report.pWave?.presence === 'present') {
      findings.push(createFinding({
        id: 'exclude-afib-visible-p-waves',
        label: 'Safety exclusion: Atrial Fibrillation',
        finding: 'Rhythm is irregular, but distinct P waves are present. AFib is ruled out; evaluate for sinus arrhythmia, MAT, WAP, or ectopy.',
        basis: 'AFib requires absence of organised P waves.',
        inputs: [`P waves: ${formatValue(report.pWave?.presence)}`, `P-wave morphology: ${formatValue(report.pWave?.morphology)}`],
      }));
    }

    return findings;
  },
};
