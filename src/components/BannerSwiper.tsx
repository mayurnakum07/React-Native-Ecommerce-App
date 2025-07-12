import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Swiper from 'react-native-swiper';
import { Theme } from '../theme';

const { width } = Dimensions.get('window');

interface BannerProduct {
  id: string;
  shortName: string;
  shortDescription?: string;
  productImages: string[];
  badge?: string;
}

interface BannerSwiperProps {
  banners: BannerProduct[];
  onBannerPress: (product: BannerProduct) => void;
}

const BannerSwiper: React.FC<BannerSwiperProps> = ({ banners, onBannerPress }) => {

  if (!banners || banners.length === 0) {
    return (
      <View style={styles.swiperContainer}>
        <View style={styles.fallbackBanner}>
          <Text style={styles.fallbackText}>No featured products available</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.swiperContainer}>
      <Swiper
        autoplay
        autoplayTimeout={3.5}
        showsPagination={true}
        dotColor={Theme.COLORS.textSecondary}
        activeDotColor={Theme.COLORS.primary}
        height={180}
        containerStyle={styles.swiperContainerStyle}
        paginationStyle={styles.paginationStyle}
        dotStyle={styles.dotStyle}
        activeDotStyle={styles.activeDotStyle}
      >
        {banners.map((product, idx) => (
          <TouchableOpacity
            key={product.id}
            onPress={() => onBannerPress(product)}
            style={styles.bannerSlide}
            activeOpacity={0.9}
          >
            <Image
              source={product.productImages[0]}
              style={styles.bannerImage}
              resizeMode="cover"
              defaultSource={{ uri: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836' }}
            />
            <LinearGradient
              colors={[Theme.COLORS.text + '99', 'transparent']}
              style={styles.bannerOverlay}
            />
            {product.badge && (
              <View style={styles.bannerBadge}>
                <Text style={styles.bannerBadgeText}>{product.badge}</Text>
              </View>
            )}
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle} numberOfLines={1}>
                {product.shortName}
              </Text>
              <Text style={styles.bannerSubtitle} numberOfLines={2}>
                {product.shortDescription || 'Discover premium deals now.'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  swiperContainer: {
    height: 180,
    borderRadius: Theme.BorderRadius.lg,
    marginBottom: Theme.Spacing.lg,
    overflow: 'hidden',
    backgroundColor: Theme.COLORS.background,
    elevation: 2,
    shadowColor: Theme.COLORS.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  swiperContainerStyle: {
    borderRadius: Theme.BorderRadius.lg,
    overflow: 'hidden',
  },

  paginationStyle: {
    bottom: 10,
  },

  dotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  activeDotStyle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  bannerSlide: {
    flex: 1,
    position: 'relative',
  },

  bannerImage: {
    width: '100%',
    height: '100%',
  },

  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
  },

  bannerBadge: {
    position: 'absolute',
    top: Theme.Spacing.md,
    left: Theme.Spacing.md,
    backgroundColor: Theme.COLORS.primary,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.sm,
  },

  bannerBadgeText: {
    color: Theme.COLORS.textInverse,
    fontSize: Theme.Typography.xs,
    fontWeight: Theme.Typography.semibold,
  },

  bannerContent: {
    position: 'absolute',
    bottom: Theme.Spacing.md,
    left: Theme.Spacing.md,
    right: Theme.Spacing.md,
  },

  bannerTitle: {
    fontSize: Theme.Typography.lg,
    fontWeight: Theme.Typography.bold,
    color: Theme.COLORS.textInverse,
    marginBottom: Theme.Spacing.xs,
  },

  bannerSubtitle: {
    fontSize: Theme.Typography.sm,
    color: Theme.COLORS.textInverse,
    opacity: 0.9,
  },

  fallbackBanner: {
    height: 180,
    borderRadius: Theme.BorderRadius.lg,
    backgroundColor: Theme.COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Theme.COLORS.border,
  },

  fallbackText: {
    fontSize: Theme.Typography.base,
    color: Theme.COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default BannerSwiper; 