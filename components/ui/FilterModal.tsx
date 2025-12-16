import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import React, { useEffect, useMemo, useState } from 'react';
import { Modal, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius } from '@/constants/Layout';
import { FilterOptions } from '@/hooks/useFilterProperties';

// --- Constants ---
const ABSOLUTE_MIN = 100000;
const ABSOLUTE_MAX = 100000000;
const PRICE_STEP = 500000;

const formatCurrency = (amount: number): string => {
  if (amount >= 10000000) return `Rs ${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000) return `Rs ${(amount / 100000).toFixed(1)} Lac`;
  return `Rs ${amount.toLocaleString()}`;
};

// --- MOCK CITY & AREA DATA ---
const CITY_AREA_DATA: { [key: string]: string[] } = {
    Karachi: ["DHA Karachi", "Clifton", "Gulshan-e-Iqbal", "Bahria Town Karachi", "Malir", "Federal B. Area"],
    Lahore: ["DHA Lahore", "Bahria Town Lahore", "Gulberg", "Model Town", "Askari 11", "Raiwind Road"],
    Islamabad: ["F-7", "E-11", "G-11", "Bahria Town Islamabad", "B-17 Multi Gardens", "Chaklala"],
    Rawalpindi: ["Bahria Town Rawalpindi", "DHA Valley", "Adiala Road", "Askari 14", "Saddar"],
    Faisalabad: ["Samanabad", "People's Colony", "Sargodha Road", "Jaranwala Road"],
    Sialkot: ["Cantt", "Wazirabad Road", "Sambrial"],
    Peshawar: ["Hayatabad", "University Town", "Warsak Road"],
};
const ALL_CITIES = Object.keys(CITY_AREA_DATA);

// Mock data for other filters
const BEDROOM_OPTIONS = [0, 1, 2, 3, 4, 5];
const PROPERTY_CATEGORIES = [
    { label: 'Apartment', value: 'Residential Flat' },
    { label: 'House', value: 'Residential House' },
    { label: 'Plot/Land', value: 'Industrial Plot' },
    { label: 'Commercial', value: 'Commercial Office' },
];
const AMENITY_OPTIONS = [
    { label: 'Parking', value: 'Parking' },
    { label: 'Gym', value: 'Gym' },
    { label: 'Security', value: 'Security' },
    { label: 'Power Backup', value: 'Power Backup' },
];

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: Partial<FilterOptions>) => void;
  currentFilters: FilterOptions;
}

const FilterModal: React.FC<FilterModalProps> = ({ isVisible, onClose, onApplyFilters, currentFilters }) => {
  // --- Local States ---
  const [minPrice, setMinPrice] = useState(currentFilters.minPrice ?? ABSOLUTE_MIN);
  const [maxPrice, setMaxPrice] = useState(currentFilters.maxPrice ?? ABSOLUTE_MAX);
  const [selectedBedrooms, setSelectedBedrooms] = useState(currentFilters.bedrooms ?? 0);
  const [selectedType, setSelectedType] = useState(currentFilters.propertyCategory || '');
  const [selectedAmenities, setSelectedAmenities] = useState(currentFilters.amenities || []);
  
  // ADDED: Location States
  const [selectedCities, setSelectedCities] = useState(currentFilters.cities || []);
  const [selectedAreas, setSelectedAreas] = useState(currentFilters.areas || []);

  // Sync local state when the modal opens or parent filters change
  useEffect(() => {
    if (isVisible) {
      const initialMin = Math.max(currentFilters.minPrice ?? 0, ABSOLUTE_MIN);
      const initialMax = Math.min(currentFilters.maxPrice ?? 0, ABSOLUTE_MAX);
      
      setMinPrice(initialMin);
      setMaxPrice(initialMax);
      setSelectedBedrooms(currentFilters.bedrooms ?? 0);
      setSelectedType(currentFilters.propertyCategory || '');
      setSelectedAmenities(currentFilters.amenities || []);
      
      // Sync Location States
      setSelectedCities(currentFilters.cities || []);
      setSelectedAreas(currentFilters.areas || []);
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

  // --- Selection Handlers (Existing) ---
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
  
  // --- ADDED: Location Handlers ---
  const handleCityToggle = (city: string) => {
      setSelectedCities(prev => {
          let nextCities: string[];
          if (prev.includes(city)) {
              nextCities = prev.filter(c => c !== city);
          } else {
              nextCities = [...prev, city];
          }
          
          // Clear areas if a city selection changes to prevent invalid area selection
          setSelectedAreas([]); 
          return nextCities;
      });
  };
  
  const handleAreaToggle = (area: string) => {
      setSelectedAreas(prev => 
          prev.includes(area)
              ? prev.filter(a => a !== area)
              : [...prev, area]
      );
  };
  
  // Memoize available areas based on selected cities
  const availableAreas = useMemo(() => {
      if (selectedCities.length === 0) return [];
      
      let areas: string[] = [];
      selectedCities.forEach(city => {
          if (CITY_AREA_DATA[city]) {
              areas = areas.concat(CITY_AREA_DATA[city]);
          }
      });
      // Ensure only unique areas are shown (if an area name exists in multiple cities)
      return Array.from(new Set(areas)); 
  }, [selectedCities]);


  // --- Apply/Reset ---
  const handleApply = () => {
    onApplyFilters({
      minPrice: minPrice,
      maxPrice: maxPrice,
      bedrooms: selectedBedrooms,
      propertyCategory: selectedType,
      amenities: selectedAmenities,
      cities: selectedCities, // Passed array of cities
      areas: selectedAreas,   // Passed array of areas
    });
    onClose();
  };
  
  const handleReset = () => {
    setMinPrice(ABSOLUTE_MIN);
    setMaxPrice(ABSOLUTE_MAX);
    setSelectedBedrooms(0);
    setSelectedType('');
    setSelectedAmenities([]);
    setSelectedCities([]);
    setSelectedAreas([]);
    
    onApplyFilters({
      listingType: '',
      propertyCategory: '',
      minPrice: ABSOLUTE_MIN,
      maxPrice: ABSOLUTE_MAX,
      bedrooms: 0,
      amenities: [],
      cities: [],
      areas: [],
    });
  };

  const renderPillButton = (
    label: string, 
    value: string | number, 
    isActive: boolean, 
    onPress: (value: any) => void,
    isSmall: boolean = false
  ) => (
      <TouchableOpacity
          key={value}
          style={[
              styles.pillButton, 
              isSmall ? styles.pillButtonSmall : styles.pillButtonRegular,
              isActive && styles.pillButtonActive
          ]}
          onPress={() => onPress(value)}
      >
          <AppText 
              variant="small" 
              weight="medium" 
              style={isActive ? styles.pillTextActive : styles.pillText}
          >
              {label}
          </AppText>
      </TouchableOpacity>
  );

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
            
            {/* 1. Location Filters (City & Area) */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold" style={styles.sectionTitleText}>Location</AppText>
                
                {/* City Selector */}
                <AppText variant="body" weight="medium" style={styles.subSectionTitle}>Select City</AppText>
                <View style={styles.selectionGrid}>
                    {ALL_CITIES.map(city => 
                        renderPillButton(
                            city,
                            city,
                            selectedCities.includes(city),
                            handleCityToggle
                        )
                    )}
                </View>
                
                {/* Area Selector (Conditional) */}
                {selectedCities.length > 0 && (
                    <View style={styles.subSection}>
                        <AppText variant="body" weight="medium" style={styles.subSectionTitle}>
                            Select Area ({availableAreas.length} Areas in selected cities)
                        </AppText>
                        <View style={styles.selectionGrid}>
                            {availableAreas.map(area => 
                                renderPillButton(
                                    area,
                                    area,
                                    selectedAreas.includes(area),
                                    handleAreaToggle,
                                    true 
                                )
                            )}
                        </View>
                        {availableAreas.length === 0 && (
                            <AppText color="secondary" variant="small">No specific areas listed for selected cities.</AppText>
                        )}
                    </View>
                )}
            </View>

            {/* 2. Price Range Section */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold" style={styles.sectionTitleText}>Price Range</AppText>
                
                <View style={styles.priceDisplay}>
                    <AppText variant="body" weight="medium">Min: {formatCurrency(minPrice)}</AppText>
                    <AppText variant="body" weight="medium">Max: {formatCurrency(maxPrice)}</AppText>
                </View>
                
                <View style={styles.priceSliderContainer}>
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
                    <AppText variant="small" color="secondary">{formatCurrency(ABSOLUTE_MIN)}</AppText>
                    <AppText variant="small" color="secondary">{formatCurrency(ABSOLUTE_MAX)}</AppText>
                </View>
            </View>


            {/* 3. Property Type Selection */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold" style={styles.sectionTitleText}>Property Type</AppText>
                <View style={styles.selectionGrid}>
                    {PROPERTY_CATEGORIES.map(type => 
                        renderPillButton(
                            type.label,
                            type.value,
                            selectedType === type.value,
                            handleTypeSelect
                        )
                    )}
                </View>
            </View>
            
            {/* 4. Bedrooms Selection */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold" style={styles.sectionTitleText}>Bedrooms</AppText>
                <View style={styles.selectionGrid}>
                    {BEDROOM_OPTIONS.map(count => {
                        const label = count === 0 ? 'Any' : (count === 5 ? '5+' : count.toString());
                        return renderPillButton(
                            label,
                            count,
                            selectedBedrooms === count,
                            handleBedroomSelect,
                            true 
                        );
                    })}
                </View>
            </View>
            
            {/* 5. Amenities Selection */}
            <View style={styles.section}>
                <AppText variant="h3" weight="semibold" style={styles.sectionTitleText}>Amenities</AppText>
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
  sectionTitleText: {
    marginBottom: 12,
  },
  subSection: {
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: Colors.gray[100],
  },
  subSectionTitle: {
      marginBottom: 10,
      color: Colors.primary[700],
  },
  // --- Selection Styles ---
  selectionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  selectionGridAmenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  pillButtonRegular: {
      // styles for standard pills
  },
  pillButtonSmall: {
    paddingVertical: 8,
    paddingHorizontal: 12,
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
  // Price Slider Styles
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
  // Footer Styles
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