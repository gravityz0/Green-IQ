import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';

export default function BarcodeScanner() {
  const [barcode, setBarcode] = useState('');
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchProduct = async () => {
    setLoading(true);
    setError('');
    setProduct(null);
    try {
      const response = await fetch(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );
      const json = await response.json();

      if (json.status === 1) {
        setProduct(json.product);
      } else {
        setError('Product not found.');
      }
    } catch (err) {
      setError('Failed to fetch product.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setBarcode('');
    setProduct(null);
    setError('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {!product ? (
        <>
          <Text style={styles.label}>Enter Barcode:</Text>
          <TextInput
            value={barcode}
            onChangeText={setBarcode}
            placeholder="e.g. 1234567890123"
            style={styles.input}
            keyboardType="numeric"
          />
          <Button title={loading ? 'Searching...' : 'Search'} onPress={fetchProduct} disabled={loading || !barcode} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </>
      ) : (
        <>
          <Text style={styles.title}>Product Details</Text>
          {product.image_url && (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          )}
          <Text>Product Name: {product.product_name}</Text>
          <Text>Brand: {product.brands}</Text>
          <Text>Categories: {product.categories_tags?.join(', ')}</Text>
          <Text>Ingredients: {product.ingredients_text || 'N/A'}</Text>
          <Text>Nutri-Score: {product.nutriscore_grade?.toUpperCase() || 'N/A'}</Text>
          <Text>Eco-Score: {product.ecoscore_grade?.toUpperCase() || 'N/A'}</Text>

          <View style={styles.spacer} />
          <Button title="Scan Again" onPress={reset} />
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 6,
  },
  error: {
    color: 'red',
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  spacer: {
    marginTop: 20,
  },
});
