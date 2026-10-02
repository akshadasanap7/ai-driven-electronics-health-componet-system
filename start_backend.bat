@echo off
title AI Component Intelligence - Backend
echo ============================================
echo  AI Component Intelligence Platform
echo  Backend Server - FastAPI on port 8001
echo ============================================
echo.
cd /d "%~dp0backend"
call venv\Scripts\activate
echo [OK] Starting backend on http://localhost:8001
echo [OK] API docs at http://localhost:8001/docs
echo.
python -m uvicorn app.main:app --reload --port 8001
pause
