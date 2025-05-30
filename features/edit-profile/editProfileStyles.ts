// features/edit-profile/editProfileStyles.ts
import { StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';

export const editProfileStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Poppins-Bold',
    fontSize: 26,
    color: colors.black,
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: colors.black,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.black,
    marginBottom: 4,
  },
  input: {
    height: 50,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.black,
  },
  disabledInput: {
    backgroundColor: colors.lightGray,
    height: 50,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: colors.black,
  },
  errorText: {
    color: colors.danger,
    fontSize: 13,
    marginTop: 4,
    fontFamily: 'Poppins-Regular',
  },
  submitButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonText: {
    color: '#fff',
    fontFamily: 'Poppins-SemiBold',
    fontSize: 16,
  },
  toggleButton: {
    backgroundColor: colors.lightGray,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  toggleButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: colors.black,
  },
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eyeIcon: {
    padding: 10,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  checkIcon: {
    position: 'absolute',
    right: 12,
  },
  inputWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  checkIconInside: {
    position: 'absolute',
    right: 16,
    top: 14,
    zIndex: 1,
  },
  inputValid: {
    borderColor: colors.success,
    borderWidth: 2,
  },
});
