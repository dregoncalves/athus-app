import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { useAuth } from '@/hooks/useAuth';
import Toast from 'react-native-toast-message';
import { usePublicRoute } from '@/hooks/usePublicRoute';

export default function VerifyEmailScreen() {
  usePublicRoute();

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [focusedIndex, setFocusedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();
  const { verifyEmail, login } = useAuth();

  const { email, senha } = useLocalSearchParams<{
    email: string;
    senha: string;
  }>();

  const shakeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const triggerShake = () => {
    shakeAnim.setValue(0);
    Animated.sequence([
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: -1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCodeChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    setError('');
    if (text.length === 1 && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
      setFocusedIndex(index + 1);
    }
  };

  const handlePaste = (text: string) => {
    if (text.length === 6 && /^[0-9]{6}$/.test(text)) {
      setCode(text.split(''));
      inputRefs.current[5]?.focus();
      setFocusedIndex(5);
      setError('');
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
      setFocusedIndex(index - 1);
    }
  };

  const handleVerify = async () => {
    const codigo = code.join('');
    if (codigo.length !== 6 || code.some((c) => !c)) {
      setError('Digite os 6 dígitos do código.');
      Toast.show({
        type: 'error',
        text1: 'Digite todos os dígitos do código',
      });
      triggerShake();
      return;
    }
    setLoading(true);
    setError('');
    try {
      const resposta = await verifyEmail(email, codigo);
      Toast.show({
        type: 'success',
        text1: 'E-mail verificado com sucesso!',
      });
      await login(email, senha);
      router.replace('/(tabs)');
    } catch (err) {
      setError('Código inválido ou expirado.');
      Toast.show({
        type: 'error',
        text1: 'Código inválido ou expirado.',
      });
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimer(30);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    setFocusedIndex(0);
    setError('');
    Toast.show({
      type: 'success',
      text1: 'Novo código enviado!',
      text2: 'Verifique sua caixa de entrada.',
    });
    // Aqui você pode chamar a função para realmente reenviar o código na API!
  };

  // Shake: de -8 a 8 px
  const shakeInterpolate = shakeAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-8, 8],
  });

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
            Verifique seu e-mail para acessar todos os recursos do app!
          </Text>

          <Text style={styles.infoText}>
            Enviamos um código para: {' '}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <Animated.View
            style={[
              styles.codeContainer,
              { transform: [{ translateX: shakeInterpolate }] },
            ]}
          >
            {code.map((digit, index) => (
              <View
                key={index}
                style={[
                  styles.inputWrapper,
                  error
                    ? styles.inputError
                    : focusedIndex === index
                    ? styles.inputFocused
                    : styles.inputDefault,
                  { width: 48, marginHorizontal: 3, paddingHorizontal: 0 },
                ]}
              >
                <TextInput
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.input,
                    styles.codeInputText,
                  ]}
                  value={digit}
                  onChangeText={(text) => {
                    if (text.length > 1) handlePaste(text);
                    else handleCodeChange(text, index);
                  }}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  maxLength={1}
                  keyboardType="number-pad"
                  textAlign="center"
                  returnKeyType={index === code.length - 1 ? 'done' : 'next'}
                  onSubmitEditing={handleVerify}
                  onFocus={() => setFocusedIndex(index)}
                  accessibilityLabel={`Dígito ${index + 1} do código`}
                  importantForAccessibility="yes"
                  placeholder="•"
                  placeholderTextColor={colors.textLight}
                />
              </View>
            ))}
          </Animated.View>

          {error ? <Text style={styles.errorMsg}>{error}</Text> : null}

          <Button
            title={loading ? 'Verificando...' : 'Verificar'}
            onPress={handleVerify}
            loading={loading}
            style={[
              styles.loginButton,
              (loading || code.some((c) => !c) || code.join('').length !== 6) &&
                styles.loginButtonDisabled,
            ]}
            textStyle={styles.loginButtonText}
            disabled={loading || code.some((c) => !c) || code.join('').length !== 6}
            accessibilityLabel="Botão para verificar o código"
          />

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Não recebeu o código?</Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Reenviar em {timer}s</Text>
            ) : (
              <TouchableOpacity
                onPress={handleResendCode}
                accessibilityRole="button"
                accessibilityLabel="Reenviar código"
              >
                <Text style={styles.registerLink}>Reenviar código</Text>
              </TouchableOpacity>
            )}
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
  logo: { width: 120, height: 120, alignSelf: 'center', marginBottom: 32 },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginBottom: 18,
    textAlign: 'center',
  },
  infoText: {
    fontFamily: 'Poppins-Regular',
    color: colors.textLight,
    fontSize: 13,
    marginBottom: 18,
    textAlign: 'center',
    lineHeight: 18,
  },
  emailText: { fontFamily: 'Poppins-Medium', color: colors.primary },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 28,
    alignItems: 'center',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    paddingHorizontal: 8,
    backgroundColor: '#fff',
    borderWidth: 1,
    minHeight: 50,
    height: 52,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    height: 50,
    fontFamily: 'Poppins-Regular',
    fontSize: 22,
    color: '#222',
    backgroundColor: 'transparent',
    textAlign: 'center',
    paddingHorizontal: 0,
  },
  codeInputText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 22,
    letterSpacing: 2,
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
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
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
    marginBottom: 18,
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
  timerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primary,
  },
});
