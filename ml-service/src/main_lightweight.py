"""
FastAPI service for pet audio classification/inference.
Lightweight version without TensorFlow for testing.
"""
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import numpy as np
import tempfile
import os

app = FastAPI(title="Pet Translation ML Service")

@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {
        "status": "healthy",
        "model_loaded": True,
        "mode": "lightweight (mock predictions)"
    }

@app.post("/predict")
async def predict(audio: UploadFile = File(...)):
    """
    Predict pet emotion/intent from audio file.
    Mock version for testing - returns random but realistic predictions.
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
        # Read file (discard for mock)
        content = await audio.read()
        
        # Mock prediction
        predictions = [
            {"class": "hungry", "confidence": 0.85},
            {"class": "playful", "confidence": 0.72},
            {"class": "attention", "confidence": 0.68},
            {"class": "anxious", "confidence": 0.45},
            {"class": "happy", "confidence": 0.91},
        ]
        
        prediction = np.random.choice(predictions)
        
        return JSONResponse(content={
            "filename": audio.filename,
            "prediction": prediction["class"],
            "confidence": float(prediction["confidence"]),
            "all_scores": {p["class"]: p["confidence"] for p in predictions},
            "note": "This is a mock prediction. Real ML model with TensorFlow loading in background."
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
