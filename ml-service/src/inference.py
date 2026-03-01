"""
CNN Model for pet audio classification.
Placeholder implementation - replace with trained model.
"""
import numpy as np
import tensorflow as tf
from tensorflow import keras


class CNNModel:
    """
    CNN-based classifier for pet sounds.
    
    Expected classes (example):
    - 0: hungry
    - 1: happy/excited  
    - 2: anxious/stressed
    - 3: attention-seeking
    - 4: relaxed/content
    """
    
    CLASS_NAMES = ["hungry", "happy", "anxious", "attention", "relaxed"]
    
    def __init__(self, input_shape: tuple = (40, 100, 1), num_classes: int = 5):
        """
        Initialize the model.
        
        Args:
            input_shape: Expected input shape (mfcc_features, time_frames, channels)
            num_classes: Number of output classes
        """
        self.input_shape = input_shape
        self.num_classes = num_classes
        self.model = self._build_model()
        self._loaded = False
    
    def _build_model(self) -> keras.Model:
        """Build CNN architecture."""
        model = keras.Sequential([
            # First conv block
            keras.layers.Conv2D(32, (3, 3), activation='relu', 
                              input_shape=self.input_shape, padding='same'),
            keras.layers.BatchNormalization(),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Dropout(0.25),
            
            # Second conv block
            keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            keras.layers.BatchNormalization(),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Dropout(0.25),
            
            # Third conv block
            keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            keras.layers.BatchNormalization(),
            keras.layers.MaxPooling2D((2, 2)),
            keras.layers.Dropout(0.25),
            
            # Flatten and dense layers
            keras.layers.Flatten(),
            keras.layers.Dense(256, activation='relu'),
            keras.layers.BatchNormalization(),
            keras.layers.Dropout(0.5),
            keras.layers.Dense(self.num_classes, activation='softmax')
        ])
        
        model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )
        
        return model
    
    def load_weights(self, weights_path: str):
        """Load pre-trained weights."""
        try:
            self.model.load_weights(weights_path)
            self._loaded = True
        except Exception as e:
            print(f"Warning: Could not load weights from {weights_path}: {e}")
            self._loaded = False
    
    def is_loaded(self) -> bool:
        """Check if model has loaded weights."""
        return self._loaded
    
    def predict(self, features: np.ndarray) -> dict:
        """
        Run inference on extracted features.
        
        Args:
            features: MFCC features of shape (n_mfcc, time_frames)
        
        Returns:
            Dictionary with prediction results
        """
        # Reshape for model input: (batch, mfcc, time, channels)
        if len(features.shape) == 2:
            features = np.expand_dims(features, axis=0)  # Add batch dim
            features = np.expand_dims(features, axis=-1)  # Add channel dim
        
        # Run prediction
        predictions = self.model.predict(features, verbose=0)
        scores = predictions[0]
        
        # Get top prediction
        predicted_class_idx = np.argmax(scores)
        confidence = float(scores[predicted_class_idx])
        
        return {
            "class": self.CLASS_NAMES[predicted_class_idx],
            "class_index": int(predicted_class_idx),
            "confidence": confidence,
            "scores": {
                name: float(score) 
                for name, score in zip(self.CLASS_NAMES, scores)
            }
        }
    
    def summary(self):
        """Print model summary."""
        self.model.summary()
