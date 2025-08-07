const handleUpload = async () => {
  if (photos.length === 0) {
    Alert.alert('No Images', 'Please select at least one image to upload.');
    return;
  }

  setUploading(true);
  setUploadProgress(0);
  
  try {
    // Step 1: Retrieve authentication token from AsyncStorage
    let authToken;
    try {
      authToken = await AsyncStorage.getItem('token');
      if (!authToken) {
        throw new Error('Authentication token not found. Please log in again.');
      }
      console.log('Token retrieved successfully');
    } catch (tokenError) {
      console.error('Token retrieval error:', tokenError);
      setUploading(false);
      setUploadProgress(0);
      Alert.alert(
        'Authentication Error', 
        'Unable to retrieve authentication token. Please log in again.',
        [
          { text: 'Go to Login', onPress: () => navigation.navigate('Login') },
          { text: 'Cancel', style: 'cancel' }
        ]
      );
      return;
    }

    const photo = photos[0];
    
    const formData = new FormData();
    formData.append('image', {
      uri: photo.uri,
      type: 'image/jpeg', 
      name: 'image.jpg', 
    });

    // Step 2: Upload with authentication and enhanced error handling
    const uploadWithRetry = async (retryCount = 0) => {
      const maxRetries = 2;
      
      try {
        // REMOVED Promise.race timeout wrapper - causes APK network issues
        const response = await fetch(`${SERVER_URL}/predict`, {
          method: 'POST',
          body: formData,
          headers: {
            // REMOVED 'Accept': 'application/json' - can cause FormData issues in APK
            'Authorization': `Bearer ${authToken}`,
          },
        });

        // Handle different HTTP status codes
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('Access denied. Your account may not have permission for this action.');
        } else if (response.status === 429) {
          throw new Error('Too many requests. Please wait a moment and try again.');
        } else if (response.status >= 500) {
          throw new Error('Server error. Please try again later.');
        } else if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Server error (${response.status}): ${errorText}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        // ADDED 'Failed to fetch' - common APK network error
        if (retryCount < maxRetries && (
          error.message.includes('Network request failed') ||
          error.message.includes('Failed to fetch') ||
          error.message.includes('timeout') ||
          error.message.includes('Server error')
        )) {
          console.log(`Upload attempt ${retryCount + 1} failed, retrying...`);
          await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
          return uploadWithRetry(retryCount + 1);
        }
        throw error;
      }
    };

    const data = await uploadWithRetry();

    setUploading(false);
    setUploadProgress(100);
    
    if (data && data.success !== false && (data.prediction || data.label)) {
      const result = {
        label: data.prediction || data.label,
        confidence: parseFloat(data.confidence || 0),
        description: (data.prediction || data.label) === 'biodegradable' 
          ? 'Easily breaks down naturally. Good for composting.'
          : 'Does not break down easily. Should be disposed of carefully.',
        recyclable: (data.prediction || data.label) !== 'biodegradable',
        disposal: (data.prediction || data.label) === 'biodegradable'
          ? 'Use compost or organic bin'
          : 'Use general waste bin or recycling if possible',
        example_items: (data.prediction || data.label) === 'biodegradable'
          ? ['banana peel', 'food waste', 'paper']
          : ['plastic bag', 'styrofoam', 'metal can'],
        image: photo.uri,
      };
      navigation.navigate('ClassificationResult', { result });
    } else {
      setFallbackFact(ecoFacts[Math.floor(Math.random() * ecoFacts.length)]);
      setShowFallback(true);
    }
  } catch (error) {
    setUploading(false);
    setUploadProgress(0);
    
    console.error('Upload error:', error);
    
    let errorMessage = 'Failed to classify image. Please check your connection and try again.';
    let showRetry = true;
    let showLogin = false;
    
    if (error.message.includes('Authentication failed') || error.message.includes('Authentication token not found')) {
      errorMessage = 'Your session has expired. Please log in again.';
      showRetry = false;
      showLogin = true;
    } else if (error.message.includes('Access denied')) {
      errorMessage = 'You do not have permission to perform this action.';
      showRetry = false;
    } else if (error.message.includes('Too many requests')) {
      errorMessage = 'Too many requests. Please wait a moment before trying again.';
      showRetry = true;
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Request timed out. Please check your internet connection.';
      showRetry = true;
    } else if (error.message.includes('Network request failed') || error.message.includes('Failed to fetch')) {
      errorMessage = 'Network error. Please check if the server is running and accessible.';
      showRetry = true;
    } else if (error.message.includes('Server error')) {
      errorMessage = 'Server is temporarily unavailable. Please try again later.';
      showRetry = true;
    } else if (error.message) {
      errorMessage = error.message;
      showRetry = true;
    }
    
    const alertButtons = [];
    if (showRetry) {
      alertButtons.push({ text: 'Try Again', onPress: () => handleUpload() });
    }
    if (showLogin) {
      alertButtons.push({ text: 'Go to Login', onPress: () => navigation.navigate('Login') });
    }
    alertButtons.push({ text: 'Cancel', style: 'cancel' });
    
    Alert.alert('Upload Error', errorMessage, alertButtons);
  }
};