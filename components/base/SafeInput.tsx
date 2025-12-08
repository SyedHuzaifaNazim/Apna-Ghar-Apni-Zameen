import { Box } from 'native-base';
import React, { forwardRef } from 'react';
import { TextInput as RNInput, TextInputProps } from 'react-native';

interface SafeInputProps extends TextInputProps {
  InputLeftElement?: React.ReactNode;
  InputRightElement?: React.ReactNode;
}

export const SafeInput = forwardRef<any, SafeInputProps>((props, ref) => {
  return (
    <Box 
      flex={1} 
      flexDirection="row" 
      alignItems="center"
      backgroundColor="gray.50"
      borderRadius={8}
      borderWidth={1}
      borderColor="gray.200"
      paddingHorizontal={12}
    >
      {props.InputLeftElement}
      <RNInput
        ref={ref}
        placeholder={props.placeholder}
        value={props.value}
        onChangeText={props.onChangeText}
        style={{
          flex: 1,
          height: 40,
          fontSize: 16,
          paddingLeft: 8,
          color: '#333',
        }}
        placeholderTextColor="#666"
        autoFocus={props.autoFocus}
      />
      {props.InputRightElement}
    </Box>
  );
});