import type { TreatmentGuidance } from '../types';

export const wanderingAtrialPacemakerTreatment: TreatmentGuidance = {
  conditionId: 'wandering_atrial_pacemaker',
  conditionName: 'Wandering atrial pacemaker',
  aliases: ['WAP', 'Wandering pacemaker', 'Multiform atrial rhythm'],
  clinicalPriority: 'normal_variant',
  briefClinicalMeaning: 'Benign atrial rhythm under 100 bpm where the pacemaker shifts between atrial sites, changing P-wave shape.',
  immediateActions: [],
  stableManagement: ['Reassure if isolated and asymptomatic; no treatment is required.'],
  unstableManagement: [],
  medications: [],
  avoidOrContraindications: [
    { therapy: 'Rate control, antiarrhythmics, or anticoagulation for isolated WAP', reason: 'WAP is benign and can be confused with MAT or AF.', dangerLevel: 'avoid' },
  ],
  procedures: [],
  monitoring: ['No active telemetry or serial ECGs are needed for isolated asymptomatic WAP.'],
  reversibleCauses: ['High vagal tone', 'Sleep', 'Athletic conditioning'],
  consultTriggers: [],
  disposition: ['Asymptomatic young/athletic patient: reassurance and routine care.'],
  redFlags: [],
  patientEducation: ['The heartbeat source shifts slightly between normal atrial sites; this is usually harmless.'],
  missingEvidence: ['No diagnostic testing guidance was found for symptomatic older adults with WAP.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

