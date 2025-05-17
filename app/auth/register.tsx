import * as React from 'react';
import { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';

export default function RegisterScreen() {
  usePublicRoute();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { signUp } = useAuth();

  // Refs para focar campos ao dar "next"
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
    Toast.show({ type: 'error', text1: 'Preencha todos os campos' });
    return;
  }
  if (!isValidEmail(email)) {
    Toast.show({ type: 'error', text1: 'Digite um e-mail válido' });
    return;
  }
    setLoading(true);
    try {
      await signUp(fullName, email, password);
      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado!',
        text2: 'Verifique seu e-mail para confirmar.',
      });
      router.push({ pathname: '/auth/verify-email', params: { email } });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar',
        text2: 'Tente novamente mais tarde.',
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

          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessible
              accessibilityLabel="Logo Athus"
            />
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Cadastro</Text>
            <Text style={styles.subtitle}>
              Crie sua conta para descobrir talentos locais
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Digite seu nome completo"
                autoCapitalize="words"
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
                textContentType="name"
                accessibilityLabel="Nome completo"
              />
            </View>

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
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                textContentType="username"
                accessibilityLabel="E-mail"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={passwordRef}
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="next"
                  onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                  blurOnSubmit={false}
                  textContentType="newPassword"
                  accessibilityLabel="Senha"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  ref={confirmPasswordRef}
                  style={styles.passwordInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Confirme sua senha"
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleRegister}
                  textContentType="newPassword"
                  accessibilityLabel="Confirmar senha"
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  accessibilityRole="button"
                  accessibilityLabel={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <Button
              title="Cadastrar"
              onPress={handleRegister}
              loading={loading}
              disabled={loading || !fullName || !email || !password || !confirmPassword}
              style={styles.registerButton}
              accessibilityLabel="Botão de cadastro"
              testID="register-btn"
            />

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Já tem uma conta?</Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity accessibilityRole="button">
                  <Text style={styles.loginLink}>Faça login</Text>
                </TouchableOpacity>
              </Link>
            </View>
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
  logoContainer: { alignItems: 'center', marginBottom: 32 },
  logo: { width: 120, height: 40 },
  formContainer: { flex: 1 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, color: colors.textDark, marginBottom: 8 },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginBottom: 24 },
  inputContainer: { marginBottom: 16 },
  inputLabel: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textDark, marginBottom: 8 },
  input: {
    height: 50, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.lightGray,
    borderRadius: 8, paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textDark,
  },
  passwordContainer: {
    flexDirection: 'row', height: 50, backgroundColor: colors.white, borderWidth: 1, borderColor: colors.lightGray,
    borderRadius: 8, alignItems: 'center',
  },
  passwordInput: {
    flex: 1, height: '100%', paddingHorizontal: 16, fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textDark,
  },
  eyeIcon: { padding: 12 },
  registerButton: { marginTop: 8, marginBottom: 24 },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 8 },
  loginText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginRight: 4 },
  loginLink: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.secondary },
});
