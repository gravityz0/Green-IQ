import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useWindowDimensions,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation, route }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [location, setLocation] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation
  const formAnim = useRef(new Animated.Value(0)).current;
  const window = useWindowDimensions();
  const isTablet = window.width >= 700;
  const isSmallScreen = window.width < 400 || window.height < 700;
  const isLandscape = window.width > window.height;

  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    if (route?.params?.selectedLocation) {
      setLocation(route.params.selectedLocation);
    }
  }, [route?.params?.selectedLocation]);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword || !location) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill out all fields, including location.' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match.' });
      return;
    }
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    try {
      const response = await axios.post('https://trash2treasure-backend.onrender.com/register', {
        fullNames: fullName,
        email,
        password,
        userAddress: location
      });
      Toast.show({
        type: 'success',
        text1: 'Verify account',
        text2: 'Check your email to verify your account'
      });
      setTimeout(() => navigation.navigate('Login'), 1500);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: error?.response?.data?.message || 'Registration failed.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={["#43e97b", "#11998e"]}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" backgroundColor="#43e97b" />
      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={[styles.centerWrapper, isTablet && styles.centerWrapperTablet]}>
            <ScrollView
              contentContainerStyle={[
                styles.scrollViewContent,
                isLandscape && styles.landscapeContent,
                isTablet && styles.scrollViewContentTablet,
              ]}
              bounces={false}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* Catchy Headline and Subtitle */}
              <View style={styles.attractHeader}>
                <Text style={styles.attractTitle}>Join Green IQ and Make a Difference!</Text>
                <Text style={styles.attractSubtitle}>Sign up to start recycling smarter, earning rewards, and helping the planet. It only takes a minute!</Text>
              </View>
              <Animated.View
                style={[
                  styles.formContainer,
                  isLandscape && styles.formContainerLandscape,
                  isSmallScreen && styles.formContainerSmall,
                  isTablet && styles.formContainerTablet,
                  {
                    opacity: formAnim,
                    transform: [
                      {
                        translateY: formAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [60, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[styles.formContent, isSmallScreen && styles.formContentSmall, isTablet && styles.formContentTablet]}>
                  <Text style={[styles.headerTitle, isSmallScreen && styles.headerTitleSmall, isTablet && styles.headerTitleTablet]}>Create Account</Text>
                  <Text style={[styles.headerSubtitle, isSmallScreen && styles.headerSubtitleSmall, isTablet && styles.headerSubtitleTablet]}>Start your journey with us today</Text>
                  {/* Inputs */}
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="person-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Full Name" placeholderTextColor="#888" value={fullName} onChangeText={setFullName} />
                  </View>
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="mail-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Email Address" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  </View>
                  <TouchableOpacity onPress={() => navigation.navigate('LocationSelection')} style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="location-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <Text style={[styles.input, styles.locationText, !location && styles.placeholderText, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}>{location || 'Select Your Location'}</Text>
                    <Ionicons name="chevron-forward" size={isTablet ? 28 : 22} color="#11998e" />
                  </TouchableOpacity>
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="lock-closed-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Password" placeholderTextColor="#888" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeButton}>
                      <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="lock-closed-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Confirm Password" placeholderTextColor="#888" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeButton}>
                      <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" />
                    </TouchableOpacity>
                  </View>
                  {/* Sign Up Button */}
                  <TouchableOpacity onPress={handleRegister} style={[styles.signInButton, isSmallScreen && styles.signInButtonSmall, isTablet && styles.signInButtonTablet]} disabled={isLoading} activeOpacity={0.85}>
                    <LinearGradient colors={['#43e97b', '#11998e']} style={[styles.signInGradient, isSmallScreen && styles.signInGradientSmall, isTablet && styles.signInGradientTablet]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
                      {isLoading ? <ActivityIndicator color="#fff" /> : (
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                          <Text style={[styles.signInButtonText, isSmallScreen && styles.signInButtonTextSmall, isTablet && styles.signInButtonTextTablet]}>Sign Up</Text>
                          <Ionicons name="arrow-forward-circle" size={isTablet ? 28 : 22} color="#fff" style={{ marginLeft: 8 }} />
                        </View>
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                  {/* Divider */}
                  <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={[styles.dividerText, isSmallScreen && styles.dividerTextSmall, isTablet && styles.dividerTextTablet]}>or sign up with</Text>
                    <View style={styles.divider} />
                  </View>
                  {/* Social Logins */}
                  <View style={[styles.socialLoginContainer, isSmallScreen && styles.socialLoginContainerSmall, isTablet && styles.socialLoginContainerTablet]}>
                    {[
                      { name: 'logo-google', color: '#ea4335' },
                      { name: 'logo-apple', color: '#000' },
                      { name: 'logo-facebook', color: '#1877f2' },
                      { name: 'logo-github', color: '#333' },
                    ].map((social, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[styles.socialButton, isSmallScreen && styles.socialButtonSmall, isTablet && styles.socialButtonTablet]}
                        activeOpacity={0.7}
                      >
                        <Ionicons
                          name={social.name}
                          size={isTablet ? 28 : isSmallScreen ? 20 : 22}
                          color={social.color}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                  {/* Sign In Link */}
                  <View style={styles.signInContainer}>
                    <Text style={[styles.signInText, isSmallScreen && styles.signInTextSmall, isTablet && styles.signInTextTablet]}>Already have an account?{' '}</Text>
                    <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => navigation.navigate('Login')}>
                      <Text style={[styles.signInLink, isSmallScreen && styles.signInLinkSmall, isTablet && styles.signInLinkTablet]}>Sign In</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Toast />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  centerWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrapperTablet: {
    minHeight: height * 0.9,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  scrollViewContentTablet: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  landscapeContent: {
    paddingHorizontal: 40,
  },
  formContainer: {
    width: '90%',
    maxWidth: 600,
    minWidth: 320,
    alignSelf: 'center',
    marginVertical: 32,
  },
  formContainerLandscape: {
    maxWidth: 700,
  },
  formContainerSmall: {
    maxWidth: 350,
  },
  formContainerTablet: {
    maxWidth: 700,
    minWidth: 400,
  },
  formContent: {
    backgroundColor: '#fff',
    paddingVertical: 36,
    paddingHorizontal: 32,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.13,
    shadowRadius: 24,
    elevation: 10,
  },
  formContentSmall: {
    padding: 16,
    borderRadius: 14,
  },
  formContentTablet: {
    paddingVertical: 48,
    paddingHorizontal: 48,
    borderRadius: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
    textAlign: 'center',
  },
  headerTitleSmall: {
    fontSize: 22,
  },
  headerTitleTablet: {
    fontSize: 40,
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#11998e',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    fontWeight: '500',
    marginBottom: 18,
  },
  headerSubtitleSmall: {
    fontSize: 13,
    paddingHorizontal: 30,
  },
  headerSubtitleTablet: {
    fontSize: 20,
    paddingHorizontal: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 12,
    borderWidth: 1.2,
    borderColor: '#e0e0e0',
    height: 48,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  inputContainerSmall: {
    height: 42,
    borderRadius: 10,
    marginBottom: 12,
  },
  inputContainerTablet: {
    height: 60,
    borderRadius: 18,
    marginBottom: 28,
    paddingHorizontal: 18,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#222',
    fontSize: 15,
  },
  inputSmall: {
    fontSize: 13,
  },
  inputTablet: {
    fontSize: 20,
  },
  locationText: {
    paddingVertical: 12,
    color: '#222',
  },
  placeholderText: {
    color: '#888',
  },
  eyeButton: {
    padding: 6,
    marginLeft: 4,
  },
  signInButton: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#11998e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  signInButtonSmall: {
    borderRadius: 14,
    marginBottom: 16,
  },
  signInButtonTablet: {
    borderRadius: 32,
    marginBottom: 32,
  },
  signInGradient: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 24,
  },
  signInGradientSmall: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 14,
  },
  signInGradientTablet: {
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderRadius: 32,
  },
  signInButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  signInButtonTextSmall: {
    fontSize: 14,
  },
  signInButtonTextTablet: {
    fontSize: 22,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 18,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  dividerText: {
    color: '#888',
    marginHorizontal: 12,
    fontSize: 13,
    fontWeight: '500',
  },
  dividerTextSmall: {
    fontSize: 12,
    marginHorizontal: 8,
  },
  dividerTextTablet: {
    fontSize: 16,
    marginHorizontal: 18,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 18,
    gap: 12,
  },
  socialLoginContainerSmall: {
    gap: 8,
  },
  socialLoginContainerTablet: {
    gap: 20,
    marginBottom: 28,
  },
  socialButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  socialButtonSmall: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  socialButtonTablet: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 2,
  },
  signInText: {
    color: '#888',
    fontSize: 13,
  },
  signInTextSmall: {
    fontSize: 12,
  },
  signInTextTablet: {
    fontSize: 16,
  },
  signInLink: {
    color: '#2563eb',
    fontSize: 13,
    fontWeight: '700',
    marginLeft: 2,
  },
  signInLinkSmall: {
    fontSize: 12,
  },
  signInLinkTablet: {
    fontSize: 16,
  },
  attractHeader: {
    alignItems: 'center',
    marginBottom: 18,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  attractTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 6,
    letterSpacing: 1.2,
  },
  attractSubtitle: {
    color: '#e0f2f1',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 2,
    fontWeight: '500',
    lineHeight: 22,
  },
});

export default RegisterScreen;