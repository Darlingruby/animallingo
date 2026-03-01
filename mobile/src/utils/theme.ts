import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#4A90D9',
    primaryContainer: '#E3F2FD',
    secondary: '#4CAF50',
    secondaryContainer: '#E8F5E9',
    tertiary: '#FF9800',
    error: '#F44336',
    background: '#F5F5F5',
    surface: '#FFFFFF',
    surfaceVariant: '#F0F0F0',
    outline: '#BDBDBD',
    outlineVariant: '#E0E0E0',
    shadow: '#000000',
    scrim: '#000000',
    inverseSurface: '#212121',
    inverseOnSurface: '#FFFFFF',
    inversePrimary: '#82B1FF',
    elevation: {
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#FAFAFA',
      level3: '#F5F5F5',
      level4: '#F0F0F0',
      level5: '#EBEBEB',
    },
  },
};
