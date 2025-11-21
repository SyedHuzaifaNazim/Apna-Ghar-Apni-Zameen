// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/hello-wave';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { Link } from 'expo-router';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {Platform.select({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <Link href="/modal">
//           <Link.Trigger>
//             <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//           </Link.Trigger>
//           <Link.Preview />
//           <Link.Menu>
//             <Link.MenuAction title="Action" icon="cube" onPress={() => alert('Action pressed')} />
//             <Link.MenuAction
//               title="Share"
//               icon="square.and.arrow.up"
//               onPress={() => alert('Share pressed')}
//             />
//             <Link.Menu title="More" icon="ellipsis">
//               <Link.MenuAction
//                 title="Delete"
//                 icon="trash"
//                 destructive
//                 onPress={() => alert('Delete pressed')}
//               />
//             </Link.Menu>
//           </Link.Menu>
//         </Link>

//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });


import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { Link } from 'expo-router';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#F3F5F7', dark: '#1a1a1a' }}
      headerImage={
        <Image
          source={require('@/assets/images/logo_agaz.jpg')}
          style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 20 }}
        />
      }
    >
      <ThemedText
        type="subtitle"
        style={{ opacity: 0.6, marginBottom: 16, fontFamily: Fonts.rounded }}
      >
        Apni Zameen, Apna Future 🏡
      </ThemedText>

      {/* Glass Cards */}
      <BlurView intensity={70} tint="light" style={styles.glassCard}>
        <ThemedText type="subtitle" style={styles.cardTitle}>
          Find Your Dream Property
        </ThemedText>
        <ThemedText style={{ opacity: 0.7 }}>
          Browse thousands of verified listings across Pakistan.
        </ThemedText>
      </BlurView>

      {/* Categories */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Categories
      </ThemedText>

      <View style={styles.categoriesRow}>
        <CategoryItem name="house.fill" title="Homes" />
        <CategoryItem name="building.2.fill" title="Commercial" />
        <CategoryItem name="map.fill" title="Plots" />
      </View>

      {/* Quick Actions */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Quick Actions
      </ThemedText>

      <View style={styles.actionRow}>
        <QuickAction title="Explore" icon="magnifyingglass" link="/explore" />
        <QuickAction title="Favorites" icon="heart.fill" link="/favorites" />
        <QuickAction title="Contact" icon="phone.fill" link="/contact" />
      </View>

      {/* Bottom Card */}
      <BlurView intensity={60} tint="light" style={styles.bottomCard}>
        <ThemedText type="subtitle">Real Estate Made Simple</ThemedText>
        <ThemedText style={{ opacity: 0.7 }}>
          Your dream home is just a few taps away.
        </ThemedText>
      </BlurView>
    </ParallaxScrollView>
  );
}

/* -------- Reusable Components -------- */

function CategoryItem({ name, title }: { name: string; title: string }) {
  return (
    <View style={styles.categoryItem}>
      <IconSymbol name={name as any} size={32} color="#4A89F3" />
      <ThemedText style={{ marginTop: 4 }}>{title}</ThemedText>
    </View>
  );
}

function QuickAction({ title, icon, link }: { title: string; icon: string; link: string }) {
  return (
    <Link href={link as any} asChild>
      <View style={styles.quickAction}>
        <IconSymbol name={icon as any} size={20} color="#fff" />
        <ThemedText style={{ color: '#fff', fontFamily: Fonts.rounded }}>
          {title}
        </ThemedText>
      </View>
    </Link>
  );
}

/* -------- Styles -------- */

const styles = StyleSheet.create({
  heroImage: {
    height: 260,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: -4,
  },
  glassCard: {
    padding: 18,
    borderRadius: 20,
    marginBottom: 20,
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: Fonts.rounded,
    marginBottom: 6,
  },
  sectionTitle: {
    marginVertical: 14,
    fontFamily: Fonts.rounded,
  },
  categoriesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
  },
  categoryItem: {
    width: '30%',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.6)',
    elevation: 3,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  quickAction: {
    width: '30%',
    backgroundColor: '#4A89F3',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 6,
  },
  bottomCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    marginBottom: 80,
    overflow: 'hidden',
  },
});
