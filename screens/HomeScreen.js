import React, { useState, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  ImageBackground, 
  TouchableOpacity, 
  ScrollView, 
  SafeAreaView,
  StatusBar,
  Animated,
  Dimensions
} from 'react-native';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  FontAwesome5, 
  AntDesign,
  Feather
} from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width * 0.7)).current;

  const toggleMenu = () => {
    const toValue = menuOpen ? -width * 0.7 : 0;
    
    Animated.timing(slideAnim, {
      toValue,
      duration: 300,
      useNativeDriver: true,
    }).start();
    
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (screen) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Hamburger Menu */}
      <Animated.View 
        style={[
          styles.sideMenu, 
          { transform: [{ translateX: slideAnim }] }
        ]}
      >
        <View style={styles.menuHeader}>
          <Image 
            source={require('../assets/favicon.png')} 
            style={styles.menuLogo} 
          />
          <Text style={styles.menuLogoText}>Trash it</Text>
        </View>
        
        <View style={styles.menuItems}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Home')}
          >
            <Ionicons name="home" size={22} color="#4CAF50" />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          {/* Controlling chat app */}
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Home')}
          >
            <Ionicons name="home" size={22} color="#4CAF50" />
            <Text style={styles.menuItemText}>Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('WasteDisposal')}
          >
            <FontAwesome5 name="trash" size={20} color="#4CAF50" />
            <Text style={styles.menuItemText}>Waste Disposal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Biosafety')}
          >
            <MaterialCommunityIcons name="molecule" size={22} color="#4CAF50" />
            <Text style={styles.menuItemText}>Biosafety</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Industries')}
          >
            <MaterialCommunityIcons name="factory" size={22} color="#4CAF50" />
            <Text style={styles.menuItemText}>Industries</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Donate')}
          >
            <FontAwesome5 name="hand-holding-heart" size={20} color="#4CAF50" />
            <Text style={styles.menuItemText}>Donate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Volunteer')}
          >
            <FontAwesome5 name="hands-helping" size={20} color="#4CAF50" />
            <Text style={styles.menuItemText}>Volunteer</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.menuFooter}>
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color="#777" />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => navigateTo('Help')}
          >
            <Feather name="help-circle" size={22} color="#777" />
            <Text style={styles.menuItemText}>Help</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      {/* Overlay when menu is open */}
      {menuOpen && (
        <TouchableOpacity 
          style={styles.overlay} 
          activeOpacity={1} 
          onPress={toggleMenu}
        />
      )}
      
      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Header Section */}
        <SafeAreaView/>
        <View style={styles.appBar}>
          <TouchableOpacity onPress={toggleMenu}>
            <Feather name="menu" size={26} color="#333" />
          </TouchableOpacity>
          
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/favicon.png')} 
              style={styles.logo} 
            />
            <Text style={styles.logoText}>Trash it</Text>
          </View>
          
          <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
            <Ionicons name="notifications-outline" size={26} color="#333" />
          </TouchableOpacity>
        </View>
        {/*  */}
        
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Banner Section */}
          <ImageBackground 
            source={require('../assets/really.png')} 
            style={styles.headerBackground}
            resizeMode="cover"
          >
            <SafeAreaView style={styles.headerContent}>
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerText}>Clean today <Text style={styles.greenText}>Green</Text></Text>
                <Text style={styles.headerText}>tomorrow</Text>
                <TouchableOpacity style={styles.readMoreButton}>
                  <Text style={styles.readMoreText}>Read more</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </ImageBackground>
          
          {/* Quick Access Section */}
          <View style={styles.quickAccessContainer}>
            <Text style={styles.sectionTitle}>Quick Access</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.quickAccessScroll}
            >
              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate('AuditCertificate')}
              >
                <View style={styles.quickAccessIcon}>
                  <FontAwesome5 name="certificate" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.quickAccessText}>Audit</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate('WasteDisposal')}
              >
                <View style={styles.quickAccessIcon}>
                  <FontAwesome5 name="trash" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.quickAccessText}>Waste</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate('Biosafety')}
              >
                <View style={styles.quickAccessIcon}>
                  <MaterialCommunityIcons name="molecule" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.quickAccessText}>Biosafety</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate('Industries')}
              >
                <View style={styles.quickAccessIcon}>
                  <MaterialCommunityIcons name="factory" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.quickAccessText}>Industries</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate('Donate')}
              >
                <View style={styles.quickAccessIcon}>
                  <FontAwesome5 name="hand-holding-heart" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.quickAccessText}>Donate</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
          
          {/* Services Section */}
          <View style={styles.servicesContainer}>
            <Text style={styles.sectionTitle}>Our Services</Text>
            <View style={styles.cardsContainer}>
              <View style={styles.row}>
                <TouchableOpacity 
                  style={styles.card} 
                  onPress={() => navigation.navigate('AuditCertificate')}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <FontAwesome5 name="certificate" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.cardTitle}>AUDIT CERTIFICATE</Text>
                    <Text style={styles.cardDescription}>
                      The Environmental Audit certificate is issued to projects that have been audited (Order No. 001/2021 of 05/02/2021) which affect the environment programs.
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardReadMore}>Read more</Text>
                      <AntDesign name="arrowright" size={14} color="#4CAF50" />
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.card} 
                  onPress={() => navigation.navigate('WasteDisposal')}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <FontAwesome5 name="trash" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.cardTitle}>WASTE DISPOSAL</Text>
                    <Text style={styles.cardDescription}>
                      The Rwanda Environment Management Authority (REMA) works closely with different private sector stakeholders responsible for collection and...
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardReadMore}>Read more</Text>
                      <AntDesign name="arrowright" size={14} color="#4CAF50" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.row}>
                <TouchableOpacity 
                  style={styles.card} 
                  onPress={() => navigation.navigate('Biosafety')}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons name="molecule" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.cardTitle}>BIOSAFETY</Text>
                    <Text style={styles.cardDescription}>
                      In accordance with Law No. 063/2013 of 27/08/2013 concerning Biological diversity, certain activities related to living modified organisms (LMOs) require a permit to attain...
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardReadMore}>Read more</Text>
                      <AntDesign name="arrowright" size={14} color="#4CAF50" />
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.card} 
                  onPress={() => navigation.navigate('Industries')}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <MaterialCommunityIcons name="factory" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.cardTitle}>INDUSTRIES</Text>
                    <Text style={styles.cardDescription}>
                      The industrialization strategy—use resources judiciously (water, energy and raw materials), pollution prevention and manufacturing innovation...
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardReadMore}>Read more</Text>
                      <AntDesign name="arrowright" size={14} color="#4CAF50" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
              
              <View style={styles.row}>
                <TouchableOpacity 
                  style={styles.card} 
                  onPress={() => navigation.navigate('Donate')}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <FontAwesome5 name="hand-holding-heart" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.cardTitle}>DONATE</Text>
                    <Text style={styles.cardDescription}>
                      Every contribution, big or small, helps us make a difference. Donate today and help us plant more trees in your port...
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardReadMore}>Read more</Text>
                      <AntDesign name="arrowright" size={14} color="#4CAF50" />
                    </View>
                  </View>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.card} 
                  onPress={() => navigation.navigate('Volunteer')}
                >
                  <View style={styles.cardContent}>
                    <View style={styles.iconContainer}>
                      <FontAwesome5 name="hands-helping" size={24} color="#4CAF50" />
                    </View>
                    <Text style={styles.cardTitle}>VOLUNTEER</Text>
                    <Text style={styles.cardDescription}>
                      Lend a hand, make a difference. Your time will help us change lives. Join us and be a part of something meaningful. Volunteer here.
                    </Text>
                    <View style={styles.cardFooter}>
                      <Text style={styles.cardReadMore}>Read more</Text>
                      <AntDesign name="arrowright" size={14} color="#4CAF50" />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Environmental Tips Section */}
          <View style={styles.tipsContainer}>
            <Text style={styles.sectionTitle}>Environmental Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipIconContainer}>
                <Ionicons name="bulb-outline" size={30} color="#4CAF50" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Reduce, Reuse, Recycle</Text>
                <Text style={styles.tipDescription}>
                  Practicing the three R's - reduce, reuse and recycle - is one of the easiest ways you can help protect the environment and conserve natural resources.
                </Text>
                <TouchableOpacity style={styles.tipButton}>
                  <Text style={styles.tipButtonText}>More Tips</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Footer Space */}
          <View style={styles.footerSpace} />
        </ScrollView>
        
        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab}>
          <Ionicons name="leaf" size={32} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '70%',
    backgroundColor: 'white',
    zIndex: 999,
    paddingVertical: 40,
    paddingHorizontal: 16,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 5, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuLogo: {
    width: 36,
    height: 36,
    tintColor: '#4CAF50',
  },
  menuLogoText: {
    color: '#333',
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
  },
  menuFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 998,
  },
  mainContent: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0,
    shadowRadius: 3,
    marginTop: 20,
    color: 'white',
    // opacity: 0.9,
    transparent: true,

  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 24,
    height: 24,
    tintColor: '#4CAF50',
  },
  logoText: {
    color: '#333',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    width: '100%',
    height: 220,
    marginBottom: 20,
  },
  headerContent: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  headerTextContainer: {
    maxWidth: '80%',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  greenText: {
    color: '#4CAF50',
  },
  readMoreButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignSelf: 'flex-start',
    marginTop: 20,
  },
  readMoreText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickAccessContainer: {
    marginBottom: 25,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  quickAccessScroll: {
    flexDirection: 'row',
  },
  quickAccessItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  quickAccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quickAccessText: {
    fontSize: 12,
    color: '#555',
  },
  servicesContainer: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  cardsContainer: {
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    width: '48%',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: 'hidden',
  },
  cardContent: {
    padding: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  cardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardReadMore: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 4,
  },
  tipsContainer: {
    paddingHorizontal: 16,
    marginBottom: 25,
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  tipDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    marginBottom: 12,
  },
  tipButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
  },
  tipButtonText: {
    color: '#4CAF50',
    fontSize: 12,
    fontWeight: '600',
  },
  footerSpace: {
    height: 80,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
  },
});

export default HomeScreen;