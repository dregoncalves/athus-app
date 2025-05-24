import React, { createContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import * as AuthService from "../services/authService";

type User = {
  nome: string;
  email: string;
};

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (payload: any) => Promise<void>;
  verifyEmail: (email: string, codigo: string) => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  // Carrega o usuário do AsyncStorage
  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem("authToken");
      const userData = await AsyncStorage.getItem("user");
      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário", error);
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email: string, senha: string) => {
    const data = await AuthService.login(email, senha);
    const { accessToken, refreshToken, nome } = data.body;
    const user = { nome, email };
    setUser(user);
    await AsyncStorage.setItem("authToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("user", JSON.stringify(user));
    router.replace("/(tabs)");
  };

  // Logout global seguro
  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    router.replace("/auth/login");
  };

  // Cadastro com payload completo
  const signUp = async (payload: any) => {
    await AuthService.signUp(payload);
  };

  // Verificação de e-mail
  const verifyEmail = async (email: string, codigo: string) => {
    await AuthService.verifyEmail(email, codigo);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, signUp, verifyEmail }}
    >
      {children}
    </AuthContext.Provider>
  );
};
