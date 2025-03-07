import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
// @ts-ignore
export default function LLMSelectionScreen() {
    const [selectedOption, setSelectedOption] = useState<'local' | 'api' | null>(null);
  
    return (
      <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}  // Use router.back() for back navigation
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.title}>Choose Your LLM</Text>
            <Text style={styles.subtitle}>Select which AI model will power your digital twin</Text>
          </View>
  
          <View style={styles.content}>
            <TouchableOpacity 
              style={[
                styles.optionCard, 
                selectedOption === 'local' && styles.selectedCard
              ]}
              onPress={() => setSelectedOption('local')}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="phone-portrait-outline" size={32} color="#374151" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Local LLM</Text>
                <Text style={styles.optionDescription}>
                  Run AI directly on your device. More private, works offline, but with more limited capabilities.
                </Text>
              </View>
              {selectedOption === 'local' && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                </View>
              )}
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={[
                styles.optionCard, 
                selectedOption === 'api' && styles.selectedCard
              ]}
              onPress={() => setSelectedOption('api')}
            >
              <View style={styles.optionIconContainer}>
                <Ionicons name="cloud-outline" size={32} color="#374151" />
              </View>
              <View style={styles.optionTextContainer}>
                <Text style={styles.optionTitle}>Cloud API LLM</Text>
                <Text style={styles.optionDescription}>
                  Connect to powerful AI in the cloud. Better responses and capabilities, but requires internet connection.
                </Text>
              </View>
              {selectedOption === 'api' && (
                <View style={styles.checkmarkContainer}>
                  <Ionicons name="checkmark-circle" size={24} color="#6366F1" />
                </View>
              )}
            </TouchableOpacity>
  
            <TouchableOpacity 
              style={[
                styles.continueButton,
                !selectedOption && styles.disabledButton
              ]}
              disabled={!selectedOption}
              onPress={() => {
                if (selectedOption) {
                  // Go to the next screen with the selected option
                  router.push({
                    pathname: '/ChatWithAI',
                    params: { llmType: selectedOption }
                  });
                }
              }}
            >
              <Text style={styles.continueButtonText}>Continue</Text>
              <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
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
    padding: 24,
    paddingTop: 12,
  },
  backButton: {
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#4B5563',
    marginBottom: 16,
  },
  content: {
    flex: 1,
    padding: 24,
    paddingTop: 16,
  },
  optionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: '#6366F1',
  },
  optionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  checkmarkContainer: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  continueButton: {
    backgroundColor: '#6366F1',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: '#A5B4FC',
    opacity: 0.8,
  },
  continueButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginRight: 8,
  },
});
