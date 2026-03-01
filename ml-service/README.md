# Pet Translation ML Service

FastAPI-based ML service for classifying pet sounds (dogs/cats) into emotional states.

## Quick Start

### Local Development

```bash
# Install dependencies
pip install -r requirements.txt

# Run the service
cd src && uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Docker

```bash
# Build image
docker build -t pet-translation-ml .

# Run container
docker run -p 8000:8000 pet-translation-ml
```

## API Endpoints

### Health Check
```bash
curl http://localhost:8000/health
```

Response:
```json
{
  "status": "healthy",
  "model_loaded": false
}
```

### Predict
```bash
curl -X POST -F "audio=@sample.wav" http://localhost:8000/predict
```

Response:
```json
{
  "filename": "sample.wav",
  "prediction": "hungry",
  "confidence": 0.85,
  "all_scores": {
    "hungry": 0.85,
    "happy": 0.05,
    "anxious": 0.03,
    "attention": 0.04,
    "relaxed": 0.03
  }
}
```

## Project Structure

```
ml-service/
├── src/
│   ├── main.py              # FastAPI app
│   ├── audio_processor.py   # Audio loading & MFCC extraction
│   └── inference.py         # CNN model class
├── requirements.txt
├── Dockerfile
└── README.md
```

## Model Classes

- `hungry` - Pet wants food
- `happy` - Excited/playful
- `anxious` - Stressed/nervous
- `attention` - Wants attention
- `relaxed` - Calm/content

## Notes

- This is a placeholder implementation with random weights
- Train the model and load weights via `model.load_weights(path)`
- Supports .wav, .mp3, .ogg, .flac audio formats
