import type { EcgReport } from '../db';
import { advancedConductionPatternsRule } from './rules/conduction/advancedConductionPatterns';
import { bundleBranchBlockRule } from './rules/conduction/bundleBranchBlock';
import { fascicularBlockRule } from './rules/conduction/fascicularBlock';
import { firstDegreeAvBlockRule } from './rules/conduction/firstDegreeAvBlock';
import { ivcdRule } from './rules/conduction/ivcd';
import { preExcitationRule } from './rules/conduction/preExcitation';
import { secondDegreeAvBlockRule } from './rules/conduction/secondDegreeAvBlock';
import { thirdDegreeAvBlockRule } from './rules/conduction/thirdDegreeAvBlock';
import { hypertrophyVoltageRule } from './rules/hypertrophy';
import { ischemiaInfarctionRule } from './rules/ischemia/ischemiaInfarction';
import { pericarditisRule } from './rules/ischemia/pericarditis';
import { pulmonaryEmbolismRule } from './rules/pulmonary/pulmonaryEmbolism';
import { repolarizationMimicsRule } from './rules/repolarization';
import { ectopyRule } from './rules/rhythm/ectopy';
import { supraventricularRhythmsRule } from './rules/rhythm/supraventricularRhythms';
import { ventricularArrhythmiasRule } from './rules/ventricular/ventricularArrhythmias';
import type { DiagnosticFinding, DiagnosticRule } from './types';

const diagnosticRules: DiagnosticRule[] = [
  ventricularArrhythmiasRule,
  ischemiaInfarctionRule,
  pericarditisRule,
  pulmonaryEmbolismRule,
  supraventricularRhythmsRule,
  ectopyRule,
  hypertrophyVoltageRule,
  repolarizationMimicsRule,
  thirdDegreeAvBlockRule,
  secondDegreeAvBlockRule,
  firstDegreeAvBlockRule,
  preExcitationRule,
  bundleBranchBlockRule,
  fascicularBlockRule,
  advancedConductionPatternsRule,
  ivcdRule,
];

export function runDiagnosticRules(report: Partial<EcgReport>): DiagnosticFinding[] {
  const findings: DiagnosticFinding[] = [];
  const seenIds = new Set<string>();

  for (const rule of diagnosticRules) {
    for (const finding of rule.evaluate(report)) {
      if (seenIds.has(finding.id)) continue;
      seenIds.add(finding.id);
      findings.push(finding);
    }
  }

  return findings;
}
