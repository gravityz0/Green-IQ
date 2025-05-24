import 'react-native-url-polyfill/auto';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { AppRegistry } from 'react-native';
import WelcomeScreen from './screens/WelcomeScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/RegisterScreen';
import HomeScreen from './screens/HomeScreen';
import RwandaMap from './screens/CollectionPoints';
import Chat from './screens/Chat';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false
        }}
      >
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#fff',
            headerBackTitle: ' ',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="RwandaMap"
          component={RwandaMap}
          options={{
            headerShown: true,
            headerTitle: 'Collection Points',
            headerTintColor: '#fff',
            headerBackTitle: ' ',
            headerStyle: {
              backgroundColor: '#4a9e3b',
            },
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTintColor: '#fff',
            headerBackTitle: ' ',
            headerShown: true
          }}
        />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            gestureEnabled: false,
          }}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          options={{
            headerShown: true,
            headerStyle: {
              backgroundColor: '#2d6a4f',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent('main', () => App);

export default App;