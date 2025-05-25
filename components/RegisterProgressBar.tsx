import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

type Props = {
  /** Etapa atual (1-indexado) */
  currentStep: number;
  /** Total de etapas */
  totalSteps: number;
};

export default function RegisterProgressBar({ currentStep, totalSteps }: Props) {
  const progress = currentStep / totalSteps;

  return (
    <View style={styles.container}>
      <View style={styles.backgroundBar}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 16,
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
    justifyContent: 'center',
  },
  backgroundBar: {
    height: 6,
    backgroundColor: colors.lightGray || '#eee',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#6236ff',
    borderRadius: 3,
  },
});
