export const standardLeads = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

export const extendedLeads = [...standardLeads, 'V3R', 'V4R', 'V7', 'V8', 'V9'];

export const limbLeads = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF'];

export const territoryByLead: Record<string, 'septal' | 'anterior' | 'lateral' | 'inferior' | 'posterior' | 'right_ventricular'> = {
  V1: 'septal',
  V2: 'septal',
  V3: 'anterior',
  V4: 'anterior',
  I: 'lateral',
  aVL: 'lateral',
  V5: 'lateral',
  V6: 'lateral',
  II: 'inferior',
  III: 'inferior',
  aVF: 'inferior',
  V7: 'posterior',
  V8: 'posterior',
  V9: 'posterior',
  V3R: 'right_ventricular',
  V4R: 'right_ventricular',
};

export function territoriesForLeads(leads: string[]) {
  return Array.from(new Set(leads.map((lead) => territoryByLead[lead]).filter(Boolean)));
}

export function parseNumericInput(text: string) {
  const value = parseFloat(text);
  return Number.isFinite(value) ? value : undefined;
}

export function msFromSmallBoxes(smallBoxes?: number | null) {
  return smallBoxes !== undefined && smallBoxes !== null ? Math.round(smallBoxes * 40) : undefined;
}

export function toggleArrayValue<T extends string>(current: T[] | undefined | null, value: T) {
  const values = current || [];
  return values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
}
