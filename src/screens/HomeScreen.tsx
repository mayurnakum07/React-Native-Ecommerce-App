import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Theme, Layout } from '../theme';
import { ProductCard, CategoryCard, BannerSwiper, AnimatedLogo } from '../components';
import ApiService from '../services/api';

// Section Header Component
const SectionHeader = ({ title, onViewAll, subtitle }) => (
  <View style={styles.sectionHeaderRow}>
    <View style={styles.sectionHeaderContent}>
      <Text style={styles.sectionHeader}>{title}</Text>
      {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
    </View>
    {onViewAll && (
      <TouchableOpacity onPress={onViewAll} style={styles.viewAllButton}>
        <Feather name="chevron-right" size={22} color={Theme.COLORS.primary} />
      </TouchableOpacity>
    )}
  </View>
);

interface Product {
  id: string;
  shortName: string;
  price: number;
  priceOff?: number;
  strikePrice?: number;
  rating: number;
  review: number;
  productImages: string[];
  badge?: string;
  shortDescription?: string;
}

interface Category {
  id: string;
  name: string;
  image: string;
  productCount?: number;
}

const HomeScreen = ({ navigation }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData] = await Promise.all([
        ApiService.getProducts(),
        ApiService.getCategories(),
      ]);


      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryProductList', { categoryId: category.id });
  };

  const handleBannerPress = (product) => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const bannerProducts = products.slice(0, 3);
  const featuredProducts = products.slice(0, 6);
  const featuredCategories = categories.slice(0, 6);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
        <AnimatedLogo size="medium" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'left', 'right']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner Swiper */}
        <BannerSwiper
          banners={bannerProducts}
          onBannerPress={handleBannerPress}
        />

        {/* Categories Section */}
        <SectionHeader
          title="Categories"
          subtitle="Browse by category"
          onViewAll={() => navigation.navigate('Categories')}
        />

        <View style={styles.categoryGrid}>
          {featuredCategories.map((category, idx) => (
            <CategoryCard
              key={category.id}
              category={category}
              delay={100 + idx * 60}
              onPress={() => handleCategoryPress(category)}
            />
          ))}
        </View>

        {/* Featured Products Section */}
        <SectionHeader
          title="Featured"
          subtitle="Handpicked for you"
          onViewAll={() => navigation.navigate('NewProducts')}
        />

        <View style={styles.productGrid}>
          {featuredProducts.map((product, idx) => (
            <ProductCard
              key={product.id}
              product={product}
              delay={100 + idx * 60}
              onPress={() => handleProductPress(product)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Theme.COLORS.background,
  },

  container: {
    flex: 1,
    backgroundColor: Theme.COLORS.background,
    paddingHorizontal: Theme.Layout.screenPadding,
    paddingTop: Theme.Spacing.sm,
  },

  scrollContent: {
    paddingBottom: Theme.Spacing.xl + Layout.tabBarHeight, // Add extra padding for tab bar
  },



  // Section header styles
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Theme.Spacing.md,
  },

  sectionHeaderContent: {
    flex: 1,
  },

  sectionHeader: {
    fontSize: Theme.Typography.xl,
    fontWeight: Theme.Typography.bold,
    color: Theme.COLORS.text,
  },

  sectionSubtitle: {
    fontSize: Theme.Typography.sm,
    color: Theme.COLORS.textSecondary,
    marginTop: Theme.Spacing.xs,
  },

  viewAllButton: {
    padding: Theme.Spacing.xs,
  },

  // Grid styles
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: Theme.Spacing.xl,
  },

  productGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },


});

export default HomeScreen; 