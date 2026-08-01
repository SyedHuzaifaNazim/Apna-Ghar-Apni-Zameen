import { Ionicons } from '@expo/vector-icons';
import { Href, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';

import AppButton from '@/components/base/AppButton';
import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import { BorderRadius, Spacing } from '@/constants/Layout';
import { ValidationRules } from '@/constants/Config';
import { openEmail, openPhoneDialer, openSms, openWhatsApp } from '@/lib/contactLinks';
import { analyticsService } from '@/services/analyticsService';
import type { Property } from '@/types/property';

interface ContactAgentProps {
  property: Pick<Property, 'id' | 'title' | 'price' | 'ownerDetails'>;
}

const ContactAgent: React.FC<ContactAgentProps> = ({ property }) => {
  const router = useRouter();
  const agent = property.ownerDetails;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in the property: ${property.title} (Rs${property.price.toLocaleString()}). Please contact me with more details.`,
  });

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showSimpleAlert = (title: string, message: string) => Alert.alert(title, message);

  const handleCall = async () => {
    await analyticsService.track('agent_contact', { method: 'call', property_id: property.id, agent_name: agent.name });
    await openPhoneDialer(agent.phone);
  };

  const handleSms = async () => {
    await analyticsService.track('agent_contact', { method: 'sms', property_id: property.id, agent_name: agent.name });
    const message = `Hi, I'm interested in the property: ${property.title} (Rs${property.price.toLocaleString()}).`;
    await openSms(agent.phone, message);
  };

  const handleWhatsApp = async () => {
    await analyticsService.track('agent_contact', { method: 'whatsapp', property_id: property.id, agent_name: agent.name });
    const message = `Hi, I'm interested in the property: ${property.title} (Rs${property.price.toLocaleString()}). Please contact me with more details.`;
    await openWhatsApp(agent.phone, message);
  };

  const handleEmail = async () => {
    await analyticsService.track('agent_contact', { method: 'email', property_id: property.id, agent_name: agent.name });
    const subject = `Inquiry about ${property.title}`;
    const body = `Hello ${agent.name},\n\nI am interested in the property: ${property.title} (Rs${property.price.toLocaleString()}).\n\nPlease contact me with more details.\n\nBest regards`;
    await openEmail(agent.email, subject, body);
  };

  const handleSendMessage = async () => {
    const name = formData.name.trim();
    const email = formData.email.trim();

    if (!name || !formData.message.trim()) {
      showSimpleAlert('Missing info', 'Please enter your name and a message.');
      return;
    }
    if (email && !ValidationRules.email.regex.test(email)) {
      showSimpleAlert('Invalid email', 'Please enter a valid email address, or leave it blank.');
      return;
    }

    await analyticsService.track('agent_contact', { method: 'form', property_id: property.id, agent_name: agent.name });

    const subject = `Inquiry about ${property.title}`;
    const contactLines = [email && `Email: ${email}`, formData.phone.trim() && `Phone: ${formData.phone.trim()}`]
      .filter(Boolean)
      .join('\n');
    const body = `Hello ${agent.name},\n\n${formData.message.trim()}\n\nFrom: ${name}${contactLines ? `\n${contactLines}` : ''}`;

    await openEmail(agent.email, subject, body);
  };

  const handleScheduleViewing = () => {
    analyticsService.track('schedule_viewing_click', { property_id: property.id });
    Alert.alert('Coming soon', 'Scheduling a viewing directly in the app will be available soon. For now, contact the agent to arrange a time.');
  };

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">
          Contact Agent
        </AppText>

        <Pressable
          style={({ pressed }) => [styles.agentInfoRow, pressed && styles.agentInfoRowPressed]}
          onPress={() => router.push(`/agent/${agent.agentId}` as Href)}
          accessibilityRole="button"
          accessibilityLabel={`View ${agent.name}'s profile`}
        >
          <View style={styles.agentAvatar}>
            <Ionicons name="person" size={24} color={Colors.primary[500]} />
          </View>

          <View style={styles.agentTextContainer}>
            <AppText variant="h5" weight="semibold">
              {agent.name}
            </AppText>
            <AppText variant="body" color="secondary">
              {agent.agencyName || 'Private Owner'}
            </AppText>
          </View>

          <Ionicons name="chevron-forward" size={20} color={Colors.gray[400]} />
        </Pressable>
      </View>

      <View style={styles.section}>
        <AppText variant="body" weight="medium" style={styles.quickContactTitle}>
          Quick Contact
        </AppText>

        <View style={styles.quickContactButtons}>
          <AppButton
            variant="outline"
            style={styles.quickContactButton}
            onPress={handleCall}
            leftIcon={<Ionicons name="call" size={16} color={Colors.primary[500]} />}
          >
            Call
          </AppButton>

          <AppButton
            variant="outline"
            style={[styles.quickContactButton, { borderColor: Colors.social?.whatsapp || '#25D366' }]}
            textStyle={{ color: Colors.social?.whatsapp || '#25D366' }}
            onPress={handleWhatsApp}
            leftIcon={<Ionicons name="logo-whatsapp" size={16} color={Colors.social?.whatsapp || '#25D366'} />}
          >
            WhatsApp
          </AppButton>

          <AppButton
            variant="outline"
            style={styles.quickContactButton}
            onPress={handleSms}
            leftIcon={<Ionicons name="chatbox-ellipses" size={16} color={Colors.primary[500]} />}
          >
            SMS
          </AppButton>

          <AppButton
            variant="outline"
            style={styles.quickContactButton}
            onPress={handleEmail}
            leftIcon={<Ionicons name="mail" size={16} color={Colors.primary[500]} />}
          >
            Email
          </AppButton>
        </View>
      </View>

      <View style={styles.section}>
        <AppButton
          variant="primary"
          onPress={handleScheduleViewing}
          leftIcon={<Ionicons name="calendar" size={16} color={Colors.text.inverse} />}
        >
          Schedule Viewing
        </AppButton>

        <AppText variant="bodySmall" color="secondary" align="center" style={styles.scheduleText}>
          Schedule a property viewing at your convenience
        </AppText>
      </View>

      <View style={styles.section}>
        <AppText variant="body" weight="medium">
          Send Message
        </AppText>

        <View style={styles.formVStack}>
          <TextInput
            placeholder="Your Name"
            placeholderTextColor={Colors.gray[500]}
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            style={styles.input}
          />

          <TextInput
            placeholder="Your Email (optional)"
            placeholderTextColor={Colors.gray[500]}
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            style={styles.input}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Your Phone (optional)"
            placeholderTextColor={Colors.gray[500]}
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            style={styles.input}
            keyboardType="phone-pad"
          />

          <TextInput
            placeholder="Your Message"
            placeholderTextColor={Colors.gray[500]}
            value={formData.message}
            onChangeText={value => handleInputChange('message', value)}
            style={[styles.input, styles.textArea]}
            multiline
            numberOfLines={4}
          />

          <AppButton
            variant="primary"
            onPress={handleSendMessage}
            leftIcon={<Ionicons name="send" size={16} color={Colors.text.inverse} />}
          >
            Send Message
          </AppButton>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.background.card,
    borderRadius: BorderRadius.xl,
  },
  section: { marginBottom: Spacing.lg, gap: Spacing.md },
  agentInfoRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  agentInfoRowPressed: { opacity: 0.7 },
  agentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentTextContainer: { flex: 1, gap: 4 },
  quickContactTitle: { marginBottom: 0 },
  quickContactButtons: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  quickContactButton: { minWidth: '47%', flexGrow: 1, borderColor: Colors.primary[500], borderWidth: 1 },
  scheduleText: { textAlign: 'center' },
  formVStack: { gap: Spacing.sm, marginTop: Spacing.sm },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 4,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.card,
  },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
});

export default ContactAgent;
