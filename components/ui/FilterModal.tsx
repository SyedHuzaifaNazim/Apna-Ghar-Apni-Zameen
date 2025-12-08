import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius } from '@/constants/Layout';

// Mock FilterOptions interface based on usage in HomeScreen
interface FilterOptions {
  listingType: string;
  propertyCategory: string;
  city: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  amenities: string[];
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterOptions>) => void;
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({ isVisible, onClose, onApplyFilters, currentFilters }) => {
  // In a real app, this would manage internal state for filter selection
  const handleApply = () => {
    // Mock application logic for applying filters
    const mockFilters = {
      ...currentFilters,
      // Example: apply a hardcoded filter change here for demonstration
      minPrice: currentFilters.minPrice > 0 ? currentFilters.minPrice : 5000000,
    };
    onApplyFilters(mockFilters);
  };
  
  const handleReset = () => {
    onApplyFilters({
      listingType: '',
      propertyCategory: '',
      city: '',
      minPrice: 0,
      maxPrice: 100000000,
      bedrooms: 0,
      amenities: [],
    });
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.flex1}>
        <View style={styles.modalHeader}>
          <AppText variant="h2" weight="bold" style={styles.modalTitle}>
            Advanced Filters
          </AppText>
          <TouchableOpacity onPress={onClose} style={styles.closeButton} activeOpacity={0.7}>
            <Ionicons name="close" size={30} color={Colors.text.primary} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Price Range</AppText>
                <AppText variant="body" color="secondary" style={styles.sectionText}>
                    Min Price: {currentFilters.minPrice.toLocaleString()} PKR
                </AppText>
                <AppText variant="body" color="secondary" style={styles.sectionText}>
                    Max Price: {currentFilters.maxPrice.toLocaleString()} PKR
                </AppText>
                {/*  In a real app, you'd use a third-party slider here, like @react-native-community/slider */}
            </View>

            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Property Type</AppText>
                <AppText variant="body" color="secondary" style={styles.sectionText}>
                    Current: {currentFilters.propertyCategory || 'All'}
                </AppText>
                {/* 

[Image of Property Type Filter Options]
 */}
            </View>
            
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Bedrooms</AppText>
                <AppText variant="body" color="secondary" style={styles.sectionText}>
                    Current: {currentFilters.bedrooms || 'Any'}
                </AppText>
                {/*  */}
            </View>
            
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Amenities</AppText>
                <AppText variant="body" color="secondary" style={styles.sectionText}>
                    Selected: {currentFilters.amenities.length || 'None'}
                </AppText>
                {/*  */}
            </View>
            
            <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <AppButton 
            variant="outline"
            onPress={handleReset}
            style={styles.resetButton}
            textStyle={styles.resetButtonText}
          >
            Reset Filters
          </AppButton>
          <AppButton 
            onPress={handleApply}
            style={styles.applyButton}
          >
            Apply Filters
          </AppButton>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: 'white',
  },
  modalTitle: {
    fontSize: 24,
    color: Colors.text.primary,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  sectionText: {
      marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border.light,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  resetButton: {
    flex: 1,
    marginRight: 12,
    backgroundColor: 'transparent',
    borderColor: Colors.error[500],
    borderWidth: 1,
  },
  resetButtonText: {
    color: Colors.error[500],
  },
  applyButton: {
    flex: 2,
    backgroundColor: Colors.primary[500],
  },
});

export default FilterModal;