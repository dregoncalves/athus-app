// src/context/AuthContext.tsx
import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeToken = async (token: string) => {
  await AsyncStorage.setItem("authToken", token);
};

export const getToken = async () => {
  return await AsyncStorage.getItem("authToken");
};
