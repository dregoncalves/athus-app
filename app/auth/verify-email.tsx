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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { colors } from '@/constants/colors';
import { Button } from '@/components/Button';
import { ArrowLeft } from 'lucide-react-native';
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

  const { email, senha } = useLocalSearchParams<{ email: string, senha: string }>();

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
      Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: -1, duration: 50, useNativeDriver: true }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: true }),
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
      await verifyEmail(email, codigo);
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

  // Valor interpolado do shake (vai de -8 a 8 px)
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
        <View style={styles.content}>
          <Text style={styles.title}>Verificar e-mail</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de verificação para o e-mail:{' '}
            <Text style={styles.emailText}>{email}</Text>
          </Text>

          <Animated.View
            style={[
              styles.codeContainer,
              { transform: [{ translateX: shakeInterpolate }] },
            ]}
          >
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                  focusedIndex === index ? styles.codeInputFocused : null,
                  error ? styles.codeInputError : null,
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
                accessible
                accessibilityLabel={`Dígito ${index + 1} do código`}
                importantForAccessibility="yes"
              />
            ))}
          </Animated.View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title={loading ? "Verificando..." : "Verificar"}
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyButton}
            disabled={
              loading ||
              code.some((c) => !c) ||
              code.join('').length !== 6
            }
            accessibilityLabel="Botão para verificar o código"
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Não recebeu o código?</Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Reenviar em {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode} accessibilityRole="button" accessibilityLabel="Reenviar código">
                <Text style={styles.resendLink}>Reenviar código</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  keyboardAvoidingView: { flex: 1, paddingHorizontal: 14 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, color: colors.textDark, marginBottom: 16, textAlign: 'center' },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginBottom: 8, textAlign: 'center', lineHeight: 20 },
  emailText: { fontFamily: 'Poppins-Medium', color: colors.primary },
  infoText: {
    fontFamily: 'Poppins-Regular',
    color: colors.textLight,
    fontSize: 13,
    marginBottom: 28,
    textAlign: 'center',
    maxWidth: 330,
    lineHeight: 18,
  },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
    paddingHorizontal: 18,
  },
  codeInput: {
    width: 42,
    height: 52,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    fontSize: 22,
    fontFamily: 'Poppins-Medium',
    backgroundColor: colors.white,
    textAlign: 'center',
    marginHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  codeInputFilled: {
    borderColor: colors.primary,
  },
  codeInputFocused: {
    borderColor: colors.primary,
    backgroundColor: '#F0F6FF',
  },
  codeInputError: {
    borderColor: colors.danger || '#c00',
  },
  errorText: {
    color: colors.danger || '#c00',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  verifyButton: { width: '100%', marginBottom: 20 },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 12 },
  resendText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginRight: 4 },
  resendLink: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primary,
    textDecorationLine: 'underline',
  },
  timerText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primary,
  },
});
