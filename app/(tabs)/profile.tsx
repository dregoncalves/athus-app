import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { colors } from '@/constants/colors';
import { User, MapPin, Settings, CircleHelp as HelpCircle, LogOut } from 'lucide-react-native';
import { ProfileMenuItem } from '@/components/ProfileMenuItem';
import { AuthContext } from '@/context/AuthContext';
import api from '@/services/api';

async function getUser(id: string) {
  const response = await api.get(`/usuarios/${id}`);
  return response.data;
}

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  const [userData, setUserData] = useState<any | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!user?.id) return setLoadingProfile(false);
        const data = await getUser(user.id);
        setUserData(data);
      } catch (error) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoadingProfile(false);
      }
    }

    fetchProfile();
  }, [user?.id]);

  const handleLogout = () => {
    Alert.alert(
      "Sair",
      "Deseja realmente sair da sua conta?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sair", style: "destructive", onPress: () => logout() }
      ]
    );
  };

  const nome = userData?.nome || user?.nome || "Usuário Teste";
  const email = userData?.email || user?.email || "user.test@email.com";
  const location = userData?.cidade
    ? `${userData.cidade}, ${userData.estado}`
    : "Curitiba, PR";
  const imageUrl = userData?.imagemPerfil || '';

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Perfil" showBackButton={false} />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileSection}>
          {loadingProfile ? (
            <ActivityIndicator size="large" color={colors.primary} style={{ marginBottom: 24 }} />
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.profileImage} />
          ) : (
            <View style={styles.profileImagePlaceholder}>
              <User size={40} color={colors.white} />
            </View>
          )}

          <Text style={styles.profileName}>{nome}</Text>
          <Text style={styles.profileEmail}>{email}</Text>

          <View style={styles.locationContainer}>
            <MapPin size={16} color={colors.textLight} />
            <Text style={styles.locationText}>{location}</Text>
          </View>

          <TouchableOpacity style={styles.editProfileButton}>
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
