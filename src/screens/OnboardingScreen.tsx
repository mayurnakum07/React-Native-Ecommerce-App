import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Swiper from 'react-native-swiper';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { COLORS, Layout } from '../theme';

const { width, height } = Dimensions.get('window');



const FONT_FAMILY = Platform.select({
  ios: 'SF Pro Display',
  android: 'Poppins',
  default: 'System',
});

const Dot = ({ active }: { active: boolean }) => (
  <Animatable.View
    animation={active ? "pulse" : undefined}
    duration={1000}
    style={[
      styles.dot,
      active && { 
        backgroundColor: COLORS.white, 
        width: 24,
        shadowColor: COLORS.white,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
      },
    ]}
  />
);

interface OnboardingScreen {
  image: string;
  title: string;
  subtitle: string;
  icon: string;
  feature: string;
  dark: boolean;
}

const screens: OnboardingScreen[] = [
  {
    image: '🛍️',
    title: 'Welcome to LuxeCart',
    subtitle: 'Discover a world of premium shopping where luxury meets convenience. Your journey to exceptional retail begins here.',
    icon: '💎',
    feature: 'Premium Experience',
    dark: false,
  },
  {
    image: '👗',
    title: 'Curated Collections',
    subtitle: 'Explore handpicked selections from the world\'s most prestigious brands. Every item tells a story of craftsmanship and style.',
    icon: '✨',
    feature: 'Elite Brands',
    dark: false,
  },
  {
    image: '💳',
    title: 'Seamless Payments',
    subtitle: 'Experience lightning-fast checkout with our secure payment system. Your financial data is protected with bank-level security.',
    icon: '🔒',
    feature: 'Secure & Fast',
    dark: false,
  },
  {
    image: '🚚',
    title: 'Real-Time Tracking',
    subtitle: 'Follow your order\'s journey from our premium warehouse to your doorstep with live updates and precise delivery times.',
    icon: '📍',
    feature: 'Live Updates',
    dark: false,
  },
  {
    image: '🎉',
    title: 'Personalized Shopping',
    subtitle: 'Enjoy a tailored shopping experience with AI-powered recommendations that understand your unique style and preferences.',
    icon: '🤖',
    feature: 'AI Powered',
    dark: true,
  },
];

const OnboardingScreen: React.FC<{ onComplete?: () => void }> = ({ onComplete }) => {
  const [index, setIndex] = useState(0);
  const swiperRef = useRef<Swiper>(null);

  const handleSkip = () => {
    setIndex(screens.length - 1);
    swiperRef.current?.scrollBy(screens.length - 1 - index, true);
  };
  const handleNext = () => {
    if (index < screens.length - 1) {
      swiperRef.current?.scrollBy(1, true);
    } else {
      onComplete && onComplete();
    }
  };

  const handleStart = () => {
    onComplete && onComplete();
  };

  // Button text logic
  let buttonText = 'Next';
  if (index === 0) buttonText = 'Get Started';
  else if (index === 2) buttonText = 'Continue';
  else if (index === 3) buttonText = 'Almost Done';
  else if (index === 4) buttonText = 'Start Shopping';

  // Button action
  const buttonAction = index === 4 ? handleStart : handleNext;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {/* Dynamic LinearGradient background */}
      <LinearGradient
        colors={[COLORS.accent2, COLORS.primary, COLORS.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Skip button */}
      {index < screens.length - 1 && (
        <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      )}
      {/* Swiper */}
      <Swiper
        ref={swiperRef}
        index={index}
        loop={false}
        showsPagination={false}
        scrollEnabled={true}
        onIndexChanged={setIndex}
        removeClippedSubviews={false}
        containerStyle={{ flex: 1 }}
      >
        {screens.map((screen, i) => (
          <Animatable.View
            key={i}
            animation="fadeInUp"
            duration={700}
            delay={100}
            style={[styles.screen]}
          >
            <View style={styles.centered}>
              {/* Feature Badge */}
              <View style={styles.featureBadge}>
                <Text style={styles.featureIcon}>{screen.icon}</Text>
                <Text style={styles.featureText}>{screen.feature}</Text>
              </View>
              
              {/* Main Image */}
              <View style={styles.imagePlaceholder}>
                <LinearGradient
                  colors={[COLORS.white, COLORS.background]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.imageGradient}
                >
                  <Text style={styles.imageIcon}>{screen.image}</Text>
                </LinearGradient>
              </View>
              
              {/* Content */}
              <View style={styles.contentContainer}>
                <Text style={[styles.title, { color: COLORS.white }]}>{screen.title}</Text>
                <Text style={[styles.subtitle, { color: COLORS.white + 'CC' }]}>{screen.subtitle}</Text>
              </View>
              
              {/* Decorative Elements */}
              <View style={styles.decorativeElements}>
                <View style={styles.decorativeDot} />
                <View style={styles.decorativeLine} />
                <View style={styles.decorativeDot} />
              </View>
            </View>
          </Animatable.View>
        ))}
      </Swiper>
      {/* Dots above button */}
      <View style={styles.dotsRow}>
        {screens.map((_, i) => (
          <Dot key={i} active={i === index} />
        ))}
      </View>
      {/* Static CTA Button */}
      <TouchableOpacity style={styles.ctaBtn} onPress={buttonAction} activeOpacity={0.8}>
        <LinearGradient
          colors={[COLORS.accent1, COLORS.accent2]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.ctaGradient}
        >
          <Text style={[styles.ctaText]}>{buttonText}</Text>
        </LinearGradient>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  screen: {
    flex: 1,
    paddingTop: Layout.safeAreaTop + 20,
    paddingBottom: Layout.safeAreaBottom + 20,
    paddingHorizontal: 28,
    justifyContent: 'space-between',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 40,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
    letterSpacing: 0.5,
  },
  imagePlaceholder: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: width * 0.2,
    overflow: 'hidden',
    marginBottom: 40,
    shadowColor: COLORS.dark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  imageGradient: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    fontSize: 48,
    textAlign: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  decorativeElements: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  decorativeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  decorativeLine: {
    width: 40,
    height: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 12,
  },
  title: {
    fontFamily: FONT_FAMILY,
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.white,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    color: COLORS.white + 'CC',
    textAlign: 'center',
    marginBottom: 0,
    lineHeight: 28,
    letterSpacing: 0.2,
    fontWeight: '400',
  },
  ctaBtn: {
    marginTop: 0,
    marginBottom: Layout.safeAreaBottom + 20,
    alignSelf: 'center',
    width: width - 56,
    borderRadius: 28,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ctaText: {
    fontFamily: FONT_FAMILY,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.2,
    color: COLORS.white
  },
  skipBtn: {
    position: 'absolute',
    top: Layout.safeAreaTop + 16,
    right: 24,
    zIndex: 10,
    padding: 8,
  },
  skipText: {
    fontFamily: FONT_FAMILY,
    fontSize: 16,
    color: COLORS.white,
    fontWeight: '600',
    letterSpacing: 0.1,
  },
    dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginHorizontal: 6,
  },
  altLink: {
    marginTop: 18,
    alignSelf: 'center',
  },
  altLinkText: {
    fontFamily: FONT_FAMILY,
    fontSize: 15,
    color: COLORS.accent1,
    fontWeight: '500',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default OnboardingScreen; 