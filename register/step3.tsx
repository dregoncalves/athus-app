import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormContext, Controller } from 'react-hook-form';
import { Eye, EyeOff, ArrowLeft, Calendar } from 'lucide-react-native';
import { registerStyles } from './registerStyles';
import { colors } from '@/constants/colors';
import DateTimePicker from '@react-native-community/datetimepicker';

function isValidCPF(cpf: string) {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
  let sum = 0;
  for (let i = 0; i < 9; i++) sum += Number(cpf[i]) * (10 - i);
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10) firstCheck = 0;
  if (firstCheck !== Number(cpf[9])) return false;
  sum = 0;
  for (let i = 0; i < 10; i++) sum += Number(cpf[i]) * (11 - i);
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10) secondCheck = 0;
  return secondCheck === Number(cpf[10]);
}

function isValidDate(dateStr: string) {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateStr.match(regex);
  if (!match) return false;
  const [_, d, m, y] = match;
  const date = new Date(+y, +m - 1, +d);
  if (
    date.getFullYear() !== +y ||
    date.getMonth() !== +m - 1 ||
    date.getDate() !== +d
  ) {
    return false;
  }
  // Checa idade mínima
  const today = new Date();
  const minAge = 12;
  let age = today.getFullYear() - +y;
  if (
    today.getMonth() < +m - 1 ||
    (today.getMonth() === +m - 1 && today.getDate() < +d)
  ) {
    age--;
  }
  return age >= minAge;
}

function formatDate(date: Date) {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function parseDate(str: string): Date | null {
  const [d, m, y] = str.split('/');
  if (!d || !m || !y) return null;
  return new Date(+y, +m - 1, +d);
}

const maskCPF = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
    .slice(0, 14);

export default function Step3({
  onNext,
  onBack,
}: {
  onNext: () => void;
  onBack: () => void;
}) {
  const {
    control,
    formState: { errors, isValid },
    trigger,
    watch,
    setValue,
  } = useFormContext();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Date picker state
  const [showPicker, setShowPicker] = useState(false);
  const [date, setDate] = useState<Date>(() => {
    const val = watch('dataNascimento');
    return val && isValidDate(val) ? parseDate(val)! : new Date(2000, 0, 1);
  });

  const cpfRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const senha = watch('senha');
  const dataNascimento = watch('dataNascimento');

  const handleNext = async () => {
    const valid = await trigger([
      'cpf',
      'dataNascimento',
      'senha',
      'confirmarSenha',
    ]);
    if (valid) onNext();
  };

  // --- DATE PICKER HANDLERS (adaptado do vídeo) ---
  function onChangeDate(event: any, selectedDate?: Date) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
      if (event.type === 'set' && selectedDate) {
        setDate(selectedDate);
        setValue('dataNascimento', formatDate(selectedDate), { shouldValidate: true });
      }
    } else if (Platform.OS === 'ios' && selectedDate) {
      setDate(selectedDate);
    }
  }

  function confirmIOSDate() {
    setValue('dataNascimento', formatDate(date), { shouldValidate: true });
    setShowPicker(false);
  }

  function cancelIOSDate() {
    setShowPicker(false);
  }

// const allValues = watch();
// console.log(allValues);



  return (
    <SafeAreaView style={styles.screenContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={registerStyles.header}>
          <TouchableOpacity
            style={registerStyles.backButton}
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Voltar"
          >
            <ArrowLeft size={24} color={colors.textDark} />
          </TouchableOpacity>
        </View>

        <View style={styles.inputsContainer}>
          <ScrollView
            contentContainerStyle={styles.inputsScroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={registerStyles.subtitle}>
              Agora, informe seus dados pessoais e escolha uma senha:
            </Text>

            {/* CPF */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>CPF</Text>
              <Controller
                control={control}
                name="cpf"
                rules={{
                  required: 'Informe seu CPF',
                  validate: (value) =>
                    isValidCPF(value) || 'CPF inválido',
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    ref={cpfRef}
                    style={registerStyles.input}
                    placeholder="000.000.000-00"
                    value={maskCPF(value || '')}
                    onChangeText={(t) => onChange(maskCPF(t))}
                    keyboardType="number-pad"
                    returnKeyType="next"
                    onBlur={onBlur}
                    onSubmitEditing={() => setShowPicker(true)}
                  />
                )}
              />
              {!!errors.cpf && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.cpf.message?.toString()}
                </Text>
              )}
            </View>

            {/* Data de Nascimento */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>Data de nascimento</Text>
              <Controller
                control={control}
                name="dataNascimento"
                rules={{
                  required: 'Informe sua data de nascimento',
                  validate: (value) =>
                    isValidDate(value) ||
                    'Data inválida ou menor de 12 anos',
                }}
                render={({ field: { value } }) => (
                  <>
                    <Pressable
                      style={[registerStyles.input, styles.dateInput]}
                      onPress={() => setShowPicker(true)}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Calendar size={18} color={colors.textLight} style={{ marginRight: 8 }} />
                        <Text style={{ color: value ? colors.textDark : colors.textLight }}>
                          {value ? value : 'Selecione a data'}
                        </Text>
                      </View>
                    </Pressable>
                    {/* DateTimePicker - Android mostra aqui, iOS modal */}
                    {showPicker && (
                      <DateTimePicker
                        value={date}
                        mode="date"
                        // display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                        display='spinner'
                        onChange={onChangeDate}
                        maximumDate={new Date()}
                        minimumDate={new Date(1900, 0, 1)}
                      />
                    )}
                    {/* Botões para iOS */}
                    {Platform.OS === 'ios' && showPicker && (
                      <View style={styles.iosPickerButtons}>
                        <TouchableOpacity
                          style={[styles.pickerButton, { backgroundColor: colors.danger }]}
                          onPress={cancelIOSDate}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.pickerButton, { backgroundColor: colors.primary }]}
                          onPress={confirmIOSDate}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Confirmar</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                )}
              />
              {!!errors.dataNascimento && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.dataNascimento.message?.toString()}
                </Text>
              )}
            </View>

            {/* Senha */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>Senha</Text>
              <View style={styles.passwordRow}>
                <Controller
                  control={control}
                  name="senha"
                  rules={{
                    required: 'Informe uma senha',
                    minLength: {
                      value: 6,
                      message: 'A senha deve ter pelo menos 6 dígitos',
                    },
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      ref={passwordRef}
                      style={[registerStyles.input, { flex: 1 }]}
                      placeholder="Digite sua senha"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      returnKeyType="next"
                      onBlur={onBlur}
                      onSubmitEditing={() => confirmRef.current?.focus()}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword((p) => !p)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showPassword ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
              {!!errors.senha && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.senha.message?.toString()}
                </Text>
              )}
            </View>

            {/* Confirmar Senha */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>Confirmar senha</Text>
              <View style={styles.passwordRow}>
                <Controller
                  control={control}
                  name="confirmarSenha"
                  rules={{
                    required: 'Confirme sua senha',
                    validate: (value) =>
                      value === watch('senha') || 'As senhas não conferem',
                  }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      ref={confirmRef}
                      style={[registerStyles.input, { flex: 1 }]}
                      placeholder="Confirme sua senha"
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirm}
                      autoCapitalize="none"
                      textContentType="newPassword"
                      returnKeyType="done"
                      onBlur={onBlur}
                      onSubmitEditing={handleNext}
                    />
                  )}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirm((p) => !p)}
                  accessibilityRole="button"
                  accessibilityLabel={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {showConfirm ? (
                    <EyeOff size={20} color={colors.textLight} />
                  ) : (
                    <Eye size={20} color={colors.textLight} />
                  )}
                </TouchableOpacity>
              </View>
              {!!errors.confirmarSenha && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.confirmarSenha.message?.toString()}
                </Text>
              )}
            </View>
          </ScrollView>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              registerStyles.registerButton,
              !isValid && styles.buttonDisabled,
            ]}
            onPress={handleNext}
            disabled={!isValid}
            accessibilityRole="button"
            accessibilityLabel="Finalizar cadastro"
            activeOpacity={0.8}
          >
            <Text style={[registerStyles.loginLink, styles.buttonText]}>
              Finalizar cadastro
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 24,
  },
  inputsContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  inputsScroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 24,
  },
  inputContainer: {
    marginBottom: 8,
  },
  buttonContainer: {
    justifyContent: 'flex-end',
    paddingBottom: 32,
    paddingTop: 0,
    paddingHorizontal: 0,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  inlineError: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 2,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateInput: {
    justifyContent: 'center',
    height: 50,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: colors.white,
  },
  eyeIcon: {
    padding: 12,
  },
  iosPickerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
    marginBottom: 8,
  },
  pickerButton: {
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 4,
    alignItems: 'center',
  },
});
function watch() {
    throw new Error('Function not implemented.');
}

