import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';
import { categories } from '../data/categories';
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

const NUM_COLUMNS = 3;
const CARD_SIZE = (width - 32 - (NUM_COLUMNS - 1) * 12) / NUM_COLUMNS;

const CategoryCard = ({ category, onPress, delay }: { category: any; onPress: () => void; delay: number }) => (
  <Animatable.View
    animation="fadeInUp"
    delay={delay}
    duration={600}
    style={styles.cardWrapper}
  >
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.iconWrapper}>
        <Text style={styles.icon}>{category.image}</Text>
      </View>
      <Text style={styles.name}>{category.name}</Text>
    </TouchableOpacity>
  </Animatable.View>
);

const CategoriesScreen = ({ navigation }: { navigation: any }) => {
  const [search, setSearch] = useState('');

  const filteredCategories = useMemo(() =>
    categories.filter(cat =>
      cat.name.toLowerCase().includes(search.trim().toLowerCase())
    ), [search]
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top','left','right']}>
      <View style={styles.container}>
        {/* Search Bar */}
        <View style={styles.searchBarWrapper}>
          <Feather name="search" size={20} color={COLORS.accent1} style={{ marginLeft: 12 }} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search categories..."
            placeholderTextColor={COLORS.subtext2}
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
        {/* Category Grid */}
        <FlatList
          data={filteredCategories}
          keyExtractor={item => item.id}
          numColumns={NUM_COLUMNS}
          contentContainerStyle={{ paddingBottom:  Layout.tabBarHeight + 20, paddingTop: 12 }}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 16 }}
          renderItem={({ item, index }) => (
            <CategoryCard
              category={item}
              delay={100 + index * 40}
              onPress={() => navigation.navigate('CategoryProductList', { categoryId: item.id })}
            />
          )}
          showsVerticalScrollIndicator={false}
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
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: COLORS.background,
  },
  searchBarWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    marginTop: 18,
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
  cardWrapper: {
    width: CARD_SIZE,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: CARD_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    ...CARD_SHADOW,
    minHeight: CARD_SIZE * 0.95,
  },
  iconWrapper: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    padding: 10,
    marginBottom: 6,
  },
  icon: {
    fontSize: 32,
    textAlign: 'center',
  },
  name: {
    fontSize: 15,
    color: COLORS.dark,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 2,
  },
});

export default CategoriesScreen; 