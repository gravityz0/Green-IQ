import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ScanScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan an Item</Text>
      <View style={styles.cameraArea}>
        <Ionicons name="camera-outline" size={100} color="#ccc" />
        <Text style={styles.cameraPlaceholder}>Camera view will appear here</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => console.log('Scan initiated')}>
        <Text style={styles.buttonText}>Scan</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b4332',
    marginBottom: 30,
  },
  cameraArea: {
    width: '80%',
    height: 300,
    backgroundColor: '#fff',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    borderStyle: 'dashed',
    marginBottom: 40,
  },
  cameraPlaceholder: {
    marginTop: 10,
    color: '#aaa',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#2d6a4f',
    paddingVertical: 15,
    paddingHorizontal: 60,
    borderRadius: 30,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default ScanScreen; 