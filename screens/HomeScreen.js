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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Redesigned Header */}
        <LinearGradient
          colors={['#1b4332', '#2d6a4f']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.headerGradient}
        >
          <View style={styles.header}>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Good morning,</Text>
              <Text style={styles.userName}>{userName}!</Text>
            </View>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Profile')}
              style={styles.avatarContainer}
            >
              <Image
                source={{ uri: `https://i.pravatar.cc/150?u=${userName}` }}
                style={styles.avatar}
              />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Eco Stats Card with enhanced design */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Your Eco-Impact</Text>
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Ionicons name="leaf-outline" size={28} color="#2d6a4f" />
              <Text style={styles.statValue}>1,204</Text>
              <Text style={styles.statLabel}>Items Recycled</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="trophy-outline" size={28} color="#2d6a4f" />
              <Text style={styles.statValue}>8,500</Text>
              <Text style={styles.statLabel}>Eco Points</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="people-outline" size={28} color="#2d6a4f" />
              <Text style={styles.statValue}>#34</Text>
              <Text style={styles.statLabel}>Community Rank</Text>
            </View>
          </View>
        </View>

        {/* Quick Actions with improved design */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Scan')}
            >
              <Ionicons name="scan-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>Scan New Item</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => navigation.navigate('Map')}
            >
              <Ionicons name="map-outline" size={32} color="#fff" />
              <Text style={styles.actionText}>Find Drop-off</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Community Challenge Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Community Challenge</Text>
          <LinearGradient
            colors={['#e9f5db', '#cde4b5']}
            style={styles.challengeCard}
          >
            <View>
              <Text style={styles.challengeTitle}>Plastic-Free July</Text>
              <Text style={styles.challengeSubtitle}>Join the community in reducing plastic waste. Every item counts!</Text>
              <View style={styles.progressContainer}>
                <View style={styles.progressBar} />
                <Text style={styles.progressText}>68% Complete</Text>
              </View>
            </View>
            <Ionicons name="rocket-outline" size={40} color="#3c6e47" />
          </LinearGradient>
        </View>

        {/* Enhanced Tips Section */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recycling Tips</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tipsScrollContainer}
          >
            <View style={styles.tipCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1599837560442-84b5ce4a6431?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.tipImage}
              />
              <Text style={styles.tipText}>How to properly sort plastics</Text>
            </View>
            <View style={styles.tipCard}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1604187351543-044701445999?q=80&w=2070&auto=format&fit=crop' }}
                style={styles.tipImage}
              />
              <Text style={styles.tipText}>Composting 101 for beginners</Text>
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  headerGradient: {
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 20 : 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTextContainer: {},
  greetingText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
  },
  avatarContainer: {
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    borderRadius: 30,
  },
  avatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  sectionContainer: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1b4332',
  },
  seeAllText: {
    fontSize: 14,
    color: '#2d6a4f',
    fontWeight: '600',
  },
  statsCard: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 20,
    marginTop: 15,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d6a4f',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 13,
    color: 'gray',
    marginTop: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },
  actionCard: {
    backgroundColor: '#2d6a4f',
    flex: 1,
    marginHorizontal: 8,
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    elevation: 3,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginTop: 12,
  },
  challengeCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderRadius: 20,
    marginTop: 15,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3c6e47',
  },
  challengeSubtitle: {
    fontSize: 14,
    color: '#3c6e47',
    marginTop: 4,
    maxWidth: '90%',
  },
  progressContainer: {
    marginTop: 15,
  },
  progressBar: {
    width: '68%',
    height: 8,
    backgroundColor: '#3c6e47',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: '#3c6e47',
    marginTop: 4,
    fontWeight: '500',
  },
  tipsScrollContainer: {
    paddingLeft: 4,
    paddingVertical: 10,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    width: 250,
    marginRight: 15,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  tipImage: {
    width: '100%',
    height: 120,
  },
  tipText: {
    padding: 15,
    fontSize: 14,
    fontWeight: '600',
    color: '#1b4332',
  },
});

export default HomeScreen;