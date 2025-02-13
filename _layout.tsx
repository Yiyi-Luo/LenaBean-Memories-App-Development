import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FFF5F7',
        },
        headerTitleStyle: {
          color: '#4A5568',
        },
        tabBarActiveTintColor: '#9F7AEA',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Lena Bean",
          tabBarLabel: "Memories",
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: "New Memory",
          tabBarLabel: "Add",
        }}
      />
      <Tabs.Screen
        name="wisdombook"
        options={{
          title: "Wisdom Book",
          tabBarLabel: "Wisdom",
        }}
      />
      <Tabs.Screen
        name="reminders"
        options={{
          title: "Reminders",
          tabBarLabel: "Reminders",
        }}
      />
    </Tabs>
  );
}