import type { TreatmentGuidance } from '../types';

export const stemiTerritoryPatternTreatment: TreatmentGuidance = {
  conditionId: 'stemi_territory_pattern',
  conditionName: 'STEMI by territory',
  aliases: ['STEMI', 'Acute transmural MI', 'Culprit artery occlusion'],
  clinicalPriority: 'unstable_emergency',
  briefClinicalMeaning: 'Acute transmural myocardial injury from coronary occlusion with ST elevation in an anatomic territory.',
  immediateActions: ['Give chewed aspirin if no true contraindication.', 'Activate STEMI/cath lab pathway for primary PCI.', 'Start continuous ECG monitoring and obtain IV access.'],
  stableManagement: ['After reperfusion, use guideline-directed secondary prevention: antiplatelet therapy, statin, beta blocker, ACE inhibitor/ARB when appropriate.'],
  unstableManagement: ['If cardiogenic shock develops, support perfusion and proceed to emergency angiography/revascularization with critical care support.'],
  medications: [
    { name: 'Aspirin', role: 'Immediate antiplatelet therapy.', dose: '162-325 mg chewed where protocol supports.', route: 'Oral', cautions: ['Active severe bleeding', 'True aspirin allergy'], source: 'Medstudy ACS STEMI management, 2018' },
    { name: 'Unfractionated heparin', role: 'Anticoagulation during PCI pathway.', dose: 'Verify local protocol.', route: 'IV', cautions: ['Active bleeding', 'HIT history', 'Recent hemorrhagic stroke'] },
    { name: 'P2Y12 inhibitor', role: 'Dual antiplatelet therapy with aspirin.', dose: 'Verify local protocol.', route: 'Oral', cautions: ['Active bleeding', 'Intracranial hemorrhage history'] },
  ],
  avoidOrContraindications: [
    { therapy: 'NSAIDs other than aspirin in acute MI', reason: 'Associated with reinfarction, rupture, and mortality risk.', dangerLevel: 'contraindicated' },
    { therapy: 'Nitrates with recent PDE-5 inhibitor use', reason: 'Can cause profound refractory hypotension.', dangerLevel: 'contraindicated' },
    { therapy: 'Fibrinolytics with absolute contraindications', reason: 'High risk of fatal intracranial or internal hemorrhage.', dangerLevel: 'contraindicated' },
  ],
  procedures: ['Primary PCI immediately when available.', 'Fibrinolysis only when PCI delay is excessive and no contraindication exists.'],
  monitoring: ['Continuous telemetry, serial ECGs, troponins, access-site bleeding checks, reperfusion arrhythmia monitoring.'],
  reversibleCauses: ['Coronary thrombosis', 'Coronary spasm', 'SCAD', 'Cocaine-induced vasoconstriction', 'Aortic dissection involving coronaries'],
  consultTriggers: ['Any acute STEMI pattern: immediate interventional cardiology activation.', 'Mechanical complication concern: cardiothoracic surgery.'],
  disposition: ['Acute STEMI: cath lab/PCI-capable emergency pathway.', 'Post-PCI: CCU/telemetry admission.'],
  redFlags: ['Persistent chest pressure', 'New holosystolic murmur', 'Pulmonary edema', 'Cold extremities', 'VT/VF'],
  patientEducation: ['This pattern suggests an acutely blocked heart artery; rapid opening of the vessel is critical to save heart muscle.'],
  disclaimer: 'Clinician education/decision support only. Follow local protocols and clinical judgment.',
};

