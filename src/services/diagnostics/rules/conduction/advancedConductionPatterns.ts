import type { DiagnosticRule } from '../../types';
import { bifascicularBlockRule } from './bifascicularBlock';
import { trifascicularPatternRule } from './trifascicularPattern';

const advancedConductionRules: DiagnosticRule[] = [
  bifascicularBlockRule,
  trifascicularPatternRule,
];

export const advancedConductionPatternsRule: DiagnosticRule = {
  id: 'advanced-conduction-patterns',
  evaluate(report) {
    return advancedConductionRules.flatMap((rule) => rule.evaluate(report));
  },
};
