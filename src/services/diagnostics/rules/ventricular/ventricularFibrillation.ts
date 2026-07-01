import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { hasArtifactContext, hasPositivePulseOrResponsiveness, hasPulselessArrestContext, pulseSafetyExclusion, qrsIsAbsent, textMatches } from './ventricularHelpers';

export const ventricularFibrillationRule: DiagnosticRule = {
  id: 'ventricular-fibrillation',
  evaluate(report) {
    const qrsAbsentReason = report.qrsComplex?.absentReason;
    const positivePulse = hasPositivePulseOrResponsiveness(report);
    const artifact = hasArtifactContext(report) || report.pWave?.abnormalAtrialActivity === 'artifact' || report.qrsComplex?.absentReason === 'artifact';

    if ((qrsAbsentReason === 'ventricular_fibrillation' || (qrsIsAbsent(report) && report.tWaves?.absentReason === 'ventricular_fibrillation')) && positivePulse) {
      return [pulseSafetyExclusion('exclude-vf-pulse-or-artifact', 'Safety exclusion: ventricular fibrillation', 'Chaotic/absent organised QRS pattern documented, but palpable pulse or responsiveness is documented. Suspect muscle tremor, lead artifact, or device interference; verify leads immediately.', 'VF is an arrest rhythm. A palpable central pulse or responsiveness should block a definitive VF diagnosis until artifact is excluded.', report)];
    }

    if (!(qrsAbsentReason === 'ventricular_fibrillation' || (qrsIsAbsent(report) && report.pWave?.presence !== 'present' && report.prInterval?.prCategory === 'not_measurable' && !artifact))) {
      return [];
    }

    const subtype = textMatches(report, ['coarse vf', 'coarse ventricular fibrillation']) ? 'Coarse VF' : textMatches(report, ['fine vf', 'fine ventricular fibrillation']) ? 'Fine VF' : 'VF subtype not documented';
    return [
      createFinding({
        id: 'dx-ventricular-fibrillation',
        label: 'Diagnostic suggestion: Ventricular Fibrillation (VF)',
        finding: `Ventricular Fibrillation (VF) pattern suggested. ${subtype}.`,
        basis: 'Manual emergency rhythm rule: unmeasurable ventricular rate with absent/discernible QRS complexes, absent P-QRS/PR/ST-T-Q-wave assessment, and chaotic fibrillatory baseline after excluding pulse/artifact clues.',
        inputs: [`QRS presence: ${formatValue(report.qrsComplex?.presence)}`, `Absent QRS reason: ${formatValue(qrsAbsentReason)}`, `P waves: ${formatValue(report.pWave?.presence)}`, `PR category: ${formatValue(report.prInterval?.prCategory)}`, `Artifact clues: ${formatValue(artifact)}`],
      }),
      createFinding({
        id: 'alert-ventricular-fibrillation',
        label: 'High-priority alert: Ventricular Fibrillation',
        finding: 'CRITICAL EMERGENCY: Ventricular Fibrillation detected. Patient is in Cardiac Arrest. Start immediate CPR and deliver unsynchronised defibrillation (Shock).',
        basis: 'VF is a shockable cardiac arrest rhythm requiring immediate defibrillation and high-quality CPR.',
        inputs: [`Pulseless/cardiac arrest context: ${formatValue(hasPulselessArrestContext(report))}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }),
    ];
  },
};
