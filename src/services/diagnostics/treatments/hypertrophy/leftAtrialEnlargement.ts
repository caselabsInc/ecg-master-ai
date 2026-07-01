import type { TreatmentGuidance } from '../types';

export const leftAtrialEnlargementTreatment: TreatmentGuidance = {
  conditionId: 'left_atrial_enlargement',
  conditionName: 'Left atrial enlargement',
  aliases: ['LAE', 'Left atrial abnormality', 'P mitrale'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'ECG evidence suggesting chronic left atrial pressure or volume overload, commonly from hypertension, mitral valve disease, diastolic dysfunction, or cardiomyopathy.',
  immediateActions: ['Isolated stable LAE has no acute ECG-specific treatment; evaluate symptoms and the underlying structural cause.'],
  stableManagement: ['Obtain echocardiography to assess left atrial size, mitral valve disease, LV diastolic function, and pulmonary pressures.', 'Manage hypertension, valve disease, heart failure risk factors, and atrial fibrillation risk.'],
  unstableManagement: ['If pulmonary edema, rapid atrial fibrillation, syncope, or ischemic symptoms are present, treat the acute syndrome and obtain urgent cardiac evaluation.'],
  medications: [
    {
      name: 'Cause-directed therapy',
      role: 'Controls hypertension, heart failure, valve-related congestion, or atrial fibrillation risk factors.',
      dose: 'Verify local protocol.',
      route: 'Condition dependent',
      cautions: ['Anticoagulation decisions require confirmed AF/flutter and stroke-risk assessment, not LAE alone.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Ignoring atrial fibrillation risk', reason: 'LAE is associated with atrial arrhythmias and thromboembolic risk once AF/flutter occurs.', dangerLevel: 'caution' },
    { therapy: 'Routine exercise stress testing in symptomatic suspected severe mitral stenosis', reason: 'Severe obstructive valve disease needs structural assessment and specialist guidance first.', dangerLevel: 'avoid' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Ambulatory rhythm monitoring if palpitations or intermittent AF symptoms are reported.'],
  monitoring: ['Blood pressure control.', 'Symptoms of AF, exertional dyspnea, and pulmonary congestion.', 'Repeat echo if valve disease or heart failure progresses.'],
  reversibleCauses: ['Hypertension', 'Mitral stenosis or regurgitation', 'LV diastolic dysfunction', 'Cardiomyopathy', 'Atrial fibrillation/flutter'],
  consultTriggers: ['Moderate-to-severe mitral valve disease.', 'New AF/flutter.', 'Pulmonary hypertension or heart failure symptoms.'],
  disposition: ['Asymptomatic isolated LAE: outpatient echo and primary/cardiology follow-up.', 'LAE with pulmonary edema, rapid AF, syncope, or suspected severe valve disease: urgent evaluation.'],
  redFlags: ['New irregular rhythm', 'Pulmonary edema', 'Hemoptysis with mitral stenosis concern', 'Syncope', 'Severe exertional dyspnea'],
  patientEducation: ['The ECG suggests the upper left chamber may be enlarged. This usually points to pressure or valve problems that need confirmation with an ultrasound of the heart.'],
  missingEvidence: ['ECG atrial enlargement criteria can be false positive or false negative; echo is needed for confirmation.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
