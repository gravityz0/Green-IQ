import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Linking, 
  Animated,
  TextInput,
  Alert,
  Dimensions,
  Modal
} from 'react-native';
import { MapPin, Phone, Globe, Star, Clock, Filter, Search, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const companies = [
  {
    id: '1',
    name: 'Green Waste Solutions',
    address: '123 Eco Street, Kigali',
    phone: '+250788123456',
    website: 'https://greenwaste.rw',
    rating: 4.8,
    distance: '0.5 km',
    openHours: '8:00 AM - 6:00 PM',
    services: ['Paper', 'Plastic', 'Metal'],
    description: 'Leading recycling company with 10+ years of experience in sustainable waste management.',
    isFavorite: false,
  },
  {
    id: '2',
    name: 'RecycleTech Ltd',
    address: '456 Tech Park, Kacyiru',
    phone: '+250788654321',
    website: 'https://recycletech.rw',
    rating: 4.5,
    distance: '1.2 km',
    openHours: '7:00 AM - 7:00 PM',
    services: ['Electronics', 'Batteries', 'Glass'],
    description: 'Specialized in electronic waste recycling and hazardous material disposal.',
    isFavorite: false,
  },
  {
    id: '3',
    name: 'EcoCollect Rwanda',
    address: '789 Clean Ave, Remera',
    phone: '+250788111222',
    website: 'https://ecocollect.rw',
    rating: 4.9,
    distance: '2.1 km',
    openHours: '9:00 AM - 5:00 PM',
    services: ['Organic', 'Paper', 'Plastic'],
    description: 'Community-focused recycling service with pickup and drop-off options.',
    isFavorite: false,
  },
  {
    id: '4',
    name: 'Clean Earth Pro',
    address: '321 Green Road, Nyarutarama',
    phone: '+250788333444',
    website: 'https://cleanearthpro.rw',
    rating: 4.3,
    distance: '3.5 km',
    openHours: '8:30 AM - 6:30 PM',
    services: ['All Types', 'Bulk Waste'],
    description: 'Comprehensive waste management solutions for residential and commercial clients.',
    isFavorite: false,
  },
];

const CompanyCard = ({ company, onToggleFavorite, onViewDetails }) => {
  const [scaleValue] = useState(new Animated.Value(1));

  const animatePress = () => {
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handleCall = () => {
    Alert.alert(
      "Call Company",
      `Do you want to call ${company.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => Linking.openURL(`tel:${company.phone}`) }
      ]
    );
  };

  const handleWebsite = () => {
    Linking.openURL(company.website).catch(() => {
      Alert.alert("Error", "Unable to open website");
    });
  };

  return (
    <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
      <TouchableOpacity 
        onPress={() => {
          animatePress();
          onViewDetails(company);
        }}
        activeOpacity={0.9}
      >
        <View style={styles.cardHeader}>
          <View style={styles.nameSection}>
            <Text style={styles.name}>{company.name}</Text>
            <View style={styles.ratingContainer}>
              <Star size={14} color="#FFD700" fill="#FFD700" />
              <Text style={styles.rating}>{company.rating}</Text>
              <Text style={styles.distance}>• {company.distance}</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => onToggleFavorite(company.id)}
            style={styles.favoriteButton}
          >
            <Heart 
              size={20} 
              color={company.isFavorite ? "#FF4444" : "#DDD"} 
              fill={company.isFavorite ? "#FF4444" : "transparent"} 
            />
          </TouchableOpacity>
        </View>

        <View style={styles.servicesContainer}>
          {company.services.slice(0, 3).map((service, index) => (
            <View key={index} style={styles.serviceTag}>
              <Text style={styles.serviceText}>{service}</Text>
            </View>
          ))}
        </View>

        <View style={styles.row}>
          <MapPin size={16} color="#4CAF50" />
          <Text style={styles.text} numberOfLines={1}>{company.address}</Text>
        </View>

        <View style={styles.row}>
          <Clock size={16} color="#4CAF50" />
          <Text style={styles.text}>{company.openHours}</Text>
        </View>

        <View style={styles.actionContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleCall}>
            <Phone size={16} color="#FFFFFF" />
            <Text style={styles.actionButtonText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]} onPress={handleWebsite}>
            <Globe size={16} color="#4CAF50" />
            <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>Website</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const CompanyDetailModal = ({ company, visible, onClose }) => {
  if (!company) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{company.name}</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.modalContent}>
          <View style={styles.modalRating}>
            <Star size={20} color="#FFD700" fill="#FFD700" />
            <Text style={styles.modalRatingText}>{company.rating} Rating</Text>
            <Text style={styles.modalDistance}>• {company.distance} away</Text>
          </View>

          <Text style={styles.modalDescription}>{company.description}</Text>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Services Offered</Text>
            <View style={styles.modalServices}>
              {company.services.map((service, index) => (
                <View key={index} style={styles.modalServiceTag}>
                  <Text style={styles.modalServiceText}>{service}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.modalSection}>
            <Text style={styles.modalSectionTitle}>Contact Information</Text>
            <View style={styles.modalContactRow}>
              <MapPin size={18} color="#4CAF50" />
              <Text style={styles.modalContactText}>{company.address}</Text>
            </View>
            <View style={styles.modalContactRow}>
              <Phone size={18} color="#4CAF50" />
              <Text style={styles.modalContactText}>{company.phone}</Text>
            </View>
            <View style={styles.modalContactRow}>
              <Clock size={18} color="#4CAF50" />
              <Text style={styles.modalContactText}>{company.openHours}</Text>
            </View>
          </View>

          <View style={styles.modalActions}>
            <TouchableOpacity 
              style={styles.modalActionButton}
              onPress={() => Linking.openURL(`tel:${company.phone}`)}
            >
              <Phone size={18} color="#FFFFFF" />
              <Text style={styles.modalActionText}>Call Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalActionButton, styles.modalSecondaryButton]}
              onPress={() => Linking.openURL(company.website)}
            >
              <Globe size={18} color="#4CAF50" />
              <Text style={[styles.modalActionText, styles.modalSecondaryText]}>Visit Website</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const NearByCompanies = () => {
  const [companiesData, setCompaniesData] = useState(companies);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [filterVisible, setFilterVisible] = useState(false);
  const [sortBy, setSortBy] = useState('distance'); // distance, rating, name

  const filteredCompanies = companiesData.filter(company =>
    company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.services.some(service => 
      service.toLowerCase().includes(searchQuery.toLowerCase())
    )
  ).sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'distance':
      default:
        return parseFloat(a.distance) - parseFloat(b.distance);
    }
  });

  const toggleFavorite = (companyId) => {
    setCompaniesData(prev => 
      prev.map(company => 
        company.id === companyId 
          ? { ...company, isFavorite: !company.isFavorite }
          : company
      )
    );
  };

  const viewDetails = (company) => {
    setSelectedCompany(company);
    setModalVisible(true);
  };

  const favoriteCompanies = companiesData.filter(c => c.isFavorite);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Nearby Recycling Companies</Text>
        <Text style={styles.subtitle}>{filteredCompanies.length} companies found</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#4CAF50" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search companies or services..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
        </View>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setFilterVisible(!filterVisible)}
        >
          <Filter size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {filterVisible && (
        <View style={styles.filterContainer}>
          <Text style={styles.filterTitle}>Sort by:</Text>
          <View style={styles.filterOptions}>
            {[
              { key: 'distance', label: 'Distance' },
              { key: 'rating', label: 'Rating' },
              { key: 'name', label: 'Name' }
            ].map(option => (
              <TouchableOpacity
                key={option.key}
                style={[
                  styles.filterOption,
                  sortBy === option.key && styles.filterOptionActive
                ]}
                onPress={() => setSortBy(option.key)}
              >
                <Text style={[
                  styles.filterOptionText,
                  sortBy === option.key && styles.filterOptionTextActive
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {favoriteCompanies.length > 0 && (
        <View style={styles.favoritesSection}>
          <Text style={styles.favoritesTitle}>⭐ Your Favorites</Text>
          <FlatList
            data={favoriteCompanies}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `fav_${item.id}`}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={styles.favoriteCard}
                onPress={() => viewDetails(item)}
              >
                <Text style={styles.favoriteCardName}>{item.name}</Text>
                <Text style={styles.favoriteCardRating}>★ {item.rating}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      <FlatList
        data={filteredCompanies}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CompanyCard 
            company={item} 
            onToggleFavorite={toggleFavorite}
            onViewDetails={viewDetails}
          />
        )}
        contentContainerStyle={styles.listContainer}
      />

      <CompanyDetailModal 
        company={selectedCompany}
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedCompany(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 25,
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    marginRight: 10,
  },
  filterOptionActive: {
    backgroundColor: '#4CAF50',
  },
  filterOptionText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  filterOptionTextActive: {
    color: '#FFFFFF',
  },
  favoritesSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
  },
  favoritesTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  favoriteCard: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 15,
    marginLeft: 20,
    minWidth: 120,
  },
  favoriteCardName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 2,
  },
  favoriteCardRating: {
    fontSize: 12,
    color: '#666',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  nameSection: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  distance: {
    marginLeft: 4,
    fontSize: 14,
    color: '#666',
  },
  favoriteButton: {
    padding: 8,
  },
  servicesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  serviceTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
  },
  serviceText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  text: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  actionContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  secondaryButtonText: {
    color: '#4CAF50',
  },
  // Modal Styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E8',
    backgroundColor: '#F8F9FA',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  closeButton: {
    padding: 5,
  },
  closeButtonText: {
    fontSize: 28,
    color: '#666',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalRatingText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  modalDistance: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    marginBottom: 25,
  },
  modalSection: {
    marginBottom: 25,
  },
  modalSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 12,
  },
  modalServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  modalServiceTag: {
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    marginRight: 8,
    marginBottom: 8,
  },
  modalServiceText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
  },
  modalContactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalContactText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#666',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalActionButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    borderRadius: 12,
  },
  modalSecondaryButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4CAF50',
  },
  modalActionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  modalSecondaryText: {
    color: '#4CAF50',
  },
});

export default NearByCompanies;