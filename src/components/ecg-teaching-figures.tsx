import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, G, Line, Marker, Path, Pattern, Polygon, Rect, Text as SvgText } from 'react-native-svg';
import { Palette, Radius } from '@/constants/design';
import type { LearningFigureId } from '@/constants/ecgLearning';

export function TeachingFigure({ id }: { id: LearningFigureId }) {
  switch (id) {
    case 'ecg-grid-architecture':
      return (
        <FigureFrame title="ECG grid architecture">
          <GridArchitectureFigure />
        </FigureFrame>
      );
    case 'ecg-1500-method':
      return (
        <FigureFrame title="1500 method: count small boxes">
          <SmallBoxMethodFigure />
        </FigureFrame>
      );
    case 'ecg-sequence-method':
      return (
        <FigureFrame title="Sequence method: rapid estimate">
          <SequenceMethodFigure />
        </FigureFrame>
      );
    case 'p-wave-atrial-abnormalities':
      return (
        <FigureFrame title="P-wave morphology: normal, RAE, LAE">
          <PWaveAtrialAbnormalitiesFigure />
        </FigureFrame>
      );
    case 'p-wave-biphasic-v1':
      return (
        <FigureFrame title="Biphasic P wave in V1">
          <BiphasicV1Figure />
        </FigureFrame>
      );
    case 'p-wave-retrograde-conduction':
      return (
        <FigureFrame title="Retrograde P waves in junctional rhythms">
          <RetrogradeConductionFigure />
        </FigureFrame>
      );
    case 'pr-normal-vs-wpw':
      return (
        <FigureFrame title="PR measurement: normal vs WPW">
          <PrNormalVsWpwFigure />
        </FigureFrame>
      );
    case 'pr-first-degree-wenckebach':
      return (
        <FigureFrame title="AV block: first-degree vs Wenckebach">
          <FirstDegreeWenckebachFigure />
        </FigureFrame>
      );
    case 'pr-mobitz-ii-complete-block':
      return (
        <FigureFrame title="AV block: Mobitz II vs complete block">
          <MobitzCompleteBlockFigure />
        </FigureFrame>
      );
    case 'rhythm-decision-tree':
      return (
        <FigureFrame title="Rhythm synthesis decision tree">
          <RhythmDecisionTreeFigure />
        </FigureFrame>
      );
    case 'rhythm-synthesis-dashboard':
      return (
        <FigureFrame title="Synthesis validation dashboard">
          <RhythmSynthesisDashboardFigure />
        </FigureFrame>
      );
    case 'rhythm-av-association':
      return (
        <FigureFrame title="1:1 association vs AV dissociation">
          <RhythmAssociationFigure />
        </FigureFrame>
      );
    case 'qrs-measurement-calibration':
      return (
        <FigureFrame title="QRS measurement and calibration">
          <QrsMeasurementCalibrationFigure />
        </FigureFrame>
      );
    case 'qrs-bbb-v1-patterns':
      return (
        <FigureFrame title="Lead V1 BBB morphology">
          <QrsBbbV1Figure />
        </FigureFrame>
      );
    case 'qrs-r-wave-progression':
      return (
        <FigureFrame title="R-wave progression">
          <QrsRWaveProgressionFigure />
        </FigureFrame>
      );
    case 'qrs-ventricular-hypertrophy':
      return (
        <FigureFrame title="Ventricular hypertrophy voltage patterns">
          <QrsHypertrophyFigure />
        </FigureFrame>
      );
    case 'axis-hexaxial-wheel':
      return (
        <FigureFrame title="Hexaxial reference wheel">
          <AxisHexaxialWheelFigure />
        </FigureFrame>
      );
    case 'axis-quadrants':
      return (
        <FigureFrame title="Four clinical axis quadrants">
          <AxisQuadrantsFigure />
        </FigureFrame>
      );
    case 'axis-quadrant-method':
      return (
        <FigureFrame title="Quadrant method matrix">
          <AxisQuadrantMethodFigure />
        </FigureFrame>
      );
    case 'axis-lead-ii-tiebreaker':
      return (
        <FigureFrame title="Lead II tiebreaker for LAD">
          <AxisLeadIITiebreakerFigure />
        </FigureFrame>
      );
    case 'axis-degree-method':
      return (
        <FigureFrame title="Precise axis degree method">
          <AxisDegreeMethodFigure />
        </FigureFrame>
      );
    case 'axis-vector-shifts':
      return (
        <FigureFrame title="Pathological vector shifts">
          <AxisVectorShiftsFigure />
        </FigureFrame>
      );
    case 'qwave-criteria':
      return (
        <FigureFrame title="Physiological vs pathological Q waves">
          <QWaveCriteriaFigure />
        </FigureFrame>
      );
    case 'qwave-electrical-window':
      return (
        <FigureFrame title="Why pathological Q waves form">
          <QWaveElectricalWindowFigure />
        </FigureFrame>
      );
    case 'qwave-territory-map':
      return (
        <FigureFrame title="Q-wave territory localization">
          <QWaveTerritoryMapFigure />
        </FigureFrame>
      );
    case 'st-measurement-landmarks':
      return (
        <FigureFrame title="ST measurement landmarks">
          <StMeasurementLandmarksFigure />
        </FigureFrame>
      );
    case 'st-elevation-thresholds':
      return (
        <FigureFrame title="ST elevation thresholds">
          <StElevationThresholdsFigure />
        </FigureFrame>
      );
    case 'st-depression-digoxin':
      return (
        <FigureFrame title="ST depression vs digoxin effect">
          <StDepressionDigoxinFigure />
        </FigureFrame>
      );
    case 'st-lbbb-discordance':
      return (
        <FigureFrame title="Secondary ST-T discordance">
          <StLbbbDiscordanceFigure />
        </FigureFrame>
      );
    case 'twave-normal-anatomy':
      return (
        <FigureFrame title="Normal T-wave anatomy">
          <TWaveNormalAnatomyFigure />
        </FigureFrame>
      );
    case 'twave-inversions':
      return (
        <FigureFrame title="T-wave inversion patterns">
          <TWaveInversionsFigure />
        </FigureFrame>
      );
    case 'twave-hyperkalemia-hyperacute':
      return (
        <FigureFrame title="Peaked vs hyperacute T waves">
          <TWavePeakedHyperacuteFigure />
        </FigureFrame>
      );
    case 'twave-notched':
      return (
        <FigureFrame title="Notched T-wave differentials">
          <TWaveNotchedFigure />
        </FigureFrame>
      );
    case 'qt-measurement-landmarks':
      return (
        <FigureFrame title="QT measurement landmarks">
          <QtMeasurementLandmarksFigure />
        </FigureFrame>
      );
    case 'qt-rate-correction':
      return (
        <FigureFrame title="QTc and rate correction">
          <QtRateCorrectionFigure />
        </FigureFrame>
      );
    case 'qt-prolongation-torsades':
      return (
        <FigureFrame title="Prolonged QT and torsades risk">
          <QtProlongationTorsadesFigure />
        </FigureFrame>
      );
    case 'qt-shortening-causes':
      return (
        <FigureFrame title="Short QT causes">
          <QtShorteningCausesFigure />
        </FigureFrame>
      );
    case 'uwave-prominent-hypokalemia':
      return (
        <FigureFrame title="Prominent U waves in hypokalemia">
          <UWaveProminentHypokalemiaFigure />
        </FigureFrame>
      );
    case 'uwave-inverted-ischemia':
      return (
        <FigureFrame title="Inverted U waves">
          <UWaveInvertedIschemiaFigure />
        </FigureFrame>
      );
    case 'final-technical-validation':
      return (
        <FigureFrame title="Technical validation and calibration">
          <FinalTechnicalValidationFigure />
        </FigureFrame>
      );
    case 'final-evidence-integration':
      return (
        <FigureFrame title="Interdependent evidence integration">
          <FinalEvidenceIntegrationFigure />
        </FigureFrame>
      );
    case 'final-workflow-map':
      return (
        <FigureFrame title="12-step ECG analysis workflow">
          <FinalWorkflowMapFigure />
        </FigureFrame>
      );
    default:
      return null;
  }
}

function FigureFrame({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.frame}>
      <Text style={styles.figureTitle}>{title}</Text>
      <View style={styles.svgWrap}>{children}</View>
    </View>
  );
}

function GridArchitectureFigure() {
  return (
    <Svg accessibilityLabel="ECG grid architecture teaching figure" style={styles.svg} viewBox="0 0 600 450">
      <Defs>
        <Pattern height="10" id="smallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M 10 0 L 0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallGrid)" height="50" width="50" />
          <Path d="M 50 0 L 0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="arrowRose" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#C4493D" />
        </Marker>
        <Marker id="arrowSlate" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#2C3E50" />
        </Marker>
      </Defs>

      <Rect fill="#FFF8F7" height="450" rx="18" width="600" />
      <SvgText fill="#2C3E50" fontSize="24" fontWeight="800" x="34" y="42">
        Standard ECG paper
      </SvgText>

      <Rect fill="url(#largeGrid)" height="250" rx="3" stroke="#E87A75" strokeWidth="1.5" width="250" x="40" y="80" />
      <Rect fill="rgba(232, 122, 117, 0.16)" height="50" stroke="#C4493D" strokeDasharray="7 5" strokeWidth="2" width="50" x="140" y="180" />
      <SvgText fill="#2C3E50" fontSize="13" fontWeight="800" textAnchor="middle" x="165" y="171">
        1 large box
      </SvgText>
      <Rect fill="rgba(196, 73, 61, 0.18)" height="10" stroke="#C4493D" strokeWidth="1.5" width="10" x="200" y="240" />

      <Line markerEnd="url(#arrowSlate)" markerStart="url(#arrowSlate)" stroke="#2C3E50" strokeWidth="2" x1="40" x2="90" y1="354" y2="354" />
      <SvgText fill="#2C3E50" fontSize="14" fontWeight="800" x="40" y="382">
        5 mm = 0.20 s
      </SvgText>
      <Line markerEnd="url(#arrowSlate)" markerStart="url(#arrowSlate)" stroke="#2C3E50" strokeWidth="2" x1="306" x2="306" y1="80" y2="130" />
      <SvgText fill="#2C3E50" fontSize="13" fontWeight="800" textAnchor="end" x="292" y="103">
        5 mm high
      </SvgText>
      <SvgText fill="#2C3E50" fontSize="13" fontWeight="800" textAnchor="end" x="292" y="123">
        = 0.5 mV
      </SvgText>

      <Rect fill="#FFF8F7" height="28" rx="14" stroke="#F0C9C5" width="130" x="180" y="256" />
      <Line markerEnd="url(#arrowRose)" markerStart="url(#arrowRose)" stroke="#C4493D" strokeWidth="2" x1="200" x2="210" y1="270" y2="270" />
      <Line stroke="#C4493D" strokeDasharray="3 3" strokeWidth="1.5" x1="200" x2="200" y1="250" y2="256" />
      <Line stroke="#C4493D" strokeDasharray="3 3" strokeWidth="1.5" x1="210" x2="210" y1="250" y2="256" />
      <SvgText fill="#C4493D" fontSize="13" fontWeight="900" x="224" y="275">
        1 mm = 0.04 s
      </SvgText>
      <Rect fill="#FFF8F7" height="28" rx="14" stroke="#F0C9C5" width="78" x="218" y="218" />
      <Line markerEnd="url(#arrowRose)" markerStart="url(#arrowRose)" stroke="#C4493D" strokeWidth="2" x1="222" x2="222" y1="240" y2="250" />
      <Line stroke="#C4493D" strokeDasharray="3 3" strokeWidth="1.5" x1="210" x2="218" y1="240" y2="240" />
      <Line stroke="#C4493D" strokeDasharray="3 3" strokeWidth="1.5" x1="210" x2="218" y1="250" y2="250" />
      <SvgText fill="#C4493D" fontSize="13" fontWeight="900" x="237" y="237">
        0.1 mV
      </SvgText>

      <G>
        <Path d="M398 304 L398 204 L448 204 L448 304" fill="none" stroke="#1E3A8A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <Line markerEnd="url(#arrowSlate)" markerStart="url(#arrowSlate)" stroke="#2C3E50" strokeWidth="2" x1="472" x2="472" y1="204" y2="304" />
        <SvgText fill="#2C3E50" fontSize="16" fontWeight="900" textAnchor="middle" x="423" y="336">
          Calibration spike
        </SvgText>
        <SvgText fill="#2C3E50" fontSize="14" x="492" y="240">
          10 mm
        </SvgText>
        <SvgText fill="#2C3E50" fontSize="14" x="492" y="262">
          = 1.0 mV
        </SvgText>
      </G>

      <Rect fill="#FFFFFF" height="96" rx="12" stroke="#F0C9C5" width="208" x="354" y="72" />
      <SvgText fill="#2C3E50" fontSize="15" fontWeight="800" x="374" y="102">
        Time axis
      </SvgText>
      <SvgText fill="#2C3E50" fontSize="13" x="374" y="126">
        1 small box = 0.04 s
      </SvgText>
      <SvgText fill="#2C3E50" fontSize="13" x="374" y="148">
        1 large box = 0.20 s
      </SvgText>
    </Svg>
  );
}

function SmallBoxMethodFigure() {
  return (
    <Svg accessibilityLabel="1500 method R-R interval teaching figure" style={styles.svgWide} viewBox="0 0 800 300">
      <Defs>
        <Pattern height="10" id="smallStrip" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#F6C3C1" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeStrip" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallStrip)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E56E6A" strokeWidth="1.4" />
        </Pattern>
        <Marker id="arrowAmber" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#D97706" />
        </Marker>
      </Defs>

      <Rect fill="#FFF9F9" height="300" rx="16" width="800" />
      <Rect fill="url(#largeStrip)" height="170" rx="4" stroke="#E56E6A" strokeWidth="1.5" width="520" x="20" y="78" />
      <Path
        d="M40 178 C55 178 58 173 66 173 C74 173 78 178 88 178 L104 178 L112 196 L120 104 L128 202 L138 178 C152 178 158 168 172 160 C190 150 208 178 230 178 L304 178 L312 196 L320 104 L328 202 L338 178 C352 178 358 168 372 160 C390 150 408 178 430 178 L504 178 L512 196 L520 104 L528 202 L538 178"
        fill="none"
        stroke="#1E3A8A"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <Line stroke="#059669" strokeDasharray="7 6" strokeWidth="2" x1="120" x2="120" y1="58" y2="248" />
      <Line stroke="#059669" strokeDasharray="7 6" strokeWidth="2" x1="320" x2="320" y1="58" y2="248" />
      <Line markerEnd="url(#arrowAmber)" markerStart="url(#arrowAmber)" stroke="#D97706" strokeWidth="3" x1="120" x2="320" y1="56" y2="56" />
      <Rect fill="#FFFBEB" height="34" rx="17" stroke="#D97706" width="210" x="115" y="20" />
      <SvgText fill="#92400E" fontSize="15" fontWeight="800" textAnchor="middle" x="220" y="42">
        20 small boxes (4 large boxes)
      </SvgText>
      <Circle cx="120" cy="104" fill="#059669" r="5" />
      <Circle cx="320" cy="104" fill="#059669" r="5" />

      <Rect fill="#FFFFFF" height="150" rx="16" stroke="#DDE7F2" width="210" x="566" y="74" />
      <SvgText fill="#1E3A8A" fontSize="18" fontWeight="900" x="586" y="108">
        1500 method
      </SvgText>
      <SvgText fill="#2C3E50" fontSize="14" x="586" y="138">
        Heart rate =
      </SvgText>
      <SvgText fill="#2C3E50" fontSize="15" fontWeight="800" x="586" y="162">
        1500 / small boxes
      </SvgText>
      <Line stroke="#E5E7EB" strokeWidth="1" x1="586" x2="754" y1="178" y2="178" />
      <SvgText fill="#059669" fontSize="15" fontWeight="900" x="586" y="204">
        1500 / 20 = 75 bpm
      </SvgText>
      <SvgText fill="#64748B" fontSize="12" x="586" y="224">
        Ventricular rate from R-R
      </SvgText>
    </Svg>
  );
}

function SequenceMethodFigure() {
  const sequence = ['300', '150', '100', '75', '60', '50', '43', '37'];
  return (
      <Svg accessibilityLabel="ECG sequence method countdown teaching figure" style={styles.svgCountdown} viewBox="0 0 800 350">
      <Defs>
        <Pattern height="10" id="smallCountdown" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#F7C8C5" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="70" id="largeCountdown" patternUnits="userSpaceOnUse" width="70">
          <Rect fill="url(#smallCountdown)" height="70" width="70" />
          <Path d="M70 0 L0 0 0 70" fill="none" stroke="#E56E6A" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="350" rx="16" width="800" />
      <SvgText fill="#1E293B" fontSize="22" fontWeight="900" x="32" y="42">
        Countdown from an anchor R wave
      </SvgText>
      <Rect fill="url(#largeCountdown)" height="170" rx="4" stroke="#E56E6A" strokeWidth="1.5" width="700" x="30" y="104" />

      <Line stroke="#991B1B" strokeWidth="4" x1="100" x2="100" y1="94" y2="285" />
      <SvgText fill="#991B1B" fontSize="13" fontWeight="900" textAnchor="middle" x="100" y="86">
        Start / anchor R
      </SvgText>

      {sequence.map((value, index) => {
        const x = 100 + (index + 1) * 70;
        const isLanding = value === '75';
        return (
          <G key={value}>
            <Line stroke={isLanding ? '#059669' : '#991B1B'} strokeOpacity={isLanding ? 0.9 : 0.35} strokeWidth={isLanding ? 4 : 2} x1={x} x2={x} y1="104" y2="274" />
            <Circle cx={x} cy="306" fill={isLanding ? '#059669' : '#991B1B'} r="23" />
            <SvgText fill="#FFFFFF" fontSize="15" fontWeight="900" textAnchor="middle" x={x} y="312">
              {value}
            </SvgText>
          </G>
        );
      })}

      <Path
        d="M54 190 L84 190 L92 210 L100 122 L108 214 L118 190 L344 190 L372 190 L380 122 L388 214 L398 190 L706 190"
        fill="none"
        stroke="#1E293B"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
      />
      <Polygon fill="#059669" points="380,72 366,96 394,96" />
      <SvgText fill="#059669" fontSize="15" fontWeight="900" textAnchor="middle" x="380" y="62">
        lands on 75 bpm
      </SvgText>
      <Rect fill="#FFFFFF" height="42" rx="21" stroke="#D1FAE5" width="245" x="484" y="38" />
      <SvgText fill="#1E293B" fontSize="13" fontWeight="800" x="504" y="64">
        Read the number at the next R peak
      </SvgText>
    </Svg>
  );
}

function PWaveAtrialAbnormalitiesFigure() {
  return (
    <Svg accessibilityLabel="Normal P wave compared with right and left atrial enlargement" style={styles.svgPWavePanels} viewBox="0 0 900 350">
      <Defs>
        <Pattern height="10" id="smallPWaveGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largePWaveGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallPWaveGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="pArrowAmber" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#D97706" />
        </Marker>
      </Defs>

      <Rect fill="#FFF8F7" height="350" rx="18" width="900" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="28" y="38">
        Atrial abnormality patterns in Lead II
      </SvgText>

      <G>
        <Rect fill="url(#largePWaveGrid)" height="210" rx="10" stroke="#E87A75" strokeWidth="1.2" width="260" x="26" y="74" />
        <SvgText fill="#0F172A" fontSize="15" fontWeight="900" x="42" y="102">
          Normal P wave
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="42" y="122">
          {'<=2.5 mm, <0.12 s'}
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.4" x1="42" x2="270" y1="208" y2="208" />
        <Path d="M74 208 C94 208 98 188 118 188 C138 188 142 208 164 208" fill="none" stroke="#0F172A" strokeLinecap="round" strokeWidth="3" />
        <Line markerEnd="url(#pArrowAmber)" markerStart="url(#pArrowAmber)" stroke="#D97706" strokeWidth="2" x1="118" x2="118" y1="188" y2="208" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="800" x="132" y="200">
          2 mm
        </SvgText>
        <Line markerEnd="url(#pArrowAmber)" markerStart="url(#pArrowAmber)" stroke="#D97706" strokeWidth="2" x1="74" x2="164" y1="242" y2="242" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="800" textAnchor="middle" x="119" y="264">
          0.08 s
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largePWaveGrid)" height="210" rx="10" stroke="#E87A75" strokeWidth="1.2" width="260" x="320" y="74" />
        <SvgText fill="#0F172A" fontSize="15" fontWeight="900" x="336" y="102">
          P pulmonale / RAE
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="336" y="122">
          {'Tall, peaked >2.5 mm'}
        </SvgText>
        <Rect fill="rgba(217, 119, 6, 0.15)" height="68" rx="8" width="54" x="420" y="142" />
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.4" x1="336" x2="564" y1="208" y2="208" />
        <Path d="M370 208 C402 208 416 146 450 146 C484 146 498 208 530 208" fill="none" stroke="#0F172A" strokeLinecap="round" strokeWidth="3" />
        <Line markerEnd="url(#pArrowAmber)" markerStart="url(#pArrowAmber)" stroke="#D97706" strokeWidth="2" x1="450" x2="450" y1="146" y2="208" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="800" x="464" y="176">
          3.5 mm
        </SvgText>
        <SvgText fill="#92400E" fontSize="12" fontWeight="800" x="414" y="232">
          narrow duration
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largePWaveGrid)" height="210" rx="10" stroke="#E87A75" strokeWidth="1.2" width="260" x="614" y="74" />
        <SvgText fill="#0F172A" fontSize="15" fontWeight="900" x="630" y="102">
          P mitrale / LAE
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="630" y="122">
          {'Wide, notched >=0.12 s'}
        </SvgText>
        <Rect fill="rgba(217, 119, 6, 0.15)" height="42" rx="8" width="138" x="674" y="166" />
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.4" x1="630" x2="858" y1="208" y2="208" />
        <Path d="M654 208 C674 208 682 188 700 188 C714 188 716 202 724 202 C732 202 736 188 754 188 C778 188 790 208 812 208" fill="none" stroke="#0F172A" strokeLinecap="round" strokeWidth="3" />
        <Line markerEnd="url(#pArrowAmber)" markerStart="url(#pArrowAmber)" stroke="#D97706" strokeWidth="2" x1="654" x2="812" y1="242" y2="242" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="800" textAnchor="middle" x="733" y="264">
          0.14 s, double-humped
        </SvgText>
      </G>
    </Svg>
  );
}

function BiphasicV1Figure() {
  return (
    <Svg accessibilityLabel="Biphasic P wave physiology in lead V1" style={styles.svgBiphasic} viewBox="0 0 800 400">
      <Defs>
        <Pattern height="10" id="smallV1Grid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeV1Grid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallV1Grid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="arrowGreen" markerHeight="9" markerWidth="9" orient="auto" refX="4.5" refY="4.5">
          <Path d="M0,0 L9,4.5 L0,9 Z" fill="#047857" />
        </Marker>
        <Marker id="arrowRuby" markerHeight="9" markerWidth="9" orient="auto" refX="4.5" refY="4.5">
          <Path d="M0,0 L9,4.5 L0,9 Z" fill="#B91C1C" />
        </Marker>
      </Defs>

      <Rect fill="#FFF8F7" height="400" rx="18" width="800" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="28" y="42">
        Biphasic P wave in V1
      </SvgText>

      <G>
        <SvgText fill="#334155" fontSize="15" fontWeight="900" x="54" y="88">
          Atrial vectors
        </SvgText>
        <Path d="M92 168 C92 112 172 100 214 146 C248 104 328 122 326 180 C324 240 250 256 214 218 C174 260 92 236 92 168 Z" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="2" />
        <Circle cx="142" cy="138" fill="#FBBF24" r="10" stroke="#92400E" strokeWidth="1.5" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="900" textAnchor="middle" x="142" y="120">
          SA
        </SvgText>
        <Line markerEnd="url(#arrowGreen)" stroke="#047857" strokeWidth="4" x1="152" x2="230" y1="158" y2="132" />
        <Line markerEnd="url(#arrowRuby)" stroke="#B91C1C" strokeWidth="4" x1="220" x2="162" y1="186" y2="224" />
        <SvgText fill="#047857" fontSize="13" fontWeight="800" x="238" y="126">
          Right atrial vector
        </SvgText>
        <SvgText fill="#047857" fontSize="12" x="238" y="144">
          anterior / positive
        </SvgText>
        <SvgText fill="#B91C1C" fontSize="13" fontWeight="800" x="46" y="260">
          Left atrial vector
        </SvgText>
        <SvgText fill="#B91C1C" fontSize="12" x="46" y="278">
          posterior / negative
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largeV1Grid)" height="210" rx="12" stroke="#E87A75" strokeWidth="1.2" width="350" x="416" y="86" />
        <SvgText fill="#1E40AF" fontSize="15" fontWeight="900" x="436" y="116">
          Lead V1 trace
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.4" x1="436" x2="744" y1="198" y2="198" />
        <Path d="M470 198 C488 198 494 174 512 174 C530 174 536 198 550 198" fill="none" stroke="#047857" strokeLinecap="round" strokeWidth="3" />
        <Path d="M550 198 C564 198 570 226 588 226 C606 226 614 198 630 198" fill="none" stroke="#B91C1C" strokeLinecap="round" strokeWidth="3" />
        <SvgText fill="#047857" fontSize="12" fontWeight="900" x="454" y="156">
          RA positive deflection
        </SvgText>
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="566" y="252">
          LA terminal negative
        </SvgText>
        <Rect fill="rgba(185, 28, 28, 0.12)" height="68" rx="10" stroke="#B91C1C" strokeDasharray="5 5" width="92" x="646" y="190" />
        <Path d="M660 198 C674 198 680 238 700 238 C722 238 728 198 738 198" fill="none" stroke="#B91C1C" strokeLinecap="round" strokeWidth="3" />
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="638" y="278">
          LAE clue: deep/wide terminal force
        </SvgText>
      </G>
    </Svg>
  );
}

function RetrogradeConductionFigure() {
  return (
    <Svg accessibilityLabel="Junctional retrograde P waves in lead II" style={styles.svgRetrograde} viewBox="0 0 950 300">
      <Defs>
        <Pattern height="10" id="smallRetroGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeRetroGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallRetroGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="arrowOrange" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#EA580C" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="300" rx="18" width="950" />
      <SvgText fill="#334155" fontSize="23" fontWeight="900" x="28" y="38">
        Junctional retrograde conduction in Lead II
      </SvgText>

      <G>
        <Rect fill="url(#largeRetroGrid)" height="150" rx="10" stroke="#E87A75" strokeWidth="1.2" width="278" x="28" y="70" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="42" y="96">
          Retrograde: P precedes QRS
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="42" x2="292" y1="152" y2="152" />
        <Path d="M54 152 L96 152 C108 152 112 170 126 170 C140 170 144 152 154 152 L174 152 L182 174 L190 100 L198 176 L208 152 L286 152" fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line markerEnd="url(#arrowOrange)" markerStart="url(#arrowOrange)" stroke="#EA580C" strokeWidth="2" x1="126" x2="190" y1="202" y2="202" />
        <SvgText fill="#EA580C" fontSize="12" fontWeight="900" textAnchor="middle" x="158" y="238">
          short PR &lt;0.12 s
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largeRetroGrid)" height="150" rx="10" stroke="#E87A75" strokeWidth="1.2" width="278" x="336" y="70" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="350" y="96">
          Simultaneous: P buried in QRS
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="350" x2="600" y1="152" y2="152" />
        <Path d="M362 152 L462 152 L470 174 L478 100 L486 176 L496 152 L598 152" fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Circle cx="478" cy="138" fill="none" r="36" stroke="#EA580C" strokeDasharray="5 5" strokeWidth="2.5" />
        <SvgText fill="#EA580C" fontSize="12" fontWeight="900" textAnchor="middle" x="478" y="238">
          P wave hidden
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largeRetroGrid)" height="150" rx="10" stroke="#E87A75" strokeWidth="1.2" width="278" x="644" y="70" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="658" y="96">
          Retrograde: P follows QRS
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="658" x2="908" y1="152" y2="152" />
        <Path d="M670 152 L736 152 L744 174 L752 100 L760 176 L770 152 C784 152 788 170 802 170 C816 170 820 152 834 152 L908 152" fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Rect fill="rgba(234, 88, 12, 0.12)" height="40" rx="8" width="58" x="774" y="146" />
        <SvgText fill="#EA580C" fontSize="12" fontWeight="900" textAnchor="middle" x="804" y="238">
          inverted P on early ST
        </SvgText>
      </G>

      <SvgText fill="#334155" fontSize="13" fontWeight="800" x="46" y="270">
        Note: retrograde conduction depolarizes atria away from Lead II, producing negative P waves in inferior leads.
      </SvgText>
    </Svg>
  );
}

function PrNormalVsWpwFigure() {
  return (
    <Svg accessibilityLabel="PR interval measurement compared with WPW pre-excitation" style={styles.svgPrCompare} viewBox="0 0 900 400">
      <Defs>
        <Pattern height="10" id="smallPrGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largePrGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallPrGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="arrowEmerald" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
        </Marker>
        <Marker id="arrowRed" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
        </Marker>
        <Marker id="arrowOrangePr" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#EA580C" />
        </Marker>
      </Defs>

      <Rect fill="#FFF8F7" height="400" rx="18" width="900" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="28" y="42">
        Measuring from P onset to QRS onset
      </SvgText>

      <G>
        <Rect fill="url(#largePrGrid)" height="250" rx="12" stroke="#E87A75" strokeWidth="1.2" width="400" x="30" y="76" />
        <SvgText fill="#0F172A" fontSize="16" fontWeight="900" x="50" y="108">
          Normal PR interval
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="50" y="128">
          0.12-0.20 s, here 0.16 s
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="52" x2="406" y1="214" y2="214" />
        <Path d="M68 214 C86 214 92 194 110 194 C128 194 134 214 150 214 L228 214 L238 238 L246 150 L254 238 L264 214 C278 214 284 202 300 196 C326 186 344 214 372 214" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line stroke="#059669" strokeDasharray="5 5" strokeWidth="2" x1="68" x2="68" y1="166" y2="276" />
        <Line stroke="#059669" strokeDasharray="5 5" strokeWidth="2" x1="228" x2="228" y1="166" y2="276" />
        <Line markerEnd="url(#arrowEmerald)" markerStart="url(#arrowEmerald)" stroke="#059669" strokeWidth="3" x1="68" x2="228" y1="284" y2="284" />
        <SvgText fill="#047857" fontSize="13" fontWeight="900" textAnchor="middle" x="148" y="306">
          PR = 4 small boxes = 0.16 s
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largePrGrid)" height="250" rx="12" stroke="#E87A75" strokeWidth="1.2" width="400" x="470" y="76" />
        <SvgText fill="#0F172A" fontSize="16" fontWeight="900" x="490" y="108">
          WPW pre-excitation
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="490" y="128">
          Short PR with slurred delta wave
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="492" x2="846" y1="214" y2="214" />
        <Path d="M508 214 C518 214 522 194 534 194 C546 194 550 214 560 214 L588 214 C600 202 612 174 626 156 L638 236 L648 214 C664 214 670 202 686 196 C712 186 730 214 758 214" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line stroke="#DC2626" strokeDasharray="5 5" strokeWidth="2" x1="508" x2="508" y1="166" y2="276" />
        <Line stroke="#DC2626" strokeDasharray="5 5" strokeWidth="2" x1="588" x2="588" y1="166" y2="276" />
        <Line markerEnd="url(#arrowRed)" markerStart="url(#arrowRed)" stroke="#DC2626" strokeWidth="3" x1="508" x2="588" y1="284" y2="284" />
        <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" textAnchor="middle" x="548" y="306">
          PR = 2 small boxes = 0.08 s
        </SvgText>
        <Line markerEnd="url(#arrowOrangePr)" stroke="#EA580C" strokeWidth="2.5" x1="792" x2="616" y1="150" y2="178" />
        <Rect fill="#FFF7ED" height="30" rx="15" stroke="#FDBA74" width="166" x="700" y="126" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="716" y="146">
          Delta wave: slurred upstroke
        </SvgText>
      </G>
    </Svg>
  );
}

function FirstDegreeWenckebachFigure() {
  const firstDegreeBeats = [110, 310, 510, 710];
  const wenckebach = [
    { p: 110, qrs: 190, label: '0.16 s' },
    { p: 310, qrs: 430, label: '0.24 s' },
    { p: 510, qrs: 670, label: '0.32 s' },
  ];
  return (
    <Svg accessibilityLabel="First-degree AV block compared with Wenckebach" style={styles.svgAvBlock} viewBox="0 0 1000 450">
      <Defs>
        <Pattern height="10" id="smallAvGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeAvGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallAvGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="avArrowGreen" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
        </Marker>
        <Marker id="avArrowRed" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="1000" />
      <SvgText fill="#334155" fontSize="24" fontWeight="900" x="30" y="42">
        AV blocks: delay versus progressive failure
      </SvgText>

      <G>
        <Rect fill="url(#largeAvGrid)" height="160" rx="12" stroke="#E87A75" strokeWidth="1.2" width="940" x="30" y="70" />
        <SvgText fill="#334155" fontSize="15" fontWeight="900" x="48" y="98">
          First-degree AV block: prolonged but constant PR
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="48" x2="950" y1="150" y2="150" />
        {firstDegreeBeats.map((qrs) => {
          const p = qrs - 140;
          return (
            <G key={qrs}>
              <Path d={`M${p - 24} 150 C${p - 12} 150 ${p - 8} 132 ${p + 8} 132 C${p + 24} 132 ${p + 28} 150 ${p + 40} 150`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeWidth="3" />
              <Path d={`M${qrs - 18} 150 L${qrs - 8} 176 L${qrs} 90 L${qrs + 8} 178 L${qrs + 20} 150`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              <Line markerEnd="url(#avArrowGreen)" markerStart="url(#avArrowGreen)" stroke="#059669" strokeWidth="2" x1={p - 24} x2={qrs - 20} y1="204" y2="204" />
            </G>
          );
        })}
        <SvgText fill="#047857" fontSize="13" fontWeight="900" x="54" y="222">
          Every P conducts, PR interval is prolonged (&gt;0.20 s) but constant
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largeAvGrid)" height="170" rx="12" stroke="#E87A75" strokeWidth="1.2" width="940" x="30" y="252" />
        <SvgText fill="#334155" fontSize="15" fontWeight="900" x="48" y="280">
          Mobitz I / Wenckebach: PR lengthens, then QRS drops
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="48" x2="950" y1="342" y2="342" />
        {wenckebach.map(({ p, qrs, label }) => (
          <G key={label}>
            <Path d={`M${p - 24} 342 C${p - 12} 342 ${p - 8} 324 ${p + 8} 324 C${p + 24} 324 ${p + 28} 342 ${p + 40} 342`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeWidth="3" />
            <Path d={`M${qrs - 18} 342 L${qrs - 8} 368 L${qrs} 282 L${qrs + 8} 370 L${qrs + 20} 342`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            <Line markerEnd="url(#avArrowGreen)" markerStart="url(#avArrowGreen)" stroke="#059669" strokeWidth="2" x1={p - 24} x2={qrs - 20} y1="392" y2="392" />
            <SvgText fill="#047857" fontSize="11" fontWeight="900" textAnchor="middle" x={(p + qrs) / 2} y="412">
              {label}
            </SvgText>
          </G>
        ))}
        <Path d="M746 342 C758 342 762 324 778 324 C794 324 798 342 810 342" fill="none" stroke="#4338CA" strokeLinecap="round" strokeWidth="3" />
        <Circle cx="852" cy="324" fill="none" r="34" stroke="#DC2626" strokeDasharray="6 5" strokeWidth="3" />
        <Line markerEnd="url(#avArrowRed)" stroke="#DC2626" strokeWidth="2.5" x1="916" x2="798" y1="292" y2="324" />
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" textAnchor="middle" x="852" y="382">
          dropped QRS
        </SvgText>
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="826" y="290">
          non-conducted P
        </SvgText>
      </G>
    </Svg>
  );
}

function MobitzCompleteBlockFigure() {
  const pWaves = [92, 192, 292, 392, 492, 592, 692, 792, 892];
  const escapeBeats = [160, 420, 680, 940];
  return (
    <Svg accessibilityLabel="Mobitz II compared with complete heart block" style={styles.svgAvBlock} viewBox="0 0 1000 450">
      <Defs>
        <Pattern height="10" id="smallCompleteGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeCompleteGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallCompleteGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="1000" />
      <SvgText fill="#334155" fontSize="24" fontWeight="900" x="30" y="42">
        AV blocks: sudden drops versus dissociation
      </SvgText>

      <G>
        <Rect fill="url(#largeCompleteGrid)" height="160" rx="12" stroke="#E87A75" strokeWidth="1.2" width="940" x="30" y="70" />
        <SvgText fill="#334155" fontSize="15" fontWeight="900" x="48" y="98">
          Mobitz II: fixed PR, sudden dropped QRS
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="48" x2="950" y1="150" y2="150" />
        {[130, 330, 530, 730, 930].map((qrs, index) => {
          const p = qrs - 80;
          const dropped = index === 2;
          return (
            <G key={qrs}>
              <Path d={`M${p - 24} 150 C${p - 12} 150 ${p - 8} 132 ${p + 8} 132 C${p + 24} 132 ${p + 28} 150 ${p + 40} 150`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeWidth="3" />
              {dropped ? (
                <G>
                  <Rect fill="none" height="72" stroke="#DC2626" strokeDasharray="6 5" strokeWidth="3" width="54" x={qrs - 28} y="92" />
                  <Line stroke="#DC2626" strokeWidth="3" x1={qrs - 20} x2={qrs + 20} y1="102" y2="152" />
                  <Line stroke="#DC2626" strokeWidth="3" x1={qrs + 20} x2={qrs - 20} y1="102" y2="152" />
                </G>
              ) : (
                <Path d={`M${qrs - 18} 150 L${qrs - 8} 176 L${qrs} 90 L${qrs + 8} 178 L${qrs + 20} 150`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              )}
              {!dropped && <Line stroke="#059669" strokeWidth="3" x1={p - 24} x2={qrs - 20} y1="204" y2="204" />}
            </G>
          );
        })}
        <SvgText fill="#047857" fontSize="13" fontWeight="900" x="54" y="222">
          Constant fixed PR before and after the dropped beat
        </SvgText>
      </G>

      <G>
        <Rect fill="url(#largeCompleteGrid)" height="170" rx="12" stroke="#E87A75" strokeWidth="1.2" width="940" x="30" y="252" />
        <SvgText fill="#334155" fontSize="15" fontWeight="900" x="48" y="280">
          Third-degree AV block: P waves and QRS escape march independently
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="48" x2="950" y1="342" y2="342" />
        {pWaves.map((p) => (
          <G key={p}>
            <Path d={`M${p - 18} 342 C${p - 8} 342 ${p - 6} 326 ${p + 6} 326 C${p + 18} 326 ${p + 20} 342 ${p + 28} 342`} fill="none" stroke="#2563EB" strokeLinecap="round" strokeWidth="2.4" />
            <Line stroke="#2563EB" strokeWidth="2" x1={p + 5} x2={p + 5} y1="292" y2="312" />
          </G>
        ))}
        {escapeBeats.map((qrs) => (
          <G key={qrs}>
            <Path d={`M${qrs - 28} 342 L${qrs - 12} 374 L${qrs} 286 L${qrs + 14} 378 L${qrs + 34} 342`} fill="none" stroke="#4338CA" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
            <Line stroke="#059669" strokeWidth="3" x1={qrs - 36} x2={qrs + 40} y1="404" y2="404" />
          </G>
        ))}
        <Line stroke="#DC2626" strokeDasharray="6 5" strokeWidth="2.5" x1="92" x2="160" y1="386" y2="386" />
        <Line stroke="#DC2626" strokeDasharray="6 5" strokeWidth="2.5" x1="392" x2="420" y1="386" y2="386" />
        <Line stroke="#DC2626" strokeDasharray="6 5" strokeWidth="2.5" x1="592" x2="680" y1="386" y2="386" />
        <SvgText fill="#2563EB" fontSize="12" fontWeight="900" x="54" y="314">
          P waves march out
        </SvgText>
        <SvgText fill="#047857" fontSize="12" fontWeight="900" x="742" y="414">
          slow regular escape rhythm
        </SvgText>
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="54" y="394">
          PR varies / no relationship
        </SvgText>
      </G>
    </Svg>
  );
}

function FlowNode({
  fill,
  height = 54,
  stroke,
  subtitle,
  title,
  width = 190,
  x,
  y,
}: {
  fill: string;
  height?: number;
  stroke: string;
  subtitle?: string;
  title: string;
  width?: number;
  x: number;
  y: number;
}) {
  return (
    <G>
      <Rect fill={fill} height={height} rx="14" stroke={stroke} strokeWidth="1.5" width={width} x={x} y={y} />
      <SvgText fill="#E5E7EB" fontSize="13" fontWeight="900" textAnchor="middle" x={x + width / 2} y={y + 24}>
        {title}
      </SvgText>
      {!!subtitle && (
        <SvgText fill="#CBD5E1" fontSize="11" fontWeight="700" textAnchor="middle" x={x + width / 2} y={y + 43}>
          {subtitle}
        </SvgText>
      )}
    </G>
  );
}

function RhythmDecisionTreeFigure() {
  return (
    <Svg accessibilityLabel="Rhythm synthesis diagnostic decision tree" style={styles.svgRhythmTree} viewBox="0 0 1000 600">
      <Defs>
        <Marker id="treeArrowGreen" markerHeight="9" markerWidth="9" orient="auto" refX="4.5" refY="4.5">
          <Path d="M0,0 L9,4.5 L0,9 Z" fill="#10B981" />
        </Marker>
        <Marker id="treeArrowAmber" markerHeight="9" markerWidth="9" orient="auto" refX="4.5" refY="4.5">
          <Path d="M0,0 L9,4.5 L0,9 Z" fill="#F59E0B" />
        </Marker>
      </Defs>
      <Rect fill="#0F172A" height="600" rx="18" width="1000" />
      <SvgText fill="#F8FAFC" fontSize="26" fontWeight="900" textAnchor="middle" x="500" y="44">
        Step 4 rhythm synthesis logic
      </SvgText>

      <FlowNode fill="#1E293B" stroke="#64748B" subtitle="Step 1" title="Ventricular regularity?" width={250} x={375} y={74} />
      <FlowNode fill="#123C2E" stroke="#10B981" subtitle="Step 2" title="P waves present + uniform?" width={245} x={120} y={190} />
      <FlowNode fill="#2B2442" stroke="#818CF8" subtitle="Step 3" title="PR interval duration?" width={230} x={128} y={310} />
      <FlowNode fill="#3A1D1D" stroke="#F43F5E" subtitle="PR <0.12 or P buried" title="Junctional rhythm" width={230} x={392} y={246} />
      <FlowNode fill="#064E3B" stroke="#10B981" subtitle="60-100, brady, tachy" title="Sinus rhythm family" width={230} x={20} y={436} />
      <FlowNode fill="#312E81" stroke="#818CF8" subtitle="constant >0.20 s" title="First-degree AV block" width={230} x={270} y={436} />

      <FlowNode fill="#3A2A12" stroke="#F59E0B" subtitle="Step 2" title="P-wave morphology?" width={245} x={635} y={190} />
      <FlowNode fill="#4C0519" stroke="#FB7185" subtitle="absent/fibrillatory" title="Atrial fibrillation" width={220} x={548} y={330} />
      <FlowNode fill="#431407" stroke="#FB923C" subtitle="sawtooth pattern" title="Atrial flutter" width={220} x={760} y={330} />
      <FlowNode fill="#422006" stroke="#FACC15" subtitle=">=3 P-wave shapes" title="WAP or MAT" width={230} x={650} y={460} />

      <Path d="M500 128 C500 160 265 158 242 190" fill="none" markerEnd="url(#treeArrowGreen)" stroke="#10B981" strokeWidth="3" />
      <Path d="M500 128 C500 160 755 158 758 190" fill="none" markerEnd="url(#treeArrowAmber)" stroke="#F59E0B" strokeWidth="3" />
      <SvgText fill="#10B981" fontSize="13" fontWeight="900" x="308" y="164">
        REGULAR
      </SvgText>
      <SvgText fill="#F59E0B" fontSize="13" fontWeight="900" x="650" y="164">
        IRREGULAR
      </SvgText>

      <Path d="M242 244 L242 310" fill="none" markerEnd="url(#treeArrowGreen)" stroke="#10B981" strokeWidth="3" />
      <Path d="M365 220 C410 220 430 236 436 246" fill="none" markerEnd="url(#treeArrowAmber)" stroke="#F59E0B" strokeWidth="3" />
      <SvgText fill="#10B981" fontSize="12" fontWeight="900" x="254" y="284">
        YES
      </SvgText>
      <SvgText fill="#F87171" fontSize="12" fontWeight="900" x="394" y="214">
        NO / inverted
      </SvgText>
      <Path d="M220 364 C182 396 144 406 135 436" fill="none" markerEnd="url(#treeArrowGreen)" stroke="#10B981" strokeWidth="3" />
      <Path d="M275 364 C340 398 384 406 385 436" fill="none" markerEnd="url(#treeArrowGreen)" stroke="#10B981" strokeWidth="3" />
      <SvgText fill="#CBD5E1" fontSize="12" fontWeight="800" x="58" y="410">
        0.12-0.20 s
      </SvgText>

      <Path d="M730 244 C692 280 666 296 660 330" fill="none" markerEnd="url(#treeArrowAmber)" stroke="#F59E0B" strokeWidth="3" />
      <Path d="M792 244 C832 280 860 296 870 330" fill="none" markerEnd="url(#treeArrowAmber)" stroke="#F59E0B" strokeWidth="3" />
      <Path d="M758 244 C758 342 766 410 765 460" fill="none" markerEnd="url(#treeArrowAmber)" stroke="#F59E0B" strokeWidth="3" />
    </Svg>
  );
}

function StatusPill({ color, label, status, x, y }: { color: string; label: string; status: string; x: number; y: number }) {
  return (
    <G>
      <Rect fill="#FFFFFF" height="44" rx="14" stroke="#E2E8F0" width="340" x={x} y={y} />
      <Circle cx={x + 24} cy={y + 22} fill={color} r="8" />
      <SvgText fill="#334155" fontSize="13" fontWeight="900" x={x + 44} y={y + 19}>
        {label}
      </SvgText>
      <SvgText fill="#64748B" fontSize="12" x={x + 44} y={y + 36}>
        {status}
      </SvgText>
    </G>
  );
}

function RhythmSynthesisDashboardFigure() {
  return (
    <Svg accessibilityLabel="Automated rhythm synthesis validation dashboard" style={styles.svgRhythmDashboard} viewBox="0 0 900 450">
      <Rect fill="#F8FAFC" height="450" rx="20" width="900" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="28" y="42">
        Automated rhythm synthesis validation
      </SvgText>

      <Rect fill="#FFFFFF" height="340" rx="22" stroke="#E2E8F0" width="390" x="28" y="76" />
      <SvgText fill="#334155" fontSize="16" fontWeight="900" x="54" y="112">
        Inputs entered by clinician
      </SvgText>
      <StatusPill color="#EF4444" label="Regularity" status="Irregularly irregular" x={54} y={136} />
      <StatusPill color="#F59E0B" label="Atrial rate" status="Indiscernible" x={54} y={188} />
      <StatusPill color="#EF4444" label="P waves" status="Absent, fibrillatory baseline" x={54} y={240} />
      <StatusPill color="#94A3B8" label="PR interval" status="Unmeasurable" x={54} y={292} />
      <StatusPill color="#10B981" label="QRS complex" status="0.08 seconds, narrow" x={54} y={344} />

      <Rect fill="#0F172A" height="340" rx="22" width="420" x="452" y="76" />
      <SvgText fill="#93C5FD" fontSize="13" fontWeight="900" x="482" y="112">
        AI clinical synthesis output
      </SvgText>
      <SvgText fill="#F8FAFC" fontSize="19" fontWeight="900" x="482" y="146">
        Provisional diagnosis:
      </SvgText>
      <SvgText fill="#F8FAFC" fontSize="22" fontWeight="900" x="482" y="174">
        ATRIAL FIBRILLATION
      </SvgText>
      <Circle cx="790" cy="142" fill="none" r="42" stroke="#1E293B" strokeWidth="10" />
      <Path d="M790 100 A42 42 0 1 1 781 183" fill="none" stroke="#10B981" strokeLinecap="round" strokeWidth="10" />
      <SvgText fill="#F8FAFC" fontSize="17" fontWeight="900" textAnchor="middle" x="790" y="138">
        98%
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="11" fontWeight="800" textAnchor="middle" x="790" y="156">
        AI match
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="13" x="482" y="218">
        Chaotic atrial ectopic firing overrides the SA node.
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="13" x="482" y="242">
        The AV node filters impulses irregularly, producing an
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="13" x="482" y="266">
        irregularly irregular ventricular response.
      </SvgText>
      <Rect fill="#451A1A" height="76" rx="12" width="342" x="482" y="306" />
      <Rect fill="#EF4444" height="76" rx="4" width="6" x="482" y="306" />
      <SvgText fill="#FEE2E2" fontSize="13" fontWeight="900" x="504" y="332">
        Safety warning
      </SvgText>
      <SvgText fill="#FECACA" fontSize="12" x="504" y="354">
        High thromboembolism risk. Assess hemodynamic
      </SvgText>
      <SvgText fill="#FECACA" fontSize="12" x="504" y="374">
        tolerance and consider rate control pathway.
      </SvgText>
    </Svg>
  );
}

function RhythmAssociationFigure() {
  const normalP = [120, 300, 480, 660, 840];
  const normalQrs = normalP.map((x) => x + 38);
  const blockP = [105, 235, 365, 495, 625, 755, 885];
  const blockQrs = [170, 520, 870];
  return (
    <Svg accessibilityLabel="Timeline of AV association versus dissociation" style={styles.svgRhythmAssociation} viewBox="0 0 1000 400">
      <Defs>
        <Pattern height="20" id="timelineGrid" patternUnits="userSpaceOnUse" width="20">
          <Path d="M20 0 L0 0 0 20" fill="none" stroke="#FADAD8" strokeWidth="0.6" />
        </Pattern>
        <Marker id="timelineArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="1000" />
      <Rect fill="url(#timelineGrid)" height="320" rx="14" width="940" x="30" y="54" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="38">
        Atrial versus ventricular event timing
      </SvgText>

      <SvgText fill="#334155" fontSize="15" fontWeight="900" x="54" y="86">
        Normal 1:1 AV association
      </SvgText>
      <Line stroke="#CBD5E1" strokeWidth="3" x1="90" x2="920" y1="124" y2="124" />
      <Line stroke="#CBD5E1" strokeWidth="3" x1="90" x2="920" y1="184" y2="184" />
      <SvgText fill="#047857" fontSize="12" fontWeight="900" x="54" y="128">
        P
      </SvgText>
      <SvgText fill="#2563EB" fontSize="12" fontWeight="900" x="54" y="188">
        QRS
      </SvgText>
      {normalP.map((x, index) => (
        <G key={x}>
          <Circle cx={x} cy="124" fill="#10B981" r="9" />
          <Circle cx={normalQrs[index]} cy="184" fill="#2563EB" r="10" />
          <Line markerEnd="url(#timelineArrow)" stroke="#334155" strokeWidth="2" x1={x} x2={normalQrs[index]} y1="136" y2="172" />
        </G>
      ))}
      <SvgText fill="#334155" fontSize="13" fontWeight="900" x="380" y="158">
        1:1 conduction, fixed PR delay
      </SvgText>

      <SvgText fill="#334155" fontSize="15" fontWeight="900" x="54" y="244">
        Complete AV dissociation
      </SvgText>
      <Line stroke="#CBD5E1" strokeWidth="3" x1="90" x2="920" y1="282" y2="282" />
      <Line stroke="#CBD5E1" strokeWidth="3" x1="90" x2="920" y1="342" y2="342" />
      <SvgText fill="#047857" fontSize="12" fontWeight="900" x="54" y="286">
        P
      </SvgText>
      <SvgText fill="#DC2626" fontSize="12" fontWeight="900" x="54" y="346">
        QRS
      </SvgText>
      {blockP.map((x) => (
        <Circle cx={x} cy="282" fill="#10B981" key={x} r="8" />
      ))}
      {blockQrs.map((x) => (
        <Circle cx={x} cy="342" fill="#DC2626" key={x} r="12" />
      ))}
      <Path d="M120 372 L910 372" fill="none" stroke="#B91C1C" strokeWidth="3" />
      <Path d="M120 360 L120 384 M910 360 L910 384" fill="none" stroke="#B91C1C" strokeWidth="3" />
      <SvgText fill="#B91C1C" fontSize="14" fontWeight="900" textAnchor="middle" x="515" y="394">
        AV dissociation: no constant PR relationship
      </SvgText>
    </Svg>
  );
}

function QrsMeasurementCalibrationFigure() {
  return (
    <Svg accessibilityLabel="QRS duration measurement and calibration spike" style={styles.svgQrsMeasure} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="smallQrsGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeQrsGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallQrsGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="qrsArrowSlate" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#334155" />
        </Marker>
        <Marker id="qrsArrowGreen" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#059669" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <Rect fill="url(#largeQrsGrid)" height="320" rx="14" stroke="#E87A75" strokeWidth="1.2" width="890" x="30" y="52" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="44" y="36">
        Measuring QRS duration and calibration
      </SvgText>

      <G>
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="66" y="88">
          Standard calibration
        </SvgText>
        <Path d="M96 294 L96 194 L146 194 L146 294" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <Line markerEnd="url(#qrsArrowSlate)" markerStart="url(#qrsArrowSlate)" stroke="#334155" strokeWidth="2" x1="166" x2="166" y1="194" y2="294" />
        <Line markerEnd="url(#qrsArrowSlate)" markerStart="url(#qrsArrowSlate)" stroke="#334155" strokeWidth="2" x1="96" x2="146" y1="320" y2="320" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="186" y="238">
          10 mm
        </SvgText>
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="186" y="258">
          = 1 mV
        </SvgText>
        <SvgText fill="#334155" fontSize="13" fontWeight="800" textAnchor="middle" x="121" y="346">
          5 mm wide
        </SvgText>
      </G>

      <G>
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="360" y="88">
          QRS duration: first deflection to J point
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.4" x1="340" x2="880" y1="220" y2="220" />
        <Path d="M350 220 C370 220 376 202 396 202 C416 202 422 220 442 220 L520 220 L532 248 L542 150 L552 252 L562 220 L676 220 C694 220 702 206 720 198 C750 184 772 220 820 220" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line stroke="#059669" strokeDasharray="6 5" strokeWidth="2" x1="520" x2="520" y1="132" y2="296" />
        <Line stroke="#059669" strokeDasharray="6 5" strokeWidth="2" x1="562" x2="562" y1="132" y2="296" />
        <Line markerEnd="url(#qrsArrowGreen)" markerStart="url(#qrsArrowGreen)" stroke="#059669" strokeWidth="3" x1="520" x2="562" y1="312" y2="312" />
        <SvgText fill="#047857" fontSize="13" fontWeight="900" textAnchor="middle" x="541" y="338">
          {'QRS <=0.11 s'}
        </SvgText>
        <SvgText fill="#047857" fontSize="12" fontWeight="800" textAnchor="middle" x="676" y="338">
          approx. 2-2.5 small boxes
        </SvgText>
        <SvgText fill="#334155" fontSize="12" fontWeight="900" x="494" y="122">
          Q onset
        </SvgText>
        <SvgText fill="#334155" fontSize="12" fontWeight="900" x="552" y="122">
          J point
        </SvgText>
      </G>
    </Svg>
  );
}

function QrsBbbV1Figure() {
  return (
    <Svg accessibilityLabel="Lead V1 RBBB and LBBB morphology comparison" style={styles.svgQrsMeasure} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="smallBbbGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeBbbGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallBbbGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="38">
        Lead V1 bundle branch block patterns
      </SvgText>
      <G>
        <Rect fill="url(#largeBbbGrid)" height="270" rx="14" stroke="#E87A75" strokeWidth="1.2" width="420" x="34" y="74" />
        <SvgText fill="#312E81" fontSize="16" fontWeight="900" x="56" y="108">
          RBBB in V1
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="128">
          {"Classic rSR' pattern with T-wave inversion"}
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="56" x2="432" y1="214" y2="214" />
        <Path d="M126 214 L154 138 L181 260 L268 112 L304 214" fill="none" stroke="#FACC15" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.42" strokeWidth="18" />
        <Path d="M74 214 L126 214 L154 138 L181 260 L268 112 L304 214 L324 214 C346 214 362 230 378 250 C398 274 418 258 428 218" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <Line stroke="#D97706" strokeWidth="3" x1="126" x2="304" y1="300" y2="300" />
        <SvgText fill="#92400E" fontSize="13" fontWeight="900" textAnchor="middle" x="212" y="324">
          {'wide QRS >=0.12 s'}
        </SvgText>
        <SvgText fill="#312E81" fontSize="13" fontWeight="900" x="148" y="126">
          r
        </SvgText>
        <SvgText fill="#312E81" fontSize="13" fontWeight="900" x="262" y="100">
          {"R'"}
        </SvgText>
        <SvgText fill="#312E81" fontSize="12" fontWeight="900" x="190" y="202">
          S
        </SvgText>
        <SvgText fill="#312E81" fontSize="12" fontWeight="900" x="334" y="270">
          inverted T
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#largeBbbGrid)" height="270" rx="14" stroke="#E87A75" strokeWidth="1.2" width="420" x="496" y="74" />
        <SvgText fill="#312E81" fontSize="16" fontWeight="900" x="518" y="108">
          LBBB in V1
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="128">
          Broad monomorphic QS with upright discordant T
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="518" x2="894" y1="214" y2="214" />
        <Path d="M536 214 C570 214 604 214 634 214 C650 214 666 236 684 274 C704 316 748 318 774 270 C796 228 812 214 836 214 C858 214 874 194 892 176 C912 156 926 176 932 212" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <Path d="M642 218 C666 246 686 306 728 310 C768 314 790 246 820 218" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.22" strokeWidth="12" />
        <Line stroke="#D97706" strokeWidth="3" x1="634" x2="836" y1="300" y2="300" />
        <SvgText fill="#92400E" fontSize="13" fontWeight="900" textAnchor="middle" x="735" y="324">
          broad negative QS / rS
        </SvgText>
        <SvgText fill="#312E81" fontSize="12" fontWeight="900" x="842" y="164">
          upright T
        </SvgText>
      </G>
    </Svg>
  );
}

function MiniQrs({ color = '#0F172A', label, path, x }: { color?: string; label: string; path: string; x: number }) {
  return (
    <G>
      <SvgText fill="#334155" fontSize="13" fontWeight="900" textAnchor="middle" x={x + 52} y="96">
        {label}
      </SvgText>
      <Path d={path} fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
    </G>
  );
}

function QrsRWaveProgressionFigure() {
  return (
    <Svg accessibilityLabel="Normal versus poor R wave progression" style={styles.svgQrsProgression} viewBox="0 0 1000 500">
      <Defs>
        <Pattern height="10" id="smallProgressGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeProgressGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallProgressGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="500" rx="18" width="1000" />
      <Rect fill="url(#largeProgressGrid)" height="410" rx="14" stroke="#E87A75" strokeWidth="1.2" width="940" x="30" y="58" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="36" y="38">
        Precordial R-wave progression
      </SvgText>
      <SvgText fill="#047857" fontSize="16" fontWeight="900" x="56" y="86">
        Normal progression
      </SvgText>
      <MiniQrs label="V1" path="M84 164 L112 164 L120 134 L138 244 L152 164 L174 164" x={72} />
      <MiniQrs label="V2" path="M286 164 L316 164 L326 112 L348 242 L364 164 L386 164" x={274} />
      <MiniQrs label="V3" path="M488 164 L518 164 L532 96 L552 232 L568 164 L590 164" x={476} />
      <MiniQrs label="V4" path="M690 164 L720 164 L742 74 L756 198 L772 164 L794 164" x={678} />
      <Path d="M120 134 L326 112 L532 96 L742 74" fill="none" stroke="#059669" strokeDasharray="6 5" strokeWidth="3" />
      <Rect fill="rgba(5, 150, 105, 0.12)" height="34" rx="17" width="160" x="474" y="244" />
      <SvgText fill="#047857" fontSize="13" fontWeight="900" textAnchor="middle" x="554" y="266">
        transition zone V3
      </SvgText>

      <SvgText fill="#B91C1C" fontSize="16" fontWeight="900" x="56" y="306">
        Poor R-wave progression
      </SvgText>
      <Rect fill="rgba(239, 68, 68, 0.12)" height="120" rx="14" width="810" x="70" y="322" />
      <MiniQrs color="#7F1D1D" label="V1" path="M84 392 L112 392 L118 374 L138 452 L152 392 L174 392" x={72} />
      <MiniQrs color="#7F1D1D" label="V2" path="M286 392 L316 392 L320 378 L348 452 L364 392 L386 392" x={274} />
      <MiniQrs color="#7F1D1D" label="V3" path="M488 392 L518 392 L522 376 L552 452 L568 392 L590 392" x={476} />
      <MiniQrs color="#7F1D1D" label="V4" path="M690 392 L720 392 L726 376 L756 452 L772 392 L794 392" x={678} />
      <SvgText fill="#B91C1C" fontSize="14" fontWeight="900" x="602" y="330">
        PRWP: consider anterior/septal MI, lead placement, LVH, COPD
      </SvgText>
    </Svg>
  );
}

function QrsHypertrophyFigure() {
  return (
    <Svg accessibilityLabel="LVH and RVH voltage patterns" style={styles.svgQrsHypertrophy} viewBox="0 0 1000 450">
      <Defs>
        <Pattern height="10" id="smallHypGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeHypGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallHypGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="1000" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="38">
        Ventricular hypertrophy voltage patterns
      </SvgText>
      <G>
        <Rect fill="url(#largeHypGrid)" height="320" rx="14" stroke="#E87A75" strokeWidth="1.2" width="470" x="34" y="72" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="56" y="104">
          LVH: high voltage with lateral strain
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="56" x2="480" y1="230" y2="230" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="86" y="134">
          V1/V2 deep S
        </SvgText>
        <Path d="M76 230 L132 230 L142 250 L156 350 L172 230 L210 230" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="292" y="134">
          V5/V6 tall R + strain
        </SvgText>
        <Path d="M278 230 L324 230 L350 84 L374 246 L390 230 L420 250 C438 266 454 260 472 238" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      </G>
      <G>
        <Rect fill="url(#largeHypGrid)" height="320" rx="14" stroke="#E87A75" strokeWidth="1.2" width="430" x="536" y="72" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="558" y="104">
          RVH: dominant R in V1 with strain
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" strokeWidth="1.2" x1="558" x2="944" y1="230" y2="230" />
        <Path d="M594 230 L660 230 L700 96 L728 268 L748 230 L790 250 C820 270 850 262 880 236" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="620" y="338">
          Tall R exceeds S depth in V1
        </SvgText>
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="620" y="362">
          Downsloping ST depression + T inversion
        </SvgText>
      </G>
    </Svg>
  );
}

function AxisHexaxialWheelFigure() {
  return (
    <Svg accessibilityLabel="Hexaxial reference system wheel" style={styles.svgAxisWheel} viewBox="0 0 600 600">
      <Defs>
        <Marker id="axisArrowCyan" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#38BDF8" />
        </Marker>
      </Defs>
      <Rect fill="#0F172A" height="600" rx="20" width="600" />
      <SvgText fill="#F8FAFC" fontSize="24" fontWeight="900" textAnchor="middle" x="300" y="42">
        Hexaxial reference system
      </SvgText>
      <Circle cx="300" cy="300" fill="none" r="205" stroke="#334155" strokeWidth="2" />
      <Circle cx="300" cy="300" fill="#E5E7EB" r="5" />

      <G strokeLinecap="round" strokeWidth="3">
        <Line stroke="#38BDF8" x1="95" x2="505" y1="300" y2="300" />
        <Line stroke="#34D399" x1="198" x2="402" y1="477" y2="123" />
        <Line stroke="#F472B6" x1="198" x2="402" y1="123" y2="477" />
        <Line stroke="#94A3B8" strokeDasharray="10 8" x1="300" x2="300" y1="95" y2="505" />
        <Line stroke="#94A3B8" strokeDasharray="10 8" x1="123" x2="477" y1="198" y2="402" />
        <Line stroke="#94A3B8" strokeDasharray="10 8" x1="477" x2="123" y1="198" y2="402" />
      </G>

      <Path d="M300 300 L365 300 L365 365" fill="none" stroke="#38BDF8" strokeWidth="3" />
      <Path d="M300 300 L354 206 L260 152" fill="none" stroke="#34D399" strokeOpacity="0.75" strokeWidth="3" />
      <Path d="M300 300 L248 210 L145 270" fill="none" stroke="#F472B6" strokeOpacity="0.75" strokeWidth="3" />

      <SvgText fill="#38BDF8" fontSize="14" fontWeight="900" x="500" y="292">
        Lead I 0°
      </SvgText>
      <SvgText fill="#E5E7EB" fontSize="13" fontWeight="800" x="34" y="292">
        ±180°
      </SvgText>
      <SvgText fill="#34D399" fontSize="14" fontWeight="900" x="410" y="118">
        Lead II +60°
      </SvgText>
      <SvgText fill="#F472B6" fontSize="14" fontWeight="900" x="410" y="488">
        Lead III +120°
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="14" fontWeight="900" textAnchor="middle" x="300" y="84">
        -90°
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="14" fontWeight="900" textAnchor="middle" x="300" y="532">
        aVF +90°
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="14" fontWeight="900" x="126" y="196">
        aVR -150°
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="14" fontWeight="900" x="414" y="196">
        aVL -30°
      </SvgText>
      <SvgText fill="#94A3B8" fontSize="12" fontWeight="800" textAnchor="middle" x="300" y="570">
        Perpendicular pairs: I/aVF, II/aVL, III/aVR
      </SvgText>
    </Svg>
  );
}

function AxisQuadrantsFigure() {
  return (
    <Svg accessibilityLabel="Four clinical cardiac axis quadrants" style={styles.svgAxisQuadrants} viewBox="0 0 700 550">
      <Rect fill="#F8FAFC" height="550" rx="20" width="700" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="30" y="42">
        Four axis quadrants
      </SvgText>
      <G transform="translate(350 275)">
        <Path d="M0 0 L173 -100 A200 200 0 0 1 0 200 Z" fill="#10B981" opacity="0.22" />
        <Path d="M0 0 L0 -200 A200 200 0 0 1 173 -100 Z" fill="#4F46E5" opacity="0.22" />
        <Path d="M0 0 L0 200 A200 200 0 0 1 -200 0 Z" fill="#F59E0B" opacity="0.22" />
        <Path d="M0 0 L-200 0 A200 200 0 0 1 0 -200 Z" fill="#EF4444" opacity="0.22" />
        <Circle cx="0" cy="0" fill="none" r="200" stroke="#334155" strokeWidth="2" />
        <Line stroke="#111827" strokeWidth="2.5" x1="-220" x2="220" y1="0" y2="0" />
        <Line stroke="#111827" strokeWidth="2.5" x1="0" x2="0" y1="-220" y2="220" />
        <Line stroke="#64748B" strokeDasharray="8 6" strokeWidth="2.5" x1="0" x2="190" y1="0" y2="-110" />
      </G>
      <SvgText fill="#047857" fontSize="15" fontWeight="900" x="410" y="345">
        Normal axis
      </SvgText>
      <SvgText fill="#047857" fontSize="13" x="410" y="365">
        -30° to +90°
      </SvgText>
      <SvgText fill="#3730A3" fontSize="15" fontWeight="900" x="410" y="160">
        LAD
      </SvgText>
      <SvgText fill="#3730A3" fontSize="13" x="410" y="180">
        -30° to -90°
      </SvgText>
      <SvgText fill="#B45309" fontSize="15" fontWeight="900" x="120" y="370">
        RAD
      </SvgText>
      <SvgText fill="#B45309" fontSize="13" x="120" y="390">
        +90° to +180°
      </SvgText>
      <SvgText fill="#B91C1C" fontSize="15" fontWeight="900" x="105" y="160">
        Extreme axis
      </SvgText>
      <SvgText fill="#B91C1C" fontSize="13" x="105" y="180">
        -90° to ±180°
      </SvgText>
      <Rect fill="#FFFFFF" height="54" rx="14" stroke="#E2E8F0" width="320" x="30" y="470" />
      <SvgText fill="#334155" fontSize="12" fontWeight="800" x="50" y="493">
        Normal variants: age, pregnancy, body habitus
      </SvgText>
      <SvgText fill="#64748B" fontSize="12" x="50" y="512">
        Axis is a directional clue, not a standalone diagnosis.
      </SvgText>
    </Svg>
  );
}

function AxisQrsIcon({ negative = false, x, y }: { negative?: boolean; x: number; y: number }) {
  const path = negative
    ? `M${x} ${y} L${x + 26} ${y} L${x + 38} ${y + 46} L${x + 52} ${y - 26} L${x + 66} ${y} L${x + 96} ${y}`
    : `M${x} ${y} L${x + 26} ${y} L${x + 38} ${y - 46} L${x + 52} ${y + 26} L${x + 66} ${y} L${x + 96} ${y}`;
  return <Path d={path} fill="none" stroke="#1E1B4B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />;
}

function AxisQuadrantMethodFigure() {
  const cells = [
    { fill: '#DCFCE7', title: 'Normal Axis', note: 'Lead I + / aVF +', x: 40, y: 98, negI: false, negAvf: false },
    { fill: '#E0E7FF', title: 'Suspected LAD', note: 'Verify Lead II', x: 470, y: 98, negI: false, negAvf: true },
    { fill: '#FEF3C7', title: 'RAD', note: 'Lead I - / aVF +', x: 40, y: 270, negI: true, negAvf: false },
    { fill: '#FEE2E2', title: 'Extreme Axis', note: 'Lead I - / aVF -', x: 470, y: 270, negI: true, negAvf: true },
  ];
  return (
    <Svg accessibilityLabel="Quadrant method matrix for QRS axis" style={styles.svgAxisMatrix} viewBox="0 0 900 450">
      <Rect fill="#FFF8F7" height="450" rx="20" width="900" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="36" y="42">
        Quick bedside quadrant analysis
      </SvgText>
      <SvgText fill="#334155" fontSize="14" fontWeight="800" x="36" y="66">
        Combine net QRS polarity in Lead I and aVF
      </SvgText>
      {cells.map((cell) => (
        <G key={cell.title}>
          <Rect fill={cell.fill} height="142" rx="18" stroke="#E2E8F0" width="390" x={cell.x} y={cell.y} />
          <SvgText fill="#111827" fontSize="17" fontWeight="900" x={cell.x + 22} y={cell.y + 34}>
            {cell.title}
          </SvgText>
          <SvgText fill="#475569" fontSize="13" fontWeight="800" x={cell.x + 22} y={cell.y + 56}>
            {cell.note}
          </SvgText>
          <SvgText fill="#334155" fontSize="12" fontWeight="900" x={cell.x + 24} y={cell.y + 96}>
            I
          </SvgText>
          <AxisQrsIcon negative={cell.negI} x={cell.x + 52} y={cell.y + 92} />
          <SvgText fill="#334155" fontSize="12" fontWeight="900" x={cell.x + 210} y={cell.y + 96}>
            aVF
          </SvgText>
          <AxisQrsIcon negative={cell.negAvf} x={cell.x + 252} y={cell.y + 92} />
        </G>
      ))}
    </Svg>
  );
}

function AxisLeadIITiebreakerFigure() {
  return (
    <Svg accessibilityLabel="Lead II tiebreaker for left axis deviation" style={styles.svgAxisTiebreaker} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="axisTieGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="axisTieLarge" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#axisTieGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="30" y="42">
        Lead II tiebreaker when I is positive and aVF is negative
      </SvgText>
      <G>
        <Rect fill="url(#axisTieLarge)" height="270" rx="14" stroke="#E87A75" width="420" x="32" y="76" />
        <SvgText fill="#047857" fontSize="16" fontWeight="900" x="54" y="108">
          Physiologic left shift
        </SvgText>
        <AxisQrsIcon x={70} y={156} />
        <AxisQrsIcon negative x={70} y={222} />
        <AxisQrsIcon x={70} y={288} />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="190" y="160">Lead I +</SvgText>
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="190" y="226">aVF -</SvgText>
        <SvgText fill="#047857" fontSize="13" fontWeight="900" x="190" y="292">Lead II +: normal</SvgText>
        <Rect fill="#DCFCE7" height="36" rx="18" width="340" x="54" y="310" />
        <SvgText fill="#047857" fontSize="13" fontWeight="900" x="72" y="333">{'Lead II upright -> normal variant'}</SvgText>
      </G>
      <G>
        <Rect fill="url(#axisTieLarge)" height="270" rx="14" stroke="#E87A75" width="420" x="498" y="76" />
        <SvgText fill="#B91C1C" fontSize="16" fontWeight="900" x="520" y="108">
          Pathological LAD
        </SvgText>
        <AxisQrsIcon x={536} y={156} />
        <AxisQrsIcon negative x={536} y={222} />
        <AxisQrsIcon negative x={536} y={288} />
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="656" y="160">Lead I +</SvgText>
        <SvgText fill="#334155" fontSize="13" fontWeight="900" x="656" y="226">aVF -</SvgText>
        <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="656" y="292">Lead II -: LAD</SvgText>
        <Rect fill="#FEE2E2" height="36" rx="18" width="340" x="520" y="310" />
        <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="538" y="333">{'Lead II inverted -> pathological LAD'}</SvgText>
      </G>
    </Svg>
  );
}

function AxisDegreeMethodFigure() {
  return (
    <Svg accessibilityLabel="Precise axis degree method flowchart" style={styles.svgAxisDegree} viewBox="0 0 1000 450">
      <Defs>
        <Marker id="degreeArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#2563EB" />
        </Marker>
      </Defs>
      <Rect fill="#F8FAFC" height="450" rx="20" width="1000" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Precise axis degree method
      </SvgText>
      {[40, 365, 690].map((x, index) => (
        <G key={x}>
          <Rect fill="#FFFFFF" height="300" rx="22" stroke="#E2E8F0" width="270" x={x} y="88" />
          <Circle cx={x + 34} cy="122" fill="#2563EB" r="18" />
          <SvgText fill="#FFFFFF" fontSize="14" fontWeight="900" textAnchor="middle" x={x + 34} y="128">{index + 1}</SvgText>
        </G>
      ))}
      <Path d="M318 238 L356 238" markerEnd="url(#degreeArrow)" stroke="#2563EB" strokeWidth="3" />
      <Path d="M642 238 L680 238" markerEnd="url(#degreeArrow)" stroke="#2563EB" strokeWidth="3" />
      <SvgText fill="#0F172A" fontSize="15" fontWeight="900" x="84" y="128">Find equiphasic lead</SvgText>
      <Path d="M92 226 L130 226 L144 166 L160 286 L176 226 L218 226" fill="none" stroke="#1E1B4B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
      <SvgText fill="#475569" fontSize="12" x="72" y="328">Equal positive and negative QRS</SvgText>
      <SvgText fill="#0F172A" fontSize="15" fontWeight="900" x="410" y="128">Find perpendicular</SvgText>
      <Circle cx="500" cy="226" fill="none" r="72" stroke="#CBD5E1" strokeWidth="2" />
      <Line stroke="#64748B" strokeWidth="3" x1="428" x2="572" y1="226" y2="226" />
      <Line stroke="#2563EB" strokeWidth="3" x1="464" x2="536" y1="288" y2="164" />
      <SvgText fill="#64748B" fontSize="12" fontWeight="900" x="420" y="250">Lead III</SvgText>
      <SvgText fill="#2563EB" fontSize="12" fontWeight="900" x="532" y="162">aVR</SvgText>
      <SvgText fill="#0F172A" fontSize="15" fontWeight="900" x="734" y="128">Assign direction</SvgText>
      <AxisQrsIcon negative x={745} y={226} />
      <Path d="M832 236 L900 194" markerEnd="url(#degreeArrow)" stroke="#2563EB" strokeWidth="4" />
      <SvgText fill="#475569" fontSize="12" x="724" y="328">Negative aVR means axis points away</SvgText>
      <SvgText fill="#2563EB" fontSize="14" fontWeight="900" x="724" y="350">Final axis: about +30°</SvgText>
    </Svg>
  );
}

function AxisVectorShiftsFigure() {
  return (
    <Svg accessibilityLabel="LVH and RVH pathological vector shifts" style={styles.svgAxisVector} viewBox="0 0 950 450">
      <Defs>
        <Marker id="vectorArrow" markerHeight="10" markerWidth="10" orient="auto" refX="5" refY="5">
          <Path d="M0,0 L10,5 L0,10 Z" fill="#1D4ED8" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="20" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">Pathological vector shifts</SvgText>
      <G>
        <Rect fill="#FFFFFF" height="320" rx="22" stroke="#E2E8F0" width="420" x="34" y="78" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="60" y="112">LVH pulls vector leftward</SvgText>
        <Path d="M184 250 C108 248 90 144 160 120 C210 92 270 124 272 190 C274 244 232 256 184 250 Z" fill="#FECACA" stroke="#BE123C" strokeWidth="3" />
        <Path d="M206 232 C174 230 160 174 194 156 C226 138 252 166 248 198 C244 226 226 234 206 232 Z" fill="#FFF8F7" stroke="#BE123C" strokeWidth="2" />
        <Line markerEnd="url(#vectorArrow)" stroke="#1D4ED8" strokeWidth="6" x1="210" x2="118" y1="190" y2="126" />
        <SvgText fill="#1D4ED8" fontSize="13" fontWeight="900" x="86" y="286">Vector toward -45°</SvgText>
        <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="86" y="312">{'LVH -> LAD tendency'}</SvgText>
      </G>
      <G>
        <Rect fill="#FFFFFF" height="320" rx="22" stroke="#E2E8F0" width="420" x="496" y="78" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="522" y="112">RVH pulls vector rightward</SvgText>
        <Path d="M666 250 C592 248 574 154 636 126 C696 92 780 124 786 198 C790 258 720 270 666 250 Z" fill="#FECACA" stroke="#BE123C" strokeWidth="3" />
        <Path d="M652 232 C622 226 618 172 650 158 C682 146 706 178 696 210 C690 230 672 236 652 232 Z" fill="#FFF8F7" stroke="#BE123C" strokeWidth="2" />
        <Line markerEnd="url(#vectorArrow)" stroke="#1D4ED8" strokeWidth="6" x1="684" x2="790" y1="190" y2="276" />
        <SvgText fill="#1D4ED8" fontSize="13" fontWeight="900" x="592" y="312">Vector toward +120°</SvgText>
        <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="592" y="338">{'RVH -> RAD tendency'}</SvgText>
      </G>
    </Svg>
  );
}

function QWaveCriteriaFigure() {
  return (
    <Svg accessibilityLabel="Physiological versus pathological Q wave criteria" style={styles.svgQWaveCriteria} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="smallQWaveGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="largeQWaveGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#smallQWaveGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="qwaveArrowAmber" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#D97706" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="38">
        Physiological versus pathological Q waves
      </SvgText>
      <G>
        <Rect fill="url(#largeQWaveGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="34" y="74" />
        <SvgText fill="#0F172A" fontSize="16" fontWeight="900" x="56" y="108">
          Physiological septal q
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="128">
          Narrow and shallow, often normal
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="214" y2="214" />
        <Path d="M74 214 C96 214 102 198 122 198 C142 198 148 214 168 214 L226 214 L232 228 L238 150 L246 234 L256 214 C278 214 288 200 310 194 C342 186 366 214 410 214" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line markerEnd="url(#qwaveArrowAmber)" markerStart="url(#qwaveArrowAmber)" stroke="#D97706" strokeWidth="2" x1="226" x2="232" y1="260" y2="260" />
        <Line markerEnd="url(#qwaveArrowAmber)" markerStart="url(#qwaveArrowAmber)" stroke="#D97706" strokeWidth="2" x1="222" x2="222" y1="214" y2="228" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="900" x="90" y="312">
          {'q <0.03 s and <25% of R height'}
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#largeQWaveGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="496" y="74" />
        <SvgText fill="#0F172A" fontSize="16" fontWeight="900" x="518" y="108">
          Pathological Q wave
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="128">
          Wide and/or deep, scar marker
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="214" y2="214" />
        <Rect fill="rgba(217, 119, 6, 0.18)" height="98" rx="10" width="54" x="658" y="214" />
        <Path d="M536 214 C558 214 564 198 584 198 C604 198 610 214 630 214 L658 214 L668 302 L678 302 L688 122 L704 238 L716 214 C742 214 756 198 782 190 C826 178 848 214 890 214" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line markerEnd="url(#qwaveArrowAmber)" markerStart="url(#qwaveArrowAmber)" stroke="#D97706" strokeWidth="2.5" x1="658" x2="678" y1="326" y2="326" />
        <Line markerEnd="url(#qwaveArrowAmber)" markerStart="url(#qwaveArrowAmber)" stroke="#D97706" strokeWidth="2.5" x1="642" x2="642" y1="214" y2="302" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="900" x="690" y="310">
          {'>=0.04 s'}
        </SvgText>
        <SvgText fill="#92400E" fontSize="12" fontWeight="900" x="526" y="312">
          {'depth >=25-33% of R'}
        </SvgText>
      </G>
    </Svg>
  );
}

function QWaveElectricalWindowFigure() {
  return (
    <Svg accessibilityLabel="Electrical window explanation for pathological Q waves" style={styles.svgQWaveWindow} viewBox="0 0 900 450">
      <Defs>
        <Pattern height="10" id="windowSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="windowLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#windowSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="necrosisArrow" markerHeight="10" markerWidth="10" orient="auto" refX="5" refY="5">
          <Path d="M0,0 L10,5 L0,10 Z" fill="#991B1B" />
        </Marker>
      </Defs>
      <Rect fill="#FFFBFB" height="450" rx="20" width="900" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        The electrical window of myocardial necrosis
      </SvgText>
      <G>
        <Path d="M120 250 C70 176 118 96 206 92 C316 86 372 184 330 276 C288 366 172 330 120 250 Z" fill="#FDA4AF" stroke="#64748B" strokeWidth="3" />
        <Path d="M274 122 C338 150 360 216 334 272 C306 248 292 208 294 170 C296 150 286 134 274 122 Z" fill="#64748B" opacity="0.9" />
        <Circle cx="384" cy="200" fill="#FACC15" r="18" stroke="#92400E" strokeWidth="2" />
        <SvgText fill="#92400E" fontSize="12" fontWeight="900" textAnchor="middle" x="384" y="174">
          Active electrode
        </SvgText>
        <Line markerEnd="url(#necrosisArrow)" stroke="#991B1B" strokeWidth="5" x1="290" x2="178" y1="188" y2="148" />
        <Line markerEnd="url(#necrosisArrow)" stroke="#991B1B" strokeWidth="5" x1="286" x2="170" y1="216" y2="252" />
        <SvgText fill="#991B1B" fontSize="13" fontWeight="900" x="92" y="352">
          Forces move away from necrotic tissue
        </SvgText>
        <SvgText fill="#334155" fontSize="12" fontWeight="800" x="268" y="308">
          Dead / necrotic zone
        </SvgText>
      </G>
      <Line stroke="#64748B" strokeDasharray="7 6" strokeWidth="2" x1="404" x2="500" y1="200" y2="200" />
      <G>
        <Rect fill="url(#windowLargeGrid)" height="230" rx="14" stroke="#E87A75" width="344" x="500" y="96" />
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="520" x2="824" y1="214" y2="214" />
        <Path d="M522 214 C542 214 548 198 568 198 C588 198 594 214 612 214 L646 214 C654 258 670 306 700 306 C728 306 746 214 770 214 L824 214" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <SvgText fill="#B91C1C" fontSize="15" fontWeight="900" x="604" y="344">
          QS wave: deep negative deflection
        </SvgText>
      </G>
      <SvgText fill="#334155" fontSize="13" fontWeight="800" x="54" y="410">
        No depolarisation occurs in dead tissue; the electrode records forces moving away.
      </SvgText>
    </Svg>
  );
}

function TerritoryCard({
  artery,
  color,
  leads,
  note,
  title,
  x,
  y,
}: {
  artery: string;
  color: string;
  leads: string;
  note?: string;
  title: string;
  x: number;
  y: number;
}) {
  return (
    <G>
      <Rect fill="#1E293B" height="138" rx="18" stroke="#334155" width="455" x={x} y={y} />
      <Circle cx={x + 54} cy={y + 68} fill={color} opacity="0.22" r="38" />
      <Path d={`M${x + 38} ${y + 78} C${x + 20} ${y + 42} ${x + 62} ${y + 26} ${x + 82} ${y + 52} C${x + 104} ${y + 82} ${x + 66} ${y + 106} ${x + 38} ${y + 78} Z`} fill={color} opacity="0.88" />
      <SvgText fill="#F8FAFC" fontSize="16" fontWeight="900" x={x + 112} y={y + 36}>
        {title}
      </SvgText>
      <SvgText fill={color} fontSize="14" fontWeight="900" x={x + 112} y={y + 62}>
        {leads}
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="12" fontWeight="800" x={x + 112} y={y + 86}>
        {artery}
      </SvgText>
      {!!note && (
        <SvgText fill="#94A3B8" fontSize="11" fontWeight="700" x={x + 112} y={y + 110}>
          {note}
        </SvgText>
      )}
    </G>
  );
}

function QWaveTerritoryMapFigure() {
  return (
    <Svg accessibilityLabel="Contiguous leads myocardial territory map" style={styles.svgQWaveTerritory} viewBox="0 0 1000 500">
      <Rect fill="#0F172A" height="500" rx="20" width="1000" />
      <SvgText fill="#F8FAFC" fontSize="24" fontWeight="900" x="34" y="42">
        Q-wave territory localization
      </SvgText>
      <TerritoryCard artery="Right Coronary Artery (RCA)" color="#F59E0B" leads="II, III, aVF" title="Inferior wall MI" x={36} y={72} />
      <TerritoryCard artery="LAD - septal branches" color="#10B981" leads="V1, V2" title="Septal wall MI" x={510} y={72} />
      <TerritoryCard artery="LAD - main" color="#0EA5E9" leads="V3, V4" note="Often with poor R-wave progression" title="Anterior wall MI" x={36} y={230} />
      <TerritoryCard artery="LCx or diagonal LAD" color="#8B5CF6" leads="I, aVL, V5, V6" title="Lateral wall MI" x={510} y={230} />
      <Rect fill="#450A0A" height="66" rx="14" width="920" x="40" y="408" />
      <Rect fill="#EF4444" height="66" rx="5" width="7" x="40" y="408" />
      <SvgText fill="#FEE2E2" fontSize="13" fontWeight="900" x="62" y="434">
        ALERT: WPW can mimic pathological Q waves
      </SvgText>
      <SvgText fill="#FECACA" fontSize="12" x="62" y="456">
        Negative delta waves in inferior or lateral leads can create false-positive MI patterns. Cross-check PR interval and delta wave.
      </SvgText>
    </Svg>
  );
}

function StMeasurementLandmarksFigure() {
  return (
    <Svg accessibilityLabel="ST segment deviation measurement landmarks" style={styles.svgStMeasure} viewBox="0 0 950 450">
      <Defs>
        <Pattern height="10" id="stSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="stLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#stSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="stArrowOrange" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#F59E0B" />
        </Marker>
        <Marker id="stArrowRed" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="950" />
      <Rect fill="url(#stLargeGrid)" height="330" rx="14" stroke="#E87A75" width="890" x="30" y="70" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Measuring ST-segment deviation
      </SvgText>
      <Line stroke="#059669" strokeDasharray="9 6" strokeWidth="3" x1="70" x2="880" y1="260" y2="260" />
      <SvgText fill="#047857" fontSize="13" fontWeight="900" x="74" y="286">
        Isoelectric baseline: TP segment
      </SvgText>
      <Line stroke="#60A5FA" strokeDasharray="6 6" strokeWidth="2.5" x1="144" x2="236" y1="226" y2="226" />
      <SvgText fill="#2563EB" fontSize="12" fontWeight="900" x="70" y="214">
        PR segment alternative baseline
      </SvgText>
      <Path d="M72 260 C94 260 102 238 122 238 C142 238 150 260 170 260 L236 260 L246 288 L256 166 L266 290 L278 230 L344 230 C372 230 386 214 416 204 C458 190 492 260 540 260 L628 260 C650 260 658 238 678 238 C698 238 706 260 728 260 L788 260 L798 288 L808 166 L818 290 L830 230 L886 230" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      <Circle cx="278" cy="230" fill="#F59E0B" opacity="0.24" r="18" />
      <Circle cx="278" cy="230" fill="#F59E0B" r="6" />
      <Line markerEnd="url(#stArrowOrange)" stroke="#F59E0B" strokeWidth="2.5" x1="360" x2="286" y1="142" y2="220" />
      <SvgText fill="#B45309" fontSize="13" fontWeight="900" x="364" y="140">
        J point
      </SvgText>
      <Line markerEnd="url(#stArrowRed)" markerStart="url(#stArrowRed)" stroke="#DC2626" strokeWidth="3" x1="300" x2="300" y1="230" y2="260" />
      <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="316" y="250">
        vertical ST deviation at J point
      </SvgText>
    </Svg>
  );
}

function StElevationThresholdsFigure() {
  const panels = [
    { label: 'Standard leads', note: 'STE >=1.0 mm in >=2 contiguous leads', threshold: '1.0 mm', x: 34, elev: 30, guide: 20 },
    { label: 'V2/V3 men >=40', note: 'Significant STE >=2.0 mm', threshold: '2.0 mm', x: 356, elev: 50, guide: 40 },
    { label: 'V2/V3 women', note: 'Significant STE >=1.5 mm', threshold: '1.5 mm', x: 678, elev: 40, guide: 30 },
  ];
  return (
    <Svg accessibilityLabel="ST elevation diagnostic thresholds" style={styles.svgStThresholds} viewBox="0 0 1000 450">
      <Defs>
        <Pattern height="10" id="steSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="steLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#steSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="1000" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        ST elevation thresholds at the J point
      </SvgText>
      {panels.map((panel) => {
        const baseline = 260;
        const stY = baseline - panel.elev;
        const guideY = baseline - panel.guide;
        return (
          <G key={panel.label}>
            <Rect fill="url(#steLargeGrid)" height="300" rx="14" stroke="#E87A75" width="288" x={panel.x} y="78" />
            <SvgText fill="#1E40AF" fontSize="15" fontWeight="900" x={panel.x + 18} y="110">
              {panel.label}
            </SvgText>
            <SvgText fill="#334155" fontSize="11" fontWeight="800" x={panel.x + 18} y="130">
              {panel.note}
            </SvgText>
            <Line stroke="#94A3B8" strokeDasharray="5 5" x1={panel.x + 22} x2={panel.x + 266} y1={baseline} y2={baseline} />
            <Line stroke="#DC2626" strokeDasharray="7 5" strokeWidth="2" x1={panel.x + 22} x2={panel.x + 266} y1={guideY} y2={guideY} />
            <Path d={`M${panel.x + 34} ${baseline} C${panel.x + 54} ${baseline} ${panel.x + 60} ${baseline - 20} ${panel.x + 80} ${baseline - 20} C${panel.x + 100} ${baseline - 20} ${panel.x + 106} ${baseline} ${panel.x + 126} ${baseline} L${panel.x + 154} ${baseline} L${panel.x + 164} ${baseline + 28} L${panel.x + 174} ${baseline - 82} L${panel.x + 184} ${baseline + 30} L${panel.x + 196} ${stY} L${panel.x + 252} ${stY} C${panel.x + 268} ${stY - 18} ${panel.x + 284} ${stY - 18} ${panel.x + 298} ${stY}`} fill="none" stroke="#1E40AF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            <Line stroke="#DC2626" strokeWidth="3" x1={panel.x + 206} x2={panel.x + 206} y1={baseline} y2={stY} />
            <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x={panel.x + 212} y={guideY - 8}>
              {panel.threshold}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
}

function StDepressionDigoxinFigure() {
  return (
    <Svg accessibilityLabel="Pathological ST depression versus digoxin effect" style={styles.svgStDepression} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="stdSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="stdLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#stdSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="38">
        ST depression: ischemia versus digoxin effect
      </SvgText>
      <G>
        <Rect fill="url(#stdLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="34" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="56" y="108">
          Ischemic ST depression
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="128">
          Horizontal or downsloping depression
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="214" y2="214" />
        <Path d="M74 214 L150 214 L160 242 L170 132 L180 244 L192 230 L292 230 L344 254 L410 254" fill="none" stroke="#334155" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line stroke="#EA580C" strokeWidth="4" x1="194" x2="292" y1="230" y2="230" />
        <Line stroke="#EA580C" strokeWidth="4" x1="292" x2="344" y1="230" y2="254" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="88" y="310">
          {'>=0.5 mm in >=2 contiguous leads'}
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#stdLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="496" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="518" y="108">
          Digoxin effect
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="128">
          {'Gradual scooped "dig dip"'}
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="214" y2="214" />
        <Path d="M536 214 L612 214 L622 242 L632 132 L642 244 L654 222 C690 238 734 250 778 236 C812 226 832 198 858 190 C876 186 890 198 904 214" fill="none" stroke="#334155" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Path d="M654 222 C690 246 734 256 778 236" fill="none" stroke="#EA580C" strokeDasharray="7 5" strokeLinecap="round" strokeWidth="4" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="616" y="310">
          Smooth, sagging ST segment
        </SvgText>
      </G>
    </Svg>
  );
}

function StLbbbDiscordanceFigure() {
  return (
    <Svg accessibilityLabel="Secondary ST-T discordance in LBBB" style={styles.svgStDiscordance} viewBox="0 0 950 450">
      <Defs>
        <Pattern height="10" id="discSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="discLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#discSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="discArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#D97706" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Secondary ST-T discordance in LBBB
      </SvgText>
      <Rect fill="url(#discLargeGrid)" height="300" rx="14" stroke="#E87A75" width="560" x="34" y="78" />
      <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="570" y1="226" y2="226" />
      <Path d="M70 226 L174 226 C202 226 224 330 264 332 C304 334 334 226 366 226 L410 196 C448 168 500 144 556 226" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
      <Line markerEnd="url(#discArrow)" stroke="#D97706" strokeWidth="4" x1="266" x2="266" y1="206" y2="320" />
      <Line markerEnd="url(#discArrow)" stroke="#D97706" strokeWidth="4" x1="438" x2="438" y1="246" y2="176" />
      <SvgText fill="#B45309" fontSize="13" fontWeight="900" x="198" y="354">
        QRS terminal force down
      </SvgText>
      <SvgText fill="#B45309" fontSize="13" fontWeight="900" x="396" y="160">
        ST-T points up
      </SvgText>
      <Rect fill="#FFFBEB" height="210" rx="18" stroke="#D97706" strokeWidth="2" width="300" x="620" y="104" />
      <SvgText fill="#92400E" fontSize="15" fontWeight="900" x="642" y="138">
        Secondary ST-T discordance
      </SvgText>
      <SvgText fill="#334155" fontSize="12" x="642" y="168">
        LBBB, ventricular rhythm, and pacing
      </SvgText>
      <SvgText fill="#334155" fontSize="12" x="642" y="190">
        cause abnormal depolarisation.
      </SvgText>
      <SvgText fill="#334155" fontSize="12" x="642" y="224">
        Repolarisation naturally deflects
      </SvgText>
      <SvgText fill="#334155" fontSize="12" x="642" y="246">
        opposite the terminal QRS force.
      </SvgText>
      <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="642" y="282">
        Standard STEMI criteria do not apply.
      </SvgText>
    </Svg>
  );
}

function TWaveNormalAnatomyFigure() {
  return (
    <Svg accessibilityLabel="Normal asymmetric T wave with refractory periods" style={styles.svgTWaveAnatomy} viewBox="0 0 950 450">
      <Defs>
        <Pattern height="10" id="tnaSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="tnaLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#tnaSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="tnaArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#EA580C" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Normal T-wave anatomy and refractory zones
      </SvgText>
      <Rect fill="url(#tnaLargeGrid)" height="280" rx="14" stroke="#E87A75" width="880" x="34" y="78" />
      <Rect fill="#DBEAFE" fillOpacity="0.58" height="280" width="372" x="278" y="78" />
      <Rect fill="#FED7AA" fillOpacity="0.62" height="280" width="138" x="650" y="78" />
      <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="892" y1="238" y2="238" />
      <Line stroke="#EA580C" strokeDasharray="7 5" strokeWidth="2" x1="650" x2="650" y1="94" y2="348" />
      <Path d="M72 238 C104 238 112 218 138 218 C164 218 172 238 204 238 L278 238 L288 274 L304 126 L320 278 L340 238 L414 238 C476 238 536 156 650 142 C700 140 750 184 788 238 L884 238" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      <Line markerEnd="url(#tnaArrow)" stroke="#EA580C" strokeWidth="3" x1="724" x2="656" y1="118" y2="140" />
      <SvgText fill="#1E40AF" fontSize="13" fontWeight="900" x="310" y="104">
        Absolute refractory period
      </SvgText>
      <SvgText fill="#1E3A8A" fontSize="11" x="310" y="124">
        Ventricles cannot depolarise
      </SvgText>
      <SvgText fill="#C2410C" fontSize="13" fontWeight="900" x="674" y="104">
        Relative refractory period
      </SvgText>
      <SvgText fill="#9A3412" fontSize="11" x="674" y="124">
        Vulnerable R-on-T zone
      </SvgText>
      <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="724" y="108">
        Peak of T wave
      </SvgText>
      <SvgText fill="#C2410C" fontSize="11" x="724" y="126">
        RRP begins
      </SvgText>
      <SvgText fill="#334155" fontSize="12" fontWeight="900" x="456" y="326">
        Gradual upslope
      </SvgText>
      <SvgText fill="#334155" fontSize="12" fontWeight="900" x="700" y="326">
        Steeper downslope
      </SvgText>
    </Svg>
  );
}

function TWaveInversionsFigure() {
  const panels = [
    {
      title: 'Normal upright T',
      note1: 'Smooth, rounded, upright',
      note2: 'I, II, V3-V6',
      path: 'M54 236 L116 236 L124 264 L134 156 L144 266 L156 236 L206 236 C246 236 280 192 326 184 C364 184 394 212 418 236',
      accent: null,
      x: 34,
    },
    {
      title: 'Ischemic TWI',
      note1: 'Symmetric inversion',
      note2: '-1 mm to -5 mm',
      path: 'M386 236 L448 236 L456 264 L466 156 L476 266 L488 236 L538 236 C578 236 606 286 652 286 C698 286 726 236 750 236',
      accent: 'moderate',
      x: 366,
    },
    {
      title: 'Giant neurogenic TWI',
      note1: 'Deep negative T wave',
      note2: '> -10 mm; CNS/drug toxicity',
      path: 'M718 236 L780 236 L788 264 L798 156 L808 266 L820 236 L858 236 C888 236 904 352 916 356 C948 352 956 246 966 236',
      accent: 'giant',
      x: 698,
    },
  ];

  return (
    <Svg accessibilityLabel="Normal T waves compared with ischemic and giant neurogenic inversions" style={styles.svgTWaveInversions} viewBox="0 0 1000 450">
      <Defs>
        <Pattern height="10" id="twiSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="twiLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#twiSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="1000" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Pathological T-wave inversions
      </SvgText>
      {panels.map((panel) => (
        <G key={panel.title}>
          <Rect fill="url(#twiLargeGrid)" height="300" rx="14" stroke="#E87A75" width="286" x={panel.x} y="78" />
          <SvgText fill="#312E81" fontSize="15" fontWeight="900" x={panel.x + 20} y="110">
            {panel.title}
          </SvgText>
          <SvgText fill="#334155" fontSize="11" fontWeight="800" x={panel.x + 20} y="130">
            {panel.note1}
          </SvgText>
          <SvgText fill="#334155" fontSize="11" fontWeight="800" x={panel.x + 20} y="148">
            {panel.note2}
          </SvgText>
          <Line stroke="#94A3B8" strokeDasharray="5 5" x1={panel.x + 18} x2={panel.x + 268} y1="236" y2="236" />
          {panel.accent === 'moderate' ? (
            <>
              <Path d="M540 236 C580 236 606 286 652 286 C696 286 724 236 748 236" fill="#FDE68A" fillOpacity="0.42" stroke="#D97706" strokeDasharray="7 5" strokeWidth="3" />
              <SvgText fill="#92400E" fontSize="11" fontWeight="900" x="494" y="332">
                Symmetric ischemic inversion
              </SvgText>
            </>
          ) : null}
          {panel.accent === 'giant' ? (
            <>
              <Line stroke="#DC2626" strokeWidth="4" x1="972" x2="972" y1="236" y2="356" />
              <SvgText fill="#B91C1C" fontSize="11" fontWeight="900" x="822" y="332">
                {'>10 mm deep'}
              </SvgText>
            </>
          ) : null}
          <Path d={panel.path} fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        </G>
      ))}
    </Svg>
  );
}

function TWavePeakedHyperacuteFigure() {
  return (
    <Svg accessibilityLabel="Hyperkalemic tented T wave compared with hyperacute STEMI T wave" style={styles.svgTWaveCompare} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="tpkSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="tpkLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#tpkSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="tpkArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#EA580C" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="40">
        Peaked T waves: hyperkalemia versus hyperacute STEMI
      </SvgText>
      <G>
        <Rect fill="url(#tpkLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="34" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="56" y="106">
          Hyperkalemia
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="126">
          {'K+ > 5.5: tall, narrow, tented'}
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="236" y2="236" />
        <Path d="M74 236 L144 236 L154 266 L164 156 L174 268 L186 236 L244 236 L304 96 L364 236 L420 236" fill="none" stroke="#334155" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <Line markerEnd="url(#tpkArrow)" stroke="#EA580C" strokeWidth="3" x1="346" x2="306" y1="122" y2="98" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="342" y="120">
          Sharp peak
        </SvgText>
        <Line stroke="#EA580C" strokeWidth="4" x1="260" x2="346" y1="256" y2="256" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="248" y="284">
          Narrow base
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#tpkLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="496" y="74" />
        <Rect fill="#FECACA" fillOpacity="0.45" height="160" rx="28" width="210" x="646" y="108" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="518" y="106">
          Hyperacute STEMI
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="126">
          Tall, broad-based, symmetric
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="236" y2="236" />
        <Path d="M536 236 L606 236 L616 266 L626 156 L636 268 L648 236 L680 236 C728 232 742 114 776 112 C812 114 828 232 876 236 L904 236" fill="none" stroke="#334155" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
        <Line stroke="#EA580C" strokeWidth="4" x1="678" x2="876" y1="256" y2="256" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="694" y="284">
          Broad base, regional pattern
        </SvgText>
      </G>
    </Svg>
  );
}

function TWaveNotchedFigure() {
  return (
    <Svg accessibilityLabel="Notched T waves caused by hidden P waves or acute pericarditis" style={styles.svgTWaveNotched} viewBox="0 0 950 450">
      <Defs>
        <Pattern height="10" id="tntSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="tntLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#tntSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="tntArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#EA580C" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Notched T-wave differentials
      </SvgText>
      <G>
        <Rect fill="url(#tntLargeGrid)" height="300" rx="14" stroke="#E87A75" width="420" x="34" y="78" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="56" y="110">
          Hidden P wave in T wave
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="130">
          PAC or atrial tachycardia
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="236" y2="236" />
        <Line stroke="#EA580C" strokeDasharray="7 5" strokeWidth="2" x1="318" x2="318" y1="100" y2="332" />
        <Path d="M68 236 C92 236 100 218 124 218 C148 218 156 236 184 236 L220 236 L230 266 L240 154 L250 268 L262 236 L286 236 C302 228 310 194 322 194 C332 194 338 214 344 224 C360 230 384 236 420 236" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.3" />
        <Path d="M286 236 C302 228 310 194 322 194 C332 194 338 214 344 224" fill="none" stroke="#EA580C" strokeLinecap="round" strokeWidth="5" />
        <Line markerEnd="url(#tntArrow)" stroke="#EA580C" strokeWidth="3" x1="372" x2="326" y1="166" y2="198" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="292" y="354">
          Premature P deforms T contour
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#tntLargeGrid)" height="300" rx="14" stroke="#E87A75" width="420" x="496" y="78" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="518" y="110">
          Acute pericarditis
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="130">
          Heavily notched or pointed T waves
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="236" y2="236" />
        <Path d="M536 236 L606 236 L616 266 L626 154 L636 268 L648 236 L700 236 C722 226 734 190 750 184 C762 180 776 210 786 202 C800 192 814 184 830 188 C852 194 868 224 894 236" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.3" />
        <Path d="M718 214 C734 184 752 178 766 206 C784 190 808 180 832 188" fill="none" stroke="#EA580C" strokeLinecap="round" strokeWidth="5" />
        <SvgText fill="#C2410C" fontSize="12" fontWeight="900" x="670" y="354">
          Bumpy T without premature timing
        </SvgText>
      </G>
    </Svg>
  );
}

function QtMeasurementLandmarksFigure() {
  return (
    <Svg accessibilityLabel="QT interval measurement from QRS onset to T wave end with half RR rule" style={styles.svgQtMeasure} viewBox="0 0 950 450">
      <Defs>
        <Pattern height="10" id="qtmSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="qtmLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#qtmSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="450" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Measuring the QT interval
      </SvgText>
      <Rect fill="url(#qtmLargeGrid)" height="280" rx="14" stroke="#E87A75" width="880" x="34" y="78" />
      <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="892" y1="238" y2="238" />
      <Path d="M70 238 C98 238 106 220 130 220 C154 220 162 238 190 238 L266 238 L276 268 L290 130 L306 270 L324 238 L420 238 C482 238 542 172 642 166 C690 166 738 206 768 238 L882 238" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      <Line stroke="#059669" strokeDasharray="7 5" strokeWidth="2.5" x1="266" x2="266" y1="92" y2="350" />
      <Line stroke="#059669" strokeDasharray="7 5" strokeWidth="2.5" x1="768" x2="768" y1="92" y2="350" />
      <Line stroke="#10B981" strokeWidth="5" x1="266" x2="768" y1="326" y2="326" />
      <Line stroke="#10B981" strokeWidth="5" x1="266" x2="266" y1="310" y2="342" />
      <Line stroke="#10B981" strokeWidth="5" x1="768" x2="768" y1="310" y2="342" />
      <SvgText fill="#047857" fontSize="14" fontWeight="900" x="326" y="316">
        QT interval: ventricular depolarisation to repolarisation
      </SvgText>
      <SvgText fill="#047857" fontSize="12" x="276" y="112">
        QRS onset
      </SvgText>
      <SvgText fill="#047857" fontSize="12" x="688" y="112">
        T-wave end
      </SvgText>
      <Line stroke="#7C3AED" strokeDasharray="3 6" strokeWidth="3" x1="290" x2="574" y1="368" y2="368" />
      <Line stroke="#7C3AED" strokeWidth="3" x1="290" x2="290" y1="358" y2="378" />
      <Line stroke="#7C3AED" strokeWidth="3" x1="574" x2="574" y1="358" y2="378" />
      <SvgText fill="#6D28D9" fontSize="12" fontWeight="900" x="332" y="396">
        Half-R-R screen: QT should be less than R-R / 2
      </SvgText>
    </Svg>
  );
}

function QtRateCorrectionFigure() {
  return (
    <Svg accessibilityLabel="Bazett formula dashboard showing QT correction at fast and slow heart rates" style={styles.svgQtRate} viewBox="0 0 1000 500">
      <Rect fill="#0F172A" height="500" rx="18" width="1000" />
      <Rect fill="#172554" height="118" rx="18" stroke="#38BDF8" strokeOpacity="0.35" width="930" x="35" y="30" />
      <SvgText fill="#E0F2FE" fontSize="19" fontWeight="900" x="62" y="66">
        Rate correction and Bazett formula
      </SvgText>
      <SvgText fill="#FFFFFF" fontSize="34" fontWeight="900" x="62" y="112">
        {'QTc = QT / √RR'}
      </SvgText>
      <SvgText fill="#BAE6FD" fontSize="13" x="356" y="92">
        RR is measured in seconds. QTc standardises QT to a 60 bpm reference rate.
      </SvgText>
      <SvgText fill="#FBBF24" fontSize="13" fontWeight="800" x="356" y="118">
        Bazett can overcorrect at fast rates and undercorrect at slow rates.
      </SvgText>
      <G>
        <Rect fill="#111827" height="290" rx="18" stroke="#EF4444" strokeOpacity="0.42" width="445" x="35" y="176" />
        <SvgText fill="#FCA5A5" fontSize="18" fontWeight="900" x="62" y="214">
          Tachycardia scenario
        </SvgText>
        <SvgText fill="#CBD5E1" fontSize="13" x="62" y="238">
          HR 120 bpm, RR 0.50 s
        </SvgText>
        <Line stroke="#475569" strokeDasharray="5 5" x1="62" x2="444" y1="318" y2="318" />
        <Path d="M72 318 L126 318 L136 344 L146 244 L156 346 L168 318 L208 318 C234 318 246 282 278 282 C306 282 326 308 338 318 L420 318 L430 344 L440 244 L450 346 L462 318" fill="none" stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line stroke="#EF4444" strokeWidth="4" x1="126" x2="278" y1="382" y2="382" />
        <SvgText fill="#FCA5A5" fontSize="13" fontWeight="900" x="82" y="414">
          {'Short measured QT, but QTc may become high when RR is short'}
        </SvgText>
        <SvgText fill="#FCA5A5" fontSize="12" x="82" y="440">
          {'Example: QTc = 0.39 / √0.50 = 0.55 s'}
        </SvgText>
      </G>
      <G>
        <Rect fill="#111827" height="290" rx="18" stroke="#10B981" strokeOpacity="0.42" width="445" x="520" y="176" />
        <SvgText fill="#A7F3D0" fontSize="18" fontWeight="900" x="548" y="214">
          Bradycardia scenario
        </SvgText>
        <SvgText fill="#CBD5E1" fontSize="13" x="548" y="238">
          HR 50 bpm, RR 1.20 s
        </SvgText>
        <Line stroke="#475569" strokeDasharray="5 5" x1="548" x2="930" y1="318" y2="318" />
        <Path d="M558 318 L612 318 L622 344 L632 244 L642 346 L654 318 L720 318 C770 318 800 272 850 272 C890 272 914 306 930 318" fill="none" stroke="#E5E7EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        <Line stroke="#10B981" strokeWidth="4" x1="612" x2="850" y1="382" y2="382" />
        <SvgText fill="#A7F3D0" fontSize="13" fontWeight="900" x="566" y="414">
          {'Longer measured QT can correct into a safer range'}
        </SvgText>
        <SvgText fill="#A7F3D0" fontSize="12" x="566" y="440">
          {'Example: QTc = 0.52 / √1.20 = 0.47 s'}
        </SvgText>
      </G>
    </Svg>
  );
}

function QtProlongationTorsadesFigure() {
  return (
    <Svg accessibilityLabel="Prolonged QT with R-on-T impact transitioning into torsades de pointes" style={styles.svgQtTorsades} viewBox="0 0 1100 450">
      <Defs>
        <Marker id="qtpArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#DC2626" />
        </Marker>
      </Defs>
      <Rect fill="#F8FAFC" height="450" rx="18" width="1100" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        QT prolongation and torsades risk
      </SvgText>
      <Rect fill="#FFFFFF" height="300" rx="14" stroke="#CBD5E1" width="610" x="34" y="78" />
      <Line stroke="#94A3B8" strokeDasharray="5 5" x1="58" x2="626" y1="236" y2="236" />
      <Path d="M72 236 C102 236 112 218 138 218 C164 218 174 236 204 236 L256 236 L266 268 L282 124 L298 270 L316 236 L390 236 C464 236 514 178 604 190 C634 196 652 214 662 236" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      <Path d="M520 236 L548 236 L558 290 L572 146 L588 292 L604 226" fill="none" stroke="#DC2626" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      <Circle cx="586" cy="204" fill="#FEE2E2" r="30" stroke="#DC2626" strokeWidth="4" />
      <Line markerEnd="url(#qtpArrow)" stroke="#DC2626" strokeWidth="4" x1="472" x2="580" y1="122" y2="198" />
      <Line stroke="#F59E0B" strokeWidth="5" x1="256" x2="604" y1="326" y2="326" />
      <SvgText fill="#92400E" fontSize="13" fontWeight="900" x="280" y="354">
        {'Pathologically prolonged QTc > 0.50 s'}
      </SvgText>
      <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="372" y="118">
        R-on-T: impulse hits vulnerable repolarisation
      </SvgText>
      <Rect fill="#FEE2E2" height="300" rx="14" stroke="#FCA5A5" width="390" x="676" y="78" />
      <SvgText fill="#991B1B" fontSize="16" fontWeight="900" x="704" y="112">
        Polymorphic ventricular tachycardia
      </SvgText>
      <SvgText fill="#B91C1C" fontSize="13" fontWeight="900" x="704" y="134">
        Torsades de pointes
      </SvgText>
      <Line stroke="#FCA5A5" strokeDasharray="5 5" x1="704" x2="1038" y1="236" y2="236" />
      <Path d="M704 236 C728 128 752 128 776 236 C800 344 824 344 848 236 C872 148 896 148 920 236 C944 324 968 324 992 236 C1016 170 1030 170 1038 236" fill="none" stroke="#DC2626" strokeLinecap="round" strokeWidth="4" />
      <Path d="M704 236 C728 344 752 344 776 236 C800 128 824 128 848 236 C872 324 896 324 920 236 C944 148 968 148 992 236 C1016 302 1030 302 1038 236" fill="none" stroke="#DC2626" strokeLinecap="round" strokeOpacity="0.55" strokeWidth="3" />
    </Svg>
  );
}

function QtShorteningCausesFigure() {
  return (
    <Svg accessibilityLabel="Short QT interval patterns caused by digoxin toxicity and hypercalcemia" style={styles.svgQtShort} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="qtsSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="qtsLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#qtsSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="40">
        Pathological QT shortening
      </SvgText>
      <G>
        <Rect fill="url(#qtsLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="34" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="56" y="106">
          Digoxin toxicity
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="126">
          Short QT with scooped ST-T segment
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="226" y2="226" />
        <Path d="M74 226 L148 226 L158 256 L168 142 L178 258 L190 220 C222 242 260 248 298 232 C324 220 342 194 372 190 C392 190 408 206 420 226" fill="none" stroke="#334155" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
        <Path d="M190 220 C222 244 260 250 298 232" fill="none" stroke="#F59E0B" strokeLinecap="round" strokeWidth="5" />
        <Line stroke="#F59E0B" strokeWidth="4" x1="148" x2="372" y1="304" y2="304" />
        <SvgText fill="#B45309" fontSize="12" fontWeight="900" x="160" y="330">
          Short QT about 0.28 s
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#qtsLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="496" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="518" y="106">
          Hypercalcemia
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="126">
          Virtually absent ST segment
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="226" y2="226" />
        <Path d="M536 226 L610 226 L620 256 L630 142 L640 258 L652 226 C668 204 692 184 724 184 C758 184 780 206 794 226 L894 226" fill="none" stroke="#334155" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
        <Line stroke="#F59E0B" strokeWidth="4" x1="610" x2="794" y1="304" y2="304" />
        <SvgText fill="#B45309" fontSize="12" fontWeight="900" x="626" y="330">
          Short QT about 0.24 s
        </SvgText>
      </G>
    </Svg>
  );
}

function UWaveProminentHypokalemiaFigure() {
  return (
    <Svg accessibilityLabel="Normal tiny U wave compared with prominent U wave in hypokalemia" style={styles.svgUWaveCompare} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="uwpSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="uwpLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#uwpSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
        <Marker id="uwpArrow" markerHeight="8" markerWidth="8" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L8,4 L0,8 Z" fill="#D97706" />
        </Marker>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="40">
        Prominent U waves in hypokalemia
      </SvgText>
      <G>
        <Rect fill="url(#uwpLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="34" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="56" y="106">
          Normal cardiac cycle
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="126">
          {'Tiny, quiet U wave < 0.1 mV / 1 small box'}
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="230" y2="230" />
        <Path d="M74 230 C100 230 108 212 132 212 C156 212 164 230 192 230 L238 230 L248 260 L260 150 L274 262 L290 230 L326 230 C354 230 376 196 404 196 C428 196 444 218 452 230" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
        <Path d="M372 230 C382 230 386 224 394 224 C402 224 406 230 416 230" fill="none" stroke="#0F172A" strokeLinecap="round" strokeWidth="3.2" />
        <SvgText fill="#475569" fontSize="12" fontWeight="900" x="362" y="276">
          subtle U
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#uwpLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="496" y="74" />
        <SvgText fill="#334155" fontSize="16" fontWeight="900" x="518" y="106">
          Hypokalemic waveform
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="126">
          Flat T wave with prominent rounded U wave
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="230" y2="230" />
        <Circle cx="814" cy="205" fill="#D97706" fillOpacity="0.2" r="42" stroke="#D97706" strokeOpacity="0.65" strokeWidth="4" />
        <Path d="M536 230 C562 230 570 212 594 212 C618 212 626 230 654 230 L700 230 L710 260 L722 150 L736 262 L752 230 L792 230 C808 230 816 205 834 205 C854 205 862 230 886 230" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
        <Path d="M754 230 C768 230 776 224 790 224 C802 224 810 230 820 230" fill="none" stroke="#64748B" strokeLinecap="round" strokeWidth="3" />
        <Path d="M792 230 C808 230 816 205 834 205 C854 205 862 230 886 230" fill="none" stroke="#D97706" strokeLinecap="round" strokeWidth="5" />
        <Line markerEnd="url(#uwpArrow)" stroke="#D97706" strokeWidth="3" x1="850" x2="824" y1="164" y2="202" />
        <SvgText fill="#B45309" fontSize="12" fontWeight="900" x="632" y="320">
          Diuretic potassium loss: prominent U wave
        </SvgText>
      </G>
    </Svg>
  );
}

function UWaveInvertedIschemiaFigure() {
  return (
    <Svg accessibilityLabel="Normal upright U wave compared with pathological inverted U wave in lead V3" style={styles.svgUWaveCompare} viewBox="0 0 950 400">
      <Defs>
        <Pattern height="10" id="uwiSmallGrid" patternUnits="userSpaceOnUse" width="10">
          <Path d="M10 0 L0 0 0 10" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="50" id="uwiLargeGrid" patternUnits="userSpaceOnUse" width="50">
          <Rect fill="url(#uwiSmallGrid)" height="50" width="50" />
          <Path d="M50 0 L0 0 0 50" fill="none" stroke="#E87A75" strokeWidth="1.5" />
        </Pattern>
      </Defs>
      <Rect fill="#FFF8F7" height="400" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="40">
        Pathological inverted U waves
      </SvgText>
      <G>
        <Rect fill="url(#uwiLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="34" y="74" />
        <SvgText fill="#312E81" fontSize="16" fontWeight="900" x="56" y="106">
          Normal concordance
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="56" y="126">
          U wave follows the same direction as T
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="56" x2="432" y1="230" y2="230" />
        <Path d="M74 230 L144 230 L154 260 L166 150 L180 262 L196 230 L250 230 C286 230 310 188 348 188 C382 188 402 218 416 230 C426 230 430 218 440 218 C450 218 454 230 464 230" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
        <SvgText fill="#312E81" fontSize="12" fontWeight="900" x="338" y="300">
          upright T and upright U
        </SvgText>
      </G>
      <G>
        <Rect fill="url(#uwiLargeGrid)" height="270" rx="14" stroke="#E87A75" width="420" x="496" y="74" />
        <SvgText fill="#312E81" fontSize="16" fontWeight="900" x="518" y="106">
          Lead V3: inverted U wave
        </SvgText>
        <SvgText fill="#334155" fontSize="12" x="518" y="126">
          Specific warning for ischemia or severe hypertension
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="518" x2="894" y1="230" y2="230" />
        <Path d="M536 230 L606 230 L616 260 L628 150 L642 262 L658 230 L712 230 C748 230 772 188 810 188 C844 188 864 218 878 230" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.4" />
        <Path d="M878 230 C890 230 894 245 906 245 C918 245 922 230 934 230" fill="none" stroke="#DC2626" strokeLinecap="round" strokeWidth="4.2" />
        <Line stroke="#EF4444" strokeWidth="4" x1="898" x2="898" y1="230" y2="245" />
        <Line stroke="#EF4444" strokeWidth="4" x1="884" x2="912" y1="230" y2="230" />
        <Line stroke="#EF4444" strokeWidth="4" x1="884" x2="912" y1="245" y2="245" />
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="648" y="320">
          Inverted U wave: pathological
        </SvgText>
      </G>
    </Svg>
  );
}

function FinalTechnicalValidationFigure() {
  const leadLabels = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

  return (
    <Svg accessibilityLabel="Technical validation dashboard with calibration spike aVR check and ECG printout layout" style={styles.svgFinalTechnical} viewBox="0 0 1000 500">
      <Defs>
        <Pattern height="8" id="ftvSmallGrid" patternUnits="userSpaceOnUse" width="8">
          <Path d="M8 0 L0 0 0 8" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="40" id="ftvLargeGrid" patternUnits="userSpaceOnUse" width="40">
          <Rect fill="url(#ftvSmallGrid)" height="40" width="40" />
          <Path d="M40 0 L0 0 0 40" fill="none" stroke="#E87A75" strokeWidth="1.4" />
        </Pattern>
      </Defs>
      <Rect fill="#0F172A" height="500" rx="18" width="1000" />
      <SvgText fill="#E2E8F0" fontSize="24" fontWeight="900" x="34" y="42">
        Step 12: technical validation and calibration
      </SvgText>
      <G>
        <Rect fill="#111827" height="370" rx="18" stroke="#334155" width="295" x="34" y="78" />
        <SvgText fill="#FBBF24" fontSize="16" fontWeight="900" x="58" y="112">
          Calibration spike validation
        </SvgText>
        <Rect fill="url(#ftvLargeGrid)" height="220" rx="12" width="236" x="58" y="138" />
        <Path d="M112 286 L112 206 L152 206 L152 286" fill="none" stroke="#0F172A" strokeLinecap="round" strokeLinejoin="round" strokeWidth="5" />
        <Line stroke="#D97706" strokeWidth="4" x1="166" x2="166" y1="206" y2="286" />
        <Line stroke="#D97706" strokeWidth="4" x1="156" x2="176" y1="206" y2="206" />
        <Line stroke="#D97706" strokeWidth="4" x1="156" x2="176" y1="286" y2="286" />
        <Line stroke="#D97706" strokeWidth="4" x1="112" x2="152" y1="302" y2="302" />
        <Line stroke="#D97706" strokeWidth="4" x1="112" x2="112" y1="294" y2="310" />
        <Line stroke="#D97706" strokeWidth="4" x1="152" x2="152" y1="294" y2="310" />
        <SvgText fill="#FCD34D" fontSize="12" fontWeight="900" x="182" y="252">
          10 mm
        </SvgText>
        <SvgText fill="#CBD5E1" fontSize="12" x="58" y="390">
          1 mV signal must equal exactly
        </SvgText>
        <SvgText fill="#CBD5E1" fontSize="12" x="58" y="410">
          10 mm vertical deflection.
        </SvgText>
      </G>
      <G>
        <Rect fill="#111827" height="370" rx="18" stroke="#334155" width="295" x="352" y="78" />
        <SvgText fill="#86EFAC" fontSize="16" fontWeight="900" x="376" y="112">
          Lead aVR placement check
        </SvgText>
        <Rect fill="#FFF8F7" height="220" rx="12" width="236" x="376" y="138" />
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="398" x2="590" y1="250" y2="250" />
        <Path d="M404 250 C428 250 436 264 458 264 C480 264 488 250 510 250 L528 250 L538 292 L552 174 L566 294 L582 250 C600 250 608 276 628 276" fill="none" stroke="#312E81" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <Circle cx="404" cy="390" fill="#10B981" r="22" />
        <Path d="M392 390 L400 398 L416 380" fill="none" stroke="#FFFFFF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" />
        <SvgText fill="#CBD5E1" fontSize="12" x="438" y="384">
          Proper aVR should be
        </SvgText>
        <SvgText fill="#CBD5E1" fontSize="12" x="438" y="404">
          predominantly inverted.
        </SvgText>
      </G>
      <G>
        <Rect fill="#111827" height="370" rx="18" stroke="#334155" width="295" x="670" y="78" />
        <SvgText fill="#93C5FD" fontSize="16" fontWeight="900" x="694" y="112">
          ECG printout layout
        </SvgText>
        {leadLabels.map((lead, index) => {
          const col = index % 4;
          const row = Math.floor(index / 4);
          const x = 696 + col * 58;
          const y = 138 + row * 54;
          return (
            <G key={lead}>
              <Rect fill="#F8FAFC" height="42" rx="5" stroke="#CBD5E1" width="48" x={x} y={y} />
              <Path d={`M${x + 6} ${y + 25} L${x + 16} ${y + 25} L${x + 20} ${y + 12} L${x + 24} ${y + 32} L${x + 30} ${y + 25} C${x + 36} ${y + 20} ${x + 42} ${y + 20} ${x + 46} ${y + 25}`} fill="none" stroke="#2563EB" strokeLinecap="round" strokeWidth="1.5" />
              <SvgText fill="#334155" fontSize="8" fontWeight="900" x={x + 4} y={y + 12}>
                {lead}
              </SvgText>
            </G>
          );
        })}
        <SvgText fill="#CBD5E1" fontSize="11" fontWeight="900" x="706" y="316">
          2.5-second lead windows
        </SvgText>
        <Rect fill="#F8FAFC" height="48" rx="8" stroke="#CBD5E1" width="236" x="696" y="340" />
        <Path d="M708 365 L752 365 L758 380 L766 330 L774 382 L784 365 C802 354 820 354 838 365 L882 365 L888 380 L896 330 L904 382 L914 365" fill="none" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        <SvgText fill="#CBD5E1" fontSize="11" fontWeight="900" x="704" y="418">
          Continuous rhythm strip: Lead II
        </SvgText>
      </G>
    </Svg>
  );
}

function FinalEvidenceIntegrationFigure() {
  return (
    <Svg accessibilityLabel="Interdependent evidence integration dashboard for symptoms medicines electrolytes and serial ECG comparison" style={styles.svgFinalEvidence} viewBox="0 0 950 450">
      <Defs>
        <Pattern height="8" id="feiSmallGrid" patternUnits="userSpaceOnUse" width="8">
          <Path d="M8 0 L0 0 0 8" fill="none" stroke="#FADAD8" strokeWidth="0.5" />
        </Pattern>
        <Pattern height="40" id="feiLargeGrid" patternUnits="userSpaceOnUse" width="40">
          <Rect fill="url(#feiSmallGrid)" height="40" width="40" />
          <Path d="M40 0 L0 0 0 40" fill="none" stroke="#E87A75" strokeWidth="1.2" />
        </Pattern>
        <Marker id="feiArrow" markerHeight="9" markerWidth="9" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L9,4 L0,9 Z" fill="#EF4444" />
        </Marker>
      </Defs>
      <Rect fill="#F8FAFC" height="450" rx="18" width="950" />
      <SvgText fill="#0F172A" fontSize="24" fontWeight="900" x="34" y="42">
        Interdependent evidence integration
      </SvgText>
      <Rect fill="#FFFFFF" height="300" rx="18" stroke="#E2E8F0" width="330" x="34" y="76" />
      <SvgText fill="#1E293B" fontSize="17" fontWeight="900" x="58" y="112">
        Clinical metadata input
      </SvgText>
      <Rect fill="#FEE2E2" height="48" rx="10" width="280" x="58" y="136" />
      <SvgText fill="#991B1B" fontSize="12" fontWeight="900" x="74" y="158">
        Active symptoms: urgent
      </SvgText>
      <SvgText fill="#7F1D1D" fontSize="12" x="74" y="176">
        Chest pain 8/10, dyspnoea
      </SvgText>
      <Rect fill="#EFF6FF" height="48" rx="10" width="280" x="58" y="198" />
      <SvgText fill="#1D4ED8" fontSize="12" fontWeight="900" x="74" y="220">
        Medication regimen
      </SvgText>
      <SvgText fill="#1E40AF" fontSize="12" x="74" y="238">
        Digoxin, furosemide
      </SvgText>
      <Rect fill="#FEF3C7" height="58" rx="10" width="280" x="58" y="260" />
      <SvgText fill="#92400E" fontSize="12" fontWeight="900" x="74" y="282">
        Serum electrolytes
      </SvgText>
      <SvgText fill="#92400E" fontSize="12" x="74" y="300">
        {'K+: 3.2 mEq/L low, Ca2+: 9.4'}
      </SvgText>
      <Rect fill="#FFFFFF" height="300" rx="18" stroke="#E2E8F0" width="520" x="396" y="76" />
      <SvgText fill="#1E293B" fontSize="17" fontWeight="900" x="420" y="112">
        Serial ECG comparison
      </SvgText>
      <G>
        <Rect fill="url(#feiLargeGrid)" height="150" rx="12" stroke="#E87A75" width="210" x="420" y="140" />
        <SvgText fill="#334155" fontSize="12" fontWeight="900" x="438" y="164">
          Previous baseline
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="440" x2="610" y1="226" y2="226" />
        <Path d="M444 226 L488 226 L494 250 L502 168 L512 252 L522 226 L556 226 C578 226 592 202 610 226" fill="none" stroke="#2563EB" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        <SvgText fill="#64748B" fontSize="10" x="438" y="316">
          Isoelectric ST, normal T
        </SvgText>
      </G>
      <Line markerEnd="url(#feiArrow)" stroke="#EF4444" strokeWidth="5" x1="650" x2="690" y1="214" y2="214" />
      <SvgText fill="#B91C1C" fontSize="11" fontWeight="900" x="606" y="342">
        Dynamic repolarisation changes
      </SvgText>
      <G>
        <Rect fill="url(#feiLargeGrid)" height="150" rx="12" stroke="#E87A75" width="210" x="700" y="140" />
        <SvgText fill="#B91C1C" fontSize="12" fontWeight="900" x="718" y="164">
          Current tracing
        </SvgText>
        <Line stroke="#94A3B8" strokeDasharray="5 5" x1="720" x2="890" y1="226" y2="226" />
        <Path d="M724 226 L768 226 L774 250 L782 168 L792 252 L804 198 L842 198 C860 176 878 176 894 198" fill="none" stroke="#EF4444" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
        <SvgText fill="#B91C1C" fontSize="10" x="718" y="316">
          ST elevation V2-V4, hyperacute T
        </SvgText>
      </G>
      <Rect fill="#DBEAFE" height="44" rx="12" width="882" x="34" y="392" />
      <SvgText fill="#1E40AF" fontSize="13" fontWeight="900" x="58" y="419">
        ECG findings must be correlated with history, labs, medicines, and serial comparison before final diagnostics.
      </SvgText>
    </Svg>
  );
}

function FinalWorkflowMapFigure() {
  const steps = [
    'Rate',
    'P waves',
    'PR',
    'Rhythm',
    'QRS',
    'Axis',
    'Q waves',
    'ST',
    'T waves',
    'QT',
    'Late/U',
    'Validate',
  ];

  return (
    <Svg accessibilityLabel="Systematic 12 step ECG analysis workflow map ending in AI clinical decision support payload" style={styles.svgFinalWorkflow} viewBox="0 0 1100 400">
      <Defs>
        <Marker id="fwmArrow" markerHeight="9" markerWidth="9" orient="auto" refX="4" refY="4">
          <Path d="M0,0 L9,4 L0,9 Z" fill="#FBBF24" />
        </Marker>
      </Defs>
      <Rect fill="#0F172A" height="400" rx="18" width="1100" />
      <SvgText fill="#E2E8F0" fontSize="24" fontWeight="900" x="34" y="42">
        Systematic 12-step ECG analysis workflow
      </SvgText>
      <Line stroke="#334155" strokeWidth="5" x1="72" x2="1028" y1="160" y2="160" />
      {steps.map((step, index) => {
        const x = 82 + index * 86;
        const isFinal = index === 11;
        return (
          <G key={step}>
            <Circle cx={x} cy="160" fill={isFinal ? '#FBBF24' : '#1E293B'} r={isFinal ? 24 : 20} stroke={isFinal ? '#FEF3C7' : '#60A5FA'} strokeWidth={isFinal ? 5 : 3} />
            <SvgText fill={isFinal ? '#111827' : '#E2E8F0'} fontSize="12" fontWeight="900" textAnchor="middle" x={x} y="165">
              {index + 1}
            </SvgText>
            <SvgText fill={isFinal ? '#FDE68A' : '#CBD5E1'} fontSize="10" fontWeight="800" textAnchor="middle" x={x} y={index % 2 === 0 ? 114 : 218}>
              {step}
            </SvgText>
          </G>
        );
      })}
      <Line markerEnd="url(#fwmArrow)" stroke="#FBBF24" strokeWidth="4" x1="1028" x2="1028" y1="190" y2="260" />
      <Rect fill="#1E293B" height="70" rx="16" stroke="#FBBF24" strokeWidth="3" width="430" x="670" y="286" />
      <SvgText fill="#FDE68A" fontSize="17" fontWeight="900" x="700" y="326">
        AI Clinical Decision Support payload compiled
      </SvgText>
      <SvgText fill="#CBD5E1" fontSize="12" x="700" y="346">
        Final output carries measurements, context, confidence, and safety checks.
      </SvgText>
    </Svg>
  );
}

const styles = StyleSheet.create({
  frame: {
    backgroundColor: '#fffafa',
    borderColor: '#efd6d3',
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    gap: 10,
    marginTop: 4,
    overflow: 'hidden',
    padding: 10,
  },
  figureTitle: {
    color: Palette.ink,
    fontSize: 13,
    fontWeight: '900',
  },
  svg: {
    aspectRatio: 600 / 450,
    width: '100%',
  },
  svgWide: {
    aspectRatio: 800 / 300,
    width: '100%',
  },
  svgCountdown: {
    aspectRatio: 800 / 350,
    width: '100%',
  },
  svgPWavePanels: {
    aspectRatio: 900 / 350,
    width: '100%',
  },
  svgBiphasic: {
    aspectRatio: 800 / 400,
    width: '100%',
  },
  svgRetrograde: {
    aspectRatio: 950 / 300,
    width: '100%',
  },
  svgPrCompare: {
    aspectRatio: 900 / 400,
    width: '100%',
  },
  svgAvBlock: {
    aspectRatio: 1000 / 450,
    width: '100%',
  },
  svgRhythmTree: {
    aspectRatio: 1000 / 600,
    width: '100%',
  },
  svgRhythmDashboard: {
    aspectRatio: 900 / 450,
    width: '100%',
  },
  svgRhythmAssociation: {
    aspectRatio: 1000 / 400,
    width: '100%',
  },
  svgQrsMeasure: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgQrsProgression: {
    aspectRatio: 1000 / 500,
    width: '100%',
  },
  svgQrsHypertrophy: {
    aspectRatio: 1000 / 450,
    width: '100%',
  },
  svgAxisWheel: {
    aspectRatio: 1,
    width: '100%',
  },
  svgAxisQuadrants: {
    aspectRatio: 700 / 550,
    width: '100%',
  },
  svgAxisMatrix: {
    aspectRatio: 900 / 450,
    width: '100%',
  },
  svgAxisTiebreaker: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgAxisDegree: {
    aspectRatio: 1000 / 450,
    width: '100%',
  },
  svgAxisVector: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgQWaveCriteria: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgQWaveWindow: {
    aspectRatio: 900 / 450,
    width: '100%',
  },
  svgQWaveTerritory: {
    aspectRatio: 1000 / 500,
    width: '100%',
  },
  svgStMeasure: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgStThresholds: {
    aspectRatio: 1000 / 450,
    width: '100%',
  },
  svgStDepression: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgStDiscordance: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgTWaveAnatomy: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgTWaveInversions: {
    aspectRatio: 1000 / 450,
    width: '100%',
  },
  svgTWaveCompare: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgTWaveNotched: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgQtMeasure: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgQtRate: {
    aspectRatio: 1000 / 500,
    width: '100%',
  },
  svgQtTorsades: {
    aspectRatio: 1100 / 450,
    width: '100%',
  },
  svgQtShort: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgUWaveCompare: {
    aspectRatio: 950 / 400,
    width: '100%',
  },
  svgFinalTechnical: {
    aspectRatio: 1000 / 500,
    width: '100%',
  },
  svgFinalEvidence: {
    aspectRatio: 950 / 450,
    width: '100%',
  },
  svgFinalWorkflow: {
    aspectRatio: 1100 / 400,
    width: '100%',
  },
  svgWrap: {
    width: '100%',
  },
});
