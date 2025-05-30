import * as React from 'react';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordScreen() {
  usePublicRoute();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const router = useRouter();

  const hasError =
    submitted && (!email ? 'Informe o e-mail.' : !isValidEmail(email) ? 'Digite um e-mail válido.' : '');

  const handleSendCode = async () => {
    setSubmitted(true);
    if (!email || !isValidEmail(email)) {
      // Erro já tratado visualmente
      if (!email) {
        Toast.show({ type: 'error', text1: 'Informe o e-mail.' });
      } else {
        Toast.show({ type: 'error', text1: 'Digite um e-mail válido.' });
      }
      return;
    }
    setLoading(true);
    try {
      // await AuthService.forgotPassword(email);
      await new Promise((resolve) => setTimeout(resolve, 1200));
      Toast.show({
        type: 'success',
        text1: 'Código enviado!',
        text2: 'Verifique seu e-mail para redefinir a senha.',
      });
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'Não foi possível enviar o código.',
        text2: 'Verifique o e-mail informado.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Esqueci minha senha</Text>
            <Text style={styles.subtitle}>
              Informe seu e-mail cadastrado para receber um código de redefinição de senha.
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                ref={emailRef}
                style={[
                  styles.input,
                  hasError
                    ? styles.inputError
                    : focused
                    ? styles.inputFocused
                    : styles.inputDefault,
                ]}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                placeholderTextColor={colors.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                returnKeyType="done"
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                onSubmitEditing={handleSendCode}
                accessibilityLabel="E-mail"
              />
              {hasError ? (
                <Text style={styles.errorText}>{hasError}</Text>
              ) : null}
            </View>

            <TouchableOpacity
              style={[
                styles.button,
                (!email || !isValidEmail(email) || loading) && styles.buttonDisabled,
              ]}
              onPress={handleSendCode}
              disabled={loading || !email || !isValidEmail(email)}
              accessibilityRole="button"
              accessibilityLabel="Enviar código"
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Enviar código</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.loginLinkContainer}
              onPress={() => router.replace('/auth/login')}
              accessibilityRole="button"
              accessibilityLabel="Ir para login"
            >
              <Text style={styles.loginLinkText}>Lembrou sua senha? Faça login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  backButton: { marginTop: 16, marginBottom: 16, alignSelf: 'flex-start' },
  content: { flex: 1, justifyContent: 'center' },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 28,
    color: colors.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 32,
  },
  inputContainer: { marginBottom: 20 },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.white,
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  inputDefault: {
    borderColor: colors.mediumGray,
  },
  inputFocused: {
    borderColor: colors.primary,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
    fontFamily: 'Poppins-Regular',
    marginTop: 6,
    marginLeft: 2,
    fontSize: 13,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: {
    backgroundColor: colors.primaryLight,
  },
  buttonText: {
    color: colors.white,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  loginLinkContainer: { alignItems: 'center', marginTop: 12 },
  loginLinkText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.primary,
  },
});
