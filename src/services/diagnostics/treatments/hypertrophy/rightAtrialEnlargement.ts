import type { TreatmentGuidance } from '../types';

export const rightAtrialEnlargementTreatment: TreatmentGuidance = {
  conditionId: 'right_atrial_enlargement',
  conditionName: 'Right atrial enlargement',
  aliases: ['RAE', 'Right atrial abnormality', 'P pulmonale'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'ECG evidence suggesting chronic right atrial pressure or volume overload, often from pulmonary hypertension, chronic lung disease, tricuspid disease, congenital shunt, or right-heart failure.',
  immediateActions: ['Stable isolated RAE does not require acute ECG-specific therapy; evaluate for hypoxia, acute RV strain, and right-sided failure when symptoms are present.'],
  stableManagement: ['Obtain echocardiography to assess right atrial size, RV function, tricuspid valve disease, pulmonary pressures, and shunt clues.', 'Treat the underlying pulmonary, valvular, congenital, or right-heart-failure cause.'],
  unstableManagement: ['If hypoxemia, hypotension, syncope, acute dyspnea, or chest pain is present, evaluate urgently for pulmonary embolism, decompensated pulmonary hypertension, or acute right-heart failure.'],
  medications: [
    {
      name: 'Cause-directed therapy',
      role: 'Addresses COPD, pulmonary hypertension, tricuspid disease, right-heart failure, or thromboembolic disease as clinically confirmed.',
      dose: 'Verify local protocol.',
      route: 'Condition dependent',
      cautions: ['Avoid nonselective beta-blockers in reactive airway disease/COPD unless there is a strong indication and clinician oversight.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Nonselective beta-blockers in COPD-driven RAE', reason: 'May worsen bronchospasm in susceptible patients.', dangerLevel: 'avoid' },
    { therapy: 'Attributing acute right-heart symptoms to chronic RAE alone', reason: 'Acute pulmonary embolism or RV failure can be life-threatening.', dangerLevel: 'caution' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Pulmonary workup or PE evaluation when symptoms suggest acute pulmonary vascular disease.'],
  monitoring: ['Oxygen saturation.', 'JVP, edema, hepatomegaly, and right-heart-failure signs.', 'Rhythm surveillance if atrial arrhythmia symptoms occur.'],
  reversibleCauses: ['COPD/chronic hypoxia', 'Pulmonary hypertension', 'Pulmonary embolism', 'Tricuspid regurgitation or stenosis', 'Congenital shunt disease'],
  consultTriggers: ['Severe pulmonary hypertension or RV dysfunction on echo.', 'Suspected congenital heart disease.', 'New atrial arrhythmia or right-heart failure symptoms.'],
  disposition: ['Stable isolated RAE: outpatient echo and cause-directed follow-up.', 'RAE with hypoxia, syncope, hypotension, or acute dyspnea: urgent ED evaluation.'],
  redFlags: ['Syncope', 'Hypoxemia', 'Hypotension', 'Marked JVD', 'Acute pleuritic chest pain'],
  patientEducation: ['The ECG suggests enlargement of the upper right chamber. This often reflects pressure from lung or right-sided heart conditions, so the next step is confirming the cause.'],
  missingEvidence: ['ECG P-wave criteria can be rate-related or nonspecific; echocardiography is needed to confirm chamber enlargement.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
