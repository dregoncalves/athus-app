import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { colors } from '@/constants/colors';
import { updateUser } from '@/services/userService';
import {
  User as UserIcon,
  MapPin,
  Settings,
  CircleHelp as HelpCircle,
  LogOut,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { ProfileMenuItem } from '@/components/ProfileMenuItem';
import { AuthContext } from '@/context/AuthContext';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user, loading, logout } = useContext(AuthContext);
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(null);

  async function handleLogout() {
    await GoogleSignin.signOut();
    Alert.alert('Sair', 'Deseja realmente sair da sua conta?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: () => logout() },
    ]);
  }

  // Mostra loader enquanto carrega o user
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Perfil" showBackButton={false} />
        <View
          style={[styles.profileSection, { flex: 1, justifyContent: 'center' }]}
        >
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  // Só mostra mensagem de erro SE terminou de carregar e realmente não existe user
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Perfil" showBackButton={false} />
        <View
          style={[styles.profileSection, { flex: 1, justifyContent: 'center' }]}
        >
          <Text style={styles.profileName}>Usuário não encontrado</Text>
        </View>
      </SafeAreaView>
    );
  }

  const nome = user.nome || 'Usuário Teste';
  const email = user.email || 'user.test@email.com';
  const location =
    user.cidade && user.estado
      ? `${user.cidade}, ${user.estado}`
      : 'Curitiba, PR';
  const baseUrl = 'http://felipemariano.com.br:8080/ProjetoAthus/';
  const imageUrl = `${baseUrl}${user.imagemPerfil}`;
  console.log('imageUrl:', imageUrl);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" showBackButton={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          <Image
            source={{ uri: selectedImage || imageUrl }}
            style={styles.profileImage}
          />

<TouchableOpacity
  style={[styles.editProfileButton, { marginTop: 12 }]}
  onPress={async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      let uri = result.assets[0].uri;
      // Garantir que a URI tenha o prefixo file://
      if (!uri.startsWith('file://')) {
        uri = 'file://' + uri;
      }
      setSelectedImage(uri);

      try {
        await updateUser({ imagemPerfil: uri });
        Alert.alert('Sucesso', 'Foto atualizada com sucesso!');
        // Se quiser, pode recarregar os dados do usuário aqui
      } catch (error) {
        Alert.alert('Erro', 'Falha ao atualizar a foto.');
        console.error('Erro ao atualizar foto:', error);
      }
    }
  }}
>
  <Text style={styles.editProfileButtonText}>Trocar Foto</Text>
</TouchableOpacity>


          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileEmail}>{email}</Text>

          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.locationText}>{location}</Text>
          </View>

          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => router.push('/profile/edit')}
          >
            <Text style={styles.editProfileButtonText}>Editar Perfil</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Configurações da Conta</Text>

          <ProfileMenuItem
            icon={<Settings size={20} color={colors.textDark} />}
            title="Preferências"
            onPress={() => {}}
          />

          <ProfileMenuItem
            icon={<HelpCircle size={20} color={colors.textDark} />}
            title="Ajuda e Suporte"
            onPress={() => {}}
          />

          <ProfileMenuItem
            icon={<LogOut size={20} color={colors.danger} />}
            title="Sair"
            titleStyle={{ color: colors.danger }}
            onPress={handleLogout}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderBottomWidth: 8,
    borderBottomColor: colors.lightGray,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  profileImagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 20,
    color: colors.textDark,
    marginBottom: 4,
  },
  profileEmail: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: colors.secondary,
    borderRadius: 8,
  },
  editProfileButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.white,
  },
  menuSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  menuSectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
});
