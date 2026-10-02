@echo off
title AI Component Intelligence - Frontend
echo ============================================
echo  AI Component Intelligence Platform
echo  Frontend - React + Vite
echo ============================================
echo.
cd /d "%~dp0frontend"

if not exist "node_modules" (
    echo [INFO] Installing npm packages...
    npm install
)

echo [OK] Starting frontend on http://localhost:5173
echo.
npm run dev
pause
