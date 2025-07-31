import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const alerts = [
  {
    id: 1,
    title: 'Heavy Rainfall Alert',
    message: 'Severe rainfall expected in Gasabo and Kicukiro. Safe zones are open for shelter and support.',
    time: '2 hours ago',
    icon: 'rainy-outline',
    color: '#2196F3',
  },
  {
    id: 2,
    title: 'Flood Risk',
    message: 'Flooding reported near Nyarugenge Waste Hub. Please avoid the area and use the nearest safe zone.',
    time: '4 hours ago',
    icon: 'water-outline',
    color: '#00BCD4',
  },
  {
    id: 3,
    title: 'Heatwave Warning',
    message: 'High temperatures expected this week. Stay hydrated and visit safe zones for cooling.',
    time: '1 day ago',
    icon: 'sunny-outline',
    color: '#FF9800',
  },
  {
    id: 4,
    title: 'Air Quality Alert',
    message: 'Poor air quality detected in Kigali. Vulnerable groups should stay indoors or use safe zones.',
    time: '2 days ago',
    icon: 'cloud-outline',
    color: '#607D8B',
  },
];

export default function SafeZoneAlerts({ navigation }) {
  return (
    <View style={{ flex: 1, backgroundColor: '#f8fffe' }}>
      {/* Top bar with back arrow */}
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 44, paddingBottom: 16, backgroundColor: '#1B5E20', paddingHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()} style={{ padding: 6, marginRight: 10 }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', letterSpacing: 1 }}>Safe Zone Alerts</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}>
        {alerts.map(alert => (
          <View key={alert.id} style={[styles.card, { borderLeftColor: alert.color }] }>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Ionicons name={alert.icon} size={28} color={alert.color} style={{ marginRight: 12 }} />
              <Text style={styles.title}>{alert.title}</Text>
            </View>
            <Text style={styles.message}>{alert.message}</Text>
            <Text style={styles.time}>{alert.time}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 18,
    elevation: 2,
    shadowColor: '#1B5E20',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    borderLeftWidth: 6,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  message: {
    fontSize: 15,
    color: '#333',
    marginBottom: 8,
  },
  time: {
    fontSize: 13,
    color: '#888',
    textAlign: 'right',
  },
}); 