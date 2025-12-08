import { Box, Button, HStack, VStack } from 'native-base';
import React from 'react';

import Colors from '@/constants/Colors';
import { Property } from '../../api/apiMock';
import AppText from '../../components/base/AppText';

interface PropertyPopupProps {
  property: Property;
  onClose?: () => void;
  onNavigate?: (property: Property) => void;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({ property, onClose, onNavigate }) => {
  return (
    <Box bg="white" borderRadius="2xl" shadow={3} p={4}>
      <VStack space={2}>
        <AppText variant="h4" weight="bold" numberOfLines={1}>
          {property.title}
        </AppText>
        <AppText variant="body" color={Colors.secondary[500]} numberOfLines={2}>
          {property.address.line1}, {property.address.city}
        </AppText>
        <AppText variant="h3" color={Colors.primary[500]} weight="bold">
          Rs {property.price.toLocaleString()}
        </AppText>
        <HStack space={3}>
          <Button flex={1} variant="ghost" onPress={onClose}>
            Close
          </Button>
          <Button
            flex={1}
            onPress={() => onNavigate?.(property)}
            colorScheme={Colors.primary[500]}
          >
            View Details
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PropertyPopup;
