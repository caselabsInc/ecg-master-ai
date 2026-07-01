import type { TreatmentGuidance } from '../types';

export const secondaryWideQrsDiscordanceTreatment: TreatmentGuidance = {
  conditionId: 'secondary_wide_qrs_discordance',
  conditionName: 'Secondary repolarization discordance in wide QRS',
  aliases: ['LBBB secondary ST-T changes', 'Paced rhythm discordance', 'Wide-QRS repolarization abnormality'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Expected ST-T deviation opposite the terminal QRS direction in LBBB or ventricular paced rhythm, making standard STEMI criteria unreliable.',
  immediateActions: ['Do not apply standard STEMI thresholds to LBBB or paced rhythms.', 'Use Sgarbossa or modified Sgarbossa criteria and serial ECG/troponins when ischemic symptoms are present.'],
  stableManagement: ['Document that ST-T changes are secondary to wide-QRS conduction when concordant or excessive discordance is absent.', 'Evaluate the reason for wide QRS if new or unexplained.'],
  unstableManagement: ['If concordant ST changes, excessive discordance, shock, or ischemic symptoms are present, manage as possible occlusion MI and involve cardiology emergently.'],
  medications: [
    { name: 'None for secondary discordance itself', role: 'Management is directed at the underlying conduction pattern and ischemia assessment.', dose: 'Not applicable.', route: 'Not applicable.' },
  ],
  avoidOrContraindications: [
    { therapy: 'Exercise or dobutamine stress testing in LBBB or ventricular paced rhythm', reason: 'Can produce unreliable ischemia assessment; vasodilator nuclear stress is generally preferred when stress testing is needed.', dangerLevel: 'avoid' },
    { therapy: 'Ignoring Sgarbossa-positive findings', reason: 'Concordant or excessively discordant ST deviation can indicate acute coronary occlusion.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Sgarbossa/modified Sgarbossa assessment.', 'Serial ECGs and troponins for symptoms.', 'Cardiology review or cath lab activation when occlusion criteria are met.'],
  monitoring: ['Telemetry when acute symptoms or new wide QRS are present.', 'Serial ECG comparison to baseline.'],
  reversibleCauses: ['LBBB', 'Ventricular paced rhythm', 'Hyperkalemia or metabolic conduction slowing', 'Drug toxicity', 'Acute ischemia'],
  consultTriggers: ['Chest pain with wide QRS', 'Sgarbossa-positive criteria', 'New LBBB with instability', 'Excessive discordance'],
  disposition: ['Asymptomatic known LBBB/paced discordance: outpatient follow-up as appropriate.', 'Symptoms or Sgarbossa concern: ED/cardiology evaluation.'],
  redFlags: ['Concordant ST elevation or depression', 'Excessively discordant ST elevation', 'New shock', 'Ongoing chest pain', 'New wide QRS'],
  patientEducation: ['A wide QRS changes how the ST segment looks, so clinicians use special criteria to avoid missing or overcalling a heart attack.'],
  missingEvidence: ['Interpretation depends heavily on prior ECG comparison and local MI pathways.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
