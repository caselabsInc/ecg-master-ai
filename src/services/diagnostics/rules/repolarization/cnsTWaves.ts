import { createFinding, formatValue, hasLeadIn } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { getQtcMs, hasClinicalAny, isNarrowQrs, normalizedLeads, rate } from './helpers';

export const cnsTWavesRule: DiagnosticRule = {
  id: 'cns-t-waves',
  evaluate(report): DiagnosticFinding[] {
    const qtcMs = getQtcMs(report);
    const bpm = rate(report);
    const leads = normalizedLeads(report.tWaves?.leads);
    const diffusePrecordial = hasLeadIn(leads, ['v2', 'v3', 'v4']) && hasLeadIn(leads, ['v5', 'v6']);
    const cnsContext = report.tWaves?.syndromePattern === 'cns_pattern' || hasClinicalAny(report, ['subarachnoid', 'intracranial hemorrhage', 'intracranial haemorrhage', 'stroke', 'traumatic brain', 'raised intracranial', 'cns event', 'neurologic emergency', 'neurological emergency']);
    const deepSymmetricT = report.tWaves?.status === 'deep_symmetric' ||
      (report.tWaves?.status === 'inverted' && report.tWaves?.morphology === 'symmetric' && diffusePrecordial);

    if (report.tWaves?.status === 'inverted' && report.tWaves?.morphology === 'asymmetric' && (typeof qtcMs !== 'number' || qtcMs < 500) && report.tWaves?.syndromePattern === 'cns_pattern') {
      return [createFinding({
        id: 'exclude-cns-t-waves-asymmetric-normal-qt',
        label: 'Safety exclusion: CNS T-wave pattern',
        finding: 'Inverted T waves are asymmetric with normal QT interval. CNS pattern is ruled out; evaluate for primary myocardial ischemia.',
        basis: 'CNS T waves should be deep, broad-based, symmetric, diffuse, and associated with marked QT prolongation.',
        inputs: [`T-wave morphology: ${formatValue(report.tWaves?.morphology)}`, `QTc: ${formatValue(qtcMs)} ms`],
      })];
    }

    if (!(cnsContext && deepSymmetricT && isNarrowQrs(report) && (typeof qtcMs === 'number' ? qtcMs >= 500 : report.qtInterval?.qtRisk === 'markedly_long'))) {
      return [];
    }

    return [
      createFinding({
        id: 'dx-cns-t-wave-pattern',
        label: 'Diagnostic suggestion: CNS T-wave pattern',
        finding: 'Diffuse, Deeply Inverted, Broad-Based T Waves suggestive of Central Nervous System (CNS) Pattern (Cerebral T Waves).',
        basis: 'Manual CNS repolarisation rule: acute neurologic context with diffuse deep symmetric T-wave inversion across precordial/lateral leads and QTc >=500 ms.',
        inputs: [`Rate: ${formatValue(bpm)} bpm`, `T-wave leads: ${formatValue(leads)}`, `T-wave status/morphology: ${formatValue(report.tWaves?.status)} / ${formatValue(report.tWaves?.morphology)}`, `QTc: ${formatValue(qtcMs)} ms`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }),
      createFinding({
        id: 'alert-cns-t-wave-torsades-risk',
        label: 'High-priority alert: CNS T-wave pattern',
        finding: 'WARNING: Neurogenic repolarisation pattern identified. Extreme prolongation of the QT interval increases the risk of polymorphic VT/Torsades de Pointes. Monitor cardiac rhythm closely while managing the primary intracranial pathology.',
        basis: 'Autonomic dysregulation in acute CNS injury can markedly prolong repolarization and trigger malignant ventricular arrhythmias.',
        inputs: [`QT risk: ${formatValue(report.qtInterval?.qtRisk)}`, `QTc: ${formatValue(qtcMs)} ms`],
      }),
    ];
  },
};
