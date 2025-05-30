// features/edit-profile/AddressSection.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { editProfileStyles as styles } from './editProfileStyles';
import { colors } from '@/constants/colors';
import FormInput from './components/FormInput';

export default function AddressSection() {
  const { setValue, watch } = useFormContext();

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  const cep = watch('cep');

  useEffect(() => {
    if (cep?.length === 9) {
      buscarEnderecoPorCep(cep);
    }
  }, [cep]);

  const buscarEnderecoPorCep = async (cep: string) => {
    setCepError(null);
    if (!/^\d{5}-\d{3}$/.test(cep)) return;

    setCepLoading(true);
    try {
      const response = await fetch(
        `https://viacep.com.br/ws/${cep.replace('-', '')}/json/`
      );
      const data = await response.json();
      if (data.erro) {
        setCepError('CEP não encontrado');
        setValue('cidade', '');
        setValue('estado', '');
        setValue('pais', '');
        setValue('rua', '');
      } else {
        setValue('cidade', data.localidade || '');
        setValue('estado', data.uf || '');
        setValue('pais', 'Brasil');
        setValue('rua', data.logradouro || '');
      }
    } catch {
      setCepError('Erro ao buscar CEP');
    } finally {
      setCepLoading(false);
    }
  };

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Endereço</Text>

      {/* CEP */}
      <View style={styles.inputContainer}>
        <FormInput
          name="cep"
          label="CEP"
          placeholder="00000-000"
          keyboardType="number-pad"
          maxLength={9}
          mask="99999-999"
          rules={{
            required: 'Informe o CEP',
            pattern: {
              value: /^\d{5}-\d{3}$/,
              message: 'CEP inválido',
            },
          }}
        />
        {cepLoading && (
          <ActivityIndicator
            size="small"
            color={colors.primary}
            style={{ position: 'absolute', right: 12, top: 14 }}
          />
        )}
        {cepError && <Text style={styles.errorText}>{cepError}</Text>}
      </View>

      {/* País */}
      <FormInput
        name="pais"
        label="País"
        placeholder="Brasil"
        autoCapitalize="words"
        rules={{ required: 'Informe o país' }}
      />

      {/* Estado */}
      <FormInput
        name="estado"
        label="Estado"
        placeholder="UF"
        autoCapitalize="characters"
        rules={{ required: 'Informe o estado' }}
      />

      {/* Cidade */}
      <FormInput
        name="cidade"
        label="Cidade"
        placeholder="Cidade"
        autoCapitalize="words"
        rules={{ required: 'Informe a cidade' }}
      />

      {/* Rua */}
      <FormInput
        name="rua"
        label="Rua"
        placeholder="Nome da rua"
        autoCapitalize="words"
        rules={{ required: 'Informe a rua' }}
      />

      {/* Número */}
      <FormInput
        name="numero"
        label="Número"
        placeholder="123"
        keyboardType="number-pad"
        rules={{ required: 'Informe o número' }}
      />

      {/* Apartamento (opcional) */}
      <FormInput
        name="apartamento"
        label="Apartamento (opcional)"
        placeholder="Ex: 101"
        keyboardType="number-pad"
      />
    </View>
  );
}
