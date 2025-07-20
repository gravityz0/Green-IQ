import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductScanScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Scanning</Text>
      <Text style={styles.subtitle}>This feature is coming soon!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fffe',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 18,
    color: '#888',
  },
});

export default ProductScanScreen; 