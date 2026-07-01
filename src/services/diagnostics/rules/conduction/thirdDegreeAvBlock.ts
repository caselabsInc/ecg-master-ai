import type { EcgReport } from '../../../db';
import { createFinding, formatValue, hasLeadIn, intervalsAreRegular } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';

function ratesAreNearEqual(atrialRate: number | null | undefined, ventricularRate: number | null | undefined) {
  if (typeof atrialRate !== 'number' || typeof ventricularRate !== 'number') return false;
  return Math.abs(atrialRate - ventricularRate) <= Math.max(5, atrialRate * 0.1);
}

function evaluateThirdDegreeAvBlockCriteria(report: Partial<EcgReport>) {
  const atrialRate = report.heartRate?.atrialRateBpm;
  const ventricularRate = report.heartRate?.ventricularRateBpm ?? report.heartRate?.calculatedBpm;
  const qrsMs = report.qrsComplex?.calculatedMs;
  const ppRegular = intervalsAreRegular(report.heartRate?.ppIntervalLargeBoxes);
  const rrRegular = report.heartRate?.regularity === 'regular' || intervalsAreRegular(report.heartRate?.rrIntervalLargeBoxes);
  const pWaveNormal =
    report.pWave?.presence === 'present' &&
    report.pWave?.morphology === 'normal';
  const avDissociation =
    report.rhythm?.pQrsRelationship === 'no_consistent_relationship' ||
    report.prInterval?.droppedBeatPattern === 'complete_av_block' ||
    report.prInterval?.avBlockConcern === 'complete';
  const atrialFasterThanVentricular =
    typeof atrialRate === 'number' &&
    typeof ventricularRate === 'number' &&
    atrialRate > ventricularRate;
  const avDissociationGuard =
    avDissociation &&
    typeof atrialRate === 'number' &&
    typeof ventricularRate === 'number' &&
    (ventricularRate >= atrialRate || ratesAreNearEqual(atrialRate, ventricularRate));
  const escapeOrigin =
    typeof ventricularRate === 'number' && ventricularRate < 40
      ? 'ventricular/Purkinje escape likely'
      : typeof ventricularRate === 'number' && ventricularRate >= 40 && ventricularRate <= 60
        ? 'junctional escape likely'
        : 'escape origin uncertain from rate';
  const qrsLocation =
    typeof qrsMs === 'number' && qrsMs >= 120
      ? 'wide QRS suggests lower His-Purkinje/ventricular escape'
      : typeof qrsMs === 'number' && qrsMs <= 110
        ? 'narrow QRS suggests high junctional escape'
        : 'QRS localization is uncertain';

  if (avDissociationGuard) {
    return {
      type: 'av_dissociation_not_primary_third_degree',
      diagnosis: 'Complete AV dissociation pattern without primary third-degree AV block criteria',
      urgency: 'Review underlying pacemaker rhythm and clinical context',
      location: 'Not a primary complete heart block classification',
      meetsCriteria: false,
      inputs: { ppRegular, rrRegular, pWaveNormal, avDissociation, atrialRate, ventricularRate, atrialFasterThanVentricular, qrsMs, escapeOrigin, qrsLocation },
    };
  }

  const meetsCriteria = ppRegular && rrRegular && pWaveNormal && avDissociation && atrialFasterThanVentricular;
  if (!meetsCriteria) return null;

  return {
    type: 'third_degree_av_block',
    diagnosis: 'Third-degree AV block / complete heart block',
    urgency: 'High priority: prepare for urgent pacing-capable review',
    location: `${escapeOrigin}; ${qrsLocation}`,
    meetsCriteria,
    inputs: { ppRegular, rrRegular, pWaveNormal, avDissociation, atrialRate, ventricularRate, atrialFasterThanVentricular, qrsMs, escapeOrigin, qrsLocation },
  };
}

export const thirdDegreeAvBlockRule: DiagnosticRule = {
  id: 'third-degree-av-block',
  evaluate(report) {
    const criteria = evaluateThirdDegreeAvBlockCriteria(report);
    if (!criteria) return [];

    if (criteria.type === 'av_dissociation_not_primary_third_degree') {
      return [createFinding({
        id: 'dx-av-dissociation-not-primary-third-degree',
        label: 'Safety exclusion: AV dissociation is not complete heart block',
        finding: 'AV dissociation is present, but atrial rate is not strictly faster than ventricular rate; do not classify as primary third-degree AV block.',
        basis: 'Third-degree AV block guardrail: complete heart block requires independent regular atrial and ventricular rhythms with atrial rate strictly greater than ventricular rate. Near-equal or ventricular-faster rhythms suggest AV dissociation from slowed sinus or accelerated lower pacemaker activity.',
        inputs: [
          `P-P intervals regular: ${formatValue(criteria.inputs.ppRegular)}`,
          `R-R intervals regular: ${formatValue(criteria.inputs.rrRegular)}`,
          `AV dissociation/no PR pattern: ${formatValue(criteria.inputs.avDissociation)}`,
          `Atrial rate: ${formatValue(criteria.inputs.atrialRate)} bpm`,
          `Ventricular rate: ${formatValue(criteria.inputs.ventricularRate)} bpm`,
          `Atrial rate > ventricular rate: ${formatValue(criteria.inputs.atrialFasterThanVentricular)}`,
        ],
      })];
    }

    const stLeads = report.stSegment?.leads ?? [];
    const qWaveLeads = report.qWaves?.leads ?? [];
    const findings: DiagnosticFinding[] = [
      createFinding({
        id: 'dx-third-degree-av-block',
        label: 'Diagnostic suggestion: third-degree AV block',
        finding: 'Third-degree AV block / complete heart block suggested by regular independent P-P and R-R rhythms, no consistent P-QRS relationship, and atrial rate faster than ventricular rate.',
        basis: 'Safety-bounded manual decision tree: complete heart block requires AV dissociation, regular independent atrial and ventricular rhythms, normal P-wave morphology, no true PR interval, and atrial rate strictly greater than ventricular rate.',
        inputs: [
          `P-P intervals regular: ${formatValue(criteria.inputs.ppRegular)}`,
          `R-R intervals regular: ${formatValue(criteria.inputs.rrRegular)}`,
          `P waves normal: ${formatValue(criteria.inputs.pWaveNormal)}`,
          `AV dissociation/no PR pattern: ${formatValue(criteria.inputs.avDissociation)}`,
          `P/QRS relationship: ${formatValue(report.rhythm?.pQrsRelationship)}`,
          `Atrial rate: ${formatValue(criteria.inputs.atrialRate)} bpm`,
          `Ventricular rate: ${formatValue(criteria.inputs.ventricularRate)} bpm`,
          `Atrial rate > ventricular rate: ${formatValue(criteria.inputs.atrialFasterThanVentricular)}`,
          `QRS duration: ${formatValue(criteria.inputs.qrsMs)} ms`,
          `Escape/localization: ${criteria.location}`,
        ],
      }),
      createFinding({
        id: 'alert-third-degree-av-block-pacing-safety',
        label: 'High-priority conduction alert',
        finding: 'Complete heart block can be unstable; prepare for urgent pacing-capable clinician review.',
        basis: 'Third-degree AV block safety boundary: atrial impulses are not conducting to the ventricles, so ventricular output depends on an escape pacemaker.',
        inputs: [
          `Diagnosis: ${criteria.diagnosis}`,
          `Urgency: ${criteria.urgency}`,
          `Ventricular rate: ${formatValue(criteria.inputs.ventricularRate)} bpm`,
          `QRS localization: ${criteria.inputs.qrsLocation}`,
        ],
      }),
    ];

    if (typeof criteria.inputs.qrsMs === 'number' && criteria.inputs.qrsMs <= 110 && (hasLeadIn(stLeads, ['ii', 'iii', 'avf']) || hasLeadIn(qWaveLeads, ['ii', 'iii', 'avf']))) {
      findings.push(createFinding({
        id: 'alert-third-degree-inferior-ischemia-correlation',
        label: 'Inferior ischemia correlation',
        finding: 'Narrow-QRS complete heart block coexists with inferior-lead ischemia/infarct clues; correlate for RCA/AV-nodal involvement.',
        basis: 'Third-degree AV block safety boundary: narrow escape rhythms can occur with AV-nodal block, including inferior wall/RCA ischemia.',
        inputs: [`ST leads: ${formatValue(stLeads)}`, `Q-wave leads: ${formatValue(qWaveLeads)}`],
      }));
    }

    if (typeof criteria.inputs.qrsMs === 'number' && criteria.inputs.qrsMs >= 120 && (hasLeadIn(stLeads, ['v1', 'v2', 'v3', 'v4']) || hasLeadIn(qWaveLeads, ['v1', 'v2', 'v3', 'v4']))) {
      findings.push(createFinding({
        id: 'alert-third-degree-anteroseptal-ischemia-correlation',
        label: 'Anteroseptal ischemia correlation',
        finding: 'Wide-QRS complete heart block coexists with anteroseptal ischemia/infarct clues; correlate for LAD/infranodal bundle-system involvement.',
        basis: 'Third-degree AV block safety boundary: wide escape rhythms suggest lower His-Purkinje/ventricular escape and should be correlated with anterior or anteroseptal ischemic patterns when present.',
        inputs: [`ST leads: ${formatValue(stLeads)}`, `Q-wave leads: ${formatValue(qWaveLeads)}`],
      }));
    }

    return findings;
  },
};

