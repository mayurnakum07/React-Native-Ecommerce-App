import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Image, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { products } from '../data/products';
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

const NUM_COLUMNS = 2;
const CARD_SIZE = (width - 32 - (NUM_COLUMNS - 1) * 16) / NUM_COLUMNS;

const SORT_OPTIONS = [
  { id: 'default', label: 'Default', icon: 'grid-outline' as const },
  { id: 'price-low', label: 'Price: Low to High', icon: 'trending-up-outline' as const },
  { id: 'price-high', label: 'Price: High to Low', icon: 'trending-down-outline' as const },
  { id: 'rating', label: 'Highest Rated', icon: 'star-outline' as const },
  { id: 'newest', label: 'Newest First', icon: 'time-outline' as const },
];

// Product Card - Moved outside to prevent re-creation
const ProductCard = ({ product, onPress, delay }: { product: any; onPress: () => void; delay: number }) => (
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
      <TouchableOpacity
        style={styles.viewButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={[COLORS.accent1, COLORS.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.viewButtonGradient}
        >
          <Text style={styles.viewButtonText}>View</Text>
        </LinearGradient>
      </TouchableOpacity>
    </TouchableOpacity>
  </Animatable.View>
);

const NewProductsScreen = ({ navigation }: { navigation: any }) => {
  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState('default');
  const [showSortMenu, setShowSortMenu] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter(
      p => p.shortName.toLowerCase().includes(search.trim().toLowerCase())
    );

    // Apply sorting
    switch (selectedSort) {
      case 'price-low':
        filtered.sort((a, b) => (a.priceOff || a.price) - (b.priceOff || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.priceOff || b.price) - (a.priceOff || a.price));
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'newest':
        // Sort by ID (assuming higher ID = newer)
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [search, selectedSort]);

  const selectedSortOption = SORT_OPTIONS.find(option => option.id === selectedSort);

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>All Products</Text>
        <Text style={styles.headerSubtitle}>Explore our complete collection</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBarWrapper}>
        <Ionicons name="search" size={20} color={COLORS.accent1} style={{ marginLeft: 12 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={COLORS.subtext2}
          value={search}
          onChangeText={setSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* Sort Menu */}
      <View style={styles.sortSection}>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setShowSortMenu(!showSortMenu)}
          activeOpacity={0.7}
        >
          <Ionicons name={selectedSortOption?.icon || 'grid-outline'} size={20} color={COLORS.accent1} />
          <Text style={styles.sortButtonText}>{selectedSortOption?.label || 'Sort'}</Text>
          <Ionicons name={showSortMenu ? 'chevron-up' : 'chevron-down'} size={16} color={COLORS.accent1} />
        </TouchableOpacity>
      </View>

      {/* Sort Menu Dropdown - Absolute Positioned */}
      {showSortMenu && (
        <View style={styles.sortMenuOverlay}>
          <TouchableOpacity
            style={styles.sortMenuBackdrop}
            onPress={() => setShowSortMenu(false)}
            activeOpacity={1}
          />
          <Animatable.View
            animation="fadeInDown"
            duration={300}
            style={styles.sortMenuDropdown}
          >
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.sortOption,
                  selectedSort === option.id && styles.sortOptionActive
                ]}
                onPress={() => {
                  setSelectedSort(option.id);
                  setShowSortMenu(false);
                }}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={option.icon} 
                  size={18} 
                  color={selectedSort === option.id ? COLORS.white : COLORS.accent1} 
                />
                <Text style={[
                  styles.sortOptionText,
                  selectedSort === option.id && styles.sortOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </Animatable.View>
        </View>
      )}

      {/* Product Grid */}
      <View style={{ marginHorizontal: 16, flex: 1 }}>
        <FlatList
          data={filteredAndSortedProducts}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ paddingBottom:   Layout.tabBarHeight + 20, paddingTop: 12 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              delay={100 + index * 40}
              onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={48} color={COLORS.subtext2} />
              <Text style={styles.emptyText}>No products found</Text>
              <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
            </View>
          }
          ListHeaderComponent={
            <Text style={styles.resultsCount}>
              {filteredAndSortedProducts.length} products found
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.dark,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: COLORS.subtext,
    fontWeight: '500',
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 12,
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
  sortSection: {
    marginHorizontal: 16,
    marginBottom: 8,
    zIndex: 10,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...CARD_SHADOW,
  },
  sortButtonText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '600',
    marginLeft: 8,
    marginRight: 8,
    flex: 1,
  },
  sortMenuOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sortMenuBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sortMenuDropdown: {
    position: 'absolute',
    top: 120,
    left: 16,
    right: 16,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    paddingVertical: 8,
    ...CARD_SHADOW,
    maxHeight: 300,
  },
  sortMenu: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginTop: 4,
    paddingVertical: 8,
    ...CARD_SHADOW,
  },
  sortOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sortOptionActive: {
    backgroundColor: COLORS.accent1,
  },
  sortOptionText: {
    fontSize: 14,
    color: COLORS.dark,
    fontWeight: '500',
    marginLeft: 8,
  },
  sortOptionTextActive: {
    color: COLORS.white,
  },
  resultsCount: {
    fontSize: 14,
    color: COLORS.subtext,
    fontWeight: '500',
    marginBottom: 8,
    textAlign: 'center',
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
    minHeight: 200,
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
    marginBottom: 8,
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
  viewButton: {
    borderRadius: 16,
    overflow: 'hidden',
    width: '100%',
  },
  viewButtonGradient: {
    paddingVertical: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 0.2,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: COLORS.dark,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 14,
    color: COLORS.subtext2,
    textAlign: 'center',
  },
});

export default NewProductsScreen; 