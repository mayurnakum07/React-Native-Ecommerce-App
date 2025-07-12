import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CategoryProductListScreen from '../screens/CategoryProductListScreen';
import { COLORS } from '../theme';
const Stack = createNativeStackNavigator();

const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: COLORS.background },
      }}
    >
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="CategoryProductList" component={CategoryProductListScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator; 