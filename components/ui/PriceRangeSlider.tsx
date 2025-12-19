import Slider from '@react-native-community/slider';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import AppText from '../base/AppText';

interface PriceRangeSliderProps {
  minPrice: number;
  maxPrice: number;
  onPriceChange: (min: number, max: number) => void;
  minValue?: number;
  maxValue?: number;
  step?: number;
}

const formatPricePKR = (price: number) => {
  if (price >= 10000000) {
    return `Rs ${(price / 10000000).toFixed(1)} Cr`;
  }
  if (price >= 100000) {
    return `Rs ${(price / 100000).toFixed(1)} L`;
  }
  return `Rs ${price.toLocaleString()}`;
};

const PriceRangeSlider: React.FC<PriceRangeSliderProps> = ({
  minPrice,
  maxPrice,
  onPriceChange,
  minValue = 0,
  maxValue = 100000000,
  step = 100000
}) => {

  const handleMinChange = (val: number) => {
    // Ensure min doesn't exceed max
    const newMin = Math.min(val, maxPrice);
    onPriceChange(newMin, maxPrice);
  };

  const handleMaxChange = (val: number) => {
    // Ensure max doesn't fall below min
    const newMax = Math.max(val, minPrice);
    onPriceChange(minPrice, newMax);
  };

  return (
    <View style={styles.container}>
      {/* Price Labels */}
      <View style={styles.labelsRow}>
        <View style={styles.labelBadge}>
          <AppText variant="small" weight="medium" style={{ color: Colors.primary[500] }}>
            {formatPricePKR(minPrice)}
          </AppText>
        </View>
        
        <AppText variant="small" color="secondary">
          to
        </AppText>
        
        <View style={styles.labelBadge}>
          <AppText variant="small" weight="medium" style={{ color: Colors.primary[500] }}>
            {formatPricePKR(maxPrice)}
          </AppText>
        </View>
      </View>

      {/* Sliders Container */}
      <View style={styles.slidersContainer}>
        {/* Min Price Slider */}
        <View style={styles.sliderWrapper}>
            <AppText variant="small" color="secondary" style={styles.sliderLabel}>Min</AppText>
            <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={step}
            value={minPrice}
            onValueChange={handleMinChange}
            minimumTrackTintColor={Colors.primary[500]}
            maximumTrackTintColor={Colors.gray ? Colors.gray[300] : '#d1d5db'}
            thumbTintColor={Colors.primary[500]}
            />
        </View>

        {/* Max Price Slider */}
        <View style={styles.sliderWrapper}>
            <AppText variant="small" color="secondary" style={styles.sliderLabel}>Max</AppText>
            <Slider
            style={styles.slider}
            minimumValue={minValue}
            maximumValue={maxValue}
            step={step}
            value={maxPrice}
            onValueChange={handleMaxChange}
            minimumTrackTintColor={Colors.primary[500]}
            maximumTrackTintColor={Colors.gray ? Colors.gray[300] : '#d1d5db'}
            thumbTintColor={Colors.primary[500]}
            />
        </View>
      </View>

      {/* Range Limits */}
      <View style={styles.rangeLimits}>
        <AppText variant="small" color="secondary">
          {formatPricePKR(minValue)}
        </AppText>
        <AppText variant="small" color="secondary">
          {formatPricePKR(maxValue)}
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelBadge: {
    backgroundColor: Colors.primary[50],
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  slidersContainer: {
      gap: 12,
  },
  sliderWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
  },
  sliderLabel: {
      width: 30,
  },
  slider: {
    flex: 1,
    height: 40,
  },
  rangeLimits: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default PriceRangeSlider;