import * as React from 'react';
import { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import * as SplashScreen from 'expo-splash-screen';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';
import { colors } from '@/constants/colors';

// Configuração customizada do Toast
const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{
        borderLeftColor: colors.success || '#46b97b',
        backgroundColor: colors.white,
        borderRadius: 12,
        minHeight: 64,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: colors.success || '#46b97b',
      }}
      text2Style={{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: colors.textDark,
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: colors.error || '#d9534f',
        backgroundColor: colors.white,
        borderRadius: 12,
        minHeight: 64,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
      }}
      contentContainerStyle={{ paddingHorizontal: 16 }}
      text1Style={{
        fontFamily: 'Poppins-Bold',
        fontSize: 16,
        color: colors.error || '#d9534f',
      }}
      text2Style={{
        fontFamily: 'Poppins-Regular',
        fontSize: 14,
        color: colors.textDark,
      }}
    />
  ),
};

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/verify-email"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="provider/[id]" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
        </Stack>
        <StatusBar style="auto" />
        <Toast config={toastConfig} />
      </ThemeProvider>
    </AuthProvider>
  );
}
