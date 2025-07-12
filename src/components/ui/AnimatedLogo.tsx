import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { BlurView } from 'expo-blur';
import { Theme } from '../../theme';

const { width, height } = Dimensions.get('window');

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'medium',
  style,
}) => {
  const logoRef = useRef<Animatable.View>(null);
  const ballRef = useRef<Animatable.View>(null);

  useEffect(() => {
    // Start the animation sequence
    startAnimation();
  }, []);

  const startAnimation = () => {
    // Logo entrance animation - simple fade in
    if (logoRef.current) {
      logoRef.current.fadeIn(800);
    }

    // Loading ball animation - continuous rotation
    const rotateAnimation = () => {
      if (ballRef.current) {
        ballRef.current.animate({
          0: { transform: [{ rotate: '0deg' }] },
          1: { transform: [{ rotate: '360deg' }] },
        }, 2000).then(() => {
          rotateAnimation();
        });
      }
    };
    rotateAnimation();
  };

  const getSize = () => {
    switch (size) {
      case 'small':
        return { logo: 60, ball: 80 };
      case 'large':
        return { logo: 120, ball: 160 };
      default:
        return { logo: 80, ball: 100 };
    }
  };

  const sizes = getSize();

  return (
    <View style={[styles.container, style]}>
      {/* Blurry background */}
      <BlurView intensity={20} style={styles.blurBackground}>
        <LinearGradient
          colors={[Theme.COLORS.primary + '20', Theme.COLORS.primaryLight + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.backgroundGradient}
        />
      </BlurView>

      {/* Loading ball behind logo */}
      <Animatable.View
        ref={ballRef}
        style={[
          styles.loadingBall,
          {
            width: sizes.ball,
            height: sizes.ball,
            borderRadius: sizes.ball / 2,
          },
        ]}
      >
        <LinearGradient
          colors={[Theme.COLORS.white + '40', Theme.COLORS.white + '20']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ballGradient}
        />
      </Animatable.View>

      {/* Main logo container */}
      <Animatable.View
        ref={logoRef}
        style={[
          styles.logoContainer,
          {
            width: sizes.logo,
            height: sizes.logo,
            borderRadius: sizes.logo / 2,
          },
        ]}
      >
        <LinearGradient
          colors={[Theme.COLORS.white, Theme.COLORS.surfaceSecondary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.logoGradient}
        >
          {/* Shopping bag icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>🛍️</Text>
          </View>
        </LinearGradient>
      </Animatable.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Theme.COLORS.background,
  },
  blurBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  loadingBall: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ballGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    ...Theme.Shadows.lg,
  },
  logoGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 32,
  },
});

export default AnimatedLogo; 