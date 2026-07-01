import { createFinding, formatValue, intervalsAreRegular } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { ectopyIncludes, isSymptomatic, textIncludes, underlyingRhythmLabel } from './ectopyHelpers';

export const blockedPrematureAtrialComplexesRule: DiagnosticRule = {
  id: 'blocked-premature-atrial-complexes',
  evaluate(report) {
    const findings = [];
    const ectopy = report.rhythm?.ectopy ?? [];
    const ppRegular = intervalsAreRegular(report.heartRate?.ppIntervalLargeBoxes);
    const hasDroppedBeat = report.prInterval?.droppedBeats === true;
    const blockedPac = report.prInterval?.droppedBeatPattern === 'blocked_pac';
    const symptomatic = isSymptomatic(report);

    if (blockedPac || (hasDroppedBeat && !ppRegular && textIncludes(report, ['blocked pac', 'non-conducted pac', 'buried p', 't wave distortion']))) {
      findings.push(createFinding({
        id: 'dx-blocked-premature-atrial-complexes',
        label: 'Diagnostic suggestion: Non-conducted / Blocked PACs',
        finding: `${underlyingRhythmLabel(report)} with Non-conducted (Blocked) Premature Atrial Complexes (PACs) pattern suggested.`,
        basis: 'Manual blocked PAC rule: sudden pause/dropped QRS caused by a premature abnormal P wave, often buried in the preceding T wave, with irregular P-P timing that distinguishes it from Mobitz II.',
        inputs: [`Dropped beats: ${formatValue(report.prInterval?.droppedBeats)}`, `Dropped-beat pattern: ${formatValue(report.prInterval?.droppedBeatPattern)}`, `P-P regular by intervals: ${formatValue(ppRegular)}`, `Details text: ${formatValue(report.pWave?.notes ?? report.additionalNotes)}`],
      }));
      if (symptomatic || ectopyIncludes(report, 'bigeminy') || ectopyIncludes(report, 'trigeminy')) {
        findings.push(createFinding({
          id: 'alert-symptomatic-blocked-pacs',
          label: 'High-priority alert: blocked PACs',
          finding: 'Blocked PACs in a repetitive pattern or with symptoms can cause clinically important bradycardia/pauses. Check hemodynamic stability and perfusion.',
          basis: 'Recurrent non-conducted PACs may mimic AV block and can create symptomatic pauses.',
          inputs: [`Symptoms/instability: ${formatValue(symptomatic)}`, `Ectopy pattern: ${formatValue(ectopy)}`],
        }));
      }
    } else if (hasDroppedBeat && ppRegular) {
      findings.push(createFinding({
        id: 'exclude-blocked-pac-regular-pp',
        label: 'Safety exclusion: Blocked PAC',
        finding: 'Regular P-P interval detected during pause. Blocked PAC is excluded; evaluate for Second-Degree AV Block Type II.',
        basis: 'Blocked PACs arrive early and disrupt atrial timing; regular P-P timing across a dropped QRS favors true AV block.',
        inputs: [`Dropped beats: ${formatValue(report.prInterval?.droppedBeats)}`, `P-P regular by intervals: ${formatValue(ppRegular)}`],
      }));
    }

    return findings;
  },
};
