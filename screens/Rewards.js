import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import axios from "axios";
import Toast from "react-native-toast-message";

export default function Rewards({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [rewards, setRewards] = useState([]);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const getUserinfo = async () => {
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
    getUserinfo();
  }, []);


  useEffect(() => {
    const getRewards = async () => {
      const response = await axios.get(
        "https://trash2treasure-backend.onrender.com/getRewards"
      );
      setRewards(response.data.message);
    };

    getRewards();
  }, []);

  const handleRedeem = async (reward) => {
    try {
      const rewardId = reward._id;
      const response = await axios.post(
        "https://trash2treasure-backend.onrender.com/buyReward",
        {
          rewardId,
        }
      );

      Alert.alert(response.data.message);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
        position: "bottom",
      });
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message,
        position: "top",
      });
    }
  };

  // const confirmRedeem = () => {
  //   if (selectedReward && userPoints >= selectedReward.cost) {
  //     setUserPoints(userPoints - selectedReward.cost);
  //     setShowModal(false);
  //     setTimeout(() => {
  //       alert(`You have redeemed: ${selectedReward.name}!`);
  //     }, 300);
  //   } else {
  //     setShowModal(false);
  //     setTimeout(() => {
  //       alert("Not enough eco points!");
  //     }, 300);
  //   }
  // };

  return (
    <View style={{ flex: 1, backgroundColor: "#f8fffe" }}>
      {/* Top bar with back arrow */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 44,
          paddingBottom: 16,
          backgroundColor: "#00C896",
          paddingHorizontal: 10,
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => navigation && navigation.goBack && navigation.goBack()}
          style={{ padding: 6, marginRight: 10 }}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text
            style={{
              color: "#fff",
              fontSize: 24,
              fontWeight: "bold",
              letterSpacing: 1,
            }}
          >
            EcoPoints Rewards
          </Text>
        </View>
      </View>
      {/* User Points */}
      <View style={{ alignItems: "center", marginBottom: 18 }}>
        <LinearGradient colors={["#e0f7fa", "#fff"]} style={styles.pointsCard}>
          <Ionicons
            name="leaf"
            size={28}
            color="#00C896"
            style={{ marginRight: 10 }}
          />
          <Text style={{ color: "#00C896", fontWeight: "bold", fontSize: 18 }}>
            Your Eco Points
          </Text>
          <Text style={{ color: "#1B5E20", fontWeight: "bold", fontSize: 28 }}>
            {user ? user.points : 'Loading...'}
          </Text>
        </LinearGradient>
      </View>
      {/* Rewards List */}
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 40 }}
      >
        {rewards.map((reward) => (
          <LinearGradient
            key={reward._id}
            colors={["#fff", "#e0f7fa"]}
            style={styles.rewardCard}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Image
                source={{
                  uri: `https://trash2treasure-backend.onrender.com/${reward.rewardImage}`,
                }}
                style={styles.rewardImage}
              />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <Text style={styles.rewardName}>{reward.rewardName}</Text>
                <Text style={styles.rewardDesc}>
                  {reward.rewardDescription}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginTop: 6,
                  }}
                >
                  <Ionicons name="leaf" size={18} color="#00C896" />
                  <Text style={styles.rewardCost}>
                    {reward.rewardCostPoints} Eco Points
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.redeemButton}
                onPress={() => handleRedeem(reward)}
              >
                <Text
                  style={[
                    styles.redeemButtonText,
                    //  { opacity: userPoints < reward.cost ? 0.5 : 1 },
                    { opacity: 1200 < reward.cost ? 0.5 : 1 },
                  ]}
                >
                  Redeem
                </Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        ))}
      </ScrollView>
      {/* Redeem Modal */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Ionicons
              name="gift-outline"
              size={44}
              color="#00C896"
              style={{ marginBottom: 10 }}
            />
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "#1B5E20",
                marginBottom: 8,
              }}
            >
              Confirm Redemption
            </Text>
            <Text style={{ fontSize: 16, color: "#333", marginBottom: 16 }}>
              Redeem{" "}
              <Text style={{ color: "#00C896", fontWeight: "bold" }}>
                {/* {selectedReward?.name} */}
                divin
              </Text>{" "}
              for{" "}
              <Text style={{ color: "#00C896", fontWeight: "bold" }}>
                {/* {selectedReward?.cost} */}
                furaha
              </Text>{" "}
              Eco Points?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#e0e0e0" }]}
                onPress={() => setShowModal(false)}
              >
                <Text style={{ color: "#333", fontWeight: "bold" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#00C896" }]}
                // onPress={confirmRedeem}
              >
                <Text style={{ color: "#fff", fontWeight: "bold" }}>
                  Redeem
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  pointsCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e0f7fa",
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: "#00C896",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  rewardCard: {
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    elevation: 2,
    shadowColor: "#00C896",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    backgroundColor: "#fff",
  },
  rewardImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  rewardName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1B5E20",
  },
  rewardDesc: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  rewardCost: {
    fontSize: 15,
    color: "#00C896",
    fontWeight: "bold",
    marginLeft: 6,
  },
  redeemButton: {
    backgroundColor: "#00C896",
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginLeft: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 1,
  },
  redeemButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    width: 320,
    elevation: 4,
    shadowColor: "#00C896",
    shadowOpacity: 0.12,
    shadowRadius: 10,
  },
  modalButton: {
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 24,
    marginHorizontal: 8,
    marginTop: 10,
  },
});
