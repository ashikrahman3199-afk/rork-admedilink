import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  ColorValue,
  Modal,
  Animated,
  PanResponder,
} from 'react-native';
import { Stack, useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  TrendingUp,
  SlidersHorizontal,
  X,
  Grid3x3,
  Monitor,
  Newspaper,
  Radio,
  Film,
  Users as UsersIcon,
  MapPin,
  Bell,
  ShoppingCart,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adSpaces, categories, AdCategory } from '@/constants/adSpaces';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 200;

export default function ServicesScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams();
  const { selectedLocation, unreadNotificationCount, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | 'all'>('all');
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'medium' | 'high'>('all');
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_HEIGHT],
    outputRange: [0, -(HEADER_HEIGHT + insets.top)],
    extrapolate: 'clamp',
  });

  const categoryFabPan = useRef(new Animated.ValueXY({ x: 0, y: 0 })).current;
  const categoryFabPanResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: categoryFabPan.x, dy: categoryFabPan.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        categoryFabPan.extractOffset();
      },
    })
  ).current;

  useEffect(() => {
    if (params.category && typeof params.category === 'string') {
      setSelectedCategory(params.category as AdCategory);
    }
  }, [params.category]);

  const filteredSpaces = adSpaces.filter(space => {
    const matchesCategory = selectedCategory === 'all' || space.category === selectedCategory;
    
    let matchesPrice = true;
    if (priceRange === 'low') matchesPrice = space.price < 30000;
    else if (priceRange === 'medium') matchesPrice = space.price >= 30000 && space.price < 60000;
    else if (priceRange === 'high') matchesPrice = space.price >= 60000;
    
    const matchesRating = ratingFilter === 0 || space.rating >= ratingFilter;
    
    return matchesCategory && matchesPrice && matchesRating;
  });

  const categoryIcons = {
    billboards: Monitor,
    print: Newspaper,
    digital: Monitor,
    radio: Radio,
    cinema: Film,
    events: UsersIcon,
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.contentContainer, { paddingTop: HEADER_HEIGHT + insets.top }]}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionSubtitle}>
              {selectedCategory === 'all' ? 'All Services' : categories.find(c => c.id === selectedCategory)?.name}
            </Text>
            <Text style={styles.resultCount}>{filteredSpaces.length} results</Text>
          </View>

          <View style={styles.servicesGrid}>
            {filteredSpaces.map(space => (
              <View
                key={space.id}
                style={styles.serviceCard}
              >
                <TouchableOpacity onPress={() => router.push(`/service-detail?id=${space.id}`)}>
                  <Image source={{ uri: space.image }} style={styles.serviceImage} />
                </TouchableOpacity>
                <View style={styles.serviceContent}>
                  <TouchableOpacity onPress={() => router.push(`/service-detail?id=${space.id}`)}>
                    <Text style={styles.serviceTitle} numberOfLines={2}>{space.title}</Text>
                    <Text style={styles.serviceLocation} numberOfLines={1}>{space.location}</Text>
                    <Text style={styles.serviceReach} numberOfLines={1}>{space.reach}</Text>
                    <View style={styles.servicePriceRow}>
                      <Text style={styles.servicePrice}>₹{(space.price / 1000).toFixed(0)}K</Text>
                      <Text style={styles.servicePriceUnit}>per {space.priceUnit}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.addToCartButton}
                    onPress={() => {
                      addToCart(space, 1);
                    }}
                  >
                    <ShoppingCart size={14} color={Colors.text.inverse} />
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Animated.View style={[
        styles.headerContainer,
        { transform: [{ translateY: headerTranslateY }] }
      ]}>
        <LinearGradient
          colors={Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
          style={[styles.header, { paddingTop: insets.top + 20 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity 
              style={styles.locationContainer}
              onPress={() => router.push('/location-selector')}
            >
              <MapPin size={20} color={Colors.text.inverse} />
              <Text style={styles.locationText}>{selectedLocation}</Text>
            </TouchableOpacity>
            <View style={styles.headerTopRight}>
              <TouchableOpacity 
                style={styles.searchIconButton}
                onPress={() => router.push('/search' as any)}
              >
                <Search size={22} color={Colors.text.inverse} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.filterIconButton}
                onPress={() => setShowFilters(true)}
              >
                <SlidersHorizontal size={22} color={Colors.text.inverse} />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => router.push('/notifications')}
              >
                <Bell size={22} color={Colors.text.inverse} />
                {unreadNotificationCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{unreadNotificationCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.headerTitle}>Ad Services</Text>
        </LinearGradient>
      </Animated.View>

      <Animated.View
        style={[
          styles.floatingCategoryButton,
          {
            transform: [
              { translateX: categoryFabPan.x },
              { translateY: categoryFabPan.y },
            ],
          },
        ]}
        {...categoryFabPanResponder.panHandlers}
      >
        <TouchableOpacity
          onPress={() => setShowCategoryMenu(true)}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
            style={styles.floatingButtonGradient}
          >
            <Grid3x3 size={24} color={Colors.text.inverse} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>

      <Modal
        visible={showCategoryMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCategoryMenu(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.categoryModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Categories</Text>
              <TouchableOpacity onPress={() => setShowCategoryMenu(false)}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.categoryModalContent}>
              <TouchableOpacity
                style={[
                  styles.modalCategoryItem,
                  selectedCategory === 'all' && styles.modalCategoryItemActive,
                ]}
                onPress={() => {
                  setSelectedCategory('all');
                  setShowCategoryMenu(false);
                }}
              >
                <View style={[
                  styles.modalCategoryIcon,
                  selectedCategory === 'all' && styles.modalCategoryIconActive,
                ]}>
                  <TrendingUp size={24} color={selectedCategory === 'all' ? Colors.text.inverse : Colors.primary} />
                </View>
                <Text style={[
                  styles.modalCategoryText,
                  selectedCategory === 'all' && styles.modalCategoryTextActive,
                ]}>All Categories</Text>
              </TouchableOpacity>

              {categories.map(category => {
                const Icon = categoryIcons[category.id as keyof typeof categoryIcons] || Monitor;
                return (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.modalCategoryItem,
                      selectedCategory === category.id && styles.modalCategoryItemActive,
                    ]}
                    onPress={() => {
                      setSelectedCategory(category.id);
                      setShowCategoryMenu(false);
                    }}
                  >
                    <View style={[
                      styles.modalCategoryIcon,
                      selectedCategory === category.id && styles.modalCategoryIconActive,
                    ]}>
                      <Icon size={24} color={selectedCategory === category.id ? Colors.text.inverse : Colors.primary} />
                    </View>
                    <Text style={[
                      styles.modalCategoryText,
                      selectedCategory === category.id && styles.modalCategoryTextActive,
                    ]}>{category.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showFilters}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <X size={24} color={Colors.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.filterModalContent}>
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Price Range</Text>
                <View style={styles.filterOptions}>
                  {['all', 'low', 'medium', 'high'].map((range) => (
                    <TouchableOpacity
                      key={range}
                      style={[
                        styles.filterOption,
                        priceRange === range && styles.filterOptionActive,
                      ]}
                      onPress={() => setPriceRange(range as any)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        priceRange === range && styles.filterOptionTextActive,
                      ]}>
                        {range === 'all' ? 'All' :
                         range === 'low' ? '< ₹30K' :
                         range === 'medium' ? '₹30K - ₹60K' : '> ₹60K'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>Minimum Rating</Text>
                <View style={styles.filterOptions}>
                  {[0, 3, 4, 4.5].map((rating) => (
                    <TouchableOpacity
                      key={rating}
                      style={[
                        styles.filterOption,
                        ratingFilter === rating && styles.filterOptionActive,
                      ]}
                      onPress={() => setRatingFilter(rating)}
                    >
                      <Text style={[
                        styles.filterOptionText,
                        ratingFilter === rating && styles.filterOptionTextActive,
                      ]}>
                        {rating === 0 ? 'All' : `${rating}+ ⭐`}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setPriceRange('all');
                  setRatingFilter(0);
                }}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <LinearGradient
                  colors={Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Apply Filters</Text>
                </LinearGradient>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerContainer: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.inverse,
  },
  searchIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationButton: {
    position: 'relative' as const,
  },
  badge: {
    position: 'absolute' as const,
    top: -4,
    right: -4,
    backgroundColor: Colors.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
    lineHeight: 38,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 0,
    paddingBottom: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
  },
  serviceCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...Colors.shadow.small,
  },
  serviceImage: {
    width: '100%',
    height: 140,
  },
  serviceContent: {
    padding: 12,
  },
  serviceTitle: {
    fontSize: 14,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 4,
    minHeight: 36,
  },
  serviceLocation: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  serviceReach: {
    fontSize: 11,
    color: Colors.text.tertiary,
    marginBottom: 8,
  },
  serviceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  servicePriceUnit: {
    fontSize: 10,
    color: Colors.text.secondary,
  },
  servicePriceRow: {
    marginBottom: 8,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    ...Colors.shadow.small,
  },
  addToCartText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  availabilityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  availabilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.success,
  },
  availabilityText: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '600' as const,
  },
  bottomSpacer: {
    height: 100,
  },
  floatingCategoryButton: {
    position: 'absolute' as const,
    bottom: 100,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  floatingButtonGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  categoryModal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
  },
  filterModal: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  categoryModalContent: {
    padding: 16,
    gap: 12,
  },
  modalCategoryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    ...Colors.shadow.small,
  },
  modalCategoryItemActive: {
    backgroundColor: Colors.primary,
  },
  modalCategoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCategoryIconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  modalCategoryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  modalCategoryTextActive: {
    color: Colors.text.inverse,
  },
  filterModalContent: {
    padding: 24,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 12,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  filterOption: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  filterOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  filterOptionTextActive: {
    color: Colors.text.inverse,
  },
  resetButton: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  },
  applyButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Colors.shadow.medium,
  },
  applyButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
});
