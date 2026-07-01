import type { TreatmentGuidance } from '../types';

export const avrtTreatment: TreatmentGuidance = {
  conditionId: 'avrt',
  conditionName: 'Atrioventricular reentrant tachycardia',
  aliases: ['AVRT', 'WPW tachycardia', 'Accessory pathway SVT'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Regular SVT using an accessory pathway as one limb of a reentrant circuit; can be orthodromic narrow-complex or antidromic wide-complex.',
  immediateActions: ['If unstable or extremely rapid, perform synchronized cardioversion.', 'Differentiate orthodromic regular SVT from pre-excited AF/wide irregular tachycardia.'],
  stableManagement: ['Vagal maneuvers or adenosine may be used for stable orthodromic AVRT.', 'Use accessory-pathway-safe therapy for antidromic or pre-excited rhythms per local protocol.'],
  unstableManagement: ['Immediate synchronized cardioversion for shock, hypotension, severe dyspnea, chest pain, or very rapid rates.'],
  medications: [
    {
      name: 'Procainamide',
      role: 'Stable pre-excited SVT/antidromic AVRT where protocol supports use.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Hypotension, QT prolongation, QRS widening; monitor closely.'],
      source: 'Medstudy IM Core Curriculum, WPW Arrhythmias, 2016',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers in antidromic AVRT or pre-excited AF', reason: 'Can force rapid accessory pathway conduction and precipitate ventricular fibrillation.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Radiofrequency ablation of the accessory pathway for symptomatic WPW syndrome.'],
  monitoring: ['Telemetry and defibrillator readiness during acute episodes; monitor for transition to AF/VF.'],
  reversibleCauses: ['Electrolyte abnormalities', 'Ebstein anomaly association', 'Accessory pathway substrate'],
  consultTriggers: ['Documented WPW with palpitations', 'Antidromic/wide-complex tachycardia', 'Emergency termination required'],
  disposition: ['Stable converted orthodromic AVRT with delta waves: urgent outpatient EP referral.', 'Antidromic/pre-excited AF/unstable: inpatient monitored care.'],
  redFlags: ['Rate >280 bpm', 'Wide irregular tachycardia', 'Syncope', 'Chest pain', 'Hypotension'],
  patientEducation: ['An extra electrical pathway can cause fast rhythms; ablation can permanently disconnect it when indicated.'],
  missingEvidence: ['No source-supported statement was found for adenosine safety in WPW with active bronchospasm.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

