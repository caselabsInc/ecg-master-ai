import type { DiagnosticRule } from '../../types';
import { preExcitedAtrialFibrillationRule } from './preExcitedAtrialFibrillation';
import { wolffParkinsonWhiteRule } from './wolffParkinsonWhite';

const preExcitationRules: DiagnosticRule[] = [
  preExcitedAtrialFibrillationRule,
  wolffParkinsonWhiteRule,
];

export const preExcitationRule: DiagnosticRule = {
  id: 'pre-excitation',
  evaluate(report) {
    return preExcitationRules.flatMap((rule) => rule.evaluate(report));
  },
};
