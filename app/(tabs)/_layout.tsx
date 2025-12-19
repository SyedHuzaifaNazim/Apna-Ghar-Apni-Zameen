import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Colors } from '@/constants/Colors';

export default function TabLayout() {

  return (
    <Tabs
      screenOptions={{
        headerShown: false, // Tabs content manages its own header
        tabBarActiveTintColor: Colors.primary[500], // Use brand green for active state
        tabBarInactiveTintColor: Colors.gray[600], // Use dark gray for inactive state
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: Colors.background.primary, // White background for the bar
          borderTopWidth: 0,
          height: 80, // Slightly taller for modern look
          paddingBottom: 0,
          paddingTop: 0,
          position: 'absolute',
          // Subtle shadow for a clean, floating effect
          elevation: 5,
          shadowColor: Colors.shadow.medium,
          shadowOffset: {
            width: 0,
            height: -3,
          },
          shadowOpacity: 0.15,
          shadowRadius: 5,
        },
        tabBarBackground: () => null,
      }}>
      
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "home" : "home-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.gray[600]} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "map" : "map-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.gray[600]} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ focused }) => (
            <View 
              style={[
                styles.centerTabWrapper,
              ]}
            >
              <LinearGradient
                colors={[Colors.primary[500], Colors.primary[600]]} 
                style={styles.centerTabGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Ionicons 
                  name="search" 
                  size={26} 
                  color={Colors.background.card} 
                />
              </LinearGradient>
            </View>
          ),
          // REMOVED: unmountOnBlur: true to fix TypeScript error
        }}
      />
      
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "heart" : "heart-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.gray[600]} 
              />
              {focused && <View style={styles.activeDot} />}
            </View>
          ),
        }}
      />
      
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => (
            <View style={styles.tabItem}>
              <Ionicons 
                name={focused ? "person" : "person-outline"} 
                size={26} 
                color={focused ? Colors.primary[500] : Colors.gray[600]} 
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
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary[500],
  },
  centerTabWrapper: {
    marginTop: -25, 
    shadowColor: Colors.primary[500],
    shadowOffset: {
      width: 0,
      height: 6, 
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 100,
    backgroundColor: 'transparent',
  },
  centerTabGradient: {
    width: 55, 
    height: 55,
    borderRadius: 27.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
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
