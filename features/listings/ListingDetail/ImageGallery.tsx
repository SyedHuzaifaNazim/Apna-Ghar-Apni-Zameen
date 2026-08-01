import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';

interface ImageGalleryProps {
  images: string[];
  initialIndex?: number;
  height?: number;
  showThumbnails?: boolean;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  initialIndex = 0,
  height = 300,
  showThumbnails = true,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(initialIndex);
  const [imageLoading, setImageLoading] = useState(true);
  const flatListRef = useRef<FlatList<string>>(null);
  const { width: screenWidth } = useWindowDimensions();

  const handleImagePress = (index: number) => {
    setModalIndex(index);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentIndex(modalIndex);
  };

  const goToNext = () => {
    if (modalIndex < images.length - 1) {
      const newIndex = modalIndex + 1;
      setModalIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const goToPrev = () => {
    if (modalIndex > 0) {
      const newIndex = modalIndex - 1;
      setModalIndex(newIndex);
      flatListRef.current?.scrollToIndex({ index: newIndex, animated: true });
    }
  };

  const handleThumbnailPress = (index: number) => {
    setCurrentIndex(index);
  };

  const onImageLoad = () => setImageLoading(false);
  const onImageLoadStart = () => setImageLoading(true);

  if (!images || images.length === 0) {
    return (
      <View style={[styles.noImagesContainer, { height }]}>
        <Ionicons name="image-outline" size={48} color={Colors.gray[400]} />
        <AppText variant="body" color="secondary" style={styles.noImagesText}>
          No images available
        </AppText>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={[styles.mainImageContainer, { height }]}>
          <Pressable style={styles.imagePressable} onPress={() => handleImagePress(currentIndex)}>
            <Image
              source={{ uri: images[currentIndex] }}
              style={styles.mainImage}
              resizeMode="cover"
              onLoadStart={onImageLoadStart}
              onLoad={onImageLoad}
            />

            {imageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary[500]} />
              </View>
            )}

            <View style={styles.imageCounter}>
              <AppText variant="bodySmall" style={styles.imageCounterText}>
                {currentIndex + 1} / {images.length}
              </AppText>
            </View>

            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.prevButton]}
                    onPress={() => setCurrentIndex(currentIndex - 1)}
                    accessibilityRole="button"
                    accessibilityLabel="Previous image"
                  >
                    <Ionicons name="chevron-back" size={24} color={Colors.text.inverse} />
                  </TouchableOpacity>
                )}
                {currentIndex < images.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={() => setCurrentIndex(currentIndex + 1)}
                    accessibilityRole="button"
                    accessibilityLabel="Next image"
                  >
                    <Ionicons name="chevron-forward" size={24} color={Colors.text.inverse} />
                  </TouchableOpacity>
                )}
              </>
            )}
          </Pressable>
        </View>

        {showThumbnails && images.length > 1 && (
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={styles.thumbnailsContainer}
            renderItem={({ item, index }) => (
              <Pressable
                style={[
                  styles.thumbnailContainer,
                  {
                    opacity: currentIndex === index ? 1 : 0.6,
                    borderWidth: currentIndex === index ? 2 : 0,
                    borderColor: currentIndex === index ? Colors.primary[500] : 'transparent',
                  },
                ]}
                onPress={() => handleThumbnailPress(index)}
                accessibilityRole="button"
                accessibilityLabel={`View image ${index + 1}`}
              >
                <Image source={{ uri: item }} style={styles.thumbnail} resizeMode="cover" />
              </Pressable>
            )}
          />
        )}
      </View>

      <Modal visible={isModalOpen} transparent animationType="fade" onRequestClose={handleModalClose}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
              accessibilityRole="button"
              accessibilityLabel="Close gallery"
            >
              <Ionicons name="close" size={24} color={Colors.text.inverse} />
            </TouchableOpacity>

            <View style={styles.modalImageCounter}>
              <AppText variant="body" style={styles.modalImageCounterText}>
                {modalIndex + 1} / {images.length}
              </AppText>
            </View>

            <View style={styles.headerSpacer} />
          </View>

          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              initialScrollIndex={modalIndex}
              getItemLayout={(_data, index) => ({ length: screenWidth, offset: screenWidth * index, index })}
              onMomentumScrollEnd={event => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setModalIndex(newIndex);
              }}
              renderItem={({ item }) => (
                <View style={[styles.modalImageContainer, { width: screenWidth }]}>
                  <Image
                    source={{ uri: item }}
                    style={[styles.modalImage, { width: screenWidth, height: screenWidth }]}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </View>

          {images.length > 1 && (
            <>
              {modalIndex > 0 && (
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalPrevButton]}
                  onPress={goToPrev}
                  accessibilityRole="button"
                  accessibilityLabel="Previous image"
                >
                  <Ionicons name="chevron-back" size={32} color={Colors.text.inverse} />
                </TouchableOpacity>
              )}
              {modalIndex < images.length - 1 && (
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNextButton]}
                  onPress={goToNext}
                  accessibilityRole="button"
                  accessibilityLabel="Next image"
                >
                  <Ionicons name="chevron-forward" size={32} color={Colors.text.inverse} />
                </TouchableOpacity>
              )}
            </>
          )}

          {images.length > 1 && (
            <View style={styles.modalDotsContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.modalDot,
                    { backgroundColor: index === modalIndex ? Colors.text.inverse : 'rgba(255,255,255,0.5)' },
                  ]}
                />
              ))}
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%' },
  mainImageContainer: { width: '100%', borderRadius: BorderRadius.lg, overflow: 'hidden', marginBottom: Spacing.md },
  imagePressable: { flex: 1 },
  mainImage: { width: '100%', height: '100%' },
  loadingContainer: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  imageCounter: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.round,
  },
  imageCounterText: { color: Colors.text.inverse },
  navButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  prevButton: { left: Spacing.sm },
  nextButton: { right: Spacing.sm },
  thumbnailsContainer: { paddingHorizontal: Spacing.xxs },
  thumbnailContainer: { width: 60, height: 60, borderRadius: BorderRadius.md, overflow: 'hidden', marginRight: Spacing.sm },
  thumbnail: { width: '100%', height: '100%' },
  noImagesContainer: {
    width: '100%',
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  noImagesText: { marginTop: Spacing.sm },
  modalContainer: { flex: 1, backgroundColor: 'black' },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    zIndex: 10,
  },
  closeButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImageCounter: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: Spacing.sm + 4,
    paddingVertical: Spacing.xxs,
    borderRadius: BorderRadius.round,
  },
  modalImageCounterText: { color: Colors.text.inverse },
  headerSpacer: { width: 40 },
  carouselContainer: { flex: 1, justifyContent: 'center' },
  modalImageContainer: { justifyContent: 'center', alignItems: 'center' },
  modalImage: {},
  modalNavButton: {
    position: 'absolute',
    top: '50%',
    marginTop: -25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalPrevButton: { left: Spacing.md },
  modalNextButton: { right: Spacing.md },
  modalDotsContainer: { position: 'absolute', bottom: Spacing.md, left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  modalDot: { width: 8, height: 8, borderRadius: 4, marginHorizontal: Spacing.xxs },
});

export default ImageGallery;
