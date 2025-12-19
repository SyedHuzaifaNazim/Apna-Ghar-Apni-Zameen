import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import AppText from '../../components/base/AppText';
import { Colors } from '../../constants/Colors';

interface MapFiltersProps {
  filters: {
    listingType?: string;
    propertyType?: string;
  };
  onChange: (filters: MapFiltersProps['filters']) => void;
}

// Custom simple dropdown component to replace NativeBase Select
const FilterDropdown = ({ 
  label, 
  value, 
  options, 
  onSelect 
}: { 
  label: string; 
  value?: string; 
  options: { label: string; value: string }[]; 
  onSelect: (val: string) => void; 
}) => {
  const [visible, setVisible] = useState(false);

  const selectedLabel = options.find(o => o.value === value)?.label || label;

  return (
    <View style={styles.dropdownContainer}>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setVisible(true)}
      >
        <AppText variant="body" color={value ? 'primary' : 'secondary'}>
          {selectedLabel}
        </AppText>
        <Ionicons name="chevron-down" size={16} color={Colors.text.secondary} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <AppText variant="h4" weight="bold" style={styles.modalTitle}>{label}</AppText>
              <FlatList
                data={options}
                keyExtractor={item => item.value}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.optionItem,
                      item.value === value && styles.optionItemSelected
                    ]}
                    onPress={() => {
                      onSelect(item.value);
                      setVisible(false);
                    }}
                  >
                    <AppText 
                      variant="body" 
                      color={item.value === value ? 'primary' : 'primary'}
                      weight={item.value === value ? 'bold' : 'normal'}
                    >
                      {item.label}
                    </AppText>
                    {item.value === value && (
                      <Ionicons name="checkmark" size={20} color={Colors.primary[500]} />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const MapFilters: React.FC<MapFiltersProps> = ({ filters, onChange }) => {
  return (
    <View style={styles.container}>
      <AppText variant="h4" weight="bold" style={styles.title}>
        Map Filters
      </AppText>
      <View style={styles.row}>
        <FilterDropdown
          label="Listing Type"
          value={filters.listingType}
          options={[
            { label: 'All Listings', value: '' },
            { label: 'For Sale', value: 'For Sale' },
            { label: 'For Rent', value: 'For Rent' },
          ]}
          onSelect={value => onChange({ ...filters, listingType: value })}
        />

        <View style={styles.spacer} />

        <FilterDropdown
          label="Property Type"
          value={filters.propertyType}
          options={[
            { label: 'All Types', value: '' },
            { label: 'Residential Flat', value: 'Residential Flat' },
            { label: 'Residential House', value: 'Residential House' },
            { label: 'Commercial Shop', value: 'Commercial Shop' },
            { label: 'Commercial Office', value: 'Commercial Office' },
            { label: 'Industrial Plot', value: 'Industrial Plot' },
          ]}
          onSelect={value => onChange({ ...filters, propertyType: value })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  title: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spacer: {
    width: 12,
  },
  // Dropdown Styles
  dropdownContainer: {
    flex: 1,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#F9FAFB',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    width: '100%',
    maxWidth: 300,
    padding: 16,
    maxHeight: 400,
  },
  modalTitle: {
    marginBottom: 16,
    textAlign: 'center',
  },
  optionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[100],
  },
  optionItemSelected: {
    backgroundColor: Colors.primary[50],
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
});

export default MapFilters;