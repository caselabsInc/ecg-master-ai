import { asystoleTreatment } from './ventricular/asystole';
import { acutePericarditisTreatment } from './ischemia/acutePericarditis';
import { bifascicularBlockTreatment } from './conduction/bifascicularBlock';
import { atrialFibrillationTreatment } from './rhythm/atrialFibrillation';
import { atrialFlutterTreatment } from './rhythm/atrialFlutter';
import { atrialTachycardiaTreatment } from './rhythm/atrialTachycardia';
import { avnrtTreatment } from './rhythm/avnrt';
import { avrtTreatment } from './rhythm/avrt';
import { benignEarlyRepolarizationTreatment } from './repolarization/benignEarlyRepolarization';
import { biatrialEnlargementTreatment } from './hypertrophy/biatrialEnlargement';
import { blockedPrematureAtrialComplexesTreatment } from './rhythm/blockedPrematureAtrialComplexes';
import { brugadaPatternTreatment } from './repolarization/brugadaPattern';
import { cnsTWavesTreatment } from './repolarization/cnsTWaves';
import { digoxinEffectTreatment } from './repolarization/digoxinEffect';
import { electricalAlternansTreatment } from './hypertrophy/electricalAlternans';
import { firstDegreeAvBlockTreatment } from './conduction/firstDegreeAvBlock';
import { highGradeAvBlockTreatment } from './conduction/highGradeAvBlock';
import { deWinterPatternTreatment } from './ischemia/deWinterPattern';
import { hyperkalemiaTreatment } from './repolarization/hyperkalemia';
import { hyperacuteTWavesTreatment } from './ischemia/hyperacuteTWaves';
import { hypokalemiaTreatment } from './repolarization/hypokalemia';
import { hypothermiaTreatment } from './repolarization/hypothermia';
import { incompleteRightBundleBranchBlockTreatment } from './conduction/incompleteRightBundleBranchBlock';
import { junctionalRhythmTreatment } from './rhythm/junctionalRhythm';
import { junctionalTachycardiaTreatment } from './rhythm/junctionalTachycardia';
import { leftAtrialEnlargementTreatment } from './hypertrophy/leftAtrialEnlargement';
import { leftAnteriorFascicularBlockTreatment } from './conduction/leftAnteriorFascicularBlock';
import { leftBundleBranchBlockTreatment } from './conduction/leftBundleBranchBlock';
import { leftMainMultivesselIschemiaTreatment } from './ischemia/leftMainMultivesselIschemia';
import { leftPosteriorFascicularBlockTreatment } from './conduction/leftPosteriorFascicularBlock';
import { leftVentricularHypertrophyTreatment } from './hypertrophy/leftVentricularHypertrophy';
import { lvhStrainPatternTreatment } from './repolarization/lvhStrainPattern';
import { lowVoltageTreatment } from './hypertrophy/lowVoltage';
import { multifocalAtrialTachycardiaTreatment } from './rhythm/multifocalAtrialTachycardia';
import { monomorphicVentricularTachycardiaTreatment } from './ventricular/monomorphicVentricularTachycardia';
import { nonspecificIvcdTreatment } from './conduction/nonspecificIvcd';
import { normalSinusRhythmTreatment } from './rhythm/normalSinusRhythm';
import { patternedVentricularEctopyTreatment } from './ventricular/patternedVentricularEctopy';
import { pathologicalQWavesTreatment } from './ischemia/pathologicalQWaves';
import { polymorphicVentricularTachycardiaTreatment } from './ventricular/polymorphicVentricularTachycardia';
import { posteriorOmiTreatment } from './ischemia/posteriorOmi';
import { preExcitedAtrialFibrillationTreatment } from './conduction/preExcitedAtrialFibrillation';
import { prematureAtrialComplexesTreatment } from './rhythm/prematureAtrialComplexes';
import { prematureJunctionalComplexesTreatment } from './rhythm/prematureJunctionalComplexes';
import { prematureVentricularComplexesTreatment } from './ventricular/prematureVentricularComplexes';
import { pulmonaryEmbolismEcgPatternTreatment } from './pulmonary/pulmonaryEmbolismEcgPattern';
import { pulselessElectricalActivityTreatment } from './ventricular/pulselessElectricalActivity';
import { pvcCoupletsTripletsTreatment } from './ventricular/pvcCoupletsTriplets';
import { rOnTPvcTreatment } from './ventricular/rOnTPvc';
import { rightAtrialEnlargementTreatment } from './hypertrophy/rightAtrialEnlargement';
import { rightBundleBranchBlockTreatment } from './conduction/rightBundleBranchBlock';
import { rightVentricularMiTreatment } from './ischemia/rightVentricularMi';
import { rightVentricularHypertrophyTreatment } from './hypertrophy/rightVentricularHypertrophy';
import { secondDegreeMobitzIITreatment } from './conduction/secondDegreeMobitzII';
import { secondDegreeMobitzITreatment } from './conduction/secondDegreeMobitzI';
import { secondaryWideQrsDiscordanceTreatment } from './repolarization/secondaryWideQrsDiscordance';
import { sgarbossaPositiveIschemiaTreatment } from './ischemia/sgarbossaPositiveIschemia';
import { sinusArrhythmiaTreatment } from './rhythm/sinusArrhythmia';
import { sinusBradycardiaTreatment } from './rhythm/sinusBradycardia';
import { sinusTachycardiaTreatment } from './rhythm/sinusTachycardia';
import { thirdDegreeAvBlockTreatment } from './conduction/thirdDegreeAvBlock';
import { torsadesDePointesTreatment } from './ventricular/torsadesDePointes';
import { trifascicularPatternTreatment } from './conduction/trifascicularPattern';
import type { TreatmentGuidance } from './types';
import { svtWithAberrancyTreatment } from './ventricular/svtWithAberrancy';
import { stemiMimicsTreatment } from './ischemia/stemiMimics';
import { stemiTerritoryPatternTreatment } from './ischemia/stemiTerritoryPattern';
import { subendocardialIschemiaTreatment } from './ischemia/subendocardialIschemia';
import { ventricularEctopyRunsTreatment } from './ventricular/ventricularEctopyRuns';
import { ventricularFibrillationTreatment } from './ventricular/ventricularFibrillation';
import { wanderingAtrialPacemakerTreatment } from './rhythm/wanderingAtrialPacemaker';
import { wellensSyndromeTreatment } from './ischemia/wellensSyndrome';
import { wideComplexTachycardiaTreatment } from './ventricular/wideComplexTachycardia';
import { wolffParkinsonWhiteTreatment } from './conduction/wolffParkinsonWhite';

export type { TreatmentGuidance, TreatmentMedication, TreatmentSafetyBlock } from './types';

export const treatmentGuidanceByConditionId: Record<string, TreatmentGuidance> = {
  [firstDegreeAvBlockTreatment.conditionId]: firstDegreeAvBlockTreatment,
  [secondDegreeMobitzITreatment.conditionId]: secondDegreeMobitzITreatment,
  [secondDegreeMobitzIITreatment.conditionId]: secondDegreeMobitzIITreatment,
  [highGradeAvBlockTreatment.conditionId]: highGradeAvBlockTreatment,
  [thirdDegreeAvBlockTreatment.conditionId]: thirdDegreeAvBlockTreatment,
  [rightBundleBranchBlockTreatment.conditionId]: rightBundleBranchBlockTreatment,
  [incompleteRightBundleBranchBlockTreatment.conditionId]: incompleteRightBundleBranchBlockTreatment,
  [leftBundleBranchBlockTreatment.conditionId]: leftBundleBranchBlockTreatment,
  [nonspecificIvcdTreatment.conditionId]: nonspecificIvcdTreatment,
  [leftAnteriorFascicularBlockTreatment.conditionId]: leftAnteriorFascicularBlockTreatment,
  [leftPosteriorFascicularBlockTreatment.conditionId]: leftPosteriorFascicularBlockTreatment,
  [bifascicularBlockTreatment.conditionId]: bifascicularBlockTreatment,
  [trifascicularPatternTreatment.conditionId]: trifascicularPatternTreatment,
  [wolffParkinsonWhiteTreatment.conditionId]: wolffParkinsonWhiteTreatment,
  [preExcitedAtrialFibrillationTreatment.conditionId]: preExcitedAtrialFibrillationTreatment,
  [normalSinusRhythmTreatment.conditionId]: normalSinusRhythmTreatment,
  [sinusBradycardiaTreatment.conditionId]: sinusBradycardiaTreatment,
  [sinusTachycardiaTreatment.conditionId]: sinusTachycardiaTreatment,
  [sinusArrhythmiaTreatment.conditionId]: sinusArrhythmiaTreatment,
  [atrialFibrillationTreatment.conditionId]: atrialFibrillationTreatment,
  [atrialFlutterTreatment.conditionId]: atrialFlutterTreatment,
  [atrialTachycardiaTreatment.conditionId]: atrialTachycardiaTreatment,
  [multifocalAtrialTachycardiaTreatment.conditionId]: multifocalAtrialTachycardiaTreatment,
  [avnrtTreatment.conditionId]: avnrtTreatment,
  [avrtTreatment.conditionId]: avrtTreatment,
  [junctionalRhythmTreatment.conditionId]: junctionalRhythmTreatment,
  [junctionalTachycardiaTreatment.conditionId]: junctionalTachycardiaTreatment,
  [wanderingAtrialPacemakerTreatment.conditionId]: wanderingAtrialPacemakerTreatment,
  [prematureAtrialComplexesTreatment.conditionId]: prematureAtrialComplexesTreatment,
  [blockedPrematureAtrialComplexesTreatment.conditionId]: blockedPrematureAtrialComplexesTreatment,
  [prematureJunctionalComplexesTreatment.conditionId]: prematureJunctionalComplexesTreatment,
  [prematureVentricularComplexesTreatment.conditionId]: prematureVentricularComplexesTreatment,
  [pvcCoupletsTripletsTreatment.conditionId]: pvcCoupletsTripletsTreatment,
  [patternedVentricularEctopyTreatment.conditionId]: patternedVentricularEctopyTreatment,
  [rOnTPvcTreatment.conditionId]: rOnTPvcTreatment,
  [ventricularEctopyRunsTreatment.conditionId]: ventricularEctopyRunsTreatment,
  [wideComplexTachycardiaTreatment.conditionId]: wideComplexTachycardiaTreatment,
  [monomorphicVentricularTachycardiaTreatment.conditionId]: monomorphicVentricularTachycardiaTreatment,
  [polymorphicVentricularTachycardiaTreatment.conditionId]: polymorphicVentricularTachycardiaTreatment,
  [torsadesDePointesTreatment.conditionId]: torsadesDePointesTreatment,
  [svtWithAberrancyTreatment.conditionId]: svtWithAberrancyTreatment,
  [ventricularFibrillationTreatment.conditionId]: ventricularFibrillationTreatment,
  [pulselessElectricalActivityTreatment.conditionId]: pulselessElectricalActivityTreatment,
  [asystoleTreatment.conditionId]: asystoleTreatment,
  [stemiTerritoryPatternTreatment.conditionId]: stemiTerritoryPatternTreatment,
  [posteriorOmiTreatment.conditionId]: posteriorOmiTreatment,
  [rightVentricularMiTreatment.conditionId]: rightVentricularMiTreatment,
  [deWinterPatternTreatment.conditionId]: deWinterPatternTreatment,
  [wellensSyndromeTreatment.conditionId]: wellensSyndromeTreatment,
  [hyperacuteTWavesTreatment.conditionId]: hyperacuteTWavesTreatment,
  [subendocardialIschemiaTreatment.conditionId]: subendocardialIschemiaTreatment,
  [leftMainMultivesselIschemiaTreatment.conditionId]: leftMainMultivesselIschemiaTreatment,
  [pathologicalQWavesTreatment.conditionId]: pathologicalQWavesTreatment,
  [sgarbossaPositiveIschemiaTreatment.conditionId]: sgarbossaPositiveIschemiaTreatment,
  [stemiMimicsTreatment.conditionId]: stemiMimicsTreatment,
  [acutePericarditisTreatment.conditionId]: acutePericarditisTreatment,
  [leftVentricularHypertrophyTreatment.conditionId]: leftVentricularHypertrophyTreatment,
  [rightVentricularHypertrophyTreatment.conditionId]: rightVentricularHypertrophyTreatment,
  [leftAtrialEnlargementTreatment.conditionId]: leftAtrialEnlargementTreatment,
  [rightAtrialEnlargementTreatment.conditionId]: rightAtrialEnlargementTreatment,
  [biatrialEnlargementTreatment.conditionId]: biatrialEnlargementTreatment,
  [lowVoltageTreatment.conditionId]: lowVoltageTreatment,
  [electricalAlternansTreatment.conditionId]: electricalAlternansTreatment,
  [benignEarlyRepolarizationTreatment.conditionId]: benignEarlyRepolarizationTreatment,
  [lvhStrainPatternTreatment.conditionId]: lvhStrainPatternTreatment,
  [secondaryWideQrsDiscordanceTreatment.conditionId]: secondaryWideQrsDiscordanceTreatment,
  [brugadaPatternTreatment.conditionId]: brugadaPatternTreatment,
  [hyperkalemiaTreatment.conditionId]: hyperkalemiaTreatment,
  [hypokalemiaTreatment.conditionId]: hypokalemiaTreatment,
  [hypothermiaTreatment.conditionId]: hypothermiaTreatment,
  [digoxinEffectTreatment.conditionId]: digoxinEffectTreatment,
  [cnsTWavesTreatment.conditionId]: cnsTWavesTreatment,
  [pulmonaryEmbolismEcgPatternTreatment.conditionId]: pulmonaryEmbolismEcgPatternTreatment,
};

const findingIdToConditionId: Record<string, string> = {
  'dx-first-degree-av-block': 'first_degree_av_block',
  'dx-first-degree-av-block-wide-qrs-coexisting': 'first_degree_av_block',
  'dx-mobitz-i': 'second_degree_av_block_mobitz_i',
  'dx-mobitz-ii': 'second_degree_av_block_mobitz_ii',
  'dx-high-grade-second-degree-av-block': 'high_grade_av_block',
  'dx-third-degree-av-block': 'third_degree_av_block',
  'dx-rbbb': 'right_bundle_branch_block',
  'dx-incomplete-rbbb': 'incomplete_right_bundle_branch_block',
  'dx-lbbb': 'left_bundle_branch_block',
  'dx-nonspecific-ivcd': 'nonspecific_intraventricular_conduction_delay',
  'dx-lafb': 'left_anterior_fascicular_block',
  'dx-lpfb': 'left_posterior_fascicular_block',
  'dx-bifascicular-block': 'bifascicular_block',
  'dx-trifascicular-pattern': 'trifascicular_pattern',
  'dx-wolff-parkinson-white': 'wolff_parkinson_white_pattern',
  'dx-pre-excited-atrial-fibrillation': 'pre_excited_atrial_fibrillation',
  'alert-pre-excited-atrial-fibrillation': 'pre_excited_atrial_fibrillation',
  'dx-normal-sinus-rhythm': 'normal_sinus_rhythm',
  'dx-sinus-bradycardia': 'sinus_bradycardia',
  'alert-symptomatic-sinus-bradycardia': 'sinus_bradycardia',
  'dx-sinus-tachycardia': 'sinus_tachycardia',
  'alert-sinus-tachycardia-underlying-cause': 'sinus_tachycardia',
  'dx-sinus-arrhythmia': 'sinus_arrhythmia',
  'dx-atrial-fibrillation': 'atrial_fibrillation',
  'alert-atrial-fibrillation-stroke-risk': 'atrial_fibrillation',
  'alert-unstable-rapid-afib': 'atrial_fibrillation',
  'dx-atrial-flutter': 'atrial_flutter',
  'alert-atrial-flutter': 'atrial_flutter',
  'alert-atrial-flutter-one-to-one': 'atrial_flutter',
  'dx-atrial-tachycardia': 'atrial_tachycardia',
  'alert-atrial-tachycardia-digoxin': 'atrial_tachycardia',
  'dx-multifocal-atrial-tachycardia': 'multifocal_atrial_tachycardia',
  'alert-mat-pulmonary-disease': 'multifocal_atrial_tachycardia',
  'dx-avnrt': 'avnrt',
  'alert-avnrt': 'avnrt',
  'dx-avrt': 'avrt',
  'alert-avrt-accessory-pathway': 'avrt',
  'dx-junctional-rhythm': 'junctional_rhythm',
  'alert-slow-junctional-rhythm': 'junctional_rhythm',
  'dx-junctional-tachycardia': 'junctional_tachycardia',
  'alert-junctional-tachycardia': 'junctional_tachycardia',
  'dx-wandering-atrial-pacemaker': 'wandering_atrial_pacemaker',
  'dx-premature-atrial-complexes': 'premature_atrial_complexes',
  'alert-frequent-pacs-ischemic-heart-disease': 'premature_atrial_complexes',
  'dx-blocked-premature-atrial-complexes': 'blocked_premature_atrial_complexes',
  'alert-symptomatic-blocked-pacs': 'blocked_premature_atrial_complexes',
  'dx-premature-junctional-complexes': 'premature_junctional_complexes',
  'alert-frequent-pjcs-digoxin': 'premature_junctional_complexes',
  'dx-premature-ventricular-complexes': 'premature_ventricular_complexes',
  'alert-malignant-pvc-pattern': 'premature_ventricular_complexes',
  'dx-pvc-couplets': 'pvc_couplets_triplets',
  'dx-pvc-triplets': 'pvc_couplets_triplets',
  'alert-pvc-couplet-triplet': 'pvc_couplets_triplets',
  'dx-ventricular-bigeminy': 'patterned_ventricular_ectopy',
  'dx-ventricular-trigeminy': 'patterned_ventricular_ectopy',
  'dx-ventricular-quadrigeminy': 'patterned_ventricular_ectopy',
  'alert-patterned-ventricular-ectopy': 'patterned_ventricular_ectopy',
  'dx-r-on-t-pvc': 'r_on_t_pvc',
  'alert-r-on-t-pvc': 'r_on_t_pvc',
  'dx-ventricular-ectopy-runs': 'ventricular_ectopy_runs',
  'dx-undifferentiated-regular-wide-complex-tachycardia': 'wide_complex_tachycardia',
  'dx-undifferentiated-wide-complex-tachycardia': 'wide_complex_tachycardia',
  'alert-wide-complex-tachycardia': 'wide_complex_tachycardia',
  'dx-monomorphic-ventricular-tachycardia': 'monomorphic_ventricular_tachycardia',
  'alert-monomorphic-vt': 'monomorphic_ventricular_tachycardia',
  'alert-pulseless-monomorphic-vt': 'monomorphic_ventricular_tachycardia',
  'dx-polymorphic-ventricular-tachycardia': 'polymorphic_ventricular_tachycardia',
  'alert-polymorphic-ventricular-tachycardia': 'polymorphic_ventricular_tachycardia',
  'dx-torsades-de-pointes': 'torsades_de_pointes',
  'alert-torsades-de-pointes': 'torsades_de_pointes',
  'dx-svt-with-aberrancy': 'svt_with_aberrancy',
  'dx-ventricular-fibrillation': 'ventricular_fibrillation',
  'alert-ventricular-fibrillation': 'ventricular_fibrillation',
  'dx-pulseless-electrical-activity': 'pulseless_electrical_activity',
  'alert-pea': 'pulseless_electrical_activity',
  'dx-asystole': 'asystole',
  'dx-p-wave-asystole': 'asystole',
  'alert-asystole': 'asystole',
  'dx-inferior-stemi': 'stemi_territory_pattern',
  'alert-inferior-stemi': 'stemi_territory_pattern',
  'dx-inferior-stemi-reciprocal-confirmation': 'stemi_territory_pattern',
  'dx-septal-stemi': 'stemi_territory_pattern',
  'alert-septal-stemi': 'stemi_territory_pattern',
  'dx-septal-stemi-reciprocal-confirmation': 'stemi_territory_pattern',
  'dx-anterior-stemi': 'stemi_territory_pattern',
  'alert-anterior-stemi': 'stemi_territory_pattern',
  'dx-anterior-stemi-reciprocal-confirmation': 'stemi_territory_pattern',
  'dx-anteroseptal-stemi': 'stemi_territory_pattern',
  'alert-anteroseptal-stemi': 'stemi_territory_pattern',
  'dx-anteroseptal-stemi-reciprocal-confirmation': 'stemi_territory_pattern',
  'dx-lateral-stemi': 'stemi_territory_pattern',
  'alert-lateral-stemi': 'stemi_territory_pattern',
  'dx-lateral-stemi-reciprocal-confirmation': 'stemi_territory_pattern',
  'dx-unspecified-stemi': 'stemi_territory_pattern',
  'alert-unspecified-stemi': 'stemi_territory_pattern',
  'dx-unspecified-stemi-reciprocal-confirmation': 'stemi_territory_pattern',
  'dx-posterior-omi': 'posterior_omi',
  'alert-posterior-omi': 'posterior_omi',
  'dx-right-ventricular-mi': 'right_ventricular_mi',
  'alert-rvmi-preload-contraindication': 'right_ventricular_mi',
  'dx-de-winter-pattern': 'de_winter_pattern',
  'alert-de-winter-pattern': 'de_winter_pattern',
  'dx-wellens-syndrome': 'wellens_syndrome',
  'alert-wellens-stress-test-contraindication': 'wellens_syndrome',
  'dx-hyperacute-t-waves': 'hyperacute_t_waves',
  'alert-hyperacute-t-waves': 'hyperacute_t_waves',
  'dx-subendocardial-ischemia': 'subendocardial_ischemia',
  'alert-nste-acs-st-depression': 'subendocardial_ischemia',
  'dx-left-main-multivessel-ischemia': 'left_main_or_multivessel_ischemia',
  'alert-left-main-multivessel-ischemia': 'left_main_or_multivessel_ischemia',
  'dx-pathological-q-waves-prior-infarct': 'pathological_q_waves',
  'alert-q-waves-with-active-stemi': 'pathological_q_waves',
  'dx-sgarbossa-positive': 'sgarbossa_positive_ischemia',
  'dx-modified-sgarbossa-positive': 'sgarbossa_positive_ischemia',
  'alert-sgarbossa-positive': 'sgarbossa_positive_ischemia',
  'exclude-stemi-pericarditis-pattern': 'stemi_mimics',
  'exclude-stemi-ventricular-aneurysm': 'stemi_mimics',
  'dx-pericarditis-pattern': 'pericarditis',
  'dx-left-ventricular-hypertrophy': 'left_ventricular_hypertrophy',
  'caution-lvh-youth-voltage': 'left_ventricular_hypertrophy',
  'alert-lvh-anterior-stemi-mimic': 'left_ventricular_hypertrophy',
  'alert-lvh-strain-active-chest-pain': 'left_ventricular_hypertrophy',
  'dx-right-ventricular-hypertrophy': 'right_ventricular_hypertrophy',
  'alert-rvh-acute-rv-strain': 'right_ventricular_hypertrophy',
  'dx-left-atrial-enlargement': 'left_atrial_enlargement',
  'alert-left-atrial-enlargement-af-risk': 'left_atrial_enlargement',
  'dx-right-atrial-enlargement': 'right_atrial_enlargement',
  'caution-rae-rate-related-p-waves': 'right_atrial_enlargement',
  'dx-biatrial-enlargement': 'biatrial_enlargement',
  'alert-biatrial-enlargement': 'biatrial_enlargement',
  'dx-low-qrs-voltage': 'low_voltage',
  'alert-low-voltage-tamponade': 'low_voltage',
  'dx-electrical-alternans': 'electrical_alternans',
  'alert-electrical-alternans-tamponade': 'electrical_alternans',
  'dx-benign-early-repolarization': 'benign_early_repolarization',
  'alert-inferior-early-repolarization-syncope': 'benign_early_repolarization',
  'dx-acute-pericarditis-stage-i': 'pericarditis',
  'alert-pericarditis-effusion-tamponade': 'pericarditis',
  'dx-lvh-lateral-strain-repolarization': 'lvh_strain_pattern',
  'alert-lvh-strain-possible-superimposed-ischemia': 'lvh_strain_pattern',
  'dx-secondary-wide-qrs-discordance': 'secondary_wide_qrs_discordance',
  'exclude-standard-stemi-secondary-discordance': 'secondary_wide_qrs_discordance',
  'alert-wide-qrs-sgarbossa-needed': 'secondary_wide_qrs_discordance',
  'dx-brugada-pattern-type-i-coved': 'brugada_pattern',
  'dx-brugada-pattern-type-ii-saddleback': 'brugada_pattern',
  'dx-brugada-pattern-type-iii': 'brugada_pattern',
  'alert-brugada-syndrome-risk': 'brugada_pattern',
  'dx-hyperkalemia-ecg-changes': 'hyperkalemia',
  'alert-extreme-hyperkalemia': 'hyperkalemia',
  'dx-hypokalemia-ecg-changes': 'hypokalemia',
  'alert-severe-hypokalemia-torsades-risk': 'hypokalemia',
  'dx-hypothermia-osborn-waves': 'hypothermia',
  'alert-severe-hypothermia': 'hypothermia',
  'alert-digoxin-toxicity': 'digoxin_effect',
  'dx-therapeutic-digoxin-effect': 'digoxin_effect',
  'dx-cns-t-wave-pattern': 'cns_t_waves',
  'alert-cns-t-wave-torsades-risk': 'cns_t_waves',
  'dx-pulmonary-embolism-strain-pattern': 'pulmonary_embolism_ecg_pattern',
};

export function getTreatmentGuidanceForFinding(findingId: string) {
  const conditionId = findingIdToConditionId[findingId];
  return conditionId ? treatmentGuidanceByConditionId[conditionId] : undefined;
}
