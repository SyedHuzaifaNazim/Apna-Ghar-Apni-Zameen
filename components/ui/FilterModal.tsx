import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useEffect, useState } from 'react';
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
  bedrooms: number; // 0, 1, 2, 3, 4, 5+
  amenities: string[];
}

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterOptions>) => void;
  currentFilters: FilterOptions;
}

// --- CONSTANTS AND MOCK DATA ---

const ABSOLUTE_MIN = 100000; 
const ABSOLUTE_MAX = 100000000; 
const PRICE_STEP = 500000; 

const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5]; // 0=Studio/Comm, 5=5+ Beds

const PROPERTY_CATEGORIES = [
    { label: 'Apartment', value: 'Residential Flat' },
    { label: 'House', value: 'Residential House' },
    { label: 'Plot/Land', value: 'Industrial Plot' },
    { label: 'Commercial', value: 'Commercial Office' },
    { label: 'Studio', value: 'Studio' },
    { label: 'Farm House', value: 'Farm House' },
];

const AMENITY_OPTIONS = [
    { label: 'Parking', value: 'Parking' },
    { label: 'Gym', value: 'Gym' },
    { label: 'Security', value: 'Security' },
    { label: 'Power Backup', value: 'Power Backup' },
    { label: 'Lift', value: 'Lift' },
    { label: 'Swimming Pool', value: 'Swimming Pool' },
];


const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1)} Lac`;
  return `Rs ${amount.toLocaleString()}`;
};


const FilterModal: React.FC<FilterModalProps> = ({ isVisible, onClose, onApplyFilters, currentFilters }) => {
  // Local Price State
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice);
  
  // Local Selection States
  const [selectedBedrooms, setSelectedBedrooms] = useState(currentFilters.bedrooms);
  const [selectedType, setSelectedType] = useState(currentFilters.propertyCategory);
  const [selectedAmenities, setSelectedAmenities] = useState(currentFilters.amenities);

  useEffect(() => {
    if (isVisible) {
      const initialMin = Math.max(currentFilters.minPrice, ABSOLUTE_MIN);
      const initialMax = Math.min(currentFilters.maxPrice, ABSOLUTE_MAX);
      
      setMinPrice(initialMin);
      setMaxPrice(initialMax);
      setSelectedBedrooms(currentFilters.bedrooms);
      setSelectedType(currentFilters.propertyCategory);
      setSelectedAmenities(currentFilters.amenities);
    }
  }, [currentFilters, isVisible]);
  
  // --- Price Handlers ---
  const handleMinSlidingComplete = (value: number) => {
      const roundedValue = Math.round(value / PRICE_STEP) * PRICE_STEP;
      setMinPrice(roundedValue);
      if (roundedValue > maxPrice) {
          setMaxPrice(roundedValue);
      }
  }
  
  const handleMaxSlidingComplete = (value: number) => {
      const roundedValue = Math.round(value / PRICE_STEP) * PRICE_STEP;
      setMaxPrice(roundedValue);
      if (roundedValue < minPrice) {
          setMinPrice(roundedValue);
      }
  }
  
  // --- Selection Handlers ---
  const handleAmenityToggle = (amenityValue: string) => {
      setSelectedAmenities(prev => 
          prev.includes(amenityValue)
              ? prev.filter(a => a !== amenityValue)
              : [...prev, amenityValue]
      );
  };
  
  const handleBedroomSelect = (bedroomCount: number) => {
      setSelectedBedrooms(prev => prev === bedroomCount ? 0 : bedroomCount);
  };
  
  const handleTypeSelect = (typeValue: string) => {
      setSelectedType(prev => prev === typeValue ? '' : typeValue);
  };

  // --- Apply/Reset ---
  const handleApply = () => {
    onApplyFilters({
      minPrice: minPrice,
      maxPrice: maxPrice,
      bedrooms: selectedBedrooms,
      propertyCategory: selectedType,
      amenities: selectedAmenities,
    });
    onClose();
  };
  
  const handleReset = () => {
    setMinPrice(ABSOLUTE_MIN);
    setMaxPrice(ABSOLUTE_MAX);
    setSelectedBedrooms(0);
    setSelectedType('');
    setSelectedAmenities([]);
    
    onApplyFilters({
      listingType: '',
      propertyCategory: '',
      city: '',
      minPrice: ABSOLUTE_MIN,
      maxPrice: ABSOLUTE_MAX,
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
            {/* 1. Price Range Section */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Price Range</AppText>
                
                <View style={styles.priceDisplay}>
                    <AppText variant="body" weight="medium">
                        Min: {formatCurrency(minPrice)}
                    </AppText>
                    <AppText variant="body" weight="medium">
                        Max: {formatCurrency(maxPrice)}
                    </AppText>
                </View>
                
                <View style={styles.priceSliderContainer}>
                    <AppText variant="small" color="secondary">Minimum Price</AppText>
                    <Slider
                        style={styles.slider}
                        minimumValue={ABSOLUTE_MIN}
                        maximumValue={ABSOLUTE_MAX} 
                        step={PRICE_STEP}
                        value={minPrice}
                        onValueChange={setMinPrice}
                        onSlidingComplete={handleMinSlidingComplete}
                        minimumTrackTintColor={Colors.primary[500]}
                        maximumTrackTintColor={Colors.gray[300]}
                        thumbTintColor={Colors.primary[500]}
                    />
                </View>
                
                <View style={styles.priceSliderContainer}>
                    <AppText variant="small" color="secondary">Maximum Price</AppText>
                    <Slider
                        style={styles.slider}
                        minimumValue={ABSOLUTE_MIN}
                        maximumValue={ABSOLUTE_MAX}
                        step={PRICE_STEP}
                        value={maxPrice}
                        onValueChange={setMaxPrice}
                        onSlidingComplete={handleMaxSlidingComplete}
                        minimumTrackTintColor={Colors.primary[500]}
                        maximumTrackTintColor={Colors.gray[300]}
                        thumbTintColor={Colors.primary[500]}
                    />
                </View>
                
                <View style={styles.rangeLimitText}>
                    <AppText variant="small" color="secondary">
                        {formatCurrency(ABSOLUTE_MIN)}
                    </AppText>
                    <AppText variant="small" color="secondary">
                        {formatCurrency(ABSOLUTE_MAX)}
                    </AppText>
                </View>
            </View>

            {/* 2. Property Type Selection */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Property Type</AppText>
                <View style={styles.selectionGrid}>
                    {PROPERTY_CATEGORIES.map(type => {
                        const isActive = selectedType === type.value;
                        return (
                            <TouchableOpacity
                                key={type.value}
                                style={[styles.pillButton, isActive && styles.pillButtonActive]}
                                onPress={() => handleTypeSelect(type.value)}
                            >
                                <AppText 
                                    variant="small" 
                                    weight="medium" 
                                    style={isActive ? styles.pillTextActive : styles.pillText}
                                >
                                    {type.label}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            
            {/* 3. Bedrooms Selection */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Bedrooms</AppText>
                <View style={styles.selectionGrid}>
                    {BEDROOM_OPTIONS.map(count => {
                        const label = count === 0 ? 'Studio/Comm' : (count === 5 ? '5+' : count.toString());
                        const isActive = selectedBedrooms === count;
                        return (
                            <TouchableOpacity
                                key={count}
                                style={[styles.pillButton, styles.pillButtonSmall, isActive && styles.pillButtonActive]}
                                onPress={() => handleBedroomSelect(count)}
                            >
                                <AppText 
                                    variant="body" 
                                    weight="medium" 
                                    style={isActive ? styles.pillTextActive : styles.pillText}
                                >
                                    {label}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </View>
            
            {/* 4. Amenities Selection */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold">Amenities</AppText>
                <View style={styles.selectionGridAmenities}>
                    {AMENITY_OPTIONS.map(amenity => {
                        const isActive = selectedAmenities.includes(amenity.value);
                        return (
                            <TouchableOpacity
                                key={amenity.value}
                                style={[styles.amenityPill, isActive && styles.amenityPillActive]}
                                onPress={() => handleAmenityToggle(amenity.value)}
                            >
                                <Ionicons 
                                    name={isActive ? 'checkmark-circle' : 'square-outline'} 
                                    size={16} 
                                    color={isActive ? 'white' : Colors.primary[500]}
                                />
                                <AppText 
                                    variant="small" 
                                    weight="medium" 
                                    style={isActive ? styles.pillTextActive : styles.pillTextAmenity}
                                >
                                    {amenity.label}
                                </AppText>
                            </TouchableOpacity>
                        );
                    })}
                </View>
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
  // --- Selection Styles ---
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  selectionGridAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 12,
  },
  pillButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: Colors.gray[100],
    borderWidth: 1,
    borderColor: Colors.gray[300],
  },
  pillButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillButtonActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  pillText: {
    color: Colors.text.primary,
  },
  pillTextActive: {
    color: 'white',
  },
  amenityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  amenityPillActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
  },
  pillTextAmenity: {
    color: Colors.primary[700],
    marginLeft: 8,
  },
  // --- Price Slider Styles ---
  priceDisplay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
    marginBottom: 8,
  },
  priceSliderContainer: {
    marginTop: 12,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  rangeLimitText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  // --- Footer Styles ---
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