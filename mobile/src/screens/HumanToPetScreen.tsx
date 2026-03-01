import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const MESSAGE_TEMPLATES = [
  { label: 'Come here', icon: '👋' },
  { label: 'Food time', icon: '🍖' },
  { label: 'Good job', icon: '⭐' },
  { label: 'Stop', icon: '🛑' },
  { label: 'Play', icon: '🎾' },
  { label: 'Calm down', icon: '😌' },
];

export const HumanToPetScreen: React.FC = () => {
  const [customMessage, setCustomMessage] = useState('');
  const [selectedPet, setSelectedPet] = useState<string | null>(null);
  const { pets } = useSelector((state: RootState) => state.pets);

  const playSound = (message: string) => {
    // TODO: Integrate with synthesis engine
    console.log(`Playing sound for: ${message}`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Speak to Your Pet</Text>
        <Text style={styles.subtitle}>Select a message to translate</Text>
      </View>

      <View style={styles.petSelector}>
        <Text style={styles.sectionTitle}>Select Pet</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {pets.map((pet) => (
            <TouchableOpacity
              key={pet.id}
              style={[
                styles.petChip,
                selectedPet === pet.id && styles.petChipActive,
              ]}
              onPress={() => setSelectedPet(pet.id)}>
              <Text style={styles.petChipText}>{pet.name}</Text>
              <Text style={styles.petType}>{pet.species}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.templatesSection}>
        <Text style={styles.sectionTitle}>Quick Messages</Text>
        <View style={styles.templatesGrid}>
          {MESSAGE_TEMPLATES.map((template, index) => (
            <TouchableOpacity
              key={index}
              style={styles.templateButton}
              onPress={() => playSound(template.label)}>
              <Text style={styles.templateIcon}>{template.icon}</Text>
              <Text style={styles.templateText}>{template.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.customSection}>
        <Text style={styles.sectionTitle}>Custom Message</Text>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={customMessage}
          onChangeText={setCustomMessage}
          multiline
        />
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => customMessage && playSound(customMessage)}>
          <Text style={styles.playButtonText}>▶ Play Translation</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.infoText}>
          💡 Tip: Different species respond to different frequencies. 
          Dogs hear higher pitches better, while cats prefer lower tones.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginTop: 5,
  },
  petSelector: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  petChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
    alignItems: 'center',
  },
  petChipActive: {
    backgroundColor: '#4A90D9',
  },
  petChipText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  petType: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  templatesSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  templatesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  templateButton: {
    width: '30%',
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  templateIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  templateText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  customSection: {
    padding: 15,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
  },
  playButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    margin: 15,
    padding: 15,
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#2196F3',
  },
  infoText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 20,
  },
});

export default HumanToPetScreen;
