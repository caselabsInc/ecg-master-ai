import type { TreatmentGuidance } from '../types';

export const atrialFlutterTreatment: TreatmentGuidance = {
  conditionId: 'atrial_flutter',
  conditionName: 'Atrial flutter',
  aliases: ['AFlut', 'A-flutter'],
  clinicalPriority: 'urgent',
  briefClinicalMeaning: 'Organized atrial macro-reentry, often near 300 bpm, frequently conducting 2:1 with ventricular rate around 150 bpm.',
  immediateActions: ['Use synchronized cardioversion for unstable rapid flutter with shock, ischemia, pulmonary edema, or severe symptoms.'],
  stableManagement: ['Control ventricular rate with beta blocker or non-dihydropyridine calcium channel blocker when appropriate.', 'Assess anticoagulation need similarly to AF.', 'Consider ablation for typical recurrent flutter.'],
  unstableManagement: ['Immediate synchronized cardioversion if unstable or severe rate-related ischemia is present.'],
  medications: [
    {
      name: 'Ibutilide',
      role: 'Pharmacologic conversion of selected stable recent-onset atrial flutter.',
      dose: 'Verify local protocol.',
      route: 'IV',
      cautions: ['QT prolongation and torsades risk; requires ECG and electrolyte monitoring.'],
      source: 'Harrisons Cardiovascular Medicine, Commonly Used Antiarrhythmic Agents, 2013',
    },
  ],
  avoidOrContraindications: [
    { therapy: 'AV nodal blockers in pre-excited flutter', reason: 'Can shunt conduction down an accessory pathway and trigger ventricular fibrillation.', dangerLevel: 'contraindicated' },
    { therapy: 'Assuming regular rate 150 bpm is sinus tachycardia', reason: 'Typical 2:1 flutter is commonly missed and may need anticoagulation and rhythm management.', dangerLevel: 'caution' },
  ],
  procedures: ['Synchronized cardioversion if unstable.', 'Cavotricuspid isthmus ablation for recurrent typical flutter.'],
  monitoring: ['Telemetry during acute flutter and after pharmacologic conversion; check QT and electrolytes if using QT-prolonging drugs.'],
  reversibleCauses: ['Organic heart disease', 'Pulmonary disease', 'Hypoxia/PE', 'Hyperthyroidism', 'Postoperative cardiac surgery'],
  consultTriggers: ['New-onset flutter', '1:1 flutter', 'Refractory typical flutter', 'Pre-excitation concern'],
  disposition: ['Stable rate-controlled chronic flutter: outpatient cardiology/ablation evaluation.', 'Unstable or rapid 1:1/2:1 flutter: inpatient telemetry.'],
  redFlags: ['Ventricular rate around 150 bpm', 'Chest pain/ST depression', 'Rapid wide-complex flutter', 'Syncope'],
  patientEducation: ['A rapid electrical loop in the upper chamber is driving the rhythm; ablation can often cure typical flutter.'],
  missingEvidence: ['No distinct management difference was found for clockwise versus counterclockwise typical flutter.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

