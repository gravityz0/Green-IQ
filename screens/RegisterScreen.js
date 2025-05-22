
import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ImageBackground, 
  TouchableOpacity, 
  TextInput,
  StatusBar,
  SafeAreaView,
  ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground 
        source={require('../assets/signup.png')} 
        style={styles.backgroundImage}
        resizeMode="cover"
      >
        <SafeAreaView style={styles.safeArea}>
          <ScrollView contentContainerStyle={styles.scrollView}>
            {/* Back button */}
            <TouchableOpacity 
              style={styles.backButton} 
              onPress={() => navigation.goBack()}
            >
              {/* <Ionicons name="arrow-back" size={24} color="white" /> */}
            </TouchableOpacity>
            
            {/* Header text */}
            <View style={styles.headerTextContainer}>
              <Text style={styles.helloText}>Hello citizen</Text>
              <Text style={styles.createAccountText}>Create an account</Text>
            </View>
            
            {/* Form container */}
            <View style={styles.formContainer}>
              {/* Form fields */}
              <View style={styles.inputContainer}>
                <Ionicons name="person" size={20} color="#555" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Fullnames"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="mail" size={20} color="#555" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="key" size={20} color="#555" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Password"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#555" 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="key" size={20} color="#555" style={styles.inputIcon} />
                <TextInput 
                  style={styles.input}
                  placeholder="Confirm password"
                  secureTextEntry={!showConfirmPassword}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity 
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={styles.eyeIcon}
                >
                  <Ionicons 
                    name={showConfirmPassword ? "eye-off" : "eye"} 
                    size={20} 
                    color="#555" 
                  />
                </TouchableOpacity>
              </View>
              
              {/* Terms and conditions */}
              <View style={styles.termsContainer}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => setAcceptTerms(!acceptTerms)}
                >
                  {acceptTerms && (
                    <View style={styles.checkboxInner} />
                  )}
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  I accept the policy and terms
                </Text>
              </View>
              
              {/* Sign up button */}
              <TouchableOpacity 
                style={[
                  styles.signUpButton,
                  (!fullName || !email || !password || !confirmPassword || !acceptTerms) && 
                    styles.disabledButton
                ]}
                disabled={!fullName || !email || !password || !confirmPassword || !acceptTerms}
                onPress={() => {
                //  Navigate to the home screen
                  navigation.navigate('Home');
                }}
              >
                <Text style={styles.signUpButtonText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
  },
  headerTextContainer: {
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  helloText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  createAccountText: {
    fontSize: 20,
    color: 'white',
  },
  formContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
    padding: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 25,
    marginBottom: 15,
    paddingHorizontal: 15,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
  },
  eyeIcon: {
    padding: 10,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: '#555',
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: '#555',
  },
  termsText: {
    fontSize: 14,
    color: '#555',
  },
  signUpButton: {
    backgroundColor: '#0A5D30',
    borderRadius: 25,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  disabledButton: {
    backgroundColor: '#AEAEAE',
  },
  signUpButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignUpScreen;