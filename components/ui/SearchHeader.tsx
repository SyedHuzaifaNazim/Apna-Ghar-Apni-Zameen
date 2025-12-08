import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback } from 'react';
import {
  Image,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text // ADD THIS IMPORT
  ,

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
  
  // Optimize search handler
  const handleSearchChange = useCallback((text: string) => {
    onSearchChange(text);
  }, [onSearchChange]);

  const clearSearch = useCallback(() => {
    onSearchChange('');
  }, [onSearchChange]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/images/logo_agaz.png')}
            style={styles.logo}
            resizeMode="contain"
            accessibilityLabel="Apna Ghar Logo"
          />
        </View>
        
        {/* Search Input */}
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={18} 
            color={Colors.text.secondary}
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
            clearButtonMode="while-editing"
            enablesReturnKeyAutomatically
          />
          
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={clearSearch}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="close-circle" size={18} color={Colors.text.secondary} />
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
            activeOpacity={0.7}
          >
            <Ionicons 
              name="options-outline" 
              size={20} 
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
    borderBottomColor: Colors.border.medium,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  logoContainer: {
    marginRight: 12,
  },
  logo: {
    width: 40,
    height: 40,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background.secondary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.border.medium,
    height: 42,
    marginRight: 12,
  },
  searchIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 15,
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
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: Colors.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  filterButtonActive: {
    backgroundColor: Colors.primary[500],
    borderColor: Colors.primary[500],
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

// Optimize with memo to prevent unnecessary re-renders
export default memo(SearchHeader);