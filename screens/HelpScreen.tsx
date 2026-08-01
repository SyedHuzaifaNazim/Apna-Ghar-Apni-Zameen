import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { openEmail, openPhoneDialer } from '@/lib/contactLinks';

const SUPPORT_EMAIL = 'support@farshezameen.com';
const SUPPORT_PHONE = '+921234567890';

const FAQS = [
  { q: 'How do I list a property?', a: "Go to Profile > My Listings and tap 'Post New Property'." },
  { q: 'How are listings verified?', a: 'Our team verifies ownership documents and location before publishing.' },
  { q: 'How do I contact an agent?', a: 'On any property detail page, use the Call, WhatsApp, or Email buttons.' },
  { q: 'Can I use the app without an account?', a: 'Yes, you can browse, but saving favorites requires sign-in.' },
];

const HelpScreen: React.FC = () => {
  const router = useRouter();

  const handleContactSupport = async (method: 'email' | 'phone') => {
    if (method === 'email') {
      await openEmail(SUPPORT_EMAIL, 'Support request', '');
    } else {
      await openPhoneDialer(SUPPORT_PHONE);
    }
  };

  return (
    <SafeAreaView style={styles.flex1} edges={['top']}>
      <View style={styles.header}>
        {router.canGoBack() && (
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityRole="button">
            <Ionicons name="arrow-back" size={22} color={Colors.primary[500]} />
          </TouchableOpacity>
        )}
        <AppText variant="h3" weight="bold">
          Help & Support
        </AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <AppText variant="h4" weight="bold" style={styles.cardTitle}>
            Frequently Asked Questions
          </AppText>
          {FAQS.map((item, index) => (
            <View key={item.q}>
              <View style={styles.faqItem}>
                <AppText variant="body" weight="semibold">
                  {item.q}
                </AppText>
                <AppText variant="bodySmall" color="secondary" style={styles.faqAnswer}>
                  {item.a}
                </AppText>
              </View>
              {index < FAQS.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <AppText variant="h4" weight="bold" style={styles.cardTitle}>
            Contact Support
          </AppText>
          <AppText variant="body" color="secondary" style={styles.contactText}>
            If you can&apos;t find your answer in the FAQ, please reach out to our team.
          </AppText>

          <AppButton
            onPress={() => handleContactSupport('email')}
            leftIcon={<Ionicons name="mail" size={16} color={Colors.text.inverse} />}
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

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  flex1: { flex: 1, backgroundColor: Colors.background.secondary },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border.light,
    backgroundColor: Colors.background.card,
  },
  backButton: { padding: Spacing.xs, marginRight: Spacing.xs },
  scrollContent: { padding: Spacing.md, gap: Spacing.md },
  card: {
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.sm,
  },
  cardTitle: { marginBottom: Spacing.xs },
  faqItem: { gap: 4, paddingVertical: Spacing.xs },
  faqAnswer: { paddingLeft: 4 },
  divider: { height: 1, backgroundColor: Colors.gray[100], marginVertical: Spacing.xs },
  contactText: { marginBottom: Spacing.xs },
  contactButton: { marginBottom: Spacing.sm },
  bottomSpacer: { height: Spacing.xl },
});

export default HelpScreen;
