import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { getAllCharacterCards, CharacterCard } from '../utils/characterCardManager';

export default function ChatScreen() {
  const [characters, setCharacters] = useState<CharacterCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    setIsLoading(true);
    try {
      const cards = await getAllCharacterCards();
      setCharacters(cards);
    } catch (error) {
      console.error('Error loading character cards:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCharacter = async (character: CharacterCard) => {
    try {
      // Set this character as active
      await AsyncStorage.setItem('active_character_card', character.id);
      
      // Navigate to chat with this character
      router.push({
        pathname: '/ChatWithAI'
      });
    } catch (error) {
      console.error('Error selecting character:', error);
    }
  };

  const handleCreateNewCharacter = () => {
    router.push('/characterCreationChat');
  };

  const renderCharacterItem = ({ item }: { item: CharacterCard }) => {
    // Calculate a random color based on the character name for the avatar background
    const getAvatarColor = (name: string): [string, string] => {
      const colors: [string, string][] = [
        ['#FDA4AF', '#FB7185'], // rose
        ['#A5B4FC', '#818CF8'], // indigo
        ['#93C5FD', '#60A5FA'], // blue
        ['#BAE6FD', '#38BDF8'], // sky
        ['#99F6E4', '#2DD4BF'], // teal
        ['#A7F3D0', '#34D399'], // emerald
        ['#FDE68A', '#FBBF24'], // amber
      ];
      
      // Simple hash function to pick a color based on character name
      const hash = item.name.split('').reduce((acc, char) => {
        return acc + char.charCodeAt(0);
      }, 0);
      
      return colors[hash % colors.length];
    };
    
    const avatarColors = getAvatarColor(item.name);
    
    // Get first letter of name for avatar
    const initials = item.name.charAt(0).toUpperCase();

    return (
      <TouchableOpacity
        style={styles.characterCard}
        onPress={() => handleSelectCharacter(item)}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={avatarColors}
          style={styles.characterAvatar}
        >
          <Text style={styles.characterInitials}>{initials}</Text>
        </LinearGradient>
        
        <View style={styles.characterInfo}>
          <Text style={styles.characterName}>{item.name}</Text>
          <Text style={styles.characterDate}>
            Created {new Date(item.dateCreated).toLocaleDateString()}
          </Text>
        </View>
        
        <View style={styles.arrowContainer}>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="person-add-outline" size={64} color="#D1D5DB" style={styles.emptyIcon} />
      <Text style={styles.emptyTitle}>Start a Conversation</Text>
      <Text style={styles.emptyDescription}>
        Your digital twin is ready to chat. Begin by creating your personality profile or start a conversation directly.
      </Text>
      <TouchableOpacity
        style={styles.createButton}
        onPress={handleCreateNewCharacter}
      >
        <Text style={styles.createButtonText}>Create Your Digital Twin</Text>
      </TouchableOpacity>
    </View>
  );
  
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Digital Twins</Text>
        {characters.length > 0 && (
          <TouchableOpacity 
            style={styles.newTwinButton}
            onPress={handleCreateNewCharacter}
          >
            <Ionicons name="add" size={24} color="#6366F1" />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#6366F1" />
            <Text style={styles.loadingText}>Loading your digital twins...</Text>
          </View>
        ) : characters.length > 0 ? (
          <FlatList
            data={characters}
            renderItem={renderCharacterItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.charactersList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          renderEmptyState()
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    padding: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  newTwinButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyIcon: {
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  charactersList: {
    padding: 16,
  },
  characterCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  characterAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterInitials: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  characterInfo: {
    flex: 1,
    marginLeft: 16,
  },
  characterName: {
    fontSize: 17,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
    marginBottom: 4,
  },
  characterDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  arrowContainer: {
    padding: 4,
  },
});
