import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2864&auto=format&fit=crop' }}
            style={styles.headerImage}
          />
          <View style={styles.headerOverlay} />
          <Text style={styles.title}>AfterLife</Text>
          <Text style={styles.subtitle}>Your Digital Twin Companion</Text>
        </View>

        {/* Remove any margin or padding here that might create the line */}
        <View style={styles.content}>
          <Text style={styles.welcomeText}>
            Welcome to AfterLife, where technology meets personality to create your unique digital twin.
          </Text>

          <View style={styles.featuresContainer}>
            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🧑‍🎨 Create Your Twin</Text>
              <Text style={styles.featureDescription}>
                Build a digital version of yourself through natural conversation.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>💬 Chat Anytime</Text>
              <Text style={styles.featureDescription}>
                Engage in meaningful conversations with your digital twin.
              </Text>
            </View>

            <View style={styles.featureCard}>
              <Text style={styles.featureTitle}>🔒 Secure & Private</Text>
              <Text style={styles.featureDescription}>
                Your data stays on your device, ensuring complete privacy.
              </Text>
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.plusButton}
          onPress={() => router.push('/LLMSelectionScreen')}
        >
          <Ionicons name="add" size={32} color="#FFFFFF" />
        </TouchableOpacity>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    // Remove any bottom border here
    borderBottomWidth: 0,
  },
  headerImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
  },
  title: {
    fontSize: 38,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.6)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 17,
    fontFamily: 'Inter-Regular',
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 24,
    // Remove any border or separation here
    borderTopWidth: 0,
    marginTop: 0, // Remove any margin that could create a gap
    paddingTop: 16, // Adjust padding as needed
    // Make sure the background is transparent or matches gradient
    backgroundColor: 'transparent',
  },
  welcomeText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#374151',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  featuresContainer: {
    paddingVertical: 10,
  },
  featureCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  featureTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  plusButton: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#6366F1',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    zIndex: 999,
  },
});
