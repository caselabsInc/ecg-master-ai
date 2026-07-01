import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { flutterConductionLabel, getSupraventricularRhythmContext } from './supraventricularRhythmHelpers';

export function hasAtrialFlutterPattern(report: Parameters<DiagnosticRule['evaluate']>[0]) {
  const ctx = getSupraventricularRhythmContext(report);
  const clinicianSelectedFlutter = ctx.rhythm === 'atrial_flutter';
  const flutterWaveEvidence = ctx.pActivity === 'flutter_waves' ||
    (typeof ctx.atrialRate === 'number' && ctx.atrialRate >= 250 && ctx.atrialRate <= 350 && report.pWave?.presence === 'absent');
  return flutterWaveEvidence || (clinicianSelectedFlutter && report.pWave?.presence !== 'present');
}

export const atrialFlutterRule: DiagnosticRule = {
  id: 'atrial-flutter',
  evaluate(report) {
    const findings = [];
    const ctx = getSupraventricularRhythmContext(report);
    const clinicianSelectedFlutter = ctx.rhythm === 'atrial_flutter';
    const flutterWaveEvidence = ctx.pActivity === 'flutter_waves' ||
      (typeof ctx.atrialRate === 'number' && ctx.atrialRate >= 250 && ctx.atrialRate <= 350 && report.pWave?.presence === 'absent');
    const flutter = flutterWaveEvidence || (clinicianSelectedFlutter && report.pWave?.presence !== 'present');

    if (flutter) {
      const conduction = flutterConductionLabel(report);
      findings.push(createFinding({
        id: 'dx-atrial-flutter',
        label: 'Diagnostic suggestion: Atrial Flutter',
        finding: `Atrial Flutter with ${conduction} AV Block pattern suggested.`,
        basis: 'Manual atrial flutter rule: absent true P waves, regular sawtooth/flutter-wave atrial activity, atrial rate 250-350 bpm, and ventricular response determined by AV conduction ratio.',
        inputs: [`Atrial rate: ${formatValue(ctx.atrialRate)} bpm`, `Ventricular rate: ${formatValue(ctx.rate)} bpm`, `P-wave activity: ${formatValue(ctx.pActivity)}`, `Conduction ratio: ${conduction}`],
      }));
      findings.push(createFinding({
        id: 'alert-atrial-flutter',
        label: 'High-priority alert: Atrial Flutter',
        finding: 'WARNING: Atrial Flutter detected. Loss of atrial kick is present. Patient requires evaluation for stroke risk and rate-control therapy.',
        basis: 'Atrial flutter can impair filling and carries thromboembolic risk similar to other sustained atrial arrhythmias.',
        inputs: [`Ventricular response: ${formatValue(ctx.rate)} bpm`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
      if (typeof ctx.rate === 'number' && ctx.rate >= 250) {
        findings.push(createFinding({
          id: 'alert-atrial-flutter-one-to-one',
          label: 'Critical alert: 1:1 Atrial Flutter',
          finding: 'CRITICAL: Atrial Flutter with possible 1:1 conduction is highly unstable and can degenerate into ventricular fibrillation.',
          basis: 'Very rapid ventricular response near the atrial flutter rate suggests 1:1 AV conduction.',
          inputs: [`Atrial rate: ${formatValue(ctx.atrialRate)} bpm`, `Ventricular rate: ${formatValue(ctx.rate)} bpm`],
        }));
      }
    } else if (clinicianSelectedFlutter && !flutterWaveEvidence && report.pWave?.presence === 'present') {
      findings.push(createFinding({
        id: 'exclude-atrial-flutter-no-sawtooth',
        label: 'Safety exclusion: Atrial Flutter',
        finding: 'Sawtooth waveforms are absent and standard P waves are present. Atrial Flutter is excluded.',
        basis: 'Atrial flutter requires continuous structured flutter waves rather than ordinary sinus/atrial P waves.',
        inputs: [`P waves: ${formatValue(report.pWave?.presence)}`, `P-wave activity: ${formatValue(ctx.pActivity)}`],
      }));
    }

    return findings;
  },
};
