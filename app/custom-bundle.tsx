import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ColorValue,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  ArrowLeft,
  CheckCircle2,
  Monitor,
  Newspaper,
  Radio,
  Film,
  Users as UsersIcon,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { adSpaces } from '@/constants/adSpaces';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

export default function CustomBundleScreen() {
  const insets = useSafeAreaInsets();
  const { addToCart } = useApp();
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [designNotes, setDesignNotes] = useState('');

  const services = [
    { id: 'billboards', name: 'Billboards', icon: Monitor, color: '#3B82F6' },
    { id: 'print', name: 'Print Media', icon: Newspaper, color: '#10B981' },
    { id: 'digital', name: 'Digital Ads', icon: Monitor, color: '#8B5CF6' },
    { id: 'radio', name: 'Radio Spots', icon: Radio, color: '#F59E0B' },
    { id: 'cinema', name: 'Cinema Ads', icon: Film, color: '#EF4444' },
    { id: 'events', name: 'Event Sponsorship', icon: UsersIcon, color: '#EC4899' },
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleContinue = () => {
    if (selectedServices.length > 0) {
      selectedServices.forEach(serviceId => {
        const relevantAds = adSpaces.filter(ad => ad.category === serviceId);
        if (relevantAds.length > 0) {
          addToCart(relevantAds[0], 1);
        }
      });
    }
    router.push('/create-campaign');
  };

  const filteredAds = adSpaces.filter(ad => 
    selectedServices.length === 0 || selectedServices.includes(ad.category)
  ).slice(0, 4);

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.safeBackground} />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Custom Bundle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Services</Text>
          <Text style={styles.sectionDescription}>
            Choose the advertising services you want to include in your custom bundle
          </Text>
          
          <View style={styles.servicesGrid}>
            {services.map(service => {
              const ServiceIcon = service.icon;
              const isSelected = selectedServices.includes(service.id);
              
              return (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    isSelected && [styles.serviceCardSelected, { borderColor: service.color }],
                  ]}
                  onPress={() => toggleService(service.id)}
                >
                  <View style={[styles.serviceIconContainer, { backgroundColor: `${service.color}20` }]}>
                    <ServiceIcon size={32} color={service.color} />
                  </View>
                  <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>
                    {service.name}
                  </Text>
                  {isSelected && (
                    <View style={[styles.checkIcon, { backgroundColor: service.color }]}>
                      <CheckCircle2 size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Design Preferences</Text>
          <Text style={styles.sectionDescription}>
            Share any specific requirements or design ideas for your campaign
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="E.g., Brand colors, style preferences, target audience..."
            placeholderTextColor={Colors.text.tertiary}
            value={designNotes}
            onChangeText={setDesignNotes}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {filteredAds.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Suggested Services</Text>
            <Text style={styles.sectionDescription}>
              Based on your selection, here are some recommended ad spaces
            </Text>
            
            <View style={styles.suggestionsGrid}>
              {filteredAds.map(ad => (
                <TouchableOpacity
                  key={ad.id}
                  style={styles.suggestionCard}
                  onPress={() => router.push(`/service-detail?id=${ad.id}`)}
                >
                  <Image source={{ uri: ad.image }} style={styles.suggestionImage} />
                  <View style={styles.suggestionContent}>
                    <Text style={styles.suggestionTitle} numberOfLines={2}>{ad.title}</Text>
                    <Text style={styles.suggestionLocation} numberOfLines={1}>{ad.location}</Text>
                    <Text style={styles.suggestionPrice}>₹{(ad.price / 1000).toFixed(0)}K/{ad.priceUnit}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>Selected Services</Text>
            <Text style={styles.footerValue}>{selectedServices.length} services</Text>
          </View>
          <TouchableOpacity
            style={[styles.continueButton, selectedServices.length === 0 && styles.continueButtonDisabled]}
            onPress={handleContinue}
            disabled={selectedServices.length === 0}
          >
            <LinearGradient
              colors={
                selectedServices.length > 0
                  ? (Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]])
                  : ['#ccc', '#999'] as readonly [ColorValue, ColorValue, ...ColorValue[]]
              }
              style={styles.continueGradient}
            >
              <Text style={styles.continueText}>Continue to Cart</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  safeBackground: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 20,
    lineHeight: 20,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  serviceCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
    position: 'relative' as const,
    ...Colors.shadow.small,
  },
  serviceCardSelected: {
    borderWidth: 2,
    backgroundColor: `${Colors.primary}05`,
  },
  serviceIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    textAlign: 'center' as const,
  },
  serviceNameSelected: {
    color: Colors.primary,
    fontWeight: '700' as const,
  },
  checkIcon: {
    position: 'absolute' as const,
    top: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
    minHeight: 150,
  },
  suggestionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  suggestionCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...Colors.shadow.small,
  },
  suggestionImage: {
    width: '100%',
    height: 120,
  },
  suggestionContent: {
    padding: 12,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  suggestionLocation: {
    fontSize: 11,
    color: Colors.text.secondary,
    marginBottom: 8,
  },
  suggestionPrice: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  bottomSpacer: {
    height: 120,
  },
  footer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    ...Colors.shadow.large,
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  footerLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  footerValue: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  continueButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  continueText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
});
