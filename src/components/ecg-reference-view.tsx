import React from 'react';
import { LayoutChangeEvent, StyleSheet, Text, View } from 'react-native';
import { Palette, Radius } from '@/constants/design';

type EcgReferenceVariant = 'heart-rate' | 'rhythm';

type Segment = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

type Marker = {
  label: string;
  x: number;
  y: number;
  tone?: 'primary' | 'accent';
};

type EcgReferenceViewProps = {
  variant: EcgReferenceVariant;
};

const rhythmSegments: Segment[] = [
  { x1: 3, y1: 63, x2: 11, y2: 63 },
  { x1: 11, y1: 63, x2: 14, y2: 58 },
  { x1: 14, y1: 58, x2: 18, y2: 63 },
  { x1: 18, y1: 63, x2: 26, y2: 63 },
  { x1: 26, y1: 63, x2: 29, y2: 73 },
  { x1: 29, y1: 73, x2: 33, y2: 24 },
  { x1: 33, y1: 24, x2: 37, y2: 75 },
  { x1: 37, y1: 75, x2: 42, y2: 63 },
  { x1: 42, y1: 63, x2: 50, y2: 63 },
  { x1: 50, y1: 63, x2: 54, y2: 56 },
  { x1: 54, y1: 56, x2: 58, y2: 63 },
  { x1: 58, y1: 63, x2: 66, y2: 63 },
  { x1: 66, y1: 63, x2: 69, y2: 73 },
  { x1: 69, y1: 73, x2: 73, y2: 24 },
  { x1: 73, y1: 24, x2: 77, y2: 75 },
  { x1: 77, y1: 75, x2: 82, y2: 63 },
  { x1: 82, y1: 63, x2: 90, y2: 63 },
  { x1: 90, y1: 63, x2: 93, y2: 58 },
  { x1: 93, y1: 58, x2: 97, y2: 63 },
];

const rateSegments: Segment[] = [
  { x1: 4, y1: 64, x2: 11, y2: 64 },
  { x1: 11, y1: 64, x2: 14, y2: 58 },
  { x1: 14, y1: 58, x2: 17, y2: 64 },
  { x1: 17, y1: 64, x2: 23, y2: 64 },
  { x1: 23, y1: 64, x2: 26, y2: 74 },
  { x1: 26, y1: 74, x2: 30, y2: 20 },
  { x1: 30, y1: 20, x2: 34, y2: 76 },
  { x1: 34, y1: 76, x2: 39, y2: 64 },
  { x1: 39, y1: 64, x2: 45, y2: 64 },
  { x1: 45, y1: 64, x2: 51, y2: 52 },
  { x1: 51, y1: 52, x2: 58, y2: 64 },
  { x1: 58, y1: 64, x2: 63, y2: 64 },
  { x1: 63, y1: 64, x2: 66, y2: 58 },
  { x1: 66, y1: 58, x2: 69, y2: 64 },
  { x1: 69, y1: 64, x2: 75, y2: 64 },
  { x1: 75, y1: 64, x2: 78, y2: 74 },
  { x1: 78, y1: 74, x2: 82, y2: 20 },
  { x1: 82, y1: 20, x2: 86, y2: 76 },
  { x1: 86, y1: 76, x2: 91, y2: 64 },
  { x1: 91, y1: 64, x2: 95, y2: 64 },
  { x1: 95, y1: 64, x2: 98, y2: 58 },
  { x1: 98, y1: 58, x2: 100, y2: 64 },
];

const TRACE_HEIGHT = 148;

function toPoint(segment: Segment, width: number) {
  return {
    x1: (segment.x1 / 100) * width,
    y1: (segment.y1 / 100) * TRACE_HEIGHT,
    x2: (segment.x2 / 100) * width,
    y2: (segment.y2 / 100) * TRACE_HEIGHT,
  };
}

function EcgSegment({ segment, width }: { segment: Segment; width: number }) {
  const point = toPoint(segment, width);
  const dx = point.x2 - point.x1;
  const dy = point.y2 - point.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  return (
    <View
      style={[
        styles.segment,
        {
          left: point.x1,
          top: point.y1 - 1.5,
          transform: [{ rotate: `${angle}deg` }],
          transformOrigin: 'left center',
          width: length,
        },
      ]}
    />
  );
}

function MarkerPill({ marker, width }: { marker: Marker; width: number }) {
  const isAccent = marker.tone === 'accent';
  const left = (marker.x / 100) * width;
  const top = (marker.y / 100) * TRACE_HEIGHT;

  return (
    <View
      style={[
        styles.marker,
        isAccent ? styles.markerAccent : styles.markerPrimary,
        {
          left: left - 15,
          top: top - 12,
        },
      ]}
    >
      <Text style={styles.markerText}>{marker.label}</Text>
    </View>
  );
}

function Grid() {
  return (
    <>
      {Array.from({ length: 12 }).map((_, index) => (
        <View
          key={`v-${index}`}
          style={[
            styles.verticalLine,
            index % 3 === 0 && styles.majorGridLine,
            { left: `${index * 9}%` },
          ]}
        />
      ))}
      {Array.from({ length: 6 }).map((_, index) => (
        <View
          key={`h-${index}`}
          style={[
            styles.horizontalLine,
            index % 2 === 0 && styles.majorGridLine,
            { top: `${index * 20}%` },
          ]}
        />
      ))}
    </>
  );
}

export function EcgReferenceView({ variant }: EcgReferenceViewProps) {
  const [traceWidth, setTraceWidth] = React.useState(0);
  const segments = variant === 'heart-rate' ? rateSegments : rhythmSegments;
  const markers: Marker[] =
    variant === 'heart-rate'
      ? [
          { label: 'R1', x: 30, y: 20, tone: 'accent' },
          { label: 'R2', x: 82, y: 20, tone: 'accent' },
        ]
      : [
          { label: 'P', x: 14, y: 49 },
          { label: 'R', x: 33, y: 23, tone: 'accent' },
          { label: 'P', x: 54, y: 49 },
          { label: 'R', x: 73, y: 23, tone: 'accent' },
        ];
  const hasLayout = traceWidth > 0;
  const handleLayout = (event: LayoutChangeEvent) => {
    setTraceWidth(event.nativeEvent.layout.width);
  };

  return (
    <View style={styles.container} onLayout={handleLayout}>
      <Grid />
      {hasLayout &&
        segments.map((segment, index) => <EcgSegment key={`${variant}-${index}`} segment={segment} width={traceWidth} />)}
      {hasLayout && markers.map((marker, index) => <MarkerPill key={`${marker.label}-${index}`} marker={marker} width={traceWidth} />)}

      {hasLayout && variant === 'heart-rate' && (
        <View
          style={[
            styles.bracket,
            {
              left: traceWidth * 0.3,
              width: traceWidth * 0.52,
            },
          ]}
        >
          <Text style={styles.bracketLabel}>4 large boxes</Text>
        </View>
      )}

      {variant === 'rhythm' && (
        <View style={styles.rhythmGuide}>
          <Text style={styles.rhythmGuideText}>P before each QRS</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff3ef',
    height: 148,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
  verticalLine: {
    backgroundColor: '#f4d8d2',
    height: '100%',
    opacity: 0.72,
    position: 'absolute',
    top: 0,
    width: 1,
  },
  horizontalLine: {
    backgroundColor: '#f4d8d2',
    height: 1,
    left: 0,
    opacity: 0.72,
    position: 'absolute',
    width: '100%',
  },
  majorGridLine: {
    backgroundColor: '#edbdb5',
    opacity: 0.95,
  },
  segment: {
    backgroundColor: Palette.accent,
    borderRadius: 999,
    height: 3,
    position: 'absolute',
  },
  marker: {
    alignItems: 'center',
    borderRadius: 999,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    width: 30,
  },
  markerPrimary: {
    backgroundColor: Palette.primary,
  },
  markerAccent: {
    backgroundColor: Palette.accent,
  },
  markerText: {
    color: Palette.paper,
    fontSize: 10,
    fontWeight: '900',
  },
  bracket: {
    alignItems: 'center',
    borderColor: Palette.primary,
    borderLeftWidth: 2,
    borderRightWidth: 2,
    borderTopWidth: 2,
    height: 18,
    left: '20%',
    position: 'absolute',
    top: 20,
    width: '35%',
  },
  bracketLabel: {
    backgroundColor: '#fff3ef',
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
    paddingHorizontal: 5,
    position: 'absolute',
    top: -19,
  },
  rhythmGuide: {
    backgroundColor: Palette.primarySoft,
    borderCurve: 'continuous',
    borderRadius: Radius.sm,
    bottom: 10,
    left: 12,
    paddingHorizontal: 9,
    paddingVertical: 6,
    position: 'absolute',
  },
  rhythmGuideText: {
    color: Palette.primary,
    fontSize: 11,
    fontWeight: '900',
  },
});
