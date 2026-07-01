import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { dyspneaOrPeContext, hasRbbb, hasRightVentricularStrain, isNarrowQrs } from './helpers';

export const rightVentricularHypertrophyRule: DiagnosticRule = {
  id: 'right-ventricular-hypertrophy',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const rate = getBpm(report);
    const hypertrophy = report.qrsComplex?.hypertrophy;
    const rvhRInV1 = hypertrophy?.rvhRInV1 ?? 0;
    const rvhSInV5V6 = hypertrophy?.rvhSInV5V6 ?? 0;
    const rvhVoltage = rvhRInV1 > 7 || rvhRInV1 > rvhSInV5V6;
    const deepLateralS = rvhSInV5V6 > 7 || rvhSInV5V6 > rvhRInV1;
    const posteriorMi = report.stSegment?.omiPattern === 'posterior_omi' || report.qWaves?.territories?.includes('posterior');
    const rbbb = hasRbbb(report);

    if ((rbbb || posteriorMi) && rvhVoltage) {
      findings.push(createFinding({
        id: 'exclude-rvh-rbbb-posterior-mi',
        label: 'Safety exclusion: RVH',
        finding: 'RBBB or Posterior MI is present. Right ventricular forces cannot be independently assessed for RVH.',
        basis: 'RBBB and posterior MI both create tall right-precordial R waves that can mimic RVH.',
        inputs: [`RBBB pattern: ${formatValue(rbbb)}`, `Posterior MI pattern: ${formatValue(posteriorMi)}`, `R in V1: ${formatValue(rvhRInV1)} mm`],
      }));
      return findings;
    }

    if (!isNarrowQrs(report) || !rvhVoltage || !deepLateralS || report.axis?.concern !== 'right_axis_deviation') {
      return findings;
    }

    const strain = hasRightVentricularStrain(report);
    findings.push(createFinding({
      id: 'dx-right-ventricular-hypertrophy',
      label: 'Diagnostic suggestion: Right Ventricular Hypertrophy',
      finding: `Right Ventricular Hypertrophy (RVH) ${strain ? 'with right ventricular strain pattern' : ''}.`,
      basis: 'Manual RVH rule: narrow QRS, dominant R in V1 or R/S >=1 surrogate, deep lateral S-wave surrogate, and right-axis deviation after excluding RBBB/posterior MI.',
      inputs: [
        `R in V1: ${formatValue(rvhRInV1)} mm`,
        `S in V5/V6: ${formatValue(rvhSInV5V6)} mm`,
        `Axis concern: ${formatValue(report.axis?.concern)}`,
        `RV strain: ${formatValue(strain)}`,
      ],
    }));

    if (strain && dyspneaOrPeContext(report)) {
      findings.push(createFinding({
        id: 'alert-rvh-acute-rv-strain',
        label: 'High-priority alert: RVH/RV strain',
        finding: 'WARNING: Right Ventricular strain and Right Axis Deviation detected. Clinically correlate for acute pulmonary hypertension or pulmonary embolism.',
        basis: 'New RVH/RV strain with dyspnea, tachycardia, or chest pain can indicate acute right ventricular pressure overload.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`, `Rate: ${formatValue(rate)} bpm`],
      }));
    }

    return findings;
  },
};
