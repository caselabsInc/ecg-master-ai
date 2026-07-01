import type { EcgReport } from '../../../db';
import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';

export const electricalAlternansRule: DiagnosticRule = {
  id: 'electrical-alternans',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const alternans = report.qrsComplex?.voltage?.electricalAlternans ||
      report.qrsComplex?.morphology === 'alternans' ||
      report.qrsComplex?.findings?.includes('alternans');

    if (!alternans) return findings;

    if (report.heartRate?.regularity === 'irregular') {
      findings.push(createFinding({
        id: 'exclude-electrical-alternans-irregular-rhythm',
        label: 'Safety exclusion: Electrical Alternans',
        finding: 'Rhythm is irregular. Amplitude variations are likely related to varying ventricular filling times, not true electrical alternans.',
        basis: 'Electrical alternans requires a regular alternating A-B-A-B amplitude pattern.',
        inputs: [`Regularity: ${formatValue(report.heartRate?.regularity)}`, `Ectopy: ${formatValue(report.rhythm?.ectopy)}`],
      }));
      return findings;
    }

    findings.push(createFinding({
      id: 'dx-electrical-alternans',
      label: 'Diagnostic suggestion: Electrical Alternans',
      finding: 'Electrical Alternans (Consecutive QRS Amplitude Variation).',
      basis: 'Manual alternans rule: beat-to-beat alternating QRS amplitude/direction pattern under a regular rhythm.',
      inputs: [`Electrical alternans flag: ${formatValue(report.qrsComplex?.voltage?.electricalAlternans)}`, `QRS morphology: ${formatValue(report.qrsComplex?.morphology)}`, `Regularity: ${formatValue(report.heartRate?.regularity)}`],
    }));
    findings.push(createFinding({
      id: 'alert-electrical-alternans-tamponade',
      label: 'Critical alert: Electrical Alternans',
      finding: "CRITICAL EMERGENCY: Electrical alternans detected. This is a pathognomonic marker of massive pericardial effusion and impending Cardiac Tamponade. Evaluate immediately for Beck's Triad.",
      basis: 'Electrical alternans can reflect the heart swinging in a large pericardial effusion.',
      inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
    }));

    return findings;
  },
};
