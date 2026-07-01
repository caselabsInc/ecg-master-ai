import type { TreatmentGuidance } from '../types';

export const pathologicalQWavesTreatment: TreatmentGuidance = {
  conditionId: 'pathological_q_waves',
  conditionName: 'Pathological Q waves',
  aliases: ['Prior myocardial infarction', 'Established Q-wave MI', 'Transmural necrosis'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'ECG evidence of prior transmural myocardial necrosis; acute concern rises if Q waves coexist with dynamic ST-T changes or symptoms.',
  immediateActions: ['Compare with prior ECGs and assess for active ischemic symptoms or dynamic ST-T changes.'],
  stableManagement: ['Optimize post-MI secondary prevention: aspirin, statin, ACE inhibitor/ARB, beta blocker when appropriate, and risk-factor control.'],
  unstableManagement: ['If chest pain, dyspnea, VT, new Q waves, or dynamic ST-T changes are present, manage as ACS and obtain urgent cardiology review.'],
  medications: [
    { name: 'Aspirin', role: 'Long-term secondary prevention after MI.', dose: '81 mg daily where protocol supports.', route: 'Oral', cautions: ['Active GI bleeding', 'True allergy'] },
    { name: 'ACE inhibitor/ARB', role: 'Prevent remodeling, especially anterior MI or reduced LVEF.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['Pregnancy', 'Hyperkalemia', 'Angioedema history'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Class IC antiarrhythmics', reason: 'Contraindicated in prior MI/structural heart disease due to proarrhythmia and sudden death risk.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Transthoracic echocardiogram to assess wall motion, EF, aneurysm, or mural thrombus.', 'ICD evaluation when EF remains severely reduced after guideline-directed therapy.'],
  monitoring: ['Outpatient CAD risk follow-up; telemetry/ACS monitoring if symptomatic or dynamic ECG changes.'],
  reversibleCauses: ['Prior completed coronary occlusion', 'Potential hibernating myocardium requiring viability assessment'],
  consultTriggers: ['New Q waves', 'Q waves with active ST elevation', 'Syncope/palpitations suggesting scar-mediated VT', 'Reduced EF'],
  disposition: ['Asymptomatic chronic Q waves: outpatient secondary prevention/cardiology follow-up.', 'Symptoms or dynamic changes: ACS pathway.'],
  redFlags: ['Persistent ST elevation after prior MI', 'Syncope', 'Palpitations', 'VT', 'New chest pain'],
  patientEducation: ['Q waves can show a prior heart attack scar, so protective medicines and heart-function assessment matter.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

