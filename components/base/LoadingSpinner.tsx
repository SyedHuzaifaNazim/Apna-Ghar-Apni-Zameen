import React from 'react';
import { ActivityIndicator, StyleSheet, View, ViewStyle } from 'react-native';
import { Colors } from '../../constants/Colors';
import AppText from './AppText';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  text?: string;
  overlay?: boolean;
  style?: ViewStyle;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'large',
  color = Colors.primary,
  text,
  overlay = false,
  style,
}) => {
  const spinner = (
    <View style={[styles.container, overlay && styles.overlay, style]}>
      <View style={styles.content}>
        <ActivityIndicator size={size} color={color[500]} />
        {text && (
          <AppText variant="body" color="secondary" style={styles.text}>
            {text}
          </AppText>
        )}
      </View>
    </View>
  );

  if (overlay) {
    return (
      <View style={styles.overlayContainer}>
        {spinner}
      </View>
    );
  }

  return spinner;
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  overlay: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  content: {
    alignItems: 'center',
  },
  text: {
    marginTop: 12,
  },
});

export default LoadingSpinner;