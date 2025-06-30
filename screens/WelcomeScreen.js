import React, { useRef, useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  Image,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

const features = [
  {
    title: 'AI-Powered Sorting',
    desc: 'Scan items instantly with AI to know exactly how to dispose of them.',
    icon: 'scan-outline',
    gradient: ['#4facfe', '#00f2fe'],
  },
  {
    title: 'Smart Notifications',
    desc: 'Get reminders for collection days and recycling tips.',
    icon: 'notifications-outline',
    gradient: ['#43e97b', '#38f9d7'],
  },
  {
    title: 'Community Impact',
    desc: 'Join thousands making a difference in their neighborhoods.',
    icon: 'people-outline',
    gradient: ['#fa709a', '#fee140'],
  },
  {
    title: 'Eco Rewards',
    desc: 'Earn points and unlock rewards for sustainable actions.',
    icon: 'gift-outline',
    gradient: ['#a8edea', '#fed6e3'],
  },
  {
    title: 'Find Collection Points',
    desc: 'Locate the nearest recycling centers with real-time data.',
    icon: 'location-outline',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    title: 'Track Your Impact',
    desc: 'Visualize your environmental contribution with detailed analytics.',
    icon: 'analytics-outline',
    gradient: ['#f093fb', '#f5576c'],
  },
];

const testimonials = [
  {
    text: "Trash IQ changed how I think about waste. It's so easy to use!",
    author: "Sarah M.",
    rating: 5,
  },
  {
    text: "Finally, an app that makes recycling fun and rewarding.",
    author: "Mike J.",
    rating: 5,
  },
  {
    text: "The AI sorting feature is incredible. No more guessing!",
    author: "Emma K.",
    rating: 5,
  },
];

const WelcomeScreen = ({ navigation }) => {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  
  // Animations
  const logoAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(0)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const parallaxAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const featuresAnim = useRef(new Animated.Value(0)).current;
  
  // Floating animation for logo
  useEffect(() => {
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    floating.start();
  }, []);

  // Entrance animations
  useEffect(() => {
    const sequence = Animated.sequence([
      Animated.timing(logoAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(textAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(featuresAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]);
    sequence.start();
  }, []);

  // Auto-scroll testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Parallax effect
  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    parallaxAnim.setValue(offsetY);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Ionicons
        key={i}
        name={i < rating ? 'star' : 'star-outline'}
        size={14}
        color="#FFD700"
        style={{ marginRight: 2 }}
      />
    ));
  };

  return (
    <View style={styles.container}>
      {/* Status Bar with proper configuration */}
      <StatusBar 
        barStyle="light-content" 
        translucent={true} 
        backgroundColor="transparent" 
      />
      
      {/* Fixed background image */}
      <ImageBackground
        source={require('../assets/home.png')}
        style={styles.fixedBackground}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(34,139,34,0.2)', 'rgba(0,100,0,0.4)', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFill}
        />
      </ImageBackground>
      
      {/* Safe Area View wrapping everything */}
      <SafeAreaView style={styles.safeArea}>
        {/* Status bar spacer for Android */}
        {Platform.OS === 'android' && <View style={styles.statusBarSpacer} />}
        
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          bounces={true} // Enable bounces for iOS
          overScrollMode="always" // Android equivalent
        >
          <View style={styles.contentContainer}>
            {/* Header Section */}
            <View style={styles.headerSection}>
              {/* Animated Logo with floating effect */}
              <Animated.View
                style={[
                  styles.logoContainer,
                  {
                    opacity: logoAnim,
                    transform: [
                      { scale: logoAnim },
                      {
                        translateY: floatingAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, -10],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={styles.logoWrapper}>
                  <Image
                    source={require('../assets/Trash_Iq 1.png')}
                    style={styles.logo}
                    resizeMode="contain"
                  />
                  <View style={styles.logoGlow} />
                </View>
              </Animated.View>

              {/* Animated Welcome Text */}
              <Animated.View
                style={[
                  styles.welcomeTextContainer,
                  {
                    opacity: textAnim,
                    transform: [
                      {
                        translateY: textAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [50, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Text style={styles.welcomeTitle}>Welcome to Trash IQ!</Text>
                <Text style={styles.welcomeSubtitle}>
                  Transform your waste habits with AI-powered insights
                </Text>
                <View style={styles.badge}>
                  <Ionicons name="leaf" size={16} color="#4CAF50" />
                  <Text style={styles.badgeText}>Eco-Friendly • Smart • Rewarding</Text>
                </View>
              </Animated.View>
            </View>

            {/* Features Carousel */}
            <Animated.View
              style={[
                styles.featuresSection,
                {
                  opacity: featuresAnim,
                  transform: [
                    {
                      translateY: featuresAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <Text style={styles.sectionTitle}>Powerful Features</Text>
              <ScrollView
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / (width - 40));
                  setCurrentFeature(index);
                }}
                style={styles.carousel}
              >
                {features.map((feature, idx) => (
                  <View key={idx} style={styles.featureCard}>
                    <BlurView intensity={20} style={styles.featureCardBlur}>
                      <LinearGradient
                        colors={[...feature.gradient, 'transparent']}
                        style={styles.featureGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      />
                      <View style={styles.featureContent}>
                        <View style={styles.featureIconContainer}>
                          <Ionicons name={feature.icon} size={32} color="#fff" />
                        </View>
                        <Text style={styles.featureTitle}>{feature.title}</Text>
                        <Text style={styles.featureDesc}>{feature.desc}</Text>
                      </View>
                    </BlurView>
                  </View>
                ))}
              </ScrollView>
              
              {/* Feature indicators */}
              <View style={styles.indicators}>
                {features.map((_, idx) => (
                  <View
                    key={idx}
                    style={[
                      styles.indicator,
                      idx === currentFeature && styles.activeIndicator,
                    ]}
                  />
                ))}
              </View>
            </Animated.View>

            {/* Testimonials Section */}
            <View style={styles.testimonialsSection}>
              <Text style={styles.sectionTitle}>What Users Say</Text>
              <View style={styles.testimonialCard}>
                <BlurView intensity={30} style={styles.testimonialBlur}>
                  <View style={styles.testimonialContent}>
                    <View style={styles.starsContainer}>
                      {renderStars(testimonials[currentTestimonial].rating)}
                    </View>
                    <Text style={styles.testimonialText}>
                      "{testimonials[currentTestimonial].text}"
                    </Text>
                    <Text style={styles.testimonialAuthor}>
                      — {testimonials[currentTestimonial].author}
                    </Text>
                  </View>
                </BlurView>
              </View>
            </View>

            {/* Stats Section */}
            <View style={styles.statsSection}>
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>50K+</Text>
                  <Text style={styles.statLabel}>Active Users</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>1M+</Text>
                  <Text style={styles.statLabel}>Items Sorted</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statNumber}>500+</Text>
                  <Text style={styles.statLabel}>Tons Recycled</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <Animated.View
              style={[
                styles.buttonContainer,
                {
                  opacity: buttonsAnim,
                  transform: [
                    {
                      translateY: buttonsAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [100, 0],
                      }),
                    },
                  ],
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.primaryButton}
                onPress={() => navigation.navigate('Signup')}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.buttonGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Ionicons name="rocket-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.primaryButtonText}>Get Started Free</Text>
                </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.secondaryButton}
                onPress={() => navigation.navigate('Login')}
              >
                <BlurView intensity={30} style={styles.secondaryButtonBlur}>
                  <Ionicons name="log-in-outline" size={20} color="#fff" style={styles.buttonIcon} />
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </BlurView>
              </TouchableOpacity>

              <TouchableOpacity style={styles.skipButton}>
                <Text style={styles.skipButtonText}>Skip for now</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  fixedBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  statusBarSpacer: {
    height: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    backgroundColor: 'transparent',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 20 : 10, // Reduced padding since SafeAreaView handles it
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    paddingTop: 20, // Additional top padding for content
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logoWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 100,
    height: 100,
    zIndex: 2,
  },
  logoGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(76, 175, 80, 0.3)',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 10,
  },
  welcomeTextContainer: {
    alignItems: 'center',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 22,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  badgeText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },

  // Features Section
  featuresSection: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
  },
  carousel: {
    marginBottom: 15,
  },
  featureCard: {
    width: width - 40,
    height: 200,
    marginHorizontal: 5,
    borderRadius: 20,
    overflow: 'hidden',
  },
  featureCardBlur: {
    flex: 1,
    borderRadius: 20,
  },
  featureGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
  },
  featureContent: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },
  featureTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 10,
  },
  featureDesc: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  indicators: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.3)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: '#4CAF50',
    width: 20,
  },

  // Testimonials
  testimonialsSection: {
    marginBottom: 30,
  },
  testimonialCard: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  testimonialBlur: {
    padding: 20,
  },
  testimonialContent: {
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  testimonialText: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 10,
    lineHeight: 22,
  },
  testimonialAuthor: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
    fontWeight: '500',
  },

  // Stats Section
  statsSection: {
    marginBottom: 40,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#4CAF50',
    fontSize: 24,
    fontWeight: '800',
    marginBottom: 5,
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
  },

  // Buttons
  buttonContainer: {
    paddingBottom: 40,
  },
  primaryButton: {
    marginBottom: 15,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  primaryButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  secondaryButton: {
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  secondaryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 10,
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 15,
  },
  skipButtonText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default WelcomeScreen;