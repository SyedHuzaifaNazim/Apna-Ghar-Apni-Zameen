import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { Alert, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MOCK_PROPERTIES } from '@/api/apiMock';
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/context/FavoritesContext';

// Use standard View instead of NativeBase components to prevent crashes
const FavoritesScreen: React.FC = () => {
  const router = useRouter();
  const { favorites, removeFromFavorites } = useFavorites();
  
  // Mock Auth State
  const isAuthenticated = true; // Set to true for development/demo

  const favoriteProperties = useMemo(() => {
    return MOCK_PROPERTIES.filter(property => 
      favorites.includes(property.id)
    );
  }, [favorites]);

  const handlePropertyPress = (propertyId: number) => {
    router.push(`/listing/${propertyId}`);
  };

  const handleRemoveFavorite = (propertyId: number, propertyTitle: string) => {
    removeFromFavorites(propertyId);
    // Replaced Toast with Alert
    Alert.alert("Removed", `${propertyTitle} has been removed from your favorites.`);
  };

  const handleClearAll = () => {
    // Implement clear all logic if needed
    Alert.alert("Clear All", "This feature would clear all favorites.");
  };

  const handleSignIn = () => {
    router.replace('/login');
  };
  
  const renderHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
        
        <View style={styles.headerTitleContainer}>
          <AppText variant="h2" weight="bold">Favorites</AppText>
          {isAuthenticated && (
            <AppText variant="body" color="secondary">
              {favoriteProperties.length} saved properties
            </AppText>
          )}
        </View>

        {isAuthenticated && favoriteProperties.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.iconButton}>
            <Ionicons name="trash-outline" size={20} color={Colors.error[500]} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Ionicons name="lock-closed-outline" size={80} color={Colors.text.disabled} />
          <AppText variant="h2" weight="bold" align="center" style={styles.marginTop}>
            Sign In to View Favorites
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={styles.marginTopSmall}>
            Your favorite properties are saved securely to your account.
          </AppText>
          <AppButton 
            onPress={handleSignIn}
            style={styles.actionButton}
            leftIcon={<Ionicons name="log-in" size={16} color="white" />}
          >
            Sign In Now
          </AppButton>
        </View>
      </SafeAreaView>
    );
  }

  if (favoriteProperties.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        <View style={styles.centerContainer}>
          <Ionicons name="heart-outline" size={80} color={Colors.text.disabled} />
          <AppText variant="h2" weight="bold" align="center" style={styles.marginTop}>
            No favorites yet
          </AppText>
          <AppText variant="body" color="secondary" align="center" style={styles.marginTopSmall}>
            Start exploring properties and save your favorites to see them here
          </AppText>
          <AppButton 
            onPress={() => router.replace('/')}
            style={styles.actionButton}
            leftIcon={<Ionicons name="search" size={16} color="white" />}
          >
            Start Exploring
          </AppButton>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {renderHeader()}

      <FlashList
        data={favoriteProperties}
        renderItem={({ item }) => (
          <View style={styles.cardContainer}>
            <PropertyCard 
              property={item} 
              onPress={() => handlePropertyPress(item.id)}
            />
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleRemoveFavorite(item.id, item.title)}
            >
              <Ionicons name="heart" size={16} color={Colors.status.featured} />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        estimatedItemSize={300}
      />

      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <AppText variant="body" weight="medium" align="center">
            {favoriteProperties.length} properties in favorites
          </AppText>
          <View style={styles.buttonRow}>
            <AppButton 
              variant="outline" 
              style={styles.flexButton}
              onPress={() => router.push('/')}
            >
              Browse More
            </AppButton>
            <AppButton 
              variant="primary" 
              style={styles.flexButton}
              onPress={() => {
                Alert.alert("Share", "Sharing functionality would open here.");
              }}
              leftIcon={<Ionicons name="share-outline" size={16} color="white" />}
            >
              Share List
            </AppButton>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB', // gray.50
  },
  header: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB', // gray.200
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  backButton: {
    padding: 4,
  },
  headerTitleContainer: {
    flex: 1,
  },
  iconButton: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  marginTop: {
    marginTop: 24,
  },
  marginTopSmall: {
    marginTop: 8,
  },
  actionButton: {
    marginTop: 24,
    width: 200,
  },
  cardContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 999,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 120, // Space for footer
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  footerContent: {
    padding: 16,
    gap: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});

export default FavoritesScreen;