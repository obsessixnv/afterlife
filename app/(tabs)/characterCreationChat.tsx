// app/CharacterCreationChat.tsx
import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { saveCharacterCard } from '../utils/characterCardManager';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  isCardSummary?: boolean;
}

export default function CharacterCreationChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Welcome to character creation! I'll help you create your digital twin. First of all, What is your name and how you would like to be called?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCardCreated, setIsCardCreated] = useState(false);
  const [characterCard, setCharacterCard] = useState('');
  const [characterName, setCharacterName] = useState('My Digital Twin');
  const flatListRef = useRef<FlatList>(null);
  
  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    
    // Handle /agree command
    if (inputText.toLowerCase() === '/agree' || inputText.toLowerCase() === 'agree') {
      if (isCardCreated) {
        handleSaveCard();
        return;
      }
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Prepare conversation history
      const conversationHistory = messages.map(msg => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.text
      }));
      
      // Add user's new message
      conversationHistory.push({
        role: 'user',
        content: userMessage.text
      });
      
      // System prompt for character creation
      const systemMessage = {
        role: 'system',
        content: `You are an AI assistant helping the user create their digital twin character. 
                  Ask them questions about their personality, interests, communication style, and important life details.
                  After gathering sufficient information, generate a detailed character summary when the user asks for it or after 
                  10 message exchanges. When generating a summary, start with "## CHARACTER CARD SUMMARY ##" and end with 
                  "## END OF CHARACTER CARD ##". Ask the user to respond with "agree" if they approve this character card.
                  
                  If you detect a name for this character, also include "## CHARACTER NAME: [detected name] ##" in your summary.
                  
                  Make the character summary formatted as a system prompt for an AI model to follow when impersonating the user.`
      };
      
      // API Call
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'openai/gpt-4o-mini',
          messages: [systemMessage, ...conversationHistory],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ',
            'HTTP-Referer': 'https://afterlife.app',
            'X-Title': 'AfterLife Character Creation'
          }
        }
      );
      
      const aiResponse = response.data.choices[0].message.content;
      
      // Check if response contains character card summary
      const isSummary = aiResponse.includes('## CHARACTER CARD SUMMARY ##') && 
                        aiResponse.includes('## END OF CHARACTER CARD ##');
      
      if (isSummary) {
        // Extract character card content
        const summaryStart = aiResponse.indexOf('## CHARACTER CARD SUMMARY ##');
        const summaryEnd = aiResponse.indexOf('## END OF CHARACTER CARD ##') + '## END OF CHARACTER CARD ##'.length;
        const extractedCard = aiResponse.substring(summaryStart, summaryEnd);
        
        // Extract character name if provided
        const nameMatch = aiResponse.match(/## CHARACTER NAME: (.*?) ##/);
        if (nameMatch && nameMatch[1]) {
          setCharacterName(nameMatch[1].trim());
        }
        
        // Store the card and set flag
        setCharacterCard(extractedCard);
        setIsCardCreated(true);
      }
      
      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
        isCardSummary: isSummary
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error calling API:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, there was an error. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSaveCard = async () => {
    try {
      if (!characterCard) {
        Alert.alert('Error', 'No character card found to save.');
        return;
      }
      
      // Process card content - remove markers
      let processedCard = characterCard
        .replace('## CHARACTER CARD SUMMARY ##', '')
        .replace('## END OF CHARACTER CARD ##', '')
        .replace(/## CHARACTER NAME: (.*?) ##/g, '')
        .trim();
      
      // Save to storage using utility function
      const cardId = await saveCharacterCard(processedCard, characterName);
      
      // Confirm to user
      const confirmMessage: Message = {
        id: Date.now().toString(),
        text: `Your character card "${characterName}" has been saved! You can now start chatting with your digital twin.`,
        isUser: false,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, confirmMessage]);
      
      // Navigate after brief delay
      setTimeout(() => {
        router.push({
          pathname: '/ChatWithAI',
          params: { useStoredCard: 'true' }
        });
      }, 1500);
      
    } catch (error) {
      console.error('Error saving character card:', error);
      Alert.alert('Error', 'Failed to save your character card. Please try again.');
    }
  };
  
  // Render message item function
  const renderMessageItem = ({ item }: { item: Message }) => {
    const isCardSummary = item.isCardSummary;
    
    return (
      <View style={[
        styles.messageContainer,
        item.isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {!item.isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={28} color="#6366F1" />
          </View>
        )}
        
        <View style={[
          styles.messageBubble,
          item.isUser ? styles.userBubble : styles.aiBubble,
          isCardSummary && styles.cardSummaryBubble
        ]}>
          <Text style={[
            styles.messageText,
            item.isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {item.text}
          </Text>
          
          {/* Add action buttons for card summary */}
          {isCardSummary && (
            <View style={styles.cardActionButtons}>
              <TouchableOpacity 
                style={styles.agreeButton}
                onPress={handleSaveCard}
              >
                <Text style={styles.buttonText}>Approve & Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.editButton}
                onPress={() => setInputText("I'd like to make some changes.")}
              >
                <Text style={styles.editButtonText}>Request Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {item.isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={28} color="#5856D6" />
          </View>
        )}
      </View>
    );
  };

  return (
    <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create Your Digital Twin</Text>
        </View>
        
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessageItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        />
        
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 90}
          style={styles.inputContainer}
        >
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Type a message..."
              placeholderTextColor="#9CA3AF"
              multiline
            />
            <TouchableOpacity 
              style={[
                styles.sendButton,
                {opacity: inputText.trim() === '' || isLoading ? 0.5 : 1}
              ]}
              onPress={sendMessage}
              disabled={isLoading || inputText.trim() === ''}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Ionicons name="send" size={22} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  messagesContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 16,
    padding: 12,
    marginHorizontal: 4,
  },
  userBubble: {
    backgroundColor: '#6366F1',
    borderTopRightRadius: 4,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 4,
  },
  cardSummaryBubble: {
    backgroundColor: '#F0F9FF',
    borderWidth: 1,
    borderColor: '#BAE6FD',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-Regular',
  },
  aiMessageText: {
    color: '#374151',
    fontFamily: 'Inter-Regular',
  },
  cardActionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  agreeButton: {
    backgroundColor: '#6366F1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  editButtonText: {
    color: '#4B5563',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  inputContainer: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(229, 231, 235, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    maxHeight: 120,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sendButton: {
    backgroundColor: '#6366F1',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});
