import { Ionicons } from '@expo/vector-icons';
import { Box, HStack, IconButton, Input, Text } from 'native-base';
import React from 'react';
import { Colors } from '../../constants/Colors';

interface SearchHeaderProps {
  onFilterPress: () => void;
  onSearchChange: (text: string) => void;
  searchQuery: string;
}

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
          <Text fontSize="xl" fontWeight="bold" color="primary.500">
            AG AZ
          </Text>
          <Text fontSize="xs" color="text.secondary" mt={-1}>
            Apna Ghar
          </Text>
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
          _pressed={{ backgroundColor: "primary.600" }}
        />
      </HStack>
    </Box>
  );
};

export default SearchHeader;