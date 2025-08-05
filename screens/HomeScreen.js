import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
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
  Animated as RNAnimated,
  useWindowDimensions,
  RefreshControl,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get("window");

const ecoTips = [
  { 
    text: '🌟 Did you know? Recycling one aluminum can saves enough energy to run a TV for 3 hours!',
    likes: 124,
    liked: false
  },
  { 
    text: '💡 Tip: Rinse containers before recycling to avoid contamination.',
    likes: 89,
    liked: false
  },
  { 
    text: '♻️ Fact: Glass can be recycled endlessly without loss in quality.',
    likes: 156,
    liked: false
  },
  { 
    text: '🛍️ Tip: Bring your own bag to reduce plastic waste.',
    likes: 72,
    liked: false
  },
  { 
    text: '🌱 Fact: Composting food scraps reduces landfill waste and creates rich soil.',
    likes: 203,
    liked: false
  }
];

const HomeScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [ecoTipIndex, setEcoTipIndex] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [tips, setTips] = useState(ecoTips);
  const [isOffline, setIsOffline] = useState(false);
  const [quickActionsVisible, setQuickActionsVisible] = useState(false);
  
  const scanAnim = useRef(new RNAnimated.Value(0.8)).current;
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const slideAnim = useRef(new RNAnimated.Value(50)).current;
  const pulseAnim = useRef(new RNAnimated.Value(1)).current;
  const tipFadeAnim = useRef(new RNAnimated.Value(1)).current;
  const quickActionsAnim = useRef(new RNAnimated.Value(0)).current;
  
  const window = useWindowDimensions();
  const isTablet = window.width >= 768;
  const isSmallDevice = window.width < 350;
  const isMediumDevice = window.width >= 350 && window.width < 450;
  const isLargeDevice = window.width >= 450;

  // Responsive dimensions
  const getResponsiveSize = (small, medium, large, tablet) => {
    if (isTablet) return tablet;
    if (isSmallDevice) return small;
    if (isMediumDevice) return medium;
    return large;
  };

  const responsiveSizes = {
    // Font sizes
    titleSize: getResponsiveSize(16, 18, 20, 24),
    subtitleSize: getResponsiveSize(12, 13, 14, 16),
    bodySize: getResponsiveSize(11, 12, 13, 15),
    headerSize: getResponsiveSize(18, 20, 22, 26),
    userNameSize: getResponsiveSize(16, 18, 20, 24),
    
    // Spacing
    sectionSpacing: getResponsiveSize(16, 20, 24, 32),
    cardPadding: getResponsiveSize(12, 16, 18, 24),
    iconSize: getResponsiveSize(16, 18, 20, 24),
    largeIconSize: getResponsiveSize(24, 28, 32, 40),
    
    // Card dimensions
    cardRadius: getResponsiveSize(12, 14, 16, 20),
    avatarSize: getResponsiveSize(32, 36, 40, 48),
    fabSize: getResponsiveSize(50, 56, 60, 68),
    
    // Grid spacing
    gridGap: getResponsiveSize(8, 12, 16, 20),
    containerPadding: getResponsiveSize(16, 18, 20, 24),
  };

  useEffect(() => {
    const getUserinfo = async () => {
      try {
        const response = await axios.get(
          "https://trash2treasure-backend.onrender.com/userInfo",
          { timeout: 5000 }
        );
        setUser(response.data);
        setIsOffline(false);
      } catch (error) {
        if (error.code === 'ECONNABORTED' || error.message === 'Network Error') {
          setIsOffline(true);
          Toast.show({
            type: 'info',
            text1: 'Offline Mode',
            text2: 'Showing cached data',
          });
        } else {
          Toast.show({
            type: "error",
            text1: "You must login first",
            text2: "Please login or create account first",
          });
          navigation.navigate("Login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    getUserinfo();
    RNAnimated.parallel([
      RNAnimated.spring(scanAnim, {
        toValue: 1,
        friction: 4,
        tension: 80,
        useNativeDriver: true,
      }),
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      RNAnimated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const createPulse = () => {
      RNAnimated.sequence([
        RNAnimated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1500,
          useNativeDriver: true,
        }),
        RNAnimated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ]).start(() => createPulse());
    };
    createPulse();

    const interval = setInterval(() => {
      RNAnimated.sequence([
        RNAnimated.timing(tipFadeAnim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: true,
        }),
        RNAnimated.timing(tipFadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
      setEcoTipIndex((prev) => (prev + 1) % tips.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      const response = await axios.get(
        "https://trash2treasure-backend.onrender.com/userInfo",
        { timeout: 5000 }
      );
      setUser(response.data);
      setIsOffline(false);
    } catch (error) {
      setIsOffline(true);
    } finally {
      setRefreshing(false);
    }
  };

  const handleLikeTip = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const updatedTips = [...tips];
    updatedTips[index] = {
      ...updatedTips[index],
      liked: !updatedTips[index].liked,
      likes: updatedTips[index].liked 
        ? updatedTips[index].likes - 1 
        : updatedTips[index].likes + 1
    };
    setTips(updatedTips);
  };

  const toggleQuickActions = () => {
    if (quickActionsVisible) {
      RNAnimated.timing(quickActionsAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true
      }).start(() => setQuickActionsVisible(false));
    } else {
      setQuickActionsVisible(true);
      RNAnimated.timing(quickActionsAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true
      }).start();
    }
  };

  const defaultStats = [
    {
      icon: "leaf-outline",
      value: user?.itemsRecycled || "0",
      label: "Items Recycled",
      color: "#00C896",
      gradient: ["#00C896", "#00A578"],
    },
    {
      icon: "trophy-outline",
      value: user?.ecoPoints || "0",
      label: "Eco Points",
      color: "#FF6B35",
      gradient: ["#FF6B35", "#F7931E"],
    },
    {
      icon: "people-outline",
      value: user?.communityRank || "#238",
      label: "Community Rank",
      color: "#4ECDC4",
      gradient: ["#4ECDC4", "#44A08D"],
    },
  ];
  const stats = defaultStats;

  const badges = [
    { id: 1, name: 'Starter', icon: 'star', earned: true, color: '#FFD700' },
    { id: 2, name: 'Recycler', icon: 'leaf', earned: true, color: '#00C896' },
    { id: 3, name: 'Eco Hero', icon: 'trophy', earned: user?.ecoPoints > 500, color: '#FF6B35' },
    { id: 4, name: 'Streak', icon: 'flame', earned: user?.streakDays > 7, color: '#FF5722' },
  ];

  const leaderboard = [
    { id: 1, name: 'Niyobyose Isaac Precieux', points: 15430, avatar: null },
    { id: 2, name: 'gravity0071@gmail.com', points: 12890, avatar: null },
  ];

  const nearbyCompanies = [
    { 
      id: 1, 
      name: 'Seoul Green Recycling Co.', 
      phone: '+82-2-1234-5678',
      distance: '0.5km',
      rating: 4.8,
      types: ['Plastic', 'Paper', 'Glass']
    },
    { 
      id: 2, 
      name: 'Busan Eco Solutions', 
      phone: '+82-51-9876-5432',
      distance: '1.2km',
      rating: 4.6,
      types: ['Electronics', 'Metal', 'Plastic']
    },
    { 
      id: 3, 
      name: 'Incheon Waste Management', 
      phone: '+82-32-5555-1234',
      distance: '2.1km',
      rating: 4.9,
      types: ['Organic', 'Paper', 'Glass']
    },
    { 
      id: 4, 
      name: 'Daegu Recycling Center', 
      phone: '+82-53-7777-8888',
      distance: '3.5km',
      rating: 4.7,
      types: ['Plastic', 'Metal', 'Electronics']
    }
  ];

  const progress = user?.ecoPoints ? Math.min(user.ecoPoints / 1000, 1) : 0.1;

  const quickActions = [
    { icon: "scan-outline", label: "Scan", action: () => navigation.navigate("ScanChoice") },
    { icon: "map-outline", label: "Map", action: () => navigation.navigate("Map") },
    { icon: "qr-code-outline", label: "Purchase", action: () => navigation.navigate("Rewards") },
    { icon: "settings-outline", label: "Settings", action: () => navigation.navigate("Settings") },
  ];

  const leaderboardPreview = leaderboard.slice(0, 2);

  const featuredRewards = [
    {
      id: 1,
      name: 'Eco Certificate',
      cost: 500,
      image: 'https://cdn-icons-png.flaticon.com/512/3135/3135715.png',
    },
    {
      id: 2,
      name: 'Reusable Water Bottle',
      cost: 800,
      image: 'https://cdn-icons-png.flaticon.com/512/1046/1046857.png',
    },
    {
      id: 3,
      name: 'Discount Coupon',
      cost: 300,
      image: 'https://cdn-icons-png.flaticon.com/512/3523/3523887.png',
    },
  ];

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#1B5E20" />
        <Text style={[styles.loadingText, { fontSize: responsiveSizes.bodySize }]}>Loading your eco profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <View style={[styles.simpleTopNav, { paddingHorizontal: responsiveSizes.containerPadding }]}>
        <View style={styles.simpleTopNavLeft}>
          <Text style={[styles.simpleTopNavGreeting, { fontSize: responsiveSizes.subtitleSize }]}>Welcome back,</Text>
          <Text style={[styles.simpleTopNavUserName, { fontSize: responsiveSizes.userNameSize }]} numberOfLines={1} adjustsFontSizeToFit>
            {user ? user.fullNames : "Guest User"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(user ? "Profile" : "Login")}
          style={styles.simpleTopNavAvatarTouchable}
          accessibilityLabel={user ? "Go to profile" : "Login"}
        >
          <View style={[styles.simpleTopNavAvatarWrap, { 
            width: responsiveSizes.avatarSize, 
            height: responsiveSizes.avatarSize, 
            borderRadius: responsiveSizes.avatarSize / 2 
          }]}>
            {user && user.profilePic ? (
              <Image
                source={{ uri: `https://trash2treasure-backend.onrender.com/${user.profilePic}` }}
                style={[styles.simpleTopNavAvatar, { 
                  width: responsiveSizes.avatarSize, 
                  height: responsiveSizes.avatarSize, 
                  borderRadius: responsiveSizes.avatarSize / 2 
                }]}
              />
            ) : (
              <Ionicons 
                name="person" 
                size={responsiveSizes.iconSize} 
                color="#FF3D57" 
                style={{ 
                  backgroundColor: '#bbb', 
                  borderRadius: responsiveSizes.avatarSize / 4, 
                  padding: responsiveSizes.avatarSize / 8 
                }} 
              />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingHorizontal: responsiveSizes.containerPadding }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#1B5E20", "#2E7D32"]}
            tintColor="#1B5E20"
          />
        }
      >
        <TouchableOpacity 
          style={[styles.dailyChallengeCard, { 
            borderRadius: responsiveSizes.cardRadius,
            marginTop: responsiveSizes.sectionSpacing,
            marginBottom: responsiveSizes.sectionSpacing / 2
          }]} 
          onPress={() => navigation.navigate('Challenges')} 
          activeOpacity={0.9}
        >
          <LinearGradient colors={["#fffbe6", "#e0f7fa"]} style={[styles.dailyChallengeGradient, { 
            borderRadius: responsiveSizes.cardRadius,
            padding: responsiveSizes.cardPadding
          }]}>
            <View style={styles.dailyChallengeContent}>
              <Ionicons name="flash" size={responsiveSizes.iconSize} color="#FF6B35" style={{ marginRight: 10 }} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.dailyChallengeTitle, { fontSize: responsiveSizes.titleSize }]}>Daily Challenge</Text>
                <Text style={[styles.dailyChallengeText, { fontSize: responsiveSizes.bodySize }]}>Recycle 5 plastic bottles today and earn bonus points!</Text>
              </View>
              <Ionicons name="chevron-forward" size={responsiveSizes.iconSize} color="#FF6B35" />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        <View style={[styles.quickLinksRow, { 
          gap: responsiveSizes.gridGap,
          marginBottom: responsiveSizes.sectionSpacing
        }]}>
          {[{ icon: 'scan-outline', label: 'Scan', nav: 'ScanChoice' }, { icon: 'business-outline', label: 'Nearby Companies', nav: 'NearByCompanies' }].map((item, idx) => (
            <TouchableOpacity 
              key={item.label} 
              style={styles.quickLinkButton} 
              onPress={() => navigation.navigate(item.nav)} 
              activeOpacity={0.85}
            >
              <View style={[styles.quickLinkIconWrap, { 
                padding: responsiveSizes.cardPadding / 2,
                borderRadius: responsiveSizes.cardRadius
              }]}>
                <Ionicons name={item.icon} size={responsiveSizes.iconSize} color="#FF3D57" />
              </View>
              <Text style={[styles.quickLinkLabel, { fontSize: responsiveSizes.bodySize }]}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.section, { 
          marginTop: responsiveSizes.sectionSpacing,
          marginBottom: responsiveSizes.sectionSpacing
        }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveSizes.titleSize }]}>🏆 Top Recyclers</Text>
            <Text style={[styles.seeAllText, { fontSize: responsiveSizes.bodySize }]}>See All</Text>
          </View>
          <LinearGradient colors={["#fff", "#fff8e1"]} style={[styles.leaderboardGradient, { 
            borderRadius: responsiveSizes.cardRadius,
            padding: responsiveSizes.cardPadding / 2
          }]}>
            {leaderboardPreview.map((user, idx) => (
              <TouchableOpacity key={user.id} onPress={() => navigation.navigate('Leaderboard')} activeOpacity={0.8}>
                <View style={[styles.leaderboardRow, { 
                  paddingVertical: responsiveSizes.cardPadding / 3, 
                  paddingHorizontal: responsiveSizes.cardPadding / 2 
                }]}>
                  <View style={styles.leaderboardPosition}>
                    <Ionicons 
                      name="trophy" 
                      size={responsiveSizes.iconSize / 1.5} 
                      color={idx === 0 ? '#FFD700' : idx === 1 ? '#FF3D57' : '#FF6B35'} 
                    />
                    <Text style={[styles.leaderboardRank, { fontSize: responsiveSizes.bodySize }]}>#{idx + 1}</Text>
                  </View>
                  <Text style={[styles.leaderboardName, { fontSize: responsiveSizes.bodySize }]} numberOfLines={1}>{user.name}</Text>
                  <View style={styles.leaderboardPointsContainer}>
                    <Text style={[styles.leaderboardPoints, { fontSize: responsiveSizes.bodySize }]}>{user.points.toLocaleString()}</Text>
                    <Text style={[styles.leaderboardPointsLabel, { fontSize: responsiveSizes.bodySize - 2 }]}>pts</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </LinearGradient>
        </View>

        <View style={[styles.section, { 
          marginTop: responsiveSizes.sectionSpacing,
          marginBottom: responsiveSizes.sectionSpacing
        }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveSizes.titleSize }]}>🎁 EcoPoints Rewards & Marketplace</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Rewards')}>
              <Text style={[styles.seeAllText, { fontSize: responsiveSizes.bodySize }]}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            contentContainerStyle={{ paddingVertical: responsiveSizes.cardPadding / 2 }}
          >
            {featuredRewards.map((reward) => (
              <View key={reward.id} style={[styles.rewardCard, { 
                borderRadius: responsiveSizes.cardRadius,
                padding: responsiveSizes.cardPadding,
                marginRight: responsiveSizes.gridGap,
                width: isTablet ? 160 : isSmallDevice ? 120 : 140
              }]}>
                <Image 
                  source={{ uri: reward.image }} 
                  style={[styles.rewardImage, { 
                    width: responsiveSizes.largeIconSize,
                    height: responsiveSizes.largeIconSize,
                    borderRadius: responsiveSizes.cardRadius / 2,
                    marginBottom: responsiveSizes.cardPadding / 2
                  }]} 
                />
                <Text style={[styles.rewardName, { 
                  fontSize: responsiveSizes.subtitleSize,
                  marginBottom: responsiveSizes.cardPadding / 4
                }]}>{reward.name}</Text>
                <View style={styles.rewardCostContainer}>
                  <Ionicons name="leaf" size={responsiveSizes.iconSize} color="#FF3D57" />
                  <Text style={[styles.rewardCost, { 
                    fontSize: responsiveSizes.bodySize,
                    marginLeft: 4 
                  }]}>{reward.cost}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View> 

        <View style={[styles.section, { 
          marginTop: responsiveSizes.sectionSpacing,
          marginBottom: responsiveSizes.sectionSpacing
        }]}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { fontSize: responsiveSizes.titleSize }]}>🌟 Discover</Text>
            <View style={[styles.sectionTitleUnderline, { width: responsiveSizes.sectionSpacing * 2 }]} />
          </View>
          <View style={[styles.discoverGrid, { gap: responsiveSizes.gridGap }]}>
            {[
              { icon: "map-outline", text: "Find Drop-off", gradient: ["#4ECDC4", "#44A08D"], onPress: () => navigation.navigate("Map") },
              { icon: "shield-outline", text: "Safe Zones", gradient: ["#FF3D57", "#FFD700"], onPress: () => navigation.navigate("SafeZonesMap") },
              { icon: "newspaper-outline", text: "Recycling Tips", gradient: ["#FF6B35", "#F7931E"], onPress: () => navigation.navigate("Tips") },
              { icon: "business-outline", text: "Nearby Companies", gradient: ["#FF5722", "#FF8A65"], onPress: () => navigation.navigate("NearByCompanies") }
            ].map((item, index) => (
              <TouchableOpacity 
                key={index} 
                style={[styles.discoverCard, { 
                  width: isTablet ? '22%' : '47%',
                  borderRadius: responsiveSizes.cardRadius
                }]} 
                onPress={item.onPress} 
                activeOpacity={0.9} 
                accessibilityLabel={item.text}
              >
                <LinearGradient colors={["#fff", "#fafafa"]} style={[styles.discoverCardGradient, { 
                  borderRadius: responsiveSizes.cardRadius,
                  padding: responsiveSizes.cardPadding
                }]}>
                  <LinearGradient 
                    colors={item.gradient} 
                    style={[styles.discoverIconContainer, { 
                      width: responsiveSizes.largeIconSize,
                      height: responsiveSizes.largeIconSize,
                      borderRadius: responsiveSizes.largeIconSize / 2,
                      marginBottom: responsiveSizes.cardPadding / 2
                    }]}
                  >
                    <Ionicons name={item.icon} size={responsiveSizes.iconSize} color="#fff" />
                  </LinearGradient>
                  <Text style={[styles.discoverText, { fontSize: responsiveSizes.bodySize }]}>{item.text}</Text>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {quickActionsVisible && (
        <RNAnimated.View 
          style={[
            styles.quickActionsOverlay,
            { opacity: quickActionsAnim }
          ]}
        >
          <TouchableOpacity 
            style={styles.quickActionsBackground}
            onPress={toggleQuickActions}
            activeOpacity={1}
          />
        </RNAnimated.View>
      )}
      
      <RNAnimated.View 
        style={[
          styles.quickActionsContainer,
          { 
            bottom: responsiveSizes.fabSize + 40,
            right: responsiveSizes.containerPadding + 10,
            borderRadius: responsiveSizes.cardRadius,
            padding: responsiveSizes.cardPadding,
            transform: [{
              translateY: quickActionsAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [150, 0]
              })
            }],
            opacity: quickActionsAnim
          }
        ]}
      >
        {quickActionsVisible && (
          <>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.quickActionButton, { 
                  paddingVertical: responsiveSizes.cardPadding / 2,
                  paddingHorizontal: responsiveSizes.cardPadding
                }]}
                onPress={() => {
                  toggleQuickActions();
                  action.action();
                }}
                activeOpacity={0.8}
              >
                <View style={[styles.quickActionIcon, { 
                  width: responsiveSizes.largeIconSize - 4,
                  height: responsiveSizes.largeIconSize - 4,
                  borderRadius: (responsiveSizes.largeIconSize - 4) / 2,
                  marginRight: responsiveSizes.cardPadding / 2
                }]}>
                  <Ionicons name={action.icon} size={responsiveSizes.iconSize} color="#FFFFFF" />
                </View>
                <Text style={[styles.quickActionLabel, { fontSize: responsiveSizes.subtitleSize }]}>{action.label}</Text>
              </TouchableOpacity>
            ))}
          </>
        )}
      </RNAnimated.View>
        
      <TouchableOpacity 
        style={[styles.fab, { 
          bottom: responsiveSizes.containerPadding + 10,
          right: responsiveSizes.containerPadding + 10,
          width: responsiveSizes.fabSize,
          height: responsiveSizes.fabSize,
          borderRadius: responsiveSizes.fabSize / 2
        }]}
        onPress={toggleQuickActions}
        activeOpacity={0.9}
        accessibilityLabel="Quick actions"
      >
        <Ionicons 
          name={quickActionsVisible ? "close" : "menu"} 
          size={responsiveSizes.largeIconSize - 8} 
          color="#FFFFFF" 
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F5E9",
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 20,
    color: '#2E7D32', // Deep forest green for text
    fontWeight: '600',
  },
  scrollContent: {
    paddingBottom: 100,
    alignItems: 'center',
    width: '100%',
  },
  section: {
    width: '100%',
    maxWidth: 900,
    alignSelf: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontWeight: "800",
    color: "#2E7D32", 
  },
  sectionTitleUnderline: {
    height: 3,
    backgroundColor: '#4CAF50', 
    borderRadius: 2,
  },
  simpleTopNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F5F5DC', 
    paddingTop: Platform.OS === 'ios' ? 10 : StatusBar.currentHeight + 10,
    paddingBottom: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  simpleTopNavLeft: {
    flex: 1,
    flexDirection: 'column',
  },
  simpleTopNavGreeting: {
    color: '#8D6E63', 
    fontWeight: '500',
  },
  simpleTopNavUserName: {
    color: '#2E7D32', 
    fontWeight: '700',
    maxWidth: '80%',
  },
  simpleTopNavAvatarTouchable: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  simpleTopNavAvatarWrap: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9', 
  },
  simpleTopNavAvatar: {
    resizeMode: 'cover',
  },
  dailyChallengeCard: {
    width: '100%',
    overflow: 'hidden',
  },
  dailyChallengeGradient: {
    width: '100%',
  },
  dailyChallengeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dailyChallengeTitle: {
    fontWeight: '700',
    color: '#2E7D32', 
    marginBottom: 4,
  },
  dailyChallengeText: {
    color: '#8D6E63', 
    fontWeight: '500',
  },
  quickLinksRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  quickLinkButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickLinkIconWrap: {
    backgroundColor: '#F5F5DC', 
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginBottom: 8,
  },
  quickLinkLabel: {
    color: '#2E7D32', 
    fontWeight: '600',
    textAlign: 'center',
  },
  leaderboardGradient: {
    width: '100%',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9', 
  },
  leaderboardPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  leaderboardRank: {
    color: '#2E7D32', 
    fontWeight: '600',
  },
  leaderboardName: {
    flex: 1,
    color: '#8D6E63', 
    fontWeight: '500',
  },
  leaderboardPointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  leaderboardPoints: {
    color: '#4CAF50', 
    fontWeight: '700',
  },
  leaderboardPointsLabel: {
    color: '#8D6E63', 
    fontWeight: '500',
  },
  seeAllText: {
    color: '#4CAF50', 
    fontWeight: '600',
  },
  rewardCard: {
    backgroundColor: '#F5F5DC', 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    alignItems: 'center',
  },
  rewardImage: {
    resizeMode: 'contain',
  },
  rewardName: {
    color: '#2E7D32', 
    fontWeight: '600',
    textAlign: 'center',
  },
  rewardCostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rewardCost: {
    color: '#4CAF50', 
    fontWeight: '600',
  },
  discoverGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  discoverCard: {
    marginBottom: 16,
  },
  discoverCardGradient: {
    alignItems: 'center',
  },
  discoverIconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  discoverText: {
    color: '#2E7D32', 
    fontWeight: '600',
    textAlign: 'center',
  },
  quickActionsOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.3)', 
  },
  quickActionsBackground: {
    flex: 1,
  },
  quickActionsContainer: {
    position: 'absolute',
    backgroundColor: '#F5F5DC', 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  quickActionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E8F5E9', 
  },
  quickActionIcon: {
    backgroundColor: '#4CAF50', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickActionLabel: {
    color: '#2E7D32', 
    fontWeight: '600',
  },
  fab: {
    position: 'absolute',
    backgroundColor: '#4CAF50', 
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
export default HomeScreen;