import { Ionicons } from '@expo/vector-icons';
import {
  Actionsheet,
  Box,
  Button,
  Checkbox,
  CheckIcon,
  Divider,
  HStack,
  IconButton,
  Modal,
  ScrollView,
  Select,
  Slider,
  useDisclose,
  VStack
} from 'native-base';
import React, { useEffect, useState } from 'react';

import { Colors } from '../../constants/Colors';
import { FilterOptions } from '../../hooks/useFilterProperties';
import AppButton from '../base/AppButton';
import AppText from '../base/AppText';

type FilterFormState = Pick<FilterOptions,
  'listingType' |
  'propertyCategory' |
  'city' |
  'minPrice' |
  'maxPrice' |
  'bedrooms' |
  'amenities'
>;

interface FilterModalProps {
  isVisible: boolean;
  onClose: () => void;
  onApplyFilters: (filters: FilterFormState) => void;
  currentFilters: FilterFormState;
}

const FilterModal: React.FC<FilterModalProps> = ({ 
  isVisible, 
  onClose, 
  onApplyFilters, 
  currentFilters 
}) => {
  const [filters, setFilters] = useState<FilterFormState>(currentFilters);
  const { isOpen, onOpen, onClose: onSheetClose } = useDisclose();

  useEffect(() => {
    if (isVisible) {
      setFilters(currentFilters);
    }
  }, [isVisible, currentFilters]);

  const cities = ['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Multan', 'Hyderabad', 'Peshawar'];
  const listingTypes = ['For Sale', 'For Rent'];
  const propertyCategories = [
    'Residential Flat', 
    'Commercial Shop', 
    'Industrial Plot', 
    'Residential House', 
    'Commercial Office',
    'Villa',
    'Penthouse',
    'Studio',
    'Duplex',
    'Townhouse',
    'Farmhouse',
    'Basement Suite',
    'Loft',
    'Condo',
    'Hotel Apartment',
    'Commercial Building',
    'Warehouse',
    'Factory',
    'Agricultural Land',
    'Residential Plot',
    'Commercial Plot'
  ];
  const amenities = [
    'Swimming Pool',
    'Gym',
    'Parking',
    'Security',
    'Garden',
    'Balcony',
    'Lift',
    'Air Conditioning',
    'Central Heating',
    'Wi-Fi',
    'Pet Friendly',
    'Furnished',
    'Unfurnished',
    'Concierge',
    'CCTV',
    'Backup Generator',
    'Water Supply',
    'Waste Disposal',
    'Playground',
    'Community Hall',
    'Mosque',
    'School Nearby',
    'Hospital Nearby',
    'Shopping Mall Nearby',
    'Public Transport Nearby',
    'Sea View',
    'Mountain View',
    'City View',
    'Rooftop Terrace',
    'Laundry Room',
    'Kitchen Appliances',
    'Walk-in Closet',
    'Master Ensuite',
    'Servant Quarter',
    'Study Room',
    'Home Theater',
    'Game Room',
    'Library',
    'Jacuzzi',
    'Sauna',
    'Steam Room',
    'Tennis Court',
    'Basketball Court',
    'Squash Court',
    'Running Track',
    'Yoga Studio',
    'Spa',
    'Salon',
    'Barbecue Area',
    'Fireplace',
    'Solar Panels',
    'Green Building Certification',
    'Double Glazed Windows',
    'Elevator',
    'Intercom',
    'Video Door Phone',
    'Smart Home System',
    'Wheelchair Accessible',
    'Visitor Parking',
    'Reserved Parking',
    'Covered Parking',
    'Basement Parking',
    'Roof Parking',
    'Valet Parking',
    'Car Wash Area',
    'Electric Vehicle Charging Station'
  ];

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleReset = () => {
    const resetFilters: FilterFormState = {
      listingType: '',
      propertyCategory: '',
      city: '',
      minPrice: 0,
      maxPrice: 100000000,
      bedrooms: 0,
      amenities: []
    };
    setFilters(resetFilters);
    onApplyFilters(resetFilters);
  };

  const handleAmenityToggle = (amenity: string) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities?.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities || [], amenity]
    }));
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) return `Rs ${(price / 10000000).toFixed(1)} Cr`;
    if (price >= 100000) return `Rs ${(price / 100000).toFixed(1)} L`;
    return `Rs ${price.toLocaleString()}`;
  };

  return (
    <Modal 
      isOpen={isVisible} 
      onClose={onClose} 
      size="full" 
      animationPreset="slide"
    >
      <Modal.Content 
        maxHeight="96%" 
        marginBottom={0} 
        marginTop="auto" 
        borderTopRadius={32} // Changed from "3xl" to number
      >
        <Modal.Header borderBottomWidth={0} pb={2}>
          <HStack justifyContent="space-between" alignItems="center">
            <AppText variant="h2" fontWeight="bold">Filters</AppText>
            <HStack space={2}>
              <Button 
                variant="ghost" 
                onPress={handleReset} 
                _text={{ color: Colors.primary[500] }}
              >
                Reset
              </Button>
              <IconButton
                icon={<Ionicons name="close" size={24} color={Colors.text.primary} />}
                onPress={onClose}
                variant="ghost"
              />
            </HStack>
          </HStack>
        </Modal.Header>
        
        <Modal.Body px={0}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <VStack space={6} px={4}>
              {/* Listing Type */}
              <VStack space={3}>
                <AppText variant="h3" fontWeight="semibold">Listing Type</AppText>
                <HStack space={2} flexWrap="wrap">
                  {listingTypes.map(type => (
                    <Button
                      key={type}
                      variant={filters.listingType === type ? "solid" : "outline"}
                      colorScheme={filters.listingType === type ? "primary" : undefined}
                      size="sm"
                      onPress={() => setFilters({...filters, listingType: type})}
                      borderRadius={9999}
                      px={4}
                      borderWidth={1}
                    >
                      {type}
                    </Button>
                  ))}
                </HStack>
              </VStack>

              <Divider />

              {/* Property Category */}
              <VStack space={3}>
                <AppText variant="h3" fontWeight="semibold">Property Type</AppText>
                <Select
                  selectedValue={filters.propertyCategory}
                  minWidth="100%"
                  accessibilityLabel="Choose Property Type"
                  placeholder="All Property Types"
                  _selectedItem={{
                    bg: "primary.100",
                    endIcon: <CheckIcon size={5} />
                  }}
                  onValueChange={value => setFilters({...filters, propertyCategory: value})}
                >
                  {propertyCategories.map(category => (
                    <Select.Item key={category} label={category} value={category} />
                  ))}
                </Select>
              </VStack>

              <Divider />

              {/* City */}
              <VStack space={3}>
                <AppText variant="h3" fontWeight="semibold">City</AppText>
                <Select
                  selectedValue={filters.city}
                  minWidth="100%"
                  accessibilityLabel="Choose City"
                  placeholder="All Cities"
                  _selectedItem={{
                    bg: "primary.100",
                    endIcon: <CheckIcon size={5} />
                  }}
                  onValueChange={value => setFilters({...filters, city: value})}
                >
                  {cities.map(city => (
                    <Select.Item key={city} label={city} value={city} />
                  ))}
                </Select>
              </VStack>

              <Divider />

              {/* Price Range */}
              <VStack space={4}>
                <AppText variant="h3" fontWeight="semibold">Price Range</AppText>
                <VStack space={3}>
                  <HStack justifyContent="space-between">
                    <AppText variant="body" color={Colors.text.primary}>
                      {formatPrice(filters.minPrice || 0)}
                    </AppText>
                    <AppText variant="body" color={Colors.text.primary}>
                      {formatPrice(filters.maxPrice || 0)}
                    </AppText>
                  </HStack>
                  <Slider
                    minValue={0}
                    maxValue={100000000}
                    step={100000}
                    value={[filters.minPrice || 0, filters.maxPrice || 100000000]}
                    onChange={(value: number[]) => setFilters({
                      ...filters,
                      minPrice: value[0],
                      maxPrice: value[1]
                    })}
                    colorScheme="primary"
                  >
                    <Slider.Track>
                      <Slider.FilledTrack />
                    </Slider.Track>
                    <Slider.Thumb index={0} />
                    <Slider.Thumb index={1} />
                  </Slider>
                </VStack>
              </VStack>

              <Divider />

              {/* Bedrooms */}
              <VStack space={3}>
                <AppText variant="h3" fontWeight="semibold">Bedrooms</AppText>
                <HStack space={2} flexWrap="wrap">
                  {[0, 1, 2, 3, 4, 5].map(beds => (
                    <Button
                      key={beds}
                      variant={filters.bedrooms === beds ? "solid" : "outline"}
                      colorScheme={filters.bedrooms === beds ? "primary" : undefined}
                      size="sm"
                      onPress={() => setFilters({...filters, bedrooms: beds})}
                      borderRadius={9999}
                      borderWidth={1}
                    >
                      {beds === 0 ? 'Any' : `${beds}+`}
                    </Button>
                  ))}
                </HStack>
              </VStack>

              <Divider />

              {/* Amenities */}
              <VStack space={3}>
                <AppText variant="h3" fontWeight="semibold">Amenities</AppText>
                <VStack space={2}>
                  {amenities.slice(0, 4).map(amenity => (
                    <Checkbox
                      key={amenity}
                      value={amenity}
                      isChecked={filters.amenities?.includes(amenity)}
                      onChange={() => handleAmenityToggle(amenity)}
                      colorScheme="primary"
                      my={1}
                    >
                      <AppText variant="body">{amenity}</AppText>
                    </Checkbox>
                  ))}
                  
                  {amenities.length > 4 && (
                    <AppButton 
                      variant="ghost" 
                      onPress={onOpen}
                      leftIcon={<Ionicons name="add" size={16} color={Colors.primary[500]} />}
                    >
                      Show More Amenities
                    </AppButton>
                  )}
                </VStack>
              </VStack>
            </VStack>
          </ScrollView>
        </Modal.Body>
        
        <Modal.Footer borderTopWidth={0} pt={4} px={4} pb={6}>
          <HStack space={3} width="100%" flexDirection="row">
            <AppButton 
              onPress={handleApply}
              variant="solid"
              colorScheme="primary"
              size="lg"
              style={{ flex: 1 }}
              leftIcon={<Ionicons name="filter" size={20} color="white" />}
              borderRadius={12}
              _text={{ fontWeight: 'semibold' }}
            >
              Apply Filters
            </AppButton>
            <AppButton 
              onPress={onClose}
              variant="outline"
              colorScheme="primary"
              size="lg"
              leftIcon={<Ionicons name="close" size={20} color={Colors.primary[500]} />}
              borderRadius={8}
              _text={{ color: Colors.primary[500], fontWeight: 'semibold' }}
              borderColor={Colors.primary[200]}
            >
              Cancel
            </AppButton>
          </HStack>
        </Modal.Footer>
      </Modal.Content>

      {/* Amenities Action Sheet */}
      <Actionsheet isOpen={isOpen} onClose={onSheetClose}>
        <Actionsheet.Content>
          <Box width="100%" p={4}>
            <AppText variant="h3" fontWeight="semibold">
              Select Amenities
            </AppText>
            <ScrollView maxHeight={400}>
              <VStack space={3} mt={2}>
                {amenities.map(amenity => (
                  <Checkbox
                    key={amenity}
                    value={amenity}
                    isChecked={filters.amenities?.includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    colorScheme="primary"
                    my={1}
                  >
                    <AppText variant="body">{amenity}</AppText>
                  </Checkbox>
                ))}
              </VStack>
            </ScrollView>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </Modal>
  );
};

export default FilterModal;