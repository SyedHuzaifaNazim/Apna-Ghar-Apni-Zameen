import { HStack, Select, VStack } from 'native-base';
import React from 'react';

import AppText from '../../components/base/AppText';

interface MapFiltersProps {
  filters: {
    listingType?: string;
    propertyType?: string;
  };
  onChange: (filters: MapFiltersProps['filters']) => void;
}

const MapFilters: React.FC<MapFiltersProps> = ({ filters, onChange }) => {
  return (
    <VStack space={3} bg="white" p={4} borderRadius="2xl" shadow={2}>
      <AppText variant="h4" weight="bold">
        Map Filters
      </AppText>
      <HStack space={3}>
        <Select
          flex={1}
          selectedValue={filters.listingType}
          placeholder="Listing Type"
          onValueChange={value => onChange({ ...filters, listingType: value })}
        >
          <Select.Item label="All" value="" />
          <Select.Item label="For Sale" value="For Sale" />
          <Select.Item label="For Rent" value="For Rent" />
        </Select>

        <Select
          flex={1}
          selectedValue={filters.propertyType}
          placeholder="Property Type"
          onValueChange={value => onChange({ ...filters, propertyType: value })}
        >
          <Select.Item label="All" value="" />
          <Select.Item label="Residential Flat" value="Residential Flat" />
          <Select.Item label="Residential House" value="Residential House" />
          <Select.Item label="Commercial Shop" value="Commercial Shop" />
          <Select.Item label="Commercial Office" value="Commercial Office" />
          <Select.Item label="Industrial Plot" value="Industrial Plot" />
        </Select>
      </HStack>
    </VStack>
  );
};

export default MapFilters;
