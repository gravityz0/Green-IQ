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
  ActivityIndicator,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const RegisterScreen = ({ navigation, route }) => {
  // Initialize state with route params if they exist
  const [userType, setUserType] = useState(route?.params?.userType || 'citizen');
  const [fullName, setFullName] = useState(route?.params?.fullName || '');
  const [companyName, setCompanyName] = useState(route?.params?.companyName || '');
  const [email, setEmail] = useState(route?.params?.email || '');
  const [phoneNumber, setPhoneNumber] = useState(route?.params?.phoneNumber || '+250');
  const [referralCode, setReferralCode] = useState(route?.params?.referralCode || '');
  const [password, setPassword] = useState(route?.params?.password || '');
  const [confirmPassword, setConfirmPassword] = useState(route?.params?.confirmPassword || '');
  const [location, setLocation] = useState(route?.params?.location || '');
  const [companyLocation, setCompanyLocation] = useState(route?.params?.companyLocation || '');
  const [companyContact, setCompanyContact] = useState(route?.params?.companyContact || '');
  const [wasteTypes, setWasteTypes] = useState(route?.params?.wasteTypes || []);
  const [selectedWasteType, setSelectedWasteType] = useState(route?.params?.selectedWasteType || '');
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

  // Handle location selection from LocationSelectionScreen
  useEffect(() => {
    if (route?.params?.selectedLocation) {
      if (userType === 'citizen') {
        // For citizens: selectedLocation is just a string (location name)
        setLocation(route.params.selectedLocation);
      } else {
        // For companies: selectedLocation is a JSON object with coordinates and details
        setCompanyLocation(route.params.selectedLocation);
      }
    }
  }, [route?.params?.selectedLocation, userType]);

  // Handle form state restoration from route params
  useEffect(() => {
    if (route?.params) {
      const params = route.params;
      if (params.userType) setUserType(params.userType);
      if (params.fullName) setFullName(params.fullName);
      if (params.companyName) setCompanyName(params.companyName);
      if (params.email) setEmail(params.email);
      if (params.phoneNumber) setPhoneNumber(params.phoneNumber);
      if (params.referralCode) setReferralCode(params.referralCode);
      if (params.password) setPassword(params.password);
      if (params.confirmPassword) setConfirmPassword(params.confirmPassword);
      if (params.location) setLocation(params.location);
      if (params.companyLocation) setCompanyLocation(params.companyLocation);
      if (params.companyContact) setCompanyContact(params.companyContact);
      if (params.wasteTypes) setWasteTypes(params.wasteTypes);
      if (params.selectedWasteType) setSelectedWasteType(params.selectedWasteType);
    }
  }, [route?.params]);

  // Use focus effect to restore form state when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      if (route?.params) {
        const params = route.params;
        if (params.userType) setUserType(params.userType);
        if (params.fullName) setFullName(params.fullName);
        if (params.companyName) setCompanyName(params.companyName);
        if (params.email) setEmail(params.email);
        if (params.phoneNumber) setPhoneNumber(params.phoneNumber);
        if (params.referralCode) setReferralCode(params.referralCode);
        if (params.password) setPassword(params.password);
        if (params.confirmPassword) setConfirmPassword(params.confirmPassword);
        if (params.location) setLocation(params.location);
        if (params.companyLocation) setCompanyLocation(params.companyLocation);
        if (params.companyContact) setCompanyContact(params.companyContact);
        if (params.wasteTypes) setWasteTypes(params.wasteTypes);
        if (params.selectedWasteType) setSelectedWasteType(params.selectedWasteType);
      }
    }, [route?.params])
  );

  const validatePhoneNumber = (phone) => {
    // Basic validation for Rwandan phone numbers
    const phoneRegex = /^\+250[0-9]{8}$/;
    return phoneRegex.test(phone);
  };

  // Function to get display text for company location
  const getCompanyLocationDisplay = () => {
    if (!companyLocation) return 'Select Collection Point Location';
    
    // If companyLocation is a string (old format), return as is
    if (typeof companyLocation === 'string') {
      return companyLocation;
    }
    
    // If companyLocation is an object (new JSON format), return formatted text
    if (typeof companyLocation === 'object' && companyLocation.name) {
      return `${companyLocation.name} (${companyLocation.coordinates.latitude.toFixed(4)}, ${companyLocation.coordinates.longitude.toFixed(4)})`;
    }
    
    return 'Select Collection Point Location';
  };

  // Function to navigate to location selection with current form state
  const navigateToLocationSelection = () => {
    const currentFormState = {
      userType,
      fullName,
      companyName,
      email,
      phoneNumber,
      referralCode,
      password,
      confirmPassword,
      location,
      companyLocation,
      companyContact,
      wasteTypes,
      selectedWasteType
    };
    
    navigation.navigate('LocationSelection', currentFormState);
  };

  const handleRegister = async () => {
    // Validate required fields based on user type
    if (userType === 'citizen') {
      if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !location) {
        Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill out all fields for citizen registration.' });
        return;
      }
    } else {
      if (!companyName || !email || !phoneNumber || !password || !confirmPassword || !companyLocation || !companyContact || wasteTypes.length === 0) {
        Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill out all fields for company registration, including waste types.' });
        return;
      }
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match.' });
      return;
    }

    if (!validatePhoneNumber(phoneNumber)) {
      Toast.show({ type: 'error', text1: 'Invalid Phone Number', text2: 'Please enter a valid Rwandan phone number (+250XXXXXXXX).' });
      return;
    }

    setIsLoading(true);
    try {
      if (userType === "citizen") {
        console.log(location)
        const response = await axios.post(
          "https://trash2treasure-backend.onrender.com/register",
          {
            email,
            fullNames: fullName,
            password,
            userAddress: location,
            phoneNumber,
            userType,
            referralUsed: referralCode,
            location: companyLocation.sector
          }
        );
        Toast.show({
          type: "success",
          text1: "Account Created",
          text2: "Check your email to verify your account"
        });
        setTimeout(() => navigation.navigate("Login"), 1500);
      } else {
        // Prepare company location data
        let addressPayload;
        if (typeof companyLocation === 'object' && companyLocation.coordinates) {
          // New JSON format with coordinates
          const mapCoordinates = [companyLocation.coordinates.longitude, companyLocation.coordinates.latitude]
         addressPayload= {
          companyAddress :{
            district: companyLocation.district,
            sector: companyLocation.sector,
            location:{
              type: "Point",
              coordinates: mapCoordinates
            }
          }
          }
        } else {
          // Fallback for string format (backward compatibility)
          addressPayload = companyLocation;
          console.log('Sending company location as string:', addressPayload);
        }
        const response = await axios.post(
          "https://trash2treasure-backend.onrender.com/registerCompany",
          {
            companyName,
            email,
            phoneNumber,
            companyAddress: addressPayload.companyAddress,
            contactPersonalName: companyContact,
            password,
            wasteTypeHandled: wasteTypes,
          }
        );
        Toast.show({
          type: "success",
          text1: "Account Created",
          text2: "Company account created successfully",
        });
        setTimeout(() => navigation.navigate("Login"), 1500);
      }        
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: 'Registration failed',
        text2: error?.response?.data?.message || 'Registration failed.'
      });

      console.log(error?.response?.data?.message)
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
                  
                  {/* User Type Selection */}
                  <View style={styles.userTypeContainer}>
                    <TouchableOpacity 
                      style={[styles.userTypeButton, userType === 'citizen' && styles.userTypeButtonActive]} 
                      onPress={() => setUserType('citizen')}
                    >
                      <Ionicons name="person" size={isTablet ? 24 : 20} color={userType === 'citizen' ? '#fff' : '#11998e'} />
                      <Text style={[styles.userTypeText, userType === 'citizen' && styles.userTypeTextActive]}>Citizen</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={[styles.userTypeButton, userType === 'company' && styles.userTypeButtonActive]} 
                      onPress={() => setUserType('company')}
                    >
                      <Ionicons name="business" size={isTablet ? 24 : 20} color={userType === 'company' ? '#fff' : '#11998e'} />
                      <Text style={[styles.userTypeText, userType === 'company' && styles.userTypeTextActive]}>Company</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Inputs */}
                  {userType === 'citizen' ? (
                    <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                      <Ionicons name="person-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                      <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Full Name" placeholderTextColor="#888" value={fullName} onChangeText={setFullName} />
                    </View>
                  ) : (
                    <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                      <Ionicons name="business-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                      <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Company Name" placeholderTextColor="#888" value={companyName} onChangeText={setCompanyName} />
                    </View>
                  )}
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="mail-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <TextInput style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} placeholder="Email Address" placeholderTextColor="#888" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                  </View>
                  
                  {/* Phone Number Field */}
                  <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                    <Ionicons name="call-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                    <TextInput 
                      style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} 
                      placeholder="Phone Number" 
                      placeholderTextColor="#888" 
                      value={phoneNumber} 
                      onChangeText={setPhoneNumber} 
                      keyboardType="phone-pad"
                    />
                  </View>

                  {/* Referral Code Field (Citizens Only) */}
                  {userType === 'citizen' && (
                    <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                      <Ionicons name="gift-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                      <TextInput 
                        style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} 
                        placeholder="Referral Code (Optional)" 
                        placeholderTextColor="#888" 
                        value={referralCode} 
                        onChangeText={setReferralCode} 
                        autoCapitalize="characters"
                      />
                    </View>
                  )}

                  {/* Location/Address Fields */}
                  {userType === 'citizen' ? (
                    <TouchableOpacity onPress={navigateToLocationSelection} style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                      <Ionicons name="location-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                      <Text style={[styles.input, styles.locationText, !location && styles.placeholderText, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}>{location || 'Select Your Location'}</Text>
                      <Ionicons name="chevron-forward" size={isTablet ? 28 : 22} color="#11998e" />
                    </TouchableOpacity>
                  ) : (
                    <>
                        <TouchableOpacity onPress={navigateToLocationSelection} style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                          <Ionicons name="location-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                          <Text style={[styles.input, styles.locationText, !companyLocation && styles.placeholderText, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]}>{getCompanyLocationDisplay()}</Text>
                          {typeof companyLocation === 'object' && companyLocation.coordinates && (
                            <View style={styles.coordinatesIndicator}>
                              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                            </View>
                          )}
                          <Ionicons name="chevron-forward" size={isTablet ? 28 : 22} color="#11998e" />
                        </TouchableOpacity>
                      
                      <View style={[styles.inputContainer, isSmallScreen && styles.inputContainerSmall, isTablet && styles.inputContainerTablet]}>
                        <Ionicons name="person-outline" size={isTablet ? 28 : isSmallScreen ? 20 : 22} color="#11998e" style={styles.inputIcon} />
                        <TextInput 
                          style={[styles.input, isSmallScreen && styles.inputSmall, isTablet && styles.inputTablet]} 
                          placeholder="Contact Person Name" 
                          placeholderTextColor="#888" 
                          value={companyContact} 
                          onChangeText={setCompanyContact} 
                        />
                      </View>
                      
                      {/* Waste Types Selection */}
                      <View style={styles.wasteTypesContainer}>
                        <Text style={styles.wasteTypesTitle}>Waste Types You Collect:</Text>
                        <View style={styles.wasteTypesGrid}>
                          {['Biodegradable', 'Non biodegradable', 'Recyclable', 'Hazardous',"Organic","Inorganic"].map((type) => (
                            <TouchableOpacity
                              key={type}
                              style={[
                                styles.wasteTypeButton,
                                wasteTypes.includes(type) && styles.wasteTypeButtonActive
                              ]}
                              onPress={() => {
                                if (wasteTypes.includes(type)) {
                                  setWasteTypes(wasteTypes.filter(t => t !== type));
                                } else {
                                  setWasteTypes([...wasteTypes, type]);
                                }
                              }}
                            >
                              <Text style={[
                                styles.wasteTypeText,
                                wasteTypes.includes(type) && styles.wasteTypeTextActive
                              ]}>
                                {type}
                              </Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    </>
                  )}
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
                    
                    <View style={styles.divider} />
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
  userTypeContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  userTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#11998e',
    backgroundColor: '#fff',
  },
  userTypeButtonActive: {
    backgroundColor: '#11998e',
  },
  userTypeText: {
    marginLeft: 8,
    fontSize: 15,
    fontWeight: '600',
    color: '#11998e',
  },
  userTypeTextActive: {
    color: '#fff',
  },
  wasteTypesContainer: {
    marginBottom: 20,
  },
  wasteTypesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  wasteTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  wasteTypeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#11998e',
    backgroundColor: '#fff',
  },
  wasteTypeButtonActive: {
    backgroundColor: '#11998e',
  },
  wasteTypeText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#11998e',
  },
  wasteTypeTextActive: {
    color: '#fff',
  },
  coordinatesIndicator: {
    position: 'absolute',
    right: 10,
    top: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 4,
    borderWidth: 1,
    borderColor: '#4CAF50',
  },
});

export default RegisterScreen;