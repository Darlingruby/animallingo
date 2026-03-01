"""
FastAPI service for pet audio classification/inference.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import numpy as np
import tempfile
import os

from src.audio_processor import load_audio, extract_mfcc
from src.inference import CNNModel

app = FastAPI(title="AnimalLingo ML Service")

# Initialize model (placeholder)
model = CNNModel(input_shape=(40, 100, 1), num_classes=5)

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": model.is_loaded()
    }

@app.post("/predict")
async def predict(audio: UploadFile = File(...)):
    """
    Predict pet emotion/intent from audio file.
    
    Accepts: .wav, .mp3, .ogg audio files
    Returns: predicted class and confidence scores
    """
    # Validate file type
    allowed_extensions = {'.wav', '.mp3', '.ogg', '.flac'}
    file_ext = os.path.splitext(audio.filename)[1].lower()
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400, 
            detail=f"Unsupported file format. Allowed: {allowed_extensions}"
        )
    
    try:
        # Save uploaded file temporarily
        with tempfile.NamedTemporaryFile(delete=False, suffix=file_ext) as tmp:
            content = await audio.read()
            tmp.write(content)
            tmp_path = tmp.name
        
        # Load and process audio
        audio_data, sr = load_audio(tmp_path)
        mfcc_features = extract_mfcc(audio_data, sr)
        
        # Run inference
        prediction = model.predict(mfcc_features)
        
        # Cleanup temp file
        os.unlink(tmp_path)
        
        return JSONResponse(content={
            "filename": audio.filename,
            "prediction": prediction["class"],
            "confidence": float(prediction["confidence"]),
            "all_scores": prediction["scores"]
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
