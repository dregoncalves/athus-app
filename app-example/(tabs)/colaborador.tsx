import { View, Text, StyleSheet, Image } from 'react-native';

export default function ColaboradorScreen() {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />

      <Text style={styles.nome}>ROBERTO C. DE OLIVEIRA</Text>

      <View style={styles.bioBox}>
        <Text style={styles.bio}>
          Sou Roberto Carlos de Oliveira, mecânico e eletricista com experiência na área de manutenção automotiva ...
        </Text>
      </View>

      <Text style={styles.sectionTitle}>Últimos Serviços</Text>
      <Text style={styles.servico}>↳ <Text style={styles.servicoNome}>Mecanica</Text></Text>
      <Text style={styles.servico}>↳ <Text style={styles.servicoNome}>Eletrica</Text></Text>

      <Text style={styles.sectionTitle}>Areas Atendidas</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ccc', marginBottom: 16 },
  nome: { fontSize: 16, fontWeight: 'bold', letterSpacing: 1, marginBottom: 12 },
  bioBox: {
    backgroundColor: '#ddd', padding: 12, borderRadius: 10,
    marginBottom: 20, width: '100%',
  },
  bio: { fontFamily: 'monospace', fontSize: 14 },
  sectionTitle: { fontWeight: 'bold', fontSize: 14, marginTop: 10, marginBottom: 4 },
  servico: { fontSize: 14 },
  servicoNome: { color: '#d4af37', fontWeight: '500' },
});
