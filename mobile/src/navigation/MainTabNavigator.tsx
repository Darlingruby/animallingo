import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MainTabParamList } from '../types/navigation';
import { HomeScreen } from '../screens/HomeScreen';
import { TranslationScreen } from '../screens/TranslationScreen';
import { HumanToPetScreen } from '../screens/HumanToPetScreen';
import { TrainingScreen } from '../screens/TrainingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { useTheme } from 'react-native-paper';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const MainTabNavigator: React.FC = () => {
  const theme = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string;

          switch (route.name) {
            case 'Home':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'Translation':
              iconName = focused ? 'translate' : 'translate-variant';
              break;
            case 'HumanToPet':
              iconName = focused ? 'microphone' : 'microphone-outline';
              break;
            case 'Training':
              iconName = focused ? 'brain' : 'brain';
              break;
            case 'Profile':
              iconName = focused ? 'account' : 'account-outline';
              break;
            default:
              iconName = 'circle';
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: 'gray',
        headerShown: true,
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
      })}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ title: 'Pet Translator' }}
      />
      <Tab.Screen 
        name="Translation" 
        component={TranslationScreen} 
        options={{ title: 'Translate Pet' }}
      />
      <Tab.Screen 
        name="HumanToPet" 
        component={HumanToPetScreen} 
        options={{ title: 'Talk to Pet' }}
      />
      <Tab.Screen 
        name="Training" 
        component={TrainingScreen} 
        options={{ title: 'Train Model' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ title: 'My Profile' }}
      />
    </Tab.Navigator>
  );
};
