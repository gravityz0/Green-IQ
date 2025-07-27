# Green_IQ Offline Functionality Implementation

## 1. Install Required Dependencies

```bash
npm install @react-native-async-storage/async-storage
npm install @react-native-community/netinfo
npm install react-native-fs
```

## 2. Network Status Context

```javascript
// context/NetworkContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import NetInfo from '@react-native-community/netinfo';

const NetworkContext = createContext();

export const NetworkProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(true);
  const [networkType, setNetworkType] = useState('unknown');

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setNetworkType(state.type);
    });

    return () => unsubscribe();
  }, []);

  return (
    <NetworkContext.Provider value={{ isConnected, networkType }}>
      {children}
    </NetworkContext.Provider>
  );
};

export const useNetwork = () => {
  const context = useContext(NetworkContext);
  if (!context) {
    throw new Error('useNetwork must be used within NetworkProvider');
  }
  return context;
};
```

## 3. Offline Storage Service

```javascript
// services/offlineStorage.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineStorage {
  // Cache user data
  static async cacheUserData(userData) {
    try {
      await AsyncStorage.setItem('cached_user_data', JSON.stringify(userData));
    } catch (error) {
      console.error('Error caching user data:', error);
    }
  }

  static async getCachedUserData() {
    try {
      const data = await AsyncStorage.getItem('cached_user_data');
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error('Error getting cached user data:', error);
      return null;
    }
  }

  // Cache collection points
  static async cacheCollectionPoints(points) {
    try {
      await AsyncStorage.setItem('cached_collection_points', JSON.stringify(points));
    } catch (error) {
      console.error('Error caching collection points:', error);
    }
  }

  static async getCachedCollectionPoints() {
    try {
      const data = await AsyncStorage.getItem('cached_collection_points');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting cached collection points:', error);
      return [];
    }
  }

  // Cache scanned items for offline upload
  static async cachePendingScans(scans) {
    try {
      const existingScans = await this.getPendingScans();
      const allScans = [...existingScans, ...scans];
      await AsyncStorage.setItem('pending_scans', JSON.stringify(allScans));
    } catch (error) {
      console.error('Error caching pending scans:', error);
    }
  }

  static async getPendingScans() {
    try {
      const data = await AsyncStorage.getItem('pending_scans');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting pending scans:', error);
      return [];
    }
  }

  static async clearPendingScans() {
    try {
      await AsyncStorage.removeItem('pending_scans');
    } catch (error) {
      console.error('Error clearing pending scans:', error);
    }
  }

  // Cache chat messages
  static async cacheMessages(chatId, messages) {
    try {
      await AsyncStorage.setItem(`chat_${chatId}_messages`, JSON.stringify(messages));
    } catch (error) {
      console.error('Error caching messages:', error);
    }
  }

  static async getCachedMessages(chatId) {
    try {
      const data = await AsyncStorage.getItem(`chat_${chatId}_messages`);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting cached messages:', error);
      return [];
    }
  }

  // Cache rewards data
  static async cacheRewards(rewards) {
    try {
      await AsyncStorage.setItem('cached_rewards', JSON.stringify(rewards));
    } catch (error) {
      console.error('Error caching rewards:', error);
    }
  }

  static async getCachedRewards() {
    try {
      const data = await AsyncStorage.getItem('cached_rewards');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting cached rewards:', error);
      return [];
    }
  }
}
```

## 4. Offline-First Data Hook

```javascript
// hooks/useOfflineData.js
import { useState, useEffect } from 'react';
import { useNetwork } from '../context/NetworkContext';
import { OfflineStorage } from '../services/offlineStorage';

export const useOfflineData = (dataKey, fetchFunction, cacheFunction, getCacheFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isConnected } = useNetwork();

  useEffect(() => {
    const loadData = async () => {
      try {
        // First, load cached data
        const cachedData = await getCacheFunction();
        if (cachedData) {
          setData(cachedData);
          setLoading(false);
        }

        // If online, fetch fresh data
        if (isConnected) {
          try {
            const freshData = await fetchFunction();
            setData(freshData);
            await cacheFunction(freshData);
          } catch (fetchError) {
            console.error('Error fetching fresh data:', fetchError);
            setError(fetchError);
            // If we have cached data, use it; otherwise show error
            if (!cachedData) {
              setError(fetchError);
            }
          }
        }
      } catch (cacheError) {
        console.error('Error loading cached data:', cacheError);
        setError(cacheError);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isConnected]);

  return { data, loading, error, isOffline: !isConnected };
};
```

## 5. Enhanced Scan Screen with Offline Support

```javascript
// screens/ScanScreen.js (Enhanced version)
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { useNetwork } from '../context/NetworkContext';
import { OfflineStorage } from '../services/offlineStorage';
import Toast from 'react-native-toast-message';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scannedItems, setScannedItems] = useState([]);
  const { isConnected } = useNetwork();

  useEffect(() => {
    // Upload pending scans when back online
    if (isConnected) {
      uploadPendingScans();
    }
  }, [isConnected]);

  const uploadPendingScans = async () => {
    try {
      const pendingScans = await OfflineStorage.getPendingScans();
      if (pendingScans.length > 0) {
        // Upload each scan
        for (const scan of pendingScans) {
          // Replace this with your actual upload API call
          // await uploadScanToServer(scan);
        }
        await OfflineStorage.clearPendingScans();
        Toast.show({
          type: 'success',
          text1: 'Offline scans uploaded!',
          text2: `${pendingScans.length} items uploaded successfully`
        });
      }
    } catch (error) {
      console.error('Error uploading pending scans:', error);
    }
  };

  const handleScan = async (imageUri) => {
    const scanData = {
      id: Date.now().toString(),
      imageUri,
      timestamp: new Date().toISOString(),
      uploaded: false
    };

    if (isConnected) {
      try {
        // Upload immediately if online
        // const result = await uploadScanToServer(scanData);
        scanData.uploaded = true;
        Toast.show({
          type: 'success',
          text1: 'Scan uploaded!',
          text2: 'Your waste item has been processed'
        });
      } catch (error) {
        // Save for later upload if upload fails
        await OfflineStorage.cachePendingScans([scanData]);
        Toast.show({
          type: 'info',
          text1: 'Scan saved offline',
          text2: 'Will upload when connection is restored'
        });
      }
    } else {
      // Save for later upload if offline
      await OfflineStorage.cachePendingScans([scanData]);
      Toast.show({
        type: 'info',
        text1: 'Scan saved offline',
        text2: 'Will upload when you\'re back online'
      });
    }

    setScannedItems(prev => [...prev, scanData]);
  };

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>
            📴 Offline - Scans will be uploaded when connected
          </Text>
        </View>
      )}
      {/* Your existing camera UI */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  offlineIndicator: {
    backgroundColor: '#ff9500',
    padding: 10,
    alignItems: 'center'
  },
  offlineText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default ScanScreen;
```

## 6. Offline-Enabled Collection Points Screen

```javascript
// screens/CollectionPointsScreen.js (Enhanced version)
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useOfflineData } from '../hooks/useOfflineData';
import { OfflineStorage } from '../services/offlineStorage';

// Mock fetch function - replace with your API call
const fetchCollectionPoints = async () => {
  // Your API call here
  return mockCollectionPoints;
};

const CollectionPointsScreen = () => {
  const {
    data: collectionPoints,
    loading,
    error,
    isOffline
  } = useOfflineData(
    'collection_points',
    fetchCollectionPoints,
    OfflineStorage.cacheCollectionPoints,
    OfflineStorage.getCachedCollectionPoints
  );

  return (
    <View style={styles.container}>
      {isOffline && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>
            📴 Offline - Showing cached locations
          </Text>
        </View>
      )}
      
      <MapView style={styles.map}>
        {collectionPoints?.map((point) => (
          <Marker
            key={point.id}
            coordinate={{
              latitude: point.latitude,
              longitude: point.longitude
            }}
            title={point.name}
            description={isOffline ? "Offline mode - limited info" : point.description}
          />
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  offlineIndicator: {
    backgroundColor: '#ff9500',
    padding: 10,
    alignItems: 'center'
  },
  offlineText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default CollectionPointsScreen;
```

## 7. Offline Chat with Message Queue

```javascript
// screens/ChatScreen.js (Enhanced version)
import React, { useState, useEffect } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNetwork } from '../context/NetworkContext';
import { OfflineStorage } from '../services/offlineStorage';

const ChatScreen = ({ route }) => {
  const { chatId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [pendingMessages, setPendingMessages] = useState([]);
  const { isConnected } = useNetwork();

  useEffect(() => {
    loadCachedMessages();
  }, []);

  useEffect(() => {
    if (isConnected && pendingMessages.length > 0) {
      uploadPendingMessages();
    }
  }, [isConnected, pendingMessages]);

  const loadCachedMessages = async () => {
    const cached = await OfflineStorage.getCachedMessages(chatId);
    setMessages(cached);
  };

  const uploadPendingMessages = async () => {
    try {
      for (const message of pendingMessages) {
        // Upload to server
        // await sendMessageToServer(message);
        message.sent = true;
      }
      setPendingMessages([]);
      // Update cached messages
      await OfflineStorage.cacheMessages(chatId, messages);
    } catch (error) {
      console.error('Error uploading pending messages:', error);
    }
  };

  const sendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage = {
      id: Date.now().toString(),
      text: inputText,
      timestamp: new Date().toISOString(),
      sent: isConnected,
      pending: !isConnected
    };

    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInputText('');

    if (isConnected) {
      try {
        // Send immediately
        // await sendMessageToServer(newMessage);
        newMessage.sent = true;
        await OfflineStorage.cacheMessages(chatId, updatedMessages);
      } catch (error) {
        // Add to pending if send fails
        setPendingMessages(prev => [...prev, newMessage]);
      }
    } else {
      // Add to pending messages
      setPendingMessages(prev => [...prev, newMessage]);
      await OfflineStorage.cacheMessages(chatId, updatedMessages);
    }
  };

  const renderMessage = ({ item }) => (
    <View style={[
      styles.messageContainer,
      item.pending && styles.pendingMessage
    ]}>
      <Text>{item.text}</Text>
      {item.pending && <Text style={styles.pendingText}>Sending...</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {!isConnected && (
        <View style={styles.offlineIndicator}>
          <Text style={styles.offlineText}>
            📴 Offline - Messages will send when connected
          </Text>
        </View>
      )}
      
      <FlatList
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
      />
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = {
  container: { flex: 1 },
  offlineIndicator: {
    backgroundColor: '#ff9500',
    padding: 10,
    alignItems: 'center'
  },
  offlineText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  },
  messageContainer: {
    padding: 10,
    margin: 5,
    backgroundColor: '#f0f0f0',
    borderRadius: 8
  },
  pendingMessage: {
    backgroundColor: '#fff3cd',
    borderColor: '#ffeaa7',
    borderWidth: 1
  },
  pendingText: {
    fontSize: 12,
    color: '#856404',
    fontStyle: 'italic'
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8
  },
  sendButton: {
    padding: 10,
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    marginLeft: 10
  }
};

export default ChatScreen;
```

## 8. Update App.js to Include Network Provider

```javascript
// App.js (Add NetworkProvider)
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { UserProvider } from './context/UserContext';
import { NetworkProvider } from './context/NetworkContext';
import AppNavigator from './navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <NetworkProvider>
      <UserProvider>
        <NavigationContainer>
          <AppNavigator />
          <Toast />
        </NavigationContainer>
      </UserProvider>
    </NetworkProvider>
  );
}
```

## 9. Global Offline Indicator Component

```javascript
// components/OfflineIndicator.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNetwork } from '../context/NetworkContext';

const OfflineIndicator = () => {
  const { isConnected } = useNetwork();

  if (isConnected) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📴 You're offline</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ff4757',
    padding: 8,
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000
  },
  text: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold'
  }
});

export default OfflineIndicator;
```

## Key Features Implemented:

1. **Network Detection**: Real-time network status monitoring
2. **Data Caching**: Offline storage for key app data
3. **Offline Scanning**: Save scans locally, upload when online
4. **Cached Maps**: Show collection points from cache when offline  
5. **Message Queue**: Send messages when connection restored
6. **Visual Indicators**: Clear offline status throughout the app
7. **Background Sync**: Automatic upload of pending data when online

## Usage Tips:

- Cache essential data when online for offline access
- Show clear indicators when features are limited offline
- Queue user actions (scans, messages) for later sync
- Provide meaningful feedback about offline status
- Test thoroughly in airplane mode to ensure functionality