# Technical Specification - Section 3: ML Pipeline & User Interface

## 3.1 ML Pipeline Architecture

The Universal Animal Translation System (UATS) employs a dual-mode machine learning architecture designed to balance real-time responsiveness with computational accuracy. This hybrid approach leverages edge computing for immediate translations while maintaining cloud-based capabilities for complex inference tasks.

### 3.1.1 On-Device Processing (TensorFlow Lite)

The primary inference pipeline runs on-device using **TensorFlow Lite 2.13+**, optimized for ARM64 and x86_64 mobile processors. This architecture prioritizes low latency and offline functionality.

| Component | Specification |
|-----------|---------------|
| Runtime | TensorFlow Lite with XNNPACK delegate |
| Quantization | INT8 post-training quantization |
| Model Format | `.tflite` flatbuffer |
| Supported Accelerators | GPU delegate (OpenCL/Vulkan), NNAPI, Core ML |
| Memory Footprint | < 180MB (all species models loaded) |
| Threading | 4 worker threads for inference |

The on-device pipeline handles 90% of translation requests without network connectivity, ensuring functionality in remote environments (wildlife research, rural pet ownership, marine applications).

### 3.1.2 Cloud Fallback (PyTorch)

When on-device confidence falls below 0.75, or for species requiring complex contextual analysis, the system falls back to cloud inference using **PyTorch 2.0+** on GPU-accelerated servers.

```
┌─────────────────────────────────────────────────────────────┐
│                    INFERENCE PIPELINE                        │
├─────────────────────────────────────────────────────────────┤
│  Audio Input → Preprocessing → On-Device (TFLite)          │
│                                    ↓                        │
│                            Confidence < 0.75?               │
│                            /           \                    │
│                         Yes            No                   │
│                          ↓              ↓                   │
│                    Cloud (PyTorch)  Return Result           │
│                          ↓                                  │
│                     Cache Result                            │
└─────────────────────────────────────────────────────────────┘
```

Cloud models utilize transformer-based architectures (BERT-style attention mechanisms) for contextual understanding of multi-utterance sequences and cross-species behavioral patterns.

---

## 3.2 Audio Processing Specifications

Consistent audio preprocessing ensures model input standardization across all supported species.

### 3.2.1 Recording Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Sample Rate | 16 kHz | Captures 0-8 kHz vocalization range |
| Bit Depth | 16-bit PCM | Sufficient dynamic range |
| Channels | Mono | Vocalizations are point-source |
| Window Duration | 4 seconds | Captures context + utterance |
| Hop Length | 1 second | 75% overlap for continuity |

### 3.2.2 Feature Extraction

Two parallel feature extraction pipelines feed into the model:

**Pipeline A: MFCC (Mel-Frequency Cepstral Coefficients)**
- 40 MFCC coefficients
- 512-point FFT window
- 128 Mel filter banks
- Output: 40 × 125 time-frequency representation

**Pipeline B: Mel-Spectrogram**
- 128 Mel bins
- 1024-point FFT window
- 50% overlap
- Log compression
- Output: 128 × 250 spectrogram

These features are concatenated into a 168-channel input tensor (40 MFCC + 128 Mel) with temporal resolution of 125 frames per 4-second window.

---

## 3.3 Model Architecture

The UATS employs a **CNN-LSTM hybrid architecture** optimized for sequential audio classification with temporal dependency modeling.

### 3.3.1 Architecture Layers

```
Input (168 × 125 × 1)
    ↓
Conv2D (64 filters, 3×3) → BatchNorm → ReLU → MaxPool
    ↓
Conv2D (128 filters, 3×3) → BatchNorm → ReLU → MaxPool
    ↓
Conv2D (256 filters, 3×3) → BatchNorm → ReLU → GlobalAvgPool
    ↓
Reshape for LSTM
    ↓
Bidirectional LSTM (256 units)
    ↓
Bidirectional LSTM (128 units)
    ↓
Dense (512) → Dropout(0.3) → ReLU
    ↓
Dense (NumClasses) → Softmax
```

### 3.3.2 Quantization Strategy

To maintain the <150MB model size requirement:

| Component | Precision | Size Reduction |
|-----------|-----------|----------------|
| Conv layers | INT8 | 4× reduction |
| LSTM weights | INT8 | 4× reduction |
| LSTM activations | FP16 | 2× reduction |
| Embedding layers | INT8 | 4× reduction |

**Post-Training Quantization Pipeline:**
1. Representative dataset calibration (1000 samples per species)
2. Per-channel quantization for weights
3. Per-tensor quantization for activations
4. Dynamic range adjustment for LSTM gates

Final model sizes per species: 12-35 MB (varies by vocabulary complexity).

---

## 3.4 Species-Specific Classifiers

Each species requires specialized model adaptations to handle unique vocalization characteristics.

### 3.4.1 Canine (Dog) Bark Classifier

- **Vocabulary Size:** 47 distinct utterance types
- **Model Additions:** Harmonic analysis layer for pitch tracking
- **Special Features:** Bark duration analysis, growl sub-harmonic detection
- **Output Categories:** Play, warning, fear, hunger, greeting, alert, distress, etc.

### 3.4.2 Feline (Cat) Meow Classifier

- **Vocabulary Size:** 38 distinct utterance types
- **Model Additions:** Purr fundamental frequency tracker
- **Special Features:** Trill detection, chirp classification, hiss spectral analysis
- **Output Categories:** Demand, greeting, complaint, hunting frustration, contentment

### 3.4.3 Avian (Bird) ABC-D Grammar Model

Bird vocalizations require syntactic parsing due to learned song structures:

- **Vocabulary Size:** 150+ syllable types per species
- **Architecture Extension:** Attention-based sequence-to-sequence decoder
- **Grammar Model:** Probabilistic context-free grammar for syllable ordering
- **Output:** Phrase meaning + emotional valence + territorial marking status

### 3.4.4 Cetacean (Dolphin) Whistle Classifier

- **Vocabulary Size:** ~30 distinct whistle contours
- **Model Additions:** Continuous wavelet transform for FM sweep analysis
- **Special Features:** Click train detection, burst pulse classification
- **Output Categories:** Individual ID, group coordination, prey location, social bonding

### 3.4.5 Model Loading Strategy

```python
# Lazy-loading architecture for memory efficiency
species_model_registry = {
    "canis_lupus_familiaris": load_on_demand("dog_classifier.tflite"),
    "felis_catus": load_on_demand("cat_classifier.tflite"),
    "passer_domesticus": load_on_demand("sparrow_grammar.tflite"),
    "tursiops_truncatus": load_on_demand("dolphin_whistle.tflite"),
    # ... additional species
}
```

---

## 3.5 User Interface Design

The UATS mobile application provides five primary interaction modes.

### 3.5.1 Screen 1: Home / Translation Hub

```
┌─────────────────────────────────────┐
│ ≡  Universal Translator      ⚙️ 🔋  │
├─────────────────────────────────────┤
│                                     │
│    ┌─────────────────────────┐      │
│    │                         │      │
│    │    [WAVE VISUALIZER]    │      │
│    │    ~~~∿∿∿∿∿∿∿∿∿∿∿~~~    │      │
│    │                         │      │
│    └─────────────────────────┘      │
│                                     │
│    "Listening... (Dog detected)"    │
│                                     │
│    ┌─────────────────────────┐      │
│    │  🐕 "I need to go out"  │      │
│    │     Confidence: 94%     │      │
│    └─────────────────────────┘      │
│                                     │
│  ┌──────────┐ ┌──────────┐          │
│  │ 🎙️ Reply │ │ 📷 Camera│          │
│  └──────────┘ └──────────┘          │
│                                     │
└─────────────────────────────────────┘
         [🏠]  [🎙️]  [📹]  [⚙️]
```

### 3.5.2 Screen 2: Human-to-Pet Communication

```
┌─────────────────────────────────────┐
│ ← Human to Pet                     │
├─────────────────────────────────────┤
│  Speak to your [Dog]:               │
│                                     │
│  ┌─────────────────────────────┐    │
│  │ "Come here for dinner"      │    │
│  └─────────────────────────────┘    │
│                                     │
│  Translation Preview:               │
│  ┌─────────────────────────────┐    │
│  │ [🎵 WHISTLE + CLICK]        │    │
│  │ Tone: Friendly, Urgent      │    │
│  └─────────────────────────────┘    │
│                                     │
│  ┌─────────────────────────────┐    │
│  │     🔊 PLAY PREVIEW         │    │
│  └─────────────────────────────┘    │
│                                     │
│  Quick Phrases:                     │
│  [Sit] [Stay] [Come] [No] [Treat]   │
│                                     │
└─────────────────────────────────────┘
```

### 3.5.3 Screen 3: Reptile Vibration Mode

```
┌─────────────────────────────────────┐
│ ← Reptile Communication            │
├─────────────────────────────────────┤
│  ⚠️ External vibration sensor req.  │
│                                     │
│  Status: 🔌 Sensor Connected        │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  [VIBRATION VISUALIZER]     │    │
│  │     ═══╦═══╦══════╦════     │    │
│  │     Low│Med │High  │Pat     │    │
│  └─────────────────────────────┘    │
│                                     │
│  Detected Pattern:                  │
│  "Territorial display - Male"       │
│  Species: Tarantula (B. hamorii)    │
│                                     │
│  [View Pattern Library]             │
│                                     │
└─────────────────────────────────────┘
```

### 3.5.4 Screen 4: Training Mode

```
┌─────────────────────────────────────┐
│ ← Training & Calibration           │
├─────────────────────────────────────┤
│  Active Training: Dog (Max)         │
│  Progress: ████████████░░  78%      │
│                                     │
│  ┌─────────────────────────────┐    │
│  │  Record sample utterance    │    │
│  │                             │    │
│  │     [🔴 RECORDING 00:03]    │    │
│  └─────────────────────────────┘    │
│                                     │
│  Context: ☐ Play  ☑ Hunger  ☐ Fear  │
│                                     │
│  Label this recording:              │
│  ┌─────────────────────────────┐    │
│  │ "Requesting food"           │    │
│  └─────────────────────────────┘    │
│                                     │
│     [Submit]  [Skip]  [Discard]     │
│                                     │
└─────────────────────────────────────┘
```

### 3.5.5 Screen 5: Camera Analysis

```
┌─────────────────────────────────────┐
│ ← Visual Behavior Analysis         │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐    │
│  │                             │    │
│  │    [CAMERA PREVIEW]         │    │
│  │         🐕                  │    │
│  │    [Tail: Wagging]          │    │
│  │    [Ears: Forward]          │    │
│  │                             │    │
│  └─────────────────────────────┘    │
│                                     │
│  Visual Cues Detected:              │
│  • Tail position: Up/Right          │
│  • Ear orientation: Alert           │
│  • Mouth: Relaxed (not panting)     │
│                                     │
│  Combined with Audio:               │
│  "Friendly greeting, seeking play"  │
│  Confidence: 91%                    │
│                                     │
│  [Capture]  [Switch Camera]         │
└─────────────────────────────────────┘
```

---

## 3.6 Performance Targets

| Metric | Target | Measurement Method |
|--------|--------|-------------------|
| End-to-end Latency | < 500ms | Audio input → Displayed translation |
| On-device Inference | < 200ms | TFLite model execution time |
| Cloud Fallback Latency | < 800ms | Including network round-trip |
| Model Load Time | < 2s | Cold start to ready state |
| Battery Impact | < 5%/hour | Continuous monitoring mode |
| Accuracy (Top-1) | > 85% | Validated on held-out test set |
| Accuracy (Top-3) | > 95% | Including context disambiguation |

---

## 3.7 Hardware Limitations

The following biological communication channels are **not supported** in the current hardware revision:

### 3.7.1 Chemical Signaling (Pheromones)

Pheromone-based communication in mammals, insects, and reptiles cannot be detected or synthesized. The system does not include:
- Volatile organic compound (VOC) sensors
- Pheromone synthesis hardware
- Olfactory emission modules

**Workaround:** Visual and auditory cues that often accompany pheromone signaling are analyzed.

### 3.7.2 Substrate-Borne Vibrations

Spider and scorpion seismic communication requires specialized hardware:

| Species Group | Communication Method | Required Hardware |
|---------------|---------------------|-------------------|
| Theraphosidae (Tarantulas) | Leg-tapping vibrations | Piezoelectric sensor mat |
| Scorpiones | Stridulation + substrate vibration | Accelerometer array |
| Certain insects | Plant-stem vibrations | Contact microphone |

**Implementation:** Optional external sensor accessory (sold separately) connects via Bluetooth Low Energy. The app provides vibration pattern analysis when sensor is connected.

### 3.7.3 Ultrasonic Frequencies

Frequencies above 22 kHz (used by bats, some rodents) require specialized microphones not present in standard smartphone hardware.

---

## 3.8 Summary

The ML pipeline architecture balances on-device performance with cloud intelligence, utilizing TensorFlow Lite for 90% of inference tasks while maintaining PyTorch fallback for complex analysis. The CNN-LSTM architecture with INT8 quantization achieves sub-500ms latency targets while remaining under 150MB storage constraints. Species-specific classifiers handle unique vocalization characteristics from dog barks to dolphin whistles, while the five-screen UI provides intuitive access to translation, training, and specialized modes for non-audio communication channels.

---

*Document Version: 1.0*
*Last Updated: 2026-03-01*
*Word Count: ~1,450*
