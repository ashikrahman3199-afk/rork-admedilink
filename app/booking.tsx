import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { 
  ArrowLeft, 
  Calendar, 
  Target, 
  Palette, 
  Package,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { campaignObjectives, designStyles } from '@/constants/adSpaces';

type Step = 'details' | 'objective' | 'design' | 'services' | 'review';

export default function BookingScreen() {
  const { cart, cartTotal } = useApp();
  const [currentStep, setCurrentStep] = useState<Step>('details');
  const [campaignName, setCampaignName] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [selectedDesign, setSelectedDesign] = useState('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const steps: { id: Step; title: string; icon: any }[] = [
    { id: 'details', title: 'Details', icon: Package },
    { id: 'objective', title: 'Objective', icon: Target },
    { id: 'design', title: 'Design', icon: Palette },
    { id: 'services', title: 'Services', icon: Package },
    { id: 'review', title: 'Review', icon: CheckCircle2 },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const services = [
    { id: 'billboards', name: 'Billboards', description: 'Outdoor advertising' },
    { id: 'social-media', name: 'Social Media', description: 'Digital campaigns' },
    { id: 'print-media', name: 'Print Media', description: 'Newspapers & magazines' },
    { id: 'radio', name: 'Radio', description: 'Audio advertising' },
    { id: 'cinema', name: 'Cinema', description: 'Theater advertising' },
    { id: 'influencers', name: 'Influencers', description: 'Creator partnerships' },
  ];

  const toggleService = (serviceId: string) => {
    setSelectedServices(prev =>
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1].id);
    } else {
      router.push('/payment');
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1].id);
    } else {
      router.back();
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'details':
        return campaignName.trim().length > 0;
      case 'objective':
        return campaignObjective.length > 0;
      case 'design':
        return selectedDesign.length > 0;
      case 'services':
        return selectedServices.length > 0;
      case 'review':
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'details':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Campaign Details</Text>
            <Text style={styles.stepDescription}>
              Give your campaign a name and set the duration
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Campaign Name</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g., Summer Sale 2024"
                placeholderTextColor={Colors.text.tertiary}
                value={campaignName}
                onChangeText={setCampaignName}
              />
            </View>

            <View style={styles.dateRow}>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>Start Date</Text>
                <View style={styles.dateInput}>
                  <Calendar size={18} color={Colors.text.secondary} />
                  <TextInput
                    style={styles.dateInputText}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={Colors.text.tertiary}
                    value={startDate}
                    onChangeText={setStartDate}
                  />
                </View>
              </View>

              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.inputLabel}>End Date</Text>
                <View style={styles.dateInput}>
                  <Calendar size={18} color={Colors.text.secondary} />
                  <TextInput
                    style={styles.dateInputText}
                    placeholder="DD/MM/YYYY"
                    placeholderTextColor={Colors.text.tertiary}
                    value={endDate}
                    onChangeText={setEndDate}
                  />
                </View>
              </View>
            </View>

            <View style={styles.cartSummary}>
              <Text style={styles.cartSummaryTitle}>Cart Items</Text>
              {cart.map(item => (
                <View key={item.id} style={styles.cartSummaryItem}>
                  <Text style={styles.cartSummaryItemName} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.cartSummaryItemPrice}>
                    ₹{(item.price * item.duration * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        );

      case 'objective':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Campaign Objective</Text>
            <Text style={styles.stepDescription}>
              What's the main goal of your campaign?
            </Text>

            <View style={styles.optionsGrid}>
              {campaignObjectives.map(objective => (
                <TouchableOpacity
                  key={objective.id}
                  style={[
                    styles.optionCard,
                    campaignObjective === objective.id && styles.optionCardSelected,
                  ]}
                  onPress={() => setCampaignObjective(objective.id)}
                >
                  <View style={[
                    styles.optionIconContainer,
                    campaignObjective === objective.id && styles.optionIconContainerSelected,
                  ]}>
                    <Target size={24} color={
                      campaignObjective === objective.id ? Colors.primary : Colors.text.secondary
                    } />
                  </View>
                  <Text style={[
                    styles.optionTitle,
                    campaignObjective === objective.id && styles.optionTitleSelected,
                  ]}>
                    {objective.name}
                  </Text>
                  {campaignObjective === objective.id && (
                    <View style={styles.selectedBadge}>
                      <CheckCircle2 size={20} color={Colors.primary} />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'design':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Choose Ad Design</Text>
            <Text style={styles.stepDescription}>
              Select a design style that matches your brand identity
            </Text>

            <View style={styles.designList}>
              {designStyles.map(design => (
                <TouchableOpacity
                  key={design.id}
                  style={[
                    styles.designCard,
                    selectedDesign === design.id && styles.designCardSelected,
                  ]}
                  onPress={() => setSelectedDesign(design.id)}
                >
                  <View style={styles.designCardContent}>
                    <View style={[
                      styles.designIconContainer,
                      selectedDesign === design.id && styles.designIconContainerSelected,
                    ]}>
                      <Palette size={24} color={
                        selectedDesign === design.id ? Colors.primary : Colors.text.secondary
                      } />
                    </View>
                    <View style={styles.designInfo}>
                      <Text style={[
                        styles.designTitle,
                        selectedDesign === design.id && styles.designTitleSelected,
                      ]}>
                        {design.name}
                      </Text>
                      <Text style={styles.designDescription}>
                        {design.description}
                      </Text>
                    </View>
                  </View>
                  {selectedDesign === design.id && (
                    <CheckCircle2 size={24} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'services':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Select Ad Services</Text>
            <Text style={styles.stepDescription}>
              Choose the types of ads you want to include in your bundle
            </Text>

            <View style={styles.servicesList}>
              {services.map(service => (
                <TouchableOpacity
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    selectedServices.includes(service.id) && styles.serviceCardSelected,
                  ]}
                  onPress={() => toggleService(service.id)}
                >
                  <View style={styles.serviceCardContent}>
                    <View style={[
                      styles.serviceCheckbox,
                      selectedServices.includes(service.id) && styles.serviceCheckboxSelected,
                    ]}>
                      {selectedServices.includes(service.id) && (
                        <CheckCircle2 size={20} color={Colors.primary} />
                      )}
                    </View>
                    <View style={styles.serviceInfo}>
                      <Text style={[
                        styles.serviceTitle,
                        selectedServices.includes(service.id) && styles.serviceTitleSelected,
                      ]}>
                        {service.name}
                      </Text>
                      <Text style={styles.serviceDescription}>
                        {service.description}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        );

      case 'review':
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Review & Confirm</Text>
            <Text style={styles.stepDescription}>
              Review your campaign details before proceeding to payment
            </Text>

            <View style={styles.reviewCard}>
              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Campaign Name</Text>
                <Text style={styles.reviewValue}>{campaignName}</Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Objective</Text>
                <Text style={styles.reviewValue}>
                  {campaignObjectives.find(o => o.id === campaignObjective)?.name}
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Design Style</Text>
                <Text style={styles.reviewValue}>
                  {designStyles.find(d => d.id === selectedDesign)?.name}
                </Text>
              </View>

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Selected Services</Text>
                <View style={styles.reviewTags}>
                  {selectedServices.map(serviceId => (
                    <View key={serviceId} style={styles.reviewTag}>
                      <Text style={styles.reviewTagText}>
                        {services.find(s => s.id === serviceId)?.name}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View style={styles.reviewDivider} />

              <View style={styles.reviewSection}>
                <Text style={styles.reviewLabel}>Total Amount</Text>
                <Text style={styles.reviewTotal}>
                  ₹{(cartTotal * 1.23).toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          title: 'Create Campaign',
          headerLeft: () => (
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <ArrowLeft size={24} color={Colors.text.primary} />
            </TouchableOpacity>
          ),
        }}
      />

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStepIndex;
            const isCompleted = index < currentStepIndex;

            return (
              <View key={step.id} style={styles.progressStep}>
                <View style={[
                  styles.progressDot,
                  isActive && styles.progressDotActive,
                  isCompleted && styles.progressDotCompleted,
                ]}>
                  {isCompleted ? (
                    <CheckCircle2 size={20} color={Colors.surface} />
                  ) : (
                    <Icon size={20} color={
                      isActive ? Colors.surface : Colors.text.tertiary
                    } />
                  )}
                </View>
                {index < steps.length - 1 && (
                  <View style={[
                    styles.progressLine,
                    isCompleted && styles.progressLineCompleted,
                  ]} />
                )}
              </View>
            );
          })}
        </View>
        <View style={styles.progressLabels}>
          {steps.map((step, index) => (
            <Text
              key={step.id}
              style={[
                styles.progressLabel,
                index === currentStepIndex && styles.progressLabelActive,
              ]}
            >
              {step.title}
            </Text>
          ))}
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {renderStepContent()}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!canProceed()}
        >
          <LinearGradient
            colors={
              canProceed()
                ? (Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]])
                : ['#ccc', '#999'] as readonly [ColorValue, ColorValue, ...ColorValue[]]
            }
            style={styles.nextGradient}
          >
            <Text style={styles.nextText}>
              {currentStep === 'review' ? 'Proceed to Payment' : 'Continue'}
            </Text>
            <ChevronRight size={20} color={Colors.text.inverse} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  backButton: {
    padding: 8,
    marginLeft: 8,
  },
  progressContainer: {
    backgroundColor: Colors.surface,
    paddingVertical: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  progressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressStep: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressDot: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressDotActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  progressDotCompleted: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  progressLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.border.light,
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: Colors.primary,
  },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressLabel: {
    fontSize: 11,
    color: Colors.text.tertiary,
    fontWeight: '600' as const,
    flex: 1,
    textAlign: 'center' as const,
  },
  progressLabelActive: {
    color: Colors.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  stepContent: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  stepDescription: {
    fontSize: 15,
    color: Colors.text.secondary,
    lineHeight: 22,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  input: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: Colors.text.primary,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  dateRow: {
    flexDirection: 'row',
    gap: 12,
  },
  dateInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  dateInputText: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  cartSummary: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginTop: 8,
  },
  cartSummaryTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  cartSummaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartSummaryItemName: {
    flex: 1,
    fontSize: 14,
    color: Colors.text.secondary,
    marginRight: 12,
  },
  cartSummaryItemPrice: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  optionsGrid: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  optionCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  optionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionIconContainerSelected: {
    backgroundColor: Colors.primary + '20',
  },
  optionTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  optionTitleSelected: {
    color: Colors.primary,
  },
  selectedBadge: {
    marginLeft: 'auto' as const,
  },
  designList: {
    gap: 12,
  },
  designCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  designCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  designCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flex: 1,
  },
  designIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  designIconContainerSelected: {
    backgroundColor: Colors.primary + '20',
  },
  designInfo: {
    flex: 1,
  },
  designTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  designTitleSelected: {
    color: Colors.primary,
  },
  designDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  servicesList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
  },
  serviceCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '10',
  },
  serviceCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  serviceCheckbox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Colors.border.light,
    justifyContent: 'center',
    alignItems: 'center',
  },
  serviceCheckboxSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary + '20',
  },
  serviceInfo: {
    flex: 1,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  serviceTitleSelected: {
    color: Colors.primary,
  },
  serviceDescription: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  reviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 20,
  },
  reviewSection: {
    gap: 8,
  },
  reviewLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
    textTransform: 'uppercase' as const,
  },
  reviewValue: {
    fontSize: 16,
    color: Colors.text.primary,
    fontWeight: '600' as const,
  },
  reviewTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reviewTag: {
    backgroundColor: Colors.primary + '20',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  reviewTagText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  reviewDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
  },
  reviewTotal: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  bottomSpacer: {
    height: 100,
  },
  footer: {
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    padding: 16,
    ...Colors.shadow.large,
  },
  nextButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  nextText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
});
