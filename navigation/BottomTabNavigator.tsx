import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

import { Colors } from '../constants/Colors';
import { HomeStackNavigator, MapStackNavigator, ProfileStackNavigator } from './StackNavigators';

export type BottomTabParamList = {
  Home: undefined;
  Map: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarActiveTintColor: Colors.primary[500],
      tabBarInactiveTintColor: Colors.text.secondary,
      tabBarStyle: {
        backgroundColor: Colors.background.primary,
        borderTopColor: Colors.border.light,
        borderTopWidth: 1,
      },
      tabBarIcon: ({ color, size, focused }) => {
        let iconName: keyof typeof Ionicons.glyphMap = 'home-outline';

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'Map':
            iconName = focused ? 'map' : 'map-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          case 'Favorites':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
          default:
            break;
        }

        return <Ionicons name={iconName} size={size ?? 24} color={color} />;
      },
    })}
  >
    <Tab.Screen name="Home" component={HomeStackNavigator} options={{ title: 'Browse' }} />
    <Tab.Screen name="Map" component={MapStackNavigator} options={{ title: 'Map' }} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ title: 'Profile' }} />
    <Tab.Screen name="Favorites" component={FavoritesStackNavigator} options={{ title: 'Favorites' }} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
