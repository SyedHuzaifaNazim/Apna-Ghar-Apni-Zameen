// @ts-nocheck
import { Ionicons } from '@expo/vector-icons';
import {
    Actionsheet,
    Box,
    Button,
    HStack,
    Input,
    TextArea,
    useDisclose,
    useToast,
    VStack
} from 'native-base';
import React, { useState } from 'react';
import { Linking } from 'react-native';

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
    agent?: {
      name: string;
      phone: string;
      email: string;
      company?: string;
      rating?: number;
      propertiesListed?: number;
    };
  };
}

const ContactAgent: React.FC<ContactAgentProps> = ({ property }) => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclose();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `Hi, I'm interested in the property: ${property.title} (Rs${property.price.toLocaleString()}). Please contact me with more details.`,
  });
  const [loading, setLoading] = useState(false);

  const defaultAgent = {
    name: 'Rajesh Kumar',
    phone: '+919876543210',
    email: 'rajesh.kumar@realestate.com',
    company: 'Elite Properties',
    rating: 4.8,
    propertiesListed: 47,
  };

  const agent = property.agent || defaultAgent;

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
        toast.show({
          title: 'Error',
          description: 'Calling is not supported on this device',
          status: 'error',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'Failed to make call',
        status: 'error',
      });
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
        toast.show({
          title: 'Error',
          description: 'WhatsApp is not installed',
          status: 'error',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'Failed to open WhatsApp',
        status: 'error',
      });
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
        toast.show({
          title: 'Error',
          description: 'Email app is not available',
          status: 'error',
        });
      }
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'Failed to open email',
        status: 'error',
      });
    }
  };

  const handleScheduleViewing = () => {
    onOpen();
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

      toast.show({
        title: 'Viewing Scheduled!',
        description: 'The agent will contact you to confirm the details.',
        status: 'success',
        duration: 4000,
      });
      
      onClose();
    } catch (error) {
      toast.show({
        title: 'Error',
        description: 'Failed to schedule viewing. Please try again.',
        status: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack space={6} bg="white" p={5} borderRadius={BorderRadius.xl}>
      {/* Agent Info */}
      <VStack space={4}>
        <AppText variant="h4" weight="semibold">Contact Agent</AppText>
        
        <HStack space={4} alignItems="center">
          <Box 
            width={16}
            height={16}
            borderRadius="full"
            bg={Colors.primary[100]}
            justifyContent="center"
            alignItems="center"
          >
            <Ionicons name="person" size={24} color={Colors.primary[500]} />
          </Box>
          
          <VStack flex={1} space={1}>
            <AppText variant="h5" weight="semibold">{agent.name}</AppText>
            <AppText variant="body" color="secondary">{agent.company}</AppText>
            
            <HStack space={3} alignItems="center">
              <HStack space={1} alignItems="center">
                <Ionicons name="star" size={16} color={Colors.warning[500]} />
                <AppText variant="small" weight="medium">{agent.rating}</AppText>
              </HStack>
              <AppText variant="small" color="secondary">
                {agent.propertiesListed} properties
              </AppText>
            </HStack>
          </VStack>
        </HStack>
      </VStack>

      {/* Quick Actions */}
      <VStack space={3}>
        <AppText variant="body" weight="medium">Quick Contact</AppText>
        
        <HStack space={3}>
          <AppButton
            variant="outline"
            flex={1}
            onPress={handleCall}
            leftIcon={<Ionicons name="call" size={16} color={Colors.primary[500]} />}
          >
            Call
          </AppButton>
          
          <AppButton
            variant="outline"
            flex={1}
            onPress={handleWhatsApp}
            leftIcon={<Ionicons name="logo-whatsapp" size={16} color={Colors.social.whatsapp} />}
          >
            WhatsApp
          </AppButton>
          
          <AppButton
            variant="outline"
            flex={1}
            onPress={handleEmail}
            leftIcon={<Ionicons name="mail" size={16} color={Colors.primary[500]} />}
          >
            Email
          </AppButton>
        </HStack>
      </VStack>

      {/* Schedule Viewing */}
      <VStack space={3}>
        <AppButton
          variant="solid"
          onPress={handleScheduleViewing}
          leftIcon={<Ionicons name="calendar" size={16} color="white" />}
        >
          Schedule Viewing
        </AppButton>
        
        <AppText variant="small" color="secondary" align="center">
          Schedule a property viewing at your convenience
        </AppText>
      </VStack>

      {/* Contact Form */}
      <VStack space={4}>
        <AppText variant="body" weight="medium">Send Message</AppText>
        
        <VStack space={3}>
          <Input
            placeholder="Your Name"
            value={formData.name}
            onChangeText={(value) => handleInputChange('name', value)}
            borderRadius={BorderRadius.lg}
            fontSize={16}
          />
          
          <Input
            placeholder="Your Email"
            value={formData.email}
            onChangeText={(value) => handleInputChange('email', value)}
            borderRadius={BorderRadius.lg}
            fontSize={16}
            keyboardType="email-address"
          />
          
          <Input
            placeholder="Your Phone"
            value={formData.phone}
            onChangeText={(value) => handleInputChange('phone', value)}
            borderRadius={BorderRadius.lg}
            fontSize={16}
            keyboardType="phone-pad"
          />
          
          <TextArea
            placeholder="Your Message"
            value={formData.message}
            onChangeText={(value) => handleInputChange('message', value)}
            borderRadius={BorderRadius.lg}
            fontSize={16}
            autoCompleteType="off"
            totalLines={4}
          />
          
          <AppButton
            variant="solid"
            onPress={handleEmail}
            leftIcon={<Ionicons name="send" size={16} color="white" />}
          >
            Send Message
          </AppButton>
        </VStack>
      </VStack>

      {/* Schedule Viewing Action Sheet */}
      <Actionsheet isOpen={isOpen} onClose={onClose}>
        <Actionsheet.Content>
          <Box w="100%" p={5}>
            <VStack space={5}>
              <VStack space={2} alignItems="center">
                <Ionicons name="calendar" size={48} color={Colors.primary[500]} />
                <AppText variant="h4" weight="bold" align="center">
                  Schedule Viewing
                </AppText>
                <AppText variant="body" color="secondary" align="center">
                  Choose your preferred date and time for property viewing
                </AppText>
              </VStack>

              <VStack space={3}>
                <VStack space={2}>
                  <AppText variant="body" weight="medium">Preferred Date</AppText>
                  <Button
                    variant="outline"
                    justifyContent="space-between"
                    rightIcon={<Ionicons name="calendar" size={16} color={Colors.primary[500]} />}
                  >
                    Select Date
                  </Button>
                </VStack>

                <VStack space={2}>
                  <AppText variant="body" weight="medium">Preferred Time</AppText>
                  <Button
                    variant="outline"
                    justifyContent="space-between"
                    rightIcon={<Ionicons name="time" size={16} color={Colors.primary[500]} />}
                  >
                    Select Time
                  </Button>
                </VStack>

                <Input
                  placeholder="Additional Notes (Optional)"
                  borderRadius={BorderRadius.lg}
                  fontSize={16}
                />
              </VStack>

              <HStack space={3}>
                <AppButton
                  variant="outline"
                  flex={1}
                  onPress={onClose}
                >
                  Cancel
                </AppButton>
                <AppButton
                  variant="solid"
                  flex={1}
                  onPress={handleSubmitSchedule}
                  loading={loading}
                >
                  Schedule
                </AppButton>
              </HStack>
            </VStack>
          </Box>
        </Actionsheet.Content>
      </Actionsheet>
    </VStack>
  );
};

export default ContactAgent;