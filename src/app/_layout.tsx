// app/_layout.tsx
import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="transparent"
        translucent
      />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{ headerShown: false }}
        ></Stack.Screen>

        <Stack.Screen
          name="(auth)/onboarding/page"
          options={{ headerShown: false }}
        ></Stack.Screen>

        <Stack.Screen
          name="(panel])/profile/page"
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack>
    </>
  );
}
