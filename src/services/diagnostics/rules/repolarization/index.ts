import type { DiagnosticRule } from '../../types';
import { acutePericarditisRule } from './acutePericarditis';
import { benignEarlyRepolarizationRule } from './benignEarlyRepolarization';
import { brugadaPatternRule } from './brugadaPattern';
import { cnsTWavesRule } from './cnsTWaves';
import { digoxinEffectRule } from './digoxinEffect';
import { hyperkalemiaRule } from './hyperkalemia';
import { hypokalemiaRule } from './hypokalemia';
import { hypothermiaRule } from './hypothermia';
import { lvhStrainPatternRule } from './lvhStrainPattern';
import { secondaryWideQrsDiscordanceRule } from './secondaryWideQrsDiscordance';

const repolarizationRules: DiagnosticRule[] = [
  digoxinEffectRule,
  hyperkalemiaRule,
  hypokalemiaRule,
  hypothermiaRule,
  cnsTWavesRule,
  acutePericarditisRule,
  benignEarlyRepolarizationRule,
  lvhStrainPatternRule,
  secondaryWideQrsDiscordanceRule,
  brugadaPatternRule,
];

export const repolarizationMimicsRule: DiagnosticRule = {
  id: 'repolarization-mimics',
  evaluate(report) {
    return repolarizationRules.flatMap((rule) => rule.evaluate(report));
  },
};
