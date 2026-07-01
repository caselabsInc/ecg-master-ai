import type { DiagnosticRule } from '../../types';
import { deWinterPatternRule } from './deWinterPattern';
import { hyperacuteTWavesRule } from './hyperacuteTWaves';
import { leftMainMultivesselIschemiaRule } from './leftMainMultivesselIschemia';
import { pathologicalQWavesRule } from './pathologicalQWaves';
import { posteriorOmiRule } from './posteriorOmi';
import { rightVentricularMiRule } from './rightVentricularMi';
import { sgarbossaRule } from './sgarbossa';
import { stemiMimicsRule } from './stemiMimics';
import { stemiTerritoryRule } from './stemiTerritory';
import { subendocardialIschemiaRule } from './subendocardialIschemia';
import { wellensSyndromeRule } from './wellensSyndrome';

const ischemiaRules: DiagnosticRule[] = [
  sgarbossaRule,
  stemiMimicsRule,
  leftMainMultivesselIschemiaRule,
  deWinterPatternRule,
  wellensSyndromeRule,
  stemiTerritoryRule,
  rightVentricularMiRule,
  posteriorOmiRule,
  subendocardialIschemiaRule,
  hyperacuteTWavesRule,
  pathologicalQWavesRule,
];

export const ischemiaInfarctionRule: DiagnosticRule = {
  id: 'ischemia-infarction',
  evaluate(report) {
    return ischemiaRules.flatMap((rule) => rule.evaluate(report));
  },
};
