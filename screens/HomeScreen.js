import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const userName = "Isaac";

  const stats = [
    { icon: 'leaf-outline', value: '1,204', label: 'Items Recycled', color: '#2d6a4f' },
    { icon: 'trophy-outline', value: '8,500', label: 'Eco Points', color: '#e67e22' },
    { icon: 'people-outline', value: '#34', label: 'Community Rank', color: '#2980b9' },
    { icon: 'flame-outline', value: '72', label: 'Streak Days', color: '#e74c3c' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8f9fa" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
         
          <Text style={styles.userName}>{userName}!</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <Image
            source={{ uri: `https://i.pravatar.cc/150?u=${userName}` }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Primary Action Card */}
        <TouchableOpacity
          style={styles.primaryActionCard}
          onPress={() => navigation.navigate('Scan')}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#40916c', '#2d6a4f']}
            style={styles.primaryActionGradient}
          >
            <View style={styles.primaryActionContent}>
              <View style={styles.primaryActionText}>
                <Text style={styles.primaryActionTitle}>Scan New Item</Text>
                <Text style={styles.primaryActionSubtitle}>Identify and sort waste instantly</Text>
              </View>
              <View style={styles.primaryActionIcon}>
                <Ionicons name="scan-outline" size={32} color="#1b4332" />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Stats Carousel */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Eco-Impact</Text>
          <ScrollView 
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsCarousel}
          >
            {stats.map((stat, index) => (
              <View key={index} style={[styles.statCard, { backgroundColor: stat.color + '15' }]}>
                <View style={[styles.statIconContainer, { backgroundColor: stat.color }]}>
                  <Ionicons name={stat.icon} size={24} color="#fff" />
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Discover Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Discover</Text>
          <View style={styles.discoverGrid}>
            <TouchableOpacity style={styles.discoverCard} onPress={() => navigation.navigate('Map')}>
              <Ionicons name="map-outline" size={28} color="#1b4332" />
              <Text style={styles.discoverText}>Find Drop-off</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="newspaper-outline" size={28} color="#1b4332" />
              <Text style={styles.discoverText}>Recycling Tips</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="medal-outline" size={28} color="#1b4332" />
              <Text style={styles.discoverText}>Achievements</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.discoverCard}>
              <Ionicons name="chatbubbles-outline" size={28} color="#1b4332" />
              <Text style={styles.discoverText}>Community</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 25 : 15,
    paddingBottom: 15,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  greetingText: {
    fontSize: 16,
    color: '#6c757d',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1b4332',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  primaryActionCard: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    elevation: 8,
    shadowColor: '#2d6a4f',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  primaryActionGradient: {
    borderRadius: 20,
    padding: 20,
  },
  primaryActionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  primaryActionText: {
    flex: 1,
  },
  primaryActionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  primaryActionSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 4,
  },
  primaryActionIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
  },
  section: {
    marginTop: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4332',
    marginHorizontal: 20,
    marginBottom: 15,
  },
  statsCarousel: {
    paddingHorizontal: 20,
    gap: 15,
  },
  statCard: {
    width: 140,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b4332',
  },
  statLabel: {
    fontSize: 13,
    color: '#6c757d',
    marginTop: 2,
    textAlign: 'center',
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginHorizontal: 20,
  },
  discoverCard: {
    width: (width - 55) / 2,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  discoverText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    color: '#1b4332',
  },
});

export default HomeScreen;