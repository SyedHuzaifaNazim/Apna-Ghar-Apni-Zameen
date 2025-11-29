import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { Box, HStack, IconButton, Image, Pressable } from 'native-base';
import React, { useState } from 'react';
import { Dimensions } from 'react-native';

import { Colors } from '../../constants/Colors';
import AppText from '../base/AppText';

const { width: screenWidth } = Dimensions.get('window');

interface ImageCarouselProps {
  images: string[];
  height?: number;
  showIndicators?: boolean;
  showCounter?: boolean;
  onImagePress?: (index: number) => void;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({
  images,
  height = 300,
  showIndicators = true,
  showCounter = true,
  onImagePress
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable 
      onPress={() => onImagePress?.(index)}
      disabled={!onImagePress}
    >
      <Image
        source={{ uri: item }}
        alt={`Property image ${index + 1}`}
        width={screenWidth}
        height={height}
        resizeMode="cover"
      />
    </Pressable>
  );

  if (images.length === 0) {
    return (
      <Box width={screenWidth} height={height} bg="gray.100" justifyContent="center" alignItems="center">
        <Ionicons name="image-outline" size={48} color={Colors.text.disabled} />
        <AppText variant="body" color="disabled">
          No images available
        </AppText>
      </Box>
    );
  }

  return (
    <Box position="relative" height={height}>
      <FlashList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <IconButton
              position="absolute"
              left={2}
              top={height / 2 - 20}
              backgroundColor="rgba(0,0,0,0.5)"
              borderRadius="full"
              icon={<Ionicons name="chevron-back" size={24} color="white" />}
              onPress={goToPrev}
              _pressed={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            />
          )}
          
          {currentIndex < images.length - 1 && (
            <IconButton
              position="absolute"
              right={2}
              top={height / 2 - 20}
              backgroundColor="rgba(0,0,0,0.5)"
              borderRadius="full"
              icon={<Ionicons name="chevron-forward" size={24} color="white" />}
              onPress={goToNext}
              _pressed={{ backgroundColor: "rgba(0,0,0,0.7)" }}
            />
          )}
        </>
      )}

       {/* Image Counter */}
       {showCounter && images.length > 1 && (
        <Box
          position="absolute"
          top={4}
          right={4}
          backgroundColor="rgba(0,0,0,0.7)"
          borderRadius="full"
          px={3}
          py={1}
        >
          <AppText variant="small" color="primary">
            {currentIndex + 1} / {images.length}
          </AppText>
        </Box>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <HStack 
          position="absolute" 
          bottom={4} 
          left={0} 
          right={0} 
          justifyContent="center" 
          space={2}
        >
          {images.map((_, index) => (
            <Box
              key={index}
              width={2}
              height={2}
              borderRadius="full"
              backgroundColor={index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)'}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
};

export default ImageCarousel;