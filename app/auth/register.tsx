// app/auth/register.tsx
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
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';
import { GoogleSignin, User } from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '@/services/authService';
import { SignUpPayload } from "@/types/SignUpPayload";

GoogleSignin.configure({
  webClientId: "302209231698-g4dsrnebsh66hc3j1rjtla69ikr6qa8v.apps.googleusercontent.com",
  offlineAccess: true,
});

async function handleGoogleRegister() {
  try {
    await GoogleSignin.hasPlayServices();
    await GoogleSignin.signIn();
    const userInfo = await GoogleSignin.signIn();
    const { accessToken } = await GoogleSignin.getTokens();
    console.log('USER:', userInfo);
    console.log('TOKENS:', accessToken);

    if (!accessToken) throw new Error("Não foi possível obter o accessToken do Google.");

    await loginWithGoogle(accessToken);

    Toast.show({ type: "success", text1: "Cadastro e login realizados com Google!" });
    router.replace("/(tabs)");
  } catch (error) {
    console.error(error);
    Toast.show({
      type: "error",
      text1: "Erro ao cadastrar com Google",
      text2: "Tente novamente ou use outro método.",
    });
  }
}

export default function RegisterScreen() {
  usePublicRoute();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Input focus/erro helpers
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [eyeAnim] = useState(new Animated.Value(1));
  const [eyeAnim2] = useState(new Animated.Value(1));

  const router = useRouter();
  const { signUp } = useAuth();

  // Refs para focar campos ao dar "next"
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  // Validação
  function validate() {
    const errs: { [k: string]: string } = {};
    if (!fullName) errs.fullName = 'Digite seu nome completo.';
    if (!email) errs.email = 'Digite seu e-mail.';
    else if (!isValidEmail(email)) errs.email = 'E-mail inválido.';
    if (!password) errs.password = 'Digite sua senha.';
    else if (password.length < 6) errs.password = 'Mínimo 6 caracteres.';
    if (!confirmPassword) errs.confirmPassword = 'Confirme sua senha.';
    else if (password !== confirmPassword) errs.confirmPassword = 'Senhas não conferem.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Animação de bounce no botão olho
  function animateEye(eye: Animated.Value) {
    Animated.sequence([
      Animated.timing(eye, { toValue: 1.2, duration: 100, useNativeDriver: true }),
      Animated.timing(eye, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
  }

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      const payload: SignUpPayload = {
        nomeCompleto: fullName,
        email,
        senha: password,
      };
      await signUp(payload);

      Toast.show({
        type: 'success',
        text1: 'Cadastro realizado!',
        text2: 'Verifique seu e-mail para confirmar.',
      });
      router.push({ pathname: '/auth/verify-email', params: { email, senha: password } });
    } catch (error: any) {
      if (error?.response?.status === 409) {
        Toast.show({
          type: 'error',
          text1: 'Conta já existe',
          text2: 'Este e-mail já está cadastrado.',
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Erro ao cadastrar',
          text2: 'Tente novamente mais tarde.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerAbsolute}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.formWrapper}>
            <Text style={styles.title}>Criar conta</Text>
            <Text style={styles.subtitle}>
              Crie sua conta para descobrir talentos na sua quebrada!
            </Text>

            {/* Nome completo */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Nome completo</Text>
              <TextInput
                style={[
                  styles.input,
                  errors.fullName ? styles.inputError : null,
                  focusedField === 'fullName' ? styles.inputFocused : null,
                ]}
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
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
              />
              {errors.fullName && <Text style={styles.errorMsg}>{errors.fullName}</Text>}
            </View>

            {/* E-mail */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                ref={emailRef}
                style={[
                  styles.input,
                  errors.email ? styles.inputError : null,
                  focusedField === 'email' ? styles.inputFocused : null,
                ]}
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
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
              />
              {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View style={[
                styles.passwordContainer,
                errors.password ? styles.inputError : null,
                focusedField === 'password' ? styles.inputFocused : null,
              ]}>
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
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => {
                    setShowPassword(!showPassword);
                    animateEye(eyeAnim);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showPassword ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  activeOpacity={0.8}
                >
                  <Animated.View style={{ transform: [{ scale: eyeAnim }] }}>
                    {showPassword ? (
                      <EyeOff size={20} color={colors.textLight} />
                    ) : (
                      <Eye size={20} color={colors.textLight} />
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </View>
              {/* Dica de senha */}
              <Text style={styles.passwordTip}>
                Use pelo menos 6 caracteres. Combine letras e números para mais segurança.
              </Text>
              {errors.password && <Text style={styles.errorMsg}>{errors.password}</Text>}
            </View>

            {/* Confirmar senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Confirmar senha</Text>
              <View style={[
                styles.passwordContainer,
                errors.confirmPassword ? styles.inputError : null,
                focusedField === 'confirmPassword' ? styles.inputFocused : null,
              ]}>
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
                  onFocus={() => setFocusedField('confirmPassword')}
                  onBlur={() => setFocusedField('')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => {
                    setShowConfirmPassword(!showConfirmPassword);
                    animateEye(eyeAnim2);
                  }}
                  accessibilityRole="button"
                  accessibilityLabel={
                    showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'
                  }
                  activeOpacity={0.8}
                >
                  <Animated.View style={{ transform: [{ scale: eyeAnim2 }] }}>
                    {showConfirmPassword ? (
                      <EyeOff size={20} color={colors.textLight} />
                    ) : (
                      <Eye size={20} color={colors.textLight} />
                    )}
                  </Animated.View>
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>}
            </View>

            {/* Botão de cadastro */}
            <Button
              title={loading ? "Cadastrando..." : "Cadastrar"}
              onPress={handleRegister}
              loading={loading}
              disabled={
                loading || !fullName || !email || !password || !confirmPassword
              }
              style={styles.registerButton}
              accessibilityLabel="Botão de cadastro"
              testID="register-btn"
            />

            {/* Alternativa: Google */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>Ou cadastre-se com</Text>
              <View style={styles.line} />
            </View>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleRegister}
              activeOpacity={0.7}
              accessibilityLabel="Cadastrar com Google"
            >
              <Image
                source={require('../../assets/images/google-logo.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>

            {/* Link para login */}
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
  headerAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 10,
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? 36 : 16,
    paddingBottom: 8,
    backgroundColor: colors.background,
    // Optional: Adicione sombra se quiser destacar o topo
    // shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }
  },
  backButton: { alignSelf: 'flex-start' },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 4,
  },
  formWrapper: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 6, shadowOffset: { width: 0, height: 2 },
    marginTop: 12,
    marginBottom: 24,
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: colors.textDark,
    marginBottom: 2,
    textAlign: 'center'
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 8,
    textAlign: 'center'
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.textDark,
    marginBottom: 8,
  },
  input: {
    height: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  inputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#F0F6FF',
  },
  inputError: {
    borderColor: colors.danger || '#c00',
  },
  errorMsg: {
    color: colors.danger || '#c00',
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
  passwordContainer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  eyeIcon: { padding: 12 },
  passwordTip: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    marginLeft: 2,
  },
  registerButton: { marginTop: 8, marginBottom: 22 },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 6,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: colors.lightGray,
    marginHorizontal: 6,
  },
  orText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 13,
    color: colors.textLight,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.lightGray,
    paddingVertical: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: { width: 22, height: 22, marginRight: 10 },
  googleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: colors.textDark,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  loginLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.secondary,
  },
});
