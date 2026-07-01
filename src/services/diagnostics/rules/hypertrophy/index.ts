import type { EcgReport } from '../../../db';
import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { biatrialEnlargementRule } from './biatrialEnlargement';
import { electricalAlternansRule } from './electricalAlternans';
import { isStandardCalibration } from './helpers';
import { leftAtrialEnlargementRule } from './leftAtrialEnlargement';
import { leftVentricularHypertrophyRule } from './leftVentricularHypertrophy';
import { lowVoltageRule } from './lowVoltage';
import { rightAtrialEnlargementRule } from './rightAtrialEnlargement';
import { rightVentricularHypertrophyRule } from './rightVentricularHypertrophy';

const hypertrophyRules: DiagnosticRule[] = [
  leftVentricularHypertrophyRule,
  rightVentricularHypertrophyRule,
  biatrialEnlargementRule,
  leftAtrialEnlargementRule,
  rightAtrialEnlargementRule,
  lowVoltageRule,
  electricalAlternansRule,
];

export const hypertrophyVoltageRule: DiagnosticRule = {
  id: 'hypertrophy-voltage',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    if (!isStandardCalibration(report)) {
      return [createFinding({
        id: 'exclude-voltage-nonstandard-calibration',
        label: 'Safety exclusion: voltage criteria',
        finding: 'ECG calibration is not set to standard 10 mm/mV. Low voltage, LVH, and atrial voltage abnormalities cannot be confidently assessed.',
        basis: 'Voltage-based criteria require standard ECG calibration.',
        inputs: [`Calibration standard: ${formatValue(report.context?.calibrationStandard)}`, `Calibration note: ${formatValue(report.context?.calibrationNote)}`],
      })];
    }

    return hypertrophyRules.flatMap((rule) => rule.evaluate(report));
  },
};
