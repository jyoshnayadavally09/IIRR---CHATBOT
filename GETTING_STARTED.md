# 🚀 Getting Started Guide - Agricultural Chatbot

## Quick Start (3 Steps)

### 1️⃣ **Start MongoDB**
```powershell
mongod --dbpath %USERPROFILE%\mongodb\data
```
Or create the folder if it doesn't exist:
```powershell
mkdir %USERPROFILE%\mongodb\data
mongod --dbpath %USERPROFILE%\mongodb\data
```

### 2️⃣ **Run Startup Script**

**Option A: PowerShell (Recommended)**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
.\start.ps1
```

**Option B: Batch File (Windows)**
```cmd
start.bat
```

**Option C: Manual (4 Terminals)**

Terminal 1 - ML API:
```powershell
cd ml-model
python train.py
python app.py
```

Terminal 2 - Backend:
```powershell
cd backend
npm install
node server.js
```

Terminal 3 - Frontend:
```powershell
cd frontend
npm install
npm run dev
```

Terminal 4 - MongoDB (already started in Step 1)

### 3️⃣ **Open in Browser**
```
http://localhost:5173
```

---

## 🔍 Verification Checklist

After starting all services, verify each one:

### ✅ MongoDB
```powershell
# Test in another terminal
mongo
# Should connect without errors
# Type: exit
```

### ✅ ML API (Port 6000)
```powershell
# Open browser or use curl
Invoke-WebRequest -Uri "http://localhost:6000/health"
# Expected: { "status": "ok" }
```

### ✅ Backend (Port 5001)
```powershell
Invoke-WebRequest -Uri "http://localhost:5001/health"
# Expected: All services connected
```

### ✅ Frontend (Port 5173)
```
http://localhost:5173
# Should load the chatbot interface
```

---

## 📋 Environment Variables

Files are pre-configured:
- `backend/.env` → Port 5001, MongoDB, ML API URL
- `frontend/.env.local` → Backend API URL
- `ml-model/.env` → Flask port, dataset path

**Change these only if you modify ports or URLs.**

---

## 🧪 Complete Test Flow

1. Open `http://localhost:5173` in browser
2. Fill out chatbot form:
   - Name: "Test Farmer"
   - Weather: "Normal"
   - Stage: "Vegetative"
   - Symptoms: Select any
3. Submit form
4. Should see response: `Prediction: [disease/pest] (Dataset Match or AI Model)`

### Check Database
```powershell
# In another terminal with mongo installed
mongo
> use agri_chatbot
> db.users.findOne()
# Should show saved record with all fields
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
# Find process using port (e.g., 5001)
Get-NetTCPConnection -LocalPort 5001 | Select-Object OwningProcess
# Kill it
Stop-Process -Id [PID] -Force
```

### MongoDB Connection Error
```
Error: Cannot connect to MongoDB at mongodb://127.0.0.1:27017
```
**Solution:**
- Verify mongod is running
- Check `mongod --version` exists
- Ensure data directory exists: `%USERPROFILE%\mongodb\data`

### ML API Not Found
```
Error: ECONNREFUSED 127.0.0.1:6000
```
**Solution:**
- Check `python train.py` ran successfully (creates model.pkl)
- Verify `python app.py` started
- Check Python has required packages: `pip install scikit-learn flask pandas openpyxl`

### Frontend Cannot Connect to Backend
```
CORS error or Network error
```
**Solution:**
- Verify `backend/.env` has correct `VITE_API_URL`
- Rebuild frontend: `cd frontend && npm run build`
- Clear browser cache

---

## 📊 API Endpoints

| Endpoint | Method | Purpose | Returns |
|----------|--------|---------|---------|
| `/predict` | POST | Get crop prediction | `{ prediction, prediction_source, record_id }` |
| `/history` | GET | Get last 10 predictions | Array of predictions |
| `/stats` | GET | Get system statistics | Total records, healthy/unhealthy count |
| `/health` | GET | Check all services | Status of MongoDB, Flask, Redis (if used) |

### Example: cURL Prediction Request
```powershell
$payload = @{
    farmer_name = "John Doe"
    location = @{ latitude = 28.6139; longitude = 77.2090 }
    weather_type = "Normal"
    rainfall = 600
    temperature = 28
    humidity = 65
    variety_type = "Traditional"
    variety_name = "Basmati"
    crop_duration = "120 days"
    stage = "Vegetative"
    crop_status = "Healthy"
    color = "Green"
    distribution = "Uniform"
    symptom_1 = "None"
    symptom_2 = "None"
    insects_present = false
    part_damaged = "None"
    insect_location = "None"
    damage_level = 0
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5001/predict" `
    -Method POST `
    -ContentType "application/json" `
    -Body $payload
```

---

## 📦 Dependencies

Ensure these are installed:

**Node.js (Backend + Frontend):**
```powershell
node --version  # Should be 16+
npm --version   # Should be 8+
```

**Python (ML Model):**
```powershell
python --version  # Should be 3.8+
pip install scikit-learn flask pandas openpyxl
```

**MongoDB:**
Download from: https://www.mongodb.com/try/download/community

---

## 🔧 Advanced: Custom Configuration

### Change Default Output Port
Edit `backend/.env`:
```env
PORT=5002  # Instead of 5001
```
Then update `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:5002
```

### Use Remote MongoDB
Edit `backend/.env`:
```env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/agri_chatbot
```

### Train Custom Model
```powershell
cd ml-model
python train.py
# Creates: model.pkl, encoders.pkl, target_encoder.pkl
```

---

## 📱 Deployment

For production:
1. Build frontend: `cd frontend && npm run build`
2. Use environment variables from `.env.example`
3. Deploy React build to CDN or static host
4. Deploy Node backend to cloud (Heroku, AWS, DigitalOcean)
5. Deploy Flask API to cloud
6. Use MongoDB Atlas for database

---

## 💡 Key Features

✅ **Dataset Matching** - Returns exact match if found in Excel  
✅ **AI Fallback** - Uses Random Forest model if no dataset match  
✅ **Data Persistence** - All predictions stored in MongoDB  
✅ **Geolocation** - Auto-captures farmer location (if permitted)  
✅ **Mobile Responsive** - Works on all screen sizes  
✅ **Progressive Questions** - Only shows relevant questions  

---

## 📞 Support

For issues:
1. Check logs in terminal windows
2. Verify all `.env` files are created
3. Ensure ports 5001, 6000, 5173 are available
4. Run `npm install` in frontend/ and backend/ if needed
5. Run `pip install` for Python dependencies if needed

---

**Ready to go! 🚀 Open http://localhost:5173 and start testing!**
