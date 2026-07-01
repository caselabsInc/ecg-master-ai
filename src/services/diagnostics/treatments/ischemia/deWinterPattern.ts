import type { TreatmentGuidance } from '../types';

export const deWinterPatternTreatment: TreatmentGuidance = {
  conditionId: 'de_winter_pattern',
  conditionName: 'De Winter ST-T pattern',
  aliases: ['De Winter T waves', 'De Winter STEMI equivalent', 'Acute LAD occlusion pattern'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'STEMI-equivalent pattern suggesting acute proximal LAD occlusion despite absent classic ST elevation.',
  immediateActions: ['Activate cath lab immediately for suspected proximal LAD occlusion.', 'Give antiplatelet/anticoagulation therapy per STEMI-equivalent protocol.'],
  stableManagement: ['After PCI, initiate secondary prevention with DAPT, high-intensity statin, beta blocker, and ACE inhibitor/ARB when appropriate.'],
  unstableManagement: ['If shock, VF, or arrest occurs, follow ACLS and proceed to emergency revascularization.'],
  medications: [{ name: 'Aspirin', role: 'Immediate antiplatelet therapy.', dose: '325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active life-threatening bleeding'] }],
  avoidOrContraindications: [
    { therapy: 'Conservative NSTEMI-style management', reason: 'De Winter often represents complete LAD occlusion and delayed reperfusion can cause massive anterior MI.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Emergency coronary angiography and primary PCI.'],
  monitoring: ['Continuous precordial telemetry and serial ECGs for progression to anterior STEMI or VF.'],
  reversibleCauses: ['Proximal LAD thrombosis', 'Severe coronary vasospasm'],
  consultTriggers: ['Upsloping precordial ST depression with tall symmetric hyperacute T waves: immediate interventional cardiology consult.'],
  disposition: ['Acutely symptomatic De Winter pattern: cath lab/CCU pathway.'],
  redFlags: ['Bradycardia or heart block', 'Rales', 'Shortness of breath', 'VT/VF'],
  patientEducation: ['This ECG pattern can indicate a complete blockage in the main front heart artery even without standard ST elevation.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

