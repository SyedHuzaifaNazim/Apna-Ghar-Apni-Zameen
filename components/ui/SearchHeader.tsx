import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import {
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { Colors } from '../../constants/Colors';

interface SearchHeaderProps {
  onFilterPress: () => void;
  onSearchChange: (text: string) => void;
  searchQuery: string;
  filterCount?: number;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  onFilterPress, 
  onSearchChange, 
  searchQuery,
  filterCount = 0 
}) => {
  
  const handleSearchChange = useCallback((text: string) => {
    onSearchChange(text);
  }, [onSearchChange]);

  const clearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        {/* Search Input - Taking full width */}
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={18} 
            color={Colors.gray[500]} // Neutral gray for professional look
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search properties, locations..."
            placeholderTextColor={Colors.text.disabled}
            value={searchQuery}
            onChangeText={handleSearchChange}
            style={styles.input}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="search"
            enablesReturnKeyAutomatically
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color={Colors.gray[500]} />
            </TouchableOpacity>
          )}
        </View>
        
        {/* Filter Button with Badge */}
        <View style={styles.filterContainer}>
          <TouchableOpacity 
            style={[
              styles.filterButton,
              filterCount > 0 && styles.filterButtonActive
            ]}
            onPress={onFilterPress}
            activeOpacity={0.8}
          >
            <Ionicons 
              name="options-outline" 
              size={24} // Slightly larger icon
              color={filterCount > 0 ? "white" : Colors.primary[500]} 
            />
            
            {filterCount > 0 && (
              <View style={styles.filterBadge}>
                <View style={styles.badgeInner}>
                  <Text style={styles.badgeText}>
                    {filterCount > 9 ? '9+' : filterCount}
                  </Text>
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border.light,
    ...Platform.select({
      ios: {
        shadowColor: Colors.shadow.dark,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 1,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border.light,
    height: 48,
    marginRight: 16,
  },
  searchIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    paddingHorizontal: 8,
    color: Colors.text.primary,
    paddingVertical: Platform.OS === 'ios' ? 10 : 8,
    includeFontPadding: false,
  },
  clearButton: {
    padding: 8,
    marginRight: 8,
  },
  filterContainer: {
    position: 'relative',
    width: 48,
    height: 48,
  },
  filterButton: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
    backgroundColor: Colors.primary[50],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[500],
  },
  filterBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.error[500],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'white',
  },
  badgeInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
    includeFontPadding: false,
  },
});

export default memo(SearchHeader);