// app/utils/characterCardManager.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Interface for character cards
export interface CharacterCard {
  content: string;
  dateCreated: number;
  lastModified: number;
  name: string;
  id: string;
}

// Save a character card
export const saveCharacterCard = async (
  content: string, 
  name: string = 'My Digital Twin'
): Promise<string> => {
  try {
    // Generate a unique ID
    const id = `card_${Date.now()}`;
    
    const card: CharacterCard = {
      content,
      dateCreated: Date.now(),
      lastModified: Date.now(),
      name,
      id,
    };
    
    // Save the card
    await AsyncStorage.setItem(id, JSON.stringify(card));
    
    // Keep track of all saved cards
    const cardIds = await getCardIds();
    cardIds.push(id);
    await AsyncStorage.setItem('character_card_ids', JSON.stringify(cardIds));
    
    // Save as current active card
    await AsyncStorage.setItem('active_character_card', id);
    
    return id;
  } catch (error) {
    console.error('Error saving character card:', error);
    throw new Error('Failed to save character card');
  }
};

// Load a specific character card
export const loadCharacterCard = async (id: string): Promise<CharacterCard | null> => {
  try {
    const cardJson = await AsyncStorage.getItem(id);
    if (!cardJson) return null;
    
    return JSON.parse(cardJson) as CharacterCard;
  } catch (error) {
    console.error('Error loading character card:', error);
    return null;
  }
};

// Get all card IDs
export const getCardIds = async (): Promise<string[]> => {
  try {
    const idsJson = await AsyncStorage.getItem('character_card_ids');
    if (!idsJson) return [];
    
    return JSON.parse(idsJson) as string[];
  } catch (error) {
    console.error('Error getting card IDs:', error);
    return [];
  }
};

// Get all character cards
export const getAllCharacterCards = async (): Promise<CharacterCard[]> => {
  try {
    const cardIds = await getCardIds();
    const cards: CharacterCard[] = [];
    
    for (const id of cardIds) {
      const card = await loadCharacterCard(id);
      if (card) cards.push(card);
    }
    
    return cards;
  } catch (error) {
    console.error('Error getting all character cards:', error);
    return [];
  }
};

// Get the active character card
export const getActiveCharacterCard = async (): Promise<CharacterCard | null> => {
  try {
    const activeId = await AsyncStorage.getItem('active_character_card');
    if (!activeId) return null;
    
    return loadCharacterCard(activeId);
  } catch (error) {
    console.error('Error getting active character card:', error);
    return null;
  }
};

// Get active card content (for using as system prompt)
export const getActiveCardContent = async (): Promise<string> => {
  try {
    const card = await getActiveCharacterCard();
    return card?.content || 'You are a helpful digital assistant.';
  } catch (error) {
    console.error('Error getting active card content:', error);
    return 'You are a helpful digital assistant.';
  }
};

// Add this to your characterCardManager.ts file

// Set a card as active
export const setActiveCharacterCard = async (id: string): Promise<boolean> => {
  try {
    const card = await loadCharacterCard(id);
    if (!card) return false;
    
    await AsyncStorage.setItem('active_character_card', id);
    return true;
  } catch (error) {
    console.error('Error setting active character card:', error);
    return false;
  }
};

