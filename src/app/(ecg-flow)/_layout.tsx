import { Stack, useRouter } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEcgStore } from '../../store/ecgStore';
import { Alert } from 'react-native';

export default function EcgFlowLayout() {
  const router = useRouter();
  const resetDraft = useEcgStore((state) => state.resetDraft);

  const handleClose = () => {
    Alert.alert('Save Draft?', 'You can continue this later from your reports.', [
      { text: 'Discard', style: 'destructive', onPress: () => {
          resetDraft();
          router.replace('/(tabs)');
      }},
      { text: 'Save & Close', onPress: () => {
          // It's already autosaved locally in the step handlers
          router.replace('/(tabs)');
      }},
      { text: 'Cancel', style: 'cancel' }
    ]);
  };

  return (
    <Stack screenOptions={{
      headerRight: () => (
        <TouchableOpacity onPress={handleClose} style={{ padding: 8 }}>
          <Ionicons name="close" size={24} color="#0f172a" />
        </TouchableOpacity>
      ),
      headerBackTitleVisible: false,
      headerTintColor: '#2563eb',
    }}>
      <Stack.Screen name="pre-step" options={{ title: 'Patient Info' }} />
      <Stack.Screen name="step-1" options={{ title: 'Step 1: Heart Rate' }} />
      <Stack.Screen name="step-2" options={{ title: 'Step 2: Rhythm' }} />
      <Stack.Screen name="step-3" options={{ title: 'Step 3: P Wave' }} />
      <Stack.Screen name="step-4" options={{ title: 'Step 4: PR Interval' }} />
      <Stack.Screen name="step-5" options={{ title: 'Step 5: QRS Complex' }} />
      <Stack.Screen name="step-6" options={{ title: 'Step 6: Cardiac Axis' }} />
      <Stack.Screen name="step-7" options={{ title: 'Step 7: Q Waves' }} />
      <Stack.Screen name="step-8" options={{ title: 'Step 8: ST Segment' }} />
      <Stack.Screen name="step-9" options={{ title: 'Step 9: T Waves' }} />
      <Stack.Screen name="step-10" options={{ title: 'Step 10: QT Interval' }} />
      <Stack.Screen name="step-11" options={{ title: 'Step 11: R Wave & U Waves' }} />
      <Stack.Screen name="step-12" options={{ title: 'Step 12: Notes' }} />
      <Stack.Screen name="results" options={{ title: 'Interpretation', headerRight: undefined, headerLeft: () => null, gestureEnabled: false }} />
    </Stack>
  );
}
