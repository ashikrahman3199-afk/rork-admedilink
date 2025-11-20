import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ColorValue,
  FlatList,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import {
  ArrowLeft,
  MapPin,
  Star,
  Calendar,
  Clock,
  Users,
  TrendingUp,
  CheckCircle2,
  ShoppingCart,
  Heart,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adSpaces } from '@/constants/adSpaces';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');

const getServiceImages = (serviceId: string) => {
  const imageMap: { [key: string]: string[] } = {
    '1': [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&q=80',
      'https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=800&q=80',
      'https://images.unsplash.com/photo-1552168324-d612d77725e3?w=800&q=80',
    ],
    '2': [
      'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&q=80',
      'https://images.unsplash.com/photo-1567427018141-0584cfcbf1b8?w=800&q=80',
      'https://images.unsplash.com/photo-1599687267812-35c05ff70ee9?w=800&q=80',
    ],
    '3': [
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800&q=80',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
    ],
    '4': [
      'https://images.unsplash.com/photo-1586339949216-35c2747cc36d?w=800&q=80',
      'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&q=80',
      'https://images.unsplash.com/photo-1495020689067-958852a7765e?w=800&q=80',
    ],
    '5': [
      'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80',
      'https://images.unsplash.com/photo-1611162616305-c69b3037c834?w=800&q=80',
      'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=800&q=80',
    ],
    '6': [
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
      'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&q=80',
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    ],
    '7': [
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800&q=80',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80',
    ],
    '8': [
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80',
      'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&q=80',
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&q=80',
    ],
    '9': [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80',
    ],
    '10': [
      'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800&q=80',
      'https://images.unsplash.com/photo-1557838923-2985c318be48?w=800&q=80',
    ],
  };
  return imageMap[serviceId] || [adSpaces.find(s => s.id === serviceId)?.image || ''];
};

const getServiceHighlights = (serviceId: string) => {
  const highlightMap: { [key: string]: string[] } = {
    '1': [
      '🏙️ Premium city center location',
      '⚡ LED backlit display',
      '🎯 500K+ daily impressions',
      '⏰ 24/7 visibility guaranteed',
    ],
    '2': [
      '🛣️ Highway prime spot',
      '📏 Extra-large 40x20 ft format',
      '🌧️ All-weather resistant',
      '🚗 300K+ daily commuters',
    ],
    '3': [
      '📰 Leading English daily',
      '🎨 Full-color premium print',
      '👥 2M+ engaged readers',
      '🏆 Most trusted news brand',
    ],
    '4': [
      '🌍 Pan-India reach',
      '📈 5M+ daily readership',
      '💼 Business-focused audience',
      '🎯 High conversion rates',
    ],
    '5': [
      '🎯 Precision audience targeting',
      '📊 Real-time analytics',
      '🔄 A/B testing included',
      '💡 1M+ targeted impressions',
    ],
    '6': [
      '🌐 Global reach potential',
      '🔄 Retargeting capabilities',
      '📈 2M+ impressions',
      '⚡ Instant campaign activation',
    ],
    '7': [
      '📻 Prime morning & evening slots',
      '🎙️ Professional voiceover included',
      '👥 800K+ daily listeners',
      '🔄 10+ plays per day',
    ],
    '8': [
      '🎬 Premium theater environment',
      '📺 4K HD quality screening',
      '👨‍👩‍👧‍👦 1.5M+ monthly viewers',
      '🎯 100% captive audience',
    ],
    '9': [
      '👨‍💻 Top tech influencers',
      '💬 High engagement rate (8%+)',
      '📱 Stories + Feed posts',
      '🎥 500K+ loyal followers',
    ],
    '10': [
      '🌟 Network of 10+ influencers',
      '📹 Multi-platform coverage',
      '💎 Content ownership rights',
      '🚀 2M+ combined reach',
    ],
  };
  return highlightMap[serviceId] || [];
};

export default function ServiceDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useApp();
  const [selectedDuration, setSelectedDuration] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  const service = adSpaces.find(s => s.id === id);

  if (!service) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
        <Text style={styles.errorText}>Service not found</Text>
      </View>
    );
  }

  const serviceImages = getServiceImages(service.id);
  const serviceHighlights = getServiceHighlights(service.id);

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    setCurrentImageIndex(index);
  };

  const durations = [
    { label: '1 Week', value: 1, discount: 0 },
    { label: '2 Weeks', value: 2, discount: 5 },
    { label: '1 Month', value: 4, discount: 10 },
    { label: '3 Months', value: 12, discount: 20 },
  ];

  const availableDates = [
    { date: new Date(2025, 0, 15), status: 'available' as const },
    { date: new Date(2025, 0, 20), status: 'available' as const },
    { date: new Date(2025, 0, 25), status: 'limited' as const },
    { date: new Date(2025, 1, 1), status: 'available' as const },
    { date: new Date(2025, 1, 10), status: 'available' as const },
    { date: new Date(2025, 1, 15), status: 'booked' as const },
  ];

  const priceRanges = [
    { period: 'Peak Season', price: service.price * 1.3, months: 'Dec - Feb' },
    { period: 'Regular', price: service.price, months: 'Mar - Aug' },
    { period: 'Off Season', price: service.price * 0.8, months: 'Sep - Nov' },
  ];

  const calculateTotal = () => {
    const selectedDurationData = durations.find(d => d.value === selectedDuration);
    const discount = selectedDurationData?.discount || 0;
    const subtotal = service.price * selectedDuration;
    const discountAmount = (subtotal * discount) / 100;
    return subtotal - discountAmount;
  };

  const handleAddToCart = () => {
    addToCart(service, selectedDuration);
    router.push('/(tabs)/cart');
  };

  const handleWishlist = () => {
    if (isInWishlist(service.id)) {
      removeFromWishlist(service.id);
    } else {
      addToWishlist(service);
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.imageContainer}>
          <FlatList
            data={serviceImages}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false, listener: handleScroll }
            )}
            scrollEventThrottle={16}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
              <Image source={{ uri: item }} style={styles.image} />
            )}
          />
          <LinearGradient
            colors={['transparent', 'rgba(0,0,0,0.7)']}
            style={styles.imageGradient}
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color={Colors.text.inverse} />
          </TouchableOpacity>
          <View style={styles.imageInfo}>
            <Text style={styles.imageTitle}>{service.title}</Text>
            <View style={styles.imageLocation}>
              <MapPin size={16} color={Colors.text.inverse} />
              <Text style={styles.imageLocationText}>{service.location}</Text>
            </View>
          </View>
          {serviceImages.length > 1 && (
            <View style={styles.paginationContainer}>
              {serviceImages.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        <View style={styles.mainContent}>
          {serviceHighlights.length > 0 && (
            <View style={styles.highlightsSection}>
              {serviceHighlights.map((highlight, index) => (
                <View key={index} style={styles.highlightItem}>
                  <Text style={styles.highlightText}>{highlight}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Star size={20} color={Colors.accent} fill={Colors.accent} />
              </View>
              <Text style={styles.statValue}>{service.rating}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <Users size={20} color={Colors.primary} />
              </View>
              <Text style={styles.statValue}>{service.reach.split(' ')[0]}</Text>
              <Text style={styles.statLabel}>Reach</Text>
            </View>
            <View style={styles.statItem}>
              <View style={styles.statIcon}>
                <TrendingUp size={20} color={Colors.success} />
              </View>
              <Text style={styles.statValue}>High</Text>
              <Text style={styles.statLabel}>Visibility</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{service.description}</Text>
            <Text style={styles.reach}>{service.reach}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Features</Text>
            <View style={styles.featuresList}>
              {service.features.map((feature, index) => (
                <View key={index} style={styles.featureItem}>
                  <CheckCircle2 size={18} color={Colors.success} />
                  <Text style={styles.featureText}>{feature}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Price Ranges</Text>
            <View style={styles.priceRangesList}>
              {priceRanges.map((range, index) => (
                <View key={index} style={styles.priceRangeItem}>
                  <View style={styles.priceRangeHeader}>
                    <Text style={styles.priceRangePeriod}>{range.period}</Text>
                    <Text style={styles.priceRangeMonths}>{range.months}</Text>
                  </View>
                  <Text style={styles.priceRangePrice}>
                    ₹{range.price.toLocaleString('en-IN')}
                    <Text style={styles.priceRangeUnit}> per {service.priceUnit}</Text>
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Dates</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.datesContainer}
            >
              {availableDates.map((item, index) => {
                const isSelected = selectedDate?.getTime() === item.date.getTime();
                const isAvailable = item.status === 'available';
                const isLimited = item.status === 'limited';
                
                return (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.dateCard,
                      isSelected && styles.dateCardSelected,
                      !isAvailable && !isLimited && styles.dateCardDisabled,
                    ]}
                    onPress={() => isAvailable || isLimited ? setSelectedDate(item.date) : null}
                    disabled={!isAvailable && !isLimited}
                  >
                    <Text style={[
                      styles.dateMonth,
                      isSelected && styles.dateTextSelected,
                      !isAvailable && !isLimited && styles.dateTextDisabled,
                    ]}>
                      {item.date.toLocaleDateString('en-US', { month: 'short' })}
                    </Text>
                    <Text style={[
                      styles.dateDay,
                      isSelected && styles.dateTextSelected,
                      !isAvailable && !isLimited && styles.dateTextDisabled,
                    ]}>
                      {item.date.getDate()}
                    </Text>
                    <View style={[
                      styles.statusDot,
                      item.status === 'available' && styles.statusAvailable,
                      item.status === 'limited' && styles.statusLimited,
                      item.status === 'booked' && styles.statusBooked,
                    ]} />
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <View style={styles.legend}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.statusAvailable]} />
                <Text style={styles.legendText}>Available</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.statusLimited]} />
                <Text style={styles.legendText}>Limited</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, styles.statusBooked]} />
                <Text style={styles.legendText}>Booked</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Duration</Text>
            <View style={styles.durationGrid}>
              {durations.map((duration) => {
                const isSelected = selectedDuration === duration.value;
                return (
                  <TouchableOpacity
                    key={duration.value}
                    style={[
                      styles.durationCard,
                      isSelected && styles.durationCardSelected,
                    ]}
                    onPress={() => setSelectedDuration(duration.value)}
                  >
                    <Text style={[
                      styles.durationLabel,
                      isSelected && styles.durationLabelSelected,
                    ]}>
                      {duration.label}
                    </Text>
                    {duration.discount > 0 && (
                      <View style={styles.discountBadge}>
                        <Text style={styles.discountText}>-{duration.discount}%</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.bottomSpacer} />
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Total Amount</Text>
          <Text style={styles.priceValue}>₹{calculateTotal().toLocaleString('en-IN')}</Text>
        </View>
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.cartButton}
            onPress={handleWishlist}
          >
            <Heart 
              size={20} 
              color={isInWishlist(service.id) ? Colors.error : Colors.primary}
              fill={isInWishlist(service.id) ? Colors.error : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleAddToCart}
          >
            <LinearGradient
              colors={Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
              style={styles.bookButtonGradient}
            >
              <Text style={styles.bookButtonText}>Add to Cart</Text>
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 120,
  },
  imageContainer: {
    width: width,
    height: 300,
    position: 'relative' as const,
  },
  image: {
    width: width,
    height: 300,
  },
  imageGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },
  backButton: {
    position: 'absolute' as const,
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageInfo: {
    position: 'absolute' as const,
    bottom: 20,
    left: 20,
    right: 20,
  },
  imageTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
    marginBottom: 8,
  },
  imageLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  imageLocationText: {
    fontSize: 14,
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  mainContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Colors.shadow.small,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: 6,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    color: Colors.text.primary,
    lineHeight: 22,
    marginBottom: 8,
  },
  reach: {
    fontSize: 14,
    color: Colors.text.secondary,
    fontWeight: '600' as const,
  },
  featuresList: {
    gap: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  featureText: {
    fontSize: 14,
    color: Colors.text.primary,
    flex: 1,
  },
  priceRangesList: {
    gap: 12,
  },
  priceRangeItem: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    ...Colors.shadow.small,
  },
  priceRangeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  priceRangePeriod: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  priceRangeMonths: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  priceRangePrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  priceRangeUnit: {
    fontSize: 12,
    fontWeight: '400' as const,
    color: Colors.text.secondary,
  },
  datesContainer: {
    gap: 12,
    paddingBottom: 12,
  },
  dateCard: {
    width: 80,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
    borderWidth: 2,
    borderColor: 'transparent',
    ...Colors.shadow.small,
  },
  dateCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  dateCardDisabled: {
    opacity: 0.5,
  },
  dateMonth: {
    fontSize: 12,
    color: Colors.text.secondary,
    fontWeight: '600' as const,
  },
  dateDay: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  dateTextSelected: {
    color: Colors.primary,
  },
  dateTextDisabled: {
    color: Colors.text.tertiary,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 4,
  },
  statusAvailable: {
    backgroundColor: Colors.success,
  },
  statusLimited: {
    backgroundColor: Colors.accent,
  },
  statusBooked: {
    backgroundColor: Colors.error,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  durationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  durationCard: {
    width: (width - 64) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border.light,
    position: 'relative' as const,
  },
  durationCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: `${Colors.primary}10`,
  },
  durationLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  durationLabelSelected: {
    color: Colors.primary,
  },
  discountBadge: {
    position: 'absolute' as const,
    top: -8,
    right: -8,
    backgroundColor: Colors.accent,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  discountText: {
    fontSize: 10,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    padding: 20,
    paddingBottom: 30,
    ...Colors.shadow.large,
  },
  priceContainer: {
    marginBottom: 16,
  },
  priceLabel: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cartButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.background,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButton: {
    flex: 1,
    borderRadius: 28,
    overflow: 'hidden',
  },
  bookButtonGradient: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  errorText: {
    fontSize: 16,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
    marginTop: 100,
  },
  paginationContainer: {
    position: 'absolute' as const,
    bottom: 80,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  paginationDotActive: {
    width: 24,
    backgroundColor: Colors.text.inverse,
  },
  highlightsSection: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    ...Colors.shadow.small,
    gap: 10,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  highlightText: {
    fontSize: 14,
    color: Colors.text.primary,
    lineHeight: 20,
    fontWeight: '500' as const,
  },
});
