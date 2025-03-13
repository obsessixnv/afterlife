import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  ActivityIndicator,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getActiveCardContent } from '../utils/characterCardManager';

// Define message interface
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatWithAI() {
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  const inputRef = useRef<TextInput>(null);
  const llmType = params.llmType as string || 'local';
  const modelName = 'openai/gpt-4o-mini';

  // Load character card and initialize chat
  useEffect(() => {
    const initialize = async () => {
      try {
        // Load character card from storage
        const cardContent = await getActiveCardContent();
        setSystemPrompt(cardContent);
        console.log('Loaded character card for chat');
        
        // Add welcome message
        setMessages([{
          id: '1',
          text: "Hello! I'm your digital twin.",
          isUser: false,
          timestamp: new Date(),
        }]);
      } catch (error) {
        console.error('Error initializing chat:', error);
        setSystemPrompt('You are a helpful digital assistant.');
        
        // Add fallback welcome message
        setMessages([{
          id: '1',
          text: "Hello! I'm your AI assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date(),
        }]);
      } finally {
        setIsInitializing(false);
      }
    };
    
    initialize();
  }, []);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (flatListRef.current && messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInputText('');
    setIsLoading(true);
    Keyboard.dismiss();

    try {
      // Prepare conversation history for the API
      const conversationHistory = [
        // Add system message with character card
        {
          role: 'system',
          content: systemPrompt
        }
      ];
      
      // Add the conversation history
      messages.forEach(msg => {
        conversationHistory.push({
          role: msg.isUser ? 'user' : 'assistant',
          content: msg.text
        });
      });

      // Add the new user message
      conversationHistory.push({
        role: 'user',
        content: userMessage.text
      });

      // Call OpenRouter API
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: modelName,
          messages: conversationHistory,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ',
            'HTTP-Referer': 'https://afterlife.app', // Replace with your actual app URL
            'X-Title': 'AfterLife Digital Twin'
          }
        }
      );

      // Extract AI response
      const aiResponse = response.data.choices[0].message.content;

      // Add AI response to messages
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, aiMessage]);
      
      // Save conversation to AsyncStorage for persistence
      saveConversation([...messages, userMessage, aiMessage]);
      
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting. Please try again later.",
        isUser: false,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Save conversation to AsyncStorage
  const saveConversation = async (conversationMessages: Message[]) => {
    try {
      await AsyncStorage.setItem('chat_conversation', JSON.stringify(conversationMessages));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  // Load conversation from AsyncStorage (optional, add to useEffect if you want persistence)
  const loadConversation = async () => {
    try {
      const savedConversation = await AsyncStorage.getItem('chat_conversation');
      if (savedConversation) {
        setMessages(JSON.parse(savedConversation));
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const renderMessageItem = ({ item }: { item: Message }) => {
    const isUser = item.isUser;
    return (
      <View style={[
        styles.messageContainer,
        isUser ? styles.userMessageContainer : styles.aiMessageContainer
      ]}>
        {!isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={28} color="#6366F1" />
          </View>
        )}
        <View style={[
          styles.messageBubble,
          isUser ? styles.userBubble : styles.aiBubble
        ]}>
          <Text style={[
            styles.messageText,
            isUser ? styles.userMessageText : styles.aiMessageText
          ]}>
            {item.text}
          </Text>
        </View>
        {isUser && (
          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle" size={28} color="#5856D6" />
          </View>
        )}
      </View>
    );
  };

  if (isInitializing) {
    return (
      <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
        <SafeAreaView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={styles.loadingText}>Loading your digital twin...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <LinearGradient colors={['#FFDEE9', '#B5FFFC']} style={styles.gradient}>
        <SafeAreaView style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Your Digital Twin</Text>
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => router.push('/')}
            >
              <Ionicons name="create-outline" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.content}>
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderMessageItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.messagesContainer}
              showsVerticalScrollIndicator={false}
            />
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 90}
            style={styles.inputContainer}
          >
            <View style={styles.inputWrapper}>
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                multiline
                maxLength={1000}
                returnKeyType="send"
                onSubmitEditing={sendMessage}
                blurOnSubmit={false}
              />
              <TouchableOpacity 
                style={[
                  styles.sendButton,
                  {opacity: inputText.trim() === '' ? 0.5 : 1}
                ]}
                onPress={sendMessage}
                disabled={inputText.trim() === '' || isLoading}
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
    </TouchableWithoutFeedback>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(229, 231, 235, 0.5)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#1F2937',
  },
  settingsButton: {
    padding: 8,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  messagesContainer: {
    paddingTop: 16,
    paddingBottom: 16,
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
    maxWidth: '70%',
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
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    fontFamily: 'Inter-Regular',
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  aiMessageText: {
    color: '#374151',
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#4B5563',
  }
});
