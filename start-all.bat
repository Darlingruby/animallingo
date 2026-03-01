@echo off
REM Start all services for development (Windows)

echo ========================================
echo  🚀 Starting Pet Translator Services
echo ========================================
echo.

REM Start Backend in new window
echo Starting Backend API...
start "Backend API" cmd /k "cd backend && npm run dev"

REM Start ML Service in new window  
echo Starting ML Service...
start "ML Service" cmd /k "cd ml-service && call venv\Scripts\activate.bat && uvicorn src.main:app --reload --port 8000"

REM Start Metro bundler
echo Starting Metro bundler...
start "Metro Bundler" cmd /k "cd mobile && npx react-native start"

echo.
echo ========================================
echo  ✅ All services starting!
echo ========================================
echo.
echo Services will be available at:
echo   Backend:    http://localhost:3000
echo   API Docs:   http://localhost:3000/docs
echo   ML Service: http://localhost:8000
echo   Metro:      http://localhost:8081
echo.
echo To run on Android device:
echo   cd mobile
echo   npx react-native run-android
echo.
pause
