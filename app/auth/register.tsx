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
import { Link, router } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '@/services/authService';
import { SignUpPayload } from '@/types/SignUpPayload';

GoogleSignin.configure({
  webClientId: '302209231698-g4dsrnebsh66hc3j1rjtla69ikr6qa8v.apps.googleusercontent.com',
  offlineAccess: true,
});

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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
  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [eyeAnim] = useState(new Animated.Value(1));
  const [eyeAnim2] = useState(new Animated.Value(1));

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmPasswordRef = useRef<TextInput>(null);

  const { signUp } = useAuth();

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

  async function handleGoogleRegister() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const { accessToken } = await GoogleSignin.getTokens();
      if (!accessToken) throw new Error('Não foi possível obter o accessToken do Google.');
      await loginWithGoogle(accessToken);
      Toast.show({ type: 'success', text1: 'Cadastro e login realizados com Google!' });
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao cadastrar com Google',
        text2: 'Tente novamente ou use outro método.',
      });
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* <Text style={styles.subtitle}>
            Crie sua conta para descobrir talentos na sua quebrada!
          </Text> */}

          {/* Nome completo */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Nome completo</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.fullName
                  ? styles.inputError
                  : focusedField === 'fullName'
                  ? styles.inputFocused
                  : styles.inputDefault,
              ]}
            >
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Digite seu nome completo"
                autoCapitalize="words"
                returnKeyType="next"
                onSubmitEditing={() => emailRef.current?.focus()}
                blurOnSubmit={false}
                textContentType="name"
                accessibilityLabel="Nome completo"
                onFocus={() => setFocusedField('fullName')}
                onBlur={() => setFocusedField('')}
                placeholderTextColor={colors.textLight}
              />
            </View>
            {errors.fullName && <Text style={styles.errorMsg}>{errors.fullName}</Text>}
          </View>

          {/* E-mail */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>E-mail</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.email
                  ? styles.inputError
                  : focusedField === 'email'
                  ? styles.inputFocused
                  : styles.inputDefault,
              ]}
            >
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
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
                placeholderTextColor={colors.textLight}
              />
            </View>
            {errors.email && <Text style={styles.errorMsg}>{errors.email}</Text>}
          </View>

          {/* Senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Senha</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.password
                  ? styles.inputError
                  : focusedField === 'password'
                  ? styles.inputFocused
                  : styles.inputDefault,
              ]}
            >
              <TextInput
                ref={passwordRef}
                style={styles.input}
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
                placeholderTextColor={colors.textLight}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => {
                  setShowPassword(!showPassword);
                  animateEye(eyeAnim);
                }}
                accessibilityRole="button"
                accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                activeOpacity={0.8}
              >
                <Animated.View style={{ transform: [{ scale: eyeAnim }] }}>
                  {showPassword ? (
                    <EyeOff size={20} color={colors.primary} />
                  ) : (
                    <Eye size={20} color={colors.primary} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </View>
            <Text style={styles.passwordTip}>
              Use pelo menos 6 caracteres. Combine letras e números para mais segurança.
            </Text>
            {errors.password && <Text style={styles.errorMsg}>{errors.password}</Text>}
          </View>

          {/* Confirmar senha */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Confirmar senha</Text>
            <View
              style={[
                styles.inputWrapper,
                errors.confirmPassword
                  ? styles.inputError
                  : focusedField === 'confirmPassword'
                  ? styles.inputFocused
                  : styles.inputDefault,
              ]}
            >
              <TextInput
                ref={confirmPasswordRef}
                style={styles.input}
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
                placeholderTextColor={colors.textLight}
              />
              <TouchableOpacity
                style={styles.eyeIcon}
                onPress={() => {
                  setShowConfirmPassword(!showConfirmPassword);
                  animateEye(eyeAnim2);
                }}
                accessibilityRole="button"
                accessibilityLabel={showConfirmPassword ? 'Ocultar senha' : 'Mostrar senha'}
                activeOpacity={0.8}
              >
                <Animated.View style={{ transform: [{ scale: eyeAnim2 }] }}>
                  {showConfirmPassword ? (
                    <EyeOff size={20} color={colors.primary} />
                  ) : (
                    <Eye size={20} color={colors.primary} />
                  )}
                </Animated.View>
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text style={styles.errorMsg}>{errors.confirmPassword}</Text>
            )}
          </View>

          <Button
            title={loading ? 'Cadastrando...' : 'Cadastrar'}
            onPress={handleRegister}
            loading={loading}
            disabled={
              loading ||
              !fullName ||
              !email ||
              !password ||
              !confirmPassword
            }
            style={[
              styles.loginButton, // usa o mesmo do login
              (loading ||
                !fullName ||
                !email ||
                !password ||
                !confirmPassword) &&
                styles.loginButtonDisabled,
            ]}
            textStyle={styles.loginButtonText}
            accessibilityLabel="Botão de cadastro"
            testID="register-btn"
          />

          {/* Google */}
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
          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Já tem uma conta?</Text>
            <Link href="/auth/login" asChild>
              <TouchableOpacity accessibilityRole="button">
                <Text style={styles.registerLink}>Faça login</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Mesmo style do login!
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoidingView: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 32 },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 18,
    textAlign: 'center',
  },
  inputContainer: { marginBottom: 16 },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.text,
    marginBottom: 2,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    minHeight: 50,
  },
  input: {
    flex: 1,
    height: 50,
    paddingHorizontal: 8,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: '#222',
    backgroundColor: 'transparent',
  },
  inputDefault: {
    borderColor: colors.mediumGray,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorMsg: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 2,
    marginLeft: 2,
  },
  eyeIcon: { padding: 10 },
  passwordTip: {
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
    marginLeft: 2,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    marginBottom: 18,
    paddingVertical: 14,
    alignItems: 'center',
  },
  loginButtonDisabled: {
    backgroundColor: colors.primaryBackgroundLight,
  },
  loginButtonText: {
    color: colors.white,
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
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
    backgroundColor: colors.lightGray,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.mediumGray,
    paddingVertical: 10,
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleIcon: { width: 22, height: 22, marginRight: 10 },
  googleText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: colors.text,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 6,
  },
  registerText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginRight: 4,
  },
  registerLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primary,
  },
});
