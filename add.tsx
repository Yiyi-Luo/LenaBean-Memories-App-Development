import React, { useState } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView,
  Image,
  Alert
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { saveMemory } from '../utils/storage';
import { router } from 'expo-router';

const categories = [
  { id: 'sweet', label: 'Sweet', emoji: '💝' },
  { id: 'funny', label: 'Funny', emoji: '😄' },
  { id: 'proud', label: 'Proud', emoji: '🌟' },
  { id: 'milestone', label: 'Milestone', emoji: '🎯' },
  { id: 'creative', label: 'Creative', emoji: '🎨' },
  { id: 'kind', label: 'Kind', emoji: '🫂' },
];

export default function AddMemoryScreen() {
  const insets = useSafeAreaInsets();
  const [memory, setMemory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    try {
      if (!memory || !selectedCategory) {
        Alert.alert('Missing Info', 'Please fill in the memory and select a category');
        return;
      }

      const newMemory = {
        id: Date.now().toString(), // Simple way to generate unique IDs
        content: memory,
        category: selectedCategory,
        date: new Date().toISOString(),
        imageUri: image
      };

      await saveMemory(newMemory);
      
      // Show success message
      Alert.alert(
        'Memory Saved!',
        'Your sweet memory has been saved 💝',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setMemory('');
              setSelectedCategory(null);
              setImage(null);
              // Navigate back to memories screen
              router.push('/(tabs)/');
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>Capture a Sweet Moment ✨</Text>
        
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            multiline
            placeholder="What did Lena Bean do today?"
            value={memory}
            onChangeText={setMemory}
            placeholderTextColor="#A0AEC0"
          />
        </View>

        <Text style={styles.sectionTitle}>Choose a Category</Text>
        <View style={styles.categoryContainer}>
          {categories.map(category => (
            <TouchableOpacity 
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.id && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={[
                styles.categoryLabel,
                selectedCategory === category.id && styles.selectedCategoryText
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.photoButton} onPress={pickImage}>
          <Text style={styles.photoButtonText}>
            {image ? '📸 Change Photo' : '📸 Add Photo'}
          </Text>
        </TouchableOpacity>

        {image && (
          <Image source={{ uri: image }} style={styles.previewImage} />
        )}

        <TouchableOpacity 
          style={[
            styles.saveButton,
            (!memory || !selectedCategory) && styles.saveButtonDisabled
          ]}
          onPress={handleSave}
          disabled={!memory || !selectedCategory}
        >
          <Text style={styles.saveButtonText}>Save Memory</Text>
        </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A5568',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 20,
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    minHeight: 100,
    fontSize: 16,
    color: '#4A5568',
    textAlignVertical: 'top',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  categoryButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  selectedCategory: {
    backgroundColor: '#9F7AEA',
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryLabel: {
    fontSize: 12,
    color: '#4A5568',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
  photoButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  photoButtonText: {
    fontSize: 16,
    color: '#4A5568',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#9F7AEA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 32,
  },
  saveButtonDisabled: {
    backgroundColor: '#CBD5E0',
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '600',
  },
});