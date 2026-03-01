import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ProgressBarAndroid,
} from 'react-native';
import { useSelector } from 'react-redux';
import { RootState } from '../store';

const TRAINING_LEVELS = [
  {
    level: 1,
    title: 'Basic Sounds',
    description: 'Learn to identify common pet vocalizations',
    exercises: 5,
    completed: 3,
  },
  {
    level: 2,
    title: 'Emotion Detection',
    description: 'Recognize happy, sad, and anxious sounds',
    exercises: 8,
    completed: 0,
  },
  {
    level: 3,
    title: 'Specific Needs',
    description: 'Identify hunger, thirst, and attention requests',
    exercises: 10,
    completed: 0,
  },
  {
    level: 4,
    title: 'Advanced Patterns',
    description: 'Complex communication sequences',
    exercises: 12,
    completed: 0,
  },
];

export const TrainingScreen: React.FC = () => {
  const [activeLevel, setActiveLevel] = useState(1);
  const { translations } = useSelector((state: RootState) => state.translations);

  const startExercise = (level: number) => {
    // TODO: Navigate to exercise screen
    console.log(`Starting level ${level}`);
  };

  const progress = Math.min((translations.length / 50) * 100, 100);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Training Mode</Text>
        <Text style={styles.subtitle}>Improve translation accuracy</Text>
      </View>

      <View style={styles.progressCard}>
        <Text style={styles.progressTitle}>Your Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          {translations.length} translations recorded • {Math.round(progress)}% to next level
        </Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{translations.length}</Text>
          <Text style={styles.statLabel}>Translations</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>72%</Text>
          <Text style={styles.statLabel}>Accuracy</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Pets Trained</Text>
        </View>
      </View>

      <View style={styles.levelsSection}>
        <Text style={styles.sectionTitle}>Training Levels</Text>
        {TRAINING_LEVELS.map((level) => (
          <TouchableOpacity
            key={level.level}
            style={[
              styles.levelCard,
              level.level === activeLevel && styles.levelCardActive,
              level.completed === level.exercises && styles.levelCardComplete,
            ]}
            onPress={() => setActiveLevel(level.level)}>
            <View style={styles.levelHeader}>
              <Text style={styles.levelTitle}>Level {level.level}: {level.title}</Text>
              {level.completed === level.exercises && (
                <Text style={styles.completeBadge}>✓</Text>
              )}
            </View>
            <Text style={styles.levelDescription}>{level.description}</Text>
            <View style={styles.levelProgress}>
              <View style={styles.levelProgressBar}>
                <View
                  style={[
                    styles.levelProgressFill,
                    { width: `${(level.completed / level.exercises) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.levelProgressText}>
                {level.completed}/{level.exercises}
              </Text>
            </View>
            {level.level === activeLevel && level.completed < level.exercises && (
              <TouchableOpacity
                style={styles.startButton}
                onPress={() => startExercise(level.level)}>
                <Text style={styles.startButtonText}>Continue Training</Text>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tipBox}>
        <Text style={styles.tipTitle}>💡 Training Tip</Text>
        <Text style={styles.tipText}>
          The more you use the app with your pet, the better it learns their 
          unique communication patterns. Aim for at least 10 translations per week.
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
  progressCard: {
    margin: 15,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressText: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4A90D9',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  levelsSection: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
  },
  levelCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  levelCardActive: {
    borderColor: '#4A90D9',
  },
  levelCardComplete: {
    borderColor: '#4CAF50',
  },
  levelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  levelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  completeBadge: {
    fontSize: 20,
    color: '#4CAF50',
  },
  levelDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
    marginBottom: 10,
  },
  levelProgress: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  levelProgressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  levelProgressFill: {
    height: '100%',
    backgroundColor: '#4A90D9',
    borderRadius: 3,
  },
  levelProgressText: {
    marginLeft: 10,
    fontSize: 12,
    color: '#666',
  },
  startButton: {
    backgroundColor: '#4A90D9',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  startButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  tipBox: {
    margin: 15,
    padding: 15,
    backgroundColor: '#FFF8E1',
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#F57C00',
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TrainingScreen;
