import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { Property } from '@/types/property'; // <--- UPDATED IMPORT
import AppButton from '../../components/base/AppButton';
import AppText from '../../components/base/AppText';

interface PropertyPopupProps {
  property: Property;
  onClose?: () => void;
  onNavigate?: (property: Property) => void;
}

const PropertyPopup: React.FC<PropertyPopupProps> = ({ property, onClose, onNavigate }) => {
  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <AppText variant="h4" weight="bold" numberOfLines={1}>
          {property.title}
        </AppText>
        
        <AppText variant="body" color="secondary" numberOfLines={2} style={styles.address}>
          {property.address.line1}, {property.address.city}
        </AppText>
        
        <AppText variant="h3" color="primary" weight="bold" style={styles.price}>
          Rs {property.price.toLocaleString()}
        </AppText>
        
        <View style={styles.actions}>
          <AppButton 
            variant="outline" 
            onPress={() => onClose?.()}
            style={styles.button}
            textStyle={{ color: Colors.text.primary }}
          >
            Close
          </AppButton>
          
          <AppButton
            variant="primary"
            onPress={() => onNavigate?.(property)}
            style={styles.button}
          >
            View Details
          </AppButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  content: {
    gap: 8,
  },
  address: {
    marginTop: 2,
  },
  price: {
    color: Colors.primary[500],
    marginVertical: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    height: 40, // Ensure buttons match height
  },
});

export default PropertyPopup;