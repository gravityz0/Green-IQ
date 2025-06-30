import React, { useState, useRef, useEffect } from 'react';
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
  Animated,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Animation
  const formAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(formAnim, {
      toValue: 1,
      duration: 800,
      delay: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Missing Fields', text2: 'Please fill out all fields.' });
      return;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Password Mismatch', text2: 'Passwords do not match.' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
    setIsLoading(false);
    
    Toast.show({
      type: 'success',
      text1: 'Registration Successful!',
      text2: 'Welcome to Trash_IQ. Please log in.'
    });

    setTimeout(() => navigation.navigate('Login'), 1500);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ImageBackground 
        source={require('../assets/signup.png')} 
        style={StyleSheet.absoluteFill}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
      </ImageBackground>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Account</Text>
          <Text style={styles.headerSubtitle}>Start your journey with us today</Text>
        </View>

        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardAvoidingView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <Animated.View style={[styles.formContainer, { opacity: formAnim }]}>
              <View style={styles.formContent}>
                {/* Inputs */}
                <View style={styles.inputContainer}>
                  <Ionicons name="person-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Full Name" placeholderTextColor="rgba(255,255,255,0.5)" value={fullName} onChangeText={setFullName} />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Email Address" placeholderTextColor="rgba(255,255,255,0.5)" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Password" placeholderTextColor="rgba(255,255,255,0.5)" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="rgba(255,255,255,0.7)" />
                  </TouchableOpacity>
                </View>
                <View style={styles.inputContainer}>
                  <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.7)" style={styles.inputIcon} />
                  <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="rgba(255,255,255,0.5)" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showConfirmPassword} />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color="rgba(255,255,255,0.7)" />
                  </TouchableOpacity>
                </View>
                
                {/* Sign Up Button */}
                <TouchableOpacity onPress={handleRegister} style={styles.signInButton} disabled={isLoading}>
                  <LinearGradient colors={['#4CAF50', '#45a049']} style={styles.signInGradient}>
                    {isLoading ? <ActivityIndicator color="#fff" /> : <Text style={styles.signInButtonText}>Create Account</Text>}
                  </LinearGradient>
                </TouchableOpacity>

                {/* Divider */}
                <View style={styles.dividerContainer}>
                  <View style={styles.divider} />
                  <Text style={styles.dividerText}>or sign up with</Text>
                  <View style={styles.divider} />
                </View>

                {/* Social Logins */}
                <View style={styles.socialLoginContainer}>
                  <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-google" size={24} color="#fff" /></TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-apple" size={24} color="#fff" /></TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-facebook" size={24} color="#fff" /></TouchableOpacity>
                  <TouchableOpacity style={styles.socialButton}><Ionicons name="logo-twitter" size={24} color="#fff" /></TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 77, 64, 0.6)' },
  safeArea: { flex: 1 },
  headerContainer: {
    paddingTop: Platform.OS === 'ios' ? 10 : 30,
    paddingBottom: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: { position: 'absolute', top: Platform.OS === 'ios' ? 10 : 35, left: 20, zIndex: 1 },
  headerTitle: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  headerSubtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', textAlign: 'center' },
  keyboardAvoidingView: { flex: 1 },
  scrollViewContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: 25 },
  formContainer: { width: '100%' },
  formContent: { backgroundColor: 'rgba(255,255,255,0.15)', padding: 25, borderRadius: 20 },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    height: 55,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, color: 'white', fontSize: 16 },
  signInButton: { borderRadius: 12, overflow: 'hidden', marginTop: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 5, elevation: 8 },
  signInGradient: { justifyContent: 'center', alignItems: 'center', paddingVertical: 16, minHeight: 50 },
  signInButtonText: { color: 'white', fontSize: 18, fontWeight: '600' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 25 },
  divider: { flex: 1, height: 1, backgroundColor: 'rgba(255,255,255,0.2)' },
  dividerText: { color: 'rgba(255,255,255,0.5)', marginHorizontal: 15, fontSize: 14 },
  socialLoginContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 10 },
  socialButton: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginHorizontal: 10, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
});

export default SignUpScreen;