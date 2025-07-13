import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Animatable from 'react-native-animatable';
import { Theme } from '../../theme';

const { width, height } = Dimensions.get('window');

interface AnimatedLogoProps {
  size?: 'small' | 'medium' | 'large';
  style?: any;
  onAnimationComplete?: () => void;
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  size = 'medium',
  style,
  onAnimationComplete,
}) => {
  const logoRef = useRef<Animatable.View>(null);
  const ball1Ref = useRef<Animatable.View>(null);
  const ball2Ref = useRef<Animatable.View>(null);
  const ball3Ref = useRef<Animatable.View>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Start the animation sequence
    startAnimation();
    
    // Auto-hide after 2 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onAnimationComplete && typeof onAnimationComplete === 'function') {
        onAnimationComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  const startAnimation = () => {
    // Logo entrance animation with bounce
    if (logoRef.current) {
      logoRef.current?.bounceIn(1000);
    }

    // Multiple loading balls with different animations
    animateBall(ball1Ref, 2000, 'pulse');
    animateBall(ball2Ref, 2500, 'swing');
    animateBall(ball3Ref, 3000, 'rubberBand');
  };

  const animateBall = (ballRef: any, duration: number, animationType: string) => {
    if (ballRef.current) {
      // Continuous rotation
      const rotateAnimation = () => {
        ballRef.current?.animate({
          0: { transform: [{ rotate: '0deg' }, { scale: 0.8 }] },
          0.5: { transform: [{ rotate: '180deg' }, { scale: 1.2 }] },
          1: { transform: [{ rotate: '360deg' }, { scale: 0.8 }] },
        }, duration).then(() => {
          rotateAnimation();
        });
      };
      rotateAnimation();

      // Additional animation based on type
      if (animationType === 'pulse') {
        ballRef.current?.pulse(1500);
      } else if (animationType === 'swing') {
        ballRef.current?.swing(2000);
      } else if (animationType === 'rubberBand') {
        ballRef.current?.rubberBand(1800);
      }
    }
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
      {/* Light gradient background */}
      <LinearGradient
        colors={[
          '#FFFFFF',
          '#F8F9FA',
          '#E3F2FD',
          '#BBDEFB',
          '#90CAF9',
          '#64B5F6'
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      />

      {/* Animated circles behind logo with gradients */}
      <Animatable.View
        ref={ball1Ref}
        style={[
          styles.loadingBall,
          styles.ball1,
          {
            width: sizes.ball * 1.2,
            height: sizes.ball * 1.2,
            borderRadius: (sizes.ball * 1.2) / 2,
          },
        ]}
      >
        <LinearGradient
          colors={[
            Theme.COLORS.primary + '15',
            Theme.COLORS.primaryLight + '10',
            Theme.COLORS.white + '20'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ballGradient}
        />
      </Animatable.View>

      <Animatable.View
        ref={ball2Ref}
        style={[
          styles.loadingBall,
          styles.ball2,
          {
            width: sizes.ball * 1.4,
            height: sizes.ball * 1.4,
            borderRadius: (sizes.ball * 1.4) / 2,
          },
        ]}
      >
        <LinearGradient
          colors={[
            Theme.COLORS.secondary + '12',
            Theme.COLORS.primary + '08',
            Theme.COLORS.surfaceSecondary + '15'
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ballGradient}
        />
      </Animatable.View>

      <Animatable.View
        ref={ball3Ref}
        style={[
          styles.loadingBall,
          styles.ball3,
          {
            width: sizes.ball * 1.6,
            height: sizes.ball * 1.6,
            borderRadius: (sizes.ball * 1.6) / 2,
          },
        ]}
      >
        <LinearGradient
          colors={[
            Theme.COLORS.white + '25',
            Theme.COLORS.surfaceSecondary + '15',
            Theme.COLORS.primary + '05'
          ]}
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
  ball1: {
    zIndex: 1,
  },
  ball2: {
    zIndex: 2,
  },
  ball3: {
    zIndex: 3,
  },
  ballGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 999,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 4,
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