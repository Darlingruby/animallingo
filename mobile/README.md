# AnimalLingo - Mobile App

## Overview
React Native mobile application for bidirectional animal communication translation.

## Prerequisites
- Node.js 20 LTS
- React Native CLI
- Xcode 15+ (for iOS)
- Android Studio (for Android)
- CocoaPods (for iOS)

## Setup

### 1. Install Dependencies
```bash
cd mobile
npm install
```

### 2. iOS Setup
```bash
cd ios
pod install
cd ..
npx react-native run-ios
```

### 3. Android Setup
```bash
npx react-native run-android
```

## Project Structure
```
src/
├── components/     # Reusable UI components
├── screens/        # Screen components
│   ├── HomeScreen.tsx
│   ├── TranslationScreen.tsx
│   ├── HumanToPetScreen.tsx
│   ├── TrainingScreen.tsx
│   └── ProfileScreen.tsx
├── navigation/     # Navigation setup
├── store/          # Redux Toolkit state management
├── services/       # API clients
├── hooks/          # Custom React hooks
├── types/          # TypeScript types
└── utils/          # Utility functions
```

## Environment Variables
Create `.env` file:
```
API_URL=http://localhost:3000
```

## Key Dependencies
- react-native: 0.73+
- @reduxjs/toolkit: State management
- react-navigation: Navigation
- react-native-audio-recorder-player: Audio recording
- axios: HTTP client

## Features
- 🔊 Real-time animal vocalization translation
- 🗣️ Human-to-animal message synthesis
- 📊 Training mode to improve accuracy
- 🐕 Multi-species support (dogs, cats, birds, dolphins, reptiles, insects)
- 📱 Cross-platform (iOS/Android)

## Development
```bash
# Start Metro bundler
npx react-native start

# Run on iOS
npx react-native run-ios

# Run on Android
npx react-native run-android
```

## Build for Production

### iOS
```bash
npx react-native run-ios --configuration Release
```

### Android
```bash
cd android
./gradlew assembleRelease
```

See `docs/deployment/APP_STORE_GUIDE.md` for store submission.
