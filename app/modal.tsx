import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import AppText from '@/components/base/AppText';

export default function ModalScreen() {
  return (
    <View style={styles.container}>
      <AppText variant="h1" weight="bold" align="center">
        This is a modal
      </AppText>
      <Link href="/" asChild>
        <View style={styles.link}>
          <AppText variant="body" color="primary" weight="semibold" align="center">
            Go to home screen
          </AppText>
        </View>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
