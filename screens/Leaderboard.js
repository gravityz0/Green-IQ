import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const mockLeaderboard = [
  { id: 1, name: 'Jung Jinyu', points: 15430, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  ...Array.from({ length: 10 }, (_, i) => {
    const idx = i + 21;
    return {
      id: idx,
      name: `EcoUser ${idx}`,
      points: 10000 - idx * 30,
      avatar: `https://randomuser.me/api/portraits/${idx % 2 === 0 ? 'men' : 'women'}/${(idx * 3) % 90}.jpg`,
    };
  }),
];

const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

export default function Leaderboard({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width > 700;

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fffe' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 44, paddingBottom: 16, backgroundColor: '#1B5E20', paddingHorizontal: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => navigation && navigation.goBack && navigation.goBack()} style={{ padding: 6, marginRight: 10 }}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: 'center' }}>
          <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', letterSpacing: 1 }}>🏆 Leaderboard</Text>
        </View>
      </View>
      <ScrollView contentContainerStyle={{ paddingHorizontal: isTablet ? 60 : 12, paddingBottom: 40 }}>
        {mockLeaderboard.map((user, idx) => (
          <LinearGradient
            key={user.id}
            colors={[idx < 3 ? medalColors[idx] + '22' : '#fff', '#f8fffe']}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 18,
              padding: isTablet ? 22 : 12,
              marginBottom: isTablet ? 24 : 14,
              elevation: 2,
              shadowColor: idx < 3 ? medalColors[idx] : '#4ECDC4',
              shadowOpacity: 0.10,
              shadowRadius: 8,
              backgroundColor: '#fff',
            }}
          >
            <View style={{ alignItems: 'center', marginRight: 16, width: 40 }}>
              <View style={{ backgroundColor: idx < 3 ? medalColors[idx] : '#e0e0e0', borderRadius: 16, width: 32, height: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 4 }}>
                {idx < 3 ? (
                  <Ionicons name="medal-outline" size={22} color="#fff" />
                ) : (
                  <Text style={{ color: '#888', fontWeight: 'bold', fontSize: 16 }}>{idx + 1}</Text>
                )}
              </View>
              {idx < 3 && <Text style={{ color: medalColors[idx], fontWeight: 'bold', fontSize: 12 }}>{['1st', '2nd', '3rd'][idx]}</Text>}
            </View>
            <Image source={{ uri: user.avatar }} style={{ width: 54, height: 54, borderRadius: 27, marginRight: 16, borderWidth: 2, borderColor: idx < 3 ? medalColors[idx] : '#4ECDC4' }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: isTablet ? 20 : 16, fontWeight: 'bold', color: '#1B5E20' }}>{user.name}</Text>
              <Text style={{ fontSize: isTablet ? 15 : 12, color: '#888', marginTop: 2 }}>{user.points.toLocaleString()} pts</Text>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
    </View>
  );
} 