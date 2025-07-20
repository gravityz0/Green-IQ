import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Modal, Linking, TextInput } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const safeZones = [
  { id: 1, name: 'Nyarugenge Safe Zone', coords: { latitude: -1.9477, longitude: 30.0567 }, address: 'Gitega, Nyarugenge', description: 'Shelter and support during climate events.' },
  { id: 2, name: 'Gasabo Safe Zone', coords: { latitude: -1.9333, longitude: 30.0800 }, address: 'Kacyiru, Gasabo', description: 'Open for shelter and cooling.' },
  { id: 3, name: 'Kicukiro Safe Zone', coords: { latitude: -1.9750, longitude: 30.1100 }, address: 'Niboye, Kicukiro', description: 'Safe zone for heatwaves and floods.' },
];

const alerts = [
  { id: 1, text: 'Heavy rainfall expected in Gasabo. Safe zones open for shelter.' },
  { id: 2, text: 'Flood risk near Nyarugenge. Use alternate safe zone.' },
  { id: 3, text: 'Heatwave alert: Stay hydrated and visit safe zones for cooling.' },
];

export default function SafeZonesMap({ navigation }) {
  const mapRef = useRef(null);
  const [notifVisible, setNotifVisible] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const location = await Location.getCurrentPositionAsync({});
        setUserLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      }
    })();
  }, []);

  const rwandaRegion = {
    latitude: -1.9403,
    longitude: 29.8739,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  };

  // Filter safe zones by search
  const filteredZones = search.trim().length > 0
    ? safeZones.filter(z => z.name.toLowerCase().includes(search.toLowerCase()) || z.address.toLowerCase().includes(search.toLowerCase()))
    : safeZones;

  return (
    <View style={styles.container}>
      {/* Top bar with notification bell */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 44, paddingBottom: 10, backgroundColor: '#1B5E20', paddingHorizontal: 10 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 }}>Safe Zones</Text>
        <TouchableOpacity onPress={() => setNotifVisible(true)} style={{ padding: 6 }}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#FF5722', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{alerts.length}</Text>
          </View>
        </TouchableOpacity>
      </View>
      {/* Search input below top bar */}
      <View style={{ paddingHorizontal: 18, marginBottom: 8, marginTop: 6 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search safe zones..."
          style={{ backgroundColor: '#fff', borderRadius: 10, padding: 10, fontSize: 15, borderWidth: 1, borderColor: '#e0e0e0' }}
          placeholderTextColor="#888"
        />
      </View>
      {/* Floating Notification Panel */}
      {notifVisible && (
        <View style={{ position: 'absolute', top: 80, right: 18, backgroundColor: '#fff', borderRadius: 14, elevation: 6, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 8, width: 280, zIndex: 20, padding: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="notifications" size={20} color="#FF5722" style={{ marginRight: 6 }} />
            <Text style={{ fontWeight: 'bold', color: '#1B5E20', fontSize: 15 }}>Notifications</Text>
            <TouchableOpacity onPress={() => setNotifVisible(false)} style={{ marginLeft: 'auto', padding: 4 }}>
              <Ionicons name="close" size={18} color="#888" />
            </TouchableOpacity>
          </View>
          {alerts.map(n => (
            <View key={n.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Ionicons name="alert-circle-outline" size={16} color="#FF5722" style={{ marginRight: 6 }} />
              <Text style={{ color: '#333', fontSize: 13 }}>{n.text}</Text>
            </View>
          ))}
        </View>
      )}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={rwandaRegion}
        mapType="standard"
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {filteredZones.map((zone) => (
          <Marker
            key={zone.id}
            coordinate={zone.coords}
            title={zone.name}
            description={zone.description}
          >
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                width: 38, height: 38, borderRadius: 19, backgroundColor: '#e0f7fa', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#00C896',
              }}>
                <Ionicons name="shield" size={22} color="#1B5E20" />
              </View>
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{zone.name} <Text style={{ color: '#00C896', fontWeight: 'bold' }}>[Safe Zone]</Text></Text>
                <Text style={styles.calloutDescription}>{zone.description}</Text>
                <Text style={styles.calloutText}>Address: {zone.address}</Text>
                <TouchableOpacity
                  style={[styles.directionsButton, { backgroundColor: '#1B5E20' }]}
                  onPress={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${zone.coords.latitude},${zone.coords.longitude}`;
                    Linking.openURL(url);
                  }}
                >
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.directionsText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  calloutContainer: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    minWidth: 200,
    elevation: 2,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    alignItems: 'flex-start',
  },
  calloutTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1B5E20',
    marginBottom: 2,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  calloutText: {
    fontSize: 13,
    color: '#888',
    marginBottom: 2,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginTop: 8,
  },
  directionsText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
    fontSize: 15,
  },
}); 