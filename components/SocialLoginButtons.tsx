import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';

export function SocialLoginButtons({ onGooglePress, onFacebookPress, loadingGoogle, loadingFacebook }) {
  return (
    <View style={styles.socialContainer}>
      <TouchableOpacity
        style={styles.socialButton}
        onPress={onGooglePress}
        disabled={loadingGoogle}
        accessibilityRole="button"
        accessibilityLabel="Entrar com Google"
        activeOpacity={0.85}
      >
        <Image
          source={require('../assets/images/google-logo.png')}
          style={styles.socialLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.socialButton, { marginLeft: 16 }]}
        onPress={onFacebookPress}
        disabled={loadingFacebook}
        accessibilityRole="button"
        accessibilityLabel="Entrar com Facebook"
        activeOpacity={0.85}
      >
        <Image
          source={require('../assets/images/facebook-logo.png')}
          style={styles.socialLogo}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  );
}

const BUTTON_SIZE = 54;

const styles = StyleSheet.create({
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    marginTop: 8,
  },
  socialButton: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: '#dadada',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  socialLogo: {
    width: 28,
    height: 28,
  },
});
