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
  Plus,
  Minus,
  Package,
  DollarSign,
  Calendar,
  ShoppingCart,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';
import { categories } from '@/constants/adSpaces';

interface BundleItem {
  id: string;
  category: string;
  quantity: number;
  duration: number;
  estimatedCost: number;
}

export default function CustomBundleScreen() {
  const insets = useSafeAreaInsets();
  const { addToCart } = useApp();
  const [bundleName, setBundleName] = useState('');
  const [bundleItems, setBundleItems] = useState<BundleItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  const addBundleItem = (category: string) => {
    const newItem: BundleItem = {
      id: Date.now().toString(),
      category,
      quantity: 1,
      duration: 1,
      estimatedCost: getCategoryBaseCost(category),
    };
    setBundleItems([...bundleItems, newItem]);
    setSelectedCategory('');
  };

  const removeBundleItem = (id: string) => {
    setBundleItems(bundleItems.filter(item => item.id !== id));
  };

  const updateItemQuantity = (id: string, quantity: number) => {
    setBundleItems(bundleItems.map(item =>
      item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
    ));
  };

  const updateItemDuration = (id: string, duration: number) => {
    setBundleItems(bundleItems.map(item =>
      item.id === id ? { ...item, duration: Math.max(1, duration) } : item
    ));
  };

  const getCategoryBaseCost = (category: string): number => {
    const costs: Record<string, number> = {
      billboards: 50000,
      print: 85000,
      digital: 35000,
      radio: 25000,
      cinema: 150000,
      influencers: 80000,
    };
    return costs[category] || 50000;
  };

  const calculateTotal = () => {
    return bundleItems.reduce((sum, item) => {
      return sum + (item.estimatedCost * item.quantity * item.duration);
    }, 0);
  };

  const handleAddToCart = () => {
    console.log('Adding custom bundle to cart:', { bundleName, bundleItems });
    router.back();
  };

  const availableCategories = categories.filter(
    cat => !bundleItems.some(item => item.category === cat.id)
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.safeBackground} />
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={Colors.text.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Custom Ad Bundle</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bundle Details</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Bundle Name</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Complete Marketing Package"
              placeholderTextColor={Colors.text.tertiary}
              value={bundleName}
              onChangeText={setBundleName}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Select Ad Types</Text>
          <Text style={styles.sectionDescription}>
            Choose different advertising mediums for your custom bundle
          </Text>

          {bundleItems.length === 0 ? (
            <View style={styles.emptyState}>
              <Package size={48} color={Colors.text.tertiary} strokeWidth={1.5} />
              <Text style={styles.emptyStateText}>No items added yet</Text>
              <Text style={styles.emptyStateSubtext}>
                Start building your custom bundle by selecting ad types below
              </Text>
            </View>
          ) : (
            <View style={styles.bundleItems}>
              {bundleItems.map(item => {
                const category = categories.find(c => c.id === item.category);
                return (
                  <View key={item.id} style={styles.bundleItem}>
                    <View style={styles.bundleItemHeader}>
                      <View style={styles.bundleItemInfo}>
                        <Text style={styles.bundleItemTitle}>{category?.name}</Text>
                        <Text style={styles.bundleItemCost}>
                          ₹{item.estimatedCost.toLocaleString('en-IN')} base cost
                        </Text>
                      </View>
                      <TouchableOpacity
                        onPress={() => removeBundleItem(item.id)}
                        style={styles.removeButton}
                      >
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={styles.bundleItemControls}>
                      <View style={styles.controlGroup}>
                        <Text style={styles.controlLabel}>Quantity</Text>
                        <View style={styles.controlButtons}>
                          <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => updateItemQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus size={16} color={Colors.primary} />
                          </TouchableOpacity>
                          <Text style={styles.controlValue}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => updateItemQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus size={16} color={Colors.primary} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={styles.controlGroup}>
                        <Text style={styles.controlLabel}>Duration (weeks)</Text>
                        <View style={styles.controlButtons}>
                          <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => updateItemDuration(item.id, item.duration - 1)}
                          >
                            <Minus size={16} color={Colors.primary} />
                          </TouchableOpacity>
                          <Text style={styles.controlValue}>{item.duration}</Text>
                          <TouchableOpacity
                            style={styles.controlButton}
                            onPress={() => updateItemDuration(item.id, item.duration + 1)}
                          >
                            <Plus size={16} color={Colors.primary} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                    <View style={styles.bundleItemFooter}>
                      <Text style={styles.bundleItemSubtotalLabel}>Subtotal</Text>
                      <Text style={styles.bundleItemSubtotal}>
                        ₹{(item.estimatedCost * item.quantity * item.duration).toLocaleString('en-IN')}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          {availableCategories.length > 0 && (
            <View style={styles.addSection}>
              <Text style={styles.addSectionTitle}>Add More</Text>
              <View style={styles.categoryGrid}>
                {availableCategories.map(category => (
                  <TouchableOpacity
                    key={category.id}
                    style={styles.categoryCard}
                    onPress={() => addBundleItem(category.id)}
                  >
                    <View style={styles.categoryIcon}>
                      <Plus size={20} color={Colors.primary} />
                    </View>
                    <Text style={styles.categoryName}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>

        {bundleItems.length > 0 && (
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Package size={20} color={Colors.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Total Items</Text>
                <Text style={styles.summaryValue}>{bundleItems.length}</Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <Calendar size={20} color={Colors.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Avg. Duration</Text>
                <Text style={styles.summaryValue}>
                  {Math.round(bundleItems.reduce((sum, item) => sum + item.duration, 0) / bundleItems.length)} weeks
                </Text>
              </View>
            </View>

            <View style={styles.summaryRow}>
              <View style={styles.summaryIconContainer}>
                <DollarSign size={20} color={Colors.primary} />
              </View>
              <View style={styles.summaryInfo}>
                <Text style={styles.summaryLabel}>Estimated Total</Text>
                <Text style={styles.summaryTotal}>
                  ₹{calculateTotal().toLocaleString('en-IN')}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {bundleItems.length > 0 && (
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View>
              <Text style={styles.footerLabel}>Estimated Total</Text>
              <Text style={styles.footerPrice}>
                ₹{calculateTotal().toLocaleString('en-IN')}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddToCart}
              disabled={!bundleName.trim()}
            >
              <LinearGradient
                colors={
                  bundleName.trim()
                    ? (Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]])
                    : ['#ccc', '#999'] as readonly [ColorValue, ColorValue, ...ColorValue[]]
                }
                style={styles.addGradient}
              >
                <ShoppingCart size={20} color={Colors.text.inverse} />
                <Text style={styles.addText}>Add to Cart</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginBottom: 24,
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
    marginBottom: 16,
    lineHeight: 20,
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
  emptyState: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 48,
    alignItems: 'center',
    gap: 12,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: Colors.text.secondary,
    textAlign: 'center' as const,
  },
  bundleItems: {
    gap: 16,
    marginBottom: 24,
  },
  bundleItem: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    gap: 16,
    ...Colors.shadow.small,
  },
  bundleItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bundleItemInfo: {
    flex: 1,
  },
  bundleItemTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 4,
  },
  bundleItemCost: {
    fontSize: 13,
    color: Colors.text.secondary,
  },
  removeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: Colors.error + '20',
  },
  removeButtonText: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  bundleItemControls: {
    flexDirection: 'row',
    gap: 16,
  },
  controlGroup: {
    flex: 1,
    gap: 8,
  },
  controlLabel: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  },
  controlButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: 10,
    padding: 8,
  },
  controlButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  controlValue: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    minWidth: 40,
    textAlign: 'center' as const,
  },
  bundleItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  bundleItemSubtotalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  },
  bundleItemSubtotal: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  addSection: {
    gap: 12,
  },
  addSectionTitle: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  categoryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryName: {
    fontSize: 13,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    textAlign: 'center' as const,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    gap: 16,
    ...Colors.shadow.medium,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  summaryIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  summaryTotal: {
    fontSize: 20,
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
  footerPrice: {
    fontSize: 20,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  addButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  addGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    gap: 8,
  },
  addText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
});
