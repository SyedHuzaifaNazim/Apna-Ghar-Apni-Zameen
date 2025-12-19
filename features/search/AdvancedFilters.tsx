import React from 'react';
import FilterModal from '../../components/ui/FilterModal';

export interface AdvancedFilterState {
  listingType: string;
  propertyCategory: string;
  cities: string[]; // Changed from 'city' to 'cities' (string[]) to match FilterOptions
  minPrice: number;
  maxPrice: number;
  bedrooms: number;
  amenities: string[];
}

interface AdvancedFiltersProps {
  isOpen: boolean;
  filters: AdvancedFilterState;
  onApply: (filters: AdvancedFilterState) => void;
  onClose: () => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  isOpen,
  filters,
  onApply,
  onClose,
}) => {
  return (
    <FilterModal
      isVisible={isOpen}
      currentFilters={filters}
      onApplyFilters={(formFilters) => onApply({
        listingType: formFilters.listingType ?? '',
        propertyCategory: formFilters.propertyCategory ?? '',
        cities: formFilters.cities ?? [], // Updated to use cities array
        minPrice: formFilters.minPrice ?? 0,
        maxPrice: formFilters.maxPrice ?? 0,
        bedrooms: formFilters.bedrooms ?? 0,
        amenities: formFilters.amenities ?? [],
      })}
      onClose={onClose}
    />
  );
};

export default AdvancedFilters;