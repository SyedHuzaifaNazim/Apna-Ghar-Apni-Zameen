import { Colors } from '@/constants/Colors';
import React, { forwardRef, useState } from 'react';
import { StyleSheet, TextInput, TextInputProps } from 'react-native';

interface InputProps extends TextInputProps {
  // Add any custom props here if needed
}

export const Input = forwardRef<TextInput, InputProps>((props, ref) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    props.onBlur?.(e);
  };

  return (
    <TextInput
      ref={ref}
      {...props}
      style={[
        styles.input,
        props.style,
        isFocused && styles.focusedInput
      ]}
      placeholderTextColor={Colors.text?.disabled || '#9CA3AF'}
      onFocus={handleFocus}
      onBlur={handleBlur}
    />
  );
});

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray?.[300] || '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    color: Colors.text?.primary || '#111827',
    backgroundColor: 'white',
  },
  focusedInput: {
    borderColor: Colors.primary?.[500] || '#2563EB',
    borderWidth: 2,
    // Add 1px padding compensation if needed to prevent layout shift with border width change, 
    // or just accept the slight shift which is standard in many inputs.
  },
});

Input.displayName = 'Input';