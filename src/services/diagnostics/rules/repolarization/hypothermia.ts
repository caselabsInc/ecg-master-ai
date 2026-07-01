import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getQtcMs, hasClinicalAny, hasProlongedPr, rate, textIncludes } from './helpers';

export const hypothermiaRule: DiagnosticRule = {
  id: 'hypothermia-osborn-waves',
  evaluate(report): DiagnosticFinding[] {
    const bpm = rate(report);
    const osbornWave = report.lateWaveFindings?.jWaves === 'osborn' || report.tWaves?.morphology === 'camel_hump' || textIncludes(report, ['osborn', 'j wave of hypothermia', 'camel hump']);
    const hypothermiaContext = hasClinicalAny(report, ['hypothermia', 'cold exposure', 'core temperature', 'low temperature', 'rewarming']);
    const shivering = report.pWave?.abnormalAtrialActivity === 'artifact' || report.qrsComplex?.absentReason === 'artifact' || textIncludes(report, ['shivering', 'somatic tremor', 'baseline tremor']);
    const qtcMs = getQtcMs(report);

    if ((report.lateWaveFindings?.jWaves === 'early_repolarization' || report.stSegment?.mimicConsiderations?.includes('early_repolarization')) && !hypothermiaContext && typeof bpm === 'number' && bpm >= 60) {
      return [createFinding({
        id: 'exclude-hypothermia-normal-temperature',
        label: 'Safety exclusion: Hypothermia',
        finding: 'J-point elevation present, but core temperature is normal. Hypothermia is excluded; evaluate for Benign Early Repolarisation.',
        basis: 'Osborn waves should be interpreted with bradycardia, QT prolongation, hypothermia context, or shivering artifact rather than stable benign J-point elevation.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `J waves: ${formatValue(report.lateWaveFindings?.jWaves)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      })];
    }

    if (!(osbornWave && (hypothermiaContext || (typeof bpm === 'number' && bpm < 60)))) return [];

    const findings: DiagnosticFinding[] = [createFinding({
      id: 'dx-hypothermia-osborn-waves',
      label: 'Diagnostic suggestion: Hypothermia with Osborn waves',
      finding: 'Sinus bradycardia with First-Degree AV Block and Osborn J waves suggestive of Hypothermia.',
      basis: 'Manual hypothermia rule: bradycardia, PR prolongation, QT prolongation, shivering artifact, and inferior/lateral Osborn J-wave/camel-hump morphology.',
      inputs: [`Rate: ${formatValue(bpm)} bpm`, `PR prolonged: ${formatValue(hasProlongedPr(report))}`, `QTc: ${formatValue(qtcMs)} ms`, `J waves: ${formatValue(report.lateWaveFindings?.jWaves)}`, `Shivering artifact: ${formatValue(shivering)}`],
    })];

    if (hypothermiaContext || shivering || textIncludes(report, ['<30', '30 c', '86 f', 'severe hypothermia'])) {
      findings.push(createFinding({
        id: 'alert-severe-hypothermia',
        label: 'Critical alert: Hypothermia',
        finding: 'CRITICAL EMERGENCY: Severe Hypothermia suspected. Somatic tremor may mimic Ventricular Fibrillation. Handle patient with extreme gentleness to avoid triggering true VF. Initiate active, non-invasive rewarming.',
        basis: 'The hypothermic myocardium is highly irritable and can degenerate into AFib, VF, or asystole with rough handling.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`, `Artifact clues: ${formatValue(shivering)}`],
      }));
    }

    return findings;
  },
};
