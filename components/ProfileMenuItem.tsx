import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { ChevronRight } from 'lucide-react-native';

interface ProfileMenuItemProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  onPress: () => void;
  titleStyle?: TextStyle;
}

export function ProfileMenuItem({
  icon,
  title,
  subtitle,
  showChevron = true,
  onPress,
  titleStyle,
}: ProfileMenuItemProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.iconContainer}>{icon}</View>
      
      <View style={styles.content}>
        <Text style={[styles.title, titleStyle]}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
      
      {showChevron && (
        <ChevronRight size={20} color={colors.textLight} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  iconContainer: {
    marginRight: 16,
  },
  content: {
    flex: 1,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.textDark,
  },
  subtitle: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: colors.textLight,
    marginTop: 4,
  },
});