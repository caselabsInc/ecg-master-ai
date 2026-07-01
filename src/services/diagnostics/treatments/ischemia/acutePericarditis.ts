import type { TreatmentGuidance } from '../types';

export const acutePericarditisTreatment: TreatmentGuidance = {
  conditionId: 'pericarditis',
  conditionName: 'Acute pericarditis',
  aliases: ['Acute fibrinous pericarditis', 'Pericardial inflammation', 'Myopericarditis'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Inflammation of the pericardium causing pleuritic positional chest pain, often with diffuse concave ST elevation and PR depression.',
  immediateActions: ['Obtain ECG and auscultate for pericardial friction rub.', 'Perform echocardiography to assess effusion and tamponade features.'],
  stableManagement: ['Treat uncomplicated acute pericarditis with high-dose NSAID/aspirin plus colchicine and gastric protection per protocol.'],
  unstableManagement: ['If tamponade is present, perform urgent ultrasound-guided pericardiocentesis.'],
  medications: [
    { name: 'Aspirin or NSAID', role: 'Anti-inflammatory pain and pericardial inflammation control.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['Peptic ulcer disease', 'Renal insufficiency', 'Aspirin-induced asthma'] },
    { name: 'Colchicine', role: 'Adjunct to reduce symptoms and recurrence.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['Severe renal impairment', 'Strong CYP3A4 inhibitors'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Routine early systemic corticosteroids', reason: 'Can increase recurrent/chronic pericarditis risk unless specific indication exists.', dangerLevel: 'avoid' },
    { therapy: 'Anticoagulation with significant effusion', reason: 'May cause hemorrhagic effusion and tamponade.', dangerLevel: 'avoid' },
    { therapy: 'Fibrinolytics when pericarditis mimics STEMI', reason: 'Can cause hemopericardium/tamponade.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Transthoracic echocardiography.', 'Emergency pericardiocentesis for tamponade or suspected purulent pericarditis.'],
  monitoring: ['Serial echocardiograms when effusion is present; symptom/CRP response where used clinically.'],
  reversibleCauses: ['Viral/idiopathic', 'Post-MI pericarditis/Dressler syndrome', 'Uremia', 'Autoimmune disease', 'Purulent infection'],
  consultTriggers: ['Large effusion', 'Tamponade signs', 'Fever/leukocytosis', 'Anticoagulation use', 'Suspected myopericarditis or purulent pericarditis'],
  disposition: ['Low-risk idiopathic pericarditis without effusion: outpatient therapy/follow-up.', 'Large effusion, fever, anticoagulation, or tamponade concern: admit.'],
  redFlags: ['Pulsus paradoxus', 'Beck triad', 'Muffled heart sounds/JVD/hypotension', 'Large effusion', 'Trapezius-radiating pain'],
  patientEducation: ['This is inflammation around the heart; anti-inflammatory therapy and colchicine usually help, but fluid around the heart must be watched.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

