import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Linking, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import ErrorBoundary from '@/components/base/ErrorBoundary';
import { Colors } from '@/constants/Colors';

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
        activeOpacity={0.8}
      >
        <AppText weight="bold" style={styles.collapsibleTitle}>
          {title}
        </AppText>
        <Ionicons
          name={isExpanded ? 'chevron-up' : 'chevron-down'}
          size={20}
          color={Colors.primary[500]}
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
        <View style={styles.headerBlock}>
          <Image
            source={require('@/assets/images/logo_agaz.jpg')}
            style={styles.logo}
            contentFit="contain"
          />
          <AppText variant="h1" weight="bold" style={styles.headerTitleMain}>
            Apna Ghar Apni Zameen
          </AppText>
          <AppText variant="body" color="secondary" style={styles.headerSubtitle}>
            The Future of Real Estate in Pakistan
          </AppText>
        </View>

        <View style={styles.contentWrapper}>
          {/* Intro */}
          <View style={styles.introBlock}>
            <AppText weight="semibold" style={styles.introBlockTitle}>
                Welcome
            </AppText>
            <AppText variant="body" style={styles.introTextBlock}>
              Welcome to <AppText weight="bold" style={{ color: Colors.primary[600] }}>Apna Ghar Apni Zameen</AppText> — your trusted
              partner for buying, selling, and investing in real estate across Pakistan. Our platform
              is designed to bring <AppText weight="bold">transparency, security, and efficiency</AppText> to the property market.
            </AppText>
          </View>

          {/* Section: Key Pillars (Why Choose Us) */}
          <CollapsibleSection title="Our Key Pillars">
            <View style={styles.listContainer}>
                {[
                    'Transparency: Clear and honest property details.',
                    'Verification: Every listing is checked for authenticity.',
                    'Technology: State-of-the-art search and map features.',
                    'Service: Dedicated support for buyers and sellers.',
                ].map((item, index) => (
                    <View key={index} style={styles.listItemRow}>
                        <Ionicons name="checkmark-circle" size={16} color={Colors.primary[500]} style={{ marginRight: 8 }} />
                        <AppText variant="body">{item}</AppText>
                    </View>
                ))}
            </View>
          </CollapsibleSection>

          {/* Section: Contact & Website */}
          <CollapsibleSection title="Contact & Resources">
            <AppText variant="body" color="secondary" style={styles.sectionText}>
              For immediate support, inquiries, or media requests, please visit our official website.
            </AppText>
            <AppButton
                variant="outline"
                onPress={handleWebsitePress}
                style={styles.websiteButton}
                textStyle={{ color: Colors.primary[500] }}
                leftIcon={<Ionicons name="globe-outline" size={20} color={Colors.primary[500]} />}
            >
              Visit Official Website
            </AppButton>
          </CollapsibleSection>
        </View>

        {/* Bottom spacing */}
        <View style={{ height: 80 }} />
      </ScrollView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  headerBlock: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: Colors.primary[50],
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: 'white',
  },
  headerTitleMain: {
    fontSize: 24,
    color: Colors.primary[700],
    marginTop: 16,
  },
  headerSubtitle: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
  },
  contentWrapper: {
    padding: 16,
    gap: 16,
  },
  introBlock: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: 8,
  },
  introBlockTitle: {
    fontSize: 18,
    color: Colors.text.primary,
  },
  introTextBlock: {
    lineHeight: 24,
  },
  collapsibleContainer: {
    marginHorizontal: 0,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: Colors.shadow.medium,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  collapsibleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: Colors.background.card,
  },
  collapsibleTitle: {
    fontSize: 18,
    color: Colors.text.primary,
  },
  collapsibleContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 12,
  },
  sectionText: {
    lineHeight: 24,
    color: Colors.gray[600],
  },
  listContainer: {
    gap: 8,
    paddingLeft: 8,
  },
  listItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  websiteButton: {
    marginTop: 12,
    borderColor: Colors.primary[500],
    backgroundColor: 'transparent',
    borderWidth: 2,
  },
});