import type { TreatmentGuidance } from '../types';

export const leftVentricularHypertrophyTreatment: TreatmentGuidance = {
  conditionId: 'left_ventricular_hypertrophy',
  conditionName: 'Left ventricular hypertrophy',
  aliases: ['LVH', 'LV hypertrophy', 'LVH with strain'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Increased left ventricular myocardial mass, usually from chronic pressure or volume overload such as hypertension, aortic stenosis, or valvular regurgitation.',
  immediateActions: ['Isolated stable LVH does not require acute rhythm treatment; direct care toward the underlying structural or hemodynamic cause.'],
  stableManagement: ['Optimize long-term blood pressure control and cardiovascular risk reduction.', 'Obtain transthoracic echocardiography to confirm LV mass, wall thickness, systolic/diastolic function, and valve disease.'],
  unstableManagement: ['If chest pain, shock, syncope, or acute dyspnea is present, evaluate for ACS, severe aortic stenosis, hypertrophic cardiomyopathy, or heart failure rather than attributing symptoms to chronic LVH alone.'],
  medications: [
    {
      name: 'ACE inhibitor or ARB',
      role: 'Blood pressure control and regression of hypertensive LVH when clinically appropriate.',
      dose: 'Verify local protocol.',
      route: 'Oral',
      cautions: ['Check renal function and potassium after initiation or titration.', 'Avoid in pregnancy, prior angioedema, or bilateral renal artery stenosis.'],
      source: 'Harrisons Principles of Internal Medicine, Electrocardiography, 2012',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Aggressive vasodilators in suspected severe aortic stenosis or obstructive HCM', reason: 'Marked preload/afterload reduction can precipitate syncope, shock, or arrest.', dangerLevel: 'avoid' },
    { therapy: 'Dismissing ischemic symptoms as LVH strain', reason: 'LVH repolarization changes can mimic or mask acute ischemia; symptomatic patients need ACS evaluation.', dangerLevel: 'avoid' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Serial ECG/troponin evaluation when active ischemic symptoms are present.'],
  monitoring: ['Outpatient blood pressure monitoring.', 'Renal function and electrolytes when RAAS blockade or diuretics are used.', 'Follow-up echo when symptoms, murmur, or heart failure signs evolve.'],
  reversibleCauses: ['Systemic hypertension', 'Aortic stenosis', 'Aortic or mitral regurgitation', 'Hypertrophic cardiomyopathy', 'Obesity/high body mass index'],
  consultTriggers: ['Exertional syncope, angina, or dyspnea.', 'LVH strain out of proportion to known hypertension.', 'Concern for severe valve disease, HCM, or heart failure.'],
  disposition: ['Asymptomatic chronic LVH: outpatient risk-factor management and echocardiography.', 'LVH with exertional syncope, chest pain, pulmonary edema, or shock: urgent ED/cardiology evaluation.'],
  redFlags: ['Exertional syncope', 'Angina', 'New heart failure symptoms', 'Harsh systolic murmur', 'Progression to LBBB'],
  patientEducation: ['The ECG suggests thickening of the main pumping chamber. Treatment focuses on finding and controlling the cause, especially blood pressure or valve disease.'],
  missingEvidence: ['ECG voltage criteria are specific but not sensitive; a normal ECG does not exclude structural LVH.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
