import type { DiagnosticRule } from '../../types';
import { asystoleRule } from './asystole';
import { monomorphicVentricularTachycardiaRule } from './monomorphicVentricularTachycardia';
import { polymorphicVentricularTachycardiaRule } from './polymorphicVentricularTachycardia';
import { pulselessElectricalActivityRule } from './pulselessElectricalActivity';
import { svtWithAberrancyRule } from './svtWithAberrancy';
import { torsadesDePointesRule } from './torsadesDePointes';
import { ventricularFibrillationRule } from './ventricularFibrillation';
import { wideComplexTachycardiaRule } from './wideComplexTachycardia';

const ventricularRules: DiagnosticRule[] = [
  ventricularFibrillationRule,
  asystoleRule,
  pulselessElectricalActivityRule,
  torsadesDePointesRule,
  polymorphicVentricularTachycardiaRule,
  monomorphicVentricularTachycardiaRule,
  svtWithAberrancyRule,
  wideComplexTachycardiaRule,
];

export const ventricularArrhythmiasRule: DiagnosticRule = {
  id: 'ventricular-arrhythmias',
  evaluate(report) {
    return ventricularRules.flatMap((rule) => rule.evaluate(report));
  },
};
