import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius } from '@/constants/design';

type IconName = React.ComponentProps<typeof Ionicons>['name'];

export function ScreenHeroBanner({
  icon,
  kicker,
  title,
  description,
  children,
}: {
  icon: IconName;
  kicker: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <View style={styles.heroIcon}>
          <Ionicons name={icon} size={25} color={Palette.paper} />
        </View>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>{kicker}</Text>
          <Text style={styles.heroTitle}>{title}</Text>
        </View>
      </View>
      {description ? <Text style={styles.heroText}>{description}</Text> : null}
      {children ? <View style={styles.heroActions}>{children}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Palette.primary,
    borderCurve: 'continuous',
    borderRadius: Radius.xl,
    boxShadow: Palette.shadow,
    gap: 16,
    padding: 20,
  },
  heroTop: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 13,
  },
  heroIcon: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 253, 248, 0.14)',
    borderColor: 'rgba(255, 253, 248, 0.22)',
    borderCurve: 'continuous',
    borderRadius: Radius.md,
    borderWidth: 1,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  heroCopy: {
    flex: 1,
    gap: 3,
    minWidth: 0,
  },
  kicker: {
    color: '#b9d8d4',
    fontSize: 12,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: Palette.paper,
    fontSize: 27,
    fontWeight: '900',
    lineHeight: 32,
  },
  heroText: {
    color: '#d7ebe8',
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 21,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 10,
  },
});
