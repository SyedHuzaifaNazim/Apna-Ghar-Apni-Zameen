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
          <View style={styles.content}>
            <View style={styles.textStack}>
              <AppText variant="h1" color="error" align="center">
                Oops!
              </AppText>
              
              <AppText variant="body" color="secondary" align="center">
                Something went wrong. Don't worry, we're working on it!
              </AppText>

              {this.state.error && (
                <AppText variant="small" color="disabled" align="center" style={styles.errorText}>
                  {this.state.error.message}
                </AppText>
              )}
            </View>

            <View style={styles.buttonStack}>
              <AppButton onPress={this.handleRetry} variant="primary">
                Try Again
              </AppButton>
              
              <AppButton onPress={this.handleReport} variant="outline">
                Report Issue
              </AppButton>
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background.primary || '#fff',
    padding: 16,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 32,
  },
  textStack: {
    width: '100%',
    alignItems: 'center',
    gap: 16,
  },
  errorText: {
    marginTop: 8,
  },
  buttonStack: {
    width: '100%',
    gap: 12,
  },
});

export default ErrorBoundary;