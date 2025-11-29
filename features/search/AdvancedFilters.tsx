import React from 'react';

import FilterModal from '../../components/ui/FilterModal';

export interface AdvancedFilterState {
  listingType: string;
  propertyCategory: string;
  city: string;
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
      onApplyFilters={onApply}
      onClose={onClose}
    />
  );
};

export default AdvancedFilters;
