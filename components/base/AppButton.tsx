import { Colors } from '@/constants/Colors';
import React from 'react';
import {
  ActivityIndicator,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';

interface AppButtonProps extends TouchableOpacityProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle;
  width?: number | string;
}

const AppButton: React.FC<AppButtonProps> = ({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  isDisabled = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  width,
  ...props
}) => {
  
  // Base container styles
  const getContainerStyle = () => {
    let baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 12,
      opacity: isDisabled ? 0.6 : 1,
    };

    // Width handling
    // if (width) {
      // baseStyle.width = width;
    // }

    // Size handling
    switch (size) {
      case 'sm':
        baseStyle.paddingVertical = 8;
        baseStyle.paddingHorizontal = 12;
        break;
      case 'lg':
        baseStyle.paddingVertical = 16;
        baseStyle.paddingHorizontal = 24;
        break;
      case 'md':
      default:
        baseStyle.paddingVertical = 12;
        baseStyle.paddingHorizontal = 16;
    }

    // Variant handling
    switch (variant) {
      case 'secondary':
        baseStyle.backgroundColor = Colors.background.secondary; // Ensure this color exists or use a fallback
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = Colors.border.light;
        break;
      case 'outline':
        baseStyle.backgroundColor = 'transparent';
        baseStyle.borderWidth = 1.5;
        baseStyle.borderColor = Colors.primary[500];
        break;
      case 'ghost':
        baseStyle.backgroundColor = 'transparent';
        break;
      case 'primary':
      default:
        baseStyle.backgroundColor = Colors.primary[500];
    }

    return baseStyle;
  };

  // Text styles
  const getTextStyle = () => {
    let baseTextStyle: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    // Size handling for text
    switch (size) {
      case 'sm':
        baseTextStyle.fontSize = 12;
        break;
      case 'lg':
        baseTextStyle.fontSize = 18;
        break;
      case 'md':
      default:
        baseTextStyle.fontSize = 16;
    }

    // Variant handling for text color
    switch (variant) {
      case 'outline':
      case 'ghost':
        baseTextStyle.color = Colors.primary[500];
        break;
      case 'secondary':
        baseTextStyle.color = Colors.text.primary;
        break;
      case 'primary':
      default:
        baseTextStyle.color = '#FFFFFF'; // White text for primary
    }

    return baseTextStyle;
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled || isLoading}
      activeOpacity={0.7}
      style={[getContainerStyle(), style]}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'outline' || variant === 'ghost' ? Colors.primary[500] : 'white'} 
        />
      ) : (
        <>
          {leftIcon && (
            <React.Fragment>
              {leftIcon}
              <Text style={{ width: 8 }} /> 
            </React.Fragment>
          )}
          
          <Text style={[getTextStyle(), textStyle]}>
            {children}
          </Text>

          {rightIcon && (
            <React.Fragment>
              <Text style={{ width: 8 }} />
              {rightIcon}
            </React.Fragment>
          )}
        </>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;