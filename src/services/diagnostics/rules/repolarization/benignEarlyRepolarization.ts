import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getDeviation, hasClinicalAny, hasInferiorElevation, hasLateralOrPrecordialBerLeads, hasNormalPrMs, hasOneToOneConduction, hasReciprocalDepressionOutsideAvrV1, hasSinusPWave, isNarrowQrs, rate, stDepressionLeads, stElevationLeads } from './helpers';

export const benignEarlyRepolarizationRule: DiagnosticRule = {
  id: 'benign-early-repolarization',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const bpm = rate(report);
    const elevatedLeads = stElevationLeads(report);
    const fishhook = report.lateWaveFindings?.jWaves === 'early_repolarization' ||
      report.stSegment?.mimicConsiderations?.includes('early_repolarization') ||
      hasClinicalAny(report, ['fishhook', 'j notch', 'j-point notch', 'early repolarization', 'early repolarisation']);
    const mildConcaveSte = report.stSegment?.status === 'elevated' &&
      report.stSegment?.morphology === 'concave' &&
      elevatedLeads.every((lead) => (getDeviation(report, lead) ?? 1) <= 2);

    if ((report.stSegment?.mimicConsiderations?.includes('early_repolarization') || fishhook) && (hasReciprocalDepressionOutsideAvrV1(report) || report.stSegment?.morphology === 'convex' || report.stSegment?.morphology === 'horizontal')) {
      findings.push(createFinding({
        id: 'exclude-ber-acs-features',
        label: 'Safety exclusion: Benign Early Repolarisation',
        finding: 'ST elevation is convex or reciprocal ST depression is present. BER is ruled out; evaluate for acute coronary syndrome.',
        basis: 'BER should be stable concave J-point elevation without reciprocal ischemic depression or convex/horizontal acute injury morphology.',
        inputs: [`ST morphology: ${formatValue(report.stSegment?.morphology)}`, `Depressed leads: ${formatValue(stDepressionLeads(report))}`, `Reciprocal changes: ${formatValue(report.stSegment?.hasReciprocalChanges)}`],
      }));
      return findings;
    }

    if (typeof bpm === 'number' && bpm < 100 && report.heartRate?.regularity === 'regular' && hasSinusPWave(report) && hasOneToOneConduction(report) && hasNormalPrMs(report) && isNarrowQrs(report) && mildConcaveSte && fishhook && hasLateralOrPrecordialBerLeads(report) && !hasReciprocalDepressionOutsideAvrV1(report)) {
      findings.push(createFinding({
        id: 'dx-benign-early-repolarization',
        label: 'Diagnostic suggestion: Benign Early Repolarisation',
        finding: 'Benign Early Repolarisation (BER) Pattern.',
        basis: 'Manual BER rule: regular sinus rhythm under 100 bpm, narrow QRS, mild concave ST elevation in precordial/lateral leads, terminal QRS J-notch/fishhook clue, and no reciprocal ST depression.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `ST leads: ${formatValue(elevatedLeads)}`, `J waves: ${formatValue(report.lateWaveFindings?.jWaves)}`, `Mimics: ${formatValue(report.stSegment?.mimicConsiderations)}`],
      }));
      if (hasInferiorElevation(report) && elevatedLeads.some((lead) => ['ii', 'iii', 'avf'].includes(lead) && (getDeviation(report, lead) ?? 0) > 2) && hasClinicalAny(report, ['syncope', 'near syncope', 'faint', 'sudden death'])) {
        findings.push(createFinding({
          id: 'alert-inferior-early-repolarization-syncope',
          label: 'High-priority alert: inferior early repolarisation',
          finding: 'Inferior-lead J-point elevation exceeds 2 mm with syncope/family sudden-death context. Correlate urgently for high-risk early repolarisation syndrome.',
          basis: 'Inferior early repolarisation with syncope is a rare but higher-risk variant associated with malignant ventricular arrhythmias.',
          inputs: [`Inferior ST deviations: ${formatValue(report.stSegment?.leadDeviationMm)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
        }));
      }
    }

    return findings;
  },
};
