import api from "./axios";

export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
}

export async function signUp(nomeCompleto: string, email: string, senha: string) {
  const response = await api.post("/auth/cadastrar", {
    nomeCompleto,
    email,
    senha,
  });
  return response.data;
}

export async function verifyEmail(email: string, codigo: string) {
  const response = await api.post("/auth/validarcodigo", {
    email,
    codigo,
  });
  return response.data;
}
