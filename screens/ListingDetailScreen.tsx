import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

// Hooks and Context
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import LoadingSpinner from '@/components/base/LoadingSpinner'; // <--- Added
import { Colors } from '@/constants/Colors';
import { useFavorites } from '@/context/FavoritesContext';
import { useFetchProperty } from '@/hooks/useFetchProperties'; // <--- USE REAL HOOK

const { width } = Dimensions.get('window');

const ListingDetailScreen = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const propertyId = params.id ? Number(params.id) : 0;
  
  const { isFavorite, toggleFavorite } = useFavorites();
  
  // Use the hook to fetch the specific property from POSTS_API
  const { property, loading, error } = useFetchProperty(propertyId);

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <LoadingSpinner text="Loading property details..." />
      </View>
    );
  }

  if (error || !property) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={64} color={Colors.error[500]} />
          <AppText variant="h3" weight="semibold" style={styles.errorText}>
            Property not found
          </AppText>
          <AppText variant="body" color="secondary" style={{marginBottom: 16}}>
            {error}
          </AppText>
          <AppButton onPress={() => router.back()} style={styles.backButton}>
            Go Back
          </AppButton>
        </View>
      </SafeAreaView>
    );
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `${(price / 1000000).toFixed(1)} Million`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)} Lac`;
    }
    return price.toLocaleString();
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header / Image Carousel */}
        <View style={styles.imageContainer}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false}>
            {property.images.map((image, index) => (
              <Image
                key={index}
                source={{ uri: image }}
                style={styles.propertyImage}
                resizeMode="cover"
              />
            ))}
          </ScrollView>
          
          {/* Back Button */}
          <TouchableOpacity
            style={[styles.iconButton, styles.backButtonPos]}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color={Colors.text.primary} />
          </TouchableOpacity>
          
          {/* Favorite Button */}
          <TouchableOpacity
            style={[styles.iconButton, styles.favButtonPos]}
            onPress={() => toggleFavorite(property.id)}
          >
            <Ionicons 
              name={isFavorite(property.id) ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite(property.id) ? Colors.status.featured : Colors.text.primary} 
            />
          </TouchableOpacity>
          
          {/* Badges */}
          <View style={styles.badgeContainer}>
            <View style={[
              styles.badge, 
              { backgroundColor: property.listingType === 'For Sale' ? Colors.success[500] : Colors.warning[500] }
            ]}>
              <AppText variant="small" weight="bold" color="inverse">
                {property.listingType}
              </AppText>
            </View>
            
            {property.isFeatured && (
              <View style={[styles.badge, { backgroundColor: Colors.secondary[500] }]}>
                <AppText variant="small" weight="bold" color="inverse">
                  Featured
                </AppText>
              </View>
            )}
          </View>
        </View>

        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.section}>
            <AppText variant="h2" weight="bold" color="primary">
              {property.title}
            </AppText>
            <AppText variant="h1" weight="bold" color="primary" style={{ color: Colors.primary[500] }}>
              {formatPrice(property.price)} {property.currency}
            </AppText>
          </View>

          {/* Key Details */}
          <View style={styles.detailsCard}>
            <View style={styles.detailItem}>
              <Ionicons name="bed-outline" size={24} color={Colors.primary[500]} />
              <AppText variant="small" color="secondary">Bedrooms</AppText>
              <AppText variant="body" weight="bold">{property.bedrooms}</AppText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="resize-outline" size={24} color={Colors.primary[500]} />
              <AppText variant="small" color="secondary">Area</AppText>
              <AppText variant="body" weight="bold">{property.areaSize} sq ft</AppText>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="business-outline" size={24} color={Colors.primary[500]} />
              <AppText variant="small" color="secondary">Type</AppText>
              <AppText variant="body" weight="bold">{property.propertyCategory}</AppText>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Description */}
          <View style={styles.section}>
            <AppText variant="h3" weight="semibold">Description</AppText>
            <AppText variant="body" color="secondary" style={styles.descriptionText}>
              {property.description}
            </AppText>
          </View>

          <View style={styles.divider} />

          {/* Address */}
          <View style={styles.section}>
            <AppText variant="h3" weight="semibold">Address</AppText>
            <View style={styles.addressRow}>
              <Ionicons name="location-outline" size={20} color={Colors.text.secondary} />
              <View style={{ flex: 1 }}>
                <AppText variant="body" color="primary">{property.address.line1}</AppText>
                <AppText variant="body" color="secondary">{property.address.city}</AppText>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Map */}
          <View style={styles.section}>
            <AppText variant="h3" weight="semibold" style={{ marginBottom: 8 }}>Location</AppText>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: property.address.latitude,
                  longitude: property.address.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
                scrollEnabled={false}
                zoomEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: property.address.latitude,
                    longitude: property.address.longitude,
                  }}
                  title={property.title}
                />
              </MapView>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Contact Actions */}
          <View style={[styles.section, { paddingBottom: 32 }]}>
            <AppText variant="h3" weight="semibold" align="center" style={{ marginBottom: 16 }}>
              Interested in this property?
            </AppText>
            <View style={styles.actionButtonsRow}>
              <AppButton 
                variant="outline" 
                style={styles.flexButton}
                leftIcon={<Ionicons name="call-outline" size={20} color={Colors.primary[500]} />}
                onPress={() => {}}
              >
                Call Agent
              </AppButton>
              <AppButton 
                variant="outline"
                style={styles.flexButton}
                leftIcon={<Ionicons name="chatbubble-outline" size={20} color={Colors.primary[500]} />}
                onPress={() => {}}
              >
                Message
              </AppButton>
            </View>
            <AppButton 
              style={{ marginTop: 12 }}
              leftIcon={<Ionicons name="calendar-outline" size={20} color="white" />}
              onPress={() => {}}
            >
              Schedule Viewing
            </AppButton>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
  },
  backButton: {
    marginTop: 16,
    width: 200,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
    width: '100%',
  },
  propertyImage: {
    width: width,
    height: 300,
  },
  iconButton: {
    position: 'absolute',
    top: 48, // Adjust for status bar
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  backButtonPos: {
    left: 16,
  },
  favButtonPos: {
    right: 16,
  },
  badgeContainer: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  contentContainer: {
    padding: 16,
  },
  section: {
    marginBottom: 16,
    gap: 8,
  },
  detailsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.gray[50],
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
  },
  detailItem: {
    alignItems: 'center',
    gap: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.gray[200],
    marginVertical: 16,
  },
  descriptionText: {
    lineHeight: 24,
  },
  addressRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  flexButton: {
    flex: 1,
  },
});

export default ListingDetailScreen;