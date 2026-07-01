import type { TreatmentGuidance } from '../types';

export const multifocalAtrialTachycardiaTreatment: TreatmentGuidance = {
  conditionId: 'multifocal_atrial_tachycardia',
  conditionName: 'Multifocal atrial tachycardia',
  aliases: ['MAT', 'Chaotic atrial tachycardia'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Irregular atrial tachycardia with at least three P-wave morphologies, commonly associated with severe pulmonary disease.',
  immediateActions: ['Assess oxygenation, ventilation, electrolytes, and drug/toxin contributors.'],
  stableManagement: ['Treat the underlying pulmonary or metabolic illness first.', 'Consider rate control only if symptoms persist after optimization.'],
  unstableManagement: ['Support oxygenation/ventilation and treat respiratory failure, hypoxia, or toxicity driving MAT.'],
  medications: [
    {
      name: 'Verapamil or diltiazem',
      role: 'Selected rate control when pulmonary optimization alone fails.',
      dose: 'Verify local protocol.',
      route: 'Oral or IV',
      cautions: ['Avoid in decompensated HFrEF, hypotension, or severe bradycardia.'],
      source: 'Harrisons Cardiovascular Medicine, Atrial Tachycardias, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Digoxin', reason: 'Ineffective in MAT and may worsen digoxin-toxic arrhythmias.', dangerLevel: 'contraindicated' },
    { therapy: 'Non-selective beta blockers in severe bronchospasm', reason: 'Can worsen COPD/asthma bronchospasm.', dangerLevel: 'contraindicated' },
  ],
  procedures: [],
  monitoring: ['Telemetry, oxygen saturation, blood gases when indicated, potassium/magnesium, and theophylline/digoxin review.'],
  reversibleCauses: ['Hypoxia/hypercapnia', 'COPD exacerbation', 'Hypokalemia', 'Hypomagnesemia', 'Theophylline toxicity', 'Pulmonary embolism'],
  consultTriggers: ['Severe respiratory distress', 'Suspected digitalis toxicity', 'Refractory rapid rate with instability'],
  disposition: ['Mild stable MAT with controlled pulmonary status: outpatient pulmonary optimization.', 'Hypoxia/toxicity/respiratory distress: inpatient telemetry and respiratory support.'],
  redFlags: ['Severe hypoxia', 'Respiratory acidosis', 'Theophylline toxicity', 'Digitalis toxicity clues'],
  patientEducation: ['This rhythm is usually driven by lung stress or low electrolytes; treating breathing and minerals often improves the heart rate.'],
  missingEvidence: ['No source-supported role for electrical cardioversion in stable chronic MAT was found.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

