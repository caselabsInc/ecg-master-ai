import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasActiveChestPain } from './ischemiaHelpers';

export const hyperacuteTWavesRule: DiagnosticRule = {
  id: 'hyperacute-t-waves',
  evaluate(report) {
    const hyperacuteT = report.tWaves?.status === 'hyperacute' || (report.tWaves?.morphology === 'broad_based' && report.tWaves?.status === 'tall_peaked');
    if (hyperacuteT && report.tWaves?.morphology !== 'narrow_tented' && !report.stSegment?.mimicConsiderations?.includes('hyperkalemia')) {
      return [
        createFinding({
          id: 'dx-hyperacute-t-waves',
          label: 'Diagnostic suggestion: hyperacute T waves',
          finding: 'Abnormally tall, symmetric, broad-based T waves suggesting Hyperacute T-wave Pattern (Hyper-early Myocardial Infarction Phase).',
          basis: 'Manual hyperacute T-wave rule: tall, symmetric, broad-based T waves in contiguous leads, excluding narrow tented hyperkalemic T waves.',
          inputs: [`T-wave status: ${formatValue(report.tWaves?.status)}`, `T-wave morphology: ${formatValue(report.tWaves?.morphology)}`, `T-wave leads: ${formatValue(report.tWaves?.leads)}`],
        }),
        createFinding({
          id: 'alert-hyperacute-t-waves',
          label: 'Critical alert: hyperacute T waves',
          finding: 'CRITICAL EMERGENCY: Hyperacute T waves detected in contiguous leads. This is the earliest marker of acute coronary occlusion. Obtain a repeat 12-lead ECG immediately and prepare for emergency cardiac activation.',
          basis: 'Hyperacute T waves may precede diagnostic ST elevation in acute coronary occlusion.',
          inputs: [`Active chest pain: ${formatValue(hasActiveChestPain(report))}`],
        }),
      ];
    }

    if (report.tWaves?.morphology === 'narrow_tented' || report.stSegment?.mimicConsiderations?.includes('hyperkalemia')) {
      return [createFinding({
        id: 'exclude-hyperacute-t-waves-hyperkalemia',
        label: 'Safety exclusion: hyperacute T waves',
        finding: 'Tall T waves are narrow-based and tented. Hyperacute ischemic pattern is excluded; evaluate for Hyperkalemia.',
        basis: 'Hyperkalemia causes narrow tented T waves, unlike broad-based hyperacute ischemic T waves.',
        inputs: [`T-wave morphology: ${formatValue(report.tWaves?.morphology)}`, `Mimics: ${formatValue(report.stSegment?.mimicConsiderations)}`],
      })];
    }

    return [];
  },
};
