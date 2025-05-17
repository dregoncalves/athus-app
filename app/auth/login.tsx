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
import { Link } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';

// Função simples para validar e-mail
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function LoginScreen() {
  usePublicRoute();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Preencha todos os campos',
      });
      return;
    }
    if (!isValidEmail(email)) {
      Toast.show({
        type: 'error',
        text1: 'Digite um e-mail válido',
      });
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      // O AuthContext já faz redirect. Se quiser, adicione um toast aqui também.
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
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoContainer}>
            <Image
              source={require('../../assets/images/logo.png')}
              style={styles.logo}
              resizeMode="contain"
              accessible
              accessibilityLabel="Logo Athus"
            />
            <Text style={styles.tagline}>
              Conectando talentos das periferias
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>Login</Text>
            <Text style={styles.subtitle}>
              Acesse sua conta para encontrar serviços
            </Text>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Digite seu e-mail"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoFocus
                returnKeyType="next"
                onSubmitEditing={() => passwordRef.current?.focus()}
                blurOnSubmit={false}
                textContentType="username"
                accessible
                accessibilityLabel="Campo de e-mail"
              />
              {/* Mensagem de erro de e-mail inválido em tempo real */}
              {email.length > 0 && !isValidEmail(email) && (
                <Text style={styles.errorText}>Digite um e-mail válido.</Text>
              )}
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
                  returnKeyType="done"
                  onSubmitEditing={handleLogin}
                  textContentType="password"
                  accessible
                  accessibilityLabel="Campo de senha"
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

            <Link href="/auth/forgot-password" asChild>
              <TouchableOpacity style={styles.forgotPasswordButton} accessibilityRole="button">
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </Link>

            <Button
              title="Entrar"
              onPress={handleLogin}
              loading={loading}
              disabled={loading || !email || !password || !isValidEmail(email)}
              style={styles.loginButton}
              accessibilityLabel="Botão de login"
              testID="login-btn"
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
  scrollContent: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 40 },
  logoContainer: { alignItems: 'center', marginTop: 60, marginBottom: 48 },
  logo: { width: 150, height: 50, marginBottom: 12 },
  tagline: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
  },
  formContainer: { flex: 1 },
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
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
  },
  errorText: {
    color: colors.error || '#c00',
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
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
  forgotPasswordButton: { alignSelf: 'flex-end', marginBottom: 24 },
  forgotPasswordText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.primary,
  },
  loginButton: { marginBottom: 24 },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
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
