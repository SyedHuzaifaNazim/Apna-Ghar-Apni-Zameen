import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, IconButton, Input } from 'native-base';
import React from 'react';
import { Image, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors';



interface SearchHeaderProps {
  onFilterPress: () => void;
  onSearchChange: (text: string) => void;
  searchQuery: string;
}

const styles = StyleSheet.create({
  headerContainer: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 40,
    height: 40,
    resizeMode: 'contain', // Scales the image down to fit within the view
  },
});

const SearchHeader: React.FC<SearchHeaderProps> = ({ 
  onFilterPress, 
  onSearchChange, 
  searchQuery 
}) => {
  return (
    <Box bg="white" px={4} py={3} shadow={1} safeAreaTop>
      <HStack space={3} alignItems="center">
        {/* Logo */}
        <Box>
          <Image
            source={require('../../assets/images/logo_agaz.png')}
            alt="Apna Ghar Logo"
            style={styles.logoImage}
          />
        </Box>
        
        {/* Search Input */}
        <Input
          placeholder="Search properties, locations..."
          value={searchQuery}
          onChangeText={onSearchChange}
          flex={1}
          backgroundColor="gray.50"
          borderRadius="lg"
          fontSize="md"
          InputLeftElement={
            <Ionicons 
              name="search" 
              size={20} 
              color={Colors.text.secondary} 
              style={{ marginLeft: 12 }}
            />
          }
          variant="unstyled"
        />
        
        {/* Filter Button */}
        <IconButton
          backgroundColor="primary.500"
          borderRadius="lg"
          icon={
            <Ionicons name="options-outline" size={20} color="white" />
          }
          onPress={onFilterPress}
          _pressed={{ backgroundColor: Colors.primary[600] }}
        />
      </HStack>
    </Box>
  );
};

export default SearchHeader;