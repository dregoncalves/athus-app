import React from 'react';
import { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { Header } from '@/components/Header';
import { Button } from '@/components/Button';
import { Star, MapPin, Phone, MessageSquare, Calendar, ChevronRight } from 'lucide-react-native';
import { ReviewItem } from '@/components/ReviewItem';
import { ServiceItem } from '@/components/ServiceItem';
import { mockServiceProviders, mockReviews, mockServices } from '@/data/mockData';

export default function ProviderDetailsScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showAllReviews, setShowAllReviews] = useState(false);

  // Find provider by ID
  const provider = mockServiceProviders.find(p => p.id === id);
  
  if (!provider) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Detalhes do Prestador" showBackButton={true} />
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Prestador não encontrado</Text>
          <Button 
            title="Voltar para Home" 
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </SafeAreaView>
    );
  }

  // Get provider services
  const providerServices = mockServices.filter(
    service => service.providerId === provider.id
  );

  // Get provider reviews
  const providerReviews = mockReviews.filter(
    review => review.providerId === provider.id
  );

  // Calculate average rating
  const averageRating = providerReviews.reduce(
    (sum, review) => sum + review.rating, 0
  ) / providerReviews.length;

  // Limit reviews if not showing all
  const reviewsToShow = showAllReviews 
    ? providerReviews 
    : providerReviews.slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Detalhes do Prestador" showBackButton={true} />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.providerHeader}>
          <Image 
            source={{ uri: provider.imageUrl }} 
            style={styles.providerImage}
          />
          <View style={styles.providerInfo}>
            <Text style={styles.providerName}>{provider.name}</Text>
            <Text style={styles.providerSpecialization}>{provider.specialization}</Text>
            
            <View style={styles.ratingContainer}>
              <Star size={16} color={colors.primary} fill={colors.primary} />
              <Text style={styles.ratingText}>
                {averageRating.toFixed(1)} ({providerReviews.length} avaliações)
              </Text>
            </View>
            
            <View style={styles.locationContainer}>
              <MapPin size={16} color={colors.textLight} />
              <Text style={styles.locationText}>{provider.location}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.actionButton}>
            <Phone size={20} color={colors.textDark} />
            <Text style={styles.actionButtonText}>Ligar</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <MessageSquare size={20} color={colors.textDark} />
            <Text style={styles.actionButtonText}>Mensagem</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Calendar size={20} color={colors.textDark} />
            <Text style={styles.actionButtonText}>Agendar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre</Text>
          <Text style={styles.aboutText}>{provider.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Serviços</Text>
          {providerServices.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Avaliações</Text>
            {!showAllReviews && providerReviews.length > 2 && (
              <TouchableOpacity 
                style={styles.showAllButton}
                onPress={() => setShowAllReviews(true)}
              >
                <Text style={styles.showAllText}>Ver todas</Text>
                <ChevronRight size={16} color={colors.primary} />
              </TouchableOpacity>
            )}
          </View>
          
          {reviewsToShow.map((review) => (
            <ReviewItem key={review.id} review={review} />
          ))}
          
          {showAllReviews && (
            <TouchableOpacity 
              style={styles.showLessButton}
              onPress={() => setShowAllReviews(false)}
            >
              <Text style={styles.showAllText}>Ver menos</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
      
      <View style={styles.footer}>
        <Button 
          title="Contratar" 
          onPress={() => {}}
          style={styles.hireButton}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  providerHeader: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  providerImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
  },
  providerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  providerName: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 4,
  },
  providerSpecialization: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textLight,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderBottomWidth: 8,
    borderBottomColor: colors.lightGray,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionButtonText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textDark,
    marginTop: 4,
  },
  section: {
    padding: 16,
    borderBottomWidth: 8,
    borderBottomColor: colors.lightGray,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
    color: colors.textDark,
    marginBottom: 12,
  },
  aboutText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
  showAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  showAllText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.primary,
  },
  showLessButton: {
    alignSelf: 'center',
    marginTop: 16,
    padding: 8,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    backgroundColor: colors.white,
  },
  hireButton: {
    marginBottom: 0,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  notFoundText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 18,
    color: colors.textDark,
    marginBottom: 24,
    textAlign: 'center',
  },
});