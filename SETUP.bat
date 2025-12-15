@echo off
REM LMS-B AI System - Quick Setup for Windows

echo.
echo ============================================
echo   LMS-B AI Chatbot - Setup Script
echo ============================================
echo.

REM Check Python
echo Checking Python...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Python not found. Please install Python 3.9+
    echo Download: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo ✓ Python found

REM Check Node
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js not found. Please install Node.js 18+
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)
echo ✓ Node.js found

REM Check Ollama
echo Checking Ollama...
curl http://localhost:11434/api/tags >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Ollama not responding. Make sure:
    echo 1. Ollama is installed (https://ollama.ai)
    echo 2. Run: ollama serve
    echo 3. Pull model: ollama pull mistral
    echo.
)
echo ✓ Ollama status checked

REM Check MongoDB
echo Checking MongoDB...
mongosh --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: MongoDB not responding
    echo Make sure MongoDB is running
)
echo ✓ MongoDB status checked

REM Check Redis
echo Checking Redis...
redis-cli ping >nul 2>&1
if %errorlevel% neq 0 (
    echo WARNING: Redis not responding
    echo Make sure Redis is running
)
echo ✓ Redis status checked

echo.
echo ============================================
echo   Setting up Python AI Service
echo ============================================
echo.

cd /d "%~dp0python-ai"

REM Create venv if not exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv
call venv\Scripts\activate.bat

REM Install requirements
echo Installing Python dependencies...
pip install -r requirements.txt -q

echo.
echo ============================================
echo   Setting up Express Server
echo ============================================
echo.

cd /d "%~dp0server"

if not exist "node_modules" (
    echo Installing Server dependencies...
    npm install -q
)

echo.
echo ============================================
echo   Setting up React Client
echo ============================================
echo.

cd /d "%~dp0client"

if not exist "node_modules" (
    echo Installing Client dependencies...
    npm install -q
)

echo.
echo ============================================
echo   ✓ Setup Complete!
echo ============================================
echo.
echo Next steps:
echo.
echo 1. Open 6 terminals and run these commands:
echo.
echo    Terminal 1 - Ollama:
echo    ollama serve
echo.
echo    Terminal 2 - MongoDB:
echo    mongod
echo.
echo    Terminal 3 - Redis:
echo    redis-server
echo.
echo    Terminal 4 - Python AI Service:
echo    cd python-ai && python main.py
echo.
echo    Terminal 5 - Express Server:
echo    cd server && npm run dev
echo.
echo    Terminal 6 - React Client:
echo    cd client && npm run dev
echo.
echo 2. Open browser: http://localhost:3000
echo 3. Login and test the AI chatbot!
echo.
echo ============================================
echo.

pause
