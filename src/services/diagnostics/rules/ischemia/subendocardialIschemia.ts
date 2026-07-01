import { createFinding, formatValue, getBpm, hasClinicalKeyword } from '../../helpers';
import type { DiagnosticRule } from '../../types';
import { getDepressedLeads, hasActiveChestPain } from './ischemiaHelpers';

export const subendocardialIschemiaRule: DiagnosticRule = {
  id: 'subendocardial-ischemia',
  evaluate(report) {
    const findings = [];
    const depressedLeads = getDepressedLeads(report);
    const activeChestPain = hasActiveChestPain(report);

    if (report.stSegment?.status === 'depressed' && report.stSegment?.morphology === 'upsloping') {
      findings.push(createFinding({
        id: 'exclude-st-depression-upsloping',
        label: 'Safety exclusion: subendocardial ischemia',
        finding: 'ST-segment depression is upsloping. Ischemia is excluded; assess for physiological tachycardia or exercise response.',
        basis: 'Subendocardial ischemia criteria require horizontal or downsloping ST depression.',
        inputs: [`ST morphology: ${formatValue(report.stSegment?.morphology)}`, `Rate: ${formatValue(getBpm(report))} bpm`],
      }));
    } else if (report.stSegment?.status === 'depressed' && hasClinicalKeyword(report, ['digoxin', 'digitalis']) && report.stSegment?.morphology === 'saddleback') {
      findings.push(createFinding({
        id: 'exclude-st-depression-digoxin-effect',
        label: 'Safety exclusion: subendocardial ischemia',
        finding: 'ST-segment depression is scooped/sagging in a digoxin context. Ischemia is excluded; assess for Digitalis effect.',
        basis: 'Digoxin effect can produce characteristic scooped ST depression.',
        inputs: [`ST morphology: ${formatValue(report.stSegment?.morphology)}`, `Clinical text: ${formatValue(report.context?.indication ?? report.additionalNotes)}`],
      }));
    } else if (depressedLeads.length >= 2 && (report.stSegment?.morphology === 'horizontal' || report.stSegment?.morphology === 'downsloping' || report.stSegment?.status === 'depressed')) {
      findings.push(createFinding({
        id: 'dx-subendocardial-ischemia',
        label: 'Diagnostic suggestion: ST depression / subendocardial ischemia',
        finding: 'ECG changes suggestive of Myocardial Ischemia / Subendocardial Injury Pattern.',
        basis: 'Manual ischemia rule: ST depression >=0.5 mm in two or more contiguous leads with horizontal/downsloping morphology, excluding digoxin/strain/secondary repolarization patterns when documented.',
        inputs: [`Depressed leads: ${formatValue(depressedLeads)}`, `ST morphology: ${formatValue(report.stSegment?.morphology)}`, `Mimics: ${formatValue(report.stSegment?.mimicConsiderations)}`],
      }));
      if (activeChestPain) {
        findings.push(createFinding({
          id: 'alert-nste-acs-st-depression',
          label: 'High-priority alert: NSTE-ACS pattern',
          finding: 'WARNING: Precordial ST-segment depression in a patient with active chest pain suggests Non-ST-Elevation ACS (NSTEMI/Unstable Angina). Highly unstable; seek immediate medical evaluation.',
          basis: 'ST depression with ischemic symptoms indicates acute coronary syndrome risk.',
          inputs: [`Active chest pain: ${formatValue(activeChestPain)}`],
        }));
      }
    }

    return findings;
  },
};
