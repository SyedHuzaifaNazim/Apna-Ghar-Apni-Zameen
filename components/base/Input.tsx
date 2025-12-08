import { IInputProps, Input as NativeBaseInput } from 'native-base';
import React, { forwardRef } from 'react';

const InputComponent = forwardRef<any, IInputProps>((props, ref) => {
  // Clean up all style props to ensure they're numbers, not strings
  const cleanProps = {
    ...props,
    // Ensure all numeric props are numbers
    borderRadius: typeof props.borderRadius === 'string' ? 8 : (props.borderRadius || 8),
    borderWidth: typeof props.borderWidth === 'string' ? 1 : (props.borderWidth || 1),
    fontSize: props.fontSize || "md",
    height: typeof props.height === 'string' ? 40 : (props.height || 40),
  };

  // Remove _focus styles that might contain problematic web props
  const { _focus, ...restProps } = cleanProps;

  // Create safe focus styles without web-specific properties
  const safeFocusStyles = _focus ? {
    _focus: {
      ..._focus,
      borderColor: _focus.borderColor || "primary.500",
      backgroundColor: _focus.backgroundColor || "white",
      borderWidth: typeof _focus?.borderWidth === 'string' ? 2 : (_focus?.borderWidth || 2),
      // Remove any web-specific styles that might cause issues
      _web: undefined
    }
  } : {};

  return (
    <NativeBaseInput
      {...restProps}
      {...safeFocusStyles}
      ref={ref || undefined}
      // Add explicit style cleanup
      style={[
        { outlineWidth: 0 }, // Explicitly set as number
        props.style
      ]}
    />
  );
});

InputComponent.displayName = 'Input';

export const Input = InputComponent as React.ForwardRefExoticComponent<
  IInputProps & 
  React.RefAttributes<any>
>;