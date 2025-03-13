import { Tabs } from 'expo-router';
import { Home, MessageSquare, Settings } from 'lucide-react-native';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#6366F1',
        tabBarInactiveTintColor: '#6B7280',
        tabBarLabelStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 12,
        },
        // Hide the extra "Home Layout" tab that might be appearing
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Chat',
          tabBarIcon: ({ color, size }) => (
            <MessageSquare size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
      {/* Hide any other screens from the tab bar */}
      <Tabs.Screen
        name="LLMSelectionScreen"
        options={{
          href: null, // This makes this screen not accessible via tab navigation
        }}
      />
      {/* Hide any other screens from the tab bar */}
      <Tabs.Screen
        name="ChatWithAI"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="characterCreationChat"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="CharacterManager"
        options={{
          href: null,
        }}
      />

    </Tabs>
    
  );
}
