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
import {
  GoogleSignin,
  User,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '@/services/authService';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

GoogleSignin.configure({
  webClientId:
    '302209231698-g4dsrnebsh66hc3j1rjtla69ikr6qa8v.apps.googleusercontent.com',
  offlineAccess: true,
});

export default function LoginScreen() {
  const [auth, setAuth] = useState<User | null>(null);

  async function handleGoogleSignIn() {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();
      const userInfo = await GoogleSignin.signIn();
      const { accessToken, idToken } = await GoogleSignin.getTokens();
      console.log('USER:', userInfo);
      console.log('TOKENS:', accessToken);
      if (!accessToken)
        throw new Error('Não foi possível obter o accessToken do Google.');
      await loginWithGoogle(accessToken);
      Toast.show({ type: 'success', text1: 'Login realizado com Google!' });
      router.replace('/(tabs)');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Erro ao autenticar com Google',
        text2: 'Tente novamente ou use outro método.',
      });
    }
  }

  usePublicRoute();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [focusedField, setFocusedField] = useState('');
  const [errors, setErrors] = useState<{ [k: string]: string }>({});
  const [eyeAnim] = useState(new Animated.Value(1));
  const passwordRef = useRef<TextInput>(null);
  const { login } = useAuth();

  // Validação
  function validate() {
    const errs: { [k: string]: string } = {};
    if (!email) errs.email = 'Digite seu e-mail.';
    else if (!isValidEmail(email)) errs.email = 'E-mail inválido.';
    if (!password) errs.password = 'Digite sua senha.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  // Animação do olho
  function animateEye() {
    Animated.sequence([
      Animated.timing(eyeAnim, {
        toValue: 1.2,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(eyeAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  }

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await login(email, password);
      // Redirecionamento pelo AuthContext
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'E-mail ou senha inválidos.',
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
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* FORMULÁRIO CENTRALIZADO COM SOMBRA */}
          <View style={styles.formWrapper}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessible
              accessibilityLabel="Logo Athus"
            />
            <Text style={styles.title}>Entrar</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para encontrar serviços
            </Text>

            {/* E-mail */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
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
                accessibilityLabel="Campo de e-mail"
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField('')}
              />
              {errors.email && (
                <Text style={styles.errorMsg}>{errors.email}</Text>
              )}
            </View>

            {/* Senha */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Senha</Text>
              <View
                style={[
                  styles.passwordContainer,
                  errors.password ? styles.inputError : null,
                  focusedField === 'password' ? styles.inputFocused : null,
                ]}
              >
                <TextInput
                  ref={passwordRef}
                  style={styles.passwordInput}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Digite sua senha"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  textContentType="password"
                  accessibilityLabel="Campo de senha"
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField('')}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => {
                    setShowPassword(!showPassword);
                    animateEye();
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
              {errors.password && (
                <Text style={styles.errorMsg}>{errors.password}</Text>
              )}
            </View>

            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity
                style={styles.forgotPasswordButton}
                accessibilityRole="button"
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </Link>

            {/* Google */}
            <View style={styles.orContainer}>
              <View style={styles.line} />
              <Text style={styles.orText}>Ou entre com</Text>
              <View style={styles.line} />
            </View>
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.7}
              accessibilityLabel="Entrar com Google"
            >
              <Image
                source={require('../../assets/images/google-logo.png')}
                style={styles.googleIcon}
              />
              <Text style={styles.googleText}>Google</Text>
            </TouchableOpacity>

            <Button
              title={loading ? 'Entrando...' : 'Entrar'}
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !email || !password}
              style={styles.loginButton}
              accessibilityLabel="Botão de entrar"
            />

            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Não tem uma conta?</Text>
              <Link href="/auth/register" asChild>
                <TouchableOpacity accessibilityRole="button">
                  <Text style={styles.registerLink}>Crie uma!</Text>
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  formWrapper: {
    backgroundColor: colors.white,
    borderRadius: 20,
    padding: 24,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    marginTop: 24,
    marginBottom: 24,
  },
  logo: { width: 120, height: 40, alignSelf: 'center', marginBottom: 8 },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: colors.textDark,
    marginBottom: 2,
    textAlign: 'center',
  },
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
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 12 },
  forgotPasswordText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.primary,
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
  loginButton: { marginBottom: 18 },
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
    color: colors.secondary,
  },
});
