import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function ServicosScreen() {
  const router = useRouter();
  const servicos = ['Limpeza', 'Jardinagem', 'Hidráulica', 'Elétrica', 'Pintura'];
  const profissionais = ['Vinicius', 'Matheus', 'William', 'Larissa', 'Carla', 'Pedro', 'Joana', 'Rafael'];

  return (
    <View style={styles.container}>
      {/* Header com botão de login */}
      <View style={styles.header}>
  <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/(auth)/login/page')}>
    <Text style={styles.loginText}>LOGIN</Text>
    <Ionicons name="person-circle-outline" size={28} color="#888" />
  </TouchableOpacity>
</View>


      {/* Campo de busca */}
      <View style={styles.searchBox}>
        <Text style={styles.searchText}>PESQUISAR</Text>
        <Ionicons name="search" size={20} color="black" />
      </View>

      {/* Serviços mais buscados */}
      <Text style={styles.sectionTitle}>Mais buscados ↗</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {servicos.map((servico, index) => (
          <TouchableOpacity key={index} style={styles.chip}>
            <Text>{servico}</Text>
          </TouchableOpacity>
        ))}
        <Ionicons name="arrow-forward-circle-outline" size={24} style={styles.arrowIcon} />
      </ScrollView>

      {/* Profissionais mais próximos */}
      <Text style={styles.sectionTitle}>Profissionais mais próximos 👥</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {profissionais.map((nome, index) => (
          index === 0 ? (
            <TouchableOpacity key={index} style={styles.profissional} onPress={() => router.push('/(private)/colaborador/page')}>
              <Ionicons name="person-outline" size={24} />
              <Text style={styles.profissionalNome}>{nome}</Text>
            </TouchableOpacity>
          ) : (
            <View key={index} style={styles.profissional}>
              <Ionicons name="person-outline" size={24} />
              <Text style={styles.profissionalNome}>{nome}</Text>
            </View>
          )
        ))}
        <Ionicons name="arrow-forward-circle-outline" size={24} style={styles.arrowIcon} />
      </ScrollView>

      {/* Rodapé */}
      <View style={styles.footer}>
        <View style={styles.footerLine} />
        <Ionicons name="triangle-outline" size={28} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 40 },
  header: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginBottom: 10 },
  loginText: { marginRight: 10, fontSize: 14 },
  searchBox: {
    backgroundColor: '#d4af37',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'center',
    marginBottom: 20,
  },
  searchText: { marginRight: 10, fontSize: 18, fontWeight: '500' },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 6,
    marginTop: 10,
  },
  horizontalScroll: {
    marginBottom: 20,
  },
  chip: {
    backgroundColor: '#f5f5dc',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#d4af37',
  },
  profissional: {
    alignItems: 'center',
    marginRight: 20,
  },
  profissionalNome: {
    fontSize: 14,
    marginTop: 4,
  },
  arrowIcon: {
    alignSelf: 'center',
    color: '#888',
  },
  footer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerLine: {
    height: 4,
    width: '90%',
    backgroundColor: '#d4af37',
    marginBottom: 10,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
  }  
});
