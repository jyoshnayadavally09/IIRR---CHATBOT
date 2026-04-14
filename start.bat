@echo off
title Agricultural Chatbot Startup

echo 🚀 Agricultural Chatbot Startup
echo ============================
echo.
echo This script will start all required services in separate windows.
echo.
echo Prerequisites:
echo   ✓ MongoDB running (mongod)
echo   ✓ Python installed with scikit-learn, flask, pandas, openpyxl
echo   ✓ Node.js installed
echo.
pause

REM Start MongoDB (if not already running)
echo.
echo 📦 Checking MongoDB...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo   ✓ MongoDB already running
) else (
    echo   Starting MongoDB...
    start "MongoDB" mongod --dbpath "%USERPROFILE%\mongodb\data"
    timeout /t 3 /nobreak
)

REM Start ML API
echo.
echo 📡 Starting ML API (Port 6000)...
cd /d "%CD%\ml-model" || exit /b
start "ML API" cmd /k "python train.py && python app.py"
timeout /t 3 /nobreak
cd ..

REM Start Backend
echo.
echo 🔧 Starting Backend (Port 5001)...
cd /d "%CD%\backend" || exit /b
start "Backend" cmd /k "npm install && node server.js"
timeout /t 3 /nobreak
cd ..

REM Start Frontend
echo.
echo 🎨 Starting Frontend (Port 5173)...
cd /d "%CD%\frontend" || exit /b
start "Frontend" cmd /k "npm install && npm run dev"
timeout /t 3 /nobreak
cd ..

echo.
echo ✅ All services started in separate windows!
echo.
echo 🌐 Access the application:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5001
echo    ML API:   http://localhost:6000
echo.
echo 💾 MongoDB: mongodb://127.0.0.1:27017/agri_chatbot
echo.
echo 📊 Close individual windows to stop services
echo.
pause
