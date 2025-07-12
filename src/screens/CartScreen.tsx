import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnimatedLogo } from '../components';
import { COLORS, Layout } from '../theme';

const { width } = Dimensions.get('window');

const CARD_RADIUS = 18;
const CARD_SHADOW = {
  shadowColor: COLORS.accent2,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

// Type definitions
interface CartItem {
  id: string;
  weight: number;
  qty: number;
  shortName: string;
  price: number;
  priceOff?: number;
  strikePrice?: number;
  badge?: string;
  productImages: any[];
}

interface CartContextType {
  cartItems: CartItem[];
  cartLoading: boolean;
  addToCart: (product: any, weight: number, qty?: number) => Promise<void>;
  removeFromCart: (productId: string, weight: number) => Promise<void>;
  updateQuantity: (productId: string, weight: number, newQty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCartItems: () => Promise<void>;
}

// Cart Context for live updates
const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [cartLoading, setCartLoading] = useState(true);

  const loadCartItems = async () => {
    try {
      const cartRaw = await AsyncStorage.getItem('cart');
      const cart = cartRaw ? JSON.parse(cartRaw) : [];
      // Validate cart items to ensure they have required properties
      const validCart = cart.filter((item: any) => 
        item && 
        item.id && 
        item.shortName && 
        typeof item.price === 'number' &&
        item.productImages && 
        Array.isArray(item.productImages)
      );
      setCartItems(validCart);
    } catch (error) {
      console.error('Error loading cart:', error);
      setCartItems([]);
    } finally {
      setCartLoading(false);
    }
  };

  const updateCart = async (newCart: CartItem[]) => {
    try {
      setCartItems(newCart);
      await AsyncStorage.setItem('cart', JSON.stringify(newCart));
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const addToCart = async (product: any, weight: number, qty = 1) => {
    try {
      // Validate product data
      if (!product || !product.id || !product.shortName || typeof product.price !== 'number') {
        throw new Error('Invalid product data');
      }

      const existing = cartItems.find(item => item.id === product.id && item.weight === weight);
      let newCart: CartItem[];

      if (existing) {
        newCart = cartItems.map(item =>
          item.id === product.id && item.weight === weight
            ? { ...item, qty: (item.qty || 1) + qty }
            : item
        );
      } else {
        newCart = [...cartItems, { ...product, weight, qty }];
      }

      await updateCart(newCart);
    } catch (error) {
      console.error('Error adding to cart:', error);
      throw error; // Re-throw to let the calling component handle it
    }
  };

  const removeFromCart = async (productId: string, weight: number) => {
    try {
      const newCart = cartItems.filter(item =>
        !(item.id === productId && item.weight === weight)
      );
      await updateCart(newCart);
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const updateQuantity = async (productId: string, weight: number, newQty: number) => {
    try {
      const newCart = cartItems.map(item =>
        item.id === productId && item.weight === weight
          ? { ...item, qty: newQty }
          : item
      );
      await updateCart(newCart);
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const clearCart = async () => {
    try {
      await updateCart([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  useEffect(() => {
    loadCartItems();
  }, []);

  return (
    <CartContext.Provider value={{
      cartItems,
      cartLoading,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      loadCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Cart Item Card Component
const CartItemCard = ({ 
  item, 
  onUpdateQuantity, 
  onRemove, 
  delay 
}: { 
  item: CartItem; 
  onUpdateQuantity: (productId: string, weight: number, newQty: number) => Promise<void>; 
  onRemove: (productId: string, weight: number) => Promise<void>; 
  delay: number; 
}) => (
  <Animatable.View
    animation="fadeInUp"
    delay={delay}
    duration={600}
    style={styles.cartItemWrapper}
  >
    <View style={styles.cartItemCard}>
      <Image
          source={item.productImages && item.productImages.length > 0 ? item.productImages[0] : require('../../assets/images/bananas.jpg')}
        style={styles.cartItemImage}
        resizeMode="cover"
      />
      {item.badge && (
        <View style={styles.cartItemBadge}>
          <Text style={styles.cartItemBadgeText}>{item.badge}</Text>
        </View>
      )}

      <View style={styles.cartItemContent}>
        <Text style={styles.cartItemName}>{item.shortName}</Text>
        {item.weight && (
          <Text style={styles.cartItemWeight}>{item.weight}g</Text>
        )}
        <Text style={styles.cartItemPrice}>
          ${item.priceOff ? item.priceOff : item.price}
        </Text>
        {item.priceOff && (
          <Text style={styles.cartItemStrikePrice}>${item.strikePrice}</Text>
        )}
      </View>

      <View style={styles.cartItemActions}>
        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => onUpdateQuantity(item.id, item.weight, Math.max(1, (item.qty || 1) - 1))}
            activeOpacity={0.7}
          >
            <Ionicons name="remove" size={16} color={COLORS.accent1} />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{item.qty || 1}</Text>
          <TouchableOpacity
            style={styles.quantityBtn}
            onPress={() => onUpdateQuantity(item.id, item.weight, (item.qty || 1) + 1)}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={16} color={COLORS.accent1} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeBtn}
          onPress={() => onRemove(item.id, item.weight)}
          activeOpacity={0.7}
        >
          <Ionicons name="trash-outline" size={20} color={COLORS.subtext2} />
        </TouchableOpacity>
      </View>
    </View>
  </Animatable.View>
);

const CartScreen = ({ navigation }: { navigation: any }) => {
  const { cartItems, cartLoading, updateQuantity, removeFromCart, clearCart } = useCart();

  // Add error boundary for cart operations
  const handleUpdateQuantity = async (productId: string, weight: number, newQty: number) => {
    try {
      await updateQuantity(productId, weight, newQty);
    } catch (error) {
      console.error('Error updating quantity:', error);
      Alert.alert('Error', 'Failed to update quantity. Please try again.');
    }
  };

  const handleRemoveFromCart = async (productId: string, weight: number) => {
    try {
      await removeFromCart(productId, weight);
    } catch (error) {
      console.error('Error removing from cart:', error);
      Alert.alert('Error', 'Failed to remove item. Please try again.');
    }
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to remove all items?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearCart
        }
      ]
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      const price = item.priceOff || item.price;
      return total + (price * (item.qty || 1));
    }, 0);
  };

  const total = calculateTotal();

  if (cartLoading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <AnimatedLogo size="medium" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Shopping Cart</Text>
        {cartItems.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} activeOpacity={0.7}>
            <Text style={styles.clearCartText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>

      {cartItems.length === 0 ? (
        // Empty Cart State
        <View style={styles.emptyContainer}>
          <Animatable.View animation="fadeInUp" delay={200}>
            <View style={styles.emptyIconContainer}>
              <Ionicons name="cart-outline" size={80} color={COLORS.subtext2} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Start shopping to add items to your cart
            </Text>
            <TouchableOpacity
              style={styles.shopNowBtn}
              onPress={() => navigation.navigate('Home')}
              activeOpacity={0.7}
            >
              <LinearGradient
                colors={[COLORS.accent1, COLORS.accent2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.shopNowGradient}
              >
                <Text style={styles.shopNowText}>Start Shopping</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Animatable.View>
        </View>
      ) : (
        // Cart Items List
        <View style={styles.cartContainer}>
          <FlatList
            data={cartItems}
            keyExtractor={(item, index) => `${item.id}-${item.weight}-${index}`}
            contentContainerStyle={{ paddingBottom: 300, paddingTop: 12 }}
            renderItem={({ item, index }) => (
              <CartItemCard
                item={item}
                onUpdateQuantity={handleUpdateQuantity}
                onRemove={handleRemoveFromCart}
                delay={100 + index * 60}
              />
            )}
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            bounces={true}
            alwaysBounceVertical={true}
            scrollEventThrottle={16}
            removeClippedSubviews={false}
            keyboardShouldPersistTaps="handled"
            getItemLayout={(data, index) => ({
              length: 112, // Approximate height of each cart item
              offset: 112 * index,
              index,
            })}
          />

          {/* Scroll Indicator Overlay */}
          {cartItems.length > 3 && (
            <View style={styles.scrollIndicatorOverlay} />
          )}
          
          {/* Cart Summary */}
          <View style={styles.cartSummary}>
            {/* <View style={styles.cartSummaryOverlay} /> */}
            <LinearGradient
              colors={[COLORS.white, COLORS.background]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={styles.cartSummaryGradient}
            >
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>${total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>
              
              <TouchableOpacity
                style={styles.checkoutBtn}
                onPress={() => Alert.alert('Checkout', 'Proceed to checkout functionality would go here')}
                activeOpacity={0.7}
              >
                <LinearGradient
                  colors={[COLORS.accent1, COLORS.accent2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.checkoutGradient}
                >
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
  },
  clearCartText: {
    fontSize: 14,
    color: COLORS.subtext2,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: COLORS.subtext,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  shopNowBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    width: '100%',
  },
  shopNowGradient: {
    padding: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  shopNowText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
  cartContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: COLORS.background,
  },
  scrollIndicator: {
    backgroundColor: COLORS.accent1,
    width: 4,
    borderRadius: 2,
  },
  scrollIndicatorOverlay: {
    position: 'absolute',
    bottom: Layout.tabBarHeight + 200,
    left: 0,
    right: 0,
    height: 40,
    backgroundColor: 'transparent',
    zIndex: 5,
  },
  cartItemWrapper: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  cartItemCard: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    padding: 16,
    ...CARD_SHADOW,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartItemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
  },
  cartItemBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: COLORS.accent1,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    zIndex: 2,
  },
  cartItemBadgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 10,
  },
  cartItemContent: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginBottom: 4,
  },
  cartItemWeight: {
    fontSize: 14,
    color: COLORS.subtext,
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.accent1,
  },
  cartItemStrikePrice: {
    fontSize: 14,
    color: COLORS.subtext2,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  cartItemActions: {
    alignItems: 'center',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 20,
    paddingHorizontal: 8,
    marginBottom: 8,
  },
  quantityBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...CARD_SHADOW,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark,
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeBtn: {
    padding: 8,
  },
  cartSummary: {
    position: 'absolute',
    bottom: Layout.tabBarHeight + 20, // Proper spacing from tab bar
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 20,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    zIndex: 10,
    minHeight: 180, // Ensure minimum height for consistent spacing
  },
  cartSummaryGradient: {
    flex: 1,
    borderRadius: 20,
  },
  cartSummaryOverlay: {
    position: 'absolute',
    top: -20,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(244, 246, 248, 0.8)',
    zIndex: -1,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 16,
    color: COLORS.dark,
    fontWeight: '600',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    color: COLORS.dark,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 20,
    color: COLORS.accent1,
    fontWeight: '700',
  },
  checkoutBtn: {
    borderRadius: 24,
    overflow: 'hidden',
    marginTop: 16,
  },
  checkoutGradient: {
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkoutText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.2,
  },
});

export default CartScreen; 