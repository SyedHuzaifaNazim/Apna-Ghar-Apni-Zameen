import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  Alert,
  Linking,
  Modal,
  StyleSheet,
  TextInput,
  View
} from 'react-native';

import AppButton from '../../../components/base/AppButton';
import AppText from '../../../components/base/AppText';
import { Colors } from '../../../constants/Colors';
import { BorderRadius } from '../../../constants/Layout';
import { analyticsService } from '../../../services/analyticsService';

interface ContactAgentProps {
  property: {
    id: number;
    title: string;
    price: number;
    ownerDetails?: {
        name: string;
        phone: string;
        email: string;
        agencyName?: string;
    }
  };
}

const ContactAgent: React.FC<ContactAgentProps> = ({ property }) => {
  const [isModalOpen, setIsModalOpen] = useState(false); 
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in the property: ${property.title} (Rs${property.price.toLocaleString()}). Please contact me with more details.`,
  });
  const [loading, setLoading] = useState(false);

  // Agent details use property.ownerDetails if available
  const defaultAgent = {
    name: 'Rajesh Kumar',
    phone: '+923001234567',
    email: 'rajesh.kumar@realestate.com',
    company: 'Elite Properties',
    rating: 4.8,
    propertiesListed: 47,
  };
  
  const agent = (property as any).ownerDetails || defaultAgent;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const showSimpleAlert = (title: string, message: string) => {
    Alert.alert(title, message);
  };

  const handleCall = async () => {
    try {
      await analyticsService.track('agent_contact', {
        method: 'call',
        property_id: property.id,
        agent_name: agent.name,
      });

      const url = `tel:${agent.phone}`;
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        showSimpleAlert('Error', 'Calling is not supported on this device');
      }
    } catch (error) {
      showSimpleAlert('Error', 'Failed to make call');
    }
  };

  const handleWhatsApp = async () => {
    try {
      await analyticsService.track('agent_contact', {
        method: 'whatsapp',
        property_id: property.id,
        agent_name: agent.name,
      });

      const message = `Hi, I'm interested in the property: ${property.title} (Rs${property.price.toLocaleString()}). Please contact me with more details.`;
      const url = `whatsapp://send?phone=${agent.phone}&text=${encodeURIComponent(message)}`;
      
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        showSimpleAlert('Error', 'WhatsApp is not installed');
      }
    } catch (error) {
      showSimpleAlert('Error', 'Failed to open WhatsApp');
    }
  };

  const handleEmail = async () => {
    try {
      await analyticsService.track('agent_contact', {
        method: 'email',
        property_id: property.id,
        agent_name: agent.name,
      });

      const subject = `Inquiry about ${property.title}`;
      const body = `Hello ${agent.name},\n\nI am interested in the property: ${property.title} (Rs${property.price.toLocaleString()}).\n\nPlease contact me with more details.\n\nBest regards,\n${formData.name || 'Potential Buyer'}`;
      
      const url = `mailto:${agent.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      const supported = await Linking.canOpenURL(url);
      
      if (supported) {
        await Linking.openURL(url);
      } else {
        showSimpleAlert('Error', 'Email app is not available');
      }
    } catch (error) {
      showSimpleAlert('Error', 'Failed to open email');
    }
  };

  const handleScheduleViewing = () => {
    setIsModalOpen(true);
    analyticsService.track('schedule_viewing_click', {
      property_id: property.id,
    });
  };

  const handleSubmitSchedule = async () => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await analyticsService.track('viewing_scheduled', {
        property_id: property.id,
        agent_name: agent.name,
      });

      showSimpleAlert('Viewing Scheduled!', 'The agent will contact you to confirm the details.');
      
      setIsModalOpen(false);
    } catch (error) {
      showSimpleAlert('Error', 'Failed to schedule viewing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Agent Info */}
      <View style={styles.section}>
        <AppText variant="h4" weight="semibold">Contact Agent</AppText>
        
        <View style={styles.agentInfoRow}>
          <View style={styles.agentAvatar}>
            <Ionicons name="person" size={24} color={Colors.primary[500]} />
          </View>
          
          <View style={styles.agentTextContainer}>
            <AppText variant="h5" weight="semibold">{agent.name}</AppText>
            <AppText variant="body" color="secondary">{agent.company || 'Private Owner'}</AppText>
            
            <View style={styles.agentStatsRow}>
              <View style={styles.agentStatItem}>
                <Ionicons name="star" size={16} color={Colors.warning[500]} />
                <AppText variant="small" weight="medium">{agent.rating || 'N/A'}</AppText>
              </View>
              <AppText variant="small" color="secondary">
                {agent.propertiesListed || 0} properties
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <AppText variant="body" weight="medium" style={styles.quickContactTitle}>Quick Contact</AppText>
        
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
            onPress={handleEmail}
            leftIcon={<Ionicons name="mail" size={16} color={Colors.primary[500]} />}
          >
            Email
          </AppButton>
        </View>
      </View>

      {/* Schedule Viewing */}
      <View style={styles.section}>
        <AppButton
          variant="primary"
          onPress={handleScheduleViewing}
          leftIcon={<Ionicons name="calendar" size={16} color="white" />}
        >
          Schedule Viewing
        </AppButton>
        
        <AppText variant="small" color="secondary" align="center" style={styles.scheduleText}>
          Schedule a property viewing at your convenience
        </AppText>
      </View>

      {/* Contact Form */}
      <View style={styles.section}>
        <AppText variant="body" weight="medium">Send Message</AppText>
        
        <View style={styles.formVStack}>
          <TextInput
            placeholder="Your Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            style={styles.input}
          />
          
          <TextInput
            placeholder="Your Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            style={styles.input}
            keyboardType="email-address"
          />
          
          <TextInput
            placeholder="Your Phone"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            style={styles.input}
            keyboardType="phone-pad"
          />
          
          <TextInput
            placeholder="Your Message"
            value={formData.message}
            onChangeText={(value) => handleInputChange('message', value)}
            style={[styles.input, styles.textArea]}
            multiline={true}
            numberOfLines={4}
          />
          
          <AppButton
            variant="primary"
            onPress={handleEmail}
            leftIcon={<Ionicons name="send" size={16} color="white" />}
          >
            Send Message
          </AppButton>
        </View>
      </View>

      {/* Schedule Viewing Modal */}
      <Modal visible={isModalOpen} transparent={true} animationType="fade" onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
                <View style={styles.modalVStack}>
                    <View style={styles.modalHeader}>
                        <Ionicons name="calendar" size={48} color={Colors.primary[500]} />
                        <AppText variant="h4" weight="bold" align="center">Schedule Viewing</AppText>
                        <AppText variant="body" color="secondary" align="center">
                            Choose your preferred date and time for property viewing
                        </AppText>
                    </View>

                    <View style={styles.modalFormVStack}>
                        <View style={styles.modalInputGroup}>
                            <AppText variant="body" weight="medium">Preferred Date</AppText>
                            <AppButton 
                                variant="outline"
                                style={styles.modalSelectButton}
                                textStyle={styles.modalSelectButtonText}
                                rightIcon={<Ionicons name="calendar" size={16} color={Colors.primary[500]} />}
                                onPress={() => {}} // Placeholder
                            >
                                Select Date
                            </AppButton>
                        </View>

                        <View style={styles.modalInputGroup}>
                            <AppText variant="body" weight="medium">Preferred Time</AppText>
                            <AppButton
                                variant="outline"
                                style={styles.modalSelectButton}
                                textStyle={styles.modalSelectButtonText}
                                rightIcon={<Ionicons name="time" size={16} color={Colors.primary[500]} />}
                                onPress={() => {}} // Placeholder
                            >
                                Select Time
                            </AppButton>
                        </View>

                        <TextInput
                            placeholder="Additional Notes (Optional)"
                            style={styles.input}
                        />
                    </View>

                    <View style={styles.modalButtonRow}>
                        <AppButton
                            variant="outline"
                            style={styles.modalButton}
                            onPress={() => setIsModalOpen(false)}
                        >
                            Cancel
                        </AppButton>
                        <AppButton
                            variant="primary"
                            style={styles.modalButton}
                            onPress={handleSubmitSchedule}
                            isLoading={loading}
                        >
                            Schedule
                        </AppButton>
                    </View>
                </View>
            </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: BorderRadius.xl,
  },
  section: {
    marginBottom: 24,
    gap: 16,
  },
  agentInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  agentAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.primary[100],
    justifyContent: 'center',
    alignItems: 'center',
  },
  agentTextContainer: {
    flex: 1,
    gap: 4,
  },
  agentStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  agentStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickContactTitle: {
      marginBottom: 0,
  },
  quickContactButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  quickContactButton: {
    flex: 1,
    borderColor: Colors.primary[500],
    borderWidth: 1,
  },
  scheduleText: {
    textAlign: 'center',
  },
  formVStack: {
    gap: 12,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.gray[300],
    borderRadius: BorderRadius.lg,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text.primary,
    backgroundColor: Colors.background.card,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    width: '100%',
  },
  modalVStack: {
      gap: 24,
      alignItems: 'center',
  },
  modalHeader: {
    gap: 8,
    alignItems: 'center',
  },
  modalFormVStack: {
      gap: 16,
      width: '100%',
  },
  modalInputGroup: {
    gap: 8,
  },
  modalSelectButton: {
    backgroundColor: Colors.background.card,
    borderColor: Colors.gray[300],
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
  },
  modalSelectButtonText: {
    color: Colors.text.primary,
    fontWeight: 'normal',
  },
  modalButtonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
  },
});

export default ContactAgent;