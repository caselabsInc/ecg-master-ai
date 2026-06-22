export type LearningFigureId =
  | 'ecg-grid-architecture'
  | 'ecg-1500-method'
  | 'ecg-sequence-method'
  | 'p-wave-atrial-abnormalities'
  | 'p-wave-biphasic-v1'
  | 'p-wave-retrograde-conduction'
  | 'pr-normal-vs-wpw'
  | 'pr-first-degree-wenckebach'
  | 'pr-mobitz-ii-complete-block'
  | 'rhythm-decision-tree'
  | 'rhythm-synthesis-dashboard'
  | 'rhythm-av-association'
  | 'qrs-measurement-calibration'
  | 'qrs-bbb-v1-patterns'
  | 'qrs-r-wave-progression'
  | 'qrs-ventricular-hypertrophy'
  | 'axis-hexaxial-wheel'
  | 'axis-quadrants'
  | 'axis-quadrant-method'
  | 'axis-lead-ii-tiebreaker'
  | 'axis-degree-method'
  | 'axis-vector-shifts'
  | 'qwave-criteria'
  | 'qwave-electrical-window'
  | 'qwave-territory-map'
  | 'st-measurement-landmarks'
  | 'st-elevation-thresholds'
  | 'st-depression-digoxin'
  | 'st-lbbb-discordance'
  | 'twave-normal-anatomy'
  | 'twave-inversions'
  | 'twave-hyperkalemia-hyperacute'
  | 'twave-notched'
  | 'qt-measurement-landmarks'
  | 'qt-rate-correction'
  | 'qt-prolongation-torsades'
  | 'qt-shortening-causes'
  | 'uwave-prominent-hypokalemia'
  | 'uwave-inverted-ischemia'
  | 'final-technical-validation'
  | 'final-evidence-integration'
  | 'final-workflow-map';

export type LearningQuizQuestion = {
  prompt: string;
  choices: string[];
  correctIndex: number;
  explanation: string;
};

export type LearningTopic = {
  title: string;
  subtitle?: string;
  sections: {
    heading: string;
    body: string[];
    figures?: LearningFigureId[];
  }[];
  redFlags?: string[];
  quiz?: LearningQuizQuestion[];
  sources?: string[];
};

export const ecgLearningTopics = {
  'step.heartRate': {
    title: 'Heart rate',
    subtitle: 'Convert ECG paper into atrial and ventricular rates.',
    sections: [
      {
        heading: 'ECG grid basics',
        body: [
          'Standard ECG paper moves at 25 mm per second. Horizontally, each small 1 mm box equals 0.04 seconds, and each large 5 mm box equals 0.20 seconds.',
          'Vertically, each small 1 mm box equals 0.1 mV and each large 5 mm box equals 0.5 mV. Step 1 mainly uses the time axis, but voltage calibration still matters for later steps.',
          'Before calculating rate, confirm the tracing uses standard paper speed and calibration. Non-standard settings change the meaning of every box.',
        ],
        figures: ['ecg-grid-architecture'],
      },
      {
        heading: 'What to calculate',
        body: [
          'Calculate the ventricular rate from the R-R interval, which is the distance from one R wave to the next R wave.',
          'Calculate the atrial rate from the P-P interval, which is the distance from one P wave to the next P wave.',
          'In normal sinus rhythm the atrial and ventricular rates are usually identical. When they differ, enter them separately so the review can preserve the conduction relationship.',
          'Different atrial and ventricular rates can reveal AV block, atrial flutter with block, AV dissociation, or paced and escape rhythms. For example, an atrial rate near 107 bpm with a ventricular rate near 35 bpm suggests a major conduction mismatch that should not be averaged away.',
        ],
      },
      {
        heading: 'Regular rhythm methods',
        body: [
          'Use the 1500 method for the most precise regular-rate estimate: count the small boxes between two consecutive R waves or P waves, then divide 1500 by that count.',
          'Use the large-box sequence method for a rapid regular-rate estimate: start at a wave on a heavy line and count large boxes to the next matching wave as 300, 150, 100, 75, 60, 50, 43, then 37 bpm.',
          'Common validation anchors are: 5 small boxes = 300 bpm, 10 = 150 bpm, 15 = 100 bpm, 20 = 75 bpm, 25 = 60 bpm, 30 = 50 bpm, and 40 = about 37 bpm.',
        ],
        figures: ['ecg-1500-method', 'ecg-sequence-method'],
      },
      {
        heading: 'Irregular rhythm method',
        body: [
          'Use the 6-second method for irregular rhythms such as atrial fibrillation. A 6-second strip spans 30 large boxes or 150 small boxes at standard speed.',
          'Count all QRS complexes in the 6-second strip and multiply by 10 to estimate ventricular rate.',
          'Count all visible P waves or organized atrial waves in the same 6-second strip and multiply by 10 to estimate atrial rate.',
          'Example: 11 QRS complexes in a 6-second irregular strip gives an estimated ventricular rate of 110 bpm.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'The calculation method depends on regularity. A precise small-box calculation works well for regular rhythms, while irregular rhythms need a longer counting window.',
          'Separating atrial and ventricular rates helps identify conduction ratios and prevents clinically important AV block or flutter patterns from being hidden inside one averaged heart rate.',
        ],
      },
    ],
    redFlags: ['Extreme bradycardia, wide-complex tachycardia, or shock symptoms need urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
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
        heading: 'What the P wave represents',
        body: [
          'A normal P wave records atrial depolarization as the impulse travels from the SA node through the right and left atria.',
          'The first part of the P wave mainly reflects right atrial depolarization, and the terminal part mainly reflects left atrial depolarization. These normally merge into one smooth, rounded waveform.',
          'Assess presence, amplitude, duration, configuration, deflection, and the relationship of each P wave to the QRS complex.',
        ],
      },
      {
        heading: 'Normal measurements and deflections',
        body: [
          'Measure P-wave amplitude vertically from the isoelectric line. A normal P wave is usually about 2-3 mm tall, with 2.5 mm often used as the upper normal limit in lead II.',
          'Measure P-wave duration horizontally. Normal duration is about 0.06-0.12 seconds, or 1.5-3 small boxes.',
          'Sinus P waves are usually upright in leads I, II, aVF, and V2-V6, inverted in aVR, variable in III and aVL, and often biphasic or variable in V1.',
          'Lead V1 is especially useful because its biphasic shape can show right atrial forces first and left atrial terminal forces later.',
        ],
        figures: ['p-wave-atrial-abnormalities', 'p-wave-biphasic-v1'],
      },
      {
        heading: 'Right atrial abnormality',
        body: [
          'Right atrial abnormality affects the initial P-wave component. Look for tall, peaked, pointed P waves greater than 2.5 mm, usually with normal duration.',
          'The pattern is most visible in inferior leads II, III, and aVF. In V1, the initial positive component may be prominent.',
          'Common clinical associations include COPD, pulmonary hypertension, congenital heart disease, right ventricular failure, pulmonary embolism, and tricuspid or pulmonary valve disease.',
        ],
      },
      {
        heading: 'Left and combined atrial abnormality',
        body: [
          'Left atrial abnormality affects the middle and terminal P-wave components. Look for wide, notched, or M-shaped P waves with duration at or above 0.12 seconds.',
          'In V1, left atrial abnormality often appears as a biphasic P wave with a small initial positive deflection followed by a prominent, wide terminal negative deflection.',
          'Clinical associations include systemic hypertension, mitral or aortic valve disease, cardiomyopathy, coronary disease, and heart failure.',
          'Combined atrial abnormality shows overlapping features: tall or peaked right atrial forces plus prolonged or notched left atrial forces.',
        ],
      },
      {
        heading: 'Ectopic and retrograde P waves',
        body: [
          'If atrial activation starts low in the atrium or near the AV junction, depolarization travels retrograde. This can invert P waves in leads II, III, and aVF.',
          'Retrograde P waves may appear before the QRS with a short PR interval, be hidden inside the QRS, or appear after the QRS and distort the terminal QRS or ST segment.',
          'Gradual beat-to-beat changes in P-wave shape suggest wandering atrial pacemaker when at least three distinct P-wave morphologies appear in one lead and the rate is under 100 bpm.',
          'Multifocal atrial tachycardia uses the same multi-focus idea but with a ventricular rate over 100 bpm, irregular R-R intervals, variable PR intervals, and visible isoelectric baseline between P waves.',
        ],
        figures: ['p-wave-retrograde-conduction'],
      },
      {
        heading: 'Premature atrial complexes',
        body: [
          'A PAC is an early ectopic atrial beat that interrupts the underlying rhythm. Its P wave often looks different from the sinus P wave: flattened, biphasic, pointed, notched, or inverted.',
          'A very early PAC may hide in the preceding T wave. Look for a T wave that is taller, notched, bumped, or different from the surrounding T waves.',
          'A blocked PAC occurs when the premature atrial impulse reaches a refractory AV node, so the ectopic P wave is not followed by a QRS and a pause appears.',
        ],
      },
      {
        heading: 'Absent P waves and atrial oscillations',
        body: [
          'Atrial flutter replaces normal P waves with organized flutter waves, often saw-tooth in appearance. Atrial activity is commonly 250-350 bpm, and the PR interval is not measurable.',
          'Atrial fibrillation has no discrete P waves. The baseline shows chaotic fibrillatory activity and the ventricular rhythm is classically irregularly irregular.',
          'Electronic atrial pacing produces a narrow pacer spike immediately before the P wave. The paced P wave may be upright but often has non-physiologic morphology compared with the patient\'s intrinsic sinus P wave.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'P-wave analysis separates sinus rhythm from ectopic atrial rhythm, junctional rhythm, atrial flutter, atrial fibrillation, paced atrial rhythm, and AV conduction disease.',
          'P-wave morphology also gives evidence for right or left atrial abnormality, but those ECG patterns should be interpreted with clinical context and confirmatory testing when needed.',
        ],
      },
    ],
    redFlags: ['Absent P waves with an irregularly irregular rhythm, rapid flutter with symptoms, or retrograde P waves with hemodynamic instability need urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
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
        heading: 'What the PR interval represents',
        body: [
          'The PR interval represents the time for an atrial impulse to travel from the atria through the AV node, His bundle, bundle branches, and into the ventricles.',
          'It is the core measurement for judging AV conduction velocity and deciding whether atrial impulses conduct normally, slowly, intermittently, or not at all.',
          'Always interpret PR behavior together with P-wave visibility, P-to-QRS relationship, dropped beats, QRS width, and the atrial and ventricular rates from Step 1.',
        ],
      },
      {
        heading: 'How to measure it',
        body: [
          'Measure horizontally from the onset of the P wave, where it leaves the isoelectric baseline, to the onset of the QRS complex, the first deflection away from baseline.',
          'At standard paper speed, normal adult PR duration is 0.12-0.20 seconds, or 3-5 small boxes.',
          'The PR interval can shorten physiologically as heart rate increases, so interpret borderline values with rhythm and clinical context.',
          'Under usual rhythm-analysis conditions, do not measure PR-segment amplitude, deflection, or shape as part of the PR interval. Measure the time interval and then assess dropped conduction separately.',
        ],
        figures: ['pr-normal-vs-wpw'],
      },
      {
        heading: 'Short PR interval',
        body: [
          'A PR interval below 0.12 seconds means ventricular activation begins earlier than expected or the pacemaker focus is closer to the ventricles.',
          'Pre-excitation such as Wolff-Parkinson-White uses an accessory pathway that bypasses normal AV nodal delay. Look for short PR, widened QRS, and a slurred initial QRS upstroke called a delta wave.',
          'Low atrial or AV junctional rhythms can also create a short PR when the P wave appears before the QRS. Inverted P waves in II, III, and aVF support retrograde atrial activation.',
          'Short PR with retrograde P waves may be seen with premature junctional complexes, junctional escape rhythm, or junctional tachycardia.',
        ],
      },
      {
        heading: 'Prolonged PR interval',
        body: [
          'A PR interval above 0.20 seconds means conduction is delayed through the atria, AV node, His bundle, or proximal conduction system.',
          'First-degree AV block has a constant PR interval above 0.20 seconds with strict 1:1 conduction: every P wave is followed by a QRS complex.',
          'Common contributors include AV nodal disease, digoxin toxicity, beta-blockers, calcium channel blockers, coronary disease, ischemia or MI, myocarditis, and degenerative conduction disease.',
          'First-degree AV block is a delay, not a dropped-beat rhythm; dropped QRS complexes move the interpretation into second-degree or higher-grade AV block patterns.',
        ],
        figures: ['pr-first-degree-wenckebach'],
      },
      {
        heading: 'Intermittent AV block',
        body: [
          'Mobitz I, or Wenckebach, shows progressive PR lengthening from beat to beat until a P wave fails to conduct and the expected QRS is dropped. After the pause, the PR resets shorter and the cycle repeats.',
          'Mobitz II shows a fixed PR interval in conducted beats, followed by sudden unexpected non-conducted P waves and dropped QRS complexes.',
          'Mobitz II often reflects block within or below the His bundle, so conducted QRS complexes may be wide. Treat it as clinically important even if the patient is temporarily stable.',
          'When evaluating intermittent block, compare conducted PR intervals only. Hidden PACs, artifact, and poor P-wave visibility can mimic dropped conduction.',
        ],
        figures: ['pr-mobitz-ii-complete-block'],
      },
      {
        heading: '2:1 and complete AV block',
        body: [
          'In 2:1 AV block, every other P wave is non-conducted, creating a regular 2 P waves to 1 QRS pattern.',
          'A 2:1 block cannot be confidently labeled Mobitz I or Mobitz II from that pattern alone because there are no two consecutive conducted PR intervals to compare.',
          'Continue rhythm monitoring when possible. If the ratio changes to 3:2 or 4:3, PR behavior may reveal whether the mechanism is Wenckebach-like or fixed/infranodal.',
          'Third-degree AV block has complete AV dissociation. P-P intervals are regular, R-R intervals are regular, the atrial rate is usually faster than the ventricular escape rate, and the PR interval is variable and not physiologically measurable.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'PR analysis tells the clinician whether atrial impulses are reaching the ventricles normally, slowly, intermittently, or independently.',
          'The pattern of PR change is often more important than one isolated number because it separates first-degree delay, Wenckebach, Mobitz II, 2:1 block, and complete heart block.',
        ],
      },
    ],
    redFlags: ['Mobitz II, high-grade AV block, 2:1 block with symptoms, complete heart block, syncope, hypotension, or a very slow escape rhythm need urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
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
    subtitle: 'Use rate, regularity, P-wave morphology, AV conduction, and PR behavior to name the rhythm.',
    sections: [
      {
        heading: 'The five rhythm pillars',
        body: [
          'Rhythm synthesis should not start with a label. It starts by combining discrete findings from the first three steps.',
          'Classify ventricular regularity as regular, irregularly irregular, or regularly irregular with grouped beating or pauses.',
          'Compare atrial and ventricular activity: 1:1 conduction, more P waves than QRS complexes, or complete AV dissociation.',
          'Classify P-wave morphology as sinus, ectopic or retrograde, chaotic/flutter-like, absent, variable, or paced.',
          'Classify PR behavior as constant, shortened, prolonged, progressively lengthening, variable, or unmeasurable.',
          'Use rate ranges to locate likely pacemaker origin: sinus 60-100 bpm, junctional 40-60 bpm, and ventricular or Purkinje escape about 20-40 bpm.',
        ],
        figures: ['rhythm-decision-tree'],
      },
      {
        heading: 'Regular 1:1 rhythms',
        body: [
          'Normal sinus rhythm requires regular ventricular rhythm, 1:1 P-to-QRS conduction, upright uniform sinus P waves, constant PR of 0.12-0.20 seconds, and rate 60-100 bpm.',
          'Sinus bradycardia keeps the same sinus P-wave and PR criteria but has a ventricular rate below 60 bpm.',
          'Sinus tachycardia keeps the same sinus P-wave and PR criteria but has a ventricular rate above 100 bpm, commonly up to about 180 bpm in adults.',
          'Sinus rhythm with first-degree AV block has sinus P waves and 1:1 conduction, but the PR interval is constant and longer than 0.20 seconds.',
          'Junctional escape rhythm usually has a rate of 40-60 bpm with retrograde P waves inverted in II, III, and aVF, or P waves hidden in or after the QRS.',
          'Accelerated junctional rhythm uses the same retrograde P-wave logic at 61-100 bpm. Junctional tachycardia is usually above 100 bpm.',
        ],
      },
      {
        heading: 'Irregular rhythms without grouped beating',
        body: [
          'Atrial fibrillation has irregularly irregular R-R intervals, absent discrete P waves, chaotic fibrillatory baseline activity, and an unmeasurable PR interval.',
          'Wandering atrial pacemaker is irregular with at least three distinct P-wave shapes in one lead, variable PR intervals, and a rate below 100 bpm.',
          'Multifocal atrial tachycardia has at least three P-wave shapes, variable PR and R-R intervals, visible isoelectric baseline between P waves, and rate above 100 bpm.',
          'Sinus arrhythmia has irregularity that is often phasic with respiration, but P-wave morphology remains upright and uniform and PR intervals stay constant.',
        ],
        figures: ['rhythm-synthesis-dashboard'],
      },
      {
        heading: 'AV block pathways',
        body: [
          'When atrial rate is faster than ventricular rate and there are more P waves than QRS complexes, rhythm synthesis should move into AV block logic.',
          'Mobitz I shows grouped beating with progressive PR lengthening until a P wave is not conducted and the QRS drops; after the pause, the PR resets shorter.',
          'Mobitz II shows fixed PR intervals in conducted beats with sudden non-conducted P waves and dropped QRS complexes.',
          'A fixed 2:1 P-to-QRS pattern should be labeled 2:1 AV block rather than Mobitz I or Mobitz II because there are no consecutive conducted PR intervals to compare.',
          'Complete heart block has regular P-P intervals, regular R-R intervals, no physiologic P-to-QRS relationship, and a variable unmeasurable PR interval. A narrow QRS suggests junctional escape; a wide QRS suggests ventricular escape.',
        ],
        figures: ['rhythm-av-association'],
      },
      {
        heading: 'Pauses and sinus node patterns',
        body: [
          'A sudden prolonged pause with otherwise sinus cycles can represent sinoatrial block or sinus arrest.',
          'Sinoatrial block is suggested when the pause duration is an exact multiple of the underlying P-P interval and sinus activity resumes on time.',
          'Sinus arrest is suggested when the pause is not an exact multiple of the baseline sinus cycle and sinus activity restarts late.',
          'Blocked PACs can mimic pauses or AV block, so inspect the preceding T wave for a hidden premature P wave before assigning a conduction diagnosis.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'A rhythm label should be traceable back to measurable evidence: regularity, atrial activity, PR behavior, conduction ratio, rate, and QRS width.',
          'Structured rhythm synthesis helps the app explain uncertainty instead of overcalling diagnoses when P waves are hidden, the strip is short, or the conduction ratio is indeterminate.',
        ],
      },
    ],
    redFlags: ['Wide-complex tachycardia, Mobitz II, complete heart block, rapid atrial fibrillation/flutter with instability, or symptomatic long pauses need urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
  },
  'step.qrs': {
    title: 'QRS complex',
    subtitle: 'Ventricular depolarization, conduction, voltage, and wide-complex safety checks.',
    sections: [
      {
        heading: 'What the QRS represents',
        body: [
          'The QRS complex represents rapid ventricular depolarization through the His-Purkinje system and ventricular myocardium.',
          'Because ventricular muscle mass is much larger than atrial muscle mass, the QRS is normally much larger than the P wave.',
          'Ventricular repolarization begins during the QRS, but it is hidden electrically by the much larger depolarization signal. The visible repolarization pattern is assessed later in the ST segment and T wave.',
          'Assess QRS duration, amplitude, deflection pattern, lead distribution, transition zone, and whether morphology suggests supraventricular conduction, bundle branch block, pacing, pre-excitation, or ventricular origin.',
        ],
      },
      {
        heading: 'How to measure it',
        body: [
          'Measure QRS duration in the lead where the complex is widest and where the onset and offset are clear.',
          'Measure horizontally from the first QRS deflection, whether Q, R, or QS, to the J point where the QRS ends and the ST segment begins.',
          'Normal adult duration is usually 0.06-0.10 seconds, or 1.5-2.5 small boxes. Some references allow up to about 0.11 seconds.',
          'A duration of 0.11-0.12 seconds is borderline or incomplete conduction delay. A QRS of 0.12 seconds or more, or 3 small boxes, is widened.',
          'Measure voltage vertically from baseline to the highest peak or deepest valley. Normal QRS amplitude varies by lead, age, sex, body habitus, and chest wall thickness.',
        ],
        figures: ['qrs-measurement-calibration'],
      },
      {
        heading: 'QRS naming and transition',
        body: [
          'Use uppercase Q, R, and S for normal or high-amplitude deflections of 5 mm or more. Use lowercase q, r, and s for low-amplitude deflections below 5 mm.',
          'R prime means a second positive deflection within the same QRS complex.',
          'A QS complex is entirely negative without a positive R wave. In the right clinical and lead-territory context, QS complexes can suggest transmural necrosis, but they also have mimics.',
          'Limb and lateral precordial leads often become predominantly positive as ventricular depolarization moves toward the left and inferior heart surfaces. aVR and V1-V3 are often predominantly negative.',
          'The precordial transition zone is where R-wave amplitude begins to exceed S-wave amplitude, usually around V3 or V4. Transition in V2 is early; transition delayed to V5 or V6 is late.',
        ],
        figures: ['qrs-r-wave-progression'],
      },
      {
        heading: 'Bundle branch blocks',
        body: [
          'Bundle branch block means ventricular depolarization is delayed down the right or left bundle, so the ventricles activate sequentially rather than simultaneously.',
          'Complete bundle branch block generally requires QRS duration of at least 0.12 seconds and a supraventricular source; exclude ventricular paced beats and ventricular escape rhythms before labeling BBB.',
          'RBBB classically shows rsR or rSR prime morphology in V1 and a wide slurred S wave in lateral leads such as I, V5, and V6.',
          'RBBB can be associated with coronary disease, anterior MI, cardiomyopathy, cor pulmonale, pulmonary embolism, or right-sided strain patterns.',
          'LBBB classically shows broad, tall, notched or slurred R waves in I, aVL, V5, and V6 without initial lateral Q waves, with deep negative rS or QS complexes in V1-V3.',
          'LBBB often has ST-T discordance, where the ST segment and T wave move opposite the dominant QRS force. New LBBB with ischemic chest pain needs urgent clinical interpretation.',
        ],
        figures: ['qrs-bbb-v1-patterns'],
      },
      {
        heading: 'Ventricular hypertrophy',
        body: [
          'Ventricular hypertrophy increases muscle mass, shifts the mean QRS vector toward the enlarged ventricle, and can create high surface voltages.',
          'RVH can produce tall R waves in V1-V3, deep S waves in I, aVL, V5, and V6, right-axis deviation, and right atrial abnormality clues.',
          'RVH is associated with pulmonary hypertension, severe COPD, pulmonary stenosis, congenital heart disease, and other right-sided pressure or volume loads.',
          'LVH can produce tall R waves in I, aVL, V5, and V6 with deep S waves in V1 and V2. Lateral ST depression and asymmetric T-wave inversion may represent LVH strain.',
          'LVH is associated with systemic hypertension, hypertrophic cardiomyopathy, aortic stenosis, and aortic insufficiency. Voltage criteria are supportive and should be interpreted with body habitus and lead placement.',
        ],
        figures: ['qrs-ventricular-hypertrophy'],
      },
      {
        heading: 'Low voltage and ventricular origin',
        body: [
          'Low-voltage QRS is commonly defined as total QRS amplitude below 5 mm in all six limb leads. It suggests electrical dampening between the myocardium and skin electrodes.',
          'Common low-voltage contexts include severe COPD or emphysema, obesity, myxedema, pericardial effusion, and pleural effusion.',
          'Ventricular-origin beats arise below the His bifurcation and spread slowly cell to cell rather than through the rapid His-Purkinje network.',
          'PVCs, ventricular tachycardia, accelerated idioventricular rhythm, and ventricular escape rhythms are usually wide, bizarre, and notched, with ST segments and T waves directed opposite the main QRS vector.',
          'If no P wave precedes a wide complex, consider ventricular origin, paced rhythm, or pre-excitation depending on the broader rhythm context.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'QRS morphology changes how later ST, T-wave, QT, axis, and infarct findings should be interpreted.',
          'A wide QRS can reflect BBB, ventricular rhythm, pacing, pre-excitation, hyperkalemia, sodium-channel blocker toxicity, or nonspecific intraventricular conduction delay.',
          'Wide-complex tachycardia should be approached as ventricular tachycardia until the ECG and clinical context prove otherwise.',
        ],
      },
    ],
    redFlags: ['Wide-complex tachycardia, new LBBB with ischemic symptoms, severe hyperkalemia pattern, sodium-channel blocker toxicity, ventricular escape rhythm, or suspected large pericardial effusion with low voltage should be escalated clinically.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
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
        heading: 'What the QRS axis represents',
        body: [
          'The QRS electrical axis is the average direction of ventricular depolarization projected onto the frontal plane.',
          'In a typical adult heart, ventricular depolarization travels downward and leftward because the left ventricle has dominant muscle mass.',
          'Pathology can shift the vector away from electrically silent or damaged tissue and toward hypertrophied or delayed regions.',
          'Axis interpretation should be integrated with Step 5 QRS morphology and Step 7 Q-wave territory instead of treated as an isolated number.',
        ],
      },
      {
        heading: 'Hexaxial reference system',
        body: [
          'The six limb leads form the frontal-plane hexaxial system: I, II, III, aVR, aVL, and aVF.',
          'Lead I defines 0 degrees at the positive pole. The inferior hemisphere is positive degrees and the superior hemisphere is negative degrees.',
          'Lead I is perpendicular to aVF. Lead II at +60 degrees is perpendicular to aVL at -30 degrees. Lead III at +120 degrees is perpendicular to aVR at -150 degrees.',
          'Normal adult QRS axis is commonly -30 to +90 degrees. Left axis deviation is -30 to -90 degrees. Right axis deviation is +90 to +180 degrees. Extreme or northwest axis is between -90 degrees and +/-180 degrees.',
          'Normal variants matter: neonates and infants often have a rightward axis, while pregnancy and older age can shift the axis leftward without necessarily indicating acute disease.',
        ],
        figures: ['axis-hexaxial-wheel', 'axis-quadrants'],
      },
      {
        heading: 'Quadrant method',
        body: [
          'Use lead I for left-right direction and aVF for superior-inferior direction.',
          'Lead I positive and aVF positive indicates normal axis.',
          'Lead I positive and aVF negative suggests possible left axis deviation, but check lead II because normal adult axis can extend to -30 degrees.',
          'If lead II is positive, the axis is likely between 0 and -30 degrees and can be physiologic. If lead II is negative, the axis is more negative than -30 degrees and supports pathological left axis deviation.',
          'Lead I negative and aVF positive indicates right axis deviation. Lead I negative and aVF negative indicates extreme or northwest axis.',
        ],
        figures: ['axis-quadrant-method', 'axis-lead-ii-tiebreaker'],
      },
      {
        heading: 'Degree method',
        body: [
          'Find the limb lead with the smallest or most equiphasic QRS complex, where positive and negative deflections are nearly equal.',
          'Identify the lead axis perpendicular to that equiphasic lead on the hexaxial wheel.',
          'Inspect the QRS polarity in the perpendicular lead. If it is positive, the mean axis points toward that lead. If it is negative, the mean axis points 180 degrees away.',
          'Example: if lead III is equiphasic, the perpendicular lead is aVR. If aVR is negative, the mean vector points away from aVR at -150 degrees and toward +30 degrees, which is normal.',
        ],
        figures: ['axis-degree-method'],
      },
      {
        heading: 'Left axis deviation differential',
        body: [
          'Left anterior fascicular block is suggested when LAD occurs with normal or only mildly prolonged QRS duration and severe LVH is not present.',
          'LVH can shift the QRS vector leftward and superiorly; correlate LAD with Step 5 voltage criteria and LVH strain evidence.',
          'Inferior myocardial infarction can shift forces away from inferior leads II, III, and aVF. Correlate LAD with pathological Q waves in contiguous inferior leads from Step 7.',
          'Other contributors include paced rhythm, conduction disease, ventricular ectopy, and technical lead issues.',
        ],
        figures: ['axis-vector-shifts'],
      },
      {
        heading: 'Right and extreme axis differential',
        body: [
          'Right ventricular hypertrophy can pull the QRS vector rightward. Correlate RAD with dominant R waves in V1, right atrial abnormality, and pulmonary or right-sided pressure load context.',
          'Left posterior fascicular block can cause RAD after other causes such as RVH and lateral MI are excluded.',
          'Lateral myocardial infarction can shift forces away from lateral leads I, aVL, V5, and V6. Correlate RAD with pathological Q waves in contiguous lateral leads.',
          'Extreme axis is especially concerning in wide-complex tachycardia because it supports ventricular origin.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'Axis converts limb-lead polarity into a directional clue that can support fascicular block, ventricular hypertrophy, infarct territory, ventricular rhythm, or lead misplacement.',
          'The axis should trigger targeted cross-checks rather than a standalone diagnosis: QRS width and morphology, voltage criteria, Q waves, and clinical context decide the final meaning.',
        ],
      },
    ],
    redFlags: ['Extreme axis in wide-complex tachycardia, new axis deviation with ischemic symptoms, or axis deviation paired with suspected infarction or pulmonary embolism needs urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
  },
  'step.qWaves': {
    title: 'Q waves',
    subtitle: 'Look for pathological Q waves and pseudo-infarct mimics.',
    sections: [
      {
        heading: 'What a Q wave represents',
        body: [
          'A Q wave is the first negative deflection of the QRS complex after the P wave.',
          'Small normal Q waves often reflect septal depolarization, which usually travels from left to right and posterior to anterior.',
          'Measure from the point where the Q wave leaves the isoelectric baseline downward to the point where it returns to baseline or transitions into the next QRS deflection.',
          'Use the TP segment as the baseline reference when available, and always interpret Q waves by lead territory rather than as isolated single-lead findings.',
        ],
        figures: ['qwave-electrical-window'],
      },
      {
        heading: 'Normal variants',
        body: [
          'Lead aVR commonly has a deep Q wave or QS complex because of its viewing angle. Do not use aVR to diagnose pathological Q waves.',
          'Small septal Q waves can be normal in limb and lateral leads when narrow and shallow.',
          'Lead III can show prominent or variable Q waves in healthy adults, so confirm inferior patterns in contiguous leads II, III, and aVF.',
          'In children, Q waves can be physiological in II, III, aVF, V5, and V6. Q waves outside expected pediatric patterns should prompt clinical correlation.',
        ],
      },
      {
        heading: 'Pathological criteria',
        body: [
          'A pathological Q wave suggests electrically silent myocardium from transmural necrosis or scar, creating a window through which forces move away from the affected territory.',
          'A Q wave is concerning when duration is 0.04 seconds or more, which is at least 1 small box. Some limb-lead criteria use more than 0.03 seconds.',
          'A Q wave is also concerning when depth is greater than 4 mm, or when its depth is at least 25-33% of the following R-wave amplitude in the same lead.',
          'Pathological Q waves often develop hours to days after myocardial infarction. Unlike ST elevation or T-wave inversion, they can persist indefinitely as a scar marker.',
        ],
        figures: ['qwave-criteria'],
      },
      {
        heading: 'Territory localization',
        body: [
          'Clinically meaningful Q waves should appear in at least two anatomically contiguous leads, excluding aVR.',
          'Septal territory uses V1-V2 and is usually supplied by septal branches of the LAD.',
          'Anterior territory uses V3-V4, often V2-V4, and is usually supplied by the LAD. Poor R-wave progression may accompany anterior infarct patterns.',
          'Lateral territory uses I, aVL, V5, and V6 and may reflect left circumflex or diagonal LAD territory.',
          'Inferior territory uses II, III, and aVF and may reflect RCA or distal circumflex territory.',
          'Right ventricular infarction uses right-sided leads such as V4R-V6R. Posterior infarction may appear indirectly as tall broad R waves with upright T waves and ST depression in V1-V3, and can be confirmed with V7-V9.',
        ],
        figures: ['qwave-territory-map'],
      },
      {
        heading: 'Pseudo-infarct pitfalls',
        body: [
          'WPW can create a pseudo-infarct pattern when a negatively directed delta wave mimics a pathological Q wave, especially in inferior or lateral leads.',
          'If suspected Q waves occur with PR interval below 0.12 seconds, widened QRS, and delta wave evidence, flag pre-excitation before labeling myocardial infarction.',
          'LBBB can produce deep wide QS complexes in V1-V3 and severely limits ECG-based MI localization. Use clinical context, serial ECGs, and biomarkers when ischemia is suspected.',
          'Other mimics include LVH, hypertrophic cardiomyopathy, lead misplacement, ventricular pacing, and normal variants.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'Q waves help distinguish permanent myocardial scar from transient ischemia or acute injury patterns, but they are not a standalone diagnosis.',
          'Reliable interpretation requires width, depth, contiguous lead grouping, expected normal variants, QRS context from Step 5, PR/pre-excitation context from Step 3, and the clinical story.',
        ],
      },
    ],
    redFlags: ['New pathological Q waves with ischemic symptoms, Q waves plus active ST changes, posterior MI pattern, or suspected infarction in LBBB/pre-excitation context needs urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
  },
  'step.stSegment': {
    title: 'ST segment',
    subtitle: 'Ventricular plateau phase relative to the isoelectric baseline.',
    sections: [
      {
        heading: 'What the ST segment represents',
        body: [
          'The ST segment is the interval between the end of ventricular depolarization and the beginning of ventricular repolarization.',
          'It starts at the J point, where the QRS complex ends, and extends to the onset of the T wave.',
          'ST analysis helps identify acute myocardial injury, localize ischemia, and distinguish ischemic patterns from metabolic, structural, or conduction-related mimics.',
          'Always interpret ST findings alongside symptoms, QRS morphology, prior ECGs, serial change, and contiguous lead distribution.',
        ],
      },
      {
        heading: 'Baseline and measurement',
        body: [
          'Use the TP segment as the primary isoelectric baseline because it represents electrical silence between the end of the T wave and the next P wave.',
          'When the TP segment is not visible, especially at faster heart rates, use the PR segment as the practical baseline reference.',
          'Measure ST elevation or depression vertically in millimeters at the J point relative to the chosen baseline.',
          'A normal ST segment is usually isoelectric, though small physiologic variation can occur. Mild variation around -0.5 mm to +1 mm may be normal in some precordial leads.',
        ],
        figures: ['st-measurement-landmarks'],
      },
      {
        heading: 'ST elevation and injury',
        body: [
          'ST elevation suggests acute active myocardial injury, but not all ST elevation is STEMI. It must be interpreted by threshold, lead territory, morphology, and clinical context.',
          'For V2-V3, clinically significant ST elevation thresholds are higher: at least 2.0 mm in men age 40 or older and at least 1.5 mm in women.',
          'For other standard leads, new or presumed-new J-point elevation of at least 1.0 mm in two or more contiguous leads is concerning.',
          'ST elevation becomes more meaningful when it appears in anatomically contiguous leads rather than a single isolated lead.',
        ],
        figures: ['st-elevation-thresholds'],
      },
      {
        heading: 'Localization and reciprocal change',
        body: [
          'Septal injury localizes to V1-V2 and usually reflects LAD septal branches.',
          'Anterior injury localizes to V3-V4, often V2-V4, and usually reflects LAD territory.',
          'Lateral injury localizes to I, aVL, V5, and V6 and may reflect circumflex or diagonal LAD territory.',
          'Inferior injury localizes to II, III, and aVF and may reflect RCA or distal circumflex territory.',
          'Right ventricular injury uses right-sided leads such as V4R-V6R and often reflects proximal RCA disease.',
          'Posterior injury is often missed on a standard 12-lead ECG. ST depression in V1-V3 can be reciprocal posterior injury and should prompt posterior leads V7-V9 when clinically suspected.',
          'Reciprocal depression strengthens concern for acute coronary occlusion, such as inferior ST elevation with depression in I/aVL or lateral ST elevation with inferior depression.',
        ],
      },
      {
        heading: 'ST depression and ischemia',
        body: [
          'ST depression suggests myocardial ischemia or reciprocal change when it is present in two or more contiguous leads.',
          'Depression of 0.5 mm or more below baseline at the J point is a commonly used ischemia threshold.',
          'Horizontal or downsloping ST depression is more specific for ischemia than upsloping depression.',
          'A scooped, curved, asymmetric ST depression can be a digoxin effect rather than acute coronary syndrome, especially when the medication history supports it.',
        ],
        figures: ['st-depression-digoxin'],
      },
      {
        heading: 'Critical mimics',
        body: [
          'Acute pericarditis can produce diffuse flat or concave ST elevation across many territories rather than a regional contiguous-lead pattern. PR depression and pleuritic pain relieved by sitting forward support this possibility.',
          'LBBB, ventricular rhythms, and ventricular paced beats cause secondary ST-T discordance. ST segments often move opposite the dominant terminal QRS force, so standard STEMI thresholds are unreliable without specialized criteria.',
          'LVH can produce ST elevation in V1-V3 and lateral ST depression or T-wave inversion in I, aVL, V5, and V6. Correlate with voltage criteria and troponins when ischemia is possible.',
          'Hypocalcemia can lengthen the ST segment and increase QT duration, so prolonged ST should trigger QT/electrolyte correlation.',
        ],
        figures: ['st-lbbb-discordance'],
      },
      {
        heading: 'Why it matters',
        body: [
          'ST deviation can represent reversible injury or ischemia, so timely recognition can change outcomes.',
          'The safest interpretation combines J-point measurement, morphology, contiguous lead territory, reciprocal changes, QRS context, and the patient presentation.',
        ],
      },
    ],
    redFlags: ['Regional ST elevation, horizontal or downsloping ST depression, reciprocal change, posterior OMI pattern, right ventricular MI pattern, or STEMI-equivalent features need urgent clinical correlation.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
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
        heading: 'What the T wave represents',
        body: [
          'The T wave represents ventricular repolarization, the recovery phase of the ventricular myocardium.',
          'Unlike intervals such as PR, QRS, or QT, T-wave duration is not routinely measured in standard clinical ECG interpretation.',
          'Assess T-wave location, amplitude, configuration, deflection, territory, and whether the morphology is new or dynamic compared with prior ECGs.',
          'The T wave immediately follows the QRS complex, usually after the S wave and ST segment.',
        ],
      },
      {
        heading: 'Normal morphology and deflection',
        body: [
          'A normal T wave is smooth and slightly asymmetric. The initial upslope is gradual, and the terminal downslope returns to baseline more steeply.',
          'T waves are normally upright in I, II, and V3-V6, consistently inverted in aVR, and variable in III, aVL, aVF, and V1.',
          'Lead II often has the tallest physiological limb-lead T wave. T-wave amplitude is normally at least about 0.5 mm in I, II, and III and can be up to about 10 mm in precordial leads.',
          'In normally conducted beats, T-wave direction is usually concordant with the dominant QRS direction because depolarization and repolarization move through the ventricular wall in opposite physical directions but produce similar surface polarity.',
        ],
        figures: ['twave-normal-anatomy'],
      },
      {
        heading: 'Electrical vulnerability',
        body: [
          'The early T wave overlaps with the absolute refractory period, when ventricular myocardium cannot be depolarized by another stimulus.',
          'The peak and downslope of the T wave mark the relative refractory period, when cells are partially repolarized and vulnerable to premature stimulation.',
          'An R-on-T PVC occurs when a premature ventricular complex falls on the vulnerable downslope of the prior T wave.',
          'R-on-T can trigger polymorphic ventricular tachycardia, torsades de pointes, or ventricular fibrillation, especially when ischemia or QT prolongation is present.',
        ],
      },
      {
        heading: 'T-wave inversion',
        body: [
          'T-wave inversion is concerning when it appears in leads where T waves are normally upright, especially I, II, and V3-V6.',
          'Ischemic T-wave inversion is often symmetric, inverted, and present in anatomically contiguous leads.',
          'Deep or giant T-wave inversion can occur with acute CNS events such as subarachnoid hemorrhage, raised intracranial pressure, or major stroke.',
          'Drug effects, including tricyclic antidepressants and phenothiazines, can also distort repolarization and produce deep inversion.',
          'Always distinguish primary T-wave inversion from expected secondary inversion caused by BBB, pacing, ventricular rhythms, or LVH strain.',
        ],
        figures: ['twave-inversions'],
      },
      {
        heading: 'Tall, peaked, and hyperacute T waves',
        body: [
          'Hyperkalemia classically produces tall, narrow, pointed, tented T waves, often across multiple leads.',
          'Hyperacute ischemic T waves are usually broad-based, bulky, and symmetric rather than narrow and tented.',
          'A hyperacute MI pattern can appear before obvious ST elevation and may exceed 50% of the preceding R-wave height in the affected territory.',
          'Compare with prior ECGs when possible because tall T waves can also be normal variants in some patients.',
        ],
        figures: ['twave-hyperkalemia-hyperacute'],
      },
      {
        heading: 'Notched, flat, and low-amplitude T waves',
        body: [
          'A notched or bumpy T wave can represent a hidden atrial depolarization, such as a PAC buried in the preceding T wave.',
          'Acute pericarditis and other inflammatory contexts can also create pointed or notched T-wave appearances, depending on phase and lead distribution.',
          'Flat or low-amplitude T waves can occur with hypokalemia, hypomagnesemia, nonspecific repolarization change, or early ischemia.',
          'A practical low T-wave clue is amplitude less than about 10% of the preceding R wave in the same lead, especially when the change is new or regional.',
        ],
        figures: ['twave-notched'],
      },
      {
        heading: 'Secondary ST-T discordance',
        body: [
          'When ventricular depolarization is abnormal, repolarization is usually abnormal too.',
          'Bundle branch block, ventricular pacing, and ectopic ventricular beats can produce secondary ST-T changes that deflect opposite the dominant terminal QRS vector.',
          'If the terminal QRS force is negative, secondary ST elevation and upright T waves may be expected. If the terminal QRS force is positive, secondary ST depression and T-wave inversion may be expected.',
          'Do not overcall ischemia from discordant ST-T changes without checking the QRS pattern and using appropriate clinical criteria.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'T waves can reveal ischemia, electrolyte disturbance, CNS catastrophe, drug effects, hidden atrial activity, or expected secondary repolarization changes.',
          'The safest interpretation uses lead expectations, morphology, territory, QRS context, ST/QT findings, symptoms, electrolytes, and serial ECG change.',
        ],
      },
    ],
    redFlags: ['Hyperacute regional T waves, tall tented T waves with possible hyperkalemia, deep symmetric inversion with ischemic symptoms, R-on-T PVCs, or giant cerebral T waves need urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
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
        heading: 'What the QT interval represents',
        body: [
          'The QT interval measures the total duration of ventricular electrical activity: ventricular depolarization plus ventricular repolarization.',
          'Because QT duration changes with heart rate, the raw QT must be interpreted with a corrected QT, or QTc, to assess repolarization safety.',
          'QT assessment helps identify risk for dangerous ventricular tachyarrhythmias, especially torsades de pointes.',
        ],
      },
      {
        heading: 'How to measure it',
        body: [
          'Measure horizontally from the onset of the QRS complex, where the first Q or R deflection leaves baseline, to the end of the T wave where its downslope returns to the isoelectric line.',
          'Choose a lead with a clearly defined T-wave ending. V2 or V3 often show a long and visible QT, but use the clearest lead in the tracing.',
          'For serial comparison, use the same lead whenever possible so changes reflect physiology rather than lead selection.',
          'Count small horizontal boxes and multiply by 0.04 seconds, or 40 ms, to obtain the raw QT interval.',
          'In regular rhythms, use the half-R-R rule as a screen: the QT should usually be less than half the preceding R-R interval. If it is longer, treat prolongation as possible until QTc confirms the risk.',
        ],
        figures: ['qt-measurement-landmarks'],
      },
      {
        heading: 'QTc and rate correction',
        body: [
          'The QT interval shortens as heart rate rises and lengthens as heart rate slows.',
          'QTc corrects the QT interval to a standardized heart rate so repolarization can be compared across different rates.',
          'Bazett correction is widely used clinically, but it can overcorrect at heart rates above 100 bpm and undercorrect at rates below 60 bpm.',
          'Adult reference ranges often use QTc below 450 ms as normal for men and below 460 ms as normal for women. A QTc at or above those values is prolonged.',
          'A QTc of 390 ms or less is abnormally short. Pediatric intervals vary by age and should not be judged by adult cutoffs alone.',
        ],
        figures: ['qt-rate-correction'],
      },
      {
        heading: 'Prolonged QTc',
        body: [
          'Prolonged QTc means ventricular repolarization is delayed, lengthening the vulnerable period for early afterdepolarizations and reentry.',
          'A QTc above 500 ms is a major risk threshold for torsades de pointes, a polymorphic ventricular tachycardia whose QRS complexes appear to twist around the baseline.',
          'Congenital long QT syndrome is an inherited channelopathy. Ask about family history of sudden cardiac death, unexplained syncope, or sudden infant death syndrome when clinically relevant.',
          'Drug causes include class Ia antiarrhythmics such as quinidine and procainamide, class III antiarrhythmics such as sotalol, amiodarone, ibutilide, and dofetilide, and non-cardiac drugs such as tricyclic antidepressants, phenothiazines, methadone, certain fluoroquinolones, azole antifungals, and other QT-prolonging agents.',
          'Electrolyte causes include hypokalemia and hypocalcemia. Hypocalcemia prolongs the ST segment itself, lengthening the total QT interval.',
          'Ischemia, infarction, bradycardia, and acute neurologic events such as subarachnoid hemorrhage or stroke can also prolong QTc.',
        ],
        figures: ['qt-prolongation-torsades'],
      },
      {
        heading: 'Short QTc',
        body: [
          'A short QTc indicates accelerated ventricular repolarization and is less common than QT prolongation, but can be diagnostically important.',
          'Hypercalcemia classically shortens the ST segment, pulling the T wave closer to the QRS complex and reducing total QT duration.',
          'Digoxin effect or toxicity can shorten QT while producing characteristic scooped ST depression, sometimes called the digoxin effect.',
          'Congenital short-QT syndrome, hyperkalemia, and acidosis can also shorten QT depending on the clinical context.',
        ],
        figures: ['qt-shortening-causes'],
      },
      {
        heading: 'Why it matters',
        body: [
          'QTc is a repolarization safety check, not just another measurement. Marked prolongation can turn a premature beat into torsades or ventricular fibrillation.',
          'Interpret QTc with QRS width, heart rate, rhythm regularity, drugs, electrolytes, ischemia, neurologic context, and serial ECG change.',
        ],
      },
    ],
    redFlags: ['QTc above 500 ms, syncope with QT prolongation, torsades, R-on-T PVCs, high-risk QT-prolonging medication exposure, or major electrolyte disturbance needs urgent review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
  },
  'step.lateWaves': {
    title: 'U waves and late deflections',
    subtitle: 'Identify true U waves, separate them from T-wave mimics, and flag dangerous late deflections.',
    sections: [
      {
        heading: 'Late-wave scan',
        body: [
          'Normal R-wave progression usually increases from V1 toward V5, with a transition zone around V3-V4.',
          'After checking progression, inspect small deflections after the T wave and at the terminal QRS/J point. U waves, J waves, and epsilon waves have different clinical meanings and should not be grouped together.',
        ],
      },
      {
        heading: 'What the U wave represents',
        body: [
          'The U wave is a small deflection immediately after the T wave and before the next P wave. It represents the final phase of ventricular recovery.',
          'Classic teaching links the U wave to late repolarization of Purkinje fibers. Contemporary explanations also include delayed repolarization of ventricular regions with late mechanical relaxation and local variation in ventricular action potential duration.',
          'Unlike PR, QRS, QT, or ST measurements, U-wave amplitude and duration are not routinely measured as exact grid intervals. The key assessment is morphology, lead distribution, and whether the deflection is normal, prominent, or inverted.',
        ],
      },
      {
        heading: 'Normal U-wave appearance',
        body: [
          'A normal U wave is tiny, usually less than 1 mm high or less than 0.1 mV on a standard calibrated ECG.',
          'It is easiest to see at slower heart rates and is often impossible to identify once the heart rate is above about 95 bpm.',
          'Normal U waves are usually most visible in V2 and V3. They are smooth, rounded, upright, and typically point in the same direction as the preceding T wave.',
        ],
      },
      {
        heading: 'Prominent U waves',
        body: [
          'A prominent U wave is abnormally tall and may even exceed the height of the preceding T wave in the same lead.',
          'Hypokalemia is the classic cause. As potassium falls, T waves often flatten while U waves become progressively more obvious.',
          'Other important causes include digoxin therapy or toxicity, hypercalcemia, and QT-prolonging medicines such as class Ia antiarrhythmics, class III antiarrhythmics, and phenothiazines.',
        ],
        figures: ['uwave-prominent-hypokalemia'],
      },
      {
        heading: 'Inverted U waves',
        body: [
          'A normal U wave usually follows the same direction as the T wave. An inverted U wave is pathological, especially when seen in V2-V5.',
          'For decision support, inverted U waves in V2-V5 should trigger a high-priority warning for myocardial ischemia or severe systemic hypertension until clinical review proves otherwise.',
        ],
        figures: ['uwave-inverted-ischemia'],
      },
      {
        heading: 'U wave versus notched T wave',
        body: [
          'A true U wave is a separate deflection after the T wave, with a brief return to the isoelectric baseline between the T wave and U wave.',
          'A notched T wave is a double-peaked T wave where the second peak is part of the same T complex, without a clean baseline separation.',
          'Notched T-wave mimics can appear with acute pericarditis or when hidden atrial depolarization creates apparent extra peaks in premature complexes.',
        ],
      },
      {
        heading: 'Other late-wave clues',
        body: [
          'Poor R-wave progression can reflect prior anterior MI, LVH, COPD, lead misplacement, LBBB, or a normal variant.',
          'Epsilon waves raise concern for arrhythmogenic right ventricular cardiomyopathy when the morphology and clinical context fit.',
          'J-point/J-wave patterns may be benign early repolarization, hypothermia, Brugada pattern, or ischemic context depending on morphology and leads.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'U waves are small, but they can point toward electrolyte disturbance, drug effect, ischemia, or severe hypertension.',
          'Teaching students to separate a true U wave from a notched T wave or hidden P wave prevents false QT/QU interpretation and improves the data sent to the decision-support engine.',
        ],
      },
    ],
    redFlags: ['Inverted U waves in V2-V5, prominent U waves with arrhythmia symptoms, suspected severe hypokalemia, digoxin toxicity, QT-prolonging drug exposure, ischemic symptoms, or severe hypertension need urgent clinician review.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
  },
  'step.finalReview': {
    title: 'Final review and cross-validation',
    subtitle: 'Verify tracing quality, integrate patient context, and catch logic conflicts before AI review.',
    sections: [
      {
        heading: 'Purpose of the final review',
        body: [
          'Step 12 is the safety filter for the 12-step ECG protocol. It turns separate measurements into a high-fidelity clinical interpretation before the structured payload is sent to decision support.',
          'The clinician should confirm technical quality, add patient metadata, compare related findings, and preserve uncertainty where the ECG alone cannot answer the clinical question.',
          'This step prevents garbage-in, garbage-out interpretation by forcing the app to ask whether the tracing, context, and internal logic all make sense together.',
        ],
        figures: ['final-workflow-map'],
      },
      {
        heading: 'Calibration and standardization',
        body: [
          'Inspect the standardization marker, usually at the start of the strip. A standard 1 mV signal should create a 10 mm vertical deflection, equal to 10 small boxes.',
          'If complexes are very high voltage, the ECG may be recorded at half-standard calibration, where 1 mV equals 5 mm. If complexes are very low voltage, it may be recorded at double-standard calibration, where 1 mV equals 20 mm.',
          'Calibration changes the meaning of every voltage-based conclusion. Chamber hypertrophy, low-voltage calls, ST amplitude, and U-wave amplitude should be interpreted only after calibration is confirmed.',
        ],
        figures: ['final-technical-validation'],
      },
      {
        heading: 'Lead placement and aVR check',
        body: [
          'Lead aVR should usually show a predominantly negative QRS complex, P wave, and T wave.',
          'If aVR is unexpectedly upright, pause before interpreting the tracing. Check for limb electrode reversal, especially left-arm and right-arm cable reversal.',
          'Dextrocardia can also produce unusual lead patterns, so use the aVR finding as a prompt to verify placement and clinical context rather than as a diagnosis by itself.',
        ],
      },
      {
        heading: 'Artifact assessment',
        body: [
          'Assess whether the baseline is stable enough for subtle interpretation. Dynamic drift, dry electrodes, patient movement, and mechanical noise can distort ST segments, T waves, and U waves.',
          'High-frequency erratic spikes suggest AC interference or muscle artifact. An undulating wavy baseline suggests respiratory baseline drift.',
          'If artifact is severe, the decision-support confidence for subtle repolarization findings should be lowered, especially ST deviation, T-wave morphology, QT end point, and U-wave interpretation.',
        ],
      },
      {
        heading: 'Clinical metadata',
        body: [
          'Record symptoms present at the time of the ECG: chest pain, dyspnea, syncope, near-syncope, palpitations, dizziness, or no active symptoms.',
          'The same ECG pattern can mean different things in different contexts. J-point ST elevation with active ischemic chest pain may represent STEMI, while similar elevation in an asymptomatic patient may fit early repolarization or chronic ventricular aneurysm.',
          'Capture relevant medicines, especially beta-blockers, non-dihydropyridine calcium channel blockers, digoxin, class Ia or class III antiarrhythmics, and known QT-prolonging agents.',
          'Enter recent potassium, magnesium, and calcium values when available. These help explain tented T waves, prominent U waves, ST-segment prolongation, QT changes, and rhythm instability.',
          'Compare with a prior or baseline ECG whenever possible. Serial change is often the most sensitive way to identify hyperacute, evolving, or dynamic repolarization shifts.',
        ],
        figures: ['final-evidence-integration'],
      },
      {
        heading: 'AV dissociation audit',
        body: [
          'Cross-check the atrial and ventricular rates from Step 1 against PR behavior from Step 3.',
          'If atrial and ventricular rates differ but the PR interval is marked constant, the app should warn that AV conduction may be internally inconsistent.',
          'Prompt the clinician to verify whether complete heart block, high-grade AV block, atrial flutter with block, or another AV dissociation pattern is present, and whether the PR interval is truly variable rather than constant.',
        ],
      },
      {
        heading: 'Wide QRS verification',
        body: [
          'Cross-check QRS duration from Step 5 against morphology and rhythm labels.',
          'If QRS duration is 0.12 seconds or greater and no bundle branch block, ventricular ectopic rhythm, ventricular pacing, or pre-excitation pattern has been flagged, prompt the clinician to recheck the tracing.',
          'Lead V1 is a key review lead for RBBB and LBBB pattern recognition, but final interpretation should also consider V6, axis, rhythm origin, pacing spikes, and clinical context.',
        ],
      },
      {
        heading: 'Contiguous-lead ischemia check',
        body: [
          'Cross-check pathologic Q waves from Step 7 and ST-segment deviation from Step 8 against anatomic lead groupings.',
          'If a pathologic Q wave or ST deviation is entered in only one isolated lead, prompt review of contiguous neighboring leads before making an injury or necrosis classification.',
          'Clinically meaningful ischemic injury or infarct patterns usually require two or more contiguous leads, such as II, III, and aVF for inferior territory or V1-V4 for anterior/septal territory.',
        ],
      },
      {
        heading: 'Why it matters',
        body: [
          'Final review protects against confident but wrong interpretation. A technically correct measurement can still mislead when calibration, lead placement, artifact, symptoms, medications, electrolytes, or prior ECGs are missing.',
          'The final output should state the evidence, urgency, uncertainty, and data limitations so the AI support system receives clinically integrated information rather than disconnected measurements.',
        ],
      },
    ],
    redFlags: ['Positive aVR suggesting possible lead reversal, severe artifact during suspected ischemia, active chest pain with dynamic ST-T change, syncope with conduction disease, major electrolyte abnormality, or internally inconsistent AV/QRS/ischemia entries need clinician review before relying on AI output.'],
    sources: ['ECGs Made Easy, 6th ed.', 'ECG Interpretation Made Incredibly Easy!, 5th ed.', 'ECG in 10 Days, 2nd ed.'],
  },
} satisfies Record<string, LearningTopic>;

const ecgLearningQuizzes = {
  'step.heartRate': [
    {
      prompt: 'What does the horizontal axis of a standard ECG grid represent?',
      choices: ['Time', 'Electrical voltage', 'Amplitude'],
      correctIndex: 0,
      explanation: 'The horizontal axis of standard ECG graph paper is calibrated to measure time, whereas the vertical axis measures voltage or amplitude.',
    },
    {
      prompt: 'How should a clinician determine whether the atrial rhythm on an ECG tracing is regular or irregular?',
      choices: ['Compare consecutive R-to-R intervals', 'Compare consecutive PR intervals', 'Compare consecutive P-to-P intervals'],
      correctIndex: 2,
      explanation: 'Atrial regularity is determined by measuring and comparing consecutive P-to-P intervals. Ventricular regularity is determined by comparing R-to-R intervals.',
    },
    {
      prompt: 'What are the R-to-R intervals primarily used for in ECG rhythm analysis?',
      choices: ['Determining ventricular regularity and rate', 'Measuring the duration of atrial depolarisation', 'Verifying the standardisation/calibration signal height'],
      correctIndex: 0,
      explanation: 'Clinicians measure the distance between consecutive R waves to evaluate whether the ventricular rhythm is regular or irregular and to calculate the ventricular heart rate.',
    },
    {
      prompt: 'On standard ECG paper, what duration of time is represented by five large grid boxes?',
      choices: ['0.20 seconds', '3 seconds', '1 second'],
      correctIndex: 2,
      explanation: 'A single large box represents 0.20 seconds. Five large boxes therefore represent exactly 1 second of recorded electrical activity.',
    },
    {
      prompt: 'On a standard ECG recording, how many seconds does a single small horizontal box represent?',
      choices: ['0.04 seconds', '0.10 seconds', '0.20 seconds'],
      correctIndex: 0,
      explanation: 'Standard ECG paper is divided into small boxes that represent 0.04 seconds horizontally. Each large box contains five small boxes and represents 0.20 seconds.',
    },
    {
      prompt: 'To calculate the heart rate using the 1,500 method, what value is divided by the number of small boxes between consecutive P or R waves?',
      choices: ['300', '60', '1,500'],
      correctIndex: 2,
      explanation: 'The 1,500 method is calculated by counting the number of small horizontal boxes between two consecutive P waves or R waves and dividing that number into 1,500.',
    },
    {
      prompt: 'When an ECG machine is properly calibrated, a 1-mV electrical signal will produce a vertical standardisation deflection measuring exactly how tall?',
      choices: ['5 mm (1 large box)', '10 mm (2 large boxes)', '15 mm (3 large boxes)'],
      correctIndex: 1,
      explanation: 'Standard calibration requires a 1-mV electrical signal to produce a 10 mm vertical deflection, equal to 10 small boxes or 2 large boxes.',
    },
    {
      prompt: 'In sinus arrhythmia, what is a gradual decreasing of the heart rate typically associated with?',
      choices: ['Inspiration', 'Body temperature elevation', 'Expiration'],
      correctIndex: 2,
      explanation: 'Sinus arrhythmia is a physiological variant where the rate usually increases during inspiration and decreases during expiration.',
    },
    {
      prompt: 'Which rhythm originates in the SA node and is characterised by an irregular rate that is typically phasic with breathing?',
      choices: ['Sinus arrest', 'Sinus arrhythmia', 'Sinus tachycardia'],
      correctIndex: 1,
      explanation: 'Sinus arrhythmia is an irregular rhythm originating from the SA node that classically fluctuates in a cyclic pattern with breathing.',
    },
    {
      prompt: 'What ventricular rate threshold differentiates sinus tachycardia from normal sinus rhythm in an adult?',
      choices: ['Slower than 60 beats/minute', 'Faster than 120 beats/minute', 'Faster than 100 beats/minute'],
      correctIndex: 2,
      explanation: 'Normal adult sinus rhythm is 60 to 100 beats/minute. A sinus rhythm faster than 100 beats/minute is classified as sinus tachycardia.',
    },
    {
      prompt: 'Which conduction block or dysrhythmia may be a normal physiological finding in healthy, well-conditioned athletes?',
      choices: ['First-degree AV block', 'Third-degree AV block', 'Atrial fibrillation'],
      correctIndex: 0,
      explanation: 'First-degree AV block can be a benign finding in healthy individuals, especially well-conditioned athletes with high vagal tone.',
    },
    {
      prompt: 'How many seconds of active cardiac electrical activity does a standard 12-lead ECG format show for each individual lead window?',
      choices: ['1.0 second', '2.5 seconds', '6.0 seconds'],
      correctIndex: 1,
      explanation: 'A standard 12-lead ECG records a 2.5-second window of electrical activity for each lead, often with a longer rhythm strip at the bottom.',
    },
    {
      prompt: 'To estimate the heart rate from an irregular rhythm, how many seconds are represented by 30 large boxes on standard ECG paper?',
      choices: ['3 seconds', '10 seconds', '6 seconds'],
      correctIndex: 2,
      explanation: 'Each large box represents 0.20 seconds, so 30 large boxes equal 6 seconds. This is the standard interval for the 6-second heart-rate estimation method.',
    },
    {
      prompt: 'What are the typical rate and regularity characteristics of sinus bradycardia?',
      choices: ['Regular rhythm with a rate slower than 60 beats/minute', 'Irregular rhythm with a rate slower than 60 beats/minute', 'Regular rhythm with a rate slower than 40 beats/minute'],
      correctIndex: 0,
      explanation: 'Sinus bradycardia is a regular rhythm originating from the sinoatrial node with atrial and ventricular rates slower than 60 beats/minute.',
    },
    {
      prompt: "When analysing a patient's rhythm strip using the systematic method of interpretation, which step should you perform first?",
      choices: ['Evaluate the configuration of the P wave', 'Check rhythm regularity', 'Calculate the ventricular heart rate'],
      correctIndex: 1,
      explanation: 'In the standard systematic method, the clinician first checks rhythm regularity before calculating rate and analysing the P waves, PR interval, and other components.',
    },
    {
      prompt: 'On standard ECG paper, what duration of time is represented by fifteen large boxes?',
      choices: ['1 second', '3 seconds', '6 seconds'],
      correctIndex: 1,
      explanation: 'Each large box represents 0.20 seconds horizontally. Fifteen large boxes therefore represent exactly 3 seconds.',
    },
    {
      prompt: 'When standard calibration is verified, what electrical voltage does a single small vertical grid box represent?',
      choices: ['0.1 mV', '0.5 mV', '1.0 mV'],
      correctIndex: 0,
      explanation: 'On a standard calibrated ECG tracing, a single 1 mm vertical small box corresponds to 0.1 mV.',
    },
    {
      prompt: 'On a standard calibrated ECG printout, a single large vertical box represents what amplitude of electrical voltage?',
      choices: ['0.1 mV', '1.0 mV', '0.5 mV'],
      correctIndex: 2,
      explanation: 'A large vertical box is 5 mm high, which corresponds to an electrical amplitude of 0.5 mV on a standard calibrated tracing.',
    },
  ],
  'step.pWave': [
    {
      prompt: 'What physiological cardiac event does the P wave represent on an ECG tracing?',
      choices: ['Atrial depolarisation', 'Ventricular depolarisation', 'Atrial repolarisation'],
      correctIndex: 0,
      explanation: 'The P wave represents the electrical impulse spreading across the atria, known as atrial depolarisation.',
    },
    {
      prompt: 'In a normally conducted sinus beat or a premature atrial contraction, what is the typical P-wave deflection in leads II, III, and aVF?',
      choices: ['Inverted (negative)', 'Upright (positive)', 'Biphasic'],
      correctIndex: 1,
      explanation: 'A PAC and a normal sinus beat typically have a positive, upright P wave before the QRS complex in the inferior leads II, III, and aVF.',
    },
    {
      prompt: 'To diagnose a wandering atrial pacemaker on a single lead strip, how many different P-wave morphologies must be visible?',
      choices: ['At least two', 'At least four', 'At least three'],
      correctIndex: 2,
      explanation: 'Wandering atrial pacemaker requires at least three morphologically distinct P waves within the same lead.',
    },
    {
      prompt: 'When comparing a premature atrial complex with a premature junctional complex in leads II, III, and aVF, which P-wave rule applies?',
      choices: ['A PAC typically has an upright P wave before the QRS, whereas a P wave may be absent, inverted, or buried with a PJC.', 'A PAC has an inverted P wave, whereas a PJC always has an upright P wave.', 'A PAC has a wide QRS complex, whereas a PJC has a narrow QRS complex.'],
      correctIndex: 0,
      explanation: 'A PAC typically has an upright P wave before the QRS in inferior leads, while a visible P wave in PJC is usually retrograde and inverted, or it may be hidden.',
    },
    {
      prompt: 'Which describes the P-wave characteristics of atrial fibrillation?',
      choices: ['Tall, peaked P waves repeating at regular intervals', 'Sawtooth-like flutter waves', 'No true P waves; chaotic, wavy fibrillatory waves are present'],
      correctIndex: 2,
      explanation: 'In atrial fibrillation there is no uniform atrial depolarisation and no true P waves. Chaotic fibrillatory waves replace organised P waves.',
    },
    {
      prompt: 'Atrial fibrillation may be confused with multifocal atrial tachycardia because both rhythms are irregular. How can a clinician differentiate them?',
      choices: ['MAT has no P waves at all, whereas AFib has uniform P waves.', 'P waves of varying sizes, shapes, and directions are clearly visible in MAT, whereas they are absent in AFib.', 'MAT has regular ventricular rates, whereas AFib is always irregular.'],
      correctIndex: 1,
      explanation: 'MAT has visible P waves that vary in size, shape, and direction. AFib lacks uniform P waves.',
    },
    {
      prompt: 'If a P wave is visible in a junctional rhythm, what is its expected deflection in lead II?',
      choices: ['Upright (positive)', 'Inverted (negative)', 'Biphasic'],
      correctIndex: 1,
      explanation: 'A visible P wave in junctional rhythm is retrograde, travelling backwards from the AV junction through the atria, so it appears inverted in lead II.',
    },
    {
      prompt: 'In an accelerated junctional rhythm, where can the retrograde P wave occur relative to the QRS complex?',
      choices: ['Only before the QRS complex', 'Only after the QRS complex', 'Before, during, or after the QRS complex'],
      correctIndex: 2,
      explanation: 'Retrograde P waves in accelerated junctional rhythms can occur before the QRS, be buried within it, or appear after it.',
    },
    {
      prompt: 'In a third-degree AV block, what is the relationship between the P waves and QRS complexes?',
      choices: ['The P waves and QRS complexes beat independently, showing complete AV dissociation.', 'Every P wave is followed by a QRS complex with a constant PR interval.', 'The P waves are completely absent.'],
      correctIndex: 0,
      explanation: 'Third-degree AV block has regular P-P intervals and regular R-R intervals, but no consistent relationship between P waves and QRS complexes.',
    },
    {
      prompt: 'In a second-degree 2:1 AV block, what is the mathematical relationship between the atrial rate and ventricular rate?',
      choices: ['The ventricular rate is twice the atrial rate.', 'The atrial rate and ventricular rate are equal.', 'The atrial rate is twice the ventricular rate.'],
      correctIndex: 2,
      explanation: 'In 2:1 AV block, every other P wave is blocked, so the atrial rate is twice the ventricular rate.',
    },
    {
      prompt: 'What is the characteristic P-wave morphology associated with right atrial enlargement?',
      choices: ['Wide, notched, and double-humped P waves', 'Tall, peaked P waves of normal duration', 'Completely flat or absent P waves'],
      correctIndex: 1,
      explanation: 'Right atrial enlargement typically produces tall, peaked P waves that are usually of normal duration.',
    },
    {
      prompt: 'What is a common diagnostic pitfall when a premature atrial contraction occurs very early in the cardiac cycle?',
      choices: ['It can be misdiagnosed as a PJC if its P wave is buried inside the preceding T wave.', 'It will always trigger ventricular fibrillation.', 'It causes the QRS complex to become wide and bizarre.'],
      correctIndex: 0,
      explanation: 'A very early PAC may hide in the preceding T wave, making the ectopic beat look as though it has no P wave.',
    },
    {
      prompt: 'What is the physiological cause of the normal upright deflection of a P wave in lead II?',
      choices: ['Depolarisation travelling towards the positive electrode on the left leg', 'Depolarisation travelling away from the positive electrode on the left leg', 'Depolarisation travelling perpendicular to the positive electrode'],
      correctIndex: 0,
      explanation: 'Normal atrial depolarisation travels downwards and leftwards towards the positive electrode on the left leg, producing an upright P wave in lead II.',
    },
    {
      prompt: 'In a junctional rhythm, if the ventricles are depolarised first, where will the P wave appear relative to the QRS complex?',
      choices: ['Before the QRS complex', 'Within the QRS complex', 'After the QRS complex'],
      correctIndex: 2,
      explanation: 'If ventricular depolarisation occurs first, atrial depolarisation follows, so the retrograde P wave appears after the QRS complex.',
    },
    {
      prompt: "To evaluate a patient's atrial regularity, what specific intervals must a clinician measure?",
      choices: ['The R-to-R intervals', 'The P-to-P intervals', 'The PR intervals'],
      correctIndex: 1,
      explanation: 'Atrial regularity is assessed by plotting and measuring P-to-P intervals.',
    },
    {
      prompt: 'What type of atrial activity is recorded on an ECG strip during atrial flutter?',
      choices: ['Smooth, rounded upright P waves', 'Erratic, coarse fibrillatory waves', 'Rapid, regular sawtooth-like waves'],
      correctIndex: 2,
      explanation: 'Atrial flutter is characterised by rapid, regular sawtooth-like atrial deflections called flutter waves, or F waves, in place of normal P waves.',
    },
    {
      prompt: "If a patient has a wandering atrial pacemaker, what is the minimum number of different P-wave morphologies that must be visible in a single lead?",
      choices: ['At least two', 'At least three', 'At least four'],
      correctIndex: 1,
      explanation: 'Wandering atrial pacemaker is diagnosed by identifying at least three different P-wave configurations in the same lead.',
    },
    {
      prompt: "If a patient's ECG strip reveals a regular rhythm at 80 beats/minute, with P waves inverted in lead II and occurring before each QRS complex, what is the rhythm?",
      choices: ['Accelerated junctional rhythm', 'Junctional tachycardia', 'Junctional escape rhythm'],
      correctIndex: 0,
      explanation: 'A regular junctional rhythm with inverted P waves before each QRS and a rate of 61 to 100 bpm is classified as accelerated junctional rhythm.',
    },
  ],
  'step.prInterval': [
    {
      prompt: 'Where are the correct anatomical landmarks to measure the PR interval on standard ECG grid paper?',
      choices: ['From the beginning of the P wave to the beginning of the QRS complex', 'From the end of the P wave to the beginning of the QRS complex', 'From the beginning of the P wave to the end of the T wave'],
      correctIndex: 0,
      explanation: 'The PR interval is measured from the onset of atrial depolarisation, the beginning of the P wave, to the onset of ventricular depolarisation, the beginning of the QRS complex.',
    },
    {
      prompt: 'What is the normal duration of a PR interval in a healthy adult?',
      choices: ['0.04 to 0.10 seconds', '0.12 to 0.20 seconds', '0.20 to 0.35 seconds'],
      correctIndex: 1,
      explanation: 'A normal adult PR interval is 0.12 to 0.20 seconds, equivalent to 3 to 5 small horizontal boxes.',
    },
    {
      prompt: 'Which part of the cardiac conduction system physiologically delays the impulse so the atria can empty before ventricular contraction?',
      choices: ['The Bundle of His', 'The Purkinje fibres', 'The AV node'],
      correctIndex: 2,
      explanation: 'The AV node delays impulse conduction before relaying it to the Bundle of His, giving the atria time to contract and empty into the ventricles.',
    },
    {
      prompt: 'What is the clinical term for the contribution of blood added to the ventricles as a direct result of atrial contraction?',
      choices: ['Atrial kick', 'Cardiac output', 'Afterload'],
      correctIndex: 0,
      explanation: 'Atrial contraction adds a final active volume of blood to the ventricles just before ventricular contraction; this is known as the atrial kick.',
    },
    {
      prompt: 'An ECG rhythm strip shows regular sinus rhythm with a constant PR interval of 0.34 seconds. How should this conduction delay be classified?',
      choices: ['Second-degree AV block Type I', 'First-degree AV block', 'Third-degree AV block'],
      correctIndex: 1,
      explanation: 'First-degree AV block has a constant prolonged PR interval greater than 0.20 seconds, with every P wave conducted to a QRS complex.',
    },
    {
      prompt: 'Which systemic condition is a recognised cause of first-degree AV block?',
      choices: ['Hyperthermia', 'Hyperthyroidism', 'Hypothermia'],
      correctIndex: 2,
      explanation: 'Hypothermia is a recognised cause of conduction delay and can produce first-degree AV block on the ECG.',
    },
    {
      prompt: 'Which conduction block has progressively lengthening PR intervals until a P wave is blocked and not followed by a QRS complex?',
      choices: ['Second-degree AV block Type I (Mobitz I / Wenckebach)', 'Second-degree AV block Type II (Mobitz II)', 'First-degree AV block'],
      correctIndex: 0,
      explanation: 'Mobitz I, or Wenckebach, shows progressive AV nodal delay with PR lengthening until one atrial impulse is not conducted.',
    },
    {
      prompt: 'What distinguishes Mobitz II from Mobitz I?',
      choices: ['Mobitz II features a progressively shortening PR interval before a dropped beat.', 'Mobitz II has completely irregular atrial and ventricular rhythms with no P waves.', 'Mobitz II has fixed conducted PR intervals before a QRS complex is suddenly dropped.'],
      correctIndex: 2,
      explanation: 'Mobitz II has constant PR intervals on conducted beats, with sudden non-conducted P waves and dropped QRS complexes without prior PR prolongation.',
    },
    {
      prompt: 'Why is a second-degree 2:1 AV block impossible to conclusively classify as Type I or Type II?',
      choices: ['The PR interval is completely unmeasurable.', 'There are no two consecutive P-QRS cycles from which to compare PR intervals.', 'There is complete AV dissociation.'],
      correctIndex: 1,
      explanation: 'In 2:1 block, every other P wave is blocked, so there are no two consecutive conducted beats to compare for PR lengthening or constancy.',
    },
    {
      prompt: 'What are the primary diagnostic features of third-degree AV block?',
      choices: ['Regular P-P and regular R-R rhythms beating independently with variable PR intervals', 'Progressive PR lengthening with highly irregular atrial and ventricular rates', 'Normal PR intervals on all conducted beats with a highly irregular atrial rhythm'],
      correctIndex: 0,
      explanation: 'Third-degree AV block has complete AV dissociation: regular atrial and ventricular rhythms occur independently with no fixed PR relationship.',
    },
    {
      prompt: 'Why is there no true PR interval in complete heart block?',
      choices: ['The atrial rate is too fast to measure the interval.', 'The QRS complexes are completely absent.', 'There is no conduction relationship between P waves and QRS complexes.'],
      correctIndex: 2,
      explanation: 'Because atria and ventricles depolarise independently in complete heart block, there is no true conducted PR interval.',
    },
    {
      prompt: 'What triad of classic ECG findings characterises Wolff-Parkinson-White syndrome?',
      choices: ['Prolonged PR interval, a delta wave, and a narrow QRS complex', 'Shortened PR interval, a delta wave, and a widened QRS complex', 'Shortened PR interval, a U wave, and a narrow QRS complex'],
      correctIndex: 1,
      explanation: 'WPW pattern is defined by a short PR interval, a delta wave from early ventricular activation, and a widened QRS complex.',
    },
    {
      prompt: 'Why is AV block during acute inferior wall MI more likely to be temporary?',
      choices: ['It is caused by irreversible damage to the bundle branches.', 'It is typically due to transient injury or ischaemia to the AV node.', 'Inferior MIs always affect only the Purkinje fibres.'],
      correctIndex: 1,
      explanation: 'The AV node is commonly supplied by the right coronary artery, so inferior MI can cause transient AV nodal ischaemia that may resolve after the acute phase.',
    },
    {
      prompt: 'A patient with acute anterior wall MI develops third-degree heart block, hypotension, and dizziness. What immediate intervention is indicated?',
      choices: ['Administer a high-dose beta-blocker and obtain a serial ECG.', 'Perform immediate synchronised cardioversion at 360 J.', 'Administer atropine and prepare transcutaneous pacing.'],
      correctIndex: 2,
      explanation: 'Symptomatic third-degree heart block with haemodynamic compromise needs immediate support, including atropine and preparation for transcutaneous pacing.',
    },
    {
      prompt: 'If a heart-transplant patient develops symptomatic sinus bradycardia or AV block, why may atropine be ineffective?',
      choices: ['Vagus nerve dissection during transplantation renders atropine ineffective.', 'Atropine is contraindicated due to severe interaction with immunosuppressants.', 'Transplanted hearts do not possess cholinergic receptors.'],
      correctIndex: 0,
      explanation: 'A transplanted heart is denervated because of vagal nerve dissection; atropine works through vagal tone, so it may be ineffective.',
    },
    {
      prompt: 'How does digoxin therapy affect AV conduction and the PR interval?',
      choices: ['It causes marked shortening of the PR interval.', 'It slows AV nodal conduction, which can prolong the PR interval.', 'It completely blocks atrial depolarisation.'],
      correctIndex: 1,
      explanation: 'Digoxin increases vagal tone and slows conduction through the AV node, which can prolong the PR interval or contribute to AV block in toxic ranges.',
    },
    {
      prompt: 'Why do procainamide or quinidine require ECG monitoring of PR interval and QRS duration?',
      choices: ['They shorten the QT interval.', 'They accelerate conduction across the accessory pathway.', 'They can delay conduction and prolong the PR interval, QRS complex, and QT interval.'],
      correctIndex: 2,
      explanation: 'Class Ia antiarrhythmics slow myocardial conduction, potentially prolonging PR interval, widening QRS, and prolonging QT interval.',
    },
    {
      prompt: 'How are incomplete AV blocks differentiated from complete AV blocks?',
      choices: ['Incomplete blocks allow at least some atrial impulses to conduct to the ventricles, whereas complete blocks prevent conduction.', 'Incomplete blocks have no P waves, while complete blocks have uniform P waves.', 'Incomplete blocks feature wide QRS complexes, while complete blocks feature narrow QRS complexes.'],
      correctIndex: 0,
      explanation: 'First-degree and second-degree AV blocks are incomplete because at least some impulses conduct; third-degree AV block prevents atrial impulses from conducting to the ventricles.',
    },
  ],
  'step.rhythm': [
    {
      prompt: 'What is the normal electrical pathway of conduction in normal sinus rhythm?',
      choices: ['Sinus node to bundle branches, to atria, to AV node, to bundle of His, and on to Purkinje fibres', 'Sinus node to atria and AV node, through the bundle of His, to the bundle branches, and on to the Purkinje fibres', 'AV node to atria, to sinus node, through the bundle branches, to the bundle of His, and on to Purkinje fibres'],
      correctIndex: 1,
      explanation: 'Normal sinus rhythm begins in the SA node, travels through the atria and AV node, then through the His-Purkinje system to activate the ventricles.',
    },
    {
      prompt: 'What ventricular rate range defines an accelerated junctional rhythm?',
      choices: ['40 to 60 beats/minute', '101 to 180 beats/minute', '61 to 100 beats/minute'],
      correctIndex: 2,
      explanation: 'Accelerated junctional rhythm is a regular rhythm of AV junction origin with a ventricular rate of 61 to 100 beats/minute.',
    },
    {
      prompt: 'How can a clinician differentiate a junctional escape rhythm at 40 bpm from an idioventricular rhythm at the same rate?',
      choices: ['The junctional escape rhythm has a narrow QRS, whereas the idioventricular rhythm has a wide QRS.', 'The junctional escape rhythm has a wide QRS, whereas the idioventricular rhythm has a narrow QRS.', 'Differentiation requires a serial chest X-ray.'],
      correctIndex: 0,
      explanation: 'Junctional escape uses the normal rapid conduction pathway and usually has a narrow QRS; idioventricular rhythm starts in the ventricles and has a wide QRS.',
    },
    {
      prompt: 'What is the primary clinical purpose of an idioventricular rhythm?',
      choices: ['To rapidly accelerate conduction during exercise', 'To act as a last-resort safety mechanism preventing ventricular standstill', 'To coordinate the atrial kick before ventricular systole'],
      correctIndex: 1,
      explanation: 'Idioventricular escape rhythms emerge when higher pacemakers fail, protecting the ventricles from standstill.',
    },
    {
      prompt: 'Why are lidocaine or other antiarrhythmics contraindicated in idioventricular escape rhythm?',
      choices: ['They cause severe systemic hypokalaemia.', "They suppress the heart's safety escape mechanism, risking ventricular standstill.", 'They cause rapid retrograde conduction and junctional tachycardia.'],
      correctIndex: 1,
      explanation: 'Suppressing an idioventricular escape rhythm may remove the patient’s only remaining ventricular pacemaker.',
    },
    {
      prompt: 'What is the expected ventricular rate range of accelerated idioventricular rhythm?',
      choices: ['Slower than 40 beats/minute', 'Faster than 100 beats/minute', '40 to 100 beats/minute'],
      correctIndex: 2,
      explanation: 'AIVR has ventricular-origin features with a faster escape rate, typically 40 to 100 beats/minute.',
    },
    {
      prompt: 'What morphology and onset pattern describe nonparoxysmal junctional tachycardia?',
      choices: ['Sudden onset precipitated by a PJC, typically at 140 bpm or more', 'Irregular ventricular rhythm with coarse fibrillatory waves', 'Gradual onset or warm-up pattern that rarely exceeds 120 bpm'],
      correctIndex: 2,
      explanation: 'Nonparoxysmal junctional tachycardia typically has a gradual warm-up onset and usually remains below about 120 bpm.',
    },
    {
      prompt: 'What clinical presentation is typically associated with paroxysmal junctional tachycardia?',
      choices: ['It starts and ends suddenly, is often precipitated by a PJC, and has a ventricular rate of 140 bpm or more.', 'It is a benign gradual-onset rhythm that never exceeds 100 bpm.', 'It has a highly irregular rhythm with P waves in a 4:1 block ratio.'],
      correctIndex: 0,
      explanation: 'Paroxysmal junctional tachycardia starts and stops abruptly, may be triggered by a PJC, and often runs at rapid rates of 140 bpm or more.',
    },
    {
      prompt: 'At what ventricular rate does junctional tachycardia become extremely difficult to distinguish from other SVTs?',
      choices: ['Greater than 100 beats/minute', 'Greater than 120 beats/minute', 'Greater than 150 beats/minute'],
      correctIndex: 2,
      explanation: 'When junctional tachycardia exceeds about 150 bpm, it can be difficult to distinguish from other supraventricular tachycardias on a standard tracing.',
    },
    {
      prompt: 'A regular rhythm at 52 bpm has inverted P waves in lead II, a short PR interval of 0.08 seconds, and narrow QRS complexes. What is this rhythm?',
      choices: ['Accelerated junctional rhythm', 'Junctional escape rhythm', 'First-degree AV block with sinus bradycardia'],
      correctIndex: 1,
      explanation: 'A regular junctional rhythm at 40 to 60 bpm with inverted inferior P waves is a junctional escape rhythm.',
    },
    {
      prompt: 'What is the intrinsic pacemaker rate of the AV junction?',
      choices: ['40 to 60 beats/minute', '60 to 100 beats/minute', '20 to 40 beats/minute'],
      correctIndex: 0,
      explanation: 'The AV junction’s intrinsic firing rate is 40 to 60 beats/minute.',
    },
    {
      prompt: 'How is junctional bradycardia defined?',
      choices: ['A rhythm of junctional origin with an atrial rate slower than 60 bpm', 'A rhythm of junctional origin with a ventricular rate of 40 to 60 bpm', 'A rhythm of junctional origin with a ventricular rate slower than 40 bpm'],
      correctIndex: 2,
      explanation: 'Junctional bradycardia is a junctional rhythm with a ventricular rate slower than 40 beats/minute.',
    },
    {
      prompt: 'What are the classic diagnostic ECG findings of atrial fibrillation?',
      choices: ['Regular rhythm, sawtooth waves, and unmeasurable PR intervals', 'Irregularly irregular rhythm, absent P waves replaced by fibrillatory waves, and indiscernible PR intervals', 'Irregular rhythm, peaked P waves, and constant PR intervals'],
      correctIndex: 1,
      explanation: 'AFib has an irregularly irregular ventricular response, absent organised P waves, fibrillatory baseline activity, and no discernible PR interval.',
    },
    {
      prompt: 'An ECG shows regular P waves at 68 bpm and regular QRS complexes at 43 bpm with no correlation between them. What is this rhythm?',
      choices: ['Second-degree AV block Type II', 'Atrial fibrillation with slow ventricular response', 'Third-degree AV block'],
      correctIndex: 2,
      explanation: 'Independent regular atrial and ventricular activity with no P-QRS relationship indicates complete AV dissociation, or third-degree AV block.',
    },
    {
      prompt: 'If accelerated junctional rhythm is suspected to be caused by digoxin toxicity, what is the immediate initial pharmacological action?',
      choices: ['Withhold the digoxin medication.', 'Administer a double dose of digoxin to override the AV node.', 'Administer high-dose lidocaine.'],
      correctIndex: 0,
      explanation: 'When digitalis toxicity is suspected, digoxin should be withheld and the patient monitored closely.',
    },
    {
      prompt: 'A regular rhythm at 150 bpm has narrow QRS complexes and visible P waves immediately after each QRS. What is the correct interpretation?',
      choices: ['Normal sinus rhythm with PACs', 'Junctional tachycardia', 'Atrial flutter with 2:1 block'],
      correctIndex: 1,
      explanation: 'Junctional tachycardia can present with narrow QRS complexes at 101 to 180 bpm and retrograde P waves after the QRS.',
    },
    {
      prompt: 'How is an accelerated rhythm defined relative to intrinsic pacemaker rates?',
      choices: ['It is faster than its intrinsic rate but slower than 100 bpm.', 'It is slower than its intrinsic rate and slower than 40 bpm.', 'It is faster than 100 bpm with sudden onset.'],
      correctIndex: 0,
      explanation: 'Accelerated rhythms are faster than the tissue’s intrinsic escape rate but not fast enough to be classified as tachycardia.',
    },
    {
      prompt: 'What is the electrophysiological cause of accelerated junctional rhythm?',
      choices: ['Abnormal automaticity of the bundle of His', 'Parasympathetic vagal nerve stimulation of the SA node', 'An accessory pathway bypassing the AV node'],
      correctIndex: 0,
      explanation: 'Accelerated junctional rhythm is caused by abnormal automaticity in pacemaker cells around the AV junction and bundle of His.',
    },
  ],
  'step.qrs': [
    {
      prompt: 'What physiological cardiac event does the QRS complex represent?',
      choices: ['Ventricular depolarisation', 'Atrial depolarisation and contraction', 'Ventricular repolarisation'],
      correctIndex: 0,
      explanation: 'The QRS complex represents rapid electrical activation through the ventricles, known as ventricular depolarisation.',
    },
    {
      prompt: 'What is the normal duration of a QRS complex in a healthy adult?',
      choices: ['0.12 to 0.16 seconds', '0.11 seconds or less', '0.20 seconds or more'],
      correctIndex: 1,
      explanation: 'Normal adult QRS duration is 0.11 seconds or less.',
    },
    {
      prompt: 'Which ECG parameter differentiates a junctional escape rhythm from an idioventricular escape rhythm at the same heart rate?',
      choices: ['The configuration and polarity of the P wave', 'The length of the QT interval', 'The duration of the QRS complex'],
      correctIndex: 2,
      explanation: 'Junctional escape uses the rapid His-Purkinje pathway and has a narrow QRS, while idioventricular escape starts in the ventricles and has a wide QRS.',
    },
    {
      prompt: 'According to standard nomenclature, how is a completely negative QRS complex with no upright deflection documented?',
      choices: ['A QS wave', 'An rS wave', "An sR' wave"],
      correctIndex: 0,
      explanation: 'A QRS complex made entirely of a single negative deflection is documented as a QS complex.',
    },
    {
      prompt: 'Which lead is considered the best single lead for differentiating RBBB from LBBB?',
      choices: ['Lead II', 'Lead V1', 'Lead V6'],
      correctIndex: 1,
      explanation: 'Lead V1 is the primary precordial lead for assessing terminal QRS forces that help separate RBBB and LBBB patterns.',
    },
    {
      prompt: 'What is the clinical turn-signal rule in lead V1 for identifying RBBB?',
      choices: ['Look at the initial QRS portion; if it is deeply negative, it indicates RBBB.', 'Look at the J point; if it is depressed below baseline, it indicates RBBB.', 'Look at the terminal QRS; if it deflects upward, it indicates RBBB.'],
      correctIndex: 2,
      explanation: 'In lead V1, an upward terminal QRS deflection suggests RBBB, like pushing a turn signal lever up for a right turn.',
    },
    {
      prompt: 'What terminal QRS deflection in lead V1 characterises LBBB under the turn-signal rule?',
      choices: ['A terminal force deflecting downward', 'A terminal force deflecting upward', 'A terminal force that is perfectly biphasic'],
      correctIndex: 0,
      explanation: 'In lead V1, a downward terminal QRS deflection suggests LBBB, like pushing a turn signal lever down for a left turn.',
    },
    {
      prompt: 'When verifying standard technical calibration, a 1-mV signal must produce a vertical standardisation deflection measuring how tall?',
      choices: ['5 mm (1 large box)', '10 mm (2 large boxes)', '15 mm (3 large boxes)'],
      correctIndex: 1,
      explanation: 'Standard calibration requires a 1-mV signal to produce a 10 mm deflection, equal to 10 small boxes or 2 large boxes.',
    },
    {
      prompt: 'Which ECG finding is characteristic of right ventricular hypertrophy?',
      choices: ['Deep QS complexes in all precordial leads V1 through V6', 'Low QRS voltage under 5 mm in all limb leads', 'A tall dominant R wave in V1, often with right axis deviation'],
      correctIndex: 2,
      explanation: 'RVH commonly produces a tall dominant R wave in V1, often with right axis deviation and right-sided strain clues.',
    },
    {
      prompt: 'In a normal adult, where is the typical precordial transition zone from predominantly negative to predominantly positive QRS complexes?',
      choices: ['Leads V3 and V4', 'Leads V1 and V2', 'Leads V5 and V6'],
      correctIndex: 0,
      explanation: 'The R-wave transition zone normally occurs around V3 to V4, where R-wave amplitude begins to exceed S-wave depth.',
    },
    {
      prompt: 'What abbreviation designates a second positive deflection within a single QRS complex?',
      choices: ["Q' (Q-prime)", "R' (R-prime)", "S' (S-prime)"],
      correctIndex: 1,
      explanation: "A second positive deflection after the initial R wave is called R-prime, written R'.",
    },
    {
      prompt: 'When QRS complexes in the limb leads are extremely small, measuring less than 5 mm total height, how is this classified?',
      choices: ['Normal variant sinus rhythm', 'Intraventricular block', 'Low voltage'],
      correctIndex: 2,
      explanation: 'Low voltage is present when total QRS amplitude is less than 5 mm in all limb leads.',
    },
    {
      prompt: 'If atrial fibrillation displays a widened QRS complex measuring 0.14 seconds, what is the most likely explanation?',
      choices: ['A concurrent bundle branch block', 'The atria have ceased all electrical activity', 'A normal physiological conduction pathway'],
      correctIndex: 0,
      explanation: 'AFib usually has a narrow QRS. A wide QRS suggests delayed ventricular depolarisation, commonly from co-existing bundle branch block.',
    },
    {
      prompt: 'How does a ventricular ectopic beat propagate through the ventricles?',
      choices: ['It travels rapidly down the His-Purkinje system, producing a narrow QRS.', 'It travels slowly cell to cell through myocardium, producing a wide and bizarre QRS.', 'It bypasses the ventricles completely, causing a prolonged PR interval.'],
      correctIndex: 1,
      explanation: 'Ventricular ectopic beats spread slowly through ordinary myocardium instead of the His-Purkinje system, producing a wide, abnormal QRS.',
    },
    {
      prompt: 'Why is it vital to check a mechanical pulse even if organised normal-looking QRS complexes appear on the monitor?',
      choices: ['Normal QRS complexes mean the heart has stopped contracting.', 'The QRS complex only represents atrial contraction.', 'Electrical activity does not guarantee mechanical contraction.'],
      correctIndex: 2,
      explanation: 'Organised electrical activity can occur without effective mechanical contraction or cardiac output, as in pulseless electrical activity.',
    },
    {
      prompt: 'In a normally conducted sinus beat, which wave is the first negative deflection of the QRS complex after the P wave?',
      choices: ['The Q wave', 'The S wave', 'The R wave'],
      correctIndex: 0,
      explanation: 'The Q wave is the first negative QRS deflection after the P wave and before any positive R wave.',
    },
    {
      prompt: 'What does a second negative deflection following an upright R wave within a single QRS complex represent?',
      choices: ["q' (q-prime)", "s' (s-prime)", "R'' (R-double-prime)"],
      correctIndex: 1,
      explanation: "A second negative deflection after an R wave is documented as S-prime, written s'.",
    },
    {
      prompt: 'Which describes complete bundle branch block in adults?',
      choices: ['QRS duration of 0.11 seconds with normal P waves', 'QRS duration of 0.08 seconds with inverted T waves', 'QRS duration of 0.12 seconds or more from a supraventricular focus'],
      correctIndex: 2,
      explanation: 'Complete RBBB or LBBB has a QRS duration of at least 0.12 seconds and originates above the ventricles.',
    },
  ],
  'step.axis': [
    {
      prompt: 'What plane of the heart do the six limb leads provide electrical information about?',
      choices: ['The frontal plane', 'The horizontal plane', 'The sagittal plane'],
      correctIndex: 0,
      explanation: 'The six limb leads provide electrical information about the frontal plane. The precordial chest leads provide information about the horizontal plane.',
    },
    {
      prompt: 'What is the normal range of the adult frontal plane QRS axis?',
      choices: ['0 degrees to +120 degrees', '-30 degrees to +90 degrees', '-90 degrees to +180 degrees'],
      correctIndex: 1,
      explanation: 'In adults, the normal QRS electrical axis is considered to lie between -30 degrees and +90 degrees in the frontal plane.',
    },
    {
      prompt: 'What is an electrical vector between -30 degrees and -90 degrees called?',
      choices: ['Right axis deviation', 'Extreme right axis deviation', 'Left axis deviation'],
      correctIndex: 2,
      explanation: 'A current flow directed leftward beyond the normal range, between -30 degrees and -90 degrees, is left axis deviation.',
    },
    {
      prompt: 'What is an electrical vector between +90 degrees and +/-180 degrees called?',
      choices: ['Right axis deviation', 'Left axis deviation', 'Extreme axis deviation'],
      correctIndex: 0,
      explanation: 'Current flow directed to the right of normal, between +90 degrees and +/-180 degrees, is right axis deviation.',
    },
    {
      prompt: 'What boundaries define extreme right axis deviation, also known as northwest axis?',
      choices: ['-30 degrees to -90 degrees', '-90 degrees to +/-180 degrees', '+90 degrees to +/-180 degrees'],
      correctIndex: 1,
      explanation: 'An axis between -90 degrees and +/-180 degrees is termed indeterminate, northwest, no man’s land, or extreme axis deviation.',
    },
    {
      prompt: 'Which two leads are most commonly evaluated together for the quadrant method?',
      choices: ['Leads II and aVL', 'Leads III and aVR', 'Leads I and aVF'],
      correctIndex: 2,
      explanation: 'Leads I and aVF are the standard frontal leads used in the quadrant method to rapidly classify axis.',
    },
    {
      prompt: 'In the hexaxial reference system, which lead runs perpendicular to Lead I?',
      choices: ['Lead aVF', 'Lead II', 'Lead aVL'],
      correctIndex: 0,
      explanation: 'Lead I and lead aVF are perpendicular to each other, separated by 90 degrees on the hexaxial reference system.',
    },
    {
      prompt: 'In the hexaxial reference system, which lead is perpendicular to Lead II?',
      choices: ['Lead aVR', 'Lead aVL', 'Lead III'],
      correctIndex: 1,
      explanation: 'Lead II is perpendicular to lead aVL on the hexaxial diagram.',
    },
    {
      prompt: 'In the hexaxial reference system, which lead is perpendicular to Lead III?',
      choices: ['Lead I', 'Lead aVF', 'Lead aVR'],
      correctIndex: 2,
      explanation: 'Lead III runs perpendicular to augmented lead aVR.',
    },
    {
      prompt: 'Under what physiological condition is left axis deviation considered a normal healthy finding?',
      choices: ['In pregnant women', 'In infants', 'In small children'],
      correctIndex: 0,
      explanation: 'Left axis deviation can be a benign physiological variant in pregnancy because the elevated diaphragm shifts the heart leftward.',
    },
    {
      prompt: 'Using the precise degree method, what is the first step in determining frontal plane axis?',
      choices: ['Find the lead with the tallest QRS complex', 'Locate the smallest or equiphasic QRS lead', 'Check T-wave polarity in the precordial leads'],
      correctIndex: 1,
      explanation: 'The precise method starts by finding the isoelectric or equiphasic limb lead: the one with the smallest QRS or equal positive and negative deflection.',
    },
    {
      prompt: 'What does a predominantly upright QRS deflection in a lead indicate?',
      choices: ['Electrical activity is moving away from the positive pole', 'Electrical activity is perpendicular to the lead', 'Electrical activity is moving towards the positive pole'],
      correctIndex: 2,
      explanation: 'A positive upright QRS means ventricular depolarisation is moving toward that lead’s positive pole.',
    },
    {
      prompt: 'If the QRS in a lead is predominantly negative, what does it indicate?',
      choices: ['Electrical activity is moving away from the positive pole', 'Electrical activity is moving directly towards the positive pole', 'The pacemaker has shifted to the Purkinje fibres'],
      correctIndex: 0,
      explanation: 'A predominantly negative QRS means ventricular depolarisation is moving away from that lead’s positive pole.',
    },
    {
      prompt: 'If Lead I is positive and Lead aVF is negative, which frontal plane quadrant is suspected?',
      choices: ['Normal axis', 'Left axis deviation', 'Right axis deviation'],
      correctIndex: 1,
      explanation: 'Lead I positive with aVF negative indicates forces moving superiorly and leftward, suggesting left axis deviation.',
    },
    {
      prompt: 'If Lead I is negative and Lead aVF is positive, what axis deviation is present?',
      choices: ['Left axis deviation', 'Extreme axis deviation', 'Right axis deviation'],
      correctIndex: 2,
      explanation: 'Negative Lead I with positive aVF indicates rightward and inferior forces, consistent with right axis deviation.',
    },
    {
      prompt: 'Which limb leads are classified as bipolar limb leads?',
      choices: ['Leads I, II, and III', 'Leads aVR, aVL, and aVF', 'Leads V1, V2, and V3'],
      correctIndex: 0,
      explanation: 'Leads I, II, and III are bipolar limb leads because they measure the potential difference between two electrodes.',
    },
    {
      prompt: 'Which limb leads are classified as augmented unipolar limb leads?',
      choices: ['Leads I, II, and III', 'Leads aVR, aVL, and aVF', 'Leads V4, V5, and V6'],
      correctIndex: 1,
      explanation: 'Leads aVR, aVL, and aVF are augmented unipolar limb leads that measure one positive electrode relative to a reference point.',
    },
    {
      prompt: 'If both Lead I and Lead aVF show predominantly upright positive QRS complexes, what is the axis classification?',
      choices: ['Left axis deviation', 'Right axis deviation', 'Normal axis'],
      correctIndex: 2,
      explanation: 'Positive QRS complexes in both Lead I and aVF place the mean vector in the positive-positive quadrant, consistent with normal axis.',
    },
  ],
  'step.qWaves': [
    {
      prompt: 'What does a pathologic Q wave indicate on a 12-lead ECG?',
      choices: ['The presence of dead myocardial tissue', 'Reversible myocardial ischemia', 'An acute coronary artery spasm'],
      correctIndex: 0,
      explanation: 'A pathologic Q wave is a highly specific marker of dead myocardial tissue, reflecting necrosis or permanent scar.',
    },
    {
      prompt: 'What minimum horizontal duration defines a pathologic Q wave?',
      choices: ['Less than 0.03 seconds', 'More than 0.04 seconds', 'Exactly 0.12 seconds'],
      correctIndex: 1,
      explanation: 'A pathologic Q wave is more than 0.04 seconds wide, roughly one small horizontal box.',
    },
    {
      prompt: 'Besides duration, what depth threshold defines a pathologic Q wave relative to the following R wave?',
      choices: ['More than one-tenth of the R-wave height', 'Exactly equal to the R-wave height', 'More than one-third of the R-wave height'],
      correctIndex: 2,
      explanation: 'A Q wave is pathologic if its depth is more than one-third of the height of the succeeding R wave in that lead.',
    },
    {
      prompt: 'Pathologic Q waves in leads II, III, and aVF indicate infarction of which left ventricular wall?',
      choices: ['Inferior wall', 'Anterior wall', 'Lateral wall'],
      correctIndex: 0,
      explanation: 'Leads II, III, and aVF face the inferior wall, so pathologic Q waves there indicate inferior myocardial necrosis.',
    },
    {
      prompt: 'Which clinical condition is a recognised cause of abnormal pathologic Q waves?',
      choices: ['Shortened PR interval', 'Myocardial infarction', 'Low voltage in the limb leads'],
      correctIndex: 1,
      explanation: 'Myocardial infarction is the primary clinical cause of abnormal Q waves because infarcted myocardium loses electrical activity.',
    },
    {
      prompt: 'If an infarction is strictly limited to the septal wall, where would pathologic changes be expected?',
      choices: ['Leads I and aVL', 'Leads V5 and V6', 'Leads V1 and V2'],
      correctIndex: 2,
      explanation: 'The interventricular septum is viewed by V1 and V2, so septal infarction produces changes in those leads.',
    },
    {
      prompt: 'When infarction extends across the anterior wall, which precordial leads show pathologic changes?',
      choices: ['Leads V1, V2, V3, and V4', 'Leads II, III, and aVF', 'Leads I, aVL, V5, and V6'],
      correctIndex: 0,
      explanation: 'Anterior wall infarction characteristically affects the anterior precordial leads V1 through V4.',
    },
    {
      prompt: 'What does a pathologic Q wave tell a clinician about the age of myocardial damage?',
      choices: ['It always represents an acute injury within the last 5 minutes.', 'It represents old, permanent damage to myocardium.', 'It indicates transient ischemia that resolves within an hour.'],
      correctIndex: 1,
      explanation: 'Pathologic Q waves classically mark permanent myocardial damage from a previous infarction, though they can also be seen during evolving MI.',
    },
    {
      prompt: 'Which admission ECG finding best confirms a historical inferior wall MI?',
      choices: ['Normal sinus rhythm with a heart rate of 75 bpm', 'Inverted T waves in leads I, aVL, and V6', 'Pathologic Q waves in leads II, III, and aVF'],
      correctIndex: 2,
      explanation: 'Pathologic Q waves in II, III, and aVF are evidence of inferior wall necrosis from a prior inferior MI.',
    },
    {
      prompt: 'Which wave is the first negative deflection of the QRS complex and signifies septal depolarisation?',
      choices: ['The Q wave', 'The R wave', 'The S wave'],
      correctIndex: 0,
      explanation: 'The Q wave is the first negative deflection of the QRS complex and normally reflects initial septal depolarisation.',
    },
    {
      prompt: 'The interventricular septum is normally supplied by which coronary artery?',
      choices: ['Right coronary artery', 'Left anterior descending coronary artery', 'Left circumflex artery'],
      correctIndex: 1,
      explanation: 'The LAD supplies the interventricular septum, including important conduction tissue.',
    },
    {
      prompt: 'A major LAD blockage causing septal damage can result in which conduction disturbance?',
      choices: ['Shortened PR intervals and narrow QRS complexes', 'Accelerated junctional rhythm at 90 bpm', 'Bundle branch blocks or high-grade AV blocks'],
      correctIndex: 2,
      explanation: 'Because the LAD supplies the septum and conduction system, septal infarction can cause RBBB, LBBB, Mobitz II, or complete heart block.',
    },
    {
      prompt: 'Why does an electrode over necrotic myocardium record a deep negative Q wave?',
      choices: ['Dead tissue is electrically silent, so the electrode records forces moving away from it.', 'Dead tissue generates abnormally strong positive vectors.', 'The electrode is recording atrial repolarisation.'],
      correctIndex: 0,
      explanation: 'Necrotic tissue is electrically silent, creating an electrical window through which forces moving away from the electrode are recorded.',
    },
    {
      prompt: 'T-wave inversion, ST elevation, and pathologic Q waves in II, III, and aVF indicate what?',
      choices: ['RBBB with secondary repolarisation changes', 'Acute inferior wall MI with ischemia, injury, and necrosis', 'Benign early repolarisation with normal axis'],
      correctIndex: 1,
      explanation: 'In inferior leads, Q waves indicate necrosis, ST elevation indicates active injury, and T-wave inversion indicates ischemia.',
    },
    {
      prompt: 'How does a physiological septal q wave differ from a pathologic Q wave?',
      choices: ['It is always wider than 0.08 seconds.', 'It is only seen during fast junctional tachycardias.', 'It is small, narrow, and shallow, representing normal septal activation.'],
      correctIndex: 2,
      explanation: 'Normal septal q waves are small, narrow, and shallow; pathologic Q waves are wider and deeper.',
    },
    {
      prompt: 'Why should pathologic Q waves be checked in contiguous leads rather than a single isolated lead?',
      choices: ['Contiguous leads represent a true anatomical region, while isolated Q waves can be normal variants.', 'Isolated Q waves always indicate pacemaker failure.', 'Non-contiguous Q waves suggest wandering atrial pacemaker.'],
      correctIndex: 0,
      explanation: 'Clinically meaningful ischemia, injury, or necrosis should appear in two or more contiguous leads viewing the same anatomical territory.',
    },
    {
      prompt: 'How can co-existing LBBB affect evaluation of pathologic Q waves?',
      choices: ['LBBB deletes all Q waves across all 12 leads.', 'LBBB can produce QS waves in V1 to V3 that mimic MI.', 'LBBB makes Q waves turn into upright R waves.'],
      correctIndex: 1,
      explanation: 'LBBB alters ventricular depolarisation and can create QS complexes in V1 to V3 that mimic septal or anterior MI.',
    },
    {
      prompt: 'Which lead grouping is most consistent with lateral wall infarction patterns?',
      choices: ['Leads II, III, and aVF', 'Leads V1 and V2 only', 'Leads I, aVL, V5, and V6'],
      correctIndex: 2,
      explanation: 'The lateral wall is viewed by I, aVL, V5, and V6, so pathologic Q waves there suggest lateral territory necrosis.',
    },
  ],
  'step.stSegment': [
    {
      prompt: 'What electrical events of the ventricles does the ST segment represent on an ECG tracing?',
      choices: ['The end of ventricular conduction and the beginning of ventricular recovery', 'The rapid spread of depolarisation through the bundle branch system', 'The total duration of supraventricular activity'],
      correctIndex: 0,
      explanation: 'The ST segment represents the end of ventricular conduction or depolarisation and the beginning of ventricular recovery or repolarisation.',
    },
    {
      prompt: 'What is the precise anatomical landmark marking where the QRS complex ends and the ST segment begins?',
      choices: ['The TP segment', 'The J point', 'The peak of the T wave'],
      correctIndex: 1,
      explanation: 'The J point, also called the ST junction, marks the exact boundary where the QRS complex terminates and the ST segment begins.',
    },
    {
      prompt: 'What is the correct anatomical location of the ST segment?',
      choices: ['It extends from the P wave to the onset of the Q wave.', 'It spans from the beginning of the Q wave to the end of the T wave.', 'It extends from the S wave to the beginning of the T wave.'],
      correctIndex: 2,
      explanation: 'The ST segment is located between the end of the S wave, or the R wave if no S wave is present, and the beginning of the T wave.',
    },
    {
      prompt: 'What is the expected deflection of a normal physiological ST segment?',
      choices: ['Isoelectric, flat on the baseline, with minimal deviation', 'Elevated at least 1 mm above the baseline in all leads', 'Depressed at least 0.5 mm below the baseline'],
      correctIndex: 0,
      explanation: 'A normal ST segment should be isoelectric or show only minimal deviation from the baseline.',
    },
    {
      prompt: 'Which ECG portion is used as the standard reference baseline for estimating the isoelectric line and ST displacement?',
      choices: ['The PR segment', 'The TP segment', 'The QT interval'],
      correctIndex: 1,
      explanation: 'When the heart rate is within normal limits, the TP segment is used as the reference baseline for ST-segment elevation or depression.',
    },
    {
      prompt: 'What does pathological ST-segment elevation of 1 mm or more above baseline indicate in acute coronary syndrome?',
      choices: ['Reversible subendocardial ischemia', 'Permanent myocardial necrosis or scar tissue', 'Myocardial injury in progress'],
      correctIndex: 2,
      explanation: 'ST-segment elevation corresponds with myocardial injury, usually from a prolonged lack of blood supply.',
    },
    {
      prompt: 'In acute coronary syndrome, what minimum ST depression in two or more contiguous leads is suggestive of ischemia?',
      choices: ['0.5 mm or more', '0.1 mm or more', '1.0 mm or more'],
      correctIndex: 0,
      explanation: 'ST depression of 0.5 mm or more below baseline in contiguous leads is suggestive of subendocardial myocardial ischemia.',
    },
    {
      prompt: 'In standard ECG leads other than V2 and V3, what minimum new J-point elevation is significant for myocardial injury?',
      choices: ['0.5 mm or more', '1 mm or more', '2 mm or more'],
      correctIndex: 1,
      explanation: 'For leads other than V2 and V3, new or presumed new ST elevation of 1 mm or more at the J point is suggestive of myocardial injury.',
    },
    {
      prompt: 'What is the clinical threshold for significant ST elevation specifically in leads V2 and V3?',
      choices: ['1 mm or more in both men and women of any age', '3 mm or more in men and 2.5 mm or more in women', '2 mm or more in men older than 40 years, or 1.5 mm or more in women'],
      correctIndex: 2,
      explanation: 'In V2 and V3, ST elevation is significant at 2 mm or more in men older than 40 years, or 1.5 mm or more in women.',
    },
    {
      prompt: 'To be clinically significant for acute coronary syndromes, ST elevation or depression must be present where?',
      choices: ['In two or more anatomically contiguous leads', 'In any single isolated lead', 'In all precordial chest leads simultaneously'],
      correctIndex: 0,
      explanation: 'Findings of ischemia, injury, or infarction are clinically significant when present in two or more contiguous leads viewing the same cardiac surface.',
    },
    {
      prompt: 'A patient with chest pain has ST elevation in leads II, III, and aVF. Which left ventricular wall is experiencing acute injury?',
      choices: ['Anterior wall', 'Inferior wall', 'Lateral wall'],
      correctIndex: 1,
      explanation: 'Leads II, III, and aVF view the inferior wall of the left ventricle, so ST elevation there indicates inferior wall injury.',
    },
    {
      prompt: 'If ST elevation is restricted to leads V1 and V2, which region of the left ventricle is affected?',
      choices: ['Lateral wall', 'Posterior wall', 'Septal wall'],
      correctIndex: 2,
      explanation: 'Leads V1 and V2 face the interventricular septum, so ST elevation there represents septal wall injury.',
    },
    {
      prompt: 'If ST elevation is identified in leads I, aVL, V5, and V6, where is the acute myocardial injury located?',
      choices: ['Lateral wall', 'Anterior wall', 'Septal wall'],
      correctIndex: 0,
      explanation: 'Leads I, aVL, V5, and V6 face the lateral wall of the left ventricle, indicating lateral wall injury.',
    },
    {
      prompt: 'Which ST-segment morphology is highly suggestive of myocardial ischemia?',
      choices: ['A gradually upward-sloping ST segment', 'A horizontal ST segment forming a sharp angle with the T wave', 'Diffuse concave ST elevation across all leads'],
      correctIndex: 1,
      explanation: 'A horizontal ST segment that forms a sharp angle with the T wave is a key ECG indicator suggestive of myocardial ischemia.',
    },
    {
      prompt: 'What classic effect does digoxin therapy have on the ST segment?',
      choices: ['Rapid, erratic baseline drift', 'Tall peaked elevation of the J point', 'Smooth scooped ST depression, sometimes called a dig dip'],
      correctIndex: 2,
      explanation: 'Digoxin causes a characteristic scooped depression of the ST segment, often called a digitalis scoop or dig dip.',
    },
    {
      prompt: 'How does ST elevation in acute pericarditis typically differ from localised myocardial infarction?',
      choices: ['It is diffuse across all or virtually all leads', 'It is confined to leads II, III, and aVF', 'It causes no ST-segment deviation'],
      correctIndex: 0,
      explanation: 'Unlike localised myocardial injury, acute pericarditis typically causes diffuse ST elevation across all or virtually all leads.',
    },
    {
      prompt: 'ST elevation in V2, V3, and V4 with elevated cardiac biomarkers points to injury involving which coronary artery?',
      choices: ['Right coronary artery', 'Left anterior descending coronary artery', 'Left circumflex artery'],
      correctIndex: 1,
      explanation: 'Leads V2, V3, and V4 face the anterior and septal walls, which are supplied by the left anterior descending coronary artery.',
    },
    {
      prompt: 'What happens to the ST segment once an acute myocardial infarction has resolved and entered the chronic phase?',
      choices: ['It remains permanently elevated above baseline', 'It becomes deeply and permanently depressed', 'It returns to the isoelectric baseline'],
      correctIndex: 2,
      explanation: 'After acute MI resolves, the ST segment returns to baseline, while pathological Q waves may persist because of scar formation.',
    },
  ],
  'step.tWaves': [
    {
      prompt: 'What physiological event does the T wave represent on a standard ECG?',
      choices: ['Ventricular repolarisation', 'Ventricular depolarisation', 'Atrial repolarisation'],
      correctIndex: 0,
      explanation: 'The T wave represents the recovery or repolarisation phase of the ventricular myocardium.',
    },
    {
      prompt: 'Which refractory period begins with QRS onset and ends at about the peak of the T wave?',
      choices: ['The relative refractory period', 'The absolute refractory period', 'The non-refractory period'],
      correctIndex: 1,
      explanation: 'The absolute refractory period begins with QRS onset and ends at approximately the T-wave peak, when myocardial cells cannot respond to another stimulus.',
    },
    {
      prompt: 'What is the clinical significance of T-wave inversion in a patient with acute coronary syndrome?',
      choices: ['Myocardial necrosis or infarction', 'Myocardial injury', 'Myocardial ischemia'],
      correctIndex: 2,
      explanation: 'In acute coronary syndrome, T-wave inversion corresponds with myocardial ischemia.',
    },
    {
      prompt: 'Which T-wave change is among the earliest ECG signs of an evolving transmural myocardial infarction?',
      choices: ['Broad, tall, symmetric hyperacute T waves', 'Pathologic Q waves', 'Horizontal ST-segment depression'],
      correctIndex: 0,
      explanation: 'Hyperacute T waves are often one of the earliest ECG changes in an evolving STEMI, sometimes appearing before ST elevation.',
    },
    {
      prompt: 'Tall, pointed, peaked T waves across multiple leads are most commonly associated with which electrolyte imbalance?',
      choices: ['Hypokalemia', 'Hyperkalemia', 'Hypercalcemia'],
      correctIndex: 1,
      explanation: 'Hyperkalemia classically produces tall, pointed, peaked T waves, especially when serum potassium rises above about 5.5 mEq/L.',
    },
    {
      prompt: 'In standard rhythm analysis, how is the normal T-wave deflection characterised in leads I, II, and V3 to V6?',
      choices: ['Inverted, with negative deflection', 'Biphasic, with positive and negative components', 'Upright, with positive deflection'],
      correctIndex: 2,
      explanation: 'In a normally conducted sinus beat, the T wave is upright in leads where the QRS is predominantly positive, including I, II, and V3 to V6.',
    },
    {
      prompt: 'Which standard limb lead is expected to show an inverted T wave in a normal healthy tracing?',
      choices: ['Lead aVR', 'Lead I', 'Lead II'],
      correctIndex: 0,
      explanation: 'Because normal electrical forces travel away from lead aVR, the P wave, QRS complex, and T wave are usually inverted there.',
    },
    {
      prompt: 'What is the normal shape of a physiological T wave?',
      choices: ['Sharp, narrow, and perfectly symmetric', 'Slightly asymmetric, with a gradual upslope and steeper downslope', 'Heavily notched, with a double-humped peak'],
      correctIndex: 1,
      explanation: 'A normal T wave is rounded and slightly asymmetric, with a gentle upstroke and steeper return to baseline.',
    },
    {
      prompt: 'Which vulnerable phase of ventricular recovery is represented by the downslope of the T wave?',
      choices: ['The absolute refractory period', 'Ventricular depolarisation', 'The relative refractory period'],
      correctIndex: 2,
      explanation: 'The relative refractory period begins near the T-wave peak and occupies the downslope, when a strong ectopic impulse can trigger dangerous arrhythmias.',
    },
    {
      prompt: 'Why is the R-on-T phenomenon clinically hazardous, especially during active myocardial ischemia?',
      choices: ['It can trigger polymorphic ventricular tachycardia or ventricular fibrillation.', 'It causes a sudden massive increase in right atrial voltage.', 'It results in first-degree AV block.'],
      correctIndex: 0,
      explanation: 'A premature ventricular complex landing on the T-wave downslope can trigger polymorphic ventricular tachycardia, torsades de pointes, or ventricular fibrillation.',
    },
    {
      prompt: 'Deeply inverted symmetric T waves greater than 10 mm deep are classically associated with what?',
      choices: ['Diuretic-induced hypokalemia', 'Acute central nervous system events or drug toxicities', 'Normal athletic training adaptation'],
      correctIndex: 1,
      explanation: 'Giant negative T waves are classically associated with acute CNS events such as intracranial haemorrhage or stroke, and with certain drug toxicities.',
    },
    {
      prompt: 'Which ECG change indicates myocardial injury, contrasting with T-wave inversion as a marker of ischemia?',
      choices: ['Pathologic Q waves', 'Prolonged PR interval', 'ST-segment elevation'],
      correctIndex: 2,
      explanation: 'Myocardial injury is represented by ST elevation; ischemia is represented by T-wave inversion, and necrosis by pathologic Q waves.',
    },
    {
      prompt: 'How can advanced age physiologically affect ECG intervals and waveforms, including the T wave?',
      choices: ['It may slightly reduce QRS voltage and mildly prolong PR, QRS, and QT intervals.', 'It naturally increases QRS voltage and shortens the PR interval.', 'It completely eliminates the absolute refractory period.'],
      correctIndex: 0,
      explanation: 'Normal ageing can cause decreased QRS amplitude, mild axis shifts, and slight prolongation of conduction intervals.',
    },
    {
      prompt: 'In complete left bundle branch block, what secondary T-wave changes are classically expected?',
      choices: ['T-wave concordance in the same direction as the wide QRS', 'Discordant ST depression and T-wave inversion opposite the terminal QRS force', 'Giant narrow peaked T waves exceeding 15 mm'],
      correctIndex: 1,
      explanation: 'Bundle branch block can produce secondary repolarisation abnormalities, with ST and T-wave changes deflecting opposite the terminal QRS force.',
    },
    {
      prompt: 'How does the T wave often appear in severe hypokalemia?',
      choices: ['Abnormally tall, sharp, and tented', 'Deeply inverted and symmetric beyond 10 mm', 'Low-amplitude or flattened, often followed by prominent U waves'],
      correctIndex: 2,
      explanation: 'Hypokalemia commonly flattens the T wave and is often accompanied by prominent rounded U waves.',
    },
    {
      prompt: 'A notch or distinct bump on the T wave during sinus rhythm is a useful clue for what?',
      choices: ['An embedded premature P wave from hidden atrial depolarisation', 'Right ventricular hypertrophy', 'Half-standard ECG calibration'],
      correctIndex: 0,
      explanation: 'A notched or distorted T wave can represent an embedded premature P wave, confirming ectopic atrial depolarisation.',
    },
    {
      prompt: 'Under standard calibration, what voltage does a vertical T-wave height of exactly 1 large box, or 5 mm, represent?',
      choices: ['0.1 mV', '0.5 mV', '1.0 mV'],
      correctIndex: 1,
      explanation: 'With standard calibration, 10 mm equals 1.0 mV, so one large vertical box of 5 mm represents 0.5 mV.',
    },
    {
      prompt: 'T-wave inversion in leads I, aVL, V5, and V6 suggests active ischemia in which ventricular wall?',
      choices: ['Inferior wall', 'Anterior wall', 'Lateral wall'],
      correctIndex: 2,
      explanation: 'Leads I, aVL, V5, and V6 view the lateral wall of the left ventricle, so T-wave inversion there suggests lateral wall ischemia.',
    },
  ],
  'step.qtInterval': [
    {
      prompt: 'What physiological cardiac phase does the QT interval represent?',
      choices: ['Total ventricular activity, from ventricular depolarisation to completion of repolarisation', 'Total supraventricular activity, including atrial conduction', 'The delay in electrical conduction across the atrioventricular node'],
      correctIndex: 0,
      explanation: 'The QT interval represents total ventricular activity, measured from the start of ventricular depolarisation to the end of ventricular repolarisation.',
    },
    {
      prompt: 'Where should calipers be placed to measure the absolute QT interval?',
      choices: ['From the beginning of the P wave to the end of the QRS complex', 'From the beginning of the QRS complex to the end of the T wave', 'From the J point to the apex of the T wave'],
      correctIndex: 1,
      explanation: 'The QT interval includes the QRS complex, ST segment, and T wave, and is measured from the first QRS deflection to the point where the T wave returns to baseline.',
    },
    {
      prompt: 'If a QRS complex lacks a Q wave, how is the QT interval measured?',
      choices: ['From the onset of the P wave to the end of the T wave', 'The QT interval cannot be measured without a Q wave', 'From the beginning of the R wave to the end of the T wave'],
      correctIndex: 2,
      explanation: 'If there is no Q wave, measurement begins at the onset of the upright R wave and continues to the end of the T wave; it is still called the QT interval.',
    },
    {
      prompt: 'Which leads are generally recommended for measuring the QT interval because they often show the clearest T-wave end?',
      choices: ['Precordial chest leads V2 and V3', 'Limb leads I and aVL', 'Inferior leads III and aVF'],
      correctIndex: 0,
      explanation: 'The QT interval is often longest and easiest to assess in V2 and V3, where the T-wave return to the isoelectric baseline is usually clear.',
    },
    {
      prompt: 'What is the bedside half-R-R rule of thumb used for during rapid ECG screening?',
      choices: ['Estimating atrial rate without counting small boxes', 'Quickly screening for suspected QT prolongation in regular rhythms', 'Determining whether the QRS complex is abnormally wide'],
      correctIndex: 1,
      explanation: 'In regular rhythms, the QT interval should not exceed half the preceding R-R interval; if it does, QT prolongation should be suspected and confirmed formally.',
    },
    {
      prompt: 'Under standard resting heart rate conditions, what is the typical absolute QT duration in healthy adults?',
      choices: ['0.12 to 0.20 seconds', '0.45 to 0.55 seconds', '0.36 to 0.44 seconds'],
      correctIndex: 2,
      explanation: 'At normal heart rates, the adult QT interval typically measures 0.36 to 0.44 seconds, or about 9 to 11 small boxes.',
    },
    {
      prompt: 'How does heart rate physiologically affect the absolute QT interval?',
      choices: ['It varies inversely: as heart rate increases, the absolute QT shortens.', 'It varies directly: as heart rate increases, the absolute QT lengthens.', 'It is fixed and unaffected by heart rate.'],
      correctIndex: 0,
      explanation: 'The QT interval is heart-rate dependent: faster heart rates shorten the absolute QT, while slower rates prolong it.',
    },
    {
      prompt: 'Why calculate the rate-corrected QT interval, or QTc, instead of relying only on the absolute QT?',
      choices: ['To mathematically eliminate muscle artifact', 'To standardise QT duration for comparison across different heart rates', 'To verify that the calibration spike is exactly 10 mm tall'],
      correctIndex: 1,
      explanation: 'Because the absolute QT varies with heart rate, QTc corrects it toward a standard heart rate so values can be interpreted and compared more reliably.',
    },
    {
      prompt: 'Which equation is the most widely used clinical standard for calculating QTc?',
      choices: ['Einthoven formula', 'The 1,500 rate calculation method', 'Bazett formula'],
      correctIndex: 2,
      explanation: 'Bazett formula is widely used clinically and divides the measured QT interval by the square root of the preceding R-R interval, both in seconds.',
    },
    {
      prompt: 'What is a major clinical limitation of Bazett formula?',
      choices: ['It overcorrects at rapid heart rates and undercorrects at slow heart rates.', 'It is completely inaccurate in normal sinus rhythm.', 'It can only be calculated using limb lead III.'],
      correctIndex: 0,
      explanation: 'Bazett formula tends to overcorrect QTc in tachycardia and undercorrect QTc in bradycardia.',
    },
    {
      prompt: 'What is the upper limit of a normal QTc interval in an adult male?',
      choices: ['Less than 0.40 seconds, or 400 ms', 'Less than 0.45 seconds, or 450 ms', 'Less than 0.48 seconds, or 480 ms'],
      correctIndex: 1,
      explanation: 'In adult men, a normal QTc is generally considered less than 0.45 seconds, or 450 ms.',
    },
    {
      prompt: 'What is the upper limit of a normal QTc interval in an adult female?',
      choices: ['Less than 0.42 seconds, or 420 ms', 'Less than 0.52 seconds, or 520 ms', 'Less than 0.46 seconds, or 460 ms'],
      correctIndex: 2,
      explanation: 'Women physiologically have slightly longer repolarisation phases, so the usual upper QTc threshold is less than 0.46 seconds, or 460 ms.',
    },
    {
      prompt: 'Which life-threatening polymorphic ventricular arrhythmia is associated with pathologically prolonged QTc?',
      choices: ['Torsades de pointes', 'Atrial fibrillation with rapid ventricular response', 'Junctional tachycardia'],
      correctIndex: 0,
      explanation: 'Pathological QTc prolongation creates ventricular repolarisation instability and can predispose to torsades de pointes.',
    },
    {
      prompt: 'At what QTc threshold does prolongation become an immediate high-risk hazard for torsades de pointes?',
      choices: ['When QTc exceeds 0.44 seconds', 'When QTc exceeds 0.50 seconds, or 500 ms', 'Only when the absolute QT exceeds 0.60 seconds'],
      correctIndex: 1,
      explanation: 'A QTc above 0.50 seconds, or 500 ms, is a critical safety threshold where torsades risk rises substantially.',
    },
    {
      prompt: 'Which antiarrhythmic drug is classically associated with acquired drug-induced QT prolongation?',
      choices: ['Lidocaine', 'Adenosine', 'Quinidine'],
      correctIndex: 2,
      explanation: 'Class Ia drugs such as quinidine or procainamide and Class III drugs such as amiodarone or sotalol can prolong QT and increase polymorphic VT risk.',
    },
    {
      prompt: 'Which electrolyte disturbances are most commonly associated with pathological QT prolongation?',
      choices: ['Hypokalemia and hypocalcemia', 'Hyperkalemia and hypercalcemia', 'Hypernatremia and hyperchloremia'],
      correctIndex: 0,
      explanation: 'Hypocalcemia prolongs phase 2 of the action potential, while hypokalemia delays phase 3 repolarisation; both can prolong QT.',
    },
    {
      prompt: 'What lower threshold defines a pathologically shortened QTc associated with accelerated ventricular repolarisation?',
      choices: ['0.42 seconds, or 420 ms, or less', '0.39 seconds, or 390 ms, or less', 'Exactly 0.35 seconds, or 350 ms'],
      correctIndex: 1,
      explanation: 'QTc is considered pathologically shortened when it measures 0.39 seconds, or 390 ms, or less.',
    },
    {
      prompt: 'Which clinical condition is a classic cause of pathological QT interval shortening?',
      choices: ['Hypokalemia', 'Left bundle branch block', 'Hypercalcemia or digoxin toxicity'],
      correctIndex: 2,
      explanation: 'Hypercalcemia shortens phase 2 and the ST segment, shortening QT; digoxin can also accelerate repolarisation and shorten QT.',
    },
  ],
  'step.lateWaves': [
    {
      prompt: 'What is a U wave on an ECG tracing?',
      choices: ['A small waveform that, when seen, follows the T wave', 'A positive deflection that immediately precedes the P wave', 'An abnormal negative deflection within the QRS complex'],
      correctIndex: 0,
      explanation: 'A U wave is a small waveform that may appear after the T wave.',
    },
    {
      prompt: 'What is the most common electrophysiological theory for the origin of the U wave?',
      choices: ['Depolarisation of the bundle of His', 'Late repolarisation of the Purkinje fibres', 'Atrial repolarisation'],
      correctIndex: 1,
      explanation: 'The U wave is most commonly thought to represent late repolarisation of the Purkinje fibres.',
    },
    {
      prompt: 'Besides Purkinje fibre repolarisation, what alternative mechanical theory may explain U waves?',
      choices: ['Accelerated depolarisation of the sinoatrial node', 'Spontaneous firing of an ectopic junctional pacemaker', 'Delayed repolarisation in ventricular regions undergoing late mechanical relaxation'],
      correctIndex: 2,
      explanation: 'Some cardiologists suggest U waves reflect delayed repolarisation in areas of the ventricle that relax mechanically late.',
    },
    {
      prompt: 'What is a third theory proposed to explain U waves on a resting ECG?',
      choices: ['They may be two-part T waves from longer action potential duration in some ventricular cells', 'They represent physical contraction of the papillary muscles', 'They are caused by respiratory baseline drift during inspiration'],
      correctIndex: 0,
      explanation: 'One theory proposes that U waves are two-part T waves caused by longer action potential duration in some ventricular myocardial cells.',
    },
    {
      prompt: 'Is a U wave expected to be present on every standard ECG rhythm strip?',
      choices: ['Yes, a visible U wave is mandatory in normal sinus rhythm.', 'No, a U wave is not present on every rhythm strip.', 'No, U waves occur only with permanent artificial pacemakers.'],
      correctIndex: 1,
      explanation: 'A U wave is not a constant finding and is absent on many normal rhythm strips.',
    },
    {
      prompt: 'A patient on furosemide has prominent U waves on the ECG monitor. Which condition is the most likely cause?',
      choices: ['Hypocalcemia', 'Pericarditis', 'Hypokalemia'],
      correctIndex: 2,
      explanation: 'Prominent U waves are a classic sign of hypokalemia, which can occur with potassium-wasting loop diuretics such as furosemide.',
    },
    {
      prompt: 'Besides hypokalemia, which electrolyte imbalance can lead to prominent U waves?',
      choices: ['Hypercalcemia', 'Hyponatremia', 'Hypomagnesemia'],
      correctIndex: 0,
      explanation: 'Prominent U waves may occur with hypokalemia, hypercalcemia, or digoxin toxicity.',
    },
    {
      prompt: 'Which cardiovascular medication is classically associated with prominent U waves?',
      choices: ['Atropine', 'Digoxin', 'Lidocaine'],
      correctIndex: 1,
      explanation: 'Digoxin therapy or toxicity is a recognised cause of prominent U waves on ECG.',
    },
    {
      prompt: 'Under normal physiological conditions, what is the expected polarity of a U wave?',
      choices: ['Inverted, with negative deflection', 'Biphasic', 'Upright, with positive deflection'],
      correctIndex: 2,
      explanation: 'A normal U wave is upright and usually deflects in the same direction as the preceding T wave.',
    },
    {
      prompt: 'In which leads is a normal U wave usually easiest to visualise and largest in amplitude?',
      choices: ['Precordial chest leads V2 and V3', 'Limb leads II, III, and aVF', 'Augmented leads aVR and aVL'],
      correctIndex: 0,
      explanation: 'Normal U waves are generally tallest and most prominent in V2 and V3.',
    },
    {
      prompt: 'How does heart rate affect identification of a U wave on a rhythm strip?',
      choices: ['U waves are only visible during tachycardias above 150 beats/minute.', 'They are best seen at slow rates and become difficult to identify as heart rate rises.', 'Heart rate has no effect on U-wave visibility.'],
      correctIndex: 1,
      explanation: 'U waves are rate-dependent: they are easier to see at slower rates and may be buried in adjacent T or P waves at faster rates.',
    },
    {
      prompt: 'What is the clinical significance of an inverted U wave in leads V2 to V5?',
      choices: ['It is normal in well-conditioned athletes.', 'It indicates first-degree AV block.', 'It is pathological, suggesting myocardial ischemia or severe systemic hypertension.'],
      correctIndex: 2,
      explanation: 'Inverted precordial U waves are abnormal and may be a specific marker of myocardial ischemia or severe hypertensive strain.',
    },
    {
      prompt: 'What is the typical amplitude of a normal physiological U wave?',
      choices: ['Less than 1 mm, or 0.1 mV', '2 to 3 mm, or 0.2 to 0.3 mV', 'More than 5 mm, or 0.5 mV'],
      correctIndex: 0,
      explanation: 'A normal U wave is very small, typically less than 1 mm high on a standard calibrated ECG grid.',
    },
    {
      prompt: 'During which cardiac phase does the U wave occur?',
      choices: ['Early ventricular depolarisation during systole', 'Late ventricular repolarisation during early diastole', 'During the absolute refractory period'],
      correctIndex: 1,
      explanation: 'Because U waves reflect late repolarisation or late mechanical relaxation, they occur after the T wave during late ventricular recovery and early diastole.',
    },
    {
      prompt: 'If prominent U waves appear in a patient taking furosemide, what is the most appropriate first clinical action?',
      choices: ['Increase the furosemide dose immediately.', 'Prepare for emergency synchronised cardioversion.', 'Check serum potassium and assess for clinical signs of hypokalemia.'],
      correctIndex: 2,
      explanation: 'Furosemide can waste potassium, so prominent U waves should prompt potassium assessment and replacement decisions as appropriate.',
    },
    {
      prompt: 'What diagnostic pitfall can prominent U waves create during QT interval measurement?',
      choices: ['They can be mistaken for T waves or included with T waves, overestimating QT.', 'They are frequently confused with delta waves in Wolff-Parkinson-White syndrome.', 'They make the machine miscalculate QRS duration as wide.'],
      correctIndex: 0,
      explanation: 'A large or fused U wave may be mistakenly included in QT measurement, causing artificial QTc prolongation.',
    },
    {
      prompt: 'In a normal healthy heart, how does the U-wave deflection relate to the preceding T wave?',
      choices: ['They are discordant, with the U wave always opposite the T wave.', 'They are concordant, with the U wave pointing in the same direction as the T wave.', 'The U wave is always biphasic regardless of T-wave direction.'],
      correctIndex: 1,
      explanation: 'Normal U waves are concordant with the preceding T wave, usually pointing in the same direction.',
    },
    {
      prompt: 'Why is a U wave rarely analysed during rapid sinus tachycardia above 120 beats/minute?',
      choices: ['Tachycardia completely halts Purkinje fibre repolarisation.', 'U waves occur only when heart rate is below 40 beats/minute.', 'Fast rates make the U wave merge with the preceding T wave or following P wave.'],
      correctIndex: 2,
      explanation: 'As heart rate increases, waveform crowding can swallow the U wave into the adjacent T or P wave, making it hard or impossible to identify.',
    },
  ],
  'step.finalReview': [
    {
      prompt: 'On standard ECG graph paper, what does the horizontal axis measure?',
      choices: ['Time', 'Electrical voltage', 'Amplitude'],
      correctIndex: 0,
      explanation: 'The horizontal axis of standard ECG paper measures time, while the vertical axis measures voltage or amplitude.',
    },
    {
      prompt: 'What height should a standard 1 mV calibration signal produce when the ECG machine is properly standardised?',
      choices: ['5 mm, or 1 large box', '10 mm, or 2 large boxes', '15 mm, or 3 large boxes'],
      correctIndex: 1,
      explanation: 'Standard calibration requires a 1 mV signal to produce a 10 mm deflection, equal to 10 small boxes or 2 large boxes.',
    },
    {
      prompt: 'What is the standard duration recorded in each individual lead window of a standard 12-lead ECG printout?',
      choices: ['1.0 second', '6.0 seconds', '2.5 seconds'],
      correctIndex: 2,
      explanation: 'A standard 12-lead ECG printout records a 2.5-second window of electrical activity for each lead.',
    },
    {
      prompt: 'Why is a continuous rhythm strip typically included at the bottom of a standard 12-lead ECG printout?',
      choices: ['Because a 2.5-second view is not long enough to properly assess rate and rhythm', 'To capture late electrical potentials that standard computers cannot detect', 'To eliminate muscle artifact from unipolar limb leads'],
      correctIndex: 0,
      explanation: 'A 2.5-second lead view may show representative complexes, but it is too short for reliable rate and rhythm assessment, so a continuous rhythm strip is included.',
    },
    {
      prompt: 'What should the clinician document directly on the ECG printout for clinical and administrative traceability?',
      choices: ['Patient name, room number, and date', 'Date, time, practitioner name, and special circumstances', 'Practitioner name, patient name, and signature only'],
      correctIndex: 1,
      explanation: 'The ECG should document date, time, practitioner name, and any special circumstances such as symptoms during the recording.',
    },
    {
      prompt: 'Which standard lead group is classified as bipolar limb leads?',
      choices: ['Leads aVR, aVL, and aVF', 'Leads V1, V2, and V3', 'Leads I, II, and III'],
      correctIndex: 2,
      explanation: 'The 12-lead ECG includes three bipolar limb leads: I, II, and III.',
    },
    {
      prompt: 'What electrical plane do the six limb leads provide information about?',
      choices: ['The frontal plane', 'The horizontal plane', 'The vertical plane'],
      correctIndex: 0,
      explanation: 'The limb leads provide information about the frontal plane, while the precordial leads provide horizontal-plane information.',
    },
    {
      prompt: 'What does a thick and unreadable baseline on an ECG tracing indicate?',
      choices: ['Wandering baseline', 'Artifact', 'Weak signal'],
      correctIndex: 1,
      explanation: 'A thick unreadable baseline is artifact, meaning the tracing is distorted by noncardiac electrical activity or movement.',
    },
    {
      prompt: 'Which option is a recognised technical cause of artifact on ECG recording?',
      choices: ['Blockage in the circumflex artery', 'Right ventricular chamber enlargement', 'Loose electrodes, broken wires, or muscle tremors'],
      correctIndex: 2,
      explanation: 'Artifact may be caused by loose electrodes, broken wires, cables, muscle tremor, patient movement, or 60-cycle interference.',
    },
    {
      prompt: 'How should a clinician prepare skin before electrode placement to minimise artifact?',
      choices: ['Rub the skin until it reddens', 'Press only the adhesive edge around the outside of the electrode', 'Wet the skin thoroughly with cold water'],
      correctIndex: 0,
      explanation: 'Proper skin preparation helps reduce artifact and includes rubbing the skin until it reddens before electrode placement.',
    },
    {
      prompt: 'Why is a signal-averaged ECG typically ordered after an acute myocardial infarction?',
      choices: ['To locate lateral and posterior wall damage', 'To identify risk for sudden death from sustained ventricular tachycardia', 'To differentiate first-degree and second-degree AV block'],
      correctIndex: 1,
      explanation: 'Signal-averaged ECG can detect late potentials that suggest post-MI risk for sustained ventricular tachycardia and sudden death.',
    },
    {
      prompt: 'What are anatomically contiguous leads?',
      choices: ['Leads recorded at different times on different days', 'Leads connected to the same physical limb electrode', 'Leads that view the same cardiac surface or area'],
      correctIndex: 2,
      explanation: 'Contiguous leads view the same cardiac surface, such as inferior, anterior, septal, or lateral territories.',
    },
    {
      prompt: 'Which contiguous leads directly face the septal wall of the interventricular septum?',
      choices: ['Leads V1 and V2', 'Leads V3 and V4', 'Leads V5 and V6'],
      correctIndex: 0,
      explanation: 'Leads V1 and V2 directly view the interventricular septum.',
    },
    {
      prompt: 'If Q waves or ST deviations are identified in II, III, and aVF, which surface is affected?',
      choices: ['Anterior surface', 'Inferior surface', 'Lateral surface'],
      correctIndex: 1,
      explanation: 'Leads II, III, and aVF look at the inferior surface of the left ventricle.',
    },
    {
      prompt: 'Lead I views which area of the heart?',
      choices: ['Inferior wall', 'Anterior wall', 'Lateral wall'],
      correctIndex: 2,
      explanation: 'Lead I, along with aVL, V5, and V6, views the lateral wall of the left ventricle.',
    },
    {
      prompt: 'Why can left bundle branch block cause a false-positive myocardial infarction diagnosis during final review?',
      choices: ['It can produce a QS pattern in V1 that resembles septal or anterior infarction', 'It completely eliminates all baseline QRS waves', 'It causes a delta wave that mimics acute ST elevation'],
      correctIndex: 0,
      explanation: 'LBBB alters ventricular activation and can produce a QS pattern in V1 that looks similar to septal or anterior infarction.',
    },
    {
      prompt: 'A shortened PR interval, widened QRS, and delta wave form the classic triad of what condition?',
      choices: ['First-degree AV block with LBBB', 'Wolff-Parkinson-White syndrome', 'Right ventricular hypertrophy with strain'],
      correctIndex: 1,
      explanation: 'Wolff-Parkinson-White syndrome classically shows a short PR interval, QRS widening, and a delta wave.',
    },
    {
      prompt: 'During final review, a patient taking furosemide has prominent U waves. What clinical parameter must be correlated?',
      choices: ['Serum calcium level for hypocalcemia', 'Heart rate for junctional bradycardia', 'Serum potassium level for hypokalemia'],
      correctIndex: 2,
      explanation: 'Furosemide is potassium-wasting, and prominent U waves should prompt correlation with serum potassium for possible hypokalemia.',
    },
  ],
} satisfies Partial<Record<keyof typeof ecgLearningTopics, LearningQuizQuestion[]>>;

export type LearningTopicId = keyof typeof ecgLearningTopics;

export function getLearningTopic(topicId?: LearningTopicId | string | null) {
  if (!topicId) return undefined;
  const topic = ecgLearningTopics[topicId as LearningTopicId];
  const quiz = ecgLearningQuizzes[topicId as keyof typeof ecgLearningQuizzes];

  if (!topic || !quiz) return topic;
  return { ...topic, quiz };
}
