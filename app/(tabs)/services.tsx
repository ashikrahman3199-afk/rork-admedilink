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
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import {
  Search,
  TrendingUp,
} from 'lucide-react-native';
import Colors from '@/constants/colors';
import { adSpaces, categories, AdCategory } from '@/constants/adSpaces';

const { width } = Dimensions.get('window');

export default function ServicesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<AdCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpaces = adSpaces.filter(space => {
    const matchesCategory = selectedCategory === 'all' || space.category === selectedCategory;
    const matchesSearch = space.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         space.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Ad Services</Text>
        <Text style={styles.headerSubtitle}>Browse all advertising options</Text>

        <View style={styles.searchContainer}>
          <Search size={20} color={Colors.text.secondary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search services..."
            placeholderTextColor={Colors.text.tertiary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
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
            <Text style={styles.sectionSubtitle}>
              {selectedCategory === 'all' ? 'All Services' : categories.find(c => c.id === selectedCategory)?.name}
            </Text>
            <Text style={styles.resultCount}>{filteredSpaces.length} results</Text>
          </View>

          <View style={styles.servicesGrid}>
            {filteredSpaces.map(space => (
              <TouchableOpacity
                key={space.id}
                style={styles.serviceCard}
                onPress={() => router.push(`/service-detail?id=${space.id}`)}
              >
                <Image source={{ uri: space.image }} style={styles.serviceImage} />
                <View style={styles.serviceContent}>
                  <Text style={styles.serviceTitle} numberOfLines={2}>{space.title}</Text>
                  <Text style={styles.serviceLocation} numberOfLines={1}>{space.location}</Text>
                  <Text style={styles.serviceReach} numberOfLines={1}>{space.reach}</Text>
                  <View style={styles.serviceFooter}>
                    <View>
                      <Text style={styles.servicePrice}>₹{(space.price / 1000).toFixed(0)}K</Text>
                      <Text style={styles.servicePriceUnit}>per {space.priceUnit}</Text>
                    </View>
                    <View style={styles.availabilityBadge}>
                      <View style={styles.availabilityDot} />
                      <Text style={styles.availabilityText}>Available</Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
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
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  searchContainer: {
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
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    paddingHorizontal: 24,
    marginBottom: 16,
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
});
