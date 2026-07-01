import type { EcgReport } from '../../../db';
import { hasClinicalKeyword } from '../../helpers';
import { hasCompleteRbbbForConductionRules } from './bundleBranchBlock';
import { hasLafbCriteria, hasLpfbCriteria } from './fascicularBlock';

export function getAdvancedConductionState(report: Partial<EcgReport>) {
  const rbbb = hasCompleteRbbbForConductionRules(report);
  const lafb = hasLafbCriteria(report);
  const lpfb = hasLpfbCriteria(report);
  const bifascicularType = rbbb && lafb ? 'Right Bundle Branch Block and Left Anterior Fascicular Block' : rbbb && lpfb ? 'Right Bundle Branch Block and Left Posterior Fascicular Block' : null;
  const syncope = hasClinicalKeyword(report, ['syncope', 'near-syncope', 'faint', 'stokes-adams']);
  const chestPain = hasClinicalKeyword(report, ['chest pain', 'ischemia', 'infarction', 'stemi']);
  const prProlonged = (report.prInterval?.calculatedMs ?? 0) > 200 || (report.prInterval?.smallBoxes ?? 0) > 5 || report.prInterval?.prCategory === 'first_degree';

  return { rbbb, lafb, lpfb, bifascicularType, syncope, chestPain, prProlonged };
}
