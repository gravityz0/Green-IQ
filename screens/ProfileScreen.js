import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = ({ navigation }) => {
  const userName = "Isaac"; // Placeholder

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        <Image
          source={{ uri: `https://i.pravatar.cc/150?u=${userName}` }}
          style={styles.avatar}
        />
        <Text style={styles.userName}>{userName}</Text>
        <Text style={styles.userHandle}>@${userName.toLowerCase()}</Text>
      </View>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="person-outline" size={24} color="#1b4332" />
          <Text style={styles.menuItemText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={24} color="#1b4332" />
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="notifications-outline" size={24} color="#1b4332" />
          <Text style={styles.menuItemText}>Notifications</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="help-circle-outline" size={24} color="#1b4332" />
          <Text style={styles.menuItemText}>Help Center</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
          <Text style={[styles.menuItemText, {color: '#d9534f'}]}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1b4332',
    marginTop: 15,
  },
  userHandle: {
    fontSize: 16,
    color: 'gray',
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 18,
    color: '#1b4332',
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 20,
  }
});

export default ProfileScreen; 