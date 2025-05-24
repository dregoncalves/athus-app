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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react-native';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';

// Função simples para validar e-mail
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function ForgotPasswordScreen() {
  usePublicRoute();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const router = useRouter();

  const handleSendCode = async () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Informe o e-mail.',
      });
      return;
    }
    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Digite um e-mail válido.',
      });
      return;
    }
    setLoading(true);
    try {
      // Request para /auth/esqueci-senha
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
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={handleSendCode}
                accessibilityLabel="E-mail"
              />
              {email.length > 0 && !isValidEmail(email) && (
                <Text style={styles.errorText}>Digite um e-mail válido.</Text>
              )}
            </View>

            <Button
              title="Enviar código"
              onPress={handleSendCode}
              loading={loading}
              disabled={loading || !email || !isValidEmail(email)}
              style={styles.button}
            />

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
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, color: colors.textDark, marginBottom: 8 },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginBottom: 32 },
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textDark, marginBottom: 8 },
  input: {
    height: 50, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.lightGray,
    borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textDark,
  },
  errorText: { color: colors.danger || '#c00', fontFamily: 'Poppins-Regular', marginTop: 6, marginLeft: 2 },
  button: { marginTop: 8, marginBottom: 24 },
  loginLinkContainer: { alignItems: 'center', marginTop: 12 },
  loginLinkText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.primary },
});
