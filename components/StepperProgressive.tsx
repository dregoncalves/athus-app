import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

type Props = {
  currentStep: number; // começa em 1
  totalSteps: number;
};

export default function StepperProgressive({ currentStep, totalSteps }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, idx) => {
        const step = idx + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;

        return (
          <React.Fragment key={step}>
            {/* Bolinha */}
            <View style={[
              styles.circle,
              isActive && { backgroundColor: colors.primary },
              isCompleted && { borderColor: colors.primary },
            ]}>
              <Text style={[
                styles.circleText,
                isActive && { color: '#fff' },
                isCompleted && { color: colors.primary },
              ]}>
                {step}
              </Text>
            </View>
            {/* Linha */}
            {step < totalSteps && (
              <View style={styles.lineContainer}>
                {/* Linha de fundo */}
                <View style={styles.lineBackground} />
                {/* Linha preenchida para o passo ATUAL */}
                {step === currentStep && (
                  <View style={styles.lineProgress} />
                )}
                {/* Linha totalmente preenchida para passos anteriores */}
                {isCompleted && (
                  <View style={styles.lineCompleted} />
                )}
              </View>
            )}
          </React.Fragment>
        );
      })}
    </View>
  );
}

const CIRCLE_SIZE = 32;
const LINE_LENGTH = 40;
const LINE_HEIGHT = 5;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    backgroundColor: colors.lightGray,
    marginHorizontal: 10,
    borderColor: colors.lightGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleText: {
    fontWeight: 'bold',
    fontSize: 15,
    color: colors.textLight,
    fontFamily: 'Poppins-Medium',
  },
  lineContainer: {
    width: LINE_LENGTH,
    height: LINE_HEIGHT,
    justifyContent: 'center',
    position: 'relative',
    marginHorizontal: 0,
  },
  lineBackground: {
    width: '100%',
    height: LINE_HEIGHT,
    borderRadius: 3,
    backgroundColor: colors.lightGray,
    position: 'absolute',
    left: 0,
    top: 0,
  },
  lineProgress: {
    width: '50%',
    height: LINE_HEIGHT,
    borderRadius: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 1,
  },
  lineCompleted: {
    width: '100%',
    height: LINE_HEIGHT,
    borderRadius: 3,
    backgroundColor: colors.primary,
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 2,
    opacity: 0.7,
  },
});
