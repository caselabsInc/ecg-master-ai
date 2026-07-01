import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getDeviation, hasClinicalAny, isWideQrs } from './helpers';

function isLbbbOrPaced(report: Parameters<DiagnosticRule['evaluate']>[0]) {
  return report.qrsComplex?.bbb?.pattern === 'lbbb' ||
    report.qrsComplex?.morphology === 'paced' ||
    report.qrsComplex?.findings?.includes('paced') ||
    report.rhythm?.pacerSpikes === 'ventricular' ||
    report.rhythm?.pacerSpikes === 'dual' ||
    report.stSegment?.mimicConsiderations?.includes('lbbb') ||
    report.stSegment?.mimicConsiderations?.includes('paced_rhythm');
}

export const secondaryWideQrsDiscordanceRule: DiagnosticRule = {
  id: 'secondary-wide-qrs-discordance',
  evaluate(report): DiagnosticFinding[] {
    if (!isWideQrs(report) || !isLbbbOrPaced(report)) return [];

    const rightPrecordialElevation = ['v1', 'v2', 'v3'].some((lead) => (getDeviation(report, lead) ?? 0) > 0 || report.stSegment?.leads?.some((stLead) => stLead.toLowerCase() === lead));
    const negativeV1 = report.qrsComplex?.v1Morphology === 'qs' || report.qrsComplex?.v1Morphology === 'rS' || report.qrsComplex?.bbb?.criteria?.dominantSInV1 === true;
    const sgarbossaPositive = report.stSegment?.omiPattern === 'sgarbossa_positive' || report.stSegment?.omiPattern === 'modified_sgarbossa_positive';
    const excessiveDiscordance = ['v1', 'v2', 'v3'].some((lead) => (getDeviation(report, lead) ?? 0) > 5) || sgarbossaPositive;
    const rhythmLabel = report.qrsComplex?.morphology === 'paced' || report.rhythm?.pacerSpikes === 'ventricular' || report.rhythm?.pacerSpikes === 'dual' ? 'Ventricular Paced Rhythm' : 'Left Bundle Branch Block';
    const findings: DiagnosticFinding[] = [];

    if (rightPrecordialElevation && negativeV1 && !sgarbossaPositive) {
      findings.push(createFinding({
        id: 'dx-secondary-wide-qrs-discordance',
        label: 'Diagnostic suggestion: secondary wide-QRS repolarisation',
        finding: `Secondary Repolarisation Discordance expected with ${rhythmLabel}.`,
        basis: 'Manual secondary discordance rule: QRS >=120 ms with LBBB/paced morphology; ST-T vectors are expected to deflect opposite the terminal QRS, especially ST elevation in negative right precordial leads.',
        inputs: [`QRS duration: ${formatValue(report.qrsComplex?.calculatedMs)} ms`, `V1 morphology: ${formatValue(report.qrsComplex?.v1Morphology)}`, `Pacer spikes: ${formatValue(report.rhythm?.pacerSpikes)}`, `ST deviations: ${formatValue(report.stSegment?.leadDeviationMm)}`],
      }));
      findings.push(createFinding({
        id: 'exclude-standard-stemi-secondary-discordance',
        label: 'Safety exclusion: standard STEMI in wide QRS',
        finding: 'ST-segment elevation detected in right precordial leads, but QRS is wide and negatively deflected. Standard STEMI criteria are invalid. Secondary discordance is confirmed.',
        basis: 'Standard STEMI thresholds are unreliable in LBBB and ventricular paced rhythm; Sgarbossa-style criteria should be used instead.',
        inputs: [`OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`],
      }));
    }

    if (excessiveDiscordance || hasClinicalAny(report, ['chest pain', 'ischemia', 'acute coronary'])) {
      findings.push(createFinding({
        id: 'alert-wide-qrs-sgarbossa-needed',
        label: 'High-priority alert: wide-QRS MI evaluation',
        finding: 'WARNING: Wide QRS limits myocardial infarction evaluation. Scan serial ECGs or apply Sgarbossa criteria if acute ischemic symptoms are present.',
        basis: 'Concordant or excessively discordant ST deviation in LBBB/paced rhythm can indicate acute coronary occlusion.',
        inputs: [`Excessive discordance: ${formatValue(excessiveDiscordance)}`, `OMI pattern: ${formatValue(report.stSegment?.omiPattern)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
