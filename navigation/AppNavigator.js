import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CollectionPoints from '../screens/CollectionPoints';
import Achievements from '../screens/Achievements';
import { Text, View } from 'react-native';

const Stack = createStackNavigator();

// Placeholder Challenges screen
function ChallengesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Challenges Screen (Placeholder)</Text>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Login">
      <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen 
        name="CollectionPoints" 
        component={CollectionPoints} 
        options={{ 
          title: 'Rwanda Collection Points',
          headerStyle: {
            backgroundColor: '#4CAF50',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      <Stack.Screen name="Challenges" component={ChallengesScreen} options={{ title: 'Challenges' }} />
      <Stack.Screen name="Achievements" component={Achievements} options={{ title: 'Achievements', headerShown: false }} />
    </Stack.Navigator>
  );
}