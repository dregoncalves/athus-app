import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFormContext, Controller } from 'react-hook-form';
import { ArrowLeft } from 'lucide-react-native';
import { registerStyles } from './registerStyles';
import { colors } from '@/constants/colors';

export default function Step2({
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
    setValue,
  } = useFormContext();

  const numeroRef = useRef<TextInput>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Busca de endereço no ViaCEP com tempo mínimo de loading e preenche só depois!
  const buscarEnderecoPorCep = async (cep: string) => {
    setCepError(null);
    if (!/^\d{5}-?\d{3}$/.test(cep)) return;

    setCepLoading(true);
    const startedAt = Date.now();
    try {
      const cepNum = cep.replace('-', '');
      const response = await fetch(`https://viacep.com.br/ws/${cepNum}/json/`);
      const data = await response.json();
      const elapsed = Date.now() - startedAt;
      const minLoading = 600; // milissegundos

      let afterLoadingAction = () => {};
      if (data.erro) {
        afterLoadingAction = () => {
          setCepError('CEP não encontrado');
          setValue('cidade', '');
          setValue('estado', '');
          setValue('pais', '');
          setValue('rua', '');
        };
      } else {
        afterLoadingAction = () => {
          setValue('cidade', data.localidade || '');
          setValue('estado', data.uf || '');
          setValue('pais', 'Brasil');
          setValue('rua', data.logradouro || '');
          setCepError(null);
        };
      }

      // Executa somente depois do loading mínimo
      if (elapsed < minLoading) {
        setTimeout(() => {
          setCepLoading(false);
          afterLoadingAction();
        }, minLoading - elapsed);
      } else {
        setCepLoading(false);
        afterLoadingAction();
      }
    } catch (e) {
      setCepError('Erro ao buscar CEP');
      setCepLoading(false);
    }
  };

  // Handler para CEP formatado e busca automática
  const handleCepChange = (onChange: (v: string) => void, value: string) => {
    onChange(value);
    setCepError(null);
    if (value.length === 9) {
      buscarEnderecoPorCep(value);
    }
  };

  const handleNext = async () => {
    const valid = await trigger([
      'pais',
      'estado',
      'cidade',
      'cep',
      'numero',
      'rua',
    ]);
    if (valid) onNext();
  };

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
              Agora, informe seu endereço completo:
            </Text>

            {/* CEP (primeiro campo) */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>CEP</Text>
              <Controller
                control={control}
                name="cep"
                rules={{
                  required: 'Informe o CEP',
                  pattern: {
                    value: /^\d{5}-?\d{3}$/,
                    message: 'Digite um CEP válido (00000-000)',
                  },
                }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <View>
                    <TextInput
                      style={registerStyles.input}
                      placeholder="00000-000"
                      value={value}
                      onChangeText={(text) => {
                        let cep = text.replace(/\D/g, '');
                        if (cep.length > 5) {
                          cep = cep.slice(0, 5) + '-' + cep.slice(5, 8);
                        }
                        handleCepChange(onChange, cep);
                      }}
                      keyboardType="number-pad"
                      returnKeyType="next"
                      maxLength={9}
                      onBlur={onBlur}
                      onFocus={() => setCepError(null)}
                    />
                    {cepLoading && (
                      <ActivityIndicator
                        size="small"
                        color={colors.primary}
                        style={{ position: 'absolute', right: 12, top: 14 }}
                      />
                    )}
                  </View>
                )}
              />
              {((errors.cep && errors.cep.message) || cepError) && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.cep?.message?.toString() || cepError}
                </Text>
              )}
            </View>

            {/* Linha País + Estado */}
            <View style={[registerStyles.inputContainer, styles.inputContainer, styles.row]}>
              <View style={[styles.inputHalf, { marginRight: 8 }]}>
                <Text style={registerStyles.inputLabel}>País</Text>
                <Controller
                  control={control}
                  name="pais"
                  rules={{ required: 'Informe o país' }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={registerStyles.input}
                      placeholder="País"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="words"
                      returnKeyType="next"
                      onBlur={onBlur}
                    />
                  )}
                />
                {!!errors.pais && (
                  <Text style={[registerStyles.errorText, styles.inlineError]}>
                    {errors.pais.message?.toString()}
                  </Text>
                )}
              </View>
              <View style={styles.inputHalf}>
                <Text style={registerStyles.inputLabel}>Estado</Text>
                <Controller
                  control={control}
                  name="estado"
                  rules={{ required: 'Informe o estado' }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      style={registerStyles.input}
                      placeholder="Estado"
                      value={value}
                      onChangeText={onChange}
                      autoCapitalize="characters"
                      returnKeyType="next"
                      onBlur={onBlur}
                    />
                  )}
                />
                {!!errors.estado && (
                  <Text style={[registerStyles.errorText, styles.inlineError]}>
                    {errors.estado.message?.toString()}
                  </Text>
                )}
              </View>
            </View>

            {/* Cidade */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>Cidade</Text>
              <Controller
                control={control}
                name="cidade"
                rules={{ required: 'Informe a cidade' }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Cidade"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onBlur={onBlur}
                  />
                )}
              />
              {!!errors.cidade && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.cidade.message?.toString()}
                </Text>
              )}
            </View>

            {/* Rua */}
            <View style={[registerStyles.inputContainer, styles.inputContainer]}>
              <Text style={registerStyles.inputLabel}>Rua</Text>
              <Controller
                control={control}
                name="rua"
                rules={{ required: 'Informe a rua' }}
                render={({ field: { onChange, value, onBlur } }) => (
                  <TextInput
                    style={registerStyles.input}
                    placeholder="Digite sua rua"
                    value={value}
                    onChangeText={onChange}
                    autoCapitalize="words"
                    returnKeyType="next"
                    onBlur={onBlur}
                  />
                )}
              />
              {!!errors.rua && (
                <Text style={[registerStyles.errorText, styles.inlineError]}>
                  {errors.rua.message?.toString()}
                </Text>
              )}
            </View>

            {/* Número */}
            <View style={[registerStyles.inputContainer, styles.inputContainer, styles.row]}>
              <View style={styles.inputForty}>
                <Text style={registerStyles.inputLabel}>Número</Text>
                <Controller
                  control={control}
                  name="numero"
                  rules={{ required: 'Informe o número' }}
                  render={({ field: { onChange, value, onBlur } }) => (
                    <TextInput
                      ref={numeroRef}
                      style={registerStyles.input}
                      placeholder="Número"
                      value={value}
                      onChangeText={onChange}
                      keyboardType="number-pad"
                      returnKeyType="done"
                      onBlur={onBlur}
                      onSubmitEditing={handleNext}
                    />
                  )}
                />
                {!!errors.numero && (
                  <Text style={[registerStyles.errorText, styles.inlineError]}>
                    {errors.numero.message?.toString()}
                  </Text>
                )}
              </View>
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
            accessibilityLabel="Avançar para próxima etapa"
            activeOpacity={0.8}
          >
            <Text style={[registerStyles.loginLink, styles.buttonText]}>
              Próximo
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
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  inputHalf: {
    flex: 1,
    minWidth: 0,
  },
  inputForty: {
    flex: 2,
    minWidth: 0,
  },
  inlineError: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 2,
  },
});
