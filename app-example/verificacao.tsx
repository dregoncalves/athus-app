import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";

export default function VerificacaoEmailScreen() {
  const [codigo, setCodigo] = useState("");
  const router = useRouter();

  const codigoCorreto = "123456"; // Código fixo

  const handleVerificar = () => {
    if (codigo === codigoCorreto) {
      router.push("/perfil");
    } else {
      Alert.alert("Código incorreto!");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/images/icon.png")}
          style={styles.logo}
        />
        <Text style={styles.headerText}>
          Confirme o código enviado por e-mail
        </Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formLabel}>Código de verificação</Text>
        <TextInput
          style={styles.input}
          value={codigo}
          onChangeText={setCodigo}
          placeholder="Digite o código"
          keyboardType="number-pad"
          maxLength={6}
        />

        <TouchableOpacity style={styles.button} onPress={handleVerificar}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#d4af37" },
  header: { alignItems: "center", marginTop: 60, marginBottom: 20 },
  headerText: {
    fontSize: 18,
    fontWeight: "500",
    marginTop: 10,
    textAlign: "center",
  },
  logo: { width: 40, height: 40, tintColor: "#000" },
  form: {
    flex: 1,
    backgroundColor: "#e5e5e5",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  formLabel: { textAlign: "center", marginBottom: 10, fontWeight: "500" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  button: {
    backgroundColor: "#d2691e",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
