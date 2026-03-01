import { useState, useCallback } from 'react';
import AudioRecorderPlayer from 'react-native-audio-recorder-player';

const audioRecorderPlayer = new AudioRecorderPlayer();

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordSecs, setRecordSecs] = useState(0);
  const [recordTime, setRecordTime] = useState('00:00:00');

  const onStartRecord = useCallback(async () => {
    setIsRecording(true);
    const result = await audioRecorderPlayer.startRecorder();
    audioRecorderPlayer.addRecordBackListener((e) => {
      setRecordSecs(e.currentPosition);
      setRecordTime(audioRecorderPlayer.mmssss(Math.floor(e.currentPosition)));
    });
    return result;
  }, []);

  const onStopRecord = useCallback(async () => {
    const result = await audioRecorderPlayer.stopRecorder();
    audioRecorderPlayer.removeRecordBackListener();
    setIsRecording(false);
    setRecordSecs(0);
    setRecordTime('00:00:00');
    return result;
  }, []);

  return {
    isRecording,
    recordSecs,
    recordTime,
    onStartRecord,
    onStopRecord,
  };
};
