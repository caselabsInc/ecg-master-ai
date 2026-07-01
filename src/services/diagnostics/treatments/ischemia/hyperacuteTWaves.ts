import type { TreatmentGuidance } from '../types';

export const hyperacuteTWavesTreatment: TreatmentGuidance = {
  conditionId: 'hyperacute_t_waves',
  conditionName: 'Hyperacute T waves',
  aliases: ['Early ischemic T waves', 'Acute coronary occlusion T waves'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Tall, broad, symmetric T waves in contiguous leads that may be the earliest ECG sign of acute coronary occlusion.',
  immediateActions: ['Obtain serial ECGs every 5-10 minutes when active ischemic symptoms are present.', 'Start ACS protocol and continuous monitoring.', 'Prepare reperfusion activation if evolution or high clinical suspicion supports OMI.'],
  stableManagement: ['After definitive evaluation/reperfusion, apply secondary prevention and address the culprit cause.'],
  unstableManagement: ['If ST elevation evolves, refractory pain persists, or instability develops, activate cath lab immediately.'],
  medications: [{ name: 'Aspirin', role: 'Immediate antiplatelet therapy for suspected acute ischemia.', dose: '325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active severe bleeding'] }],
  avoidOrContraindications: [
    { therapy: 'Mislabeling hyperacute T waves as benign or hyperkalemia without correlation', reason: 'Can delay treatment of early coronary occlusion.', dangerLevel: 'avoid' },
  ],
  procedures: ['Serial 12-lead ECGs.', 'Emergency angiography/PCI when OMI criteria or clinical instability emerges.'],
  monitoring: ['Telemetry, serial ECG/troponins, potassium assessment to distinguish hyperkalemia.'],
  reversibleCauses: ['Acute coronary occlusion', 'Coronary spasm', 'Hyperkalemia mimic'],
  consultTriggers: ['Hyperacute T waves with active ischemic symptoms: urgent cardiology review.'],
  disposition: ['Symptomatic hyperacute T-wave concern: emergency monitored ACS evaluation.'],
  redFlags: ['Progression to ST elevation', 'Refractory chest pain', 'Hypotension', 'VT/VF', 'Regional contiguous pattern'],
  patientEducation: ['These T waves can be an early warning before a classic heart attack pattern appears, so repeat ECGs and urgent monitoring are needed.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

