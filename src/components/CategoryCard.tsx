import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { Theme } from '../theme';

const { width } = Dimensions.get('window');

interface Category {
  id: string;
  name: string;
  image: string;
  productCount?: number;
}

interface CategoryCardProps {
  category: Category;
  onPress: () => void;
  delay?: number;
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onPress,
  delay = 0,
  size = 'medium',
  style,
}) => {
  const cardSize = size === 'small' ? width * 0.3 : size === 'large' ? width * 0.8 : width * 0.4;
  const iconSize = size === 'small' ? 32 : size === 'large' ? 48 : 40;

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
        <View style={styles.iconWrapper}>
          <Text style={[styles.icon, { fontSize: iconSize }]}>
            {category.image}
          </Text>
        </View>
        
        <Text style={styles.name} numberOfLines={2}>
          {category.name}
        </Text>
        
        {category.productCount && (
          <Text style={styles.productCount}>
            {category.productCount} products
          </Text>
        )}
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
    padding: Theme.Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
    ...Theme.Shadows.sm,
  },
  
  iconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Theme.COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Theme.Spacing.sm,
  },
  
  icon: {
    color: Theme.COLORS.primary,
  },
  
  name: {
    fontSize: Theme.Typography.sm,
    fontWeight: Theme.Typography.medium,
    color: Theme.COLORS.text,
    textAlign: 'center',
    lineHeight: Theme.Typography.sm * Theme.Typography.lineHeight.normal,
  },
  
  productCount: {
    fontSize: Theme.Typography.xs,
    color: Theme.COLORS.textSecondary,
    marginTop: Theme.Spacing.xs,
    textAlign: 'center',
  },
});

export default CategoryCard; 