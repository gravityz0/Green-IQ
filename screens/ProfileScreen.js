import React, { useContext, useState,useEffect } from "react";
import axios from "axios";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/UserContext";

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserinfoProfile = async () => {
      try {
        const response = await axios.get(
          "https://trash2treasure-backend.onrender.com/userInfo"
        );
        setUser(response.data);
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "You must login first",
          text2: "Please login or create account first",
        });
        navigation.navigate("Login");
      }
    };
    getUserinfoProfile();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.profileHeader}>
        {user ? (
          <Image
            source={{
              uri: `https://trash2treasure-backend.onrender.com/${user.profilePic}`,
            }}
            style={styles.avatar}
          />
        ) : (
          <View>
            <Text>Loading...</Text>
          </View>
        )}
        <Text style={styles.userName}>
          {user ? user.fullNames : "Loading..."}
        </Text>
        <Text style={styles.userHandle}>
          {user ? user.email : "Loading..."}
        </Text>
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
        {/* {userEmail.endsWith("@rca.com") && (
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Ionicons name="analytics-outline" size={24} color="#1b4332" />
            <Text style={styles.menuItemText}>Government Dashboard</Text>
          </TouchableOpacity>
        )} */}
  
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]}>
          <Ionicons name="log-out-outline" size={24} color="#d9534f" />
          <Text style={[styles.menuItemText, { color: "#d9534f" }]}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f5",
  },
  profileHeader: {
    alignItems: "center",
    paddingVertical: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1b4332",
    marginTop: 15,
  },
  userHandle: {
    fontSize: 16,
    color: "gray",
    marginTop: 5,
  },
  menuContainer: {
    marginTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  menuItemText: {
    marginLeft: 20,
    fontSize: 18,
    color: "#1b4332",
  },
  logoutButton: {
    borderBottomWidth: 0,
    marginTop: 20,
  },
});

export default ProfileScreen;
