import { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { addNotification } from './useNotificationStore';

export default function useNotificationListener() {
  useEffect(() => {
    // Foreground notification
    const foregroundSub = Notifications.addNotificationReceivedListener(async notification => {
      const { title, body } = notification.request.content;
      await addNotification({ title, body });
    });

    // Background/tapped notification
    const responseSub = Notifications.addNotificationResponseReceivedListener(async response => {
      const { title, body } = response.notification.request.content;
      await addNotification({ title, body });
    });

    return () => {
      foregroundSub.remove();
      responseSub.remove();
    };
  }, []);
}