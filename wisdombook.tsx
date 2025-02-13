import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const parentingTips = [
  {
    id: '1',
    title: "Learning Independence",
    message: "When she's taking forever to put on her shoes, remember: she's learning independence with each tiny struggle. Deep breath - she's not giving you a hard time, she's having a hard time.",
    emoji: '👟',
  },
  {
    id: '2',
    title: "Big Feelings",
    message: "During tantrums, remember that big emotions are hard for little hearts. You're her safe space to feel all feelings.",
    emoji: '💗',
  },
  {
    id: '3',
    title: "Growing Mind",
    message: "When she asks 'why' for the hundredth time, remember: her curiosity is building her understanding of the world.",
    emoji: '🌱',
  },
  {
    id: '4',
    title: "Little Helper",
    message: "When simple tasks take longer because she wants to help, remember: you're raising a person who wants to contribute.",
    emoji: '🌟',
  },
  {
    id: '5',
    title: "Gentle Reminder",
    message: "Your patience in her slow moments is teaching her it's okay to take the time she needs.",
    emoji: '🫂',
  },
];

export default function WisdomBookScreen() {
  const insets = useSafeAreaInsets();
  const [currentPage, setCurrentPage] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const position = new Animated.Value(0);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      position.setValue(gestureState.dx);
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx < -50 && currentPage < parentingTips.length - 1) {
        // Swipe left
        Animated.spring(position, {
          toValue: -width,
          useNativeDriver: true,
        }).start(() => {
          setCurrentPage(currentPage + 1);
          position.setValue(0);
        });
      } else if (gestureState.dx > 50 && currentPage > 0) {
        // Swipe right
        Animated.spring(position, {
          toValue: width,
          useNativeDriver: true,
        }).start(() => {
          setCurrentPage(currentPage - 1);
          position.setValue(0);
        });
      } else {
        // Return to center
        Animated.spring(position, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    },
  });

  const toggleFavorite = async (id: string) => {
    try {
      const newFavorites = favorites.includes(id)
        ? favorites.filter(fav => fav !== id)
        : [...favorites, id];
      setFavorites(newFavorites);
      await AsyncStorage.setItem('favorite_tips', JSON.stringify(newFavorites));
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const tip = parentingTips[currentPage];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View
        style={[
          styles.pageContainer,
          {
            transform: [{ translateX: position }],
          },
        ]}
        {...panResponder.panHandlers}
      >
        <View style={styles.tipCard}>
          <Text style={styles.emoji}>{tip.emoji}</Text>
          <Text style={styles.title}>{tip.title}</Text>
          <Text style={styles.message}>{tip.message}</Text>
          <TouchableOpacity
            style={styles.heartButton}
            onPress={() => toggleFavorite(tip.id)}
          >
            <Ionicons
              name={favorites.includes(tip.id) ? 'heart' : 'heart-outline'}
              size={32}
              color="#9F7AEA"
            />
          </TouchableOpacity>
        </View>
      </Animated.View>
      
      <View style={styles.navigation}>
        <Text style={styles.pageNumber}>
          {currentPage + 1} / {parentingTips.length}
        </Text>
      </View>
      
      <View style={styles.instructions}>
        <Text style={styles.instructionText}>
          Swipe left or right to flip through the wisdom pages
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF5F7',
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  emoji: {
    fontSize: 48,
    textAlign: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4A5568',
    textAlign: 'left',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  message: {
    fontSize: 18,
    color: '#718096',
    lineHeight: 28,
    textAlign: 'left',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  heartButton: {
    alignItems: 'center',
  },
  navigation: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
  },
  pageNumber: {
    color: '#718096',
    fontSize: 16,
  },
  instructions: {
    padding: 16,
    alignItems: 'center',
  },
  instructionText: {
    color: '#A0AEC0',
    fontSize: 14,
    textAlign: 'center',
  },
});