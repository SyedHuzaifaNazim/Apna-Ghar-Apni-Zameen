import { Box, HStack, Slider, VStack } from 'native-base';
import React from 'react';

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

  const handleValueChange = (values: number[]) => {
    onPriceChange(values[0], values[1]);
  };

  return (
    <VStack space={4}>
      <HStack justifyContent="space-between" alignItems="center">
        <Box bg="primary.50" px={3} py={2} borderRadius="md">
          <AppText variant="small" weight="medium" color="primary">
            {formatPricePKR(minPrice)}
          </AppText>
        </Box>
        
        <AppText variant="small" color="secondary">
          to
        </AppText>
        
        <Box bg="primary.50" px={3} py={2} borderRadius="md">
          <AppText variant="small" weight="medium" color="primary">
            {formatPricePKR(maxPrice)}
          </AppText>
        </Box>
      </HStack>

      <Slider
        minValue={minValue}
        maxValue={maxValue}
        step={step}
        value={minPrice}
        onChange={(value: number) => handleValueChange([value, maxPrice])}
        colorScheme="primary"
      >
        <Slider.Track>
          <Slider.FilledTrack />
        </Slider.Track>
        <Slider.Thumb zIndex={0} />
        <Slider.Thumb zIndex={1} />
      </Slider>

      <HStack justifyContent="space-between">
        <AppText variant="small" color="secondary">
          {formatPricePKR(minValue)}
        </AppText>
        <AppText variant="small" color="secondary">
          {formatPricePKR(maxValue)}
        </AppText>
      </HStack>
    </VStack>
  );
};

export default PriceRangeSlider;