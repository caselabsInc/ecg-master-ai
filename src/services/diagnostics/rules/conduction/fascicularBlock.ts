import type { DiagnosticRule } from '../../types';
import { leftAnteriorFascicularBlockRule } from './leftAnteriorFascicularBlock';
import { leftPosteriorFascicularBlockRule } from './leftPosteriorFascicularBlock';
export { hasLafbCriteria, hasLpfbCriteria } from './fascicularBlockHelpers';

const fascicularRules: DiagnosticRule[] = [
  leftAnteriorFascicularBlockRule,
  leftPosteriorFascicularBlockRule,
];

export const fascicularBlockRule: DiagnosticRule = {
  id: 'fascicular-block',
  evaluate(report) {
    return fascicularRules.flatMap((rule) => rule.evaluate(report));
  },
};
