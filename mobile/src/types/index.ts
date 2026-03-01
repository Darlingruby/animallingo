export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
}

export interface Pet {
  id: string;
  name: string;
  type: 'dog' | 'cat' | 'bird' | 'other';
  breed?: string;
  age?: number;
  avatar?: string;
  modelId?: string;
  createdAt: string;
}

export interface Translation {
  id: string;
  petId: string;
  type: 'pet_to_human' | 'human_to_pet';
  audioUri: string;
  textResult: string;
  confidence: number;
  timestamp: string;
}

export interface ModelInfo {
  id: string;
  petId: string;
  status: 'untrained' | 'training' | 'ready' | 'error';
  accuracy?: number;
  lastTrainedAt?: string;
}
