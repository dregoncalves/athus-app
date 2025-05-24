// services/authService.ts
import { SignUpPayload } from "@/types/SignUpPayload";
import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/types/User";

// LOGIN
export async function login(email: string, senha: string) {
  const response = await api.post("/auth/login", { email, senha });
  // Salve tokens e usuário localmente SE a API retornar já no login
  if (response.data?.body?.accessToken) {
    await AsyncStorage.setItem("authToken", response.data.body.accessToken);
    await AsyncStorage.setItem("refreshToken", response.data.body.refreshToken);
  }
  return response.data;
}

// CADASTRO. SignUpPayload é a interface de cadastro inicial. Impede campos errados.
export async function signUp(payload: SignUpPayload) {
  const response = await api.post("/auth/cadastrar", payload);
  return response.data;
}

// VERIFICAÇÃO DE E-MAIL
export async function verifyEmail(email: string, codigo: string) {
  const response = await api.post("/auth/validarcodigo", { email, codigo });
  return response.data;
}

// LOGOUT seguro
export async function logout() {
  await AsyncStorage.clear();
}

export async function loginWithGoogle(accessToken: string) {
  // Faça a chamada para autenticar
  const response = await api.post("/oauth2/google/autenticado", {
    access_token: accessToken,
  });

  // Pegue accessToken e refreshToken do response
  const token = response.data.body.accessToken;
  const refreshToken = response.data.body.refreshToken;

  // Salve ambos os tokens!
  await AsyncStorage.setItem("authToken", token);
  await AsyncStorage.setItem("refreshToken", refreshToken);

  // Agora pode fazer a request autenticada para pegar o usuário
  const userResponse = await api.get("/usuarios/{id}"); // ajuste o endpoint se necessário
  const user: User = userResponse.data;

  await AsyncStorage.setItem("user", JSON.stringify(user));

  return { token, refreshToken, user };
}

