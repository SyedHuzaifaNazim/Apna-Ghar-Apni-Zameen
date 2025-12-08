import { Platform, ViewStyle } from 'react-native';

type WebSafeStyle = ViewStyle & {
  outlineWidth?: number;
  outline?: string;
  outlineStyle?: 'none' | 'solid' | 'dotted' | 'dashed';
};

export const getWebSafeStyle = (style: Partial<WebSafeStyle> = {}): Partial<WebSafeStyle> => {
  if (Platform.OS === 'web') {
    return {
      ...style,
      outlineWidth: 0,
      outline: 'none',
    };
  }
  return style;
};

export const getWebSafeFocusStyle = () => {
  if (Platform.OS === 'web') {
    return {
      _web: {
        style: {
          outlineWidth: 0,
          outline: 'none',
        }
      }
    };
  }
  return {};
};
