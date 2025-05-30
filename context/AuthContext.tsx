// /context/AuthContext.tsx
import React, { createContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import * as AuthService from '../services/authService';
import api from '../services/api';
import { User } from '@/types/User';

interface AuthContextData {
  user: User | null;
  loading: boolean;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  signUp: (payload: any) => Promise<void>;
  verifyEmail: (email: string, codigo: string) => Promise<void>;
  loginWithGoogle: (accessToken: string) => Promise<void>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageData();
  }, []);

  // Carrega o usuário do backend usando apenas o token
  const loadStorageData = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      if (token) {
        const response = await api.get('/usuarios/logado');
        setUser(response.data.body);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.body));
      }
    } catch (error) {
      setUser(null);
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('authToken');
      await AsyncStorage.removeItem('refreshToken');
    } finally {
      setLoading(false);
    }
  };

  // Login tradicional (e-mail/senha)
  const login = async (email: string, senha: string) => {
    const data = await AuthService.login(email, senha);

    // Salva os tokens primeiro!
    await AsyncStorage.setItem('authToken', data.body.accessToken);
    await AsyncStorage.setItem('refreshToken', data.body.refreshToken);

    // Agora busca o usuário logado
    const response = await api.get('/usuarios/logado');
    setUser(response.data.body);

    await AsyncStorage.setItem('user', JSON.stringify(response.data.body));
    router.replace('/(tabs)');
  };

  // Login com Google
  const loginWithGoogle = async (googleAccessToken: string) => {
    // Faz login na API usando o token do Google
    const data = await AuthService.loginWithGoogle(googleAccessToken);

    // Salva os tokens do backend (cobre diferentes estruturas de retorno)
    if (data.body?.accessToken && data.body?.refreshToken) {
      await AsyncStorage.setItem('authToken', data.body.accessToken);
      await AsyncStorage.setItem('refreshToken', data.body.refreshToken);
    } else if (data.token && data.refreshToken) {
      await AsyncStorage.setItem('authToken', data.token);
      await AsyncStorage.setItem('refreshToken', data.refreshToken);
    }

    // Busca o usuário logado
    const response = await api.get('/usuarios/logado');
    setUser(response.data.body);

    await AsyncStorage.setItem('user', JSON.stringify(response.data.body));
    router.replace('/(tabs)');
  };

  const logout = async () => {
    await AuthService.logout();
    setUser(null);
    router.replace('/auth/login');
  };

  const signUp = async (payload: any) => {
    await AuthService.signUp(payload);
  };

  const verifyEmail = async (email: string, codigo: string) => {
    await AuthService.verifyEmail(email, codigo);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        signUp,
        verifyEmail,
        loginWithGoogle, // agora disponível no contexto
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
