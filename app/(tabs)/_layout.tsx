import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React, { useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';

import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.background.card,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.background.card,
          borderTopWidth: 0,
          height: 65,
          paddingBottom: 0,
          paddingTop: 0,
          position: 'absolute',
          elevation: 0,
          shadowColor: 'transparent',
        },
        tabBarBackground: () => null,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.text.secondary} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "compass" : "compass-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.text.secondary} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          tabBarIcon: ({ focused }) => (
            <TouchableOpacity 
              style={[
                styles.centerTab,
                focused && styles.centerTabActive
              ]}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={focused 
                  ? [Colors.primary[500], Colors.primary[600]] 
                  : [Colors.primary[400], Colors.primary[500]]
                }
                style={styles.centerTabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name="search" 
                  size={24} 
                  color={Colors.background.card} 
                />
              </LinearGradient>
            </TouchableOpacity>
          ),
        }}
      />
      
      <Tabs.Screen
        name="favorites"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "heart" : "heart-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.text.secondary} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.text.secondary} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: 60,
  },
  activeDot: {
    position: 'absolute',
    bottom: 8,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary[500],
  },
  centerTab: {
    marginTop: -30,
    shadowColor: Colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 16,
  },
  centerTabActive: {
    transform: [{ scale: 1.1 }],
  },
  centerTabGradient: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});

// import { BlurView } from 'expo-blur';
// import { Tabs } from 'expo-router';
// import React from 'react';

// import { HapticTab } from '@/components/haptic-tab';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Colors } from '@/constants/theme';
// import { useColorScheme } from '@/hooks/use-color-scheme';

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   const theme = Colors[colorScheme ?? 'dark'];

//   return (
//     <Tabs
//       screenOptions={{
//         headerShown: true,
//         headerTitle: 'Apaz',
//         headerTitleStyle: {
//           fontFamily: 'ui-rounded',
//           fontSize: 22,
//         },

//         // 💎 Modern Transparent Header
//         headerBackground: () => (
//           <BlurView
//             intensity={70}
//             tint={colorScheme === 'dark' ? 'dark' : 'light'}
//             style={{ flex: 1 }}
//           />
//         ),

//         // ⚡️ Modern Tab Bar
//         tabBarActiveTintColor: theme.tint,
//         tabBarInactiveTintColor: theme.icon,
//         tabBarShowLabel: true,
//         tabBarLabelStyle: {
//           fontFamily: 'ui-rounded',
//           fontSize: 12,
//         },

//         // 🎛 Rounded Tab Bar Container (iOS style for both platforms)
//         tabBarStyle: {
//           position: 'absolute',
//           height: 70,
//           borderTopWidth: 0,
//           elevation: 0,
//           backgroundColor: 'transparent',
//         },

//         // ✨ Blur effect behind tab bar
//         tabBarBackground: () => (
//           <BlurView
//             intensity={65}
//             tint={colorScheme === 'dark' ? 'dark' : 'light'}
//             style={{ flex: 1, borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
//           />
//         ),

//         tabBarButton: HapticTab,
//       }}
//     >
//       <Tabs.Screen
//         name="index"
//         options={{
//           title: 'Home',
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={26} name="house.fill" color={color} />
//           ),
//         }}
//       />

//       <Tabs.Screen
//         name="explore"
//         options={{
//           title: 'Explore',
//           tabBarIcon: ({ color }) => (
//             <IconSymbol size={26} name="paperplane.fill" color={color} />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }
