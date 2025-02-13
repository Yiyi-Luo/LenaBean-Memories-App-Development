import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  Image,
  TouchableOpacity,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMemories, type Memory, deleteMemory } from '../utils/storage';
import { useFocusEffect } from 'expo-router';

const getCategoryEmoji = (category: string) => {
  const emojis = {
    sweet: '💝',
    proud: '🌟',
    funny: '😄',
    milestone: '🎯',
    creative: '🎨',
    kind: '🫂',
  };
  return emojis[category] || '✨';
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('en-US', options);
};

const MemoryCard = ({ memory, onDelete }: { memory: Memory; onDelete: (id: string) => void }) => {
  const handleLongPress = () => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => onDelete(memory.id)
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onLongPress={handleLongPress}
      delayLongPress={500}
    >
      <Text style={styles.date}>{formatDate(memory.date)}</Text>
      <Text style={styles.content}>{memory.content}</Text>
      {memory.imageUri && (
        <Image 
          source={{ uri: memory.imageUri }} 
          style={styles.memoryImage}
          resizeMode="cover"
        />
      )}
      <View style={styles.categoryTag}>
        <Text style={styles.categoryText}>
          {getCategoryEmoji(memory.category)} {memory.category}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default function MemoriesScreen() {
  const insets = useSafeAreaInsets();
  const [memories, setMemories] = useState<Memory[]>([]);

  const loadMemories = async () => {
    const loadedMemories = await getMemories();
    setMemories(loadedMemories);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadMemories();
    }, [])
  );

  const handleDeleteMemory = async (id: string) => {
    try {
      await deleteMemory(id);
      await loadMemories(); // Reload memories after deletion
      Alert.alert('Success', 'Memory deleted successfully');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete memory');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.headerText}>Sweet Memories ✨</Text>
        {memories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No memories yet. Add your first sweet moment! 💝
            </Text>
            <Text style={styles.emptySubText}>
              Tap the "Add" tab below to create a new memory.
            </Text>
          </View>
        ) : (
          memories.map(memory => (
            <MemoryCard 
              key={memory.id} 
              memory={memory}
              onDelete={handleDeleteMemory}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 16,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  date: {
    fontSize: 14,
    color: '#718096',
    marginBottom: 8,
  },
  content: {
    fontSize: 16,
    color: '#4A5568',
    lineHeight: 24,
    marginBottom: 12,
  },
  memoryImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
  },
  categoryTag: {
    backgroundColor: '#F7FAFC',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: 14,
    color: '#718096',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 64,
    paddingHorizontal: 24,
  },
  emptyText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 18,
    marginBottom: 8,
  },
  emptySubText: {
    textAlign: 'center',
    color: '#A0AEC0',
    fontSize: 14,
  },
});