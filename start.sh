#!/bin/bash

echo "🚀 Agricultural Chatbot Startup"
echo "=============================="
echo ""
echo "This script will start all required services."
echo ""

# Check if folders exist
if [ ! -d "ml-model" ] || [ ! -d "backend" ] || [ ! -d "frontend" ]; then
    echo "❌ Error: Missing folders. Run from project root."
    exit 1
fi

# Start ML API
echo "📡 Starting ML API (Port 6000)..."
cd ml-model
python train.py > /dev/null 2>&1
python app.py &
ML_PID=$!
cd ..

sleep 2

# Start Backend
echo "🔧 Starting Backend (Port 5001)..."
cd backend
npm install > /dev/null 2>&1
node server.js &
BACKEND_PID=$!
cd ..

sleep 2

# Start Frontend
echo "🎨 Starting Frontend (Port 5173)..."
cd frontend
npm install > /dev/null 2>&1
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo ""
echo "🌐 Access the application:"
echo "   Frontend: http://localhost:5173"
echo "   Backend: http://localhost:5001"
echo "   ML API: http://localhost:6000"
echo ""
echo "📊 MongoDB should be running separately"
echo ""
echo "Press Ctrl+C to stop all services"
echo ""

# Keep script running
wait
