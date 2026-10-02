@echo off
title AI Component Intelligence Platform
echo ============================================
echo  AI Component Intelligence Platform
echo  Starting all services...
echo ============================================
echo.
start "Backend - FastAPI" cmd /k "cd /d "%~dp0backend" && venv\Scripts\activate && python -m uvicorn app.main:app --reload --port 8001"
timeout /t 3 /nobreak > nul
start "Frontend - React" cmd /k "cd /d "%~dp0frontend" && npm run dev"
echo.
echo [OK] Backend:  http://localhost:8001
echo [OK] Frontend: http://localhost:5173
echo [OK] API Docs: http://localhost:8001/docs
echo.
pause
