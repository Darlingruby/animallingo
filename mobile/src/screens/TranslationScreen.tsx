import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  Avatar,
  ProgressBar,
  Snackbar,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  startRecording,
  stopRecording,
  startProcessing,
  translationSuccess,
  translationFailure,
  clearCurrentTranslation,
} from '../store/slices/translationsSlice';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const TranslationScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { selectedPetId, pets } = useSelector((state: RootState) => state.pets);
  const { isRecording, isProcessing, currentTranslation, error } = useSelector(
    (state: RootState) => state.translations
  );

  const [recordingDuration, setRecordingDuration] = useState(0);
  const [showError, setShowError] = useState(false);
  const pulseAnim = new Animated.Value(1);

  const selectedPet = pets.find((p) => p.id === selectedPetId);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
    return () => {
      clearInterval(interval);
      pulseAnim.setValue(1);
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      dispatch(startRecording());
      setRecordingDuration(0);
      await audioRecorderPlayer.startRecorder();
      audioRecorderPlayer.addRecordBackListener((e) => {
        // Handle recording progress
      });
    } catch (err) {
      dispatch(translationFailure('Failed to start recording'));
      setShowError(true);
    }
  };

  const handleStopRecording = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      audioRecorderPlayer.removeRecordBackListener();
      dispatch(stopRecording());
      dispatch(startProcessing());

      // Simulate ML processing (replace with actual TFLite inference)
      setTimeout(() => {
        if (selectedPet) {
          dispatch(
            translationSuccess({
              id: Date.now().toString(),
              petId: selectedPet.id,
              type: 'pet_to_human',
              audioUri: result,
              textResult: 'I\'m hungry and want to play!',
              confidence: 0.87,
              timestamp: new Date().toISOString(),
            })
          );
        }
      }, 2000);
    } catch (err) {
      dispatch(translationFailure('Failed to process recording'));
      setShowError(true);
    }
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedPet) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Icon name="paw-off" size={64} color={theme.colors.outline} />
        <Text variant="titleMedium" style={styles.noPetText}>
          Please select a pet first
        </Text>
        <Text variant="bodyMedium" style={styles.noPetSubtext}>
          Go to Home or Profile to add/select your pet
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Card style={styles.petCard}>
        <Card.Content style={styles.petContent}>
          <Avatar.Icon
            size={80}
            icon={selectedPet.type === 'dog' ? 'dog' : selectedPet.type === 'cat' ? 'cat' : 'paw'}
            style={{ backgroundColor: theme.colors.primary }}
          />
          <Text variant="headlineSmall" style={styles.petName}>
            {selectedPet.name}
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            Tap the microphone to record {selectedPet.name}
          </Text>
        </Card.Content>
      </Card>

      {/* Recording UI */}
      <View style={styles.recordingContainer}>
        {isRecording && (
          <Animated.View
            style={[
              styles.pulseRing,
              {
                transform: [{ scale: pulseAnim }],
                backgroundColor: theme.colors.error + '20',
              },
            ]}
          />
        )}

        <Button
          mode="contained"
          onPress={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isProcessing}
          style={[
            styles.recordButton,
            { backgroundColor: isRecording ? theme.colors.error : theme.colors.primary },
          ]}
          contentStyle={styles.recordButtonContent}
          icon={isRecording ? 'stop' : 'microphone'}>
          {isRecording ? 'Stop Recording' : 'Start Recording'}
        </Button>

        {isRecording && (
          <Text variant="headlineMedium" style={styles.timer}>
            {formatDuration(recordingDuration)}
          </Text>
        )}
      </View>

      {/* Processing Indicator */}
      {isProcessing && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.processingText}>
              Analyzing audio...
            </Text>
            <ProgressBar indeterminate color={theme.colors.primary} />
          </Card.Content>
        </Card>
      )}

      {/* Translation Result */}
      {currentTranslation && !isProcessing && (
        <Card style={styles.resultCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.resultTitle}>
              Translation Result
            </Text>
            <Text variant="headlineSmall" style={styles.translationText}>
              "{currentTranslation.textResult}"
            </Text>
            <View style={styles.confidenceRow}>
              <Text variant="bodyMedium">Confidence:</Text>
              <Text
                variant="bodyMedium"
                style={[
                  styles.confidenceText,
                  {
                    color:
                      currentTranslation.confidence > 0.8
                        ? theme.colors.primary
                        : theme.colors.error,
                  },
                ]}>
                {Math.round(currentTranslation.confidence * 100)}%
              </Text>
            </View>
            <Button
              mode="outlined"
              onPress={() => dispatch(clearCurrentTranslation())}
              style={styles.newTranslationButton}>
              New Translation
            </Button>
          </Card.Content>
        </Card>
      )}

      <Snackbar
        visible={showError}
        onDismiss={() => setShowError(false)}
        action={{ label: 'Dismiss', onPress: () => setShowError(false) }}>
        {error}
      </Snackbar>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  noPetText: {
    marginTop: 16,
  },
  noPetSubtext: {
    marginTop: 8,
    color: '#666',
  },
  petCard: {
    marginBottom: 24,
  },
  petContent: {
    alignItems: 'center',
  },
  petName: {
    marginTop: 12,
    marginBottom: 4,
  },
  recordingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 32,
  },
  pulseRing: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  recordButton: {
    borderRadius: 50,
    width: 160,
    height: 160,
  },
  recordButtonContent: {
    height: 160,
    flexDirection: 'column',
  },
  timer: {
    marginTop: 24,
  },
  resultCard: {
    marginTop: 16,
  },
  processingText: {
    marginBottom: 16,
    textAlign: 'center',
  },
  resultTitle: {
    marginBottom: 12,
    color: '#666',
  },
  translationText: {
    fontStyle: 'italic',
    marginBottom: 16,
  },
  confidenceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  confidenceText: {
    fontWeight: 'bold',
  },
  newTranslationButton: {
    marginTop: 8,
  },
});
