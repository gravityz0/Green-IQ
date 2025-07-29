import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, StyleSheet, Animated, Dimensions, StatusBar, TouchableWithoutFeedback } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const logoRotateAnim = useRef(new Animated.Value(0)).current;
  const buttonsAnim = useRef(new Animated.Value(0)).current;
  const titleSlideAnim = useRef(new Animated.Value(50)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  const particleAnims = useRef(
    Array.from({ length: 6 }, () => ({
      translateY: new Animated.Value(0),
      opacity: new Animated.Value(0.3),
      scale: new Animated.Value(1),
    }))
  ).current;

  const [loginScale] = useState(new Animated.Value(1));
  const [signupScale] = useState(new Animated.Value(1));

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotateAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(titleSlideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          delay: 300,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(buttonsAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    const pulseLoop = () => {
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(pulseLoop);
    };
    pulseLoop();

    particleAnims.forEach((particle, index) => {
      const animateParticle = () => {
        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.translateY, {
              toValue: -20,
              duration: 3000 + index * 500,
              useNativeDriver: true,
            }),
            Animated.timing(particle.translateY, {
              toValue: 0,
              duration: 3000 + index * 500,
              useNativeDriver: true,
            }),
          ])
        ).start();

        Animated.loop(
          Animated.sequence([
            Animated.timing(particle.opacity, {
              toValue: 0.6,
              duration: 2000,
              useNativeDriver: true,
            }),
            Animated.timing(particle.opacity, {
              toValue: 0.2,
              duration: 2000,
              useNativeDriver: true,
            }),
          ])
        ).start();
      };
      
      setTimeout(animateParticle, index * 800);
    });
  }, []);

  const handlePressIn = (scaleRef) => {
    Animated.spring(scaleRef, {
      toValue: 0.94,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  };

  const handlePressOut = (scaleRef, route) => {
    Animated.spring(scaleRef, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start(() => {
      if (route) navigation.navigate(route);
    });
  };

  const logoRotation = logoRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['-5deg', '0deg'],
  });

  return (
    <LinearGradient
      colors={["#0f4c3a", "#2d8a5f", "#4CAF50", "#66BB6A"]}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="#0f4c3a" />
      
      {/* Floating background particles */}
      {particleAnims.map((particle, index) => (
        <Animated.View
          key={index}
          style={[
            styles.particle,
            {
              left: `${15 + index * 15}%`,
              top: `${20 + (index % 3) * 25}%`,
              opacity: particle.opacity,
              transform: [
                { translateY: particle.translateY },
                { scale: particle.scale },
              ],
            },
          ]}
        />
      ))}

      {/* Main content container */}
      <Animated.View
        style={[
          styles.centerContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [
                { rotate: logoRotation },
                { scale: pulseAnim },
              ],
            },
          ]}
        >
          <View style={styles.logoGlow}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
        </Animated.View>
        
        <Animated.Text 
          style={[
            styles.appName,
            {
              transform: [{ translateY: titleSlideAnim }],
            },
          ]}
        >
          Green IQ
        </Animated.Text>
        
        <Animated.Text 
          style={[
            styles.tagline,
            {
              opacity: fadeAnim,
              transform: [{ translateY: titleSlideAnim }],
            },
          ]}
        >
          Sustainable Living Made Smart
        </Animated.Text>
      </Animated.View>

      {/* Enhanced buttons with better animations */}
      <Animated.View
        style={[
          styles.buttonContainer,
          {
            opacity: buttonsAnim,
            transform: [
              {
                translateY: buttonsAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [60, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableWithoutFeedback
          onPressIn={() => handlePressIn(loginScale)}
          onPressOut={() => handlePressOut(loginScale, 'Login')}
        >
          <Animated.View 
            style={[
              styles.button, 
              styles.primaryButton,
              { transform: [{ scale: loginScale }] }
            ]}
          > 
            <LinearGradient
              colors={["#00C851", "#00A843", "#007E33"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <Text style={[styles.buttonText, styles.primaryButtonText]}>
                  Login
                </Text>
                <View style={styles.buttonIcon}>
                  <Text style={styles.iconText}>→</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableWithoutFeedback>

        <TouchableWithoutFeedback
          onPressIn={() => handlePressIn(signupScale)}
          onPressOut={() => handlePressOut(signupScale, 'Register')}
        >
          <Animated.View 
            style={[
              styles.button, 
              styles.secondaryButton,
              { transform: [{ scale: signupScale }] }
            ]}
          > 
            <LinearGradient
              colors={["rgba(255,255,255,0.15)", "rgba(255,255,255,0.05)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.buttonGradient}
            >
              <View style={styles.buttonContent}>
                <Text style={[styles.buttonText, styles.secondaryButtonText]}>
                  Sign Up
                </Text>
                <View style={styles.buttonIcon}>
                  <Text style={[styles.iconText, styles.secondaryIconText]}>+</Text>
                </View>
              </View>
            </LinearGradient>
          </Animated.View>
        </TouchableWithoutFeedback>
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  particle: {
    position: 'absolute',
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 60,
  },
  logoContainer: {
    marginBottom: 25,
  },
  logoGlow: {
    borderRadius: width * 0.25,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    shadowColor: '#00C851',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
    elevation: 15,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
  },
  appName: {
    fontSize: 46,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 8,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
    letterSpacing: 1.2,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic',
  },
  buttonContainer: {
    width: '85%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  button: {
    width: '100%',
    borderRadius: 28,
    overflow: 'hidden',
    marginBottom: 20,
    elevation: 12,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  primaryButton: {
    shadowColor: '#00C851',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  secondaryButton: {
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
    borderRadius: 26,
    width: '100%',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonText: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 1.5,
    textAlign: 'center',
    flex: 1,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  secondaryButtonText: {
    color: '#FFFFFF',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  buttonIcon: {
    marginLeft: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  secondaryIconText: {
    fontSize: 18,
  },
});

export default WelcomeScreen;