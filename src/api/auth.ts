import axios from "axios";

const api = axios.create({
  baseURL: "http://felipemariano.com.br:8080/ProjetoAthus",
});

export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  return response.data;
}

export async function signUp(nome: string, email: string, senha: string) {
  const response = await api.post("/auth/cadastrar", {
    nome,
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
