import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/constants/colors';
import { Star } from 'lucide-react-native';

interface Review {
  id: string;
  providerId: string;
  userName: string;
  userImage?: string;
  rating: number;
  comment: string;
  date: string;
}

interface ReviewItemProps {
  review: Review;
}

export function ReviewItem({ review }: ReviewItemProps) {
  // Generate array of stars based on rating
  const stars = Array.from({ length: 5 }, (_, i) => i < review.rating);

  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        {review.userImage ? (
          <Image source={{ uri: review.userImage }} style={styles.userImage} />
        ) : (
          <View style={styles.userImagePlaceholder}>
            <Text style={styles.userImageInitial}>
              {review.userName.charAt(0).toUpperCase()}
            </Text>
          </View>
        )}
        
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.userName}</Text>
          <Text style={styles.date}>{review.date}</Text>
        </View>
      </View>
      
      <View style={styles.ratingContainer}>
        {stars.map((filled, index) => (
          <Star 
            key={index} 
            size={16} 
            color={colors.primary}
            fill={filled ? colors.primary : 'transparent'}
          />
        ))}
      </View>
      
      <Text style={styles.comment}>{review.comment}</Text>
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
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userImagePlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userImageInitial: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: colors.textDark,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.textDark,
  },
  date: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textLight,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  comment: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.textDark,
    lineHeight: 20,
  },
});