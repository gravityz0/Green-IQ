import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button } from 'react-native';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from '../hooks/useNotificationStore';

export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState([]);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  // Mark one as read
  const handlePress = async (id) => {
    await markNotificationAsRead(id);
    loadNotifications();
  };

  // Mark all as read
  const handleMarkAll = async () => {
    await markAllNotificationsAsRead();
    loadNotifications();
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => handlePress(item.id)} style={styles.item}>
      <Text style={[styles.title, !item.read && styles.unread]}>
        {item.title || 'No Title'}
      </Text>
      <Text style={styles.body}>{item.body || ''}</Text>
      <Text style={styles.date}>{new Date(item.receivedAt).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Notifications</Text>
        <Button title="Mark All as Read" onPress={handleMarkAll} />
      </View>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={<Text style={styles.empty}>No notifications yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  header: { fontSize: 24, fontWeight: 'bold' },
  item: { marginBottom: 16, padding: 12, backgroundColor: '#f5f5f5', borderRadius: 8 },
  title: { fontWeight: 'normal', fontSize: 16 },
  unread: { fontWeight: 'bold' },
  body: { fontSize: 14, marginTop: 4 },
  date: { fontSize: 12, color: '#888', marginTop: 4 },
  empty: { textAlign: 'center', color: '#888', marginTop: 32 },
});