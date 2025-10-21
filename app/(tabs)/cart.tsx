import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ColorValue,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { useApp } from '@/contexts/AppContext';

export default function CartScreen() {
  const { cart, removeFromCart, updateCartItemDuration, cartTotal, clearCart } = useApp();

  if (cart.length === 0) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ title: 'Cart', headerShown: true }} />
        <View style={styles.emptyContainer}>
          <ShoppingBag size={80} color={Colors.text.tertiary} strokeWidth={1.5} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>Add ad spaces to get started</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Cart',
          headerShown: true,
          headerRight: () => (
            <TouchableOpacity onPress={clearCart} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Clear All</Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.itemsContainer}>
          {cart.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemContent}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemTitle} numberOfLines={1}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={() => removeFromCart(item.id)}
                    style={styles.deleteButton}
                  >
                    <Trash2 size={18} color={Colors.error} />
                  </TouchableOpacity>
                </View>
                <Text style={styles.itemLocation} numberOfLines={1}>{item.location}</Text>
                <Text style={styles.itemCategory}>{item.category}</Text>
                
                <View style={styles.itemFooter}>
                  <View>
                    <Text style={styles.itemPrice}>₹{item.price.toLocaleString('en-IN')}</Text>
                    <Text style={styles.itemPriceUnit}>per {item.priceUnit}</Text>
                  </View>
                  
                  <View style={styles.durationControl}>
                    <TouchableOpacity
                      style={styles.durationButton}
                      onPress={() => updateCartItemDuration(item.id, Math.max(1, item.duration - 1))}
                    >
                      <Minus size={16} color={Colors.primary} />
                    </TouchableOpacity>
                    <View style={styles.durationDisplay}>
                      <Text style={styles.durationText}>{item.duration}</Text>
                      <Text style={styles.durationUnit}>{item.priceUnit}s</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.durationButton}
                      onPress={() => updateCartItemDuration(item.id, item.duration + 1)}
                    >
                      <Plus size={16} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.itemTotal}>
                  <Text style={styles.itemTotalLabel}>Subtotal:</Text>
                  <Text style={styles.itemTotalPrice}>
                    ₹{(item.price * item.duration * item.quantity).toLocaleString('en-IN')}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Items ({cart.length})</Text>
            <Text style={styles.summaryValue}>₹{cartTotal.toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Platform Fee</Text>
            <Text style={styles.summaryValue}>₹{(cartTotal * 0.05).toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>GST (18%)</Text>
            <Text style={styles.summaryValue}>₹{(cartTotal * 0.18).toLocaleString('en-IN')}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>
              ₹{(cartTotal * 1.23).toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View>
            <Text style={styles.footerLabel}>Total</Text>
            <Text style={styles.footerPrice}>₹{(cartTotal * 1.23).toLocaleString('en-IN')}</Text>
          </View>
          <TouchableOpacity style={styles.checkoutButton} onPress={() => router.push('/booking')}>
            <LinearGradient
              colors={Colors.gradient.primary as unknown as readonly [ColorValue, ColorValue, ...ColorValue[]]}
              style={styles.checkoutGradient}
            >
              <Text style={styles.checkoutText}>Proceed to Checkout</Text>
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
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 48,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginTop: 24,
  },
  emptySubtitle: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginTop: 8,
    textAlign: 'center' as const,
  },
  clearButton: {
    marginRight: 16,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.error,
  },
  itemsContainer: {
    gap: 16,
  },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    ...Colors.shadow.small,
  },
  itemImage: {
    width: 100,
    height: '100%',
    minHeight: 180,
  },
  itemContent: {
    flex: 1,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginRight: 8,
  },
  deleteButton: {
    padding: 4,
  },
  itemLocation: {
    fontSize: 13,
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  itemCategory: {
    fontSize: 12,
    color: Colors.text.tertiary,
    textTransform: 'capitalize' as const,
    marginBottom: 12,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.primary,
  },
  itemPriceUnit: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  durationControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  durationButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  durationDisplay: {
    alignItems: 'center',
    minWidth: 50,
  },
  durationText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  durationUnit: {
    fontSize: 11,
    color: Colors.text.secondary,
  },
  itemTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
  },
  itemTotalLabel: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.secondary,
  },
  itemTotalPrice: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 20,
    marginTop: 24,
    ...Colors.shadow.medium,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text.primary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  },
  totalValue: {
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
  checkoutButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...Colors.shadow.medium,
  },
  checkoutGradient: {
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: Colors.text.inverse,
  },
});
