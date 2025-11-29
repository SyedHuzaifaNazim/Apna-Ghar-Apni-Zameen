import { HStack } from 'native-base';
import React from 'react';
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps
} from 'react-native';
import { Colors } from '../../constants/Colors';
import { BorderRadius } from '../../constants/Layout';
import AppText from './AppText';

interface AppButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: string;
}

const AppButton: React.FC<AppButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  style,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: BorderRadius.lg,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      flexDirection: 'row' as const,
      opacity: disabled ? 0.6 : 1,
    };

    const sizeStyle = {
      sm: { paddingHorizontal: 16, paddingVertical: 8, height: 36 },
      md: { paddingHorizontal: 24, paddingVertical: 12, height: 48 },
      lg: { paddingHorizontal: 32, paddingVertical: 16, height: 56 },
    }[size];

    const variantStyle = {
      primary: {
        backgroundColor: Colors.primary,
      },
      secondary: {
        backgroundColor: Colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: Colors.primary,
      },
      ghost: {
        backgroundColor: 'transparent',
      },
    }[variant];

    return [baseStyle, sizeStyle, variantStyle, style];
  };

  const getTextColor = () => {
    if (variant === 'outline' || variant === 'ghost') {
      return 'primary' as const as 'primary' | 'secondary' | 'disabled' | 'error' | 'success';
    }
    return 'inverse';
  };

  const getTextSize = () => {
    return size === 'sm' ? 'small' : size === 'md' ? 'body' : 'h3';
  };

  return (
    <TouchableOpacity
      style={getButtonStyle()}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator 
          size="small" 
          color={variant === 'primary' || variant === 'secondary' ? 'white' : Colors.primary[500]} 
        />
      ) : (
        <HStack space={2} alignItems="center">
          {leftIcon && leftIcon}
          <AppText 
            variant={getTextSize()} 
            color={getTextColor() as 'primary' | 'secondary' | 'disabled' | 'error' | 'success' | undefined}
            weight="semibold"
          >
            {children}
          </AppText>
          {rightIcon && rightIcon}
        </HStack>
      )}
    </TouchableOpacity>
  );
};

export default AppButton;