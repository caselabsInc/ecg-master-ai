import type { TreatmentGuidance } from '../types';

export const leftMainMultivesselIschemiaTreatment: TreatmentGuidance = {
  conditionId: 'left_main_or_multivessel_ischemia',
  conditionName: 'Left main or multivessel ischemia pattern',
  aliases: ['LMCA ischemia pattern', 'Severe triple-vessel disease', 'aVR ST-elevation ischemia'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Diffuse ST depression with aVR elevation suggesting global subendocardial ischemia from left main or severe multivessel disease.',
  immediateActions: ['Consult interventional cardiology and cardiothoracic surgery immediately.', 'Give aspirin if no contraindication and maintain perfusion pressure.'],
  stableManagement: ['There is no truly low-risk stable phase when symptomatic; maintain anti-ischemic therapy until definitive revascularization.'],
  unstableManagement: ['For shock or pulmonary edema, use critical care support/mechanical circulatory support while proceeding to emergency angiography.'],
  medications: [{ name: 'Aspirin', role: 'Immediate antiplatelet therapy.', dose: '325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active severe bleeding'] }],
  avoidOrContraindications: [
    { therapy: 'Aggressive IV nitrates/vasodilators causing hypotension', reason: 'Left main perfusion is highly pressure-dependent; hypotension can cause global infarction/arrest.', dangerLevel: 'avoid' },
    { therapy: 'Conservative-only management', reason: 'Left main/multivessel ischemia can have very high mortality if not urgently revascularized.', dangerLevel: 'avoid' },
  ],
  procedures: ['Emergency coronary angiography.', 'CABG or complex PCI depending anatomy and stability.'],
  monitoring: ['Continuous telemetry, lead aVR/ST trend, blood pressure, shock markers, troponins.'],
  reversibleCauses: ['Critical left main stenosis', 'Severe triple-vessel CAD', 'Aortic dissection involving coronary ostia'],
  consultTriggers: ['aVR ST elevation with diffuse ST depression: immediate cardiology and cardiothoracic surgery consult.'],
  disposition: ['Symptomatic left main/multivessel pattern: cath lab/CCU or ICU pathway.'],
  redFlags: ['Pulmonary edema', 'SBP <90', 'VT/VF', 'Altered consciousness', 'Worsening aVR elevation'],
  patientEducation: ['This ECG suggests reduced blood flow across a large area of heart muscle and may need urgent catheterization and possible surgery.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

