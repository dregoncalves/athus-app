import api from "@/services/api";

// Buscar user pelo ID
export async function getUser(id: string) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

// Atualizar user, não sei como
export async function updateUser(id: string) {
  const response = await api.put('/usuarios')
}