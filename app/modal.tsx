import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import AppText from '@/components/base/AppText';
import { Colors } from '@/constants/Colors';
import React from 'react';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.contentCenter}>
        <AppText variant="h1" weight="bold" align="center" style={styles.modalTitle}>
          Advanced Filters
        </AppText>
        <AppText variant="body" color="secondary" align="center" style={styles.modalText}>
          (This modal would contain filtering options like Price Range, Amenities, and more. Use the close button above or the link below.)
        </AppText>
        <Link href="/" asChild>
          <View style={styles.link}>
            <AppText variant="body" color="link" weight="semibold" align="center">
              Close and Go to Home
            </AppText>
          </View>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
    padding: 20,
  },
  contentCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalTitle: {
    color: Colors.primary[500],
  },
  modalText: {
    marginTop: 12,
    marginBottom: 32,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});