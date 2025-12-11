import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';

const { width: screenWidth } = Dimensions.get('window');

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
  const flatListRef = useRef<FlatList>(null);

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

  const onImageLoad = () => {
    setImageLoading(false);
  };

  const onImageLoadStart = () => {
    setImageLoading(true);
  };

  if (!images || images.length === 0) {
    return (
      <View style={[styles.noImagesContainer, { height }]}>
        <Ionicons name="image-outline" size={48} color={Colors.gray[400]} />
        <Text style={styles.noImagesText}>No images available</Text>
      </View>
    );
  }

  return (
    <>
      {/* Main Image Gallery */}
      <View style={styles.container}>
        {/* Main Image */}
        <View style={[styles.mainImageContainer, { height }]}>
          <Pressable 
            style={styles.imagePressable}
            onPress={() => handleImagePress(currentIndex)}
          >
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

            {/* Image Counter */}
            <View style={styles.imageCounter}>
              <Text style={styles.imageCounterText}>
                {currentIndex + 1} / {images.length}
              </Text>
            </View>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.prevButton]}
                    onPress={() => setCurrentIndex(currentIndex - 1)}
                  >
                    <Ionicons name="chevron-back" size={24} color="white" />
                  </TouchableOpacity>
                )}
                {currentIndex < images.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.nextButton]}
                    onPress={() => setCurrentIndex(currentIndex + 1)}
                  >
                    <Ionicons name="chevron-forward" size={24} color="white" />
                  </TouchableOpacity>
                )}
              </>
            )}
          </Pressable>
        </View>

        {/* Thumbnails */}
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
                  }
                ]}
                onPress={() => handleThumbnailPress(index)}
              >
                <Image
                  source={{ uri: item }}
                  style={styles.thumbnail}
                  resizeMode="cover"
                />
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Full Screen Modal */}
      <Modal
        visible={isModalOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleModalClose}
      >
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleModalClose}
            >
              <Ionicons name="close" size={24} color="white" />
            </TouchableOpacity>
            
            <View style={styles.modalImageCounter}>
              <Text style={styles.modalImageCounterText}>
                {modalIndex + 1} / {images.length}
              </Text>
            </View>
            
            <View style={styles.headerSpacer} />
          </View>

          {/* Image Carousel */}
          <View style={styles.carouselContainer}>
            <FlatList
              ref={flatListRef}
              data={images}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item, index) => index.toString()}
              initialScrollIndex={modalIndex}
              getItemLayout={(data, index) => ({
                length: screenWidth,
                offset: screenWidth * index,
                index,
              })}
              onMomentumScrollEnd={(event) => {
                const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
                setModalIndex(newIndex);
              }}
              renderItem={({ item }) => (
                <View style={styles.modalImageContainer}>
                  <Image
                    source={{ uri: item }}
                    style={styles.modalImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            />
          </View>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              {modalIndex > 0 && (
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalPrevButton]}
                  onPress={goToPrev}
                >
                  <Ionicons name="chevron-back" size={32} color="white" />
                </TouchableOpacity>
              )}
              {modalIndex < images.length - 1 && (
                <TouchableOpacity
                  style={[styles.modalNavButton, styles.modalNextButton]}
                  onPress={goToNext}
                >
                  <Ionicons name="chevron-forward" size={32} color="white" />
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Thumbnails at bottom */}
          {images.length > 1 && (
            <View style={styles.modalDotsContainer}>
              {images.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.modalDot,
                    {
                      backgroundColor: index === modalIndex ? 'white' : 'rgba(255,255,255,0.5)',
                    }
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
  container: {
    width: '100%',
  },
  mainImageContainer: {
    width: '100%',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imagePressable: {
    flex: 1,
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  imageCounter: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
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
  prevButton: {
    left: 8,
  },
  nextButton: {
    right: 8,
  },
  thumbnailsContainer: {
    paddingHorizontal: 4,
  },
  thumbnailContainer: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.md,
    overflow: 'hidden',
    marginRight: 8,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  noImagesContainer: {
    width: '100%',
    backgroundColor: Colors.gray[100],
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.lg,
  },
  noImagesText: {
    color: Colors.text.secondary,
    marginTop: 8,
    fontSize: 14,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  modalHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: BorderRadius.round,
  },
  modalImageCounterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  headerSpacer: {
    width: 40,
  },
  carouselContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalImageContainer: {
    width: screenWidth,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: screenWidth,
    height: screenWidth,
  },
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
  modalPrevButton: {
    left: 16,
  },
  modalNextButton: {
    right: 16,
  },
  modalDotsContainer: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  modalDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default ImageGallery;