import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { countStTerritories, hasLowVoltage, hasNormalPrMs, hasOneToOneConduction, hasReciprocalDepressionOutsideAvrV1, hasSinusPWave, isNarrowQrs, rate, stElevationLeads } from './helpers';

export const acutePericarditisRule: DiagnosticRule = {
  id: 'acute-pericarditis-repolarization',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const bpm = rate(report);
    const elevatedLeads = stElevationLeads(report);
    const diffuseConcaveSte = report.stSegment?.status === 'elevated' &&
      report.stSegment?.morphology === 'concave' &&
      countStTerritories(elevatedLeads) >= 2;
    const prDepression = report.prInterval?.segmentStatus === 'depressed';
    const pathologicalQ = report.qWaves?.present === true;
    const reciprocal = hasReciprocalDepressionOutsideAvrV1(report);

    if ((report.stSegment?.mimicConsiderations?.includes('pericarditis') || diffuseConcaveSte) && (reciprocal || pathologicalQ)) {
      findings.push(createFinding({
        id: 'exclude-acute-pericarditis-mi-features',
        label: 'Safety exclusion: Acute Pericarditis',
        finding: 'Diffuse ST elevation present, but reciprocal ST depression or pathological Q waves are identified. Pericarditis is excluded; evaluate for Acute Myocardial Infarction (STEMI).',
        basis: 'Pericarditis should not be diagnosed when necrosis Q waves or territorial reciprocal ischemic changes are present.',
        inputs: [`Reciprocal depression: ${formatValue(reciprocal)}`, `Pathological Q waves: ${formatValue(pathologicalQ)}`, `ST leads: ${formatValue(elevatedLeads)}`],
      }));
      return findings;
    }

    if (diffuseConcaveSte && prDepression && !reciprocal && !pathologicalQ && hasSinusPWave(report) && hasOneToOneConduction(report) && hasNormalPrMs(report) && isNarrowQrs(report)) {
      findings.push(createFinding({
        id: 'dx-acute-pericarditis-stage-i',
        label: 'Diagnostic suggestion: Acute Pericarditis (Stage I)',
        finding: 'Acute Pericarditis (Stage I) pattern suggested.',
        basis: 'Manual repolarisation rule: diffuse concave ST elevation across non-contiguous territories, PR depression, upright acute-phase T waves, narrow QRS, sinus P waves, and no reciprocal depression/pathological Q-wave trap.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `ST leads: ${formatValue(elevatedLeads)}`, `PR segment: ${formatValue(report.prInterval?.segmentStatus)}`, `T-wave status: ${formatValue(report.tWaves?.status)}`],
      }));
      if (hasLowVoltage(report) && typeof bpm === 'number' && bpm > 100) {
        findings.push(createFinding({
          id: 'alert-pericarditis-effusion-tamponade',
          label: 'High-priority alert: pericarditis with low voltage',
          finding: 'WARNING: Diffuse ST elevation combined with low QRS voltage and tachycardia. Evaluate immediately for pericardial effusion and signs of Cardiac Tamponade.',
          basis: 'Pericarditis with low voltage and tachycardia can indicate large effusion or evolving tamponade.',
          inputs: [`Low voltage: ${formatValue(hasLowVoltage(report))}`, `Rate: ${formatValue(bpm)} bpm`],
        }));
      }
    }

    return findings;
  },
};
