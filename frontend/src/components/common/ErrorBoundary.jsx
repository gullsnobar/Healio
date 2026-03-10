import React, { Component } from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from './Button';
import { light, dark } from '../../styles/colors';

// Functional wrapper so the class component can receive theme colors
function ErrorBoundaryWrapper(props) {
  const scheme = useColorScheme();
  const colors = scheme === 'dark' ? dark : light;
  return <ErrorBoundary {...props} themeColors={colors} />;
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const c = this.props.themeColors || light;
      return (
        <View style={[styles.container, { backgroundColor: c.background }]}>
          <Ionicons name="bug-outline" size={64} color={c.primary} />
          <Text style={[styles.title, { color: c.text }]}>Something went wrong</Text>
          <Text style={[styles.message, { color: c.textSecondary }]}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </Text>
          <Button variant="primary" onPress={this.handleRetry} style={styles.button}>
            Try Again
          </Button>
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
    padding: 32,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  button: {
    minWidth: 160,
  },
});

export default ErrorBoundaryWrapper;
