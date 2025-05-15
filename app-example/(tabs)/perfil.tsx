import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

export default function PerfilScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Perfil</Text>

      <View style={styles.profileSection}>
        <Image source={require('../../assets/images/icon.png')} style={styles.avatar} />
        <Text style={styles.name}>Andre Soares</Text>
        <TouchableOpacity>
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/dados-pessoais')}>
          <Text style={styles.menuText}>Dados pessoais</Text>
        </TouchableOpacity>

        {['Endereço', 'Favoritos', 'Dúvidas comuns', 'Configurações', 'Histórico'].map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Text style={styles.menuText}>{item}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.disabledText}>Prestar Serviço</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#d4af37', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', marginBottom: 20 },
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  avatar: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#ccc' },
  name: { fontSize: 18, marginLeft: 10, fontWeight: '500' },
  editIcon: { fontSize: 16, marginLeft: 10 },
  menu: { marginBottom: 30 },
  menuItem: { marginVertical: 10 },
  menuText: { fontSize: 16, fontWeight: '500' },
  disabledText: { fontSize: 16, color: '#a0522d', fontWeight: '500' },
  logout: { alignItems: 'flex-end' },
  logoutText: { fontSize: 16, fontWeight: '500' },
});
