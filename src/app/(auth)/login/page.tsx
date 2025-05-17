import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { login } from "@/src/api/auth";
import { router } from "expo-router";
import Icon from "react-native-vector-icons/FontAwesome";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    try {
      const data = await login(email, password);
      const { accessToken, refreshToken } = data.body;

      if (!accessToken || !refreshToken) throw new Error("Tokens ausentes");

      await AsyncStorage.setItem("authToken", accessToken);
      await AsyncStorage.setItem("refreshToken", refreshToken);

      Alert.alert("Sucesso", "Login realizado!");
      router.replace("/(private)/profile/page");
    } catch (error) {
      Alert.alert("Erro", "Falha no login. Verifique suas credenciais.");
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Image source={require("../../../../assets/images/logo.png")} style={styles.logo} />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#9CA3AF"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotPassword}>
          <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
        </TouchableOpacity>

        <View style={styles.socialContainer}>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="google" size={20} color="#DB4437" />
            <Text style={styles.socialText}>Entrar com Google</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.socialButton}>
            <Icon name="facebook" size={20} color="#4267B2" />
            <Text style={styles.socialText}>Entrar com Facebook</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.signupLink}
          onPress={() => router.push("/(auth)/signup/page")}
        >
          <Text style={styles.signupText}>
            Não tem uma conta?{" "}
            <Text style={styles.signupTextBold}>Crie uma</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  inner: {
    width: "100%",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    backgroundColor: "#F9FAFB",
    padding: 14,
    borderRadius: 12,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },
  button: {
    backgroundColor: "#DBB93D",
    paddingVertical: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: {
    color: "#000",
    fontSize: 16,
    fontWeight: "bold",
  },
  forgotPassword: {
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: "#DBB93D",
    fontSize: 14,
  },
  socialContainer: {
    width: "100%",
    gap: 12,
    marginBottom: 20,
  },
  socialButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  socialText: {
    fontSize: 15,
    color: "#1E293B",
  },
  signupLink: {
    marginTop: 10,
  },
  signupText: {
    fontSize: 14,
    color: "#E2E8F0",
  },
  signupTextBold: {
    color: "#DBB93D",
    fontWeight: "600",
  },
});

