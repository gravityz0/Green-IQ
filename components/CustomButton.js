import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';

export default function HomeScreen() {
  return (
    <View style={[globalStyles.container, styles.container]}>
      <Text style={globalStyles.title}>Welcome to Home Screen!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});