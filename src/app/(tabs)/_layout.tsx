import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Palette } from '@/constants/design';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerStyle: { backgroundColor: Palette.canvas },
      headerShadowVisible: false,
      headerShown: true,
      headerTitleStyle: {
        color: Palette.ink,
        fontSize: 18,
        fontWeight: '800',
      },
      sceneStyle: { backgroundColor: Palette.canvas },
      tabBarActiveTintColor: Palette.primary,
      tabBarInactiveTintColor: Palette.subtle,
      tabBarStyle: {
        backgroundColor: Palette.paper,
        borderColor: Palette.line,
      },
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '700',
      },
    }}>
      <Tabs.Screen
        name="index"
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <Ionicons name="document-text-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          headerShown: false,
          title: 'Learn',
          tabBarIcon: ({ color }) => <Ionicons name="school-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}
