import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleProp, TextStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import { TextVariants } from '../../constants/Typography';

type AppTextVariant = keyof typeof TextVariants;

const COLOR_MAP: Record<string, string> = {
  primary: Colors.text.primary,
  secondary: Colors.text.secondary,
  disabled: Colors.text.disabled,
  inverse: Colors.text.inverse,
  link: Colors.text.link,
  error: Colors.error[500],
  success: Colors.success[500],
  warning: Colors.warning[500],
};

interface AppTextProps extends RNTextProps {
  variant?: AppTextVariant;
  color?: keyof typeof COLOR_MAP;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  align = 'left',
  weight,
  style,
  children,
  ...props
}) => {
  const getTextStyle = () => {
    const baseStyle = TextVariants[variant] ?? TextVariants.body;
    const colorStyle = { color: COLOR_MAP[color] ?? Colors.text.primary };
    const alignStyle = { textAlign: align };
    const weightStyle = weight ? { fontWeight: weight } : {};

    return [baseStyle, colorStyle, alignStyle, weightStyle, style];
  };

  return (
    <RNText style={getTextStyle() as StyleProp<TextStyle>} {...props}>
      {children}
    </RNText>
  );
};

export default AppText;