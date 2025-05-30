// features/edit-profile/PersonalInfoSection.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { editProfileStyles as styles } from './editProfileStyles';
import FormInput from './components/FormInput';

export default function PersonalInfoSection() {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Dados Pessoais</Text>

      {/* Nome */}
      <FormInput
        name="nome"
        label="Nome completo"
        placeholder="Digite seu nome"
        autoCapitalize="words"
        returnKeyType="next"
        rules={{
          required: 'Informe seu nome completo',
          validate: (value: string) =>
            value.trim().split(' ').length >= 2 || 'Digite nome e sobrenome',
        }}
      />

      {/* E-mail (desabilitado) */}
      <FormInput
        name="email"
        label="E-mail"
        placeholder="email@exemplo.com"
        editable={false}
        selectTextOnFocus={false}
      />

      {/* Telefone (com máscara) */}
      <FormInput
        name="telefone"
        label="Telefone"
        placeholder="(99) 9 9999-9999"
        keyboardType="phone-pad"
        mask="(99) 9 9999-9999"
        returnKeyType="done"
        rules={{
          required: 'Informe seu telefone',
          pattern: {
            value: /^\(\d{2}\) 9 \d{4}-\d{4}$/,
            message: 'Formato inválido',
          },
        }}
      />
    </View>
  );
}
