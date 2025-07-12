import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import OnboardingScreen from './src/screens/OnboardingScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { CartProvider } from './src/screens/CartScreen';
import AppContext from './src/context/AppContext';
import { AuthProvider } from './src/context/AuthContext';
import { AnimatedLogo } from './src/components';


const ONBOARDING_KEY = 'hasCompletedOnboarding';



export default function App() {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      // Add 500ms delay for first app load
      await new Promise(resolve => setTimeout(resolve, 500));
      await checkOnboardingStatus();
      setIsInitializing(false);
    };
    
    initializeApp();
  }, []);

  const checkOnboardingStatus = async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDING_KEY);
      setHasCompletedOnboarding(value === 'true');
    } catch (error) {
      setHasCompletedOnboarding(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
      setHasCompletedOnboarding(true);
    } catch (error) {
      setHasCompletedOnboarding(true);
    }
  };

  const appContextValue = {
    checkOnboardingStatus,
  };

  if (isInitializing || hasCompletedOnboarding == null) {
    return <AnimatedLogo size="large" />;
  }

  if (!hasCompletedOnboarding) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />;
  }

  return (
    <AuthProvider>
      <AppContext.Provider value={appContextValue}>
        <StatusBar translucent backgroundColor="transparent" style="dark" />
        <CartProvider>
          <AppNavigator />
        </CartProvider>
      </AppContext.Provider>
    </AuthProvider>
  );
} 