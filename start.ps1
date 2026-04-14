Write-Host "🚀 Agricultural Chatbot Startup" -ForegroundColor Green
Write-Host "==============================" -ForegroundColor Green
Write-Host ""

# Function to start a service in a new terminal
function Start-Service {
    param(
        [string]$ServiceName,
        [string]$Path,
        [string]$Command,
        [string]$Icon
    )
    
    Write-Host "$Icon Starting $ServiceName..." -ForegroundColor Cyan
    
    $cmd = "cd '$Path'; $Command"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd -WindowStyle Normal
    
    Start-Sleep -Seconds 2
}

# Prerequisites check
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

# Check Python
try {
    $pythonVersion = python --version 2>&1
    Write-Host "   ✓ Python: $pythonVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Python not found. Please install Python 3.8+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    $nodeVersion = node --version
    Write-Host "   ✓ Node.js: $nodeVersion" -ForegroundColor Green
}
catch {
    Write-Host "   ✗ Node.js not found. Please install Node.js" -ForegroundColor Red
    exit 1
}

# Check MongoDB
$mongoRunning = Get-Process mongod -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "   ✓ MongoDB: Running" -ForegroundColor Green
}
else {
    Write-Host "   ⚠ MongoDB: Not running" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   Start MongoDB with: mongod --dbpath %USERPROFILE%\mongodb\data" -ForegroundColor Yellow
    Write-Host ""
}

Write-Host ""
Write-Host "Starting services..." -ForegroundColor Green
Write-Host ""

# Get root directory
$rootDir = Get-Location

# Start ML API
Start-Service `
    -ServiceName "ML API (Port 6000)" `
    -Path (Join-Path $rootDir "ml-model") `
    -Command "python train.py; python app.py" `
    -Icon "📡"

# Start Backend
Start-Service `
    -ServiceName "Backend (Port 5001)" `
    -Path (Join-Path $rootDir "backend") `
    -Command "npm install; node server.js" `
    -Icon "🔧"

# Start Frontend
Start-Service `
    -ServiceName "Frontend (Port 5173)" `
    -Path (Join-Path $rootDir "frontend") `
    -Command "npm install; npm run dev" `
    -Icon "🎨"

Write-Host "✅ All services launched!" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access points:" -ForegroundColor Cyan
Write-Host "   • Frontend:  http://localhost:5173" -ForegroundColor White
Write-Host "   • Backend:   http://localhost:5001" -ForegroundColor White
Write-Host "   • ML API:    http://localhost:6000" -ForegroundColor White
Write-Host "   • Database:  mongodb://127.0.0.1:27017/agri_chatbot" -ForegroundColor White
Write-Host ""
Write-Host "💡 Each service runs in its own window." -ForegroundColor Yellow
Write-Host "❌ Close the window to stop a service." -ForegroundColor Yellow
Write-Host ""
