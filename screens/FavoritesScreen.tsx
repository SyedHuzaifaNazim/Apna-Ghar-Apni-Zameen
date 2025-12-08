import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import { Box, Center, HStack, IconButton, useToast, VStack } from 'native-base';
import React from 'react';

import { MOCK_PROPERTIES } from '@/api/apiMock';
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/context/FavoritesContext';

const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  const toast = useToast();
  const { favorites, removeFromFavorites } = useFavorites();

  const favoriteProperties = MOCK_PROPERTIES.filter(property => 
    favorites.includes(property.id)
  );

  const handlePropertyPress = (propertyId: number) => {
    router.push(`/listing/${propertyId}`);
  };

  const handleRemoveFavorite = (propertyId: number, propertyTitle: string) => {
    removeFromFavorites(propertyId);
    toast.show({
      title: "Removed from favorites",
      description: `${propertyTitle} has been removed from your favorites`,
      variant: "subtle",
      duration: 2000,
    });
  };

  const handleClearAll = () => {
    // This would clear all favorites - in a real app, you'd implement this
    toast.show({
      title: "Clear All",
      description: "This would clear all your favorites",
      variant: "subtle",
    });
  };

  const handleStartExploring = () => {
    router.replace('/');
  };

  if (favoriteProperties.length === 0) {
    return (
      <Box flex={1} bg="white" safeArea>
        {/* Header */}
        <HStack alignItems="center" p={4} space={4}>
          {router.canGoBack() && (
            <IconButton
              icon={<Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />}
              onPress={() => router.back()}
              variant="ghost"
            />
          )}
          <AppText variant="h2" weight="bold">Favorites</AppText>
        </HStack>

        {/* Empty State */}
        <Center flex={1} px={4}>
          <Ionicons name="heart-outline" size={80} color={Colors.text.disabled} />
          <AppText variant="h2" weight="bold" align="center" style={{ marginTop: 24 }}>
            No favorites yet
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={{ marginTop: 8 }}>
            Start exploring properties and save your favorites to see them here
          </AppText>
          <AppButton 
            onPress={handleStartExploring}
            variant="primary"
            style={{ marginTop: 24 }}
            leftIcon={<Ionicons name="search" size={16} color="white" />}
          >
            Start Exploring
          </AppButton>
        </Center>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="gray.50" safeArea>
      {/* Header */}
      <Box bg="white" px={4} py={3} shadow={1}>
        <HStack alignItems="center" space={4}>
          {router.canGoBack() && (
            <IconButton
              icon={<Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />}
              onPress={() => router.back()}
              variant="ghost"
            />
          )}
          
          <VStack flex={1}>
            <AppText variant="h2" weight="bold">Favorites</AppText>
            <AppText variant="body" color="secondary">
              {favoriteProperties.length} saved properties
            </AppText>
          </VStack>

          <IconButton
            icon={<Ionicons name="trash-outline" size={20} color={Colors.error[500]} />}
            onPress={handleClearAll}
            variant="ghost"
          />
        </HStack>
      </Box>

      {/* Favorites List */}
      <FlashList
        data={favoriteProperties}
        renderItem={({ item }) => (
          <Box position="relative">
            <PropertyCard 
              property={item} 
              onPress={() => handlePropertyPress(item.id)}
            />
            <IconButton
              position="absolute"
              top={2}
              right={2}
              zIndex={10}
              backgroundColor="white"
              borderRadius="full"
              icon={<Ionicons name="heart" size={16} color={Colors.status.featured} />}
              onPress={() => handleRemoveFavorite(item.id, item.title)}
              size="sm"
              shadow={1}
            />
          </Box>
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ 
          padding: 16,
          paddingBottom: 100
        }}
      />

      {/* Bottom Actions */}
      <Box 
        position="absolute" 
        bottom={0} 
        left={0} 
        right={0} 
        bg="white" 
        p={4} 
        borderTopWidth={1}
        borderTopColor="gray.200"
      >
        <VStack space={3}>
          <AppText variant="body" weight="medium" align="center">
            {favoriteProperties.length} properties in favorites
          </AppText>
          <HStack space={3}>
            <AppButton 
              variant="outline" 
              style={{ flex: 1 }}
              onPress={() => router.push('/')}
            >
              Browse More
            </AppButton>
            <AppButton 
              variant="primary" 
              style={{ flex: 1 }}
              onPress={() => {
                // This would share the favorites list
                toast.show({
                  title: "Share Favorites",
                  description: "Share your favorite properties with others",
                  variant: "subtle",
                });
              }}
              leftIcon={<Ionicons name="share-outline" size={16} color="white" />}
            >
              Share List
            </AppButton>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default FavoritesScreen;