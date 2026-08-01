import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { FlatList, NativeScrollEvent, NativeSyntheticEvent, StyleSheet, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { Spacing } from '@/constants/Layout';
import { STORAGE_KEYS, storageService } from '@/services/storageService';

interface Slide {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  body: string;
}

const SLIDES: Slide[] = [
  {
    icon: 'home',
    title: 'Find Your Perfect Property',
    body: 'Browse thousands of verified listings for sale and rent across Pakistan, all in one place.',
  },
  {
    icon: 'options',
    title: 'Search Smarter',
    body: 'Filter by city, price, bedrooms, and amenities to find exactly what fits your needs.',
  },
  {
    icon: 'briefcase',
    title: 'List With Confidence',
    body: 'Agents and owners can post properties and reach thousands of buyers and renters.',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef<FlatList<Slide>>(null);

  const isLastSlide = activeIndex === SLIDES.length - 1;

  const finishOnboarding = async () => {
    await storageService.setItem(STORAGE_KEYS.HAS_SEEN_ONBOARDING, true);
    router.replace('/(tabs)/' as Href);
  };

  const handleNext = () => {
    if (isLastSlide) {
      finishOnboarding();
      return;
    }
    listRef.current?.scrollToIndex({ index: activeIndex + 1, animated: true });
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    if (index !== activeIndex) setActiveIndex(index);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.skipRow}>
        {!isLastSlide && (
          <TouchableOpacity onPress={finishOnboarding} accessibilityRole="button">
            <AppText variant="body" weight="semibold" color="secondary">
              Skip
            </AppText>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.title}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(_data, index) => ({ length: width, offset: width * index, index })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <View style={styles.iconCircle}>
              <Ionicons name={item.icon} size={64} color={Colors.primary[500]} />
            </View>
            <AppText variant="h2" weight="bold" align="center" style={styles.title}>
              {item.title}
            </AppText>
            <AppText variant="body" color="secondary" align="center" style={styles.body}>
              {item.body}
            </AppText>
          </View>
        )}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((slide, index) => (
            <View
              key={slide.title}
              style={[styles.dot, index === activeIndex ? styles.dotActive : styles.dotInactive]}
            />
          ))}
        </View>

        <AppButton onPress={handleNext} style={styles.nextButton}>
          {isLastSlide ? 'Get Started' : 'Next'}
        </AppButton>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background.primary },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: Spacing.lg, height: 40, justifyContent: 'center' },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: Spacing.xl },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: Colors.primary[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: { marginBottom: Spacing.sm },
  body: { lineHeight: 22, maxWidth: 320 },
  footer: { paddingHorizontal: Spacing.xl, paddingBottom: Spacing.lg, gap: Spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: Spacing.xs },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 24, backgroundColor: Colors.primary[500] },
  dotInactive: { width: 8, backgroundColor: Colors.gray[300] },
  nextButton: { width: '100%' },
});
