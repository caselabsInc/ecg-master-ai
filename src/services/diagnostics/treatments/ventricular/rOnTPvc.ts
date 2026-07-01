import type { TreatmentGuidance } from '../types';

export const rOnTPvcTreatment: TreatmentGuidance = {
  conditionId: 'r_on_t_pvc',
  conditionName: 'R-on-T PVC',
  aliases: ['R on T phenomenon', 'PVC on T wave'],
  clinicalPriority: 'emergency',
  briefClinicalMeaning: 'A PVC falling on the vulnerable repolarization phase, increasing risk of polymorphic VT or ventricular fibrillation.',
  immediateActions: ['Place on continuous monitoring and correct reversible proarrhythmic factors immediately.'],
  stableManagement: ['Correct potassium and magnesium, review QT-prolonging drugs, assess ischemia, and quantify ectopy.'],
  unstableManagement: ['If degeneration to VT/VF occurs, follow ACLS defibrillation/cardioversion pathway.'],
  medications: [
    {
      name: 'Magnesium sulfate',
      role: 'Used when long QT/torsades risk is suspected.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['Monitor blood pressure and renal function.'],
    },
  ],
  avoidOrContraindications: [
    { therapy: 'Ignoring QT-prolonging drugs/electrolyte depletion', reason: 'R-on-T events can trigger malignant ventricular arrhythmias.', dangerLevel: 'avoid' },
  ],
  procedures: ['Defibrillation if pulseless VT/VF develops.'],
  monitoring: ['Continuous telemetry and QTc/electrolyte monitoring.'],
  reversibleCauses: ['Long QT', 'Hypokalemia', 'Hypomagnesemia', 'Ischemia', 'QT-prolonging medications', 'Bradycardia-dependent repolarization delay'],
  consultTriggers: ['Syncope', 'Long QT', 'Recurrent R-on-T PVCs', 'Structural heart disease', 'Degeneration into VT/VF'],
  disposition: ['Telemetry/inpatient evaluation when recurrent or associated with QT prolongation, symptoms, ischemia, or structural disease.'],
  redFlags: ['Syncope', 'QT prolongation', 'Runs of polymorphic VT', 'Chest pain', 'Electrolyte depletion'],
  patientEducation: ['This extra beat occurs during a vulnerable part of recovery, so clinicians watch closely and correct triggers.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

