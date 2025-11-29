// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import {
    Box,
    Center,
    FlatList,
    HStack,
    IconButton,
    Image,
    Modal,
    Pressable,
    VStack
} from 'native-base';
import React, { useRef, useState } from 'react';
import { Dimensions } from 'react-native';

import AppText from '../../../components/base/AppText';
import LoadingSpinner from '../../../components/base/LoadingSpinner';
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
      <Box 
        width="100%" 
        height={height} 
        bg={Colors.gray[100]}
        justifyContent="center"
        alignItems="center"
        borderRadius={BorderRadius.lg}
      >
        <Ionicons name="image-outline" size={48} color={Colors.gray[400]} />
        <AppText variant="body" color="secondary" mt={2}>
          No images available
        </AppText>
      </Box>
    );
  }

  return (
    <>
      {/* Main Image Gallery */}
      <VStack space={4}>
        {/* Main Image */}
        <Box position="relative" height={height} borderRadius={BorderRadius.lg} overflow="hidden">
          <Pressable onPress={() => handleImagePress(currentIndex)} flex={1}>
            <Image
              source={{ uri: images[currentIndex] }}
              alt={`Property image ${currentIndex + 1}`}
              width="100%"
              height="100%"
              resizeMode="cover"
              onLoadStart={onImageLoadStart}
              onLoad={onImageLoad}
            />
            
            {imageLoading && (
              <Center position="absolute" top={0} left={0} right={0} bottom={0}>
                <LoadingSpinner size="small" />
              </Center>
            )}

            {/* Image Counter */}
            <Box
              position="absolute"
              top={4}
              right={4}
              bg="rgba(0,0,0,0.7)"
              px={3}
              py={1}
              borderRadius={BorderRadius.full}
            >
              <AppText variant="small" color="inverse">
                {currentIndex + 1} / {images.length}
              </AppText>
            </Box>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {currentIndex > 0 && (
                  <IconButton
                    position="absolute"
                    left={2}
                    top="50%"
                    transform={[{ translateY: -20 }]}
                    icon={<Ionicons name="chevron-back" size={24} color="white" />}
                    onPress={() => setCurrentIndex(currentIndex - 1)}
                    bg="rgba(0,0,0,0.5)"
                    borderRadius="full"
                    _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
                  />
                )}
                {currentIndex < images.length - 1 && (
                  <IconButton
                    position="absolute"
                    right={2}
                    top="50%"
                    transform={[{ translateY: -20 }]}
                    icon={<Ionicons name="chevron-forward" size={24} color="white" />}
                    onPress={() => setCurrentIndex(currentIndex + 1)}
                    bg="rgba(0,0,0,0.5)"
                    borderRadius="full"
                    _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
                  />
                )}
              </>
            )}
          </Pressable>
        </Box>

        {/* Thumbnails */}
        {showThumbnails && images.length > 1 && (
          <FlatList
            data={images}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ paddingHorizontal: 4 }}
            renderItem={({ item, index }) => (
              <Pressable
                onPress={() => handleThumbnailPress(index)}
                mr={2}
                opacity={currentIndex === index ? 1 : 0.6}
                borderWidth={2}
                borderColor={currentIndex === index ? Colors.primary[500] : 'transparent'}
                borderRadius={BorderRadius.md}
                overflow="hidden"
              >
                <Image
                  source={{ uri: item }}
                  alt={`Thumbnail ${index + 1}`}
                  width={60}
                  height={60}
                  resizeMode="cover"
                />
              </Pressable>
            )}
          />
        )}
      </VStack>

      {/* Full Screen Modal */}
      <Modal isOpen={isModalOpen} onClose={handleModalClose} size="full">
        <Modal.Content backgroundColor="black" margin={0} maxWidth="100%">
          <VStack flex={1} justifyContent="center">
            {/* Header */}
            <HStack 
              position="absolute" 
              top={0} 
              left={0} 
              right={0} 
              justifyContent="space-between" 
              alignItems="center"
              p={4}
              zIndex={10}
            >
              <IconButton
                icon={<Ionicons name="close" size={24} color="white" />}
                onPress={handleModalClose}
                bg="rgba(0,0,0,0.5)"
                borderRadius="full"
                _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
              />
              
              <Box bg="rgba(0,0,0,0.7)" px={3} py={1} borderRadius={BorderRadius.full}>
                <AppText variant="body" color="inverse">
                  {modalIndex + 1} / {images.length}
                </AppText>
              </Box>
              
              <Box width={10} /> {/* Spacer for balance */}
            </HStack>

            {/* Image Carousel */}
            <Box flex={1} justifyContent="center">
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
                  <Box width={screenWidth} height={screenWidth} justifyContent="center">
                    <Image
                      source={{ uri: item }}
                      alt="Property image"
                      width={screenWidth}
                      height={screenWidth}
                      resizeMode="contain"
                    />
                  </Box>
                )}
              />
            </Box>

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                {modalIndex > 0 && (
                  <IconButton
                    position="absolute"
                    left={4}
                    top="50%"
                    transform={[{ translateY: -20 }]}
                    icon={<Ionicons name="chevron-back" size={32} color="white" />}
                    onPress={goToPrev}
                    bg="rgba(0,0,0,0.5)"
                    borderRadius="full"
                    _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
                  />
                )}
                {modalIndex < images.length - 1 && (
                  <IconButton
                    position="absolute"
                    right={4}
                    top="50%"
                    transform={[{ translateY: -20 }]}
                    icon={<Ionicons name="chevron-forward" size={32} color="white" />}
                    onPress={goToNext}
                    bg="rgba(0,0,0,0.5)"
                    borderRadius="full"
                    _pressed={{ bg: 'rgba(0,0,0,0.7)' }}
                  />
                )}
              </>
            )}

            {/* Thumbnails at bottom */}
            {images.length > 1 && (
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
                    bg={index === modalIndex ? 'white' : 'rgba(255,255,255,0.5)'}
                  />
                ))}
              </HStack>
            )}
          </VStack>
        </Modal.Content>
      </Modal>
    </>
  );
};

export default ImageGallery;