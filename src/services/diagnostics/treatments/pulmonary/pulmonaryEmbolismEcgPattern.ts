import type { TreatmentGuidance } from '../types';

export const pulmonaryEmbolismEcgPatternTreatment: TreatmentGuidance = {
  conditionId: 'pulmonary_embolism_ecg_pattern',
  conditionName: 'Pulmonary embolism ECG strain pattern',
  aliases: ['S1Q3T3 pattern', 'Acute cor pulmonale pattern', 'Right ventricular strain pattern'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'ECG pattern suggesting acute right-heart pressure overload from pulmonary embolism, commonly sinus tachycardia with RV strain, RAD, RBBB, or S1Q3T3 pattern.',
  immediateActions: ['Assess hemodynamic stability, oxygenation, and PE symptoms immediately.', 'Give oxygen as needed, establish IV access, monitor continuously, and obtain CTPA or V/Q testing when PE is suspected.'],
  stableManagement: ['Start therapeutic anticoagulation for confirmed or high-probability PE when bleeding risk permits and local protocol supports it.', 'Risk-stratify with RV imaging/biomarkers when ECG right-heart strain is present.'],
  unstableManagement: ['Massive PE with shock or sustained hypotension requires urgent reperfusion strategy such as systemic thrombolysis, catheter-directed therapy, or surgical embolectomy per protocol.'],
  medications: [
    { name: 'Heparin or LMWH', role: 'Therapeutic anticoagulation to prevent clot propagation in stable PE.', dose: 'Verify local protocol.', route: 'IV or subcutaneous', cautions: ['Active bleeding', 'Severe renal impairment for LMWH', 'HIT history'] },
    { name: 'Thrombolytic therapy', role: 'Reperfusion for massive PE with hemodynamic instability when benefits outweigh bleeding risk.', dose: 'Verify local protocol.', route: 'IV', cautions: ['Intracranial hemorrhage risk', 'Recent surgery/trauma', 'Active bleeding'] },
  ],
  avoidOrContraindications: [
    { therapy: 'Low-risk discharge for confirmed PE with ECG RV strain', reason: 'Right-heart strain can indicate submassive PE with risk of sudden deterioration.', dangerLevel: 'avoid' },
    { therapy: 'Beta-blockers for compensatory sinus tachycardia in unstable PE', reason: 'Tachycardia may be maintaining cardiac output during obstructive shock.', dangerLevel: 'avoid' },
    { therapy: 'Aggressive diuresis in preload-dependent RV failure', reason: 'May collapse RV preload and worsen shock.', dangerLevel: 'caution' },
  ],
  procedures: ['CT pulmonary angiography or V/Q scan.', 'Echocardiography for RV strain/hemodynamic risk.', 'Catheter-directed therapy, surgical embolectomy, or IVC filter when indicated.'],
  monitoring: ['Continuous ECG and pulse oximetry.', 'Blood pressure and shock markers.', 'Troponin/BNP and echocardiographic RV function where used for risk stratification.'],
  reversibleCauses: ['DVT', 'Recent surgery or immobilization', 'Malignancy', 'Pregnancy/postpartum state', 'Estrogen therapy', 'Inherited thrombophilia'],
  consultTriggers: ['Hypotension or syncope', 'Confirmed PE with RV strain', 'Elevated biomarkers', 'Contraindication to anticoagulation', 'Massive/submassive PE pathway activation'],
  disposition: ['Low-risk PE without RV strain: disposition per validated local criteria.', 'PE with ECG RV strain, elevated biomarkers, hypoxia, syncope, or hypotension: admit with telemetry/ICU as appropriate.'],
  redFlags: ['SBP < 90 mmHg', 'Hypoxia', 'Syncope', 'New RBBB', 'Severe RV strain', 'Shock'],
  patientEducation: ['This ECG pattern can suggest strain from a clot in the lungs. Confirmation imaging and blood-thinning or reperfusion treatment may be needed urgently.'],
  missingEvidence: ['ECG strain findings are not sensitive for PE and cannot confirm or exclude PE without clinical/imaging correlation.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};
