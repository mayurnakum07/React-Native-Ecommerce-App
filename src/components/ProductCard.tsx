import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { Theme } from '../theme';
import { formatPrice } from '../utils/formatters';

const { width } = Dimensions.get('window');

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
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
  delay?: number;
  showViewButton?: boolean;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPress,
  delay = 0,
  showViewButton = false,
  size = 'medium',
  style,
}) => {
  const cardSize = size === 'small' ? width * 0.4 : size === 'large' ? width * 0.9 : width * 0.45;
  const imageHeight = size === 'small' ? 120 : size === 'large' ? 200 : 150;

  return (
    <Animatable.View
      animation="fadeInUp"
      delay={delay}
      duration={600}
      style={[styles.container, { width: cardSize }, style]}
    >
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={onPress}
      >
        <View style={styles.imageContainer}>
          <Image
             source={product.productImages[0]}
            style={[styles.image, { height: imageHeight }]}
            resizeMode="cover"
          />
          {product.badge && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{product.badge}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={2}>
            {product.shortName}
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              {formatPrice(product.priceOff || product.price)}
            </Text>
            {product.priceOff && (
              <Text style={styles.strikePrice}>
                {formatPrice(product.strikePrice || product.price)}
              </Text>
            )}
          </View>

          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={Theme.COLORS.primary} />
            <Text style={styles.rating}>{product.rating}</Text>
            <Text style={styles.review}>({product.review})</Text>
          </View>

          {showViewButton && (
            <TouchableOpacity
              style={styles.viewButton}
              onPress={onPress}
              activeOpacity={0.7}
            >
              <Text style={styles.viewButtonText}>View</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </Animatable.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Theme.Spacing.md,
  },
  
  card: {
    backgroundColor: Theme.COLORS.surface,
    borderRadius: Theme.BorderRadius.lg,
    overflow: 'hidden',
    ...Theme.Shadows.md,
  },
  
  imageContainer: {
    position: 'relative',
  },
  
  image: {
    width: '100%',
    borderTopLeftRadius: Theme.BorderRadius.lg,
    borderTopRightRadius: Theme.BorderRadius.lg,
  },
  
  badge: {
    position: 'absolute',
    top: Theme.Spacing.sm,
    left: Theme.Spacing.sm,
    backgroundColor: Theme.COLORS.primary,
    paddingHorizontal: Theme.Spacing.sm,
    paddingVertical: Theme.Spacing.xs,
    borderRadius: Theme.BorderRadius.sm,
  },
  
  badgeText: {
    color: Theme.COLORS.textInverse,
    fontSize: Theme.Typography.xs,
    fontWeight: Theme.Typography.semibold,
  },
  
  content: {
    padding: Theme.Spacing.md,
  },
  
  name: {
    fontSize: Theme.Typography.sm,
    fontWeight: Theme.Typography.medium,
    color: Theme.COLORS.text,
    marginBottom: Theme.Spacing.xs,
    lineHeight: Theme.Typography.sm * Theme.Typography.lineHeight.normal,
  },
  
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Theme.Spacing.xs,
    gap: Theme.Spacing.xs,
  },
  
  price: {
    fontSize: Theme.Typography.base,
    fontWeight: Theme.Typography.bold,
    color: Theme.COLORS.primary,
  },
  
  strikePrice: {
    fontSize: Theme.Typography.sm,
    color: Theme.COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Theme.Spacing.xs,
  },
  
  rating: {
    fontSize: Theme.Typography.xs,
    fontWeight: Theme.Typography.medium,
    color: Theme.COLORS.text,
  },
  
  review: {
    fontSize: Theme.Typography.xs,
    color: Theme.COLORS.textSecondary,
  },
  
  viewButton: {
    marginTop: Theme.Spacing.sm,
    backgroundColor: Theme.COLORS.primary,
    paddingVertical: Theme.Spacing.xs,
    paddingHorizontal: Theme.Spacing.sm,
    borderRadius: Theme.BorderRadius.sm,
    alignItems: 'center',
  },
  
  viewButtonText: {
    color: Theme.COLORS.textInverse,
    fontSize: Theme.Typography.xs,
    fontWeight: Theme.Typography.semibold,
  },
});

export default ProductCard; 