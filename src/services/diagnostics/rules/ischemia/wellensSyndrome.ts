import { createFinding, formatValue, hasLeadIn } from '../../helpers';
import type { DiagnosticFinding, DiagnosticRule } from '../../types';
import { hasActiveChestPain, isPainFreeWellensContext } from './ischemiaHelpers';

export const wellensSyndromeRule: DiagnosticRule = {
  id: 'wellens-syndrome',
  evaluate(report) {
    const findings: DiagnosticFinding[] = [];
    const activeChestPain = hasActiveChestPain(report);
    const wellensType = report.tWaves?.syndromePattern === 'wellens_a' ? 'Type A Biphasic' : report.tWaves?.syndromePattern === 'wellens_b' ? 'Type B Deeply Inverted' : report.stSegment?.omiPattern === 'wellens' ? 'Type not specified' : null;
    if (!wellensType) return findings;

    if (activeChestPain || (report.qWaves?.present && hasLeadIn(report.qWaves?.leads, ['v1', 'v2', 'v3', 'v4']))) {
      findings.push(createFinding({
        id: 'exclude-wellens-active-infarction',
        label: 'Safety exclusion: Wellens criteria',
        finding: 'Active chest pain is present or pathological anterior Q waves are visible. Wellens criteria are not applicable; assess for active infarction or old MI.',
        basis: 'Wellens is a pain-free reperfusion pattern and should not be diagnosed during active occlusion symptoms or completed anterior infarction.',
        inputs: [`Active chest pain: ${formatValue(activeChestPain)}`, `Q-wave leads: ${formatValue(report.qWaves?.leads)}`],
      }));
    } else if (isPainFreeWellensContext(report) || report.stSegment?.omiPattern === 'wellens' || report.tWaves?.syndromePattern?.startsWith('wellens')) {
      findings.push(createFinding({
        id: 'dx-wellens-syndrome',
        label: 'Diagnostic suggestion: Wellens Syndrome',
        finding: `Wellens Syndrome [${wellensType}] (Critical Proximal LAD Stenosis Pattern).`,
        basis: 'Manual ischemia rule: pain-free/recent angina context with V2-V3 biphasic or deep symmetric T-wave inversion, no significant anterior ST elevation, and no pathological anterior Q waves.',
        inputs: [`T-wave syndrome: ${formatValue(report.tWaves?.syndromePattern)}`, `R-wave progression: ${formatValue(report.rWaveProgression)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
      findings.push(createFinding({
        id: 'alert-wellens-stress-test-contraindication',
        label: 'Critical alert: Wellens stress-test contraindication',
        finding: "CRITICAL WARNING: Wellens syndrome detected. Indicates critical proximal LAD stenosis ('widow-maker'). Stress testing is strictly CONTRAINDICATED. Transfer patient immediately for urgent coronary angiography.",
        basis: 'Stress testing can precipitate complete LAD re-occlusion in Wellens syndrome.',
        inputs: [`Pain-free/recent angina context: ${formatValue(isPainFreeWellensContext(report))}`],
      }));
    }

    return findings;
  },
};
