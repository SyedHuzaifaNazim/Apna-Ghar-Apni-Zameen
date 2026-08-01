import React, { useMemo } from 'react';
import { Text as RNText, StyleProp, TextProps as RNTextProps, TextStyle } from 'react-native';

import { Colors } from '@/constants/Colors';
import { FontWeight, TextVariants } from '@/constants/Typography';

export type AppTextVariant = keyof typeof TextVariants;
export type AppTextWeight = keyof typeof FontWeight;

/**
 * Semantic color names. Anything not listed here is passed through verbatim,
 * so `color="#d1cfcf"` and `color={Colors.warning[500]}` both work.
 */
const SEMANTIC_COLORS = {
  primary: Colors.text.primary,
  secondary: Colors.text.secondary,
  disabled: Colors.text.disabled,
  inverse: Colors.text.inverse,
  link: Colors.text.link,
  brand: Colors.primary[500],
  error: Colors.error[500],
  success: Colors.success[500],
  warning: Colors.warning[700],
  muted: Colors.gray[600],
} as const;

export type AppTextColor = keyof typeof SEMANTIC_COLORS | (string & {});

const resolveColor = (color: AppTextColor): string =>
  SEMANTIC_COLORS[color as keyof typeof SEMANTIC_COLORS] ?? (color as string);

interface AppTextProps extends RNTextProps {
  variant?: AppTextVariant;
  /** Semantic name (`"secondary"`) or any raw color value (`"#fff"`). */
  color?: AppTextColor;
  align?: TextStyle['textAlign'];
  /**
   * Maps to real numeric RN weights. Previously this passed `"semibold"`
   * straight to `fontWeight`, which React Native ignores.
   */
  weight?: AppTextWeight;
  children: React.ReactNode;
}

const AppText: React.FC<AppTextProps> = ({
  variant = 'body',
  color = 'primary',
  align,
  weight,
  style,
  children,
  ...rest
}) => {
  const composed = useMemo<StyleProp<TextStyle>>(() => {
    const base = TextVariants[variant] ?? TextVariants.body;

    return [
      base,
      { color: resolveColor(color) },
      align ? { textAlign: align } : null,
      weight ? { fontWeight: FontWeight[weight] } : null,
      style,
    ];
  }, [variant, color, align, weight, style]);

  return (
    <RNText style={composed} {...rest}>
      {children}
    </RNText>
  );
};

export default AppText;
