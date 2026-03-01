import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = process.env.API_URL || 'http://localhost:3000';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (email: string, password: string) =>
    apiClient.post('/auth/login', { email, password }),
  register: (email: string, password: string, name: string) =>
    apiClient.post('/auth/register', { email, password, name }),
  refresh: () => apiClient.post('/auth/refresh'),
};

export const petsAPI = {
  getPets: () => apiClient.get('/pets'),
  createPet: (data: any) => apiClient.post('/pets', data),
  updatePet: (id: string, data: any) => apiClient.put(`/pets/${id}`, data),
  deletePet: (id: string) => apiClient.delete(`/pets/${id}`),
};

export const translationsAPI = {
  translateAudio: (petId: string, audioUri: string, signalType: string) => {
    const formData = new FormData();
    formData.append('audio', {
      uri: audioUri,
      type: 'audio/wav',
      name: 'recording.wav',
    } as any);
    formData.append('petId', petId);
    formData.append('signalType', signalType);
    
    return apiClient.post('/translations', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getHistory: (petId: string) => apiClient.get(`/translations?petId=${petId}`),
};

export default apiClient;
