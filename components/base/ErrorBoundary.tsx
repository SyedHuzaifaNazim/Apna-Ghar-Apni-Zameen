import { Box, VStack } from 'native-base';
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import AppButton from './AppButton';
import AppText from './AppText';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleReport = () => {
    // Implement error reporting service here (Sentry, etc.)
    console.log('Reporting error:', this.state.error);
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <Box flex={1} justifyContent="center" alignItems="center" p={6}>
            <VStack space={4} alignItems="center">
              <AppText variant="h1" color="error" align="center">
                Oops!
              </AppText>
              
              <AppText variant="body" color="secondary" align="center">
                Something went wrong. Don't worry, we're working on it!
              </AppText>

              {this.state.error && (
                <AppText variant="small" color="disabled" align="center">
                  {this.state.error.message}
                </AppText>
              )}

              <VStack space={2} width="100%">
                <AppButton onPress={this.handleRetry} variant="primary">
                  Try Again
                </AppButton>
                
                <AppButton onPress={this.handleReport} variant="outline">
                  Report Issue
                </AppButton>
              </VStack>
            </VStack>
          </Box>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});

export default ErrorBoundary;