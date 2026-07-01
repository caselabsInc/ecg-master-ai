import type { EcgReport } from '../../../db';
import { formatValue, hasClinicalKeyword, hasLeadIn } from '../../helpers';

export const TERRITORIES = {
  septal: ['v1', 'v2'],
  anterior: ['v3', 'v4'],
  inferior: ['ii', 'iii', 'avf'],
  highLateral: ['i', 'avl'],
  lowLateral: ['v5', 'v6'],
  posterior: ['v7', 'v8', 'v9'],
  rightVentricular: ['v3r', 'v4r', 'v5r', 'v6r'],
};

export function normalizeLead(lead: string) {
  return lead.toLowerCase().replaceAll(' ', '');
}

export function normalizedLeads(leads: string[] | null | undefined) {
  return (leads ?? []).map(normalizeLead);
}

export function getDeviation(report: Partial<EcgReport>, lead: string) {
  const deviations = report.stSegment?.leadDeviationMm ?? {};
  const candidates = [lead, lead.toUpperCase(), lead.toLowerCase(), normalizeLead(lead)];
  for (const candidate of candidates) {
    const value = deviations[candidate];
    if (typeof value === 'number') return value;
  }
  return null;
}

export function getElevatedLeads(report: Partial<EcgReport>) {
  const deviationLeads = Object.keys(report.stSegment?.leadDeviationMm ?? {})
    .filter((lead) => (getDeviation(report, lead) ?? 0) > 0)
    .map(normalizeLead);
  if (deviationLeads.length) return deviationLeads;
  return report.stSegment?.status === 'elevated' ? normalizedLeads(report.stSegment?.leads) : [];
}

export function getDepressedLeads(report: Partial<EcgReport>) {
  const deviationLeads = Object.keys(report.stSegment?.leadDeviationMm ?? {})
    .filter((lead) => (getDeviation(report, lead) ?? 0) < 0)
    .map(normalizeLead);
  if (deviationLeads.length) return deviationLeads;
  return report.stSegment?.status === 'depressed' ? normalizedLeads(report.stSegment?.leads) : [];
}

export function leadMeetsSteThreshold(report: Partial<EcgReport>, lead: string) {
  const deviation = getDeviation(report, lead);
  if (typeof deviation !== 'number') return report.stSegment?.status === 'elevated' && normalizedLeads(report.stSegment?.leads).includes(normalizeLead(lead));
  if (deviation <= 0) return false;

  const normalized = normalizeLead(lead);
  if (normalized !== 'v2' && normalized !== 'v3') return deviation >= 1;

  const age = report.context?.age;
  const gender = report.context?.gender;
  if (gender === 'female') return deviation >= 1.5;
  if (gender === 'male' && typeof age === 'number' && age < 40) return deviation >= 2.5;
  return deviation >= 2;
}

export function leadMeetsStdThreshold(report: Partial<EcgReport>, lead: string, threshold = 0.5) {
  const deviation = getDeviation(report, lead);
  if (typeof deviation === 'number') return deviation <= -threshold;
  return report.stSegment?.status === 'depressed' && normalizedLeads(report.stSegment?.leads).includes(normalizeLead(lead));
}

export function countMatches(leads: string[], targets: string[]) {
  return targets.filter((lead) => leads.includes(lead)).length;
}

export function getStemiTerritories(report: Partial<EcgReport>) {
  const territories: { key: string; label: string; artery: string; leads: string[] }[] = [];
  const qualifyingSte = Array.from(new Set([...getElevatedLeads(report), ...Object.keys(report.stSegment?.leadDeviationMm ?? {}).map(normalizeLead)]))
    .filter((lead) => leadMeetsSteThreshold(report, lead));

  const inferiorCount = countMatches(qualifyingSte, TERRITORIES.inferior);
  const septalCount = countMatches(qualifyingSte, TERRITORIES.septal);
  const anteriorCount = countMatches(qualifyingSte, TERRITORIES.anterior);
  const highLateralCount = countMatches(qualifyingSte, TERRITORIES.highLateral);
  const lowLateralCount = countMatches(qualifyingSte, TERRITORIES.lowLateral);

  if (inferiorCount >= 2) territories.push({ key: 'inferior', label: 'Inferior', artery: 'RCA or LCx', leads: TERRITORIES.inferior.filter((lead) => qualifyingSte.includes(lead)) });
  if (septalCount >= 2 && anteriorCount >= 2) territories.push({ key: 'anteroseptal', label: 'Anteroseptal', artery: 'LAD', leads: [...TERRITORIES.septal, ...TERRITORIES.anterior].filter((lead) => qualifyingSte.includes(lead)) });
  else if (septalCount >= 2) territories.push({ key: 'septal', label: 'Septal', artery: 'LAD', leads: TERRITORIES.septal.filter((lead) => qualifyingSte.includes(lead)) });
  else if (anteriorCount >= 2) territories.push({ key: 'anterior', label: 'Anterior', artery: 'LAD', leads: TERRITORIES.anterior.filter((lead) => qualifyingSte.includes(lead)) });
  if (highLateralCount >= 2 || lowLateralCount >= 2) territories.push({ key: 'lateral', label: 'Lateral', artery: 'LCx or Diagonal LAD', leads: [...TERRITORIES.highLateral, ...TERRITORIES.lowLateral].filter((lead) => qualifyingSte.includes(lead)) });

  if (report.stSegment?.stemiCriteriaMet && territories.length === 0 && qualifyingSte.length >= 2) {
    territories.push({ key: 'unspecified', label: 'Regional', artery: 'coronary artery territory uncertain from lead data', leads: qualifyingSte });
  }

  return territories;
}

export function hasLbbbOrPaced(report: Partial<EcgReport>) {
  return report.qrsComplex?.bbb?.pattern === 'lbbb' ||
    report.rhythm?.pacerSpikes === 'ventricular' ||
    report.rhythm?.pacerSpikes === 'dual' ||
    report.qrsComplex?.morphology === 'paced' ||
    report.qrsComplex?.findings?.includes('paced') ||
    report.stSegment?.mimicConsiderations?.includes('lbbb') ||
    report.stSegment?.mimicConsiderations?.includes('paced_rhythm');
}

export function isDiffusePericarditisLike(report: Partial<EcgReport>) {
  return report.stSegment?.mimicConsiderations?.includes('pericarditis') ||
    (report.stSegment?.status === 'elevated' && report.stSegment?.morphology === 'concave' && report.prInterval?.segmentStatus === 'depressed' && (report.stSegment?.leads?.length ?? 0) >= 6);
}

export function hasVentricularAneurysmClue(report: Partial<EcgReport>) {
  return report.stSegment?.mimicConsiderations?.includes('ventricular_aneurysm') ||
    (report.qWaves?.present === true && report.stSegment?.status === 'elevated' && hasClinicalKeyword(report, ['old mi', 'prior mi', 'aneurysm', 'persistent st elevation']));
}

export function hasActiveChestPain(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['chest pain', 'crushing pain', 'retrosternal', 'angina', 'acs', 'ischemia', 'ischaemia']);
}

export function isPainFreeWellensContext(report: Partial<EcgReport>) {
  return hasClinicalKeyword(report, ['pain free', 'pain-free', 'resolved chest pain', 'recent angina', 'unstable angina']) && !hasClinicalKeyword(report, ['active chest pain', 'ongoing chest pain', 'currently has chest pain']);
}

export function hasReciprocalChangesForTerritory(territory: string, depressedLeads: string[]) {
  if (territory === 'inferior') return hasLeadIn(depressedLeads, ['i', 'avl']);
  if (territory === 'lateral') return hasLeadIn(depressedLeads, ['ii', 'iii', 'avf']);
  if (territory === 'anterior' || territory === 'anteroseptal') return hasLeadIn(depressedLeads, ['ii', 'iii', 'avf']);
  return false;
}

export function getQWaveTerritory(report: Partial<EcgReport>) {
  const territories = report.qWaves?.territories ?? [];
  if (territories.length) return territories.map(formatValue).join(', ');
  const leads = normalizedLeads(report.qWaves?.leads);
  if (countMatches(leads, TERRITORIES.inferior) >= 2) return 'inferior';
  if (countMatches(leads, TERRITORIES.septal) >= 2) return 'septal';
  if (countMatches(leads, TERRITORIES.anterior) >= 2) return 'anterior';
  if (countMatches(leads, [...TERRITORIES.highLateral, ...TERRITORIES.lowLateral]) >= 2) return 'lateral';
  return 'territory uncertain';
}
