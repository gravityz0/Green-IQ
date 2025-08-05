import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTIFICATIONS_KEY = 'STORED_NOTIFICATIONS';

// Helper to generate a unique ID (timestamp + random)
const generateId = () => `${Date.now()}_${Math.floor(Math.random() * 100000)}`;

// Add a new notification
export async function addNotification({ title, body }) {
  const newNotification = {
    id: generateId(),
    title,
    body,
    receivedAt: new Date().toISOString(),
    read: false,
  };
  const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  const notifications = existing ? JSON.parse(existing) : [];
  notifications.unshift(newNotification); // newest first
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
  return newNotification;
}

// Mark a notification as read by id
export async function markNotificationAsRead(id) {
  const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  const notifications = existing ? JSON.parse(existing) : [];
  const updated = notifications.map(n =>
    n.id === id ? { ...n, read: true } : n
  );
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  return updated;
}

// Mark all notifications as read
export async function markAllNotificationsAsRead() {
  const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  const notifications = existing ? JSON.parse(existing) : [];
  const updated = notifications.map(n => ({ ...n, read: true }));
  await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  return updated;
}

// Get all notifications
export async function getNotifications() {
  const existing = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
  return existing ? JSON.parse(existing) : [];
}