import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getQtcMs, hasClinicalAny, isWideQrs, rate } from './helpers';

export const hyperkalemiaRule: DiagnosticRule = {
  id: 'hyperkalemia-repolarization',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const bpm = rate(report);
    const qtcMs = getQtcMs(report);
    const tallTentedT = report.tWaves?.syndromePattern === 'hyperkalemia' ||
      report.stSegment?.mimicConsiderations?.includes('hyperkalemia') ||
      (report.tWaves?.status === 'tall_peaked' && report.tWaves?.morphology === 'narrow_tented');
    const absentOrFlatteningP = report.pWave?.presence === 'absent' || report.pWave?.abnormalFeatures?.includes('low_amplitude') || report.pWave?.notes?.toLowerCase().includes('flat');
    const sineWave = report.qrsComplex?.morphology === 'toxicologic' ||
      report.qrsComplex?.findings?.includes('toxicologic') ||
      report.tWaves?.absentReason === 'merged_with_qrs_or_st' ||
      hasClinicalAny(report, ['sine wave', 'serum potassium', 'hyperkalemia', 'hyperkalaemia', 'renal failure', 'kidney failure', 'metabolic acidosis']);

    if (report.tWaves?.status === 'hyperacute' || report.tWaves?.morphology === 'broad_based') {
      findings.push(createFinding({
        id: 'exclude-hyperkalemia-hyperacute-t-waves',
        label: 'Safety exclusion: Hyperkalemia',
        finding: 'Peaked T waves are broad-based and asymmetric. Hyperkalemia is excluded; evaluate for Hyperacute T waves of acute coronary syndrome.',
        basis: 'Hyperkalemic T waves are narrow, tented, and symmetric; broad asymmetric T waves in a vascular territory favor early coronary occlusion.',
        inputs: [`T-wave status: ${formatValue(report.tWaves?.status)}`, `T-wave morphology: ${formatValue(report.tWaves?.morphology)}`, `ST leads: ${formatValue(report.stSegment?.leads)}`],
      }));
      return findings;
    }

    if (!tallTentedT && !sineWave) return findings;

    findings.push(createFinding({
      id: 'dx-hyperkalemia-ecg-changes',
      label: 'Diagnostic suggestion: Hyperkalemia ECG changes',
      finding: `ECG changes suggestive of Hyperkalemia${hasClinicalAny(report, ['serum potassium', 'k+']) ? ' (serum potassium context documented)' : ''}.`,
      basis: 'Manual hyperkalemia rule: tall narrow tented symmetric T waves, shortened/normal QT, progressive P-wave flattening/absence, QRS widening, toxicologic morphology, or sine-wave context.',
      inputs: [`T-wave status/morphology: ${formatValue(report.tWaves?.status)} / ${formatValue(report.tWaves?.morphology)}`, `P waves: ${formatValue(report.pWave?.presence)}`, `QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `QTc: ${formatValue(qtcMs)} ms`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
    }));

    if (sineWave || (absentOrFlatteningP && isWideQrs(report)) || (typeof qtcMs === 'number' && qtcMs < 350 && tallTentedT)) {
      findings.push(createFinding({
        id: 'alert-extreme-hyperkalemia',
        label: 'Critical alert: Hyperkalemia',
        finding: 'CRITICAL EMERGENCY: Sine-wave pattern / extreme Hyperkalemia suspected. High risk of immediate cardiac arrest. Administer IV Calcium Chloride/Gluconate immediately to protect the myocardium. Do NOT delay.',
        basis: 'Sine-wave morphology, atrial standstill, QRS widening, and tented T waves represent severe potassium cardiotoxicity.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `Absent/flat P waves: ${formatValue(absentOrFlatteningP)}`, `Toxicologic/sine-wave clues: ${formatValue(sineWave)}`],
      }));
    }

    return findings;
  },
};
