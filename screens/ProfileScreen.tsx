import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  Box,
  Button,
  Divider,
  HStack,
  Image,
  Pressable,
  ScrollView,
  Text,
  VStack
} from 'native-base';
import React from 'react';

import { MOCK_PROPERTIES } from '@/api/apiMock';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/context/FavoritesContext';

const ProfileScreen = () => {
  const router = useRouter();
  const { favorites } = useFavorites();

  const favoriteProperties = MOCK_PROPERTIES.filter(property => 
    favorites.includes(property.id)
  );

  const menuItems = [
    {
      icon: 'heart-outline',
      title: 'Favorites',
      description: `${favorites.length} saved properties`,
      path: '/favorites',
      color: Colors.status.featured
    },
    {
      icon: 'notifications-outline',
      title: 'Notifications',
      description: 'Property alerts and updates',
      path: '/notifications',
      color: Colors.secondary
    },
    {
      icon: 'settings-outline',
      title: 'Settings',
      description: 'App preferences',
      path: '/settings',
      color: Colors.text.secondary
    },
    {
      icon: 'help-circle-outline',
      title: 'Help & Support',
      description: 'Get assistance',
      path: undefined,
      color: Colors.primary
    },
    {
      icon: 'document-text-outline',
      title: 'Terms & Privacy',
      description: 'Legal information',
      path: undefined,
      color: Colors.text.primary
    },
  ];

  return (
    <Box flex={1} bg="gray.50" safeArea>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Box bg="white" px={4} py={6}>
          <HStack space={4} alignItems="center">
            <Box 
              width={40} 
              height={40} 
              borderRadius="full" 
              bg="primary.100"
              justifyContent="center"
              alignItems="center"
            >
              <Ionicons name="person" size={40} color={Colors.primary[500]} />
            </Box>
            <VStack flex={1}>
              <Text fontSize="xl" fontWeight="bold" color={Colors.primary[500]}>Welcome!</Text>
              <Text fontSize="md" color="text.secondary" mt={1}>
                Sign in to access all features
              </Text>
              <HStack space={1} mt={0} color={Colors.primary[500]}>
                <Button 
                  variant="solid" 
                  backgroundColor={Colors.primary[500]}
                  flex={1}
                  onPress={() => router.push('/(auth)/login')}
                >
                  Sign In
                </Button>
                <Button 
                  variant="outline" 
                  flex={1}
                  borderColor={Colors.primary[500]}
                  onPress={() => router.push('/(auth)/register')}
                >
                  Sign Up
                </Button>
              </HStack>
            </VStack>
          </HStack>
        </Box>

        {/* Quick Stats */}
        <HStack bg="white" mt={4} mx={4} p={4} borderRadius="lg" shadow={1}>
          <VStack flex={1} alignItems="center" space={1}>
            <Text fontSize="2xl" fontWeight="bold" color="primary.500">
              {favorites.length}
            </Text>
            <Text fontSize="sm" color="text.secondary">Favorites</Text>
          </VStack>
          <VStack flex={1} alignItems="center" space={1}>
            <Text fontSize="2xl" fontWeight="bold" color="primary.500">
              0
            </Text>
            <Text fontSize="sm" color="text.secondary">Viewed</Text>
          </VStack>
          <VStack flex={1} alignItems="center" space={1}>
            <Text fontSize="2xl" fontWeight="bold" color="primary.500">
              0
            </Text>
            <Text fontSize="sm" color="text.secondary">Contacts</Text>
          </VStack>
        </HStack>

        {/* Favorite Properties Preview */}
        {favoriteProperties.length > 0 && (
          <Box bg="white" mt={4} mx={4} p={4} borderRadius="lg" shadow={1}>
            <HStack justifyContent="space-between" alignItems="center" mb={3}>
              <Text fontSize="lg" fontWeight="semibold">Favorite Properties</Text>
              <Text fontSize="sm" color="primary.500">{favoriteProperties.length} items</Text>
            </HStack>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <HStack space={3}>
                {favoriteProperties.slice(0, 3).map(property => (
                  <Pressable 
                    key={property.id}
                  onPress={() => router.push(`/listing/${property.id}`)}
                  >
                    <Box width={200} borderRadius="lg" overflow="hidden" bg="gray.100">
                      <Image
                        source={{ uri: property.images[0] }}
                        alt={property.title}
                        height={120}
                        resizeMode="cover"
                      />
                      <VStack p={2} space={1}>
                        <Text fontSize="sm" fontWeight="medium" numberOfLines={1}>
                          {property.title}
                        </Text>
                        <Text fontSize="lg" fontWeight="bold" color="primary.500">
                          {property.price.toLocaleString()} {property.currency}
                        </Text>
                        <Text fontSize="xs" color="text.secondary" numberOfLines={1}>
                          {property.address.city}
                        </Text>
                      </VStack>
                    </Box>
                  </Pressable>
                ))}
              </HStack>
            </ScrollView>
          </Box>
        )}

        {/* Menu Items */}
        <Box bg="white" mt={4} mx={4} borderRadius="lg" shadow={1} overflow="hidden">
          {menuItems.map((item, index) => (
            <Box key={item.title}>
              <Pressable 
                onPress={() => {
                  if (item.path) {
                    router.push(item.path as any);
                  }
                }}
                _pressed={{ backgroundColor: 'gray.50' }}
              >
                <HStack space={4} alignItems="center" p={4}>
                  <Box 
                    width={10} 
                    height={10} 
                    borderRadius="lg" 
                    backgroundColor={`${item.color}15`}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Ionicons name={item.icon as any} size={20} color={item.color[500]} />
                  </Box>
                  <VStack flex={1}>
                    <Text fontSize="md" fontWeight="medium">{item.title}</Text>
                    <Text fontSize="sm" color="text.secondary">{item.description}</Text>
                  </VStack>
                  <Ionicons name="chevron-forward" size={20} color={Colors.text.disabled} />
                </HStack>
              </Pressable>
              {index < menuItems.length - 1 && <Divider />}
            </Box>
          ))}
        </Box>

        {/* App Info */}
        <Box alignItems="center" py={8}>
          <Text fontSize="sm" color="text.secondary">
            Apna Ghar Apni Zameen v1.0.0
          </Text>
          <Text fontSize="xs" color="text.disabled" mt={1}>
            Your trusted real estate partner
          </Text>
        </Box>
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen;