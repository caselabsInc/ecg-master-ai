import type { TreatmentGuidance } from '../types';

export const electricalAlternansTreatment: TreatmentGuidance = {
  conditionId: 'electrical_alternans',
  conditionName: 'Electrical alternans',
  aliases: ['QRS alternans', 'Total alternans', 'Swinging heart pattern'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Beat-to-beat alternation in QRS amplitude, axis, or morphology, classically associated with a large pericardial effusion and possible cardiac tamponade.',
  immediateActions: ['Perform immediate bedside ultrasound or emergency echocardiography to assess for large pericardial effusion and tamponade physiology.', 'Place the patient on continuous monitoring and prepare emergency pericardiocentesis if unstable.'],
  stableManagement: ['True electrical alternans should be treated as high-risk until large pericardial effusion/tamponade is excluded; stable patients still need urgent evaluation.'],
  unstableManagement: ['For hypotension, shock, syncope, severe dyspnea, or PEA arrest with tamponade physiology, perform immediate ultrasound-guided pericardiocentesis and support preload while definitive drainage is arranged.'],
  medications: [
    {
      name: 'IV crystalloid fluid',
      role: 'Temporary preload support as a bridge to drainage in suspected tamponade with hypotension.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Bridge therapy only; definitive treatment is pericardial drainage when tamponade is present.', 'Use caution in severe left-sided heart failure.'],
      source: 'Harrisons Principles of Internal Medicine, Cardiomyopathy and Myocarditis, 2012',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Diuretics and vasodilators in tamponade', reason: 'Reducing preload can precipitate obstructive shock collapse.', dangerLevel: 'contraindicated' },
    { therapy: 'Nonessential positive-pressure ventilation before drainage', reason: 'Positive pressure can reduce venous return and worsen tamponade physiology.', dangerLevel: 'avoid' },
  ],
  procedures: ['Immediate echocardiography/POCUS.', 'Emergent ultrasound-guided pericardiocentesis for tamponade with hemodynamic compromise.', 'Pericardial drain/surgical window when clinically indicated.'],
  monitoring: ['Continuous ECG, blood pressure, oxygen saturation, and clinical perfusion.', 'Assess pulsus paradoxus, JVP, and serial echo findings.'],
  reversibleCauses: ['Pericarditis', 'Uremia', 'Malignancy', 'Aortic dissection or myocardial rupture causing hemopericardium', 'Trauma', 'Autoimmune disease'],
  consultTriggers: ['Any suspected electrical alternans.', 'Echo-confirmed large effusion or right-sided chamber collapse.', 'Hypotension, narrow pulse pressure, or PEA arrest.'],
  disposition: ['All suspected electrical alternans: urgent ED/cardiology evaluation.', 'Electrical alternans with tamponade physiology: ICU/emergent procedural management.'],
  redFlags: ['Hypotension', 'Pulsus paradoxus', 'Beck triad', 'Severe tachycardia', 'PEA arrest', 'Syncope'],
  patientEducation: ['This pattern can mean there is a large amount of fluid around the heart. The priority is immediate ultrasound assessment and, if pressure is building, urgent drainage.'],
  missingEvidence: ['Electrical alternans is specific but not sensitive; tamponade can occur without alternans.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
