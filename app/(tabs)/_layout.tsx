import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'dark'].tint,
        tabBarButton: HapticTab,
        headerStyle: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: 100,
          width: '100%',
          backgroundColor: Colors[colorScheme ?? 'dark'].background,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
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
