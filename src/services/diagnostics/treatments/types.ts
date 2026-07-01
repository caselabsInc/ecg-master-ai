export type ClinicalPriority = 'normal_variant' | 'routine' | 'urgent' | 'emergency' | 'unstable_emergency';

export type TreatmentMedication = {
  name: string;
  role: string;
  dose?: string;
  route?: string;
  cautions?: string[];
  source?: string;
};

export type TreatmentSafetyBlock = {
  therapy: string;
  reason: string;
  dangerLevel: 'caution' | 'avoid' | 'contraindicated';
};

export type TreatmentGuidance = {
  conditionId: string;
  conditionName: string;
  aliases: string[];
  clinicalPriority: ClinicalPriority;
  briefClinicalMeaning: string;
  immediateActions: string[];
  stableManagement: string[];
  unstableManagement: string[];
  medications: TreatmentMedication[];
  avoidOrContraindications: TreatmentSafetyBlock[];
  procedures: string[];
  monitoring: string[];
  reversibleCauses: string[];
  consultTriggers: string[];
  disposition: string[];
  redFlags: string[];
  patientEducation: string[];
  missingEvidence?: string[];
  disclaimer: string;
};

