import { Ionicons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { MOCK_PROPERTIES, Property } from '@/api/apiMock';
import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';

const MyListingsScreen: React.FC = () => {
  const router = useRouter();
  
  // Mock data: Filter properties posted by an Agent/Developer/Owner
  const myListings: Property[] = MOCK_PROPERTIES.filter(p => p.ownerType === 'Agent' || p.ownerType === 'Developer' || p.ownerType === 'Owner').slice(0, 5);

  const handleAddListing = () => {
    // Navigate to a new listing creation form
    router.push('/create-listing');
  };

  const handleViewDetails = (id: number) => {
    router.push(`/listing/${id}`);
  };

  return (
    <SafeAreaView style={styles.flex1}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
            </TouchableOpacity>
            <AppText variant="h2" weight="bold">My Listings</AppText>
        </View>

        <AppButton 
            onPress={handleAddListing}
            leftIcon={<Ionicons name="add-circle" size={20} color="white" />}
            style={styles.addButton}
        >
            Post New Property
        </AppButton>
        
        <FlashList
            data={myListings}
            renderItem={({ item }) => (
                <View style={styles.cardWrapper}>
                    <PropertyCard 
                        property={item} 
                        onPress={() => handleViewDetails(item.id)}
                    />
                    <View style={styles.cardActions}>
                        <AppButton 
                            onPress={() => {/* TODO: implement edit */}}
                            variant="outline"
                            style={[styles.actionButton, { borderColor: Colors.primary[500] }]}
                            textStyle={{ color: Colors.primary[500] }}
                        >
                            Edit
                        </AppButton>
                        <AppButton 
                            onPress={() => {/* TODO: implement delete */}}
                            variant="outline"
                            style={[styles.actionButton, { borderColor: Colors.error[500] }]}
                            textStyle={{ color: Colors.error[500] }}
                        >
                            Delete
                        </AppButton>
                    </View>
                </View>
            )}
            keyExtractor={item => item.id.toString()}
            estimatedItemSize={350}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
                <View style={styles.emptyContainer}>
                    <Ionicons name="home-outline" size={64} color={Colors.text.disabled} />
                    <AppText variant="h3" fontWeight="semibold" style={styles.emptyTitle}>
                        No active listings
                    </AppText>
                    <AppText variant="body" color="secondary" style={styles.emptyText}>
                        Start posting your properties to reach thousands of buyers!
                    </AppText>
                </View>
            }
            contentContainerStyle={styles.listContent}
        />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  addButton: {
      marginHorizontal: 16,
      marginTop: 8,
      marginBottom: 16,
  },
  cardWrapper: {
      marginHorizontal: 16,
      marginBottom: 20,
      padding: 10,
      backgroundColor: 'white',
      borderRadius: 16,
      shadowColor: Colors.shadow.dark,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
  },
  cardActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
      borderTopWidth: 1,
      borderTopColor: Colors.gray[100],
      paddingTop: 10,
      paddingHorizontal: 6,
  },
  actionButton: {
      flex: 1,
      marginHorizontal: 4,
      backgroundColor: 'transparent',
      borderWidth: 1.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  emptyTitle: {
    marginTop: 16,
    textAlign: 'center',
  },
  emptyText: {
    marginTop: 8,
    textAlign: 'center',
  },
  listContent: {
    paddingBottom: 40,
  },
});

export default MyListingsScreen;