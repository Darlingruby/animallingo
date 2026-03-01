@echo off
REM Windows Setup Script for Pet Translator App
REM Run this after extracting the zip file

echo ========================================
echo  🐾 Pet Translator - Windows Setup
echo ========================================
echo.

REM Check Node.js
echo Checking Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found!
    echo Please install Node.js 20 LTS from https://nodejs.org
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('node --version') do set NODE_VERSION=%%a
echo [OK] Node.js version: %NODE_VERSION%

REM Check Python
echo.
echo Checking Python...
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python not found!
    echo Please install Python 3.11+ from https://python.org
    pause
    exit /b 1
)
for /f "tokens=*" %%a in ('python --version') do set PYTHON_VERSION=%%a
echo [OK] Python version: %PYTHON_VERSION%

REM Setup Backend
echo.
echo ========================================
echo  Setting up Backend...
echo ========================================
cd backend
call npm install
if errorlevel 1 (
    echo [ERROR] Backend install failed!
    pause
    exit /b 1
)

REM Create .env if not exists
if not exist .env (
    copy .env.example .env
    echo [INFO] Created .env file. Please edit with your database credentials.
)

echo [OK] Backend ready!
cd ..

REM Setup ML Service
echo.
echo ========================================
echo  Setting up ML Service...
echo ========================================
cd ml-service
python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt
if errorlevel 1 (
    echo [ERROR] ML service install failed!
    pause
    exit /b 1
)
echo [OK] ML service ready!
cd ..

REM Setup Mobile
echo.
echo ========================================
echo  Setting up Mobile App...
echo ========================================
cd mobile
call npm install
if errorlevel 1 (
    echo [ERROR] Mobile install failed!
    pause
    exit /b 1
)
echo [OK] Mobile app ready!
cd ..

echo.
echo ========================================
echo  ✅ Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with your settings
echo 2. Start services with: start-all.bat
echo.
pause
