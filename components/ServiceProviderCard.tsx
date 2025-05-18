import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Star, MapPin, ChevronRight } from 'lucide-react-native';

interface ServiceProvider {
  id: string;
  name: string;
  imageUrl: string;
  specialization: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
}

interface ServiceProviderCardProps {
  provider: ServiceProvider;
}

export function ServiceProviderCard({ provider }: ServiceProviderCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/provider/${provider.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.85}
    >
      <View style={styles.avatarRow}>
        <View style={styles.avatarContainer}>
          <Image 
            source={{ uri: provider.imageUrl }}
            style={styles.avatar}
            resizeMode="cover"
          />
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.name} numberOfLines={1}>{provider.name}</Text>
          <View style={styles.ratingContainer}>
            <Star size={16} color={colors.primary} fill={colors.primary} />
            <Text style={styles.rating}>{provider.rating.toFixed(1)}</Text>
            <Text style={styles.reviewCount}>({provider.reviewCount})</Text>
          </View>
        </View>
      </View>

      <Text style={styles.specialization}>{provider.specialization}</Text>

      <View style={styles.locationContainer}>
        <MapPin size={16} color={colors.textLight} />
        <Text style={styles.location} numberOfLines={1}>{provider.location}</Text>
      </View>

      <Text style={styles.description} numberOfLines={2}>
        {provider.description}
      </Text>

      <View style={styles.footerRow}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity 
          style={styles.linkButton}
          onPress={handlePress}
          activeOpacity={0.8}
        >
          <Text style={styles.linkText}>Ver perfil</Text>
          <ChevronRight size={16} color={colors.primary} style={{ marginLeft: 2 }} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 18,
    padding: 18,
    shadowColor: '#2D2D2D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.09,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 0.5,
    borderColor: '#ECECEC'
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10
  },
  avatarContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.primary,
    marginRight: 14,
    backgroundColor: '#F5F5F7'
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  name: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 3,
    maxWidth: '90%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rating: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: colors.primary,
    marginLeft: 4,
    marginRight: 2,
  },
  reviewCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: colors.textLight,
  },
  specialization: {
    fontFamily: 'Poppins-Medium',
    fontSize: 15,
    color: colors.secondary,
    marginBottom: 6,
    marginTop: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 0,
  },
  location: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: colors.textLight,
    marginLeft: 6,
    flexShrink: 1,
  },
  description: {
    fontFamily: 'Poppins-Regular',
    fontSize: 13,
    color: colors.textDark,
    marginBottom: 10,
    lineHeight: 19,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 2,
    borderRadius: 16,
  },
  linkText: {
    fontFamily: 'Poppins-SemiBold',
    color: colors.primary,
    fontSize: 14,
  },
});

