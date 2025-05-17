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
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const router = useRouter();
  const { verifyEmail } = useAuth();
  const { email } = useLocalSearchParams<{ email: string }>();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleCodeChange = (text: string, index: number) => {
    if (!/^[0-9]?$/.test(text)) return;
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    setError('');
    if (text.length === 1 && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
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
      return;
    }
    setLoading(true);
    setError('');
    try {
      await verifyEmail(email, codigo);
      Toast.show({
        type: 'success',
        text1: 'E-mail verificado com sucesso!',
        text2: 'Agora você pode fazer login.',
      });
      router.replace('/auth/login');
    } catch (err) {
      setError('Código inválido ou expirado.');
      Toast.show({
        type: 'error',
        text1: 'Código inválido ou expirado.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = () => {
    setTimer(30);
    setCode(['', '', '', '', '', '']);
    inputRefs.current[0]?.focus();
    Toast.show({
      type: 'success',
      text1: 'Novo código enviado!',
      text2: 'Verifique sua caixa de entrada.',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Voltar"
        >
          <ArrowLeft size={24} color={colors.textDark} />
        </TouchableOpacity>

        <View style={styles.content}>
          <Text style={styles.title}>Verificar e-mail</Text>
          <Text style={styles.subtitle}>
            Enviamos um código de verificação para o e-mail: {email}
          </Text>

          <View style={styles.codeContainer}>
            {code.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.codeInput,
                  digit ? styles.codeInputFilled : null,
                ]}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="number-pad"
                textAlign="center"
                returnKeyType={index === code.length - 1 ? 'done' : 'next'}
                onSubmitEditing={handleVerify}
                accessible
                accessibilityLabel={`Dígito ${index + 1} do código`}
              />
            ))}
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            title="Verificar"
            onPress={handleVerify}
            loading={loading}
            style={styles.verifyButton}
            disabled={
              loading ||
              code.some((c) => !c) ||
              code.join('').length !== 6
            }
            accessibilityLabel="Botão verificar código"
          />

          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>Não recebeu o código?</Text>
            {timer > 0 ? (
              <Text style={styles.timerText}>Reenviar em {timer}s</Text>
            ) : (
              <TouchableOpacity onPress={handleResendCode} accessibilityRole="button">
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
  keyboardAvoidingView: { flex: 1, paddingHorizontal: 24 },
  backButton: { marginTop: 16, marginBottom: 16, alignSelf: 'flex-start' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 },
  title: { fontFamily: 'Poppins-Bold', fontSize: 28, color: colors.textDark, marginBottom: 16, textAlign: 'center' },
  subtitle: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginBottom: 32, textAlign: 'center', lineHeight: 20 },
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    marginBottom: 40,
  },
  codeInput: {
    width: 48,
    height: 62,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 12,
    fontSize: 28,
    fontFamily: 'Poppins-Medium',
    backgroundColor: colors.white,
    textAlign: 'center',
    marginHorizontal: 4,
    paddingHorizontal: 0,
    paddingVertical: 0,
    alignItems: 'center',
    justifyContent: 'center',
    // O importante para centralizar: lineHeight e textAlign
    lineHeight: 62,
  },
  codeInputFilled: {
    borderColor: colors.primary,
  },
  errorText: {
    color: colors.error || '#c00',
    marginBottom: 10,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
  verifyButton: { width: '100%', marginBottom: 24 },
  resendContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 16 },
  resendText: { fontFamily: 'Poppins-Regular', fontSize: 14, color: colors.textLight, marginRight: 4 },
  resendLink: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.primary },
  timerText: { fontFamily: 'Poppins-Medium', fontSize: 14, color: colors.textLight },
});
