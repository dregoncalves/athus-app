import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { verifyEmail } from "@/src/api/auth";
import { router, useLocalSearchParams } from "expo-router";

export default function VerifyEmailPage() {
  const [code, setCode] = useState("");
  const { email } = useLocalSearchParams(); // recebe o email via rota

  const handleVerify = async () => {
    if (!code || !email) {
      Alert.alert("Erro", "Informe o código de verificação.");
      return;
    }

    try {
      await verifyEmail(String(email), code);
      Alert.alert("Sucesso", "E-mail verificado com sucesso!");
      router.replace("/(panel)/profile/page");
    } catch (error) {
      Alert.alert("Erro", "Código inválido ou expirado.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verificar E-mail</Text>
      <Text style={styles.subtitle}>Insira o código enviado para {email}</Text>

      <TextInput
        style={styles.input}
        placeholder="Código de verificação"
        keyboardType="numeric"
        value={code}
        onChangeText={setCode}
      />

      <TouchableOpacity style={styles.button} onPress={handleVerify}>
        <Text style={styles.buttonText}>Verificar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#666",
  },
  input: {
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
