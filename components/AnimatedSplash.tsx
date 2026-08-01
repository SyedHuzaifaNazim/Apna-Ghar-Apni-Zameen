import React, { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';

import { Colors } from '@/constants/Colors';

const LOGO = require('@/assets/images/transparent-logo1.png');

interface AnimatedSplashProps {
  /** True once the app has decided where to route (e.g. onboarding check resolved). */
  ready: boolean;
  onFinished: () => void;
  /** Floor on how long the animation plays, so a fast `ready` doesn't skip the intro entirely. */
  minDurationMs?: number;
}

// A JS-driven splash that takes over the instant the native (expo-splash-screen)
// splash is hidden — same brand-green background, so the handoff is invisible —
// then plays a logo reveal before fading into the app underneath.
const AnimatedSplash: React.FC<AnimatedSplashProps> = ({ ready, onFinished, minDurationMs = 1400 }) => {
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [logoScale] = useState(() => new Animated.Value(0.85));
  const [overlayOpacity] = useState(() => new Animated.Value(1));
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);
  const hasFadedRef = useRef(false);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 550,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, { toValue: 1, friction: 6, tension: 45, useNativeDriver: true }),
    ]).start();
  }, [logoOpacity, logoScale]);

  useEffect(() => {
    const timer = setTimeout(() => setMinTimeElapsed(true), minDurationMs);
    return () => clearTimeout(timer);
  }, [minDurationMs]);

  useEffect(() => {
    if (ready && minTimeElapsed && !hasFadedRef.current) {
      hasFadedRef.current = true;
      Animated.timing(overlayOpacity, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start(onFinished);
    }
  }, [ready, minTimeElapsed, onFinished, overlayOpacity]);

  return (
    <Animated.View style={[styles.container, { opacity: overlayOpacity }]} pointerEvents="none">
      <Animated.Image
        source={LOGO}
        resizeMode="contain"
        style={[styles.logo, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}
      />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary[600],
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  logo: { width: 220, height: 90 },
});

export default AnimatedSplash;
