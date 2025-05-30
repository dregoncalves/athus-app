// services/userService.ts
import api from "./api";
import { User } from "@/types/User"; // Ajuste o path

// Função para atualizar o usuário (UPDATE)
export async function updateUser(payload: Partial<User>) {
  // A API espera todos os campos (PUT) ou só os alterados (PATCH)?
  // Aqui, por padrão, enviando PUT para '/usuarios'
  const response = await api.put("/usuarios", payload);
  return response.data;
}

// Função para buscar um usuário por ID
export async function getUserById(id: string | number) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}
