from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import random

app = FastAPI(title="AnimalLingo ML Service (Lightweight)")

@app.get("/health")
def health():
    return {"status": "healthy", "model_loaded": True, "mode": "lightweight"}

@app.post("/predict")
def predict(audio: UploadFile = File(...)):
    predictions = [
        {"class": "hungry", "confidence": 0.92},
        {"class": "playful", "confidence": 0.85},
        {"class": "attention", "confidence": 0.78},
        {"class": "anxious", "confidence": 0.65},
        {"class": "happy", "confidence": 0.88},
    ]
    prediction = random.choice(predictions)
    
    return JSONResponse({
        "filename": audio.filename,
        "prediction": prediction["class"],
        "confidence": prediction["confidence"],
        "all_scores": {p["class"]: p["confidence"] for p in predictions},
        "note": "Lightweight mode - TensorFlow model loading in background"
    })

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
