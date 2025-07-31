import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Pressable,
  Image,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Camera, CameraView } from "expo-camera";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { getProductGrades } from "../utils/ProductGrade";
import NoProductImage from "../assets/NoProductImage.png";
import axios from "axios";
import Toast from "react-native-toast-message";

const ProductScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, setLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [scanned, setScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraClicked, setCameraClicked] = useState(false);
  useEffect(() => {
    if (cameraClicked && hasPermission !== true) {
      const getCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        const granted = status === "granted";
        setHasPermission(granted);
        if (granted) {
          setShowCamera(true);
        }
      };
      getCameraPermission();
    }
  }, [cameraClicked]);

  const handleScanProduct = async (barcode) => {
    try {
      const response = await axios.post(
        "https://trash2treasure-backend.onrender.com/scanProduct",
        {
          barcode: barcode,
        }
      );

      Alert.alert(response.data.message);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: response.data.message,
        position: "top",
      });
    } catch (error) {
      Alert.alert(error?.response?.data?.message);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error?.response?.data?.message,
        position: "top",
      });
    }
  };
  const handleBarcodeScanned = async ({ type, data }) => {
    setScanner(true);
    setLoading(true);
    setShowCamera(false);
    setCameraClicked(false);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const json = await response.json();

      if (json.status === 1) {
        const gradedProduct = await getProductGrades([json.product]);
        setProduct(gradedProduct[0]);
      } else {
        Alert.alert("No product found");
      }
    } catch (error) {
      Alert.alert("An error occured when fetching");
    }
    setLoading(false);
    handleScanProduct(product.code);
  };

  if (hasPermission == false) {
    return <Text>No camera permission</Text>;
  }

  const giveColor = (grade) => {
    switch (grade) {
      case "a":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circle}>
              <Text style={styles.gradeText}>A</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#00A784",
              }}
            >
              Eco Friendly
            </Text>
          </View>
        );
        break;

      case "b":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circle}>
              <Text style={styles.gradeText}>B</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#00A784",
              }}
            >
              Eco Friendly
            </Text>
          </View>
        );
        break;

      case "c":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circleYellow}>
              <Text style={styles.gradeText}>C</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#f0fc06ff",
              }}
            >
              Eco Friendly
            </Text>
          </View>
        );
        break;

      case "d":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circleRed}>
              <Text style={styles.gradeText}>D</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#ff0303ff",
              }}
            >
              Not Eco Friendly
            </Text>
          </View>
        );
        break;

      case "e":
        return (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={styles.circleRed}>
              <Text style={styles.gradeText}>E</Text>
            </View>
            <Text
              style={{
                paddingLeft: 10,
                fontWeight: "bold",
                fontSize: 15,
                color: "#ff0303ff",
              }}
            >
              Not Eco Friendly
            </Text>
          </View>
        );
        break;
      default:
        return null;
    }
  };
  return (
    <SafeAreaProvider>
      <SafeAreaView
        style={{ flex: 1 }}
        edges={["top", "bottom", "left", "right"]}
      >
        {showCamera && (
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
            style={StyleSheet.absoluteFillObject}
          />
        )}
        {loading && <ActivityIndicator size="large" />}
        {!cameraClicked && (
          <Pressable
            style={styles.cameraHolder}
            onPress={() => {
              setCameraClicked(true);
              setProduct(null);
              setShowCamera(true);
              setScanner(false);
            }}
          >
            <FontAwesome name="camera" size={30} style={{ color: "white" }} />
            <Text style={{ color: "white", marginTop: 2 }}>Scan a product</Text>
          </Pressable>
        )}

        {product && (
          <View>
            <View style={styles.container}>
              <View>
                <Image
                  source={
                    product.image ? { uri: product.image } : NoProductImage
                  }
                  style={styles.productImage}
                />
              </View>
              <View style={styles.aboutHotels}>
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    paddingBottom: 8,
                  }}
                >
                  {product.product_name}
                </Text>
                <Text style={{ paddingBottom: 3, fontWeight: "bold" }}>
                  Grade: {product.grade}
                </Text>
                {giveColor(product.grade)}
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  cameraHolder: {
    backgroundColor: "#00A784",
    height: 200,
    width: 300,
    marginTop: 30,
    marginLeft: 30,
    borderRadius: 30,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    display: "flex",
    flexDirection: "row",
    paddingLeft: 20,
    paddingTop: 30,
    overflow: "hidden",
  },
  productImage: {
    resizeMode: "cover",
    width: wp("40%"),
    height: hp("20%"),
    borderRadius: 20,
  },

  aboutHotels: {
    display: "flex",
    justifyContent: "center",
    padding: 12,
  },

  circle: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#00A784",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  circleYellow: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#f0fc06ff",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  circleRed: {
    width: wp("10%"),
    height: wp("10%"),
    borderRadius: wp("5%"),
    backgroundColor: "#ff0303ff",
    justifyContent: "center",
    alignItems: "center",
    display: "flex",
    marginTop: 2,
  },

  gradeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});
export default ProductScanScreen;
