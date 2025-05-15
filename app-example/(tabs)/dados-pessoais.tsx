import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function DadosPessoaisScreen() {
  const [nome, setNome] = useState('Andre Soares');
  const [email, setEmail] = useState('exemplo@gmail.com');
  const [telefone, setTelefone] = useState('41 9 9999 9999');

  const router = useRouter();

  const handleAlterar = () => {
    console.log({ nome, email, telefone });
    alert('Dados alterados!');
    // router.back(); // opcional: volta pra tela anterior após salvar
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require('../../assets/images/icon.png')}
          style={styles.avatar}
        />
        <Text style={styles.headerText}>{nome}</Text>
      </View>

      <View style={styles.form}>
        <Text>Nome Completo</Text>
        <TextInput style={styles.input} value={nome} onChangeText={setNome} />

        <Text>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text>Telefone</Text>
        <TextInput
          style={styles.input}
          value={telefone}
          onChangeText={setTelefone}
          keyboardType="phone-pad"
        />

        <TouchableOpacity style={styles.button} onPress={handleAlterar}>
          <Text style={styles.buttonText}>Alterar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d4af37' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 20 },
  headerText: { fontSize: 18, fontWeight: '500', marginTop: 10 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
  form: {
    flex: 1,
    backgroundColor: '#e5e5e5',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#d2691e',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
