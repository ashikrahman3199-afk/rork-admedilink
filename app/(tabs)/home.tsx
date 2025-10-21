import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  ColorValue,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useRouter } from 'expo-router';
import {
  Search,
  MapPin,
  Bell,
  Plus,
  Star,
  TrendingUp,
  Sparkles,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adSpaces, categories, AdCategory } from '@/constants/adSpaces';
import { useApp } from '@/contexts/AppContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 48;

export default function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { addToCart, cartItemCount, unreadNotificationCount, selectedLocation } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpaces = adSpaces.filter(space => {
    const matchesCategory = selectedCategory === 'all' || space.category === selectedCategory;
    const matchesSearch = space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         space.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const hotPicks = adSpaces.filter(space => space.rating >= 4.7).slice(0, 3);

  const handleAddToCart = (space: typeof adSpaces[0]) => {
    addToCart(space, 1);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
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
          <TouchableOpacity 
            style={styles.notificationButton}
            onPress={() => router.push('/notifications')}
          >
            <Bell size={24} color={Colors.text.inverse} />
            {unreadNotificationCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadNotificationCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <Text style={styles.headerTitle}>Find Perfect{'\n'}Ad Spaces</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search billboards, media..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </LinearGradient>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
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
              style={[
                styles.categoryCard,
                selectedCategory === 'all' && styles.categoryCardActive,
              ]}
              onPress={() => setSelectedCategory('all')}
            >
              <View style={styles.categoryIconContainer}>
                <TrendingUp size={24} color={selectedCategory === 'all' ? Colors.primary : Colors.text.secondary} />
              </View>
              <Text style={[
                styles.categoryName,
                selectedCategory === 'all' && styles.categoryNameActive,
              ]}>All</Text>
            </TouchableOpacity>
            {categories.map(category => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryCard,
                  selectedCategory === category.id && styles.categoryCardActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
              >
                <View style={styles.categoryIconContainer}>
                  <Text style={styles.categoryEmoji}>
                    {category.id === 'billboards' ? '📊' :
                     category.id === 'print' ? '📰' :
                     category.id === 'digital' ? '📱' :
                     category.id === 'radio' ? '📻' :
                     category.id === 'cinema' ? '🎬' : '👥'}
                  </Text>
                </View>
                <Text style={[
                  styles.categoryName,
                  selectedCategory === category.id && styles.categoryNameActive,
                ]}>{category.name}</Text>
              </TouchableOpacity>
            ))}
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
                onPress={() => console.log('View ad space:', space.id)}
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
                      <Text style={styles.hotPickPrice}>₹{(space.price / 1000).toFixed(0)}K/{space.priceUnit}</Text>
                      <View style={styles.ratingContainer}>
                        <Star size={12} color={Colors.accent} fill={Colors.accent} />
                        <Text style={styles.ratingText}>{space.rating}</Text>
                      </View>
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
              onPress={() => console.log('View ad space:', space.id)}
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
                    style={styles.addButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      handleAddToCart(space);
                    }}
                  >
                    <Plus size={20} color={Colors.text.inverse} />
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
    marginBottom: 20,
    lineHeight: 38,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
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
  categoriesContainer: {
    paddingHorizontal: 24,
    gap: 12,
  },
  categoryCard: {
    alignItems: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    ...Colors.shadow.small,
  },
  categoryCardActive: {
    backgroundColor: Colors.primary,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryName: {
    fontSize: 12,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  categoryNameActive: {
    color: Colors.text.inverse,
  },
  hotPicksContainer: {
    paddingHorizontal: 24,
    gap: 16,
  },
  hotPickCard: {
    width: CARD_WIDTH * 0.7,
    height: 200,
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
    height: '60%',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  hotPickPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.accent,
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Colors.shadow.small,
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
