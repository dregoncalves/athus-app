// /register/step1.tsx
import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFormContext, Controller } from 'react-hook-form';
import { MaskedTextInput } from 'react-native-mask-text';
import { ArrowLeft } from 'lucide-react-native';
import { registerStyles } from './editProfileStyles';
import { colors } from '@/constants/colors';

export default function Step1({ onNext }: { onNext: () => void }) {
  const {
    control,
    formState: { errors, isValid },
    trigger,
  } = useFormContext();
  const router = useRouter();

  const emailRef = useRef<TextInput>(null);
  const telefoneRef = useRef<TextInput>(null);

  const [buttonScale] = useState(new Animated.Value(1));
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    Animated.spring(buttonScale, {
      toValue: isValid ? 1.05 : 1,
      useNativeDriver: true,
      friction: 4,
    }).start();
  }, [isValid]);

  const handleNext = async () => {
    setLoading(true);
    const valid = await trigger(['nome', 'email', 'telefone']);
    setLoading(false);
    if (valid) onNext();
  };

  return (
    <SafeAreaView style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={registerStyles.header}>
          <TouchableOpacity
            style={registerStyles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputsContainer}>
          <ScrollView
            contentContainerStyle={styles.inputsScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={registerStyles.subtitle}>
              Crie sua conta para descobrir talentos na sua quebrada!
            </Text>

            {/* Nome completo */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.inputLabel}>Nome completo</Text>
              <Controller
                control={control}
                name="nome"
                rules={{
                  required: 'Informe seu nome completo',
                  validate: (value) =>
                    value &&
                    value.trim().split(' ').length >= 2 &&
                    value
                      .trim()
                      .split(' ')
                      .every((part: string | any[]) => part.length > 1)
                      ? true
                      : 'Digite seu nome completo (nome e sobrenome)',
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Digite seu nome completo"
                    placeholderTextColor={colors.black}
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    // autoFocus removido aqui
                    returnKeyType="next"
                    blurOnSubmit={false}
                    textContentType="name"
                    accessibilityLabel="Nome completo"
                    onBlur={onBlur}
                    onSubmitEditing={() => emailRef.current?.focus()}
                  />
                )}
              />
              {errors.nome && (
                <Text
                  style={[registerStyles.errorText, { color: colors.danger }]}
                >
                  {errors.nome.message?.toString()}
                </Text>
              )}
            </View>

            {/* Email */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.inputLabel}>E-mail</Text>
              <Controller
                control={control}
                name="email"
                rules={{
                  required: 'Informe seu e-mail',
                  pattern: {
                    value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
                    message: 'Digite um e-mail válido',
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    ref={emailRef}
                    style={registerStyles.input}
                    placeholder="Digite seu e-mail"
                    placeholderTextColor={colors.black}
                    value={value}
                    onChangeText={onChange}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoComplete="email"
                    returnKeyType="next"
                    blurOnSubmit={false}
                    textContentType="username"
                    accessibilityLabel="E-mail"
                    onBlur={onBlur}
                    onSubmitEditing={() => telefoneRef.current?.focus()}
                  />
                )}
              />
              {errors.email && (
                <Text
                  style={[registerStyles.errorText, { color: colors.danger }]}
                >
                  {errors.email.message?.toString()}
                </Text>
              )}
            </View>

            {/* Telefone */}
            <View style={registerStyles.inputContainer}>
              <Text style={registerStyles.inputLabel}>Telefone</Text>
              <Controller
                control={control}
                name="telefone"
                rules={{
                  required: 'Informe seu telefone',
                  pattern: {
                    value: /^\(\d{2}\) 9 \d{4}-\d{4}$/,
                    message: 'Digite um telefone válido',
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <MaskedTextInput
                    ref={telefoneRef}
                    mask="(99) 9 9999-9999"
                    keyboardType="phone-pad"
                    placeholder="(DD) 9 9999-9999"
                    placeholderTextColor={colors.black}
                    value={value || ''}
                    onChangeText={onChange}
                    style={registerStyles.input}
                    returnKeyType="done"
                    blurOnSubmit={false}
                    accessibilityLabel="Telefone"
                    onBlur={onBlur}
                    onSubmitEditing={handleNext}
                  />
                )}
              />
              {errors.telefone && (
                <Text
                  style={[registerStyles.errorText, { color: colors.danger }]}
                >
                  {errors.telefone.message?.toString()}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
            <TouchableOpacity
              style={[
                registerStyles.registerButton,
                (!isValid || loading) && styles.buttonDisabled,
              ]}
              onPress={handleNext}
              disabled={!isValid || loading}
              accessibilityRole="button"
              accessibilityLabel="Avançar para próxima etapa"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[registerStyles.loginLink, styles.buttonText]}>
                  Próximo
                </Text>
              )}
            </TouchableOpacity>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  inputsScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 0,
    color: colors.black
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingTop: 0,
    marginBottom: 24,
    paddingHorizontal: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});