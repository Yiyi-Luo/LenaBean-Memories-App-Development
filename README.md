# LenaBean-Memories-App-Development

## 1. Initial Project and Dependencies
```bash
# Create project
npx create-expo-app LenaBeanMemories
cd LenaBeanMemories

# Create structure
mkdir -p app/(tabs)
mkdir -p app/utils
mkdir -p assets

# Install core dependencies
npm install @react-navigation/native @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context
npx expo install @react-native-async-storage/async-storage
npx expo install expo-image-picker
npx expo install expo-notifications
npx expo install @expo/vector-icons react-native-gesture-handler react-native-reanimated
```

## 2. Create Core Files
Create and populate key files:

```bash
touch app/(tabs)/index.js
touch app/(tabs)/add.tsx
touch app/(tabs)/reminders.tsx
touch app/(tabs)/_layout.tsx
touch app/utils/storage.ts
touch app/types.ts
touch app/(tabs)/wisdombook.tsx
```

## 3. Setup Assets
```bash
# Create assets directory
mkdir -p assets

# Create placeholder images
curl https://picsum.photos/1024 -o assets/icon.png
curl https://picsum.photos/1024 -o assets/splash.png
```

## 4. Update Dependencies
```bash
# Install and update all required packages
npx expo install expo@~52.0.26 expo-blur@~14.0.3 expo-constants@~17.0.4 \
expo-font@~13.0.3 expo-haptics@~14.0.1 expo-linking@~7.0.4 \
expo-router@~4.0.17 expo-splash-screen@~0.29.21 expo-status-bar@~2.0.1 \
expo-symbols@~0.2.1 expo-system-ui@~4.0.7 expo-web-browser@~14.0.2 \
react-native@0.76.6 expo-image-picker@~16.0.4 expo-notifications@~0.29.12 \
jest-expo@~52.0.3 expo-dev-client
```

## 5. Development Build Setup
```bash
# Install EAS CLI
npm install -g eas-cli

# Configure and create build
eas login
eas build:configure
eas build --profile development --platform ios
```

## 6. Run Development Server
```bash
npx expo start --dev-client
```

# Here are the steps we added after the initial setup:

1. First build: `eas build --platform ios --profile preview`
2. Test UI changes: `npx expo start` (using Expo Go)
3. Build after notification changes: `eas build --platform ios --profile preview`

## 7. Notification Feature Setup
```javascript
// In reminders.tsx
- Added notification handler
- Set up daily notifications for 7:30 PM
- Added notification permission checks
- Implemented notification toggle with AsyncStorage
```

## 8. Added Wisdom Book Feature
```bash
# Install additional dependencies
npx expo install @expo/vector-icons react-native-gesture-handler react-native-reanimated
```
- Created new file `app/(tabs)/wisdombook.tsx`(NOTE: Already reflected on step 2: Create Core Files)
- Modified `app/(tabs)/_layout.tsx` to add the new tab
- Implemented swipeable interface
- Added favorite functionality
- Added page counting and navigation

## 9. UI Improvements
```javascript
// Modified tab navigation in app/(tabs)/_layout.tsx
- Removed triangle indicators
- Reordered tabs (Wisdom, Memories, Add, Reminders)
- Added custom icons for each tab

// In reminders.tsx
- Changed from showing all tips to one random daily tip
```

## 10. Build Process
```bash
# For testing UI changes
npx expo start

# For building standalone app with notifications
eas build --platform ios --profile preview
```

## File Organization Overview

```
LenaBeanMemories/
├── app/
│   ├── (tabs)/
│   │   ├── index.js       # Main memories list
│   │   ├── add.tsx        # Add new memory form
│   │   ├── reminders.tsx  # Reminders and tips
│   │   ├── wisdombook.tsx # Wisdom book feature
│   │   └── _layout.tsx    # Tab navigation setup
│   └── utils/
│       ├── storage.ts     # AsyncStorage management
│       └── types.ts       # TypeScript definitions
├── assets/
│   ├── icon.png          # App icon
│   └── splash.png        # Splash screen
├── app.json              # App configuration
└── package.json          # Dependencies
```
