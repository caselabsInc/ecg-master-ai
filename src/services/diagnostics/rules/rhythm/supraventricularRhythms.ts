import type { DiagnosticRule } from '../../types';
import { atrialFibrillationRule } from './atrialFibrillation';
import { atrialFlutterRule } from './atrialFlutter';
import { atrialTachycardiaRule } from './atrialTachycardia';
import { avnrtRule } from './avnrt';
import { avrtRule } from './avrt';
import { junctionalRhythmRule } from './junctionalRhythm';
import { junctionalTachycardiaRule } from './junctionalTachycardia';
import { multifocalAtrialTachycardiaRule } from './multifocalAtrialTachycardia';
import { normalSinusRhythmRule } from './normalSinusRhythm';
import { sinusArrhythmiaRule } from './sinusArrhythmia';
import { sinusBradycardiaRule } from './sinusBradycardia';
import { sinusTachycardiaRule } from './sinusTachycardia';
import { wanderingAtrialPacemakerRule } from './wanderingAtrialPacemaker';

const supraventricularRhythmRules: DiagnosticRule[] = [
  normalSinusRhythmRule,
  sinusBradycardiaRule,
  sinusTachycardiaRule,
  sinusArrhythmiaRule,
  atrialFibrillationRule,
  atrialFlutterRule,
  atrialTachycardiaRule,
  multifocalAtrialTachycardiaRule,
  wanderingAtrialPacemakerRule,
  avnrtRule,
  avrtRule,
  junctionalRhythmRule,
  junctionalTachycardiaRule,
];

export const supraventricularRhythmsRule: DiagnosticRule = {
  id: 'supraventricular-rhythms',
  evaluate(report) {
    return supraventricularRhythmRules.flatMap((rule) => rule.evaluate(report));
  },
};
