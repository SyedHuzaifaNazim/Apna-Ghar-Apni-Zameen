import React, { forwardRef } from 'react';
import { TextInput as RNInput, StyleSheet, TextInputProps, View } from 'react-native';

interface SafeInputProps extends TextInputProps {
  InputLeftElement?: React.ReactNode;
  InputRightElement?: React.ReactNode;
}

export const SafeInput = forwardRef<RNInput, SafeInputProps>((props, ref) => {
  return (
    <View style={styles.container}>
      {props.InputLeftElement}
      <RNInput
        ref={ref}
        {...props}
        style={[styles.input, props.style]}
        placeholderTextColor="#666"
      />
      {props.InputRightElement}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB', // gray.50
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB', // gray.200
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 8,
    color: '#333',
  },
});