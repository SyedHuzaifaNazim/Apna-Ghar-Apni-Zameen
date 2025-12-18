// screens/IndustrialHubScreen.tsx
import { Ionicons } from '@expo/vector-icons';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import { useRouter } from 'expo-router';
import React, { useCallback, useMemo } from 'react';
import { SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Property } from '@/api/apiMock';
import { useDrawer } from '@/app/_layout';
import AppText from '@/components/base/AppText';
import PropertyCard from '@/components/ui/PropertyCard';
import { Colors } from '@/constants/Colors';
import { useFetchProperties } from '@/hooks/useFetchProperties';

const IndustrialHubScreen: React.FC = () => {
    const router = useRouter();
    const { openDrawer } = useDrawer(); 
    const { properties, loading, refetch } = useFetchProperties();
    
    // Logic to ensure property data is filtered correctly.
    const industrialProperties = useMemo(() => {
        return properties.filter(p => 
            p.propertyCategory.includes('Commercial') || 
            p.propertyCategory.includes('Industrial') || 
            p.propertyCategory.includes('Warehouse') || 
            p.propertyCategory.includes('Factory') ||
            p.propertyCategory.includes('Retail')
        );
    }, [properties]);

    const handlePropertyPress = (id: number) => {
        router.push(`/listing/${id}`);
    };

    // 1. Explicitly typing renderItem solves most TS mismatch issues
    const renderItem: ListRenderItem<Property> = useCallback(({ item }) => (
        <View style={styles.cardWrapper}>
            <PropertyCard 
                property={item} 
                onPress={() => handlePropertyPress(item.id)}
            />
        </View>
    ), []);

    return (
        <SafeAreaView style={styles.flex1}>
            <View style={styles.header}>
                <TouchableOpacity onPress={openDrawer} style={styles.hamburgerButton}>
                    <Ionicons name="menu" size={28} color={Colors.primary[500]} />
                </TouchableOpacity>
                <AppText variant="h2" weight="bold" style={styles.headerTitle}>Industrial Hub</AppText>
                
                <TouchableOpacity onPress={() => router.push('/search')} style={styles.searchButton}>
                    <Ionicons name="search" size={24} color={Colors.primary[500]} />
                </TouchableOpacity>
            </View>

            {loading ? (
                <View style={styles.center}>
                    <AppText variant="body" color="secondary">Loading Industrial Listings...</AppText>
                </View>
            ) : (
                <FlashList
                    data={industrialProperties}
                    renderItem={renderItem}
                    keyExtractor={(item: Property) => item.id.toString()}
                    estimatedItemSize={300} // FlashList now recognizes this correctly
                    getItemType={(item: Property) => 'Property'}
                    showsVerticalScrollIndicator={false}
                    onRefresh={() => refetch()} // Wrapped in arrow function for type safety
                    refreshing={false}
                    ListHeaderComponent={
                        <View style={styles.listHeader}>
                            <AppText variant="h3" color="secondary">
                                Found {industrialProperties.length} commercial and industrial properties
                            </AppText>
                        </View>
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Ionicons name="business-outline" size={64} color={Colors.text.disabled} />
                            <AppText variant="h3" weight="semibold" style={styles.emptyTitle}>
                                No Industrial Properties Available
                            </AppText>
                        </View>
                    }
                    contentContainerStyle={styles.listContent}
                />
            )}
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
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.gray[200],
        backgroundColor: 'white',
    },
    hamburgerButton: {
        padding: 8,
    },
    headerTitle: {
        flex: 1,
        textAlign: 'center',
        marginLeft: -36, 
    },
    searchButton: {
        padding: 8,
    },
    listHeader: {
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    cardWrapper: {
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    listContent: {
        paddingBottom: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        padding: 40,
    },
    emptyTitle: {
        marginTop: 16,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});

export default IndustrialHubScreen;