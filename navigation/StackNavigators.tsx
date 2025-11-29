import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import FavoritesScreen from '@/screens/FavoritesScreen';
import LoginScreen from '../features/auth/LoginScreen';
import RegisterScreen from '../features/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import ListingDetailScreen from '../screens/ListingDetailScreen';
import MapScreen from '../screens/MapScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import SettingsScreen from '../screens/SettingsScreen';

export type PrimaryStackOptions = {
  headerShown?: boolean;
};

export type HomeStackParamList = {
  HomeMain: undefined;
  ListingDetail: { propertyId: number };
  Search: undefined;
  Notifications: undefined;
};

export type MapStackParamList = {
  MapMain: undefined;
  ListingDetail: { propertyId: number };
};

export type ProfileStackParamList = {
  ProfileMain: undefined;
  Settings: undefined;
  Notifications: undefined;
  Login: undefined;
  Register: undefined;
};
export type FavoritesStackParamList = {
  FavoritesMain: undefined;
};

const defaultScreenOptions = {
  headerShown: false,
} as const;

const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const MapStack = createNativeStackNavigator<MapStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const FavoritesStack = createNativeStackNavigator<FavoritesStackParamList>();

export const FavoritesStackNavigator = () => (
  <FavoritesStack.Navigator screenOptions={defaultScreenOptions}>
    <FavoritesStack.Screen name="FavoritesMain" component={FavoritesScreen} />
  </FavoritesStack.Navigator>
);

export const HomeStackNavigator = () => (
  <HomeStack.Navigator screenOptions={defaultScreenOptions}>
    <HomeStack.Screen name="HomeMain" component={HomeScreen} />
    <HomeStack.Screen name="ListingDetail" component={ListingDetailScreen} />
    <HomeStack.Screen name="Search" component={SearchScreen} />
    <HomeStack.Screen name="Notifications" component={NotificationsScreen} />
  </HomeStack.Navigator>
);

export const MapStackNavigator = () => (
  <MapStack.Navigator screenOptions={defaultScreenOptions}>
    <MapStack.Screen name="MapMain" component={MapScreen} />
    <MapStack.Screen name="ListingDetail" component={ListingDetailScreen} />
  </MapStack.Navigator>
);

export const ProfileStackNavigator = () => (
  <ProfileStack.Navigator screenOptions={defaultScreenOptions}>
    <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
    <ProfileStack.Screen name="Settings" component={SettingsScreen} />
    <ProfileStack.Screen name="Notifications" component={NotificationsScreen} />
    <ProfileStack.Screen name="Login" component={LoginScreen} />
    <ProfileStack.Screen name="Register" component={RegisterScreen} />
  </ProfileStack.Navigator>
);

