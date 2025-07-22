import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, Alert, SafeAreaView, StatusBar } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const ProductScanScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]); // Array of photo objects
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const [confirmed, setConfirmed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [classificationResults, setClassificationResults] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#00C896" /><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View style={styles.center}><Ionicons name="close-circle" size={60} color="#e74c3c" /><Text>No access to camera</Text></View>;
  }

  const handleTakePhoto = async () => {
    if (cameraRef.current) {
      setIsProcessing(true);
      const photoData = await cameraRef.current.takePictureAsync();
      setPhotos(prev => [...prev, photoData]);
      setIsProcessing(false);
    }
  };

  const handleRemovePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    setConfirmed(true);
  };

  const handleUpload = async () => {
    setUploading(true);
    setUploadProgress(0);
    // Simulate upload for each photo
    for (let i = 0; i < photos.length; i++) {
      await new Promise(res => setTimeout(res, 800));
      setUploadProgress(i + 1);
    }
    setUploading(false);
    // Simulate classification results for products
    const types = [
      { type: 'Plastic Packaging', description: 'This product uses recyclable plastic packaging.' },
      { type: 'Paper Packaging', description: 'This product uses biodegradable paper packaging.' },
      { type: 'Mixed Material', description: 'This product uses mixed materials. Check local recycling rules.' },
    ];
    const results = photos.map((photo, idx) => {
      const t = types[idx % types.length];
      return {
        image: photo.uri,
        type: t.type,
        description: t.description,
      };
    });
    setClassificationResults(results);
    setShowModal(true);
  };

  const handleModalConfirm = () => {
    setShowModal(false);
    setPhotos([]);
    setConfirmed(false);
    setClassificationResults([]);
    Alert.alert('Eco Tip!', 'Thank you for uploading a product!');
  };
  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Upload Product Image</Text>
      </View>
      {/* Camera and Overlay */}
      <View style={{ flex: 1, backgroundColor: '#000' }}>
        <Camera style={styles.camera} ref={cameraRef} ratio="16:9" />
        <View style={styles.cameraOverlay}>
          <Text style={styles.instruction}>Take a photo of the product/package</Text>
        </View>
        {/* Gallery of taken photos */}
        {photos.length > 0 && (
          <View style={styles.galleryContainer}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {photos.map((photo, idx) => (
                <View key={photo.uri} style={styles.thumbnailWrapper}>
                  <Image source={{ uri: photo.uri }} style={styles.thumbnail} />
                  <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePhoto(idx)} accessibilityLabel="Remove photo">
                    <Ionicons name="close-circle" size={22} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}
        {/* Take photo button */}
        {!confirmed && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={handleTakePhoto}
            disabled={isProcessing}
            accessibilityLabel="Take photo"
          >
            {isProcessing ? <ActivityIndicator color="#fff" /> : <Ionicons name="camera" size={36} color="#fff" />}
          </TouchableOpacity>
        )}
        {/* Confirm button */}
        {photos.length > 0 && !confirmed && (
          <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} accessibilityLabel="Confirm photos">
            <Ionicons name="checkmark" size={24} color="#fff" />
            <Text style={styles.buttonText}>Confirm ({photos.length})</Text>
          </TouchableOpacity>
        )}
        {/* Upload button and progress */}
        {confirmed && (
          <View style={styles.uploadContainer}>
            <TouchableOpacity style={styles.uploadButton} onPress={handleUpload} disabled={uploading} accessibilityLabel="Upload photos">
              {uploading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <>
                  <Ionicons name="cloud-upload" size={24} color="#fff" />
                  <Text style={styles.buttonText}>Upload ({photos.length})</Text>
                </>
              )}
            </TouchableOpacity>
            {uploading && (
              <Text style={styles.uploadProgress}>{`Uploading ${uploadProgress}/${photos.length}`}</Text>
            )}
          </View>
        )}
        {/* Modal for classification results (placeholder) */}
        {showModal && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Product Info</Text>
            {classificationResults.map((result, idx) => (
              <View key={idx} style={{ marginBottom: 10 }}>
                <Image source={{ uri: result.image }} style={styles.thumbnail} />
                <Text style={styles.resultText}>Type: {result.type}</Text>
                <Text style={styles.resultText}>{result.description}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.scanAgainButton} onPress={handleModalConfirm}>
              <Ionicons name="checkmark" size={20} color="#fff" />
              <Text style={styles.scanAgainText}>Done</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 2,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    flex: 1,
    marginRight: 40,
  },
  camera: { flex: 1 },
  cameraOverlay: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 2,
  },
  instruction: {
    color: '#fff',
    fontSize: 18,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#00C896',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  galleryContainer: {
    position: 'absolute',
    bottom: 130,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    zIndex: 4,
  },
  thumbnailWrapper: {
    marginRight: 10,
    position: 'relative',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#fff',
  },
  removeButton: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 0,
    zIndex: 5,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#00C896',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 8,
  },
  uploadContainer: {
    position: 'absolute',
    bottom: 40,
    left: 30,
    right: 30,
    alignItems: 'center',
    zIndex: 6,
  },
  uploadButton: {
    backgroundColor: '#00C896',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 30,
    width: 180,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 8,
  },
  uploadProgress: {
    color: '#fff',
    fontSize: 16,
    marginTop: 10,
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1B5E20',
    padding: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    zIndex: 10,
  },
  resultTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  resultText: {
    fontSize: 16,
    color: '#e0f2f1',
    marginBottom: 8,
  },
  scanAgainButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A578',
    padding: 14,
    borderRadius: 12,
    marginTop: 16,
  },
  scanAgainText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default ProductScanScreen; 