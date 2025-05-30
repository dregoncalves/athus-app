import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
} from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { AuthContext } from '@/context/AuthContext';
import { getLoggedUser, updateUser } from '@/services/userService';
import { colors } from '@/constants/colors';
import { EditProfileFormData } from '@/types/EditProfileFormData';
import { editProfileStyles as styles } from './editProfileStyles';
import PersonalInfoSection from './PersonalInfoScreen';
import AddressSection from './AddressSection';
import SecuritySection from './SecuritySection';

// utils para datas
function isoToBrDate(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

function brDateToIso(br?: string) {
  if (!br || !/^\d{2}\/\d{2}\/\d{4}/.test(br)) return '';
  const [day, month, year] = br.split('/');
  return `${year}-${month}-${day}`;
}

export default function EditProfileScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const methods = useForm<EditProfileFormData>({
    mode: 'onChange',
    defaultValues: {
      nome: '',
      email: '',
      telefone: '',
      cpf: '',
      dataNascimento: '',
      pais: '',
      estado: '',
      cidade: '',
      cep: '',
      rua: '',
      numero: '',
      apartamento: '',
      logradouro: '',
      imagemPerfil: '',
      senha: '',
      confirmarSenha: '',
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    async function fetchUser() {
      try {
        const { body: data } = await getLoggedUser();

        console.log('Dados recebidos do backend:', data);

        reset({
          nome: data.nome ?? '',
          email: data.email ?? '',
          telefone: data.telefone ?? '',
          cpf: data.cpf ?? '',
          dataNascimento: isoToBrDate(data.dataNascimento),
          pais: data.pais ?? '',
          estado: data.estado ?? '',
          cidade: data.cidade ?? '',
          cep: data.cep ?? '',
          rua: data.rua ?? '',
          numero: data.numero != null ? data.numero.toString() : '',
          apartamento:
            data.apartamento != null ? data.apartamento.toString() : '',
          logradouro: data.logradouro ?? '',
          imagemPerfil: data.imagemPerfil ?? '', // incluído novamente
          senha: '',
          confirmarSenha: '',
        });
      } catch (err) {
        Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        console.error('Erro ao buscar usuário:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  const onSubmit = async (formData: EditProfileFormData) => {
    const payload = {
      ...formData,
      numero: formData.numero ? Number(formData.numero) : null,
      apartamento: formData.apartamento ? Number(formData.apartamento) : null,
      dataNascimento: brDateToIso(formData.dataNascimento),
      imagemPerfil: formData.imagemPerfil, // vai ser tratado no userService
    };

    if (!payload.senha) delete payload.senha;
    if (!payload.confirmarSenha) delete payload.confirmarSenha;

    try {
      await updateUser(payload);
      Toast.show({ type: 'success', text1: 'Perfil atualizado!' });
      if (user) setUser({ ...user, ...payload });
      router.back();
    } catch (err: any) {
      console.log('⚠️ Erro completo:', JSON.stringify(err, null, 2));
      Toast.show({
        type: 'error',
        text1: 'Erro ao atualizar perfil',
        text2: 'Tente novamente.',
      });
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.title}>Editar Perfil</Text>

          <PersonalInfoSection />
          <AddressSection />
          <SecuritySection />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit(onSubmit)}
          >
            <Text style={styles.submitButtonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </FormProvider>
  );
}
