import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Camera, CameraView } from "expo-camera";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome } from "@expo/vector-icons";

const ProductScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [loading, isLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [scanned, setScanner] = useState(false);
  const [showCamera, setShowCamera] = useState(true);
  const [cameraClicked, setCameraClicked] = useState(false);
  useEffect(() => {
    if (cameraClicked) {
      const getCameraPermission = async () => {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === "granted");
      };
      getCameraPermission();
    }
  }, [cameraClicked]);

  const handleBarcodeScanned = async ({ type, data }) => {
    setScanner(true);
    isLoading(true);
    setShowCamera(false);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${data}.json`
      );
      const json = await response.json();
      Alert.alert("Scanned");
      setProduct(json.product);
    } catch (error) {
      Alert.alert("Error occured when fetching");
    }
    isLoading(false);
  };

  if (hasPermission == null) {
    return <Text>Requesting camera permission</Text>;
  }
  if (hasPermission == false) {
    return <Text>No camera permission</Text>;
  }
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
        {product && (
          <View style={styles.productInfo}>
            <Text>Name: {product.categories_tags}</Text>
            <Text>Name: {product.brands}</Text>
            <Text>Name: {product.product_name}</Text>
            <Text>Brand: {product.ingredients_tags}</Text>
          </View>
        )}

        {!cameraClicked && (
          <Pressable style={styles.cameraHolder} onPress={()=>{setCameraClicked(true)}}>
            <FontAwesome name="camera" size={30} style={{ color: "white" }} />
            <Text style={{ color: "white", marginTop: 2 }}>Scan a product</Text>
          </Pressable>
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
});
export default ProductScanScreen;
