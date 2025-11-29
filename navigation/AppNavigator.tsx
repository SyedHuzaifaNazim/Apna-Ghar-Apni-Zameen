import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import BottomTabNavigator from './BottomTabNavigator';
import linking from './DeepLinking';
import { navigationRef } from './NavigationService';

const AppNavigator = () => (
  <NavigationContainer ref={navigationRef} linking={linking}>
    <BottomTabNavigator />
  </NavigationContainer>
);

export default AppNavigator;