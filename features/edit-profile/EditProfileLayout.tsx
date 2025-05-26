import React, { useContext, useEffect, useState } from 'react';
import { View, ActivityIndicator, Alert } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { AuthContext } from '@/context/AuthContext';
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';
import { EditProfileFormData } from '@/types/EditProfileFormData';
import { getUserById, updateUser } from '@/services/userService';

// Utilitário simples para converter data de "YYYY-MM-DD" para "DD/MM/YYYY"
function isoToBrDate(iso?: string) {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return '';
  const [year, month, day] = iso.split('-');
  return `${day}/${month}/${year}`;
}

// Utilitário simples para converter "DD/MM/YYYY" para "YYYY-MM-DD"
function brDateToIso(br?: string) {
  if (!br || !/^\d{2}\/\d{2}\/\d{4}/.test(br)) return '';
  const [day, month, year] = br.split('/');
  return `${year}-${month}-${day}`;
}

export default function EditProfileLayout() {
  const { user, setUser } = useContext(AuthContext);
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const methods = useForm<EditProfileFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
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
      senha: '',
      confirmarSenha: '',
      imagemPerfil: '',
    },
  });

  useEffect(() => {
    async function fetchUser() {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const data = await getUserById(user.id);

        methods.reset({
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
          apartamento: data.apartamento != null ? data.apartamento.toString() : '',
          logradouro: data.logradouro ?? '',
          senha: '',
          confirmarSenha: '',
          imagemPerfil: data.imagemPerfil ?? '',
        });
      } catch (err) {
        Alert.alert("Erro", "Não foi possível carregar os dados do perfil.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (formData: EditProfileFormData) => {
    // Prepara o payload do backend
    const payload = {
      ...formData,
      numero: formData.numero ? Number(formData.numero) : 0,
      apartamento: formData.apartamento ? Number(formData.apartamento) : 0,
      dataNascimento: brDateToIso(formData.dataNascimento),
      imagemPerfil: formData.imagemPerfil || '../images/usuario.png',
    };
    // Remove senha do payload se não foi preenchida (não obriga alterar senha)
    if (!payload.senha) delete payload.senha;
    if (!payload.confirmarSenha) delete payload.confirmarSenha;

    try {
      await updateUser(payload);
      Toast.show({ type: 'success', text1: 'Perfil atualizado!' });
      if (user) {
      setUser({ ...user, ...payload });
    }
      router.back();
    } catch (err) {
      Toast.show({ type: 'error', text1: 'Erro ao atualizar perfil', text2: 'Tente novamente.' });
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <FormProvider {...methods}>
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ flex: 1 }}>
          {step === 1 && <Step1 onNext={nextStep} />}
          {step === 2 && <Step2 onNext={nextStep} onBack={prevStep} />}
          {step === 3 && (
            <Step3
              onBack={prevStep}
              onNext={methods.handleSubmit(onSubmit)}
            />
          )}
        </View>
      </SafeAreaView>
    </FormProvider>
  );
}