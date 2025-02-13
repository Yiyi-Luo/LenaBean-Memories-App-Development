import AsyncStorage from '@react-native-async-storage/async-storage';

export type Memory = {
  id: string;
  content: string;
  category: string;
  date: string;
  imageUri?: string;
};

const STORAGE_KEY = 'lenabean_memories';

export async function saveMemory(memory: Memory): Promise<void> {
  try {
    // Get existing memories
    const existingMemories = await getMemories();
    
    // Add new memory to the beginning of the array
    const updatedMemories = [memory, ...existingMemories];
    
    // Save all memories
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
  } catch (error) {
    console.error('Error saving memory:', error);
    throw error;
  }
}

export async function getMemories(): Promise<Memory[]> {
  try {
    const memories = await AsyncStorage.getItem(STORAGE_KEY);
    return memories ? JSON.parse(memories) : [];
  } catch (error) {
    console.error('Error getting memories:', error);
    return [];
  }
}

export async function deleteMemory(id: string): Promise<void> {
  try {
    const memories = await getMemories();
    const updatedMemories = memories.filter(memory => memory.id !== id);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedMemories));
  } catch (error) {
    console.error('Error deleting memory:', error);
    throw error;
  }
}