import api from "./api";
import AsyncStorage from "@react-native-async-storage/async-storage";

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

// CADASTRO (payload pode ser qualquer objeto do seu multi-step)
export async function signUp(payload: any) {
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
  const response = await api.post("/oauth2/google/autenticado", {
    access_token: accessToken,
  });

  if (response.data?.token && response.data?.refreshToken) {
    await AsyncStorage.setItem("authToken", response.data.token);
    await AsyncStorage.setItem("refreshToken", response.data.refreshToken);
    return response.data;
  } else if (response.data?.body?.accessToken) {
    await AsyncStorage.setItem("authToken", response.data.body.accessToken);
    await AsyncStorage.setItem("refreshToken", response.data.body.refreshToken);
    return response.data;
  } else {
    throw new Error("Token não retornado pelo servidor.");
  }
}