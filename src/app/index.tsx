import { Redirect } from "expo-router";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { View } from "react-native";

export default function Index() {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(
    null
  );

  useEffect(() => {
    checkOnboarding();
  }, []);

  const checkOnboarding = async () => {
    try {
      const value = await AsyncStorage.getItem("hasSeenOnboarding");
      setHasSeenOnboarding(value === "true");
    } catch (error) {
      setHasSeenOnboarding(false);
    }
  };

  if (hasSeenOnboarding === null) {
    return <View />;
  }

  return (
    <Redirect
      href={
        hasSeenOnboarding ? "/(auth)/login/page" : "/(auth)/onboarding/page"
      }
    />
  );
}
