import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, ScrollView, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>KILIMOLINK</Text>
          <Text style={styles.subtitle}>Kenya's Food Future</Text>
        </View>

        <View style={styles.heroCard}>
          <Image 
            source={{ uri: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80' }} 
            style={styles.heroImage}
          />
          <View style={styles.heroOverlay}>
            <Text style={styles.heroText}>Direct from Farm to Table</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.buttonIcon}>🛒</Text>
              <Text style={styles.buttonText}>Market</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={styles.buttonIcon}>🌱</Text>
              <Text style={styles.buttonText}>Sell</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Produce</Text>
          {[1, 2, 3].map((i) => (
            <View key={i} style={styles.productCard}>
              <View style={styles.productInfo}>
                <Text style={styles.productName}>Fresh Sukuma Wiki</Text>
                <Text style={styles.productPrice}>50 KES/bundle</Text>
              </View>
              <TouchableOpacity style={styles.buyButton}>
                <Text style={styles.buyButtonText}>Buy</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fcfcfc',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '900',
    color: '#064e3b',
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '600',
  },
  heroCard: {
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'flex-end',
    padding: 20,
  },
  heroText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '800',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 15,
  },
  actionButton: {
    flex: 1,
    backgroundColor: '#064e3b',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#f59e0b',
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: '800',
    fontSize: 16,
  },
  productCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 16,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  productPrice: {
    fontSize: 14,
    color: '#059669',
    fontWeight: '800',
  },
  buyButton: {
    backgroundColor: '#ecfdf5',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  buyButtonText: {
    color: '#064e3b',
    fontWeight: '800',
  },
});
