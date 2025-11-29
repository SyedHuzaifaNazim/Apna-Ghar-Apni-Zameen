import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

import { Colors } from '@/constants/Colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary[100],
        tabBarActiveBackgroundColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.text.secondary,
        tabBarStyle: {
          backgroundColor: Colors.background.tertiary,
          borderTopColor: Colors.border.focus,
          borderTopWidth: 0,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size || 24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" size={size || 24} color={color} />
          ),
        }}
      />
            <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size || 24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}



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
