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
} from '@react-native-google-signin/google-signin';
import { loginWithGoogle } from '@/services/authService';
import { LinearGradient } from 'expo-linear-gradient';

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
      const { accessToken } = await GoogleSignin.getTokens();
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

  function validate() {
    const errs: { [k: string]: string } = {};
    if (!email) errs.email = 'Digite seu e-mail.';
    else if (!isValidEmail(email)) errs.email = 'E-mail inválido.';
    if (!password) errs.password = 'Digite sua senha.';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

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
          <Image
            source={require('../../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
            accessible
            accessibilityLabel="Logo Athus"
          />
          <Text style={styles.subtitle}>
            Acesse sua conta para encontrar serviços
          </Text>

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
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                placeholderTextColor={colors.textLight}
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
            </View>
            {errors.email && (
              <Text style={styles.errorMsg}>{errors.email}</Text>
            )}
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
                placeholderTextColor={colors.textLight}
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
            {errors.password && (
              <Text style={styles.errorMsg}>{errors.password}</Text>
            )}
          </View>

          <Link href="/auth/forgot-password" asChild>
            <TouchableOpacity style={styles.forgotPasswordButton}>
              <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
            </TouchableOpacity>
          </Link>

          <Button
            title={loading ? 'Entrando...' : 'Entrar'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading || !email || !password}
            style={[
              styles.loginButton,
              (loading || !email || !password) && styles.loginButtonDisabled,
            ]}
            textStyle={styles.loginButtonText}
            accessibilityLabel="Botão de entrar"
          />

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

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não tem uma conta?</Text>
            <Link href="/auth/register" asChild>
              <TouchableOpacity>
                <Text style={styles.registerLink}>Crie uma!</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
