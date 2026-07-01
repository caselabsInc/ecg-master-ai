import type { EcgReport } from '../../../db';
import { createFinding, formatValue, getBpm, isSupraventricularConduction } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { incompleteRightBundleBranchBlockRule } from './incompleteRightBundleBranchBlock';
import { leftBundleBranchBlockRule } from './leftBundleBranchBlock';
import { rightBundleBranchBlockRule } from './rightBundleBranchBlock';
export { hasCompleteLbbbForConductionRules, hasCompleteRbbbForConductionRules } from './bundleBranchBlockHelpers';

const bundleBranchRules: DiagnosticRule[] = [
  rightBundleBranchBlockRule,
  leftBundleBranchBlockRule,
  incompleteRightBundleBranchBlockRule,
];

export const bundleBranchBlockRule: DiagnosticRule = {
  id: 'bundle-branch-block',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const qrsMs = report.qrsComplex?.calculatedMs;
    const rate = getBpm(report);
    const isRatePlausible = typeof rate !== 'number' || (rate >= 20 && rate <= 250);

    if (!isSupraventricularConduction(report) && typeof qrsMs === 'number' && qrsMs >= 120) {
      return [createFinding({
        id: 'exclude-bbb-ventricular-origin',
        label: 'Safety exclusion: bundle branch block morphology',
        finding: 'Wide QRS of ventricular or paced origin detected; bundle branch block cannot be confidently evaluated.',
        basis: 'BBB criteria apply to supraventricular impulses conducted through the His-Purkinje system, not ventricular-origin or paced complexes.',
        inputs: [
          `QRS morphology: ${formatValue(report.qrsComplex?.morphology)}`,
          `QRS findings: ${formatValue(report.qrsComplex?.findings)}`,
          `Rhythm category: ${formatValue(report.rhythm?.rhythmCategory ?? report.rhythm?.derivedRhythmCategory)}`,
        ],
      })];
    }

    if (!isRatePlausible) return [];
    return bundleBranchRules.flatMap((rule) => rule.evaluate(report));
  },
};
