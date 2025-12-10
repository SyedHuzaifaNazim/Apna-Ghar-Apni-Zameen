import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Linking, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';

const HelpScreen: React.FC = () => {
  const router = useRouter();

  const faqs = [
    { q: "How do I list a property?", a: "Go to Profile > My Listings and tap 'Post New Property'." },
    { q: "How are listings verified?", a: "Our team verifies ownership documents and location before publishing." },
    { q: "How do I contact an agent?", a: "On any property detail page, use the Call, WhatsApp, or Email buttons." },
    { q: "Can I use the app without an account?", a: "Yes, you can browse, but saving favorites requires sign-in." },
  ];

  const handleContactSupport = (method: 'email' | 'phone') => {
    if (method === 'email') {
      Linking.openURL('mailto:support@apnagharapnizameen.com');
    } else {
      Linking.openURL('tel:+921234567890');
    }
  };

  return (
    <SafeAreaView style={styles.flex1}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={Colors.primary[500]} />
        </TouchableOpacity>
        <AppText variant="h2" weight="bold">Help & Support</AppText>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.card}>
            <AppText variant="h3" weight="bold" style={styles.cardTitle}>Frequently Asked Questions</AppText>
            {faqs.map((item, index) => (
                <View key={index} style={styles.faqItem}>
                    <AppText variant="body" weight="semibold">{item.q}</AppText>
                    <AppText variant="small" color="secondary" style={styles.faqAnswer}>{item.a}</AppText>
                    {index < faqs.length - 1 && <View style={styles.divider} />}
                </View>
            ))}
        </View>

        <View style={styles.card}>
            <AppText variant="h3" weight="bold" style={styles.cardTitle}>Contact Support</AppText>
            <AppText variant="body" color="secondary" style={styles.contactText}>
                If you can't find your answer in the FAQ, please reach out to our team.
            </AppText>
            
            <AppButton 
                onPress={() => handleContactSupport('email')}
                leftIcon={<Ionicons name="mail" size={16} color="white" />}
                style={styles.contactButton}
            >
                Email Support
            </AppButton>
            
            <AppButton 
                variant="outline"
                onPress={() => handleContactSupport('phone')}
                leftIcon={<Ionicons name="call" size={16} color={Colors.primary[500]} />}
            >
                Call Helpline
            </AppButton>
        </View>
        
        <View style={{ height: 40 }}/>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
    backgroundColor: Colors.background.secondary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  scrollContent: {
    padding: 16,
    gap: 16,
  },
  card: {
      backgroundColor: 'white',
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: Colors.border.light,
      gap: 12,
  },
  cardTitle: {
      marginBottom: 8,
  },
  faqItem: {
      gap: 4,
      paddingVertical: 8,
  },
  faqAnswer: {
      paddingLeft: 4,
  },
  divider: {
      height: 1,
      backgroundColor: Colors.gray[100],
      marginVertical: 8,
  },
  contactText: {
      marginBottom: 8,
  },
  contactButton: {
      marginBottom: 12,
  }
});

export default HelpScreen;