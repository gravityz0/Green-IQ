import axios from 'axios';
import React, { useState, useRef, useEffect } from 'react';
import {BACKEND_URL} from '../config'
import { 
  StyleSheet, 
  View, 
  Text, 
  ImageBackground, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Alert,
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const formAnim = useRef(new Animated.Value(100)).current;
  const buttonScale = useRef(new Animated.Value(1)).current;
  const floatingAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(formAnim, {
        toValue: 0,
        duration: 1000,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();

    // Floating animation for decorative elements
    const floating = Animated.loop(
      Animated.sequence([
        Animated.timing(floatingAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(floatingAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    );
    floating.start();
  }, []);

  // Calculate form completion progress
  useEffect(() => {
    const fields = [fullName, email, password, confirmPassword];
    const filledFields = fields.filter(field => field.length > 0).length;
    const progress = (filledFields / fields.length) + (acceptTerms ? 0.2 : 0);
    
    Animated.timing(progressAnim, {
      toValue: Math.min(progress, 1),
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [fullName, email, password, confirmPassword, acceptTerms]);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'The passwords you entered do not match.'
      });
      return;
    } else {
      // Mock registration logic (no backend call)
      setEmail('');
      setFullName('');
      setConfirmPassword('');
      setPassword('');
      Toast.show({
        type: 'success',
        text1: 'Registration Successful!',
        text2: 'You can now log in with your new account.'
      });
      // Optional: navigate to login screen after a short delay
      setTimeout(() => navigation.navigate('Login'), 1500);
    }
  };

  const isFormValid = fullName && email && password && confirmPassword && acceptTerms;

  const renderInputField = (
    icon, 
    placeholder, 
    value, 
    onChangeText, 
    secureTextEntry = false, 
    showPasswordToggle = false,
    showPassword = false,
    onTogglePassword = null,
    keyboardType = 'default'
  ) => (
    <Animated.View style={[styles.inputContainer, { opacity: fadeAnim }]}>
      <BlurView intensity={10} style={styles.inputBlur}>
        <View style={styles.inputContent}>
          <View style={styles.iconContainer}>
            <Ionicons name={icon} size={20} color="#4CAF50" />
          </View>
          <TextInput 
            style={styles.input}
            placeholder={placeholder}
            placeholderTextColor="rgba(0,0,0,0.5)"
            value={value}
            onChangeText={onChangeText}
            secureTextEntry={secureTextEntry}
            keyboardType={keyboardType}
          />
          {showPasswordToggle && (
            <TouchableOpacity 
              onPress={onTogglePassword}
              style={styles.eyeIconContainer}
            >
              <Ionicons 
                name={showPassword ? "eye-off" : "eye"} 
                size={20} 
                color="#666" 
              />
            </TouchableOpacity>
          )}
        </View>
      </BlurView>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      {/* Background with overlay */}
      <ImageBackground 
        source={require('../assets/signup.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <LinearGradient
          colors={['rgba(0,0,0,0.4)', 'rgba(76,175,80,0.2)', 'rgba(0,0,0,0.6)']}
          style={StyleSheet.absoluteFill}
        />
        
        {/* Floating decorative elements */}
        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement1,
            {
              transform: [{
                translateY: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, -20],
                })
              }]
            }
          ]}
        />
        <Animated.View 
          style={[
            styles.floatingElement,
            styles.floatingElement2,
            {
              transform: [{
                translateY: floatingAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 15],
                })
              }]
            }
          ]}
        />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoid}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollView}
            showsVerticalScrollIndicator={false}
            bounces={true}
          >
            {/* Back button */}
            <Animated.View 
              style={[
                styles.backButtonContainer,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <TouchableOpacity 
                style={styles.backButton} 
                onPress={() => navigation.goBack()}
              >
                <BlurView intensity={20} style={styles.backButtonBlur}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </BlurView>
              </TouchableOpacity>
            </Animated.View>
            
            {/* Header section */}
            <Animated.View 
              style={[
                styles.headerSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <View style={styles.headerContent}>
                <Text style={styles.helloText}>Hello Citizen</Text>
                <Text style={styles.createAccountText}>Create your account</Text>
                <View style={styles.subtitleContainer}>
                  <Ionicons name="leaf" size={16} color="#4CAF50" />
                  <Text style={styles.subtitleText}>Join the eco-friendly community</Text>
                </View>
              </View>
            </Animated.View>
            
            {/* Progress indicator */}
            <Animated.View style={[styles.progressContainer, { opacity: fadeAnim }]}>
              <View style={styles.progressBackground}>
                <Animated.View 
                  style={[
                    styles.progressBar,
                    {
                      width: progressAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0%', '100%'],
                      })
                    }
                  ]}
                />
              </View>
              <Text style={styles.progressText}>Complete your profile</Text>
            </Animated.View>
            
            {/* Form container */}
            <Animated.View 
              style={[
                styles.formContainer,
                {
                  transform: [{ translateY: formAnim }]
                }
              ]}
            >
              <BlurView intensity={30} style={styles.formBlur}>
                <View style={styles.formContent}>
                  <Text style={styles.formTitle}>Account Details</Text>
                  
                  {/* Form fields */}
                  {renderInputField(
                    'person-outline',
                    'Full Name',
                    fullName,
                    setFullName
                  )}
                  
                  {renderInputField(
                    'mail-outline',
                    'Email Address',
                    email,
                    setEmail,
                    false,
                    false,
                    false,
                    null,
                    'email-address'
                  )}
                  
                  {renderInputField(
                    'lock-closed-outline',
                    'Password',
                    password,
                    setPassword,
                    !showPassword,
                    true,
                    showPassword,
                    () => setShowPassword(!showPassword)
                  )}
                  
                  {renderInputField(
                    'lock-closed-outline',
                    'Confirm Password',
                    confirmPassword,
                    setConfirmPassword,
                    !showConfirmPassword,
                    true,
                    showConfirmPassword,
                    () => setShowConfirmPassword(!showConfirmPassword)
                  )}
                  
                  {/* Terms and conditions */}
                  <Animated.View style={[styles.termsContainer, { opacity: fadeAnim }]}>
                    <TouchableOpacity 
                      style={styles.checkboxContainer}
                      onPress={() => setAcceptTerms(!acceptTerms)}
                    >
                      <View style={[styles.checkbox, acceptTerms && styles.checkboxActive]}>
                        {acceptTerms && (
                          <Ionicons name="checkmark" size={14} color="white" />
                        )}
                      </View>
                      <Text style={styles.termsText}>
                        I accept the{' '}
                        <Text style={styles.termsLink}>Terms & Conditions</Text>
                        {' '}and{' '}
                        <Text style={styles.termsLink}>Privacy Policy</Text>
                      </Text>
                    </TouchableOpacity>
                  </Animated.View>
                  
                  {/* Sign up button */}
                  <Animated.View 
                    style={[
                      styles.buttonContainer,
                      { transform: [{ scale: buttonScale }] }
                    ]}
                  >
                    <TouchableOpacity 
                      style={[
                        styles.signUpButton,
                        !isFormValid && styles.disabledButton
                      ]}
                      disabled={!isFormValid || isLoading}
                      onPress={handleRegister}
                    >
                      <LinearGradient
                        colors={isFormValid ? ['#4CAF50', '#45a049'] : ['#AEAEAE', '#999999']}
                        style={styles.buttonGradient}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                      >
                        {isLoading ? (
                          <View style={styles.loadingContainer}>
                            <Animated.View style={styles.loadingSpinner} />
                            <Text style={styles.buttonText}>Creating Account...</Text>
                          </View>
                        ) : (
                          <>
                            <Ionicons name="person-add" size={20} color="white" style={styles.buttonIcon} />
                            <Text style={styles.buttonText}>Create Account</Text>
                          </>
                        )}
                      </LinearGradient>
                    </TouchableOpacity>
                  </Animated.View>

                  {/* Login link */}
                  <TouchableOpacity 
                    style={styles.loginLinkContainer}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.loginText}>
                      Already have an account?{' '}
                      <Text style={styles.loginLink}>Sign In</Text>
                    </Text>
                  </TouchableOpacity>
                </View>
              </BlurView>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  safeArea: {
    flex: 1,
  },
  keyboardAvoid: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 80,
  },
  
  // Floating elements
  floatingElement: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  floatingElement1: {
    top: '15%',
    right: '10%',
    width: 80,
    height: 80,
  },
  floatingElement2: {
    top: '60%',
    left: '5%',
    width: 60,
    height: 60,
  },
  
  // Back button
  backButtonContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    overflow: 'hidden',
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Header section
  headerSection: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  headerContent: {
    alignItems: 'center',
  },
  helloText: {
    fontSize: 32,
    fontWeight: '800',
    color: 'white',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  createAccountText: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 15,
  },
  subtitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  subtitleText: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginLeft: 6,
    fontWeight: '500',
  },
  
  // Progress indicator
  progressContainer: {
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  progressBackground: {
    height: 4,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
  
  // Form container
  formContainer: {
    marginHorizontal: 20,
    borderRadius: 25,
    overflow: 'hidden',
    marginBottom: 30,
  },
  formBlur: {
    backgroundColor: 'rgba(255,255,255,0.95)',
  },
  formContent: {
    padding: 25,
  },
  formTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  
  // Input fields
  inputContainer: {
    marginBottom: 16,
  },
  inputBlur: {
    borderRadius: 15,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  inputContent: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    paddingHorizontal: 15,
    height: 55,
  },
  iconContainer: {
    width: 30,
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    marginLeft: 10,
  },
  eyeIconContainer: {
    padding: 5,
  },
  
  // Terms and conditions
  termsContainer: {
    marginVertical: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#4CAF50',
  },
  termsText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  termsLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
  
  // Button
  buttonContainer: {
    marginTop: 10,
  },
  signUpButton: {
    borderRadius: 15,
    overflow: 'hidden',
    elevation: 5,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledButton: {
    elevation: 2,
    shadowOpacity: 0.1,
  },
  buttonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 30,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingSpinner: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.3)',
    borderTopColor: 'white',
    marginRight: 10,
  },
  
  // Login link
  loginLinkContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 10,
  },
  loginText: {
    fontSize: 14,
    color: '#666',
  },
  loginLink: {
    color: '#4CAF50',
    fontWeight: '600',
  },
});

export default SignUpScreen;