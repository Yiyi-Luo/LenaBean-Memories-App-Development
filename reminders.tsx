import React, { useState, useEffect } from 'react';
import { 
  Text, 
  View, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Switch,
  Alert 
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getMemories, type Memory } from '../utils/storage';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const TIPS_ENABLED_KEY = 'tips_enabled';

const parentingTips = [
  {
    id: '1',
    title: "Learning Independence",
    message: "When she's taking forever to put on her shoes, remember: she's learning independence with each tiny struggle. Deep breath - she's not giving you a hard time, she's having a hard time.",
    emoji: '👟'
  },
  {
    id: '2',
    title: "Big Feelings",
    message: "During tantrums, remember that big emotions are hard for little hearts. You're her safe space to feel all feelings.",
    emoji: '💗'
  },
  {
    id: '3',
    title: "Growing Mind",
    message: "When she asks 'why' for the hundredth time, remember: her curiosity is building her understanding of the world.",
    emoji: '🌱'
  },
  {
    id: '4',
    title: "Little Helper",
    message: "When simple tasks take longer because she wants to help, remember: you're raising a person who wants to contribute.",
    emoji: '🌟'
  },
  {
    id: '5',
    title: "Gentle Reminder",
    message: "Your patience in her slow moments is teaching her it's okay to take the time she needs.",
    emoji: '🫂'
  }
];

const MemoryFlashback = ({ memory }) => (
  <View style={styles.flashbackCard}>
    <Text style={styles.flashbackDate}>On this day...</Text>
    <Text style={styles.flashbackContent}>{memory.content}</Text>
    <View style={styles.categoryTag}>
      <Text style={styles.categoryText}>
        {memory.category} ✨
      </Text>
    </View>
  </View>
);

const ParentingTipCard = ({ tip }) => (
  <View style={styles.tipCard}>
    <Text style={styles.tipEmoji}>{tip.emoji}</Text>
    <Text style={styles.tipTitle}>{tip.title}</Text>
    <Text style={styles.tipMessage}>{tip.message}</Text>
  </View>
);

export default function RemindersScreen() {
  const insets = useSafeAreaInsets();
  const [dailyTipsEnabled, setDailyTipsEnabled] = useState(false);
  const [flashbacksEnabled, setFlashbacksEnabled] = useState(false);
  const [todaysMemories, setTodaysMemories] = useState([]);

  useEffect(() => {
    checkAndLoadMemories();
    setupNotifications();
    loadTipsState();

    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
    });

    return () => subscription.remove();
  }, []);

  const loadTipsState = async () => {
    try {
      const enabled = await AsyncStorage.getItem(TIPS_ENABLED_KEY);
      if (enabled !== null) {
        setDailyTipsEnabled(enabled === 'true');
      }
    } catch (error) {
      console.error('Error loading tips state:', error);
    }
  };

  const checkAndLoadMemories = async () => {
    const allMemories = await getMemories();
    const today = new Date();
    
    const memories = allMemories.filter(memory => {
      const memoryDate = new Date(memory.date);
      return memoryDate.getDate() === today.getDate() && 
             memoryDate.getMonth() === today.getMonth() &&
             memoryDate.getFullYear() < today.getFullYear();
    });
    
    setTodaysMemories(memories);
  };

  const setupNotifications = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissions needed', 'Please enable notifications to receive daily reminders');
      return;
    }
  };

  const toggleDailyTips = async (enabled) => {
    setDailyTipsEnabled(enabled);
    try {
      await AsyncStorage.setItem(TIPS_ENABLED_KEY, enabled.toString());

      if (enabled) {
        await Notifications.cancelAllScheduledNotificationsAsync();
        
        // Schedule notifications for next 7 days at 07:30 PM
        for (let i = 0; i < 7; i++) {
          const scheduleTime = new Date();
          const now = new Date();
          scheduleTime.setHours(19, 30, 0, 0); // 07:30 PM
          scheduleTime.setSeconds(0);
          scheduleTime.setMilliseconds(0);
          
          // If the time has passed today, schedule for tomorrow
          if (now > scheduleTime) {
            scheduleTime.setDate(scheduleTime.getDate() + 1);
          }
          
          console.log('Scheduled notifications for:', scheduleTime);
          const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
          console.log('All scheduled notifications:', scheduledNotifications);

          console.log(`Scheduling notification for: ${scheduleTime}`);
          await Notifications.scheduleNotificationAsync({
            content: {
              title: "Daily Parenting Wisdom 💝",
              body: parentingTips[Math.floor(Math.random() * parentingTips.length)].message,
            },
            trigger: scheduleTime,
          });
        }

        Alert.alert('Success', 'You will receive notifications at 07:30 pm');
      } else {
        await Notifications.cancelAllScheduledNotificationsAsync();
      }
    } catch (error) {
      console.error('Error toggling tips:', error);
      Alert.alert('Error', 'Failed to set up notifications');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.headerText}>Reminders & Reflections 💭</Text>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Memory Flashbacks</Text>
            <Switch
              value={flashbacksEnabled}
              onValueChange={setFlashbacksEnabled}
              trackColor={{ false: '#CBD5E0', true: '#9F7AEA' }}
            />
          </View>
          {todaysMemories.length > 0 ? (
            todaysMemories.map(memory => (
              <MemoryFlashback key={memory.id} memory={memory} />
            ))
          ) : (
            <Text style={styles.emptyText}>No memories from this day in previous years</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Daily Parenting Wisdom</Text>
            <Switch
              value={dailyTipsEnabled}
              onValueChange={toggleDailyTips}
              trackColor={{ false: '#CBD5E0', true: '#9F7AEA' }}
            />
          </View>
          <ParentingTipCard tip={parentingTips[Math.floor(Math.random() * parentingTips.length)]} />
        </View>
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
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A5568',
    marginVertical: 16,
    textAlign: 'center',
  },
  section: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4A5568',
  },
  flashbackCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  flashbackDate: {
    fontSize: 14,
    color: '#9F7AEA',
    fontWeight: '600',
    marginBottom: 8,
  },
  flashbackContent: {
    fontSize: 16,
    color: '#4A5568',
    marginBottom: 8,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#718096',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  tipEmoji: {
    fontSize: 24,
    marginBottom: 8,
    textAlign: 'center',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A5568',
    marginBottom: 8,
    textAlign: 'center',
  },
  tipMessage: {
    fontSize: 14,
    color: '#718096',
    lineHeight: 20,
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
  emptyText: {
    textAlign: 'center',
    color: '#718096',
    fontSize: 14,
    fontStyle: 'italic',
  },
});