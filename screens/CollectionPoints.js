import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, ScrollView, Alert, Modal, Linking } from 'react-native';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { SearchBar } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export const wastePoints = [
  { id: 1, name: 'Nyarugenge Waste Hub', district: 'Nyarugenge', sector: 'Gitega', coords: { latitude: -1.9477, longitude: 30.0567 }, types: ['Recyclable wastes', 'Plastic', 'Paper', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 6:00 PM', contact: '+250 788 123 456', capacity: 'High', status: 'Operational', description: 'Central hub in Kigali for multiple waste streams.', manager: 'Rukundo Furaha Divin' },
  { id: 2, name: 'Gasabo Collection Point', district: 'Gasabo', sector: 'Kacyiru', coords: { latitude: -1.9333, longitude: 30.0800 }, types: ['Organic', 'Plastic'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 789 012', capacity: 'Medium', status: 'Operational', description: 'Urban collection point for organic and plastic waste.', manager: 'Marie Mukiza' },
  { id: 3, name: 'Kicukiro Recycling Center', district: 'Kicukiro', sector: 'Niboye', coords: { latitude: -1.9750, longitude: 30.1100 }, types: ['Paper', 'Glass', 'Electronic'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+250 788 345 678', capacity: 'Medium', status: 'Operational', description: 'Recycling facility for paper, glass, and e-waste.', manager: 'Paul Kagame' },
  { id: 4, name: 'Huye Waste Station', district: 'Huye', sector: 'Ngoma', coords: { latitude: -2.5967, longitude: 29.7400 }, types: ['Organic', 'Plastic'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 901 234', capacity: 'Medium', status: 'Operational', description: 'Southern collection point for community waste.', manager: 'Aline Niyitegeka' },
  { id: 5, name: 'Muhanga Depot', district: 'Muhanga', sector: 'Nyamabuye', coords: { latitude: -2.0800, longitude: 29.7500 }, types: ['Organic', 'Metal'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+250 788 567 890', capacity: 'Low', status: 'Operational', description: 'Depot for agricultural and metal waste.', manager: 'Emmanuel Hakizimana' },
  { id: 6, name: 'Rubavu Waste Point', district: 'Rubavu', sector: 'Gisenyi', coords: { latitude: -1.6833, longitude: 29.2833 }, types: ['Plastic', 'Glass'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+250 788 234 567', capacity: 'Low', status: 'Limited', description: 'Station near Lake Kivu for plastic and glass.', manager: 'Clare Akamanzi' },
  { id: 7, name: 'Musanze Recycling Hub', district: 'Musanze', sector: 'Muhoza', coords: { latitude: -1.5087, longitude: 29.6347 }, types: ['Paper', 'Textile'], hours: 'Mon-Sat: 7:30 AM - 5:30 PM', contact: '+250 788 678 901', capacity: 'Medium', status: 'Operational', description: 'Eco-friendly center for textile and paper recycling.', manager: 'David Niyonzima' },
  { id: 8, name: 'Nyagatare Waste Depot', district: 'Nyagatare', sector: 'Nyagatare', coords: { latitude: -1.2967, longitude: 30.3267 }, types: ['Organic', 'Metal'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+250 788 456 789', capacity: 'Low', status: 'Operational', description: 'Rural depot for agricultural waste.', manager: 'Grace Uwimana' },
  { id: 9, name: 'Rwamagana Collection', district: 'Rwamagana', sector: 'Kigabiro', coords: { latitude: -1.9500, longitude: 30.4333 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+250 788 123 789', capacity: 'Medium', status: 'Operational', description: 'Eastern collection point for organic and plastic waste.', manager: 'Joseph Rurangwa' },
  { id: 10, name: 'Kayonza Waste Point', district: 'Kayonza', sector: 'Mukarange', coords: { latitude: -1.9000, longitude: 30.5167 }, types: ['Paper', 'Glass'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+250 788 234 890', capacity: 'Low', status: 'Operational', description: 'Recycling point for paper and glass waste.', manager: 'Annette Mukamana' },
  { id: 11, name: 'Gatsibo Recycling', district: 'Gatsibo', sector: 'Kiziguro', coords: { latitude: -1.6667, longitude: 30.3333 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 345 901', capacity: 'Medium', status: 'Operational', description: 'Textile and organic waste recycling center.', manager: 'Vincent Ndayisenga' },
  { id: 12, name: 'Kirehe Waste Station', district: 'Kirehe', sector: 'Kirehe', coords: { latitude: -2.2667, longitude: 30.6667 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+250 788 456 012', capacity: 'Low', status: 'Operational', description: 'Station for plastic and metal waste in the east.', manager: 'Rose Uwamariya' },
  { id: 13, name: 'Ngoma Collection', district: 'Ngoma', sector: 'Kibungo', coords: { latitude: -2.1667, longitude: 30.5333 }, types: ['Organic', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 567 123', capacity: 'Medium', status: 'Operational', description: 'Collection point for organic and paper waste.', manager: 'Peter Gasana' },
  { id: 14, name: 'Bugesera Waste Point', district: 'Bugesera', sector: 'Nyamata', coords: { latitude: -2.1333, longitude: 30.1000 }, types: ['Plastic', 'Electronic'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+250 788 678 234', capacity: 'Low', status: 'Operational', description: 'E-waste and plastic collection near Nyamata.', manager: 'Christine Nyirahuku' },
  { id: 15, name: 'Gicumbi Recycling', district: 'Gicumbi', sector: 'Byumba', coords: { latitude: -1.5833, longitude: 30.0667 }, types: ['Organic', 'Textile'], hours: 'Mon-Sat: 7:30 AM - 5:00 PM', contact: '+250 788 789 345', capacity: 'Medium', status: 'Operational', description: 'Northern center for organic and textile waste.', manager: 'Jean Bosco Tuyisenge' },
  { id: 16, name: 'Rulindo Waste Depot', district: 'Rulindo', sector: 'Base', coords: { latitude: -1.7167, longitude: 29.9167 }, types: ['Metal', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+250 788 890 456', capacity: 'Low', status: 'Operational', description: 'Depot for metal and paper recycling.', manager: 'Felicien Nkurunziza' },
  { id: 17, name: 'Burera Collection', district: 'Burera', sector: 'Ruhunde', coords: { latitude: -1.5000, longitude: 29.8333 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+250 788 901 567', capacity: 'Medium', status: 'Operational', description: 'Collection point in northern Rwanda.', manager: 'Agnes Mukarugema' },
  { id: 18, name: 'Nyabihu Waste Point', district: 'Nyabihu', sector: 'Mukamira', coords: { latitude: -1.6167, longitude: 29.5667 }, types: ['Glass', 'Paper'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+250 788 012 678', capacity: 'Low', status: 'Operational', description: 'Western point for glass and paper waste.', manager: 'Patrick Habimana' },
  { id: 19, name: 'Ngororero Recycling', district: 'Ngororero', sector: 'Kageyo', coords: { latitude: -1.8667, longitude: 29.6333 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 123 789', capacity: 'Medium', status: 'Operational', description: 'Recycling center for organic and textile waste.', manager: 'Solange Uwimana' },
  { id: 20, name: 'Rusizi Waste Station', district: 'Rusizi', sector: 'Kamembe', coords: { latitude: -2.4833, longitude: 28.9000 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+250 788 234 890', capacity: 'Medium', status: 'Operational', description: 'Station near Lake Kivu for plastic and metal.', manager: 'Eric Niyitegeka' },
  { id: 21, name: 'Nyamasheke Collection', district: 'Nyamasheke', sector: 'Shangi', coords: { latitude: -2.3667, longitude: 29.1833 }, types: ['Organic', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 345 901', capacity: 'Low', status: 'Operational', description: 'Collection point for organic and paper waste.', manager: 'Marie Claire Uwase' },
  { id: 22, name: 'Ruhango Waste Point', district: 'Ruhango', sector: 'Mbuye', coords: { latitude: -2.2333, longitude: 29.7667 }, types: ['Plastic', 'Electronic'], hours: 'Tue-Sun: 9:00 AM - 4:00 PM', contact: '+250 788 456 012', capacity: 'Low', status: 'Operational', description: 'E-waste and plastic collection in the south.', manager: 'Thomas Rukundo' },
  { id: 23, name: 'Nyanza Recycling', district: 'Nyanza', sector: 'Busasamana', coords: { latitude: -2.3500, longitude: 29.7333 }, types: ['Organic', 'Textile'], hours: 'Mon-Sat: 7:30 AM - 5:00 PM', contact: '+250 788 567 123', capacity: 'Medium', status: 'Operational', description: 'Southern center for organic and textile waste.', manager: "Jeanne d'Arc Mukamana" },
  { id: 24, name: 'Gisagara Waste Depot', district: 'Gisagara', sector: 'Ndora', coords: { latitude: -2.6167, longitude: 29.8333 }, types: ['Metal', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 3:00 PM', contact: '+250 788 678 234', capacity: 'Low', status: 'Operational', description: 'Depot for metal and paper recycling.', manager: 'Alphonse Nkurikiyimana' },
  { id: 25, name: 'Nyaruguru Collection', district: 'Nyaruguru', sector: 'Kibeho', coords: { latitude: -2.6333, longitude: 29.5667 }, types: ['Organic', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 5:00 PM', contact: '+250 788 789 345', capacity: 'Medium', status: 'Operational', description: 'Southern collection point for organic and plastic waste.', manager: 'Esperance Mukarutesi' },
  { id: 26, name: 'Kamonyi Waste Point', district: 'Kamonyi', sector: 'Runda', coords: { latitude: -2.0000, longitude: 29.9167 }, types: ['Glass', 'Paper'], hours: 'Tue-Sun: 8:00 AM - 4:00 PM', contact: '+250 788 890 456', capacity: 'Low', status: 'Operational', description: 'Collection point for glass and paper waste.', manager: 'Pierre Niyonzima' },
  { id: 27, name: 'Rutsiro Recycling', district: 'Rutsiro', sector: 'Mushubati', coords: { latitude: -1.9000, longitude: 29.3667 }, types: ['Organic', 'Textile'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 901 567', capacity: 'Medium', status: 'Operational', description: 'Recycling center for organic and textile waste.', manager: 'Veronica Nyiransabimana' },
  { id: 28, name: 'Karongi Waste Station', district: 'Karongi', sector: 'Rubengera', coords: { latitude: -2.1667, longitude: 29.3167 }, types: ['Plastic', 'Metal'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+250 788 012 678', capacity: 'Medium', status: 'Operational', description: 'Station for plastic and metal waste near Lake Kivu.', manager: 'Martin Habumugisha' },
  { id: 29, name: 'Nyamagabe Collection', district: 'Nyamagabe', sector: 'Gasaka', coords: { latitude: -2.4833, longitude: 29.6667 }, types: ['Organic', 'Paper'], hours: 'Mon-Fri: 8:00 AM - 5:00 PM', contact: '+250 788 123 789', capacity: 'Medium', status: 'Operational', description: 'Collection point for organic and paper waste in the south.', manager: 'Elise Mukamana' },
  { id: 30, name: 'Gakenke Waste Depot', district: 'Gakenke', sector: 'Ruli', coords: { latitude: -1.7167, longitude: 29.8333 }, types: ['Metal', 'Plastic'], hours: 'Mon-Sat: 7:00 AM - 4:00 PM', contact: '+250 788 234 890', capacity: 'Low', status: 'Operational', description: 'Northern depot for metal and plastic waste.', manager: 'Francois Niyibizi' },
];

const RwandaMap = () => {
  const navigation = useNavigation();
  const mapRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [notifVisible, setNotifVisible] = useState(false);
  const dummyNotifications = [
    { id: 1, text: 'Heavy rainfall expected in Gasabo. Safe zones open for shelter.' },
    { id: 2, text: 'Flood risk near Nyarugenge Waste Hub. Use alternate safe zone.' },
    { id: 3, text: 'Heatwave alert: Stay hydrated and visit safe zones for cooling.' },
  ];

  const rwandaCenter = { latitude: -1.9403, longitude: 29.8739 };
  const rwandaRegion = {
    latitude: -1.9403,
    longitude: 29.8739,
    latitudeDelta: 1.5,
    longitudeDelta: 1.5,
  };

  // Request location permissions
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

  // Search functionality
  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text.length > 0) {
      const filtered = wastePoints.filter(point => 
        point.name.toLowerCase().includes(text.toLowerCase()) ||
        point.district.toLowerCase().includes(text.toLowerCase()) ||
        point.sector.toLowerCase().includes(text.toLowerCase()) ||
        point.types.some(type => type.toLowerCase().includes(text.toLowerCase()))
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  const handleMarkerClick = (point) => {
    setSelectedPoint(point);
    setShowConfirmation(true);
  };

  const handleJoinChat = () => {
    setShowConfirmation(false);
    navigation.navigate('Chat', { 
      collectionPoint: selectedPoint,
      pointName: selectedPoint.name,
      pointManager: selectedPoint.manager
    });
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedPoint(null);
  };

  const goToLocation = (point) => {
    mapRef.current?.animateToRegion({
      latitude: point.coords.latitude,
      longitude: point.coords.longitude,
      latitudeDelta: 0.05,
      longitudeDelta: 0.05,
    });
    setSearchQuery('');
    setSearchResults([]);
  };

  return (
    <View style={styles.container}>
      {/* Top bar with notification bell */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 44, paddingBottom: 10, backgroundColor: '#1B5E20', paddingHorizontal: 10 }}>
        <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 }}>Safe Zones</Text>
        <TouchableOpacity onPress={() => setNotifVisible(true)} style={{ padding: 6 }}>
          <Ionicons name="notifications-outline" size={26} color="#fff" />
          <View style={{ position: 'absolute', top: 2, right: 2, backgroundColor: '#FF5722', borderRadius: 8, width: 16, height: 16, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>{dummyNotifications.length}</Text>
          </View>
        </TouchableOpacity>
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
          {dummyNotifications.map(n => (
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
        {wastePoints.map((point) => (
          <Marker
            key={point.id}
            coordinate={point.coords}
            title={point.name}
            description={point.description}
            onPress={() => handleMarkerClick(point)}
          >
            {/* Distinct Safe Zone Marker */}
            <View style={{ alignItems: 'center', justifyContent: 'center' }}>
              <View style={{
                width: 38, height: 38, borderRadius: 19, backgroundColor: '#e0f7fa', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#00C896',
              }}>
                <Ionicons name="shield" size={22} color="#1B5E20" />
              </View>
            </View>
            <Callout tooltip>
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutTitle}>{point.name} <Text style={{ color: '#00C896', fontWeight: 'bold' }}>[Safe Zone]</Text></Text>
                <Text style={styles.calloutDescription}>{point.description}</Text>
                <Text style={styles.calloutText}>District: {point.district}</Text>
                <Text style={styles.calloutText}>Sector: {point.sector}</Text>
                <Text style={styles.calloutText}>Waste Types: {point.types.join(', ')}</Text>
                <Text style={styles.calloutText}>Hours: {point.hours}</Text>
                <Text style={styles.calloutText}>Contact: {point.contact}</Text>
                <TouchableOpacity 
                  style={[styles.joinChatButton, { backgroundColor: '#00C896', marginBottom: 6 }]}
                  onPress={() => handleMarkerClick(point)}
                >
                  <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                  <Text style={styles.joinChatText}>Join Chat</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.joinChatButton, { backgroundColor: '#1B5E20' }]}
                  onPress={() => {
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${point.coords.latitude},${point.coords.longitude}`;
                    Linking.openURL(url);
                  }}
                >
                  <Ionicons name="navigate" size={20} color="#fff" />
                  <Text style={styles.joinChatText}>Get Directions</Text>
                </TouchableOpacity>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>
      
      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="chatbubble-ellipses" size={32} color="#2d6a4f" />
              <Text style={styles.modalTitle}>Join Chat Room</Text>
            </View>
            
            {selectedPoint && (
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  Would you like to join the chat room for {selectedPoint.name}?
                </Text>
                <Text style={styles.modalSubText}>
                  You'll be able to chat with the collection point manager and other users.
                </Text>
                <View style={styles.modalInfo}>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Manager: </Text>
                    {selectedPoint.manager}
                  </Text>
                  <Text style={styles.modalInfoText}>
                    <Text style={styles.modalInfoLabel}>Location: </Text>
                    {selectedPoint.district}, {selectedPoint.sector}
                  </Text>
                </View>
              </View>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]} 
                onPress={handleCancel}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.joinButton]} 
                onPress={handleJoinChat}
              >
                <Text style={styles.joinButtonText}>Join Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Search waste points..."
          onChangeText={handleSearch}
          value={searchQuery}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          round
          lightTheme
        />
        
        {searchResults.length > 0 && (
          <ScrollView style={styles.searchResultsContainer}>
            {searchResults.map(point => (
              <TouchableOpacity 
                key={point.id} 
                style={styles.searchResultItem}
                onPress={() => goToLocation(point)}
              >
                <Text style={styles.searchResultTitle}>{point.name}</Text>
                <Text style={styles.searchResultSubtitle}>{point.district}, {point.sector}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
      
      {selectedPoint && (
        <View style={styles.selectedPointContainer}>
          <View style={styles.selectedPointContent}>
            <View style={styles.selectedPointHeader}>
              <Text style={styles.selectedPointTitle}>{selectedPoint.name}</Text>
              <TouchableOpacity 
                style={styles.joinChatButton}
                onPress={() => setShowConfirmation(true)}
              >
                <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
                <Text style={styles.joinChatText}>Join Chat</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.selectedPointDetails}>
              <Text style={styles.selectedPointText}>
                <Text style={styles.selectedPointLabel}>Manager: </Text>
                {selectedPoint.manager}
              </Text>
              <Text style={styles.selectedPointText}>
                <Text style={styles.selectedPointLabel}>Location: </Text>
                {selectedPoint.district}, {selectedPoint.sector}
              </Text>
              <Text style={styles.selectedPointText}>
                <Text style={styles.selectedPointLabel}>Hours: </Text>
                {selectedPoint.hours}
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fffe',
  },
  map: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    zIndex: 5,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderBottomColor: 'transparent',
    borderTopColor: 'transparent',
    marginHorizontal: 10,
  },
  searchBarInputContainer: {
    backgroundColor: '#FFF',
  },
  searchResultsContainer: {
    backgroundColor: 'white',
    marginHorizontal: 10,
    maxHeight: 200,
    borderRadius: 10,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchResultTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d6a4f',
  },
  searchResultSubtitle: {
    color: '#6c6c6c',
    fontSize: 14,
  },
  infoContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  infoSubtitle: {
    fontSize: 14,
    color: '#6c6c6c',
  },
  markerContainer: {
    backgroundColor: '#ff6a4f',
    padding: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  markerInner: {
    backgroundColor: '#ff6a4f',
    width: 24,
    height: 24,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2d6a4f',
    marginBottom: 5,
  },
  calloutDescription: {
    fontSize: 14,
    color: '#6c6c6c',
    marginBottom: 5,
  },
  calloutText: {
    fontSize: 14,
    marginBottom: 3,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 10,
  },
  modalBody: {
    marginBottom: 20,
  },
  modalText: {
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalSubText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  modalInfo: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    padding: 15,
    borderRadius: 10,
  },
  modalInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  modalInfoLabel: {
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#2d6a4f',
  },
  joinButton: {
    backgroundColor: '#2d6a4f',
  },
  cancelButtonText: {
    color: '#2d6a4f',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  joinButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedPointContainer: {
    position: 'absolute',
    top: 120,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  selectedPointContent: {
    flex: 1,
  },
  selectedPointHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedPointTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2d6a4f',
    flex: 1,
  },
  joinChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d6a4f',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  joinChatText: {
    color: 'white',
    marginLeft: 5,
    fontWeight: '600',
  },
  selectedPointDetails: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    padding: 10,
    borderRadius: 10,
  },
  selectedPointText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  selectedPointLabel: {
    fontWeight: 'bold',
    color: '#2d6a4f',
  },
});

export default RwandaMap;