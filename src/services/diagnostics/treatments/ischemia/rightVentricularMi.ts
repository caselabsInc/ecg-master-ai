import type { TreatmentGuidance } from '../types';

export const rightVentricularMiTreatment: TreatmentGuidance = {
  conditionId: 'right_ventricular_mi',
  conditionName: 'Right ventricular infarction',
  aliases: ['RVMI', 'Right ventricular MI', 'Preload-dependent inferior MI'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Right ventricular infarction, usually with inferior MI, causing preload-dependent cardiac output and hypotension risk.',
  immediateActions: ['Obtain right-sided leads, especially V4R, in inferior MI.', 'If hypotensive with clear lungs, give cautious normal saline boluses per protocol.', 'Activate reperfusion pathway.'],
  stableManagement: ['After reperfusion, avoid dehydration and monitor for AV block and transient right-sided failure.'],
  unstableManagement: ['For refractory hypotension despite fluids, use inotropic/hemodynamic support and immediate PCI.'],
  medications: [{ name: 'Normal saline', role: 'Maintain RV preload in hypotensive RVMI with clear lungs.', dose: '500-1000 mL boluses up to 1-2 L where protocol supports.', route: 'IV', cautions: ['Stop if pulmonary rales/left-sided failure develop'] }],
  avoidOrContraindications: [
    { therapy: 'Nitrates, morphine, or diuretics in hypotensive RVMI', reason: 'Preload reduction can cause catastrophic hypotension.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Right-sided ECG leads.', 'Emergency coronary angiography/PCI of culprit artery.'],
  monitoring: ['Continuous telemetry, blood pressure, lung exam, JVP, AV block surveillance.'],
  reversibleCauses: ['Proximal RCA thrombosis', 'Severe volume depletion'],
  consultTriggers: ['ST elevation in V4R or inferior MI with hypotension/clear lungs/elevated JVP.'],
  disposition: ['Hypotensive inferior MI/RVMI: cath lab then CCU.'],
  redFlags: ['Profound hypotension after nitroglycerin', 'Elevated JVP with clear lungs', 'Kussmaul sign', 'High-degree AV block'],
  patientEducation: ['The right side of the heart is involved, so some usual chest-pain medicines can drop blood pressure dangerously; fluids and reperfusion are key.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

