import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import axios from 'axios';

export async function registerForPushNotificationsAsync(userId) {
  try {
    if (!Device.isDevice) {
      alert('Push notifications require a physical device');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Push notification permission not granted');
      return;
    }

    const token = (await Notifications.getExpoPushTokenAsync()).data;

    // Send token to backend
    await axios.post('https://trash2treasure-backend.onrender.com/userfcm', {
      userId,
      fcmToken: token
    });

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;

  } catch (error) {
    console.error("Error in FCM registration:", error);
  }
}