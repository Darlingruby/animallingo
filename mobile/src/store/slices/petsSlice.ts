import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Pet, ModelInfo } from '../../types';

interface PetsState {
  pets: Pet[];
  selectedPetId: string | null;
  models: Record<string, ModelInfo>;
  isLoading: boolean;
  error: string | null;
}

const initialState: PetsState = {
  pets: [],
  selectedPetId: null,
  models: {},
  isLoading: false,
  error: null,
};

const petsSlice = createSlice({
  name: 'pets',
  initialState,
  reducers: {
    setPets: (state, action: PayloadAction<Pet[]>) => {
      state.pets = action.payload;
    },
    addPet: (state, action: PayloadAction<Pet>) => {
      state.pets.push(action.payload);
    },
    updatePet: (state, action: PayloadAction<{ id: string; updates: Partial<Pet> }>) => {
      const index = state.pets.findIndex((p) => p.id === action.payload.id);
      if (index !== -1) {
        state.pets[index] = { ...state.pets[index], ...action.payload.updates };
      }
    },
    removePet: (state, action: PayloadAction<string>) => {
      state.pets = state.pets.filter((p) => p.id !== action.payload);
      if (state.selectedPetId === action.payload) {
        state.selectedPetId = null;
      }
    },
    selectPet: (state, action: PayloadAction<string | null>) => {
      state.selectedPetId = action.payload;
    },
    setModelInfo: (state, action: PayloadAction<{ petId: string; modelInfo: ModelInfo }>) => {
      state.models[action.payload.petId] = action.payload.modelInfo;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setPets,
  addPet,
  updatePet,
  removePet,
  selectPet,
  setModelInfo,
  setLoading,
  setError,
} = petsSlice.actions;

export const petsReducer = petsSlice.reducer;
