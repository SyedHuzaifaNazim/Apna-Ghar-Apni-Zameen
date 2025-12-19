import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import React, { useRef, useState } from 'react';
import { Dimensions, Image, Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

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
  // Fixed: Changed FlashList<string> to any to resolve "refers to a value" error
  const listRef = useRef<any>(null);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const goToNext = () => {
    if (currentIndex < images.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }
  };

  const goToPrev = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      listRef.current?.scrollToIndex({ index: prevIndex, animated: true });
    }
  };

  const renderItem = ({ item, index }: { item: string; index: number }) => (
    <Pressable 
      onPress={() => onImagePress?.(index)}
      disabled={!onImagePress}
      style={{ width: screenWidth, height: height }}
    >
      <Image
        source={{ uri: item }}
        accessibilityLabel={`Property image ${index + 1}`}
        style={{ width: screenWidth, height: height }}
        resizeMode="cover"
      />
    </Pressable>
  );

  if (images.length === 0) {
    return (
      <View style={[styles.emptyContainer, { height, width: screenWidth }]}>
        <Ionicons name="image-outline" size={48} color={Colors.text.disabled} />
        <AppText variant="body" color="disabled" style={styles.emptyText}>
          No images available
        </AppText>
      </View>
    );
  }

  return (
    <View style={[styles.container, { height }]}>
      <FlashList
        ref={listRef}
        data={images}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        // estimatedItemSize removed for FlashList v2 compatibility
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          {currentIndex > 0 && (
            <TouchableOpacity
              style={[styles.arrowButton, styles.leftArrow, { top: height / 2 - 20 }]}
              onPress={goToPrev}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
          )}
          
          {currentIndex < images.length - 1 && (
            <TouchableOpacity
              style={[styles.arrowButton, styles.rightArrow, { top: height / 2 - 20 }]}
              onPress={goToNext}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="chevron-forward" size={24} color="white" />
            </TouchableOpacity>
          )}
        </>
      )}

       {/* Image Counter */}
       {showCounter && images.length > 1 && (
        <View style={styles.counterContainer}>
          <AppText variant="small" style={{ color: Colors.primary[500] }}>
            {currentIndex + 1} / {images.length}
          </AppText>
        </View>
      )}

      {/* Indicators */}
      {showIndicators && images.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {images.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicatorDot,
                { backgroundColor: index === currentIndex ? 'white' : 'rgba(255,255,255,0.5)' }
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  emptyContainer: {
    backgroundColor: '#F3F4F6', // gray.100
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 8,
  },
  arrowButton: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 999,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftArrow: {
    left: 8,
  },
  rightArrow: {
    right: 8,
  },
  counterContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});

export default ImageCarousel;