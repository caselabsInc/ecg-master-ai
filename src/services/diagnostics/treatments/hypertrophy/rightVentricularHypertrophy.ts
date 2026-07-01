import type { TreatmentGuidance } from '../types';

export const rightVentricularHypertrophyTreatment: TreatmentGuidance = {
  conditionId: 'right_ventricular_hypertrophy',
  conditionName: 'Right ventricular hypertrophy',
  aliases: ['RVH', 'RV hypertrophy', 'RV strain pattern'],
  clinicalPriority: 'routine',
  briefClinicalMeaning: 'Increased right ventricular muscle mass, most often reflecting chronic right-sided pressure overload from pulmonary hypertension, lung disease, pulmonic stenosis, mitral stenosis, or congenital shunt disease.',
  immediateActions: ['Stable chronic RVH has no direct ECG-specific emergency treatment; assess for hypoxia, pulmonary embolism, right-heart failure, or pulmonary hypertension when clinically suspected.'],
  stableManagement: ['Obtain echocardiography to assess RV size/function, pulmonary pressures, valves, and congenital shunt clues.', 'Treat the underlying pulmonary, valvular, thromboembolic, or congenital cause.'],
  unstableManagement: ['If acute dyspnea, hypoxemia, syncope, hypotension, or pleuritic chest pain is present, evaluate urgently for pulmonary embolism, severe pulmonary hypertension, or acute RV failure.'],
  medications: [
    {
      name: 'Cause-directed therapy',
      role: 'Treats the driver of RV pressure or volume overload, such as COPD, pulmonary embolism, or pulmonary hypertension.',
      dose: 'Verify local protocol.',
      route: 'Condition dependent',
      cautions: ['Pulmonary vasodilators require specialist-directed diagnosis and follow-up.', 'Avoid treating the ECG pattern without confirming the underlying syndrome.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Targeted pulmonary arterial hypertension therapy without formal workup', reason: 'Pulmonary vasodilators can harm patients with left-heart or thromboembolic pulmonary hypertension if used without correct classification.', dangerLevel: 'avoid' },
    { therapy: 'Missing acute RV strain', reason: 'RVH/RV strain with acute symptoms can represent pulmonary embolism or decompensated pulmonary hypertension.', dangerLevel: 'caution' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Pulmonary embolism testing when acute RV strain symptoms are present.', 'Right-heart catheterization when pulmonary hypertension requires confirmation/classification.'],
  monitoring: ['Oxygen saturation and respiratory status.', 'Signs of right-heart failure, edema, hepatomegaly, and JVP.', 'Serial ECG/echo when symptoms worsen.'],
  reversibleCauses: ['COPD or chronic hypoxic lung disease', 'Pulmonary embolism', 'Pulmonary hypertension', 'Pulmonic stenosis', 'Mitral stenosis', 'Congenital left-to-right shunt'],
  consultTriggers: ['Syncope or hypotension with suspected pulmonary hypertension.', 'Echo evidence of severe RV dysfunction.', 'Suspected congenital shunt, severe valve disease, or acute pulmonary embolism.'],
  disposition: ['Stable chronic RVH: outpatient echo and cause-directed follow-up.', 'RVH with hypoxia, syncope, hypotension, or acute dyspnea: urgent ED evaluation.'],
  redFlags: ['Syncope', 'Hypotension', 'Severe hypoxemia', 'Acute pleuritic chest pain', 'Signs of right-heart failure'],
  patientEducation: ['The ECG suggests strain or thickening on the right side of the heart. The important next step is finding what is increasing pressure on that side, often lung or pulmonary-vessel disease.'],
  missingEvidence: ['ECG RVH criteria have limited sensitivity; echocardiography is needed for structural confirmation.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
