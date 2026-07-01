import type { EcgReport } from '../../../db';
import { createFinding, formatValue, hasLeadIn } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { activeChestPain, getCornellThreshold, hasLateralStrain, hasLbbbOrPacing, isNarrowQrs } from './helpers';

export const leftVentricularHypertrophyRule: DiagnosticRule = {
  id: 'left-ventricular-hypertrophy',
  evaluate(report: Partial<EcgReport>): DiagnosticFinding[] {
    const findings: DiagnosticFinding[] = [];
    const qrsMs = report.qrsComplex?.calculatedMs;
    const hypertrophy = report.qrsComplex?.hypertrophy;
    const sokolowLyon = (hypertrophy?.lvhSInV1 ?? 0) + (hypertrophy?.lvhRInV5V6 ?? 0);
    const cornell = (hypertrophy?.cornellRaVL ?? 0) + (hypertrophy?.cornellSV3 ?? 0);
    const cornellThreshold = getCornellThreshold(report);
    const meetsSokolow = sokolowLyon >= 35;
    const meetsCornell = report.context?.gender === 'female' ? cornell > 20 : cornell >= 28;
    const lvhVoltage = meetsSokolow || meetsCornell;

    if (hasLbbbOrPacing(report) && (lvhVoltage || hypertrophy?.strainPattern)) {
      findings.push(createFinding({
        id: 'exclude-lvh-lbbb-paced',
        label: 'Safety exclusion: LVH voltage',
        finding: 'LBBB or Ventricular Pacing is present. Standard QRS voltage formulas for LVH are highly unreliable.',
        basis: 'LBBB and ventricular pacing distort QRS amplitudes and secondary repolarisation pathways.',
        inputs: [`BBB pattern: ${formatValue(report.qrsComplex?.bbb?.pattern)}`, `Pacer spikes: ${formatValue(report.rhythm?.pacerSpikes)}`, `QRS duration: ${formatValue(qrsMs)} ms`],
      }));
      return findings;
    }

    if (!isNarrowQrs(report) || (!lvhVoltage && !hypertrophy?.strainPattern)) return findings;

    const strain = hasLateralStrain(report);
    findings.push(createFinding({
      id: 'dx-left-ventricular-hypertrophy',
      label: 'Diagnostic suggestion: Left Ventricular Hypertrophy',
      finding: `ECG meets voltage criteria for Left Ventricular Hypertrophy (LVH) ${strain ? 'with lateral strain pattern' : 'without strain repolarisation changes'}.`,
      basis: 'Manual LVH rule: Sokolow-Lyon voltage >=35 mm and/or sex-specific Cornell voltage threshold, with QRS <120 ms and standard calibration.',
      inputs: [
        `Sokolow-Lyon S(V1)+R(V5/V6): ${formatValue(sokolowLyon)} mm`,
        `Cornell R(aVL)+S(V3): ${formatValue(cornell)} mm`,
        `Cornell threshold: ${formatValue(cornellThreshold)} mm`,
        `Strain pattern: ${formatValue(strain)}`,
        `QRS duration: ${formatValue(qrsMs)} ms`,
      ],
    }));

    if (typeof report.context?.age === 'number' && report.context.age < 35 && lvhVoltage) {
      findings.push(createFinding({
        id: 'caution-lvh-youth-voltage',
        label: 'LVH voltage caution',
        finding: 'Patient is younger than 35 years; high chest-wall voltage may represent a normal physiologic variant in young adults or athletes.',
        basis: 'Young, thin adults can meet LVH voltage criteria without anatomical hypertrophy.',
        inputs: [`Age: ${formatValue(report.context.age)}`],
      }));
    }

    if (hasLeadIn(report.stSegment?.leads, ['v1', 'v2', 'v3']) && report.stSegment?.status === 'elevated') {
      findings.push(createFinding({
        id: 'alert-lvh-anterior-stemi-mimic',
        label: 'High-priority alert: LVH STEMI mimic',
        finding: 'WARNING: LVH with right precordial ST elevation is present, which mimics and masks acute coronary injury. Correlate clinically or compare with baseline tracings.',
        basis: 'LVH can produce secondary discordant ST elevation in V1-V3 and complicate anterior STEMI assessment.',
        inputs: [`ST leads: ${formatValue(report.stSegment?.leads)}`, `Active chest pain: ${formatValue(activeChestPain(report))}`],
      }));
    }

    if (strain && activeChestPain(report)) {
      findings.push(createFinding({
        id: 'alert-lvh-strain-active-chest-pain',
        label: 'High-priority alert: LVH with ischemic symptoms',
        finding: 'LVH strain with active chest pain may hide superimposed acute subendocardial ischemia. Evaluate urgently and compare with prior ECGs.',
        basis: 'Extreme or changing ST depression/T-wave inversion during symptoms can represent acute ischemia superimposed on chronic strain.',
        inputs: [`Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    }

    return findings;
  },
};
