// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { Collapsible } from '@/components/ui/collapsible';
// import { ExternalLink } from '@/components/external-link';
// import ParallaxScrollView from '@/components/parallax-scroll-view';
// import { ThemedText } from '@/components/themed-text';
// import { ThemedView } from '@/components/themed-view';
// import { IconSymbol } from '@/components/ui/icon-symbol';
// import { Fonts } from '@/constants/theme';

// export default function TabTwoScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
//       headerImage={
//         <IconSymbol
//           size={310}
//           color="#808080"
//           name="chevron.left.forwardslash.chevron.right"
//           style={styles.headerImage}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText
//           type="title"
//           style={{
//             fontFamily: Fonts.rounded,
//           }}>
//           Explore
//         </ThemedText>
//       </ThemedView>
//       <ThemedText>This app includes example code to help you get started.</ThemedText>
//       <Collapsible title="File-based routing">
//         <ThemedText>
//           This app has two screens:{' '}
//           <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> and{' '}
//           <ThemedText type="defaultSemiBold">app/(tabs)/explore.tsx</ThemedText>
//         </ThemedText>
//         <ThemedText>
//           The layout file in <ThemedText type="defaultSemiBold">app/(tabs)/_layout.tsx</ThemedText>{' '}
//           sets up the tab navigator.
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/router/introduction">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Android, iOS, and web support">
//         <ThemedText>
//           You can open this project on Android, iOS, and the web. To open the web version, press{' '}
//           <ThemedText type="defaultSemiBold">w</ThemedText> in the terminal running this project.
//         </ThemedText>
//       </Collapsible>
//       <Collapsible title="Images">
//         <ThemedText>
//           For static images, you can use the <ThemedText type="defaultSemiBold">@2x</ThemedText> and{' '}
//           <ThemedText type="defaultSemiBold">@3x</ThemedText> suffixes to provide files for
//           different screen densities
//         </ThemedText>
//         <Image
//           source={require('@/assets/images/react-logo.png')}
//           style={{ width: 100, height: 100, alignSelf: 'center' }}
//         />
//         <ExternalLink href="https://reactnative.dev/docs/images">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Light and dark mode components">
//         <ThemedText>
//           This template has light and dark mode support. The{' '}
//           <ThemedText type="defaultSemiBold">useColorScheme()</ThemedText> hook lets you inspect
//           what the user&apos;s current color scheme is, and so you can adjust UI colors accordingly.
//         </ThemedText>
//         <ExternalLink href="https://docs.expo.dev/develop/user-interface/color-themes/">
//           <ThemedText type="link">Learn more</ThemedText>
//         </ExternalLink>
//       </Collapsible>
//       <Collapsible title="Animations">
//         <ThemedText>
//           This template includes an example of an animated component. The{' '}
//           <ThemedText type="defaultSemiBold">components/HelloWave.tsx</ThemedText> component uses
//           the powerful{' '}
//           <ThemedText type="defaultSemiBold" style={{ fontFamily: Fonts.mono }}>
//             react-native-reanimated
//           </ThemedText>{' '}
//           library to create a waving hand animation.
//         </ThemedText>
//         {Platform.select({
//           ios: (
//             <ThemedText>
//               The <ThemedText type="defaultSemiBold">components/ParallaxScrollView.tsx</ThemedText>{' '}
//               component provides a parallax effect for the header image.
//             </ThemedText>
//           ),
//         })}
//       </Collapsible>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   headerImage: {
//     color: '#808080',
//     bottom: -90,
//     left: -35,
//     position: 'absolute',
//   },
//   titleContainer: {
//     flexDirection: 'row',
//     gap: 8,
//   },
// });

import { Image } from 'expo-image';
import { StyleSheet } from 'react-native';

import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';

export default function AboutScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#E6E6E6', dark: '#2F2F2F' }}
      headerImage={
        <IconSymbol
          size={300}
          color="#808080"
          name="house.fill"
          style={styles.headerImage}
        />
      }
    >
      {/* Title */}
      <ThemedView style={styles.titleContainer}>
        <ThemedText
          type="title"
          style={{
            fontFamily: Fonts.rounded,
          }}
        >
          About Us
        </ThemedText>
      </ThemedView>

      {/* Intro */}
      <ThemedText style={{ marginBottom: 15 }}>
        Welcome to <ThemedText type="defaultSemiBold">Apna Ghar Apni Zameen</ThemedText> — 
        your trusted partner for buying, selling, and investing in real estate across Pakistan.
      </ThemedText>

      {/* Section: Company Overview */}
      <Collapsible title="Who We Are">
        <ThemedText>
          Apna Ghar Apni Zameen is a modern real estate platform designed to make property 
          transactions simple, transparent, and secure. We help individuals and families 
          find their dream homes, prime plots, and profitable investment opportunities.
        </ThemedText>
      </Collapsible>

      {/* Section: Mission */}
      <Collapsible title="Our Mission">
        <ThemedText>
          Our mission is to empower people with trustworthy real estate information, verified 
          listings, and a smooth property buying or selling experience — all in one app.
        </ThemedText>
      </Collapsible>

      {/* Section: App Features */}
      <Collapsible title="App Features">
        <ThemedText>• Browse verified properties across all major cities</ThemedText>
        <ThemedText>• Advanced search with filters for price, location, and type</ThemedText>
        <ThemedText>• High-quality photos and complete property details</ThemedText>
        <ThemedText>• Favorites system to save properties</ThemedText>
        <ThemedText>• Direct contact with property dealers</ThemedText>
        <ThemedText>• Personalized recommendations</ThemedText>
      </Collapsible>

      {/* Section: Why Choose Us */}
      <Collapsible title="Why Choose Us">
        <ThemedText>✔ 100% verified and trusted listings</ThemedText>
        <ThemedText>✔ Secure communication between buyers and sellers</ThemedText>
        <ThemedText>✔ Real-time updates on new properties</ThemedText>
        <ThemedText>✔ Transparent and smooth user experience</ThemedText>
        <ThemedText>✔ Designed for both buyers & investors</ThemedText>
      </Collapsible>

      {/* Section: Services */}
      <Collapsible title="Our Services">
        <ThemedText>• Residential Properties</ThemedText>
        <ThemedText>• Commercial Spaces</ThemedText>
        <ThemedText>• Plots for Investment</ThemedText>
        <ThemedText>• Rental Properties</ThemedText>
        <ThemedText>• Real Estate Consultancy</ThemedText>
      </Collapsible>

      {/* Section: Contact */}
      <Collapsible title="Learn More">
        <ThemedText>
          Want to explore more about us? Visit our website or contact our support team.  
        </ThemedText>

        <ExternalLink href="https://apnagharapnizameen.com">
          <ThemedText type="link">Visit Website</ThemedText>
        </ExternalLink>
      </Collapsible>

      {/* Optional Image */}
      <Image
        source={require('@/assets/images/logo_agaz.jpg')}
        style={{ width: 120, height: 120, alignSelf: 'center', marginTop: 20 }}
      />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -40,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
