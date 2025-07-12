import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { categories } from '../data/categories';
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

const NUM_COLUMNS = 2;
const CARD_SIZE = (width - 32 - (NUM_COLUMNS - 1) * 16) / NUM_COLUMNS;

const CategoryProductListScreen = ({ route, navigation }) => {
  const { categoryId } = route.params;
  const category = categories.find(c => c.id === categoryId);
  const [search, setSearch] = useState('');

  const filteredProducts = useMemo(() => {
    return products.filter(
      p => p.category === (category?.name || '') &&
        p.shortName.toLowerCase().includes(search.trim().toLowerCase())
    );
  }, [category, search]);

  // Product Card (adapted from HomeScreen)
  const ProductCard = ({ product, onPress, delay }) => (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={600}
      style={styles.productCardWrapper}
    >
      <TouchableOpacity
        style={styles.productCard}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <Image
            source={product.productImages[0]}
          style={styles.productImage}
          resizeMode="cover"
        />
        {product.badge && (
          <View style={styles.productBadge}>
            <Text style={styles.productBadgeText}>{product.badge}</Text>
          </View>
        )}
        <Text style={styles.productName}>{product.shortName}</Text>
        <View style={styles.productPriceRow}>
          <Text style={styles.productPrice}>
            ${product.priceOff ? product.priceOff : product.price}
          </Text>
          {product.priceOff && (
            <Text style={styles.productStrikePrice}>${product.strikePrice}</Text>
          )}
        </View>
        <View style={styles.productRatingRow}>
          <Ionicons name="star" size={16} color={COLORS.accent1} />
          <Text style={styles.productRating}>{product.rating}</Text>
          <Text style={styles.productReview}>({product.review})</Text>
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );

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
      {/* Category Header */}
      <View style={styles.headerRow}>
        <Text style={styles.categoryEmoji}>{category?.image}</Text>
        <Text style={styles.categoryTitle}>{category?.name}</Text>
      </View>
      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search" size={20} color={COLORS.accent1} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder={`Search in ${category?.name || ''}...`}
          placeholderTextColor={COLORS.subtext2}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>
      {/* Product Grid */}
      <View style={{ marginHorizontal: 16, }}>
        <FlatList
          data={filteredProducts}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ paddingBottom: 32, paddingTop: 12 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              delay={100 + index * 60}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        /></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginBottom: 8,
  },
  categoryEmoji: {
    fontSize: 32,
    marginRight: 10,
  },
  categoryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.accent1,
    letterSpacing: 0.2,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    ...CARD_SHADOW,
    minHeight: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.dark,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: 'transparent',
    borderRadius: 16,
  },
  productCardWrapper: {
    width: CARD_SIZE,
  },
  productCard: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    alignItems: 'center',
    padding: 10,
    ...CARD_SHADOW,
    minHeight: 180,
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 90,
    borderRadius: 12,
    marginBottom: 8,
  },
  productBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: COLORS.accent1,
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    zIndex: 2,
  },
  productBadgeText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 11,
  },
  productName: {
    fontSize: 13,
    color: COLORS.dark,
    fontWeight: '600',
    marginBottom: 2,
    textAlign: 'center',
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  productPrice: {
    color: COLORS.accent1,
    fontWeight: '700',
    fontSize: 14,
    marginRight: 6,
  },
  productStrikePrice: {
    color: COLORS.subtext2,
    fontSize: 12,
    textDecorationLine: 'line-through',
    fontWeight: '500',
  },
  productRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  productRating: {
    color: COLORS.accent1,
    fontWeight: '700',
    fontSize: 13,
    marginLeft: 2,
  },
  productReview: {
    color: COLORS.subtext2,
    fontSize: 12,
    marginLeft: 4,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.subtext2,
    fontSize: 16,
    marginTop: 40,
    fontWeight: '500',
  },
});

export default CategoryProductListScreen; 