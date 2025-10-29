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
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import {
  Search,
  MapPin,
  Bell,
  Star,
  TrendingUp,
  Sparkles,
  Monitor,
  Newspaper,
  Radio,
  Film,
  Users as UsersIcon,
  ShoppingCart,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adSpaces, categories, AdCategory } from '@/constants/adSpaces';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { unreadNotificationCount, selectedLocation, addToCart } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | 'all' | 'events'>('all');
  const lastScrollY = useRef(0);
  const headerTranslateY = useRef(new Animated.Value(0)).current;

  const filteredSpaces = adSpaces.filter(space => {
    const matchesCategory = selectedCategory === 'all' || space.category === selectedCategory;
    return matchesCategory;
  });

  const hotPicks = adSpaces.filter(space => space.rating >= 4.7).slice(0, 3);
  
  const whatsNew = [
    { id: 'custom-bundle', title: 'Create Custom Bundle', type: 'Service', route: '/custom-bundle', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600', serviceId: null },
    { id: '1', title: 'Premium Billboard - MG Road', type: 'New Launch', image: 'https://images.unsplash.com/photo-1567550009969-c1fa9a26b8c6?w=800&h=600', serviceId: '1' },
    { id: '3', title: 'Digital Display - VR Mall', type: 'Hot Deal', image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=600', serviceId: '6' },
    { id: '4', title: 'Cinema Advertising Package', type: 'Featured', image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=600', serviceId: '8' },
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - lastScrollY.current;

    if (currentScrollY <= 0) {
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    } else if (scrollDiff > 0 && currentScrollY > 50) {
      Animated.spring(headerTranslateY, {
        toValue: -120,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    } else if (scrollDiff < -5) {
      Animated.spring(headerTranslateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 10,
      }).start();
    }

    lastScrollY.current = currentScrollY;
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <Animated.View style={[{ transform: [{ translateY: headerTranslateY }] }]}>
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

        <Text style={styles.headerTitle}>Find Perfect{'\n'}Ad Spaces</Text>
        </LinearGradient>
      </Animated.View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>What&apos;s New</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.whatsNewContainer}
          >
            {whatsNew.map(item => (
              <TouchableOpacity
                key={item.id}
                style={styles.whatsNewCard}
                onPress={() => {
                  if (item.route) {
                    router.push(item.route as any);
                  } else if (item.serviceId) {
                    router.push(`/service-detail?id=${item.serviceId}`);
                  }
                }}
              >
                <Image source={{ uri: item.image }} style={styles.whatsNewImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.9)']}
                  style={styles.whatsNewGradient}
                >
                  <View style={styles.whatsNewBadge}>
                    <Text style={styles.whatsNewBadgeText}>{item.type}</Text>
                  </View>
                  <Text style={styles.whatsNewTitle}>{item.title}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Categories</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                setSelectedCategory('all');
                router.push('/(tabs)/services');
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'all' && styles.categoryIconCircleActive,
              ]}>
                <TrendingUp size={28} color={selectedCategory === 'all' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'all' && styles.categoryNameActive,
              ]}>All</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                router.push({ pathname: '/(tabs)/services', params: { category: 'billboards' } });
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'billboards' && styles.categoryIconCircleActive,
              ]}>
                <Monitor size={28} color={selectedCategory === 'billboards' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'billboards' && styles.categoryNameActive,
              ]}>Billboards</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                router.push({ pathname: '/(tabs)/services', params: { category: 'print' } });
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'print' && styles.categoryIconCircleActive,
              ]}>
                <Newspaper size={28} color={selectedCategory === 'print' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'print' && styles.categoryNameActive,
              ]}>Print</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                router.push({ pathname: '/(tabs)/services', params: { category: 'digital' } });
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'digital' && styles.categoryIconCircleActive,
              ]}>
                <Monitor size={28} color={selectedCategory === 'digital' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'digital' && styles.categoryNameActive,
              ]}>Digital</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                router.push({ pathname: '/(tabs)/services', params: { category: 'radio' } });
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'radio' && styles.categoryIconCircleActive,
              ]}>
                <Radio size={28} color={selectedCategory === 'radio' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'radio' && styles.categoryNameActive,
              ]}>Radio</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                router.push({ pathname: '/(tabs)/services', params: { category: 'cinema' } });
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'cinema' && styles.categoryIconCircleActive,
              ]}>
                <Film size={28} color={selectedCategory === 'cinema' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'cinema' && styles.categoryNameActive,
              ]}>Cinema</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.categoryCard}
              onPress={() => {
                router.push({ pathname: '/(tabs)/services', params: { category: 'events' } });
              }}
            >
              <View style={[
                styles.categoryIconCircle,
                selectedCategory === 'events' && styles.categoryIconCircleActive,
              ]}>
                <UsersIcon size={28} color={selectedCategory === 'events' ? Colors.text.inverse : Colors.primary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'events' && styles.categoryNameActive,
              ]}>Events</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hot Picks for You!</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.hotPicksContainer}
          >
            {hotPicks.map(space => (
              <TouchableOpacity
                key={space.id}
                style={styles.hotPickCard}
                onPress={() => router.push(`/service-detail?id=${space.id}`)}
              >
                <Image source={{ uri: space.image }} style={styles.hotPickImage} />
                <LinearGradient
                  colors={['transparent', 'rgba(0,0,0,0.8)']}
                  style={styles.hotPickGradient}
                >
                  <View style={styles.hotPickInfo}>
                    <Text style={styles.hotPickTitle} numberOfLines={1}>{space.title}</Text>
                    <View style={styles.hotPickMeta}>
                      <MapPin size={12} color={Colors.text.inverse} />
                      <Text style={styles.hotPickLocation} numberOfLines={1}>{space.location}</Text>
                    </View>
                    <View style={styles.hotPickFooter}>
                      <View style={styles.hotPickPriceRow}>
                        <Text style={styles.hotPickPrice}>₹{(space.price / 1000).toFixed(0)}K/{space.priceUnit}</Text>
                        <View style={styles.ratingContainer}>
                          <Star size={12} color={Colors.accent} fill={Colors.accent} />
                          <Text style={styles.ratingText}>{space.rating}</Text>
                        </View>
                      </View>
                      <TouchableOpacity 
                        style={styles.viewBookButton}
                        onPress={(e) => {
                          e.stopPropagation();
                          addToCart(space, 1);
                        }}
                      >
                        <ShoppingCart size={14} color={Colors.text.inverse} />
                        <Text style={styles.viewBookText}>Add</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Ad Spaces' : categories.find(c => c.id === selectedCategory)?.name}
            </Text>
            <Text style={styles.resultCount}>{filteredSpaces.length} results</Text>
          </View>
          {filteredSpaces.map(space => (
              <TouchableOpacity
                key={space.id}
                style={styles.adSpaceCard}
                onPress={() => router.push(`/service-detail?id=${space.id}`)}
              >
                <Image source={{ uri: space.image }} style={styles.adSpaceImage} />
                <View style={styles.adSpaceContent}>
                  <View style={styles.adSpaceHeader}>
                    <Text style={styles.adSpaceTitle} numberOfLines={1}>{space.title}</Text>
                    <View style={styles.ratingContainer}>
                      <Star size={14} color={Colors.accent} fill={Colors.accent} />
                      <Text style={styles.adSpaceRating}>{space.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.adSpaceLocation}>
                    <MapPin size={14} color={Colors.text.secondary} />
                    <Text style={styles.adSpaceLocationText} numberOfLines={1}>{space.location}</Text>
                  </View>
                  <Text style={styles.adSpaceReach}>{space.reach}</Text>
                  <View style={styles.adSpaceFooter}>
                    <View>
                      <Text style={styles.adSpacePrice}>₹{space.price.toLocaleString('en-IN')}</Text>
                      <Text style={styles.adSpacePriceUnit}>per {space.priceUnit}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.addCartButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        addToCart(space, 1);
                      }}
                    >
                      <ShoppingCart size={14} color={Colors.text.inverse} />
                      <Text style={styles.addCartText}>Add</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
          ))}
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <TouchableOpacity
        style={styles.aiFab}
        onPress={() => router.push('/ai-recommendations')}
      >
        <LinearGradient
          colors={['#8B5CF6', '#6366F1'] as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
          style={styles.aiFabGradient}
        >
          <Sparkles size={24} color={Colors.text.inverse} />
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
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
  searchIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
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
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 24,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.primary,
  },
  resultCount: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  whatsNewContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  whatsNewCard: {
    width: CARD_WIDTH * 0.75,
    height: 180,
    borderRadius: 20,
    overflow: 'hidden',
    ...Colors.shadow.medium,
  },
  whatsNewImage: {
    width: '100%',
    height: '100%',
  },
  whatsNewGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  whatsNewBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: Colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  whatsNewBadgeText: {
    fontSize: 11,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  whatsNewTitle: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  categoryCard: {
    alignItems: 'center',
    gap: 8,
  },
  categoryIconCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: `${Colors.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.small,
  },
  categoryIconCircleActive: {
    backgroundColor: Colors.primary,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  categoryNameActive: {
    color: Colors.primary,
  },
  hotPicksContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  hotPickCard: {
    width: CARD_WIDTH * 0.7,
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    ...Colors.shadow.medium,
  },
  hotPickImage: {
    width: '100%',
    height: '100%',
  },
  hotPickGradient: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    justifyContent: 'flex-end',
    padding: 16,
  },
  hotPickInfo: {
    gap: 4,
  },
  hotPickTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  hotPickMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  hotPickLocation: {
    fontSize: 12,
    color: Colors.text.inverse,
    opacity: 0.9,
  },
  hotPickFooter: {
    marginTop: 8,
    gap: 8,
  },
  hotPickPriceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  hotPickPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.accent,
  },
  viewBookButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 12,
  },
  viewBookText: {
    fontSize: 13,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text.inverse,
  },
  adSpaceCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    marginHorizontal: 24,
    marginBottom: 16,
    overflow: 'hidden',
    ...Colors.shadow.small,
  },
  adSpaceImage: {
    width: 120,
    height: 140,
  },
  adSpaceContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  adSpaceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 8,
  },
  adSpaceTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  adSpaceRating: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  adSpaceLocation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  adSpaceLocationText: {
    fontSize: 13,
    color: Colors.text.secondary,
    flex: 1,
  },
  adSpaceReach: {
    fontSize: 12,
    color: Colors.text.tertiary,
  },
  adSpaceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  adSpacePrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  adSpacePriceUnit: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  addCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 10,
    ...Colors.shadow.small,
  },
  addCartText: {
    fontSize: 12,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
  bottomSpacer: {
    height: 100,
  },
  aiFab: {
    position: 'absolute' as const,
    bottom: 100,
    right: 24,
    borderRadius: 28,
    overflow: 'hidden',
    ...Colors.shadow.large,
  },
  aiFabGradient: {
    width: 56,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
