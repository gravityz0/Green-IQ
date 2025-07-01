import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { Camera } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]); // Array of photo objects
  const [isProcessing, setIsProcessing] = useState(false);
  const cameraRef = useRef(null);
  const [confirmed, setConfirmed] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#2d6a4f" /><Text>Requesting camera permission...</Text></View>;
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
      // Simulate network delay
      await new Promise(res => setTimeout(res, 800));
      setUploadProgress(i + 1);
    }
    setUploading(false);
    Alert.alert('Upload Complete', `Uploaded ${photos.length} photo(s) successfully!`);
    // Optionally, clear photos and reset state
    setPhotos([]);
    setConfirmed(false);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <Camera style={styles.camera} ref={cameraRef} ratio="16:9" />
      <View style={styles.cameraOverlay}>
        <Text style={styles.instruction}>Take photos of waste items</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
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
    backgroundColor: '#2d6a4f',
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
    backgroundColor: '#2d6a4f',
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
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
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
    backgroundColor: '#2d6a4f',
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
});

export default ScanScreen; 