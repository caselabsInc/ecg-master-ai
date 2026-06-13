import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface OptionSelectProps {
  options: { label: string; value: string }[];
  selectedValue?: string;
  onSelect: (value: string) => void;
  multiSelect?: boolean;
  selectedValues?: string[];
  onToggleSelect?: (value: string) => void;
}

export function OptionSelect({ options, selectedValue, onSelect, multiSelect, selectedValues, onToggleSelect }: OptionSelectProps) {
  return (
    <View style={styles.container}>
      {options.map((opt) => {
        const isSelected = multiSelect 
          ? selectedValues?.includes(opt.value) 
          : selectedValue === opt.value;
          
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.option, isSelected && styles.optionSelected]}
            onPress={() => {
              if (multiSelect && onToggleSelect) {
                onToggleSelect(opt.value);
              } else {
                onSelect(opt.value);
              }
            }}
          >
            <View style={[styles.radio, multiSelect && styles.checkbox, isSelected && styles.radioSelected]}>
              {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
            </View>
            <Text style={[styles.label, isSelected && styles.labelSelected]}>{opt.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#fff',
  },
  optionSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#eff6ff',
  },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#cbd5e1',
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkbox: {
    borderRadius: 6,
  },
  radioSelected: {
    borderColor: '#2563eb',
    backgroundColor: '#2563eb',
  },
  label: {
    fontSize: 16,
    color: '#334155',
  },
  labelSelected: {
    color: '#1e40af',
    fontWeight: '500',
  }
});
