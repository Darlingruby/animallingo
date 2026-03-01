"""
Audio processing utilities for feature extraction.
"""
import librosa
import numpy as np


def load_audio(file_path: str, sr: int = 22050, duration: float = None) -> tuple:
    """
    Load audio file and resample to target sample rate.
    
    Args:
        file_path: Path to audio file
        sr: Target sample rate (default: 22050)
        duration: Load only first N seconds (None = full file)
    
    Returns:
        Tuple of (audio_data, sample_rate)
    """
    audio_data, sample_rate = librosa.load(
        file_path, 
        sr=sr, 
        duration=duration,
        mono=True
    )
    return audio_data, sample_rate


def extract_mfcc(
    audio_data: np.ndarray, 
    sr: int = 22050,
    n_mfcc: int = 40,
    n_fft: int = 2048,
    hop_length: int = 512,
    max_len: int = 100
) -> np.ndarray:
    """
    Extract MFCC features from audio data.
    
    Args:
        audio_data: Raw audio signal
        sr: Sample rate
        n_mfcc: Number of MFCC coefficients to extract
        n_fft: FFT window size
        hop_length: Hop length for STFT
        max_len: Maximum number of frames (padding/truncation)
    
    Returns:
        MFCC features as numpy array of shape (n_mfcc, max_len)
    """
    # Extract MFCC features
    mfcc = librosa.feature.mfcc(
        y=audio_data,
        sr=sr,
        n_mfcc=n_mfcc,
        n_fft=n_fft,
        hop_length=hop_length
    )
    
    # Pad or truncate to fixed length
    if mfcc.shape[1] < max_len:
        # Pad with zeros
        pad_width = max_len - mfcc.shape[1]
        mfcc = np.pad(mfcc, ((0, 0), (0, pad_width)), mode='constant')
    else:
        # Truncate
        mfcc = mfcc[:, :max_len]
    
    return mfcc


def normalize_audio(audio_data: np.ndarray) -> np.ndarray:
    """
    Normalize audio to [-1, 1] range.
    
    Args:
        audio_data: Raw audio signal
    
    Returns:
        Normalized audio
    """
    if np.max(np.abs(audio_data)) > 0:
        return audio_data / np.max(np.abs(audio_data))
    return audio_data
