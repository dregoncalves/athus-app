import api from './api';
import { User } from '@/types/User';
import { Image } from 'react-native';

// Atualizar dados do usuário com suporte a imagem e multipart/form-data
export async function updateUser(payload: Partial<User>) {
  const formData = new FormData();

  Object.entries(payload).forEach(([key, value]) => {
    if (value !== null && value !== undefined && key !== 'confirmarSenha') {
      if (key === 'imagemPerfil') {
        if (typeof value === 'string' && value.startsWith('file://')) {
          formData.append('imagemPerfil', {
            uri: value,
            name: 'profile.jpg',
            type: 'image/jpeg',
          } as any);
        } else {
          const resolved = Image.resolveAssetSource(
            require('@/assets/images/usuario.jpg')
          ).uri;
          formData.append('imagemPerfil', {
            uri: resolved,
            name: 'usuario.jpg',
            type: 'image/jpeg',
          } as any);
        }
      } else {
        formData.append(key, String(value));
      }
    }
  });

  const response = await api.put('/usuarios', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

// Buscar informações do usuário autenticado (pelo token JWT)
export async function getLoggedUser() {
  const response = await api.get('/usuarios/logado');
  return response.data;
}

// Buscar usuário por ID (caso ainda use em outras partes)
export async function getUserById(id: number | string) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

// Listar todos os usuários (admin ou painel)
export async function getAllUsers() {
  const response = await api.get('/usuarios');
  return response.data;
}

// Deletar usuário por ID
export async function deleteUser(id: number | string) {
  const response = await api.delete(`/usuarios/${id}`);
  return response.data;
}

// Ativar/desativar usuário
export async function setUserActive(id: number | string, ativo: boolean) {
  const response = await api.patch(`/usuarios/${id}`, { ativo });
  return response.data;
}
