// services/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { logout } from './authService';

const api = axios.create({
  baseURL: 'http://felipemariano.com.br:8080/ProjetoAthus',
});

// Adiciona token (exceto para rotas de autenticação)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('authToken');
  const url = config.url || '';
  // Considera qualquer rota que tenha "/auth" (no início ou meio)
  if (token && !url.includes('/auth/')) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Refresh automático de token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh')
    ) {
      originalRequest._retry = true;
      try {
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('Refresh token ausente');

        const res = await api.post('/auth/refresh', { refreshToken });
        const { accessToken, refreshToken: newRefresh } = res.data.body;

        await AsyncStorage.setItem('authToken', accessToken);
        await AsyncStorage.setItem('refreshToken', newRefresh);

        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (err) {
        await logout();
        router.replace('/auth/login');
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
