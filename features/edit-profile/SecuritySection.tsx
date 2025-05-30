// features/edit-profile/SecuritySection.tsx
import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useFormContext } from 'react-hook-form';
import { editProfileStyles as styles } from './editProfileStyles';
import FormInput from './components/FormInput';
import { colors } from '@/constants/colors';

export default function SecuritySection() {
  const { watch } = useFormContext();
  const [showFields, setShowFields] = useState(false);

  const senha = watch('senha');

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Segurança</Text>

      {!showFields ? (
        <TouchableOpacity
          onPress={() => setShowFields(true)}
          style={styles.toggleButton}
        >
          <Text style={styles.toggleButtonText}>Quero alterar minha senha</Text>
        </TouchableOpacity>
      ) : (
        <>
          <FormInput
            name="senha"
            label="Nova senha"
            placeholder="Digite sua nova senha"
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="next"
            rules={{
              validate: (value: string) =>
                !value || value.length >= 6 || 'Mínimo de 6 caracteres',
            }}
          />

          <FormInput
            name="confirmarSenha"
            label="Confirmar nova senha"
            placeholder="Confirme sua nova senha"
            secureTextEntry
            autoCapitalize="none"
            returnKeyType="done"
            rules={{
              validate: (value: string) =>
                !senha || value === senha || 'Senhas não coincidem',
            }}
          />
        </>
      )}
    </View>
  );
}
