import React, { useState, useRef, useEffect } from 'react';
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
  Dimensions,
  Platform,
  BackHandler
} from 'react-native';
import { 
  Ionicons, 
  MaterialCommunityIcons, 
  FontAwesome5, 
  AntDesign,
  Feather
} from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isTablet = width >= 768;

// Color constants
const COLORS = {
  primary: '#2d6a4f',
  primaryLight: '#40916c',
  primaryDark: '#1b4332',
  accent: '#74c69d',
  white: '#ffffff',
  background: '#f8f9fa',
  text: '#2d6a4f',
  textLight: '#40916c',
  textDark: '#1b4332',
  shadow: 'rgba(0, 0, 0, 0.1)',
};

const HomeScreen = ({ navigation }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-width)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (menuOpen) {
        toggleMenu();
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [menuOpen]);

  const toggleMenu = () => {
    const toValue = menuOpen ? -width : 0;
    const fadeToValue = menuOpen ? 0 : 1;
    
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: fadeToValue,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start();
    
    setMenuOpen(!menuOpen);
  };

  const navigateTo = (screen) => {
    toggleMenu();
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      {/* Overlay */}
      {menuOpen && (
        <Animated.View 
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.overlayTouchable} 
            activeOpacity={1} 
            onPress={toggleMenu}
          />
        </Animated.View>
      )}
      
      {/* Side Menu */}
      <Animated.View 
        style={[
          styles.sideMenu, 
          { 
            transform: [{ translateX: slideAnim }],
          }
        ]}
      >
        <View style={styles.menuHeader}>
          <Image 
            source={require('../assets/trash.png')} 
            style={styles.menuLogo} 
          />
          <Text style={styles.menuLogoText}>Trash it</Text>
        </View>
        
        <ScrollView style={styles.menuItems} showsVerticalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Home')}
          >
            <Ionicons name="home" size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Home</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Chat')}
          >
            <Ionicons name="chatbubble-outline" size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Chats</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('WasteDisposal')}
          >
            <FontAwesome5 name="trash" size={20} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Waste Disposal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Biosafety')}
          >
            <MaterialCommunityIcons name="molecule" size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Biosafety</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Industries')}
          >
            <MaterialCommunityIcons name="factory" size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Industries</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Donate')}
          >
            <FontAwesome5 name="hand-holding-heart" size={20} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Donate</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Volunteer')}
          >
            <FontAwesome5 name="hands-helping" size={20} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Volunteer</Text>
          </TouchableOpacity>
        </ScrollView>
        
        <View style={styles.menuFooter}>
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Settings')}
          >
            <Ionicons name="settings-outline" size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Settings</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.menuItem, menuOpen && styles.menuItemActive]} 
            onPress={() => navigateTo('Help')}
          >
            <Feather name="help-circle" size={22} color={COLORS.primary} />
            <Text style={styles.menuItemText}>Help</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

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
              source={require('../assets/trash.png')} 
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

              <TouchableOpacity 
                style={styles.quickAccessItem}
                onPress={() => navigation.navigate('RwandaMap')}
              >
                <View style={styles.quickAccessIcon}>
                  <MaterialCommunityIcons name="map-marker-multiple" size={22} color="#4CAF50" />
                </View>
                <Text style={styles.quickAccessText}>Map</Text>
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
    backgroundColor: COLORS.background,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 998,
  },
  overlayTouchable: {
    flex: 1,
  },
  sideMenu: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: isTablet ? '50%' : '75%',
    backgroundColor: COLORS.white,
    zIndex: 999,
    paddingVertical: Platform.OS === 'ios' ? 50 : 40,
    paddingHorizontal: 20,
    elevation: 10,
    shadowColor: COLORS.shadow,
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
    borderBottomColor: 'rgba(45, 106, 79, 0.1)',
  },
  menuLogo: {
    width: isSmallDevice ? 36 : 40,
    height: isSmallDevice ? 36 : 40,
    tintColor: COLORS.primary,
  },
  menuLogoText: {
    color: COLORS.primary,
    fontSize: isSmallDevice ? 20 : 24,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  menuItems: {
    flex: 1,
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 8,
    backgroundColor: 'rgba(45, 106, 79, 0.05)',
  },
  menuItemActive: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
  },
  menuItemText: {
    marginLeft: 16,
    fontSize: isSmallDevice ? 14 : 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
  menuFooter: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 20,
  },
  mainContent: {
    flex: 1,
  },
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    paddingHorizontal: 20,
    paddingVertical: 15,
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginTop: Platform.OS === 'ios' ? 40 : 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 28,
    height: 28,
    tintColor: '#4CAF50',
  },
  logoText: {
    color: '#2d6a4f',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  scrollView: {
    flex: 1,
  },
  headerBackground: {
    width: '100%',
    height: isTablet ? 300 : 250,
    marginBottom: 25,
  },
  headerContent: {
    padding: 25,
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(45, 106, 79, 0.3)',
  },
  headerTextContainer: {
    maxWidth: '85%',
  },
  headerText: {
    fontSize: isTablet ? 40 : 32,
    fontWeight: 'bold',
    color: COLORS.white,
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: 5,
  },
  greenText: {
    color: COLORS.accent,
  },
  readMoreButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 1,
    borderColor: 'white',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 25,
    alignSelf: 'flex-start',
    marginTop: 25,
  },
  readMoreText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  quickAccessContainer: {
    marginBottom: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: isTablet ? 26 : 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 20,
  },
  quickAccessScroll: {
    flexDirection: 'row',
  },
  quickAccessItem: {
    alignItems: 'center',
    marginRight: isTablet ? 35 : 25,
  },
  quickAccessIcon: {
    width: isTablet ? 80 : 70,
    height: isTablet ? 80 : 70,
    borderRadius: isTablet ? 40 : 35,
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 3,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickAccessText: {
    fontSize: isSmallDevice ? 12 : 14,
    color: COLORS.primary,
    fontWeight: '500',
  },
  servicesContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  cardsContainer: {
    marginTop: 10,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    width: isTablet ? '48%' : '48%',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    overflow: 'hidden',
  },
  cardContent: {
    padding: isTablet ? 25 : 20,
  },
  iconContainer: {
    width: isTablet ? 64 : 56,
    height: isTablet ? 64 : 56,
    borderRadius: isTablet ? 32 : 28,
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  cardTitle: {
    fontSize: isTablet ? 18 : 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: COLORS.primary,
  },
  cardDescription: {
    fontSize: isTablet ? 14 : 13,
    color: COLORS.textLight,
    lineHeight: isTablet ? 22 : 20,
    marginBottom: 15,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardReadMore: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '600',
    marginRight: 6,
  },
  tipsContainer: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  tipCard: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: isTablet ? 25 : 20,
    flexDirection: 'row',
    elevation: 4,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  tipIconContainer: {
    width: isTablet ? 80 : 70,
    height: isTablet ? 80 : 70,
    borderRadius: isTablet ? 40 : 35,
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: isTablet ? 20 : 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 10,
  },
  tipDescription: {
    fontSize: isTablet ? 16 : 14,
    color: COLORS.textLight,
    lineHeight: isTablet ? 24 : 22,
    marginBottom: 15,
  },
  tipButton: {
    backgroundColor: 'rgba(45, 106, 79, 0.1)',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignSelf: 'flex-start',
  },
  tipButtonText: {
    color: COLORS.primary,
    fontSize: isTablet ? 16 : 14,
    fontWeight: '600',
  },
  footerSpace: {
    height: 100,
  },
  fab: {
    position: 'absolute',
    bottom: isTablet ? 35 : 25,
    right: isTablet ? 35 : 25,
    width: isTablet ? 75 : 65,
    height: isTablet ? 75 : 65,
    borderRadius: isTablet ? 37.5 : 32.5,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

export default HomeScreen;