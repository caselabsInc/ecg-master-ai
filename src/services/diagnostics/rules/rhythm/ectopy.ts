import type { DiagnosticRule } from '../../types';
import { blockedPrematureAtrialComplexesRule } from './blockedPrematureAtrialComplexes';
import { patternedVentricularEctopyRule } from './patternedVentricularEctopy';
import { prematureAtrialComplexesRule } from './prematureAtrialComplexes';
import { prematureJunctionalComplexesRule } from './prematureJunctionalComplexes';
import { prematureVentricularComplexesRule } from './prematureVentricularComplexes';
import { pvcCoupletsTripletsRule } from './pvcCoupletsTriplets';
import { rOnTPvcRule } from './rOnTPvc';
import { ventricularEctopyRunsRule } from './ventricularEctopyRuns';

const ectopyRules: DiagnosticRule[] = [
  prematureAtrialComplexesRule,
  blockedPrematureAtrialComplexesRule,
  prematureJunctionalComplexesRule,
  prematureVentricularComplexesRule,
  patternedVentricularEctopyRule,
  pvcCoupletsTripletsRule,
  ventricularEctopyRunsRule,
  rOnTPvcRule,
];

export const ectopyRule: DiagnosticRule = {
  id: 'ectopy',
  evaluate(report) {
    return ectopyRules.flatMap((rule) => rule.evaluate(report));
  },
};
