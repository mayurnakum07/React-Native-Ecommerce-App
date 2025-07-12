import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image, ScrollView, ToastAndroid, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useCart } from './CartScreen';
import { products } from '../data/products';
import { COLORS } from '../theme';

const { width } = Dimensions.get('window');

const CARD_RADIUS = 18;
const CARD_SHADOW = {
  shadowColor: COLORS.accent2,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 4,
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { productId } = route.params;
  const product = products.find(p => p.id === productId);
  const { addToCart } = useCart();
  if (!product) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <LinearGradient
            colors={[COLORS.accent1, COLORS.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.backButtonGradient}
          >
            <Ionicons name="chevron-back" size={26} color={COLORS.white} />
          </LinearGradient>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: COLORS.dark, fontSize: 18, fontWeight: '600' }}>Product not found.</Text>
        </View>
      </SafeAreaView>
    );
  }
  const [selectedWeight, setSelectedWeight] = useState(product.weight[0]);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      await addToCart(product, selectedWeight, 1);
      navigation.navigate('Main', { screen: 'Cart' });
    } catch (e) {
      Alert.alert('Error', 'Could not add to cart.');
    } finally {
      setAdding(false);
    }
  };

  const discount = product.priceOff && product.strikePrice ? Math.round(100 - (product.priceOff / product.strikePrice) * 100) : null;

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[COLORS.accent1, COLORS.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backButtonGradient}
        >
          <Ionicons name="chevron-back" size={26} color={COLORS.white} />
        </LinearGradient>
      </TouchableOpacity>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Swiper */}
        <View style={styles.swiperContainer}>
          <Swiper
            showsPagination={true}
            dotColor={COLORS.subtext2}
            activeDotColor={COLORS.accent1}
            height={260}
            loop
            autoplay
            autoplayTimeout={4}
            containerStyle={{ borderRadius: CARD_RADIUS, overflow: 'hidden' }}
          >
            {product.productImages.map((img, idx) => (
              <Image
                key={idx}
                source={img}
                style={styles.productImage}
                resizeMode="cover"
              />
            ))}
          </Swiper>
        </View>
        {/* Name, badge, shortName */}
        <View style={styles.headerRow}>
          <Text style={styles.productName}>{product.name}</Text>
          {product.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
        </View>
        <Text style={styles.shortName}>{product.shortName}</Text>
        {/* Rating, reviews */}
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={18} color={COLORS.accent1} />
          <Text style={styles.rating}>{product.rating}</Text>
          <Text style={styles.review}>({product.review} reviews)</Text>
        </View>
        {/* Price, strike, discount */}
        <View style={styles.priceRow}>
          <Text style={styles.price}>${product.priceOff ? product.priceOff : product.price}</Text>
          {product.priceOff && (
            <Text style={styles.strikePrice}>${product.strikePrice}</Text>
          )}
          {discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>-{discount}%</Text>
            </View>
          )}
        </View>
        {/* Description */}
        <Text style={styles.description}>{product.shortDescription}</Text>
        {/* Weight Selector */}
        <View style={styles.weightRow}>
          <Text style={styles.weightLabel}>Weight:</Text>
          {product.weight.map(w => (
            <TouchableOpacity
              key={w}
              style={[styles.weightBtn, selectedWeight === w && styles.weightBtnActive]}
              onPress={() => setSelectedWeight(w)}
              activeOpacity={0.85}
            >
              <Text style={[styles.weightBtnText, selectedWeight === w && styles.weightBtnTextActive]}>{w}g</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Metadata */}
        <View style={styles.metaRow}>
          <Text style={styles.meta}><Text style={styles.metaLabel}>Type:</Text> {product.type}</Text>
          <Text style={styles.meta}><Text style={styles.metaLabel}>SKU:</Text> {product.SKU}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}><Text style={styles.metaLabel}>MFG:</Text> {product.MFG}</Text>
          <Text style={styles.meta}><Text style={styles.metaLabel}>Life:</Text> {product.life}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}><Text style={styles.metaLabel}>Tags:</Text> {product.Tags.join(', ')}</Text>
        </View>
        <View style={styles.metaRow}>
          <Text style={styles.meta}><Text style={styles.metaLabel}>Stock:</Text> {product.stock}</Text>
        </View>
      </ScrollView>
      {/* Add to Cart Button */}
      <View style={styles.addToCartWrapper}>
        <TouchableOpacity
          style={styles.addToCartBtn}
          onPress={handleAddToCart}
          activeOpacity={0.85}
          disabled={adding}
        >
          <LinearGradient
            colors={[COLORS.accent1, COLORS.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.addToCartGradient}
          >
            <Text style={styles.addToCartText}>{adding ? 'Adding...' : 'Add to Cart'}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 16,
  },
  swiperContainer: {
    height: 260,
    borderRadius: CARD_RADIUS,
    marginBottom: 18,
    overflow: 'hidden',
  },
  productImage: {
    width: '100%',
    height: 260,
    borderRadius: CARD_RADIUS,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.dark,
    flex: 1,
  },
  badge: {
    backgroundColor: COLORS.accent1,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginLeft: 8,
  },
  badgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  shortName: {
    fontSize: 16,
    color: COLORS.subtext,
    fontWeight: '600',
    marginBottom: 4,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  rating: {
    color: COLORS.accent1,
    fontWeight: '700',
    fontSize: 15,
    marginLeft: 2,
  },
  review: {
    color: COLORS.subtext2,
    fontSize: 13,
    marginLeft: 6,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    color: COLORS.accent1,
    fontWeight: '700',
    fontSize: 22,
    marginRight: 10,
  },
  strikePrice: {
    color: COLORS.subtext2,
    fontSize: 16,
    textDecorationLine: 'line-through',
    fontWeight: '500',
    marginRight: 10,
  },
  discountBadge: {
    backgroundColor: COLORS.accent2,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  discountText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  description: {
    fontSize: 15,
    color: COLORS.dark,
    marginBottom: 10,
    fontWeight: '400',
  },
  weightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  weightLabel: {
    fontSize: 15,
    color: COLORS.subtext,
    fontWeight: '600',
    marginRight: 10,
  },
  weightBtn: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: COLORS.border,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 7,
    ...CARD_SHADOW,
  },
  weightBtnActive: {
    borderColor: COLORS.accent1,
    backgroundColor: COLORS.accent2,
  },
  weightBtnText: {
    color: COLORS.dark,
    fontWeight: '600',
    fontSize: 15,
  },
  weightBtnTextActive: {
    color: COLORS.white,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  meta: {
    fontSize: 14,
    color: COLORS.subtext,
    marginRight: 18,
    marginBottom: 2,
  },
  metaLabel: {
    color: COLORS.accent1,
    fontWeight: '700',
  },
  addToCartWrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    padding: 16,
    paddingBottom: 24,
  },
  addToCartBtn: {
    borderRadius: 28,
    overflow: 'hidden',
    ...CARD_SHADOW,
  },
  addToCartGradient: {
    paddingVertical: 18,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addToCartText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 18,
    letterSpacing: 0.2,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 20,
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...CARD_SHADOW,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailScreen; 