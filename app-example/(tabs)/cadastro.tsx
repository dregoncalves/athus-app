import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function CadastroScreen() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [repetirSenha, setRepetirSenha] = useState('');
  const router = useRouter();

  const handleVerificar = () => {
    
    console.log({ nome, email, senha, repetirSenha });

    router.push('/verificacao'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* LOGO */}
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.headerText}>Informe os dados de cadastro</Text>
      </View>

      <View style={styles.form}>
        <Text>Nome</Text>
        <TextInput
          style={styles.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Digite seu nome"
        />

        <Text>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Digite seu email"
          keyboardType="email-address"
        />

        <Text>Senha</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          placeholder="Digite sua senha"
          secureTextEntry
        />

        <Text>Repetir Senha</Text>
        <TextInput
          style={styles.input}
          value={repetirSenha}
          onChangeText={setRepetirSenha}
          placeholder="Repita a senha"
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleVerificar}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d4af37', 
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '500',
    marginTop: 10,
  },
  logo: {
    width: 40,
    height: 40,
    tintColor: '#000', 
  },
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
