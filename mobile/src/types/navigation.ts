import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';

// Root Stack Navigation
export type RootStackParamList = {
  Main: undefined;
};

export type RootStackNavigationProp = NativeStackNavigationProp<RootStackParamList>;

// Main Tab Navigation
export type MainTabParamList = {
  Home: undefined;
  Translation: undefined;
  HumanToPet: undefined;
  Training: undefined;
  Profile: undefined;
};

export type MainTabNavigationProp = BottomTabNavigationProp<MainTabParamList>;
