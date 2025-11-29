import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import ErrorBoundary from '@/components/base/ErrorBoundary';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
}

function CollapsibleSection({ title, children }: CollapsibleSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View style={styles.collapsibleContainer}>
      <TouchableOpacity
        style={styles.collapsibleHeader}
        onPress={() => setIsExpanded(!isExpanded)}
        activeOpacity={0.7}
      >
        <AppText variant="h3" weight="semibold">
          {title}
        </AppText>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color="#666"
        />
      </TouchableOpacity>
      {isExpanded && <View style={styles.collapsibleContent}>{children}</View>}
    </View>
  );
}

export default function ExploreScreen() {
  const handleWebsitePress = () => {
    Linking.openURL('https://apnagharapnizameen.com').catch((err) =>
      console.error('Failed to open URL:', err)
    );
  };

  return (
    <ErrorBoundary>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/logo_agaz.jpg')}
            style={styles.logo}
            contentFit="contain"
          />
          <AppText variant="h1" weight="bold" align="center" style={styles.title}>
            About Us
          </AppText>
        </View>

        {/* Intro */}
        <View style={styles.section}>
          <AppText variant="body" style={styles.introText}>
            Welcome to <AppText weight="bold">Apna Ghar Apni Zameen</AppText> — your trusted
            partner for buying, selling, and investing in real estate across Pakistan.
          </AppText>
        </View>

        {/* Section: Company Overview */}
        <CollapsibleSection title="Who We Are">
          <AppText variant="body" style={styles.sectionText}>
            Apna Ghar Apni Zameen is a modern real estate platform designed to make property
            transactions simple, transparent, and secure. We help individuals and families find
            their dream homes, prime plots, and profitable investment opportunities.
          </AppText>
        </CollapsibleSection>

        {/* Section: Mission */}
        <CollapsibleSection title="Our Mission">
          <AppText variant="body" style={styles.sectionText}>
            Our mission is to empower people with trustworthy real estate information, verified
            listings, and a smooth property buying or selling experience — all in one app.
          </AppText>
        </CollapsibleSection>

        {/* Section: App Features */}
        <CollapsibleSection title="App Features">
          <View style={styles.listContainer}>
            <AppText variant="body" style={styles.listItem}>
              • Browse verified properties across all major cities
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Advanced search with filters for price, location, and type
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • High-quality photos and complete property details
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Favorites system to save properties
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Direct contact with property dealers
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Personalized recommendations
            </AppText>
          </View>
        </CollapsibleSection>

        {/* Section: Why Choose Us */}
        <CollapsibleSection title="Why Choose Us">
          <View style={styles.listContainer}>
            <AppText variant="body" style={styles.listItem}>
              ✔ 100% verified and trusted listings
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              ✔ Secure communication between buyers and sellers
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              ✔ Real-time updates on new properties
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              ✔ Transparent and smooth user experience
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              ✔ Designed for both buyers & investors
            </AppText>
          </View>
        </CollapsibleSection>

        {/* Section: Services */}
        <CollapsibleSection title="Our Services">
          <View style={styles.listContainer}>
            <AppText variant="body" style={styles.listItem}>
              • Residential Properties
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Commercial Spaces
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Plots for Investment
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Rental Properties
            </AppText>
            <AppText variant="body" style={styles.listItem}>
              • Real Estate Consultancy
            </AppText>
          </View>
        </CollapsibleSection>

        {/* Section: Contact */}
        <CollapsibleSection title="Learn More">
          <AppText variant="body" style={styles.sectionText}>
            Want to explore more about us? Visit our website or contact our support team.
          </AppText>
          <AppButton
            variant="outline"
            onPress={handleWebsitePress}
            style={styles.websiteButton}
            leftIcon={<Ionicons name="globe-outline" size={18} color="#4A89F3" />}
          >
            Visit Website
          </AppButton>
        </CollapsibleSection>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 16,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  introText: {
    lineHeight: 24,
  },
  collapsibleContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    overflow: 'hidden',
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  collapsibleContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  sectionText: {
    lineHeight: 24,
    color: '#333',
  },
  listContainer: {
    paddingTop: 4,
  },
  listItem: {
    marginBottom: 8,
    lineHeight: 22,
    color: '#333',
  },
  websiteButton: {
    marginTop: 12,
  },
  bottomSpacing: {
    height: 40,
  },
});
