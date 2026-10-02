@echo off
title AI Component Intelligence - Backend
echo ============================================
echo  AI Component Intelligence Platform
echo  Backend Server - FastAPI
echo ============================================
echo.
cd /d "%~dp0backend"

if not exist "venv\Scripts\python.exe" (
    echo [ERROR] Virtual environment not found.
    echo Run: python -m venv venv
    echo Then: venv\Scripts\python.exe -m pip install --only-binary=:all: fastapi uvicorn[standard] sqlalchemy pydantic pydantic-settings python-dotenv pyserial aiofiles python-multipart numpy pandas scikit-learn
    pause
    exit /b 1
)

echo [OK] Starting backend on http://localhost:8000
echo [OK] API docs at http://localhost:8000/docs
echo.
venv\Scripts\python.exe -m uvicorn app.main:app --reload --port 8000 --log-level info
pause
