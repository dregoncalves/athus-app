import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

interface Service {
  id: string;
  providerId: string;
  name: string;
  price: number;
  description: string;
  duration?: string;
}

interface ServiceItemProps {
  service: Service;
}

export function ServiceItem({ service }: ServiceItemProps) {
  // Format price to BRL currency
  const formattedPrice = service.price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{service.name}</Text>
        <Text style={styles.price}>{formattedPrice}</Text>
      </View>
      
      <Text style={styles.description}>{service.description}</Text>
      
      {service.duration && (
        <Text style={styles.duration}>Duração: {service.duration}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: colors.white,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: colors.textDark,
  },
  price: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 14,
    color: colors.primary,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textDark,
    marginBottom: 8,
    lineHeight: 18,
  },
  duration: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: colors.textLight,
  },
});