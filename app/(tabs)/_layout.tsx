import * as React from 'react';
import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { House, User } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: [
          styles.tabBar,
          { paddingBottom: insets.bottom > 0 ? insets.bottom : 8 }
        ],
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
        tabBarShowLabel: true,
        tabBarPressColor: 'transparent', // aqui remove o ripple
        tabBarPressOpacity: 1,           // aqui remove o fade
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <House size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    paddingTop: 2,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  tabBarLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
});
