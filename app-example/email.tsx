import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function EmailScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleEnviarCodigo = () => {
    
    console.log('E-mail digitado:', email); 
    router.push('/verificacao'); 
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/icon.png')} style={styles.logo} />
        <Text style={styles.headerText}>Informe o e-mail para cadastro</Text>
      </View>

      <View style={styles.form}>
        <Text style={styles.formLabel}>Digite o seu e-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="email@exemplo.com"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TouchableOpacity style={styles.button} onPress={handleEnviarCodigo}>
          <Text style={styles.buttonText}>Verificar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d4af37' },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 20 },
  headerText: { fontSize: 18, fontWeight: '500', marginTop: 10, textAlign: 'center' },
  logo: { width: 40, height: 40, tintColor: '#000' },
  form: {
    flex: 1, backgroundColor: '#e5e5e5',
    borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20,
  },
  formLabel: { textAlign: 'center', marginBottom: 10, fontWeight: '500' },
  input: {
    backgroundColor: '#fff', borderRadius: 5, padding: 10,
    marginBottom: 20, fontSize: 16, borderWidth: 1, borderColor: '#ccc',
  },
  button: {
    backgroundColor: '#d2691e', padding: 12,
    borderRadius: 10, alignItems: 'center', marginTop: 20,
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});
