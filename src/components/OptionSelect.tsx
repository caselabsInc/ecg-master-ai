import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, Radius } from '@/constants/design';

interface OptionSelectProps {
  options: { label: string; value: string }[];
  selectedValue?: string;
  onSelect?: (value: string) => void;
  multiSelect?: boolean;
  selectedValues?: string[];
  onToggleSelect?: (value: string) => void;
}

export function OptionSelect({ options, selectedValue, onSelect, multiSelect, selectedValues, onToggleSelect }: OptionSelectProps) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = multiSelect ? selectedValues?.includes(opt.value) : selectedValue === opt.value;

        return (
          <Pressable
            key={opt.value}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => {
              if (multiSelect && onToggleSelect) {
                onToggleSelect(opt.value);
              } else {
                onSelect?.(opt.value);
              }
            }}
          >
            <View style={[styles.radio, multiSelect && styles.checkbox, isSelected && styles.radioSelected]}>
              {isSelected && <Ionicons name="checkmark" size={15} color={Palette.paper} />}
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{opt.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    marginVertical: 16,
  },
  option: {
    alignItems: 'center',
    backgroundColor: Palette.paper,
    borderColor: Palette.line,
    borderCurve: 'continuous',
    borderRadius: Radius.lg,
    borderWidth: 1,
    flexDirection: 'row',
    padding: 15,
  },
  optionSelected: {
    backgroundColor: Palette.primarySoft,
    borderColor: Palette.primary,
  },
  radio: {
    alignItems: 'center',
    borderColor: Palette.lineStrong,
    borderRadius: 12,
    borderWidth: 2,
    height: 24,
    justifyContent: 'center',
    marginRight: 12,
    width: 24,
  },
  checkbox: {
    borderRadius: 7,
  },
  radioSelected: {
    backgroundColor: Palette.primary,
    borderColor: Palette.primary,
  },
  label: {
    color: Palette.ink,
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  labelSelected: {
    color: Palette.primary,
    fontWeight: '800',
  },
});
