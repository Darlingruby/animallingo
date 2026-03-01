import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  Card,
  Button,
  Avatar,
  useTheme,
  List,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { selectPet } from '../store/slices/petsSlice';
import { useNavigation } from '@react-navigation/native';
import { MainTabNavigationProp } from '../types/navigation';

export const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<MainTabNavigationProp>();
  const dispatch = useDispatch();
  const { pets, selectedPetId } = useSelector((state: RootState) => state.pets);
  const { history } = useSelector((state: RootState) => state.translations);
  const { user } = useSelector((state: RootState) => state.auth);

  const selectedPet = pets.find((p) => p.id === selectedPetId);
  const recentTranslations = history.slice(0, 5);

  const handleQuickTranslate = () => {
    navigation.navigate('Translation');
  };

  const handleSelectPet = (petId: string) => {
    dispatch(selectPet(petId));
  };

  return (
    <ScrollView style={styles.container}>
      {/* Welcome Section */}
      <Card style={styles.welcomeCard}>
        <Card.Content>
          <Text variant="headlineSmall" style={styles.welcomeText}>
            Welcome back{user?.name ? `, ${user.name}` : ''}!
          </Text>
          <Text variant="bodyMedium">
            Ready to understand your animal better?
          </Text>
        </Card.Content>
      </Card>

      {/* Selected Pet Section */}
      {selectedPet && (
        <Card style={styles.petCard}>
          <Card.Content>
            <View style={styles.petHeader}>
              <Avatar.Icon
                size={60}
                icon={selectedPet.type === 'dog' ? 'dog' : selectedPet.type === 'cat' ? 'cat' : 'paw'}
                style={{ backgroundColor: theme.colors.primary }}
              />
              <View style={styles.petInfo}>
                <Text variant="titleLarge">{selectedPet.name}</Text>
                <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
                  {selectedPet.breed || selectedPet.type}
                </Text>
              </View>
            </View>
            <Button
              mode="contained"
              onPress={handleQuickTranslate}
              style={styles.translateButton}
              icon="translate">
              Translate {selectedPet.name}
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Text variant="titleMedium" style={styles.sectionTitle}>
        Quick Actions
      </Text>
      <View style={styles.quickActions}>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('Translation')}
          icon="microphone"
          style={styles.actionButton}>
          Record Pet
        </Button>
        <Button
          mode="outlined"
          onPress={() => navigation.navigate('HumanToPet')}
          icon="message-text"
          style={styles.actionButton}>
          Talk to Pet
        </Button>
      </View>

      {/* Recent Translations */}
      {recentTranslations.length > 0 && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Translations
          </Text>
          {recentTranslations.map((translation) => (
            <List.Item
              key={translation.id}
              title={translation.textResult}
              description={new Date(translation.timestamp).toLocaleDateString()}
              left={(props) => (
                <List.Icon
                  {...props}
                  icon={translation.type === 'pet_to_human' ? 'paw' : 'microphone'}
                />
              )}
              right={(props) => (
                <Chip {...props}>
                  {Math.round(translation.confidence * 100)}%
                </Chip>
              )}
            />
          ))}
        </>
      )}

      {/* Your Pets */}
      {pets.length > 0 && (
        <>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Your Pets
          </Text>
          {pets.map((pet) => (
            <List.Item
              key={pet.id}
              title={pet.name}
              description={pet.breed || pet.type}
              left={(props) => (
                <Avatar.Icon
                  {...props}
                  size={40}
                  icon={pet.type === 'dog' ? 'dog' : pet.type === 'cat' ? 'cat' : 'paw'}
                />
              )}
              onPress={() => handleSelectPet(pet.id)}
              style={selectedPetId === pet.id ? styles.selectedPet : undefined}
            />
          ))}
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  welcomeCard: {
    margin: 16,
    marginBottom: 8,
  },
  welcomeText: {
    marginBottom: 8,
  },
  petCard: {
    margin: 16,
    marginTop: 8,
  },
  petHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  petInfo: {
    marginLeft: 16,
  },
  translateButton: {
    marginTop: 8,
  },
  sectionTitle: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  quickActions: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  selectedPet: {
    backgroundColor: '#e3f2fd',
  },
});
