import { getBpm, getClinicalText } from '../../helpers';
import type { DiagnosticRule } from '../../types';

export function textIncludes(report: Parameters<DiagnosticRule['evaluate']>[0], keywords: string[]) {
  const text = `${getClinicalText(report)} ${report.qrsComplex?.otherDetails ?? ''}`.toLowerCase();
  return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
}

export function getPreExcitationInputs(report: Parameters<DiagnosticRule['evaluate']>[0]) {
  const qrsMs = report.qrsComplex?.calculatedMs;
  const bpm = getBpm(report);
  const shortPr = report.prInterval?.prCategory === 'short' || (report.prInterval?.calculatedMs ?? Infinity) < 120;
  const deltaWave = report.qrsComplex?.deltaWave === true || report.qrsComplex?.findings?.includes('pre_excitation');
  const qrsWideForWpw = typeof qrsMs === 'number' && qrsMs >= 110;
  const irregularRapid = report.heartRate?.regularity === 'irregular' && typeof bpm === 'number' && bpm > 150;
  const afib = report.rhythm?.rhythmCategory === 'atrial_fibrillation' || report.rhythm?.derivedRhythmCategory === 'atrial_fibrillation';
  const absentP = report.pWave?.presence === 'absent' || report.pWave?.absentPExplanation === 'atrial_fibrillation' || report.pWave?.abnormalAtrialActivity === 'fibrillatory_waves';
  const variableWideQrs =
    typeof qrsMs === 'number' &&
    qrsMs >= 120 &&
    (report.qrsComplex?.morphology === 'alternans' ||
      report.qrsComplex?.voltage?.electricalAlternans === true ||
      textIncludes(report, ['variable qrs', 'varying qrs', 'variable morphology', 'varying morphology', 'pre-excited af', 'af + wpw', 'wpw']));

  return {
    qrsMs,
    bpm,
    shortPr,
    deltaWave,
    qrsWideForWpw,
    irregularRapid,
    afib,
    absentP,
    variableWideQrs,
    preExcitedAf: irregularRapid && afib && absentP && variableWideQrs,
  };
}
