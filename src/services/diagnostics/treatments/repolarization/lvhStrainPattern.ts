import type { TreatmentGuidance } from '../types';

export const lvhStrainPatternTreatment: TreatmentGuidance = {
  conditionId: 'lvh_strain_pattern',
  conditionName: 'LVH with lateral strain pattern',
  aliases: ['LVH strain', 'Secondary ST-T changes from LVH', 'Lateral strain pattern'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Secondary repolarization abnormality from LVH, typically lateral ST depression and asymmetric T-wave inversion caused by chronic pressure overload and delayed ventricular recovery.',
  immediateActions: ['Do not treat isolated chronic LVH strain as a STEMI equivalent.', 'If symptoms are active or ST-T changes are dynamic, evaluate for superimposed ACS with serial ECGs and troponins.'],
  stableManagement: ['Confirm structural LVH and valve status with echocardiography.', 'Optimize hypertension and cardiovascular risk-factor control.'],
  unstableManagement: ['Chest pain, shock, pulmonary edema, or new dynamic ST depression requires ACS/heart-failure management rather than attribution to chronic strain.'],
  medications: [
    { name: 'Antihypertensive therapy', role: 'Treats the most common cause of LVH strain and may regress LV mass over time.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['Check renal function and electrolytes when RAAS blockers or diuretics are used.'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Dismissing active ischemic symptoms as LVH strain', reason: 'LVH strain can mask or mimic acute ischemia; dynamic changes or symptoms need ACS evaluation.', dangerLevel: 'avoid' },
    { therapy: 'Aggressive vasodilation in suspected severe aortic stenosis or obstructive HCM', reason: 'Can precipitate collapse in preload/afterload-dependent obstructive disease.', dangerLevel: 'avoid' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Serial ECGs/troponins when ischemic symptoms or changing ST-T patterns are present.'],
  monitoring: ['Blood pressure trend.', 'Heart-failure symptoms.', 'Renal function and potassium during antihypertensive titration.'],
  reversibleCauses: ['Hypertension', 'Aortic stenosis', 'Hypertrophic cardiomyopathy', 'Aortic or mitral regurgitation'],
  consultTriggers: ['Active chest pain with LVH strain', 'Exertional syncope', 'Suspected severe valve disease or HCM', 'New heart failure symptoms'],
  disposition: ['Stable chronic LVH strain: outpatient echo/risk-factor management.', 'LVH strain with chest pain, syncope, pulmonary edema, or dynamic ECG changes: urgent evaluation.'],
  redFlags: ['Dynamic ST depression', 'Chest pain', 'Syncope', 'Pulmonary edema', 'Severe hypertension with end-organ symptoms'],
  patientEducation: ['This pattern often reflects strain from a thickened pumping chamber. The key is controlling the cause and not ignoring new chest pain or fainting.'],
  missingEvidence: ['ECG strain does not quantify LV mass reliably; structural confirmation requires imaging.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
