import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CartScreen from '../screens/CartScreen';
import NewProductsScreen from '../screens/NewProductsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { COLORS, Layout } from '../theme';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  const insets = useSafeAreaInsets();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: 'transparent',
          borderTopColor: 'transparent',
          height: Layout.tabBarHeight + insets.bottom,
          paddingBottom: insets.bottom + 8,
          paddingTop: 8,
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarIcon: ({ focused, color, size }) => {
          if (route.name === 'Home') {
            return <Ionicons name={focused ? 'home' : 'home-outline'} size={26} color={COLORS.white} />;
          } else if (route.name === 'Categories') {
            return <Ionicons name={focused ? 'grid' : 'grid-outline'} size={26} color={COLORS.white} />;
          } else if (route.name === 'Cart') {
            return <Ionicons name={focused ? 'cart' : 'cart-outline'} size={26} color={COLORS.white} />;
          } else if (route.name === 'NewProducts') {
            return <Ionicons name={focused ? 'star' : 'star-outline'} size={26} color={COLORS.white} />;
          } else if (route.name === 'Profile') {
            return <Ionicons name={focused ? 'person' : 'person-outline'} size={26} color={COLORS.white} />;
          }
          return null;
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={[COLORS.accent1, COLORS.accent2]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ 
              flex: 1,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
            }}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Categories" component={CategoriesScreen} />
      <Tab.Screen name="Cart" component={CartScreen} />
      <Tab.Screen name="NewProducts" component={NewProductsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator; 