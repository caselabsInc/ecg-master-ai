import type { TreatmentGuidance } from '../types';

export const posteriorOmiTreatment: TreatmentGuidance = {
  conditionId: 'posterior_omi',
  conditionName: 'Posterior wall myocardial infarction',
  aliases: ['Posterior STEMI', 'Posterior OMI', 'Reciprocal anterior ST-depression MI'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Posterior transmural infarction often seen indirectly as ST depression V1-V3 with tall R waves/upright T waves.',
  immediateActions: ['Obtain posterior leads V7-V9 immediately.', 'Treat confirmed or strongly suspected posterior OMI as a STEMI equivalent with cath lab activation.'],
  stableManagement: ['After reperfusion, use post-MI secondary prevention and monitor for ischemic mitral regurgitation.'],
  unstableManagement: ['Urgent revascularization and hemodynamic support for shock, pulmonary edema, or new systolic murmur.'],
  medications: [{ name: 'Aspirin', role: 'Immediate antiplatelet therapy.', dose: '325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active severe bleeding'] }],
  avoidOrContraindications: [
    { therapy: 'Dismissing V1-V3 ST depression as simple NSTEMI', reason: 'Posterior OMI can be a complete occlusion requiring emergent reperfusion.', dangerLevel: 'avoid' },
  ],
  procedures: ['Posterior ECG leads.', 'Emergency coronary angiography/primary PCI for confirmed or high-suspicion posterior OMI.'],
  monitoring: ['Continuous telemetry, posterior lead reassessment, serial ECG/troponins.'],
  reversibleCauses: ['Coronary thrombosis', 'Coronary spasm', 'Aortic dissection involving coronary ostia'],
  consultTriggers: ['ST depression V1-V3 with tall R waves/upright T waves: immediate cardiology/cath lab discussion.'],
  disposition: ['Suspected posterior OMI: cath lab/CCU pathway.'],
  redFlags: ['New apical systolic murmur', 'Pulmonary edema', 'Hypotension', 'VT runs'],
  patientEducation: ['A blockage on the back wall of the heart can appear as downward ST changes in front leads and needs urgent artery-opening treatment.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

