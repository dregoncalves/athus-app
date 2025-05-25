import React, { useState } from 'react';
import { View } from 'react-native';
import { useForm, FormProvider } from 'react-hook-form';
import { RegisterFormData } from './types';
import { signUp } from '@/services/authService'; // <--- Aqui você importa o service
import Toast from 'react-native-toast-message';
import { useRouter } from 'expo-router';
import Step1 from './step1';
import Step2 from './step2';
import Step3 from './step3';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '@/constants/colors';

export default function RegisterLayout() {
  const methods = useForm<RegisterFormData>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      nomeCompleto: '',
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
    },
  });

  const [step, setStep] = useState(1);
  const router = useRouter();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data: RegisterFormData) => {
    // Ajuste para garantir que os nomes dos campos batem com o backend
    // Se o backend exigir "nomeCompleto", troque para nomeCompleto: data.nome
    const payload = {
      ...data,
      imagemPerfil: '../images/usuario.png',
      prestadorServico: false,
    };

    try {
      await signUp(payload);
      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado!',
        text2: 'Verifique seu e-mail para confirmar.',
      });
      router.push({
        pathname: '/auth/verify-email',
        params: { email: data.email },
      });
    } catch (error: any) {
      console.log('Erro ao cadastrar:', error);
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: 'Tente novamente mais tarde.',
      });
    }
  };

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