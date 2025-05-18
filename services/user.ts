import api from "@/services/api";

export async function getUser(id: string) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}
