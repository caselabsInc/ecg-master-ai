import type { TreatmentGuidance } from '../types';

export const torsadesDePointesTreatment: TreatmentGuidance = {
  conditionId: 'torsades_de_pointes',
  conditionName: 'Torsades de pointes',
  aliases: ['Torsades', 'Long-QT polymorphic VT'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'Polymorphic VT associated with prolonged QT, often triggered by electrolyte depletion, bradycardia, or QT-prolonging drugs.',
  immediateActions: ['Assess pulse immediately.', 'Defibrillate if pulseless or unstable.', 'Give magnesium and stop QT-prolonging drugs per local protocol.'],
  stableManagement: ['Correct potassium and magnesium, review medications, treat bradycardia triggers, and monitor QTc continuously.'],
  unstableManagement: ['Immediate defibrillation/cardioversion for unstable torsades; consider overdrive pacing or isoproterenol for recurrent pause-dependent torsades per expert/local protocol.'],
  medications: [
    {
      name: 'Magnesium sulfate',
      role: 'First-line treatment for torsades regardless of serum magnesium level.',
      dose: 'Verify local ACLS protocol.',
      route: 'IV',
      cautions: ['Renal impairment', 'Hypotension', 'Respiratory depression with excess dosing'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'QT-prolonging drugs', reason: 'Can perpetuate or worsen torsades.', dangerLevel: 'contraindicated' },
    { therapy: 'Amiodarone for long-QT torsades', reason: 'May further prolong QT.', dangerLevel: 'avoid' },
  ],
  procedures: ['Defibrillation if pulseless.', 'Cardioversion if unstable with pulse.', 'Temporary overdrive pacing for recurrent bradycardia/pause-dependent torsades when expert-supported.'],
  monitoring: ['Continuous ECG, QTc, potassium, magnesium, calcium, medication review.'],
  reversibleCauses: ['Hypokalemia', 'Hypomagnesemia', 'Hypocalcemia', 'QT-prolonging medications', 'Bradycardia', 'Congenital long QT'],
  consultTriggers: ['All torsades cases warrant urgent cardiology/critical care review.'],
  disposition: ['Emergency/ICU monitored setting until QT and triggers are controlled.'],
  redFlags: ['Syncope', 'Pulselessness', 'Recurrent torsades', 'Marked QT prolongation', 'Recent QT-prolonging medication'],
  patientEducation: ['This dangerous rhythm is related to delayed electrical recovery, so treatment focuses on shocks if needed, magnesium, and removing triggers.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

