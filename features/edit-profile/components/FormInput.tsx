import React from 'react';
import { View, Text, TextInputProps, TextInput } from 'react-native';
import { Controller, useFormContext } from 'react-hook-form';
import { editProfileStyles as styles } from '../editProfileStyles';
import { MaskedTextInput } from 'react-native-mask-text'; // 👈 novo import

interface FormInputProps extends TextInputProps {
  name: string;
  label: string;
  rules?: any;
  mask?: string;
}

export default function FormInput({
  name,
  label,
  rules,
  mask,
  ...rest
}: FormInputProps) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>

      <Controller
        control={control}
        name={name}
        rules={rules}
        render={({ field: { onChange, onBlur, value } }) => {
          const commonProps = {
            style: [
              styles.input,
              rest.editable === false && styles.disabledInput,
            ],
            onBlur,
            value: value ?? '',
            ...rest,
          };

          // console.log('Campo', name, 'valor:', value);

          return mask ? (
            <MaskedTextInput
              {...commonProps}
              mask={mask}
              onChangeText={(text, rawText) => {
                onChange(text); // você pode usar rawText se preferir o valor sem máscara
              }}
              keyboardType={rest.keyboardType || 'default'}
            />
          ) : (
            <TextInput {...commonProps} onChangeText={onChange} />
          );
        }}
      />

      {errors[name as keyof typeof errors]?.message && (
        <Text style={styles.errorText}>
          {String(errors[name as keyof typeof errors]?.message)}
        </Text>
      )}
    </View>
  );
}
