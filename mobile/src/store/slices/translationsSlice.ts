import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Translation } from '../../types';

interface TranslationsState {
  history: Translation[];
  currentTranslation: Translation | null;
  isRecording: boolean;
  isProcessing: boolean;
  error: string | null;
}

const initialState: TranslationsState = {
  history: [],
  currentTranslation: null,
  isRecording: false,
  isProcessing: false,
  error: null,
};

const translationsSlice = createSlice({
  name: 'translations',
  initialState,
  reducers: {
    startRecording: (state) => {
      state.isRecording = true;
      state.error = null;
    },
    stopRecording: (state) => {
      state.isRecording = false;
    },
    startProcessing: (state) => {
      state.isProcessing = true;
    },
    translationSuccess: (state, action: PayloadAction<Translation>) => {
      state.isProcessing = false;
      state.currentTranslation = action.payload;
      state.history.unshift(action.payload);
    },
    translationFailure: (state, action: PayloadAction<string>) => {
      state.isProcessing = false;
      state.error = action.payload;
    },
    clearCurrentTranslation: (state) => {
      state.currentTranslation = null;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    deleteTranslation: (state, action: PayloadAction<string>) => {
      state.history = state.history.filter((t) => t.id !== action.payload);
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startRecording,
  stopRecording,
  startProcessing,
  translationSuccess,
  translationFailure,
  clearCurrentTranslation,
  clearHistory,
  deleteTranslation,
  clearError,
} = translationsSlice.actions;

export const translationsReducer = translationsSlice.reducer;
