export type LearningTopic = {
  title: string;
  subtitle?: string;
  sections: {
    heading: string;
    body: string[];
  }[];
  redFlags?: string[];
  sources?: string[];
};

export const ecgLearningTopics = {
  'step.heartRate': {
    title: 'Heart rate',
    subtitle: 'Convert ECG paper into atrial and ventricular rates.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'At standard paper speed, one large box is 0.20 seconds and one small box is 0.04 seconds.',
          'For a regular rhythm, count large boxes between R waves and divide 300 by that number.',
          'For an irregular rhythm, sample several R-R intervals or count complexes over a longer strip.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'Rate changes help separate sinus bradycardia, sinus tachycardia, atrial arrhythmias, ventricular rhythms, and unstable conduction patterns.',
          'Comparing atrial and ventricular rates helps identify AV dissociation, flutter with block, and paced or escape rhythms.',
        ],
      },
    ],
    redFlags: ['Extreme bradycardia, wide-complex tachycardia, or shock symptoms need urgent clinician review.'],
    sources: ['LITFL ECG rate basics', 'MSD Manual electrocardiography overview'],
  },
  'input.rr': {
    title: 'R-R interval',
    subtitle: 'Distance from one R peak to the next.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Measure between matching R-wave peaks. In a regular rhythm, one representative interval can estimate ventricular rate.',
          'In an irregular rhythm, enter multiple R-R intervals so the app can average the ventricular rate estimate.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Regular slow rhythm suggests sinus bradycardia, AV block with escape, medication effect, hypothermia, or increased vagal tone.',
          'Regular fast narrow rhythm suggests sinus tachycardia, SVT, atrial flutter with fixed block, or atrial tachycardia.',
          'Irregularly irregular R-R intervals raise atrial fibrillation, multifocal atrial tachycardia, frequent ectopy, or variable AV block.',
        ],
      },
    ],
  },
  'input.pp': {
    title: 'P-P interval',
    subtitle: 'Distance from one atrial depolarization to the next.',
    sections: [
      {
        heading: 'How to read it',
        body: ['Use visible P waves or flutter waves only. If atrial activity is absent or chaotic, leave it blank and classify rhythm later.'],
      },
      {
        heading: 'Why it matters',
        body: [
          'Atrial rate helps distinguish sinus rhythm, atrial tachycardia, flutter, AV dissociation, and complete heart block.',
          'When atrial and ventricular rates differ, look for dropped beats, AV block, junctional escape, or ventricular rhythm.',
        ],
      },
    ],
  },
  'step.pWave': {
    title: 'P wave',
    subtitle: 'Atrial depolarization before ventricular activation.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Look first for whether discrete P waves are present before each QRS.',
          'Measure P duration in lead II and inspect V1 for a terminal negative component when assessing atrial enlargement.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Tall peaked P waves support right atrial enlargement, often from pulmonary hypertension, chronic lung disease, or right-sided strain.',
          'Wide/notched P waves or prominent terminal negativity in V1 support left atrial abnormality from mitral valve disease, hypertension, or LV diastolic burden.',
          'Absent or variable P waves suggest atrial fibrillation, flutter, junctional rhythm, ectopic atrial rhythm, artifact, or ventricular rhythm.',
        ],
      },
    ],
    sources: ['LITFL P wave', 'StatPearls electrocardiogram'],
  },
  'input.pWave.measurements': {
    title: 'P-wave measurements',
    subtitle: 'Lead II duration/amplitude and V1 terminal negativity.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Lead II P duration at or above 3 small boxes supports left atrial abnormality.',
          'Lead II P amplitude above 2.5 small boxes supports right atrial enlargement.',
          'In V1, a terminal negative P component that is wide and deep supports left atrial abnormality.',
        ],
      },
      {
        heading: 'Differentials',
        body: [
          'Atrial enlargement criteria are supportive, not definitive; correlate with echo, symptoms, and clinical context.',
          'Low amplitude P waves can occur with hyperkalemia, emphysema, pericardial effusion, obesity, or technical factors.',
        ],
      },
    ],
  },
  'step.prInterval': {
    title: 'PR interval',
    subtitle: 'Atrial-to-ventricular conduction time.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Measure from the beginning of the P wave to the beginning of the QRS complex.',
          'Normal adult PR interval is generally 120-200 ms, or 3-5 small boxes.',
          'Check whether PR intervals are constant and whether any P waves fail to conduct.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Short PR can suggest pre-excitation such as WPW, junctional rhythm, or low atrial rhythm.',
          'Long constant PR suggests first-degree AV delay from AV nodal disease, medications, ischemia, myocarditis, high vagal tone, or electrolyte issues.',
          'Progressive PR lengthening with a dropped QRS supports Mobitz I; fixed PR with dropped QRS supports Mobitz II; AV dissociation supports complete heart block.',
        ],
      },
    ],
    redFlags: ['Mobitz II, high-grade AV block, and complete heart block are clinically important findings.'],
    sources: ['LITFL PR interval', 'MSD Manual electrocardiography overview'],
  },
  'input.pr.measurement': {
    title: 'PR measurement',
    subtitle: 'Small boxes from P onset to QRS onset.',
    sections: [
      {
        heading: 'How to read it',
        body: ['Count small boxes and multiply by 40 ms. If the interval varies, measure several beats.'],
      },
      {
        heading: 'What abnormalities mean',
        body: [
          'Below 120 ms raises pre-excitation or junctional/low atrial rhythm.',
          'Above 200 ms indicates delayed AV conduction when every P wave conducts.',
          'Changing PR intervals can reflect Wenckebach physiology, atrial ectopy, or AV dissociation depending on the pattern.',
        ],
      },
    ],
  },
  'input.pr.segment': {
    title: 'PR segment status',
    subtitle: 'The isoelectric segment after the P wave and before QRS onset.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Compare the PR segment with the TP segment or nearby baseline, ideally in leads where the baseline is steady.',
          'A flat PR segment is usually isoelectric. Depression means the segment sits below baseline; elevation means it sits above baseline.',
          'Ignore noisy baseline wander and confirm suspected PR shift across more than one lead when possible.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Diffuse PR depression, especially with concave ST elevation, supports acute pericarditis or myopericarditis in the right clinical setting.',
          'PR elevation in aVR with reciprocal PR depression elsewhere can support pericarditis.',
          'Localized PR-segment displacement can also appear with atrial infarction, atrial ischemia, lead misplacement, baseline wander, or artifact.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'PR-segment change helps separate pericarditis-like patterns from ischemic ST-change patterns, but it should be interpreted with symptoms, serial ECGs, troponin, and the ST/T-wave findings.',
        ],
      },
    ],
    redFlags: ['Chest pain with ST changes, hemodynamic instability, or suspected myocardial infarction needs urgent clinician review.'],
    sources: ['LITFL pericarditis ECG features', 'AHA/ACC/HRS ECG standardization recommendations'],
  },
  'input.av.droppedQrs': {
    title: 'Dropped QRS after P wave',
    subtitle: 'A P wave is present, but no ventricular QRS complex follows it.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'First confirm that the atrial rhythm is visible. Look for P waves that march through at a regular P-P interval.',
          'A dropped QRS means an atrial impulse appears as a P wave but is not conducted to the ventricles, so the expected QRS complex is absent.',
          'Do not count a pause as a dropped QRS unless you can identify the non-conducted P wave. Hidden P waves may sit in a T wave, so inspect the rhythm strip carefully.',
        ],
      },
      {
        heading: 'Patterns to classify',
        body: [
          'Mobitz I usually shows progressive PR lengthening before a non-conducted P wave, then the cycle resets.',
          'Mobitz II shows intermittent non-conducted P waves without progressive PR lengthening; conducted beats often have a constant PR interval.',
          '2:1 AV block has two P waves for each QRS, so Mobitz I versus Mobitz II may be hard to prove from the surface ECG alone.',
          'High-grade AV block means two or more consecutive P waves fail to conduct. Complete AV block means atria and ventricles beat independently with AV dissociation.',
        ],
      },
      {
        heading: 'Differentials and mimics',
        body: [
          'Blocked PACs can mimic AV block because an early abnormal P wave may be buried in the prior T wave and fail to conduct.',
          'Sinus pause or sinoatrial exit block causes missing P waves, not P waves without QRS complexes.',
          'Artifact, lead noise, junctional escape rhythms, medication effects, ischemia, myocarditis, electrolyte disturbance, and degenerative conduction disease can all affect interpretation.',
        ],
      },
    ],
    redFlags: ['Mobitz II, high-grade AV block, complete heart block, syncope, hypotension, or very slow ventricular escape rhythms need urgent clinician review.'],
    sources: ['LITFL AV block', 'MSD Manual atrioventricular block', 'StatPearls second-degree atrioventricular block'],
  },
  'step.rhythm': {
    title: 'Rhythm synthesis',
    subtitle: 'Combine rate, regularity, P waves, PR behavior, and QRS width.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Start with regularity and rate, then confirm whether P waves are sinus, absent, flutter-like, retrograde, or dissociated.',
          'Use PR behavior and QRS width to separate sinus, atrial, junctional, ventricular, paced, and AV-block rhythms.',
        ],
      },
      {
        heading: 'Differentials',
        body: [
          'Narrow regular tachycardia includes sinus tachycardia, SVT, atrial tachycardia, and flutter with fixed block.',
          'Irregular narrow rhythm includes atrial fibrillation, multifocal atrial tachycardia, variable flutter, and frequent PACs.',
          'Wide tachycardia is ventricular tachycardia until proven otherwise, especially with AV dissociation, capture/fusion beats, or extreme axis.',
        ],
      },
    ],
  },
  'step.qrs': {
    title: 'QRS complex',
    subtitle: 'Ventricular depolarization, conduction, voltage, and wide-complex safety checks.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Measure QRS onset to J point. Normal adult QRS duration is usually under 120 ms.',
          'Then assess morphology, bundle-branch patterns, hypertrophy voltage, low voltage, alternans, delta wave, and wide-complex tachycardia clues.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Wide QRS can reflect bundle branch block, ventricular rhythm, pacing, pre-excitation, hyperkalemia, sodium-channel blocker toxicity, or nonspecific intraventricular conduction delay.',
          'Low voltage can be seen with pericardial effusion, obesity, emphysema, infiltrative disease, or hypothyroidism.',
          'Electrical alternans can occur with large pericardial effusion but also with tachyarrhythmias or lead movement.',
        ],
      },
    ],
    redFlags: ['Wide-complex tachycardia, severe hyperkalemia pattern, or sodium-channel blocker toxicity pattern should be escalated clinically.'],
  },
  'input.qrs.measurement': {
    title: 'QRS duration and voltage',
    subtitle: 'Small-box timing plus lead-specific amplitudes.',
    sections: [
      {
        heading: 'How to read it',
        body: ['Measure from the first QRS deflection to the J point. For voltage, count millimeters in the named leads.'],
      },
      {
        heading: 'Differentials',
        body: [
          'Prolonged duration points toward conduction delay, ventricular origin, pacing, pre-excitation, or metabolic/toxicologic causes.',
          'High voltage can support ventricular hypertrophy, but body habitus, age, athletic conditioning, and lead placement matter.',
        ],
      },
    ],
  },
  'input.qrs.findings': {
    title: 'QRS findings',
    subtitle: 'Classify ventricular depolarization patterns after measuring QRS duration.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Start with duration, then inspect morphology in V1, V6, I, aVL, and the inferior leads.',
          'Select all findings that apply. A tracing can have more than one QRS finding, such as LVH with strain plus incomplete RBBB.',
          'Use the BBB/fascicular criteria and lead-shape evidence to support the finding instead of relying on duration alone.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'BBB pattern suggests delayed conduction through the right or left bundle branch; causes include structural heart disease, ischemia, pulmonary strain, degenerative conduction disease, or rate-related block.',
          'Hypertrophy means voltage and repolarization patterns may support LVH or RVH, but age, body habitus, athlete status, and lead placement can change voltage.',
          'Paced or ventricular-origin QRS complexes are usually wide because ventricular activation does not use the normal His-Purkinje pathway.',
          'Toxicologic/metabolic widening can occur with hyperkalemia or sodium-channel blocker toxicity and can progress quickly.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'QRS morphology affects interpretation of ST/T changes, infarct criteria, axis, QT/JT assessment, and whether tachycardia should be treated as ventricular until proven otherwise.',
        ],
      },
    ],
    redFlags: ['New wide QRS, wide-complex tachycardia, suspected hyperkalemia, or sodium-channel blocker toxicity needs urgent clinical review.'],
    sources: ['LITFL QRS complex', 'AHA/ACCF/HRS intraventricular conduction recommendations'],
  },
  'input.qrs.finding.normal': {
    title: 'Normal QRS conduction',
    subtitle: 'A narrow, expected ventricular depolarization pattern.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Confirm QRS duration is usually less than 120 ms and morphology does not fit BBB, pacing, pre-excitation, ventricular origin, low voltage, alternans, or toxicologic widening.',
          'Check V1 and V6 for expected progression rather than bundle-branch morphology, and confirm voltage is not globally low.',
        ],
      },
      {
        heading: 'What to look for',
        body: [
          'A normal QRS does not exclude ischemia, chamber enlargement, electrolyte disturbance, or rhythm disease; it only means ventricular activation morphology is not abnormal by the selected QRS criteria.',
        ],
      },
    ],
  },
  'input.qrs.finding.hypertrophy': {
    title: 'QRS hypertrophy',
    subtitle: 'Voltage and strain clues for ventricular enlargement or pressure load.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Measure S in V1 plus R in V5 or V6 for Sokolow-Lyon LVH support.',
          'Measure R in aVL plus S in V3 for Cornell voltage support. Cornell criteria are commonly interpreted with sex-specific thresholds in clinical references.',
          'For RVH support, inspect V1 for a tall R wave, R:S ratio greater than 1, and right-axis/right-precordial strain context.',
        ],
      },
      {
        heading: 'Leads to inspect',
        body: [
          'LVH: V1, V3, V5, V6, I, aVL, and lateral ST/T strain leads.',
          'RVH: V1, V2, V5, V6, inferior leads, and right-axis evidence from the axis step.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'LVH voltage can reflect hypertension, aortic stenosis, hypertrophic cardiomyopathy, athletic conditioning, or thin body habitus.',
          'RVH voltage can reflect pulmonary hypertension, chronic lung disease, congenital heart disease, or right ventricular strain.',
          'False positives and false negatives are common; ECG voltage supports but does not diagnose hypertrophy without clinical correlation.',
        ],
      },
    ],
    sources: ['LITFL LVH', 'LITFL RVH', 'AHA/ACCF/HRS chamber hypertrophy recommendations'],
  },
  'input.qrs.finding.bbb': {
    title: 'Bundle branch block pattern',
    subtitle: 'QRS widening or patterned delay through the ventricular conduction system.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Start with QRS duration, then compare V1/V2 against I, aVL, V5, and V6.',
          'RBBB patterns show delayed right ventricular activation, usually with terminal right-precordial R prime and broad terminal S waves laterally.',
          'LBBB patterns show delayed left ventricular activation, usually with dominant negative QRS in V1 and broad/notched lateral R waves.',
        ],
      },
      {
        heading: 'Leads to inspect',
        body: [
          'V1-V3 help separate right-precordial RBBB morphology from dominant S/QS LBBB morphology.',
          'I, aVL, V5, and V6 are essential for lateral broad R waves, absent lateral Q waves, or terminal S waves.',
          'Inferior and lateral limb leads help identify fascicular involvement together with axis.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'BBB changes ST/T interpretation, infarct criteria, QRS duration, and wide-complex tachycardia reasoning.',
        ],
      },
    ],
    redFlags: ['New LBBB or BBB with ischemic symptoms, syncope, or WCT needs clinician review.'],
  },
  'input.qrs.finding.paced': {
    title: 'Paced QRS',
    subtitle: 'Ventricular activation driven by an implanted pacemaker.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for narrow pacer spikes immediately before P waves, QRS complexes, or both.',
          'Ventricular pacing usually creates a wide QRS because activation starts in myocardium rather than the normal His-Purkinje system.',
          'Compare expected capture: a pacer spike should be followed by the chamber response it is pacing.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Failure to capture means a spike is not followed by the expected QRS. Failure to sense can cause spikes in inappropriate places.',
          'Paced rhythms alter ST/T interpretation and may require paced-rhythm ischemia criteria rather than ordinary STEMI rules.',
        ],
      },
    ],
    redFlags: ['Pacemaker spikes without capture, symptomatic bradycardia, syncope, or unstable paced rhythm needs urgent review.'],
  },
  'input.qrs.finding.ventricularOrigin': {
    title: 'Ventricular-origin QRS',
    subtitle: 'QRS complexes generated below the His bundle.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for wide QRS morphology not explained by ordinary supraventricular conduction with BBB.',
          'Assess rate and context: ventricular escape is slow, accelerated idioventricular rhythm is intermediate, and VT is fast.',
          'Look for AV dissociation, capture beats, fusion beats, extreme axis, and precordial concordance when tachycardic.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Ventricular escape can follow high-grade AV block or severe sinus node dysfunction.',
          'AIVR can occur with reperfusion or myocardial injury. VT can occur with ischemia, scar, cardiomyopathy, electrolyte disturbance, or toxicologic triggers.',
          'SVT with aberrancy, pre-excitation, pacing, and hyperkalemia can mimic ventricular-origin QRS complexes.',
        ],
      },
    ],
    redFlags: ['Treat unstable wide-complex tachycardia as an emergency and assume VT until proven otherwise.'],
  },
  'input.qrs.finding.lowVoltage': {
    title: 'Low QRS voltage',
    subtitle: 'Small QRS amplitudes in limb and/or precordial leads.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Check limb leads for QRS amplitudes that are globally small, then check precordial leads separately.',
          'Confirm calibration and lead placement before labeling low voltage.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Low voltage can occur with pericardial effusion, obesity, emphysema/COPD, infiltrative cardiomyopathy, hypothyroidism, pleural effusion, or technical factors.',
          'Low voltage plus electrical alternans and tachycardia raises concern for large pericardial effusion/tamponade in the right clinical setting.',
        ],
      },
    ],
    redFlags: ['Low voltage with hypotension, tachycardia, dyspnea, or alternans should prompt concern for tamponade physiology.'],
  },
  'input.qrs.finding.alternans': {
    title: 'Electrical alternans',
    subtitle: 'Beat-to-beat alternation in QRS amplitude or axis.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for a repeating beat-to-beat change in QRS height or axis, not random baseline artifact.',
          'Confirm the pattern in more than one lead and check whether the heart rate or rhythm explains the alternation.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Electrical alternans with low voltage can be seen in large pericardial effusion because the heart swings within fluid.',
          'Alternans can also occur with SVT, ventricular arrhythmias, conduction alternans, lead movement, or respiratory artifact.',
        ],
      },
    ],
    redFlags: ['Electrical alternans with clinical shock or tamponade features is an urgent finding.'],
  },
  'input.qrs.finding.toxicologic': {
    title: 'Toxicologic QRS widening',
    subtitle: 'Conduction slowing from sodium-channel blockade or severe metabolic disturbance.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for QRS widening that is not explained by known BBB or pacing, especially with altered mental status, overdose, seizure, or shock context.',
          'Sodium-channel blocker toxicity can show wide QRS, terminal R in aVR, deep terminal S in I/aVL, and ventricular arrhythmias.',
          'Severe hyperkalemia can widen QRS with peaked T waves, PR prolongation, P-wave loss, sine-wave pattern, or bradyarrhythmias.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Causes include tricyclic antidepressants, class I antiarrhythmics, diphenhydramine, cocaine, carbamazepine, propranolol, severe hyperkalemia, and other metabolic/toxic states.',
          'Differentiate from chronic BBB by comparing prior ECGs and clinical context.',
        ],
      },
    ],
    redFlags: ['Suspected sodium-channel blocker toxicity or severe hyperkalemia with QRS widening is an emergency.'],
  },
  'input.qrs.finding.other': {
    title: 'Other QRS finding',
    subtitle: 'A morphology that does not fit the common QRS buckets.',
    sections: [
      {
        heading: 'How to use it',
        body: [
          'Use this when the QRS abnormality is real but not captured by BBB, hypertrophy, pacing, ventricular origin, low voltage, alternans, toxicologic widening, or pre-excitation.',
          'Describe the lead distribution, duration, axis, dominant morphology, and whether the finding is new compared with prior ECGs.',
        ],
      },
      {
        heading: 'Examples',
        body: [
          'Examples include nonspecific intraventricular conduction delay, unusual lead-placement pattern, postoperative anatomy, congenital heart disease pattern, or scar-related morphology.',
        ],
      },
    ],
  },
  'input.qrs.bbb.rbbb': {
    title: 'RBBB pattern',
    subtitle: 'Delayed right ventricular activation.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for QRS at least 120 ms for complete RBBB, or RBBB-like morphology with narrower duration for incomplete RBBB.',
          'Inspect V1-V3 for rsR prime, rSR prime, or M-shaped terminal R morphology.',
          'Inspect I, aVL, V5, and V6 for a broad or slurred terminal S wave.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'RBBB can be benign or related to right ventricular strain, pulmonary embolism, pulmonary hypertension, congenital heart disease, ischemia, myocarditis, or degenerative conduction disease.',
          'Differentiate from Brugada patterns, RVH, posterior MI patterns, lead misplacement, and ventricular rhythms.',
        ],
      },
    ],
  },
  'input.qrs.bbb.lbbb': {
    title: 'LBBB pattern',
    subtitle: 'Delayed left ventricular activation.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for QRS duration at least 120 ms with dominant S or QS pattern in V1.',
          'Inspect I, aVL, V5, and V6 for broad/notched monophasic R waves, absent lateral Q waves, and delayed R-wave peak time.',
          'Expect secondary ST/T discordance, where repolarization points opposite the main QRS direction.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'LBBB can reflect structural heart disease, hypertension, aortic stenosis, cardiomyopathy, ischemia, myocarditis, or degenerative conduction disease.',
          'LBBB complicates STEMI and LVH interpretation; use LBBB/paced-rhythm ischemia criteria when clinically relevant.',
        ],
      },
    ],
    redFlags: ['New LBBB with ischemic symptoms or unstable presentation needs urgent clinical correlation.'],
  },
  'input.qrs.bbb.incompleteRbbb': {
    title: 'Incomplete RBBB',
    subtitle: 'RBBB-like right-precordial morphology with QRS below complete RBBB duration.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for rsR prime or rSR prime morphology in V1-V2 with QRS duration below 120 ms.',
          'Check lateral leads for terminal S waves, but expect less widening than complete RBBB.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Incomplete RBBB may be a normal variant, especially in younger people or athletes, but can also appear with right-sided volume/pressure load.',
          'Differentiate from lead misplacement, Brugada type 2 pattern, RVH, atrial septal defect, and posterior MI mimics.',
        ],
      },
    ],
  },
  'input.qrs.bbb.ivcd': {
    title: 'Nonspecific IVCD',
    subtitle: 'A wide QRS pattern that does not satisfy classic RBBB or LBBB criteria.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Confirm QRS widening, then check that morphology does not meet full RBBB or LBBB pattern criteria.',
          'Describe the leads with dominant delay, notching, slurring, or unusual terminal forces.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'IVCD can reflect cardiomyopathy, ischemic scar, LVH, electrolyte disturbance, drug/toxicologic conduction slowing, pacing/fusion, or congenital/postoperative anatomy.',
          'Compare with prior ECGs because chronic IVCD and acute metabolic widening can look similar without clinical context.',
        ],
      },
    ],
  },
  'input.qrs.bbb.fascicular': {
    title: 'Fascicular block evidence',
    subtitle: 'Left anterior/posterior fascicle clues plus axis context.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'For LAFB, look for left-axis context, qR in I/aVL, rS in inferior leads, and delayed R-wave peak in aVL.',
          'For LPFB, look for right-axis context after excluding RVH/lateral MI, rS in I/aVL, qR in inferior leads, and inferior delayed R-wave peak.',
          'Bifascicular usually combines RBBB with LAFB or LPFB. Trifascicular terminology should be used cautiously and usually needs PR/AV conduction context.',
        ],
      },
      {
        heading: 'Leads to inspect',
        body: [
          'LAFB: I, aVL, II, III, aVF, and axis step findings.',
          'LPFB: I, aVL, II, III, aVF, and axis step findings, while excluding more common causes of right-axis deviation.',
        ],
      },
    ],
  },
  'input.qrs.wctSafety': {
    title: 'Voltage and WCT safety checks',
    subtitle: 'Low voltage, alternans, and clues that a wide-complex tachycardia is ventricular.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Low limb voltage means small QRS amplitudes in limb leads; low precordial voltage means small amplitudes across chest leads.',
          'Electrical alternans is beat-to-beat alternation in QRS amplitude or axis, not just a noisy baseline.',
          'For wide-complex tachycardia, look for AV dissociation, capture beats, fusion beats, extreme axis, and concordance across precordial leads.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Low voltage can occur with pericardial effusion, obesity, emphysema/COPD, infiltrative cardiomyopathy, hypothyroidism, or technical factors.',
          'Electrical alternans with low voltage can suggest large pericardial effusion/tamponade, but alternans can also appear with tachyarrhythmias or lead movement.',
          'Wide-complex tachycardia is ventricular tachycardia until proven otherwise, especially with capture/fusion beats, AV dissociation, extreme axis, or concordant precordial QRS complexes.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'These checks flag patterns where the ECG may represent an unstable rhythm, tamponade physiology, toxicologic/metabolic emergency, or a rhythm that should not be managed as benign SVT without expert review.',
        ],
      },
    ],
    redFlags: ['Unstable WCT, syncope, hypotension, chest pain, suspected tamponade, severe hyperkalemia, or toxicologic QRS widening needs urgent clinician review.'],
    sources: ['LITFL ventricular tachycardia', 'LITFL low voltage', 'MSD Manual ventricular tachycardia'],
  },
  'input.qrs.deltaWave': {
    title: 'Delta wave',
    subtitle: 'A slurred initial QRS upstroke suggesting ventricular pre-excitation.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Look at the start of the QRS complex for a slow, slurred upstroke rather than a crisp initial deflection.',
          'A classic pre-excitation pattern combines a short PR interval, delta wave, and widened QRS complex.',
          'Delta waves can vary by lead and may be intermittent, so compare multiple leads and beats when the finding is subtle.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'A delta wave suggests an accessory pathway such as Wolff-Parkinson-White pattern, where ventricular tissue is activated early outside the normal AV nodal delay.',
          'Differentials and mimics include bundle branch block, ventricular pacing, fusion beats, myocardial scar, and poor baseline quality.',
          'Pre-excitation can alter QRS morphology, ST/T interpretation, axis, and infarct-like patterns.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'WPW pattern can be benign when asymptomatic, but atrial fibrillation with pre-excitation can conduct rapidly to the ventricles and become dangerous.',
        ],
      },
    ],
    redFlags: ['Irregular very rapid wide-complex rhythm with suspected WPW/pre-excitation needs urgent expert management.'],
    sources: ['LITFL pre-excitation syndromes', 'MSD Manual Wolff-Parkinson-White syndrome'],
  },
  'step.axis': {
    title: 'Cardiac axis',
    subtitle: 'Frontal-plane direction of ventricular and atrial depolarization.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Use lead I and aVF first, then lead II/aVL to refine the quadrant.',
          'A normal QRS axis is commonly around -30 to +90 degrees in adults, though reference ranges vary by source and population.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Left axis deviation can reflect left anterior fascicular block, inferior MI, LVH, paced rhythm, or conduction disease.',
          'Right axis deviation can reflect RVH, pulmonary disease, lateral MI, left posterior fascicular block, or limb-lead reversal.',
          'Extreme axis in wide tachycardia supports ventricular origin.',
        ],
      },
    ],
  },
  'step.qWaves': {
    title: 'Q waves',
    subtitle: 'Look for pathological Q waves and pseudo-infarct mimics.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Assess width, depth, and whether Q waves appear in anatomically contiguous leads.',
          'Small septal Q waves can be normal in lateral leads; pathological interpretation depends on lead pattern and context.',
        ],
      },
      {
        heading: 'Differentials',
        body: [
          'Pathological Q waves can suggest prior myocardial infarction or myocardial scar.',
          'Mimics include LVH, LBBB, WPW, hypertrophic cardiomyopathy, lead misplacement, and normal variants.',
        ],
      },
    ],
  },
  'step.stSegment': {
    title: 'ST segment',
    subtitle: 'Ventricular plateau phase relative to the isoelectric baseline.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Compare the J point and ST segment with the PR/TP baseline, then localize changes by contiguous leads.',
          'Contiguous leads are neighboring views of the same myocardial region; ischemic ST changes are more meaningful when they cluster by territory.',
          'Check morphology, reciprocal change, posterior/right-sided leads when indicated, and STEMI-equivalent patterns.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'ST elevation can represent acute coronary occlusion, pericarditis, early repolarization, LVH, LBBB/pacing, Brugada pattern, aneurysm, or hyperkalemia.',
          'ST depression can represent ischemia, reciprocal change, digoxin effect, hypokalemia, LVH strain, posterior OMI, or rate-related change.',
        ],
      },
    ],
    redFlags: ['New ischemic ST change, reciprocal change, posterior OMI, right ventricular MI, or STEMI-equivalent patterns need urgent clinical correlation.'],
    sources: ['LITFL ST segment', 'AHA/ACC/HRS ECG standardization recommendations'],
  },
  'input.st.leadsTerritories': {
    title: 'ST leads and territories',
    subtitle: 'Use contiguous lead groups and reciprocal changes to localize ST abnormalities.',
    sections: [
      {
        heading: 'Contiguous lead regions',
        body: [
          'Inferior territory: II, III, and aVF.',
          'Septal territory: V1 and V2.',
          'Anterior territory: V3 and V4.',
          'Lateral territory: I, aVL, V5, and V6. High lateral changes are often most visible in I and aVL.',
          'Posterior territory: V7, V8, and V9 when placed; on a standard ECG, posterior OMI may appear as horizontal ST depression with tall R waves in V1-V3.',
          'Right ventricular territory: V3R and V4R, especially when inferior MI suggests possible RV involvement.',
        ],
      },
      {
        heading: 'How to read ST leads',
        body: [
          'Select the leads where the primary ST abnormality is present, then record the greatest deviation in small boxes.',
          'Look for a regional pattern: inferior, anterior, lateral, posterior, or right ventricular. A single isolated lead is less specific than a contiguous cluster.',
          'Use posterior leads V7-V9 when posterior OMI is suspected, and right-sided V3R/V4R when inferior STEMI or RV infarction is suspected.',
        ],
      },
      {
        heading: 'Reciprocal leads',
        body: [
          'Inferior ST elevation in II, III, and aVF often has reciprocal ST depression in I and aVL.',
          'High lateral ST elevation in I and aVL may have reciprocal inferior ST depression in II, III, and aVF.',
          'Anterior ST elevation may have inferior reciprocal changes; posterior OMI can present as reciprocal anterior ST depression in V1-V3.',
          'Reciprocal change strengthens concern for acute coronary occlusion, but absence of reciprocal change does not exclude OMI.',
        ],
      },
      {
        heading: 'Important caveats',
        body: [
          'Lead territories are ECG views, not perfect coronary maps. Coronary dominance, wraparound LAD anatomy, prior infarct, BBB, pacing, LVH, and lead placement can change the pattern.',
          'Compare with prior ECGs and clinical context. Serial change can be more informative than a single tracing.',
        ],
      },
    ],
    redFlags: ['Regional ST elevation/depression with reciprocal change, posterior OMI pattern, or right ventricular MI pattern needs urgent clinician review.'],
    sources: ['LITFL ST segment', 'LITFL STEMI localization', 'AHA/ACC/HRS ECG standardization recommendations'],
  },
  'step.tWaves': {
    title: 'T waves',
    subtitle: 'Ventricular repolarization direction, shape, and distribution.',
    sections: [
      {
        heading: 'How to read it',
        body: ['Assess whether T waves are expected for each lead, then note inversion, flattening, peaking, biphasic shape, or hyperacute morphology.'],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Inversion can reflect ischemia, Wellens pattern, PE/right heart strain, LVH strain, CNS injury, bundle branch block, juvenile pattern, or persistent normal variants.',
          'Tall peaked T waves suggest hyperkalemia; broad hyperacute T waves can be early coronary occlusion; flattened T waves can reflect hypokalemia or nonspecific repolarization change.',
        ],
      },
    ],
  },
  'input.tWave.normal': {
    title: 'Normal T waves',
    subtitle: 'Expected ventricular repolarization for the lead and QRS direction.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Normal T waves are usually asymmetric, with a gradual upstroke and faster downstroke.',
          'They are usually upright in I, II, and V3-V6, inverted in aVR, and variable in III, aVL, aVF, V1, and sometimes V2 depending on age and lead context.',
          'Compare T-wave direction with the dominant QRS direction; expected secondary discordance can occur with BBB or pacing.',
        ],
      },
      {
        heading: 'What to check',
        body: [
          'Make sure the T wave is not unusually tall, symmetric, deeply inverted, flattened, biphasic, or new compared with prior ECGs.',
          'Normal morphology does not exclude ischemia or electrolyte abnormality; use symptoms, serial ECGs, and ST/QT context.',
        ],
      },
    ],
  },
  'input.tWave.inverted': {
    title: 'Inverted T waves',
    subtitle: 'Downward repolarization deflection in leads where it is unexpected or clinically meaningful.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Identify leads where the T wave is below baseline and compare with the expected T direction for that lead.',
          'Look for contiguous distribution: anterior V1-V4, lateral I/aVL/V5-V6, inferior II/III/aVF, or right-precordial patterns.',
          'Assess depth and symmetry. Deep, symmetric inversion is more concerning than shallow, asymmetric, stable inversion.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Ischemia and reperfusion, including Wellens pattern, can produce anterior or widespread T-wave inversion.',
          'LVH/RVH strain, bundle branch block, paced rhythm, pulmonary embolism/right heart strain, CNS injury, myocarditis, cardiomyopathy, and normal juvenile/persistent variants can also invert T waves.',
          'New inversion in a symptomatic patient is more important than a stable old pattern.',
        ],
      },
    ],
    redFlags: ['New deep symmetric inversion, Wellens-type anterior inversion, or inversion with chest pain/syncope needs urgent clinician review.'],
  },
  'input.tWave.tallPeaked': {
    title: 'Tall peaked T waves',
    subtitle: 'Prominent T waves that may be narrow/pointed or tall relative to the QRS.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for tall, narrow, tented T waves, often best seen across precordial leads in hyperkalemia.',
          'Compare T-wave height with QRS amplitude and with prior ECGs if available.',
          'Check whether the T waves are diffuse rather than confined to one coronary territory.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Hyperkalemia classically causes tall peaked T waves and may progress to PR prolongation, P-wave loss, QRS widening, and sine-wave pattern.',
          'Early repolarization, normal variant, LVH, bradycardia, and early ischemic hyperacute T waves can also look tall.',
          'Hyperacute ischemic T waves tend to be broader and bulky rather than sharply tented.',
        ],
      },
    ],
    redFlags: ['Tall peaked T waves with renal failure, weakness, bradycardia, QRS widening, or suspected hyperkalemia need urgent review.'],
  },
  'input.tWave.hyperacute': {
    title: 'Hyperacute T waves',
    subtitle: 'Broad, bulky early ischemic T waves that can precede ST elevation.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for broad-based, bulky, symmetric T waves that are large relative to the QRS in a contiguous territory.',
          'Localize them by leads: anterior V2-V4, lateral I/aVL/V5-V6, inferior II/III/aVF, or posterior clues in V1-V3.',
          'Compare with prior ECGs and repeat ECGs; hyperacute T waves can be transient and evolve into ST elevation or depression patterns.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Hyperacute T waves are an early occlusion MI sign, especially when regional, new, and accompanied by reciprocal change or symptoms.',
          'Differentials include hyperkalemia, early repolarization, LVH, and normal tall T-wave variants.',
          'Broad regional morphology plus clinical ischemia should weigh more heavily than T-wave height alone.',
        ],
      },
    ],
    redFlags: ['Hyperacute regional T waves with ischemic symptoms or reciprocal changes are an OMI warning sign.'],
  },
  'input.tWave.biphasic': {
    title: 'Biphasic T waves',
    subtitle: 'T waves with both positive and negative phases.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'A biphasic T wave crosses the baseline, producing both upright and inverted components.',
          'Note the lead distribution and direction of phases, especially in V2-V3 where Wellens type A can appear biphasic.',
          'Check whether the ST segment is isoelectric or only minimally elevated/depressed, and compare with symptoms and serial ECGs.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Wellens type A pattern is classically biphasic T waves in V2-V3 after chest pain, suggesting critical LAD disease risk.',
          'Biphasic T waves can also occur with ischemia/reperfusion, hypokalemia, LVH strain, bundle branch block, pulmonary embolism, or normal variants in right precordial leads.',
          'Lead placement and baseline wander can falsely create a biphasic appearance.',
        ],
      },
    ],
    redFlags: ['Anterior biphasic T waves suspicious for Wellens pattern should be treated as high risk even if pain has improved.'],
  },
  'input.tWave.flattened': {
    title: 'Flattened T waves',
    subtitle: 'Low-amplitude or nearly isoelectric repolarization.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for T waves that are unusually small compared with the QRS or prior ECGs.',
          'Assess whether flattening is diffuse, regional, or associated with ST depression and U waves.',
          'Check QT/QU appearance because prominent U waves can make the T wave seem small or merged.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Hypokalemia commonly causes T-wave flattening, ST depression, and prominent U waves.',
          'Nonspecific repolarization changes, ischemia, medications, hypothyroidism, pericardial disease, and low-voltage states can also flatten T waves.',
          'Diffuse flattening is less localizing than regional flattening with ischemic symptoms or ST changes.',
        ],
      },
    ],
  },
  'input.tWave.deepSymmetric': {
    title: 'Deep symmetric T waves',
    subtitle: 'Marked, symmetric inversion that can signal high-risk repolarization abnormality.',
    sections: [
      {
        heading: 'How to find it',
        body: [
          'Look for deep, narrow-based or symmetric downward T waves, especially when they occur in contiguous leads.',
          'Localize the pattern: anterior V2-V4, lateral I/aVL/V5-V6, inferior II/III/aVF, or widespread.',
          'Check for a Wellens type B pattern when deep symmetric anterior inversion appears after chest pain.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Deep symmetric inversion can reflect ischemia/reperfusion, Wellens syndrome, pulmonary embolism/right heart strain, CNS injury, apical hypertrophic cardiomyopathy, myocarditis, or Takotsubo cardiomyopathy.',
          'Secondary repolarization changes from LVH, BBB, or pacing can also be deep but should follow the QRS/conduction pattern.',
          'Serial evolution and clinical context are essential because dangerous patterns can occur when pain has resolved.',
        ],
      },
    ],
    redFlags: ['Deep symmetric anterior T-wave inversion after chest pain is concerning for Wellens pattern and needs urgent review.'],
  },
  'step.qtInterval': {
    title: 'QT interval',
    subtitle: 'Ventricular depolarization plus repolarization, corrected for rate.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Measure from QRS onset to T-wave end, preferably in a lead where T-wave offset is clear.',
          'Correct QT for heart rate. Bazett is common but overcorrects at high rates and undercorrects at low rates.',
        ],
      },
      {
        heading: 'Abnormalities and differentials',
        body: [
          'Long QT raises risk for torsades and can be congenital or caused by medications, hypokalemia, hypomagnesemia, hypocalcemia, ischemia, CNS events, or bradycardia.',
          'Short QT can occur with hypercalcemia, digoxin effect, acidosis, hyperkalemia, or congenital short-QT syndrome.',
        ],
      },
    ],
    redFlags: ['Marked QTc prolongation, syncope, torsades, or high-risk medication/electrolyte context needs urgent review.'],
  },
  'step.lateWaves': {
    title: 'R-wave progression and late waves',
    subtitle: 'Precordial transition, U waves, J waves, and epsilon waves.',
    sections: [
      {
        heading: 'How to read it',
        body: [
          'Normal R-wave progression usually increases from V1 toward V5, with a transition zone around V3-V4.',
          'Inspect late deflections after QRS/T waves: U waves, J waves, and epsilon waves have different clinical meanings.',
        ],
      },
      {
        heading: 'Differentials',
        body: [
          'Poor R-wave progression can reflect prior anterior MI, LVH, COPD, lead misplacement, LBBB, or normal variant.',
          'Prominent U waves suggest hypokalemia, bradycardia, antiarrhythmics, or CNS events. Epsilon waves raise arrhythmogenic right ventricular cardiomyopathy concern.',
          'J-point/J-wave patterns may be benign early repolarization, hypothermia, Brugada pattern, or ischemic context depending on morphology and leads.',
        ],
      },
    ],
  },
  'step.finalReview': {
    title: 'Final review',
    subtitle: 'Turn measurements into a cautious, clinically framed interpretation.',
    sections: [
      {
        heading: 'How to use this step',
        body: [
          'Add context that changes interpretation: symptoms, serial change, prior ECGs, medications, electrolytes, lead quality, and clinical risk.',
          'ECG interpretation is pattern recognition plus clinical context; the app should support, not replace, clinician judgment.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'A technically correct ECG measurement can be misleading without context such as chest pain timing, pacing, bundle branch block, electrolyte abnormality, or old ECG comparison.',
        ],
      },
    ],
  },
} satisfies Record<string, LearningTopic>;

export type LearningTopicId = keyof typeof ecgLearningTopics;

export function getLearningTopic(topicId?: LearningTopicId | string | null) {
  if (!topicId) return undefined;
  return ecgLearningTopics[topicId as LearningTopicId];
}
