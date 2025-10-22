import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ColorValue,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { TrendingUp, ArrowRight } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleContinue = () => {
    if (phoneNumber.length === 10) {
      router.push('/onboarding' as any);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
        style={[styles.header, { paddingTop: insets.top + 40 }]}
      >
        <View style={styles.headerIconContainer}>
          <TrendingUp size={48} color={Colors.text.inverse} strokeWidth={2} />
        </View>
        <Text style={styles.headerTitle}>Ad-Run</Text>
        <Text style={styles.headerSubtitle}>Welcome! Let&apos;s get started</Text>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.formContainer}
      >
        <ScrollView
          contentContainerStyle={styles.formContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.inputSection}>
            <Text style={styles.label}>Enter Your Phone Number</Text>
            <Text style={styles.description}>
              We&apos;ll send you a verification code
            </Text>

            <View style={styles.phoneInputContainer}>
              <View style={styles.countryCode}>
                <Text style={styles.countryCodeText}>+91</Text>
              </View>
              <TextInput
                style={styles.phoneInput}
                placeholder="98765 43210"
                placeholderTextColor={Colors.text.tertiary}
                keyboardType="phone-pad"
                maxLength={10}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.continueButton,
              phoneNumber.length !== 10 && styles.continueButtonDisabled,
            ]}
            onPress={handleContinue}
            disabled={phoneNumber.length !== 10}
          >
            <LinearGradient
              colors={
                phoneNumber.length === 10
                  ? (Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]])
                  : ['#ccc', '#999'] as readonly [ColorValue, ColorValue, ...ColorValue[]]
              }
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Continue</Text>
              <ArrowRight size={20} color={Colors.text.inverse} />
            </LinearGradient>
          </TouchableOpacity>

          <Text style={styles.termsText}>
            By continuing, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 32,
    paddingBottom: 48,
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 36,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  formContainer: {
    flex: 1,
    marginTop: -24,
    backgroundColor: Colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
  },
  formContent: {
    padding: 32,
  },
  inputSection: {
    marginBottom: 32,
  },
  label: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 24,
  },
  phoneInputContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  countryCode: {
    width: 70,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  countryCodeText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Colors.shadow.medium,
    marginBottom: 24,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  continueText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  termsText: {
    fontSize: 12,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
    lineHeight: 18,
  },
  termsLink: {
    color: Colors.primary,
    fontWeight: '600' as const,
  },
});
