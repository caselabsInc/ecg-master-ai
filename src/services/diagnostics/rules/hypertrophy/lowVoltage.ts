import type { EcgReport } from '../../../db';
import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { tamponadeContext } from './helpers';

export const lowVoltageRule: DiagnosticRule = {
  id: 'low-qrs-voltage',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const lowVoltage = report.qrsComplex?.voltage?.lowLimb === true ||
      report.qrsComplex?.voltage?.lowPrecordial === true ||
      report.qrsComplex?.morphology === 'low_voltage' ||
      report.qrsComplex?.findings?.includes('low_voltage');

    if (!lowVoltage) return findings;

    findings.push(createFinding({
      id: 'dx-low-qrs-voltage',
      label: 'Diagnostic suggestion: Low QRS Voltage',
      finding: `Low QRS Voltage detected in ${report.qrsComplex?.voltage?.lowLimb ? 'Limb leads (<5mm)' : ''} ${report.qrsComplex?.voltage?.lowPrecordial ? 'Precordial leads (<10mm)' : ''}`.trim(),
      basis: 'Manual low-voltage rule: selected low limb and/or precordial voltage flags under standard calibration.',
      inputs: [`Low limb voltage: ${formatValue(report.qrsComplex?.voltage?.lowLimb)}`, `Low precordial voltage: ${formatValue(report.qrsComplex?.voltage?.lowPrecordial)}`, `QRS findings: ${formatValue(report.qrsComplex?.findings)}`],
    }));

    if (tamponadeContext(report)) {
      findings.push(createFinding({
        id: 'alert-low-voltage-tamponade',
        label: 'Critical alert: new low voltage',
        finding: "CRITICAL ALERT: New-onset low QRS voltage in a symptomatic patient is highly suggestive of pericardial effusion or cardiac tamponade. Assess for Beck's Triad immediately.",
        basis: 'New low voltage with hypotension/JVD/muffled heart sounds can indicate large pericardial effusion or tamponade.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
