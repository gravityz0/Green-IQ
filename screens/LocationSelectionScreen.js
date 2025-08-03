import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { wastePoints } from './CollectionPoints';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const { width } = Dimensions.get('window');

const LocationSelectionScreen = ({ navigation, route }) => {
  const [selectedPoint, setSelectedPoint] = useState(null);

  // Get the current form state from route params
  const currentFormState = route?.params || {};

  const seoulRegion = {
    latitude: 37.5665,
    longitude: 126.9780,
    latitudeDelta: 0.3,
    longitudeDelta: 0.3,
  };

  const confirmSelection = () => {
    if (!selectedPoint) return;
    
    // Determine if this is for company registration
    const isCompanyRegistration = currentFormState.userType === 'company';
    
    // Create location data based on user type
    let locationData;
    if (isCompanyRegistration) {
      // For companies: send JSON object with coordinates and location info
      locationData = {
        name: selectedPoint.name,
        district: selectedPoint.district,
        sector: selectedPoint.sector,
        coordinates: {
          latitude: selectedPoint.coords.latitude,
          longitude: selectedPoint.coords.longitude
        },
        types: selectedPoint.types,
        hours: selectedPoint.hours,
        contact: selectedPoint.contact,
        capacity: selectedPoint.capacity,
        status: selectedPoint.status,
        description: selectedPoint.description,
        manager: selectedPoint.manager
      };
    } else {
      // For citizens: send just the location name (backward compatibility)
      locationData = selectedPoint.name;
    }
    
    // Return to RegisterScreen with the selected location and all previous form data
    const updatedFormState = {
      ...currentFormState,
      selectedLocation: locationData
    };
    
    navigation.navigate({
      name: 'Register',
      params: updatedFormState,
      merge: true,
    });
  };

  const goBack = () => {
    // Go back with the current form state preserved
    navigation.navigate({
      name: 'Register',
      params: currentFormState,
      merge: true,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {currentFormState.userType === 'company' ? 'Select Collection Point' : 'Select Your Location'}
        </Text>
      </View>
      <View style={styles.mapContainer}>
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={seoulRegion}
        >
          {wastePoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={point.coords}
              onPress={() => setSelectedPoint(point)}
            >
              <View style={[
                styles.markerContainer, 
                selectedPoint?.id === point.id && styles.selectedMarker
              ]}>
                <Ionicons 
                  name="business" 
                  size={20} 
                  color={selectedPoint?.id === point.id ? '#fff' : '#1b4332'} 
                />
              </View>
            </Marker>
          ))}
        </MapView>
      </View>
      {selectedPoint && (
        <View style={styles.selectionContainer}>
          <Text style={styles.selectedLocationName}>{selectedPoint.name}</Text>
          <Text style={styles.selectedLocationDetails}>
            {selectedPoint.district}, {selectedPoint.sector}
          </Text>
          {currentFormState.userType === 'company' && (
            <View style={styles.coordinatesContainer}>
              <Text style={styles.coordinatesText}>
                📍 Coordinates: {selectedPoint.coords.latitude.toFixed(6)}, {selectedPoint.coords.longitude.toFixed(6)}
              </Text>
              <Text style={styles.capacityText}>
                📊 Capacity: {selectedPoint.capacity} | Status: {selectedPoint.status}
              </Text>
              <Text style={styles.typesText}>
                🗂️ Types: {selectedPoint.types.join(', ')}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={confirmSelection}
          >
            <Text style={styles.confirmButtonText}>
              {currentFormState.userType === 'company' ? 'Select This Collection Point' : 'Select This Location'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#2d6a4f',
    backgroundColor: '#2d6a4f',
    paddingTop: Platform.OS === 'android' ? 25 : 15,
    zIndex: 1,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  markerContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#1b4332',
    borderWidth: 2,
  },
  selectedMarker: {
    backgroundColor: '#2d6a4f',
    borderColor: '#fff',
  },
  selectionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2d6a4f',
    padding: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  selectedLocationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  selectedLocationDetails: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 15,
  },
  confirmButton: {
    backgroundColor: '#fff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: '#2d6a4f',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coordinatesContainer: {
    marginBottom: 15,
  },
  coordinatesText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
  },
  capacityText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
  typesText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    textAlign: 'center',
    marginTop: 5,
  },
});

export default LocationSelectionScreen; 