import { createFinding, formatValue } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getDeviation, hasClinicalAny, hasRightPrecordialOnlyElevation, stElevationLeads } from './helpers';

export const brugadaPatternRule: DiagnosticRule = {
  id: 'brugada-pattern',
  evaluate(report): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const leads = stElevationLeads(report);
    const v1Elevation = getDeviation(report, 'V1') ?? (leads.includes('v1') ? 2 : 0);
    const v2Elevation = getDeviation(report, 'V2') ?? (leads.includes('v2') ? 2 : 0);
    const maxRightPrecordial = Math.max(v1Elevation, v2Elevation);
    const coved = report.lateWaveFindings?.jWaves === 'brugada_coved' || report.stSegment?.morphology === 'coved';
    const saddleback = report.lateWaveFindings?.jWaves === 'brugada_saddleback' || report.stSegment?.morphology === 'saddleback';
    const brugadaSelected = report.stSegment?.mimicConsiderations?.includes('brugada') || coved || saddleback;
    const completeRbbbTrap = report.qrsComplex?.bbb?.pattern === 'rbbb' && report.qrsComplex?.bbb?.criteria?.wideSlurredSLateral === true;

    if (brugadaSelected && (!hasRightPrecordialOnlyElevation(report) || completeRbbbTrap)) {
      findings.push(createFinding({
        id: 'exclude-brugada-rbbb-or-nonprecordial',
        label: 'Safety exclusion: Brugada pattern',
        finding: 'Brugada pattern is excluded because ST elevation is not isolated to right precordial leads or complete RBBB lateral delay is present.',
        basis: 'Brugada morphology should localize to V1-V3 and lacks the broad lateral S-wave delay of complete RBBB.',
        inputs: [`ST leads: ${formatValue(leads)}`, `RBBB criteria: ${formatValue(report.qrsComplex?.bbb?.criteria)}`],
      }));
      return findings;
    }

    if (!brugadaSelected || !hasRightPrecordialOnlyElevation(report)) return findings;

    const type = coved && maxRightPrecordial >= 2 ? 'Type I (Coved)' : saddleback && maxRightPrecordial >= 2 ? 'Type II (Saddleback)' : maxRightPrecordial < 1 ? 'Type III' : null;
    if (!type) {
      findings.push(createFinding({
        id: 'exclude-brugada-threshold-not-met',
        label: 'Safety exclusion: Brugada pattern',
        finding: 'Precordial ST elevation does not meet coved or saddleback thresholds. Brugada pattern is ruled out.',
        basis: 'Brugada classification requires coved or saddleback right-precordial ST morphology at the defined amplitude thresholds.',
        inputs: [`V1 STE: ${formatValue(v1Elevation)} mm`, `V2 STE: ${formatValue(v2Elevation)} mm`, `ST morphology: ${formatValue(report.stSegment?.morphology)}`],
      }));
      return findings;
    }

    findings.push(createFinding({
      id: `dx-brugada-pattern-${type.toLowerCase().replaceAll(' ', '-').replace(/[()]/g, '')}`,
      label: `Diagnostic suggestion: Brugada Pattern ${type}`,
      finding: `Brugada Pattern ${type}.`,
      basis: 'Manual Brugada rule: right-precordial V1-V3 coved or saddleback ST elevation pattern with pseudo-RBBB morphology, excluding complete RBBB and non-precordial ST elevation.',
      inputs: [`V1 STE: ${formatValue(v1Elevation)} mm`, `V2 STE: ${formatValue(v2Elevation)} mm`, `J-wave pattern: ${formatValue(report.lateWaveFindings?.jWaves)}`, `ST morphology: ${formatValue(report.stSegment?.morphology)}`],
    }));

    if (hasClinicalAny(report, ['syncope', 'stokes-adams', 'nocturnal agonal', 'sudden cardiac death', 'family history sudden death', 'palpitations'])) {
      findings.push(createFinding({
        id: 'alert-brugada-syndrome-risk',
        label: 'Critical alert: Brugada syndrome risk',
        finding: 'CRITICAL EMERGENCY: Brugada pattern identified in a patient with active syncope or family history of sudden death. High risk of fatal ventricular arrhythmias. Immediate cardiology consultation and ICD evaluation required.',
        basis: 'Brugada ECG pattern plus syncope, nocturnal agonal respirations, palpitations, or family sudden-death context raises concern for Brugada syndrome.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
