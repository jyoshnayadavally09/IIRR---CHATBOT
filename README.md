# 🌾 Agricultural Chatbot - AI-Powered Crop Disease & Pest Prediction

A full-stack machine learning chatbot system that helps farmers predict crop diseases and pest infestations through a conversational interface.

[![Status](https://img.shields.io/badge/status-production%20ready-green)]()
[![License](https://img.shields.io/badge/license-MIT-blue)]()
[![Node](https://img.shields.io/badge/node-20+-green)]()
[![Python](https://img.shields.io/badge/python-3.8+-blue)]()

## ✨ Features

- 🤖 **Conversational Chatbot** - Natural message-based interaction
- 🌍 **Geolocation** - Auto-captures farmer location
- 📊 **Dual Prediction** - Dataset matching + AI fallback (Random Forest)
- 💾 **Data Persistence** - All predictions stored in MongoDB
- 📱 **Mobile Responsive** - Works on all devices
- 🐳 **Docker Ready** - One-command production deployment
- 📈 **Analytics** - View prediction history and statistics

## 🚀 Quick Start

### **PowerShell (Easiest - Windows)**
```powershell
cd c:\Users\jyosh\iirr
.\start.ps1
```

### **Docker (Production)**
```powershell
docker-compose up -d
```

### **Manual (Full Control)**
See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for detailed commands.

Then open: **http://localhost:5173**

---

## 📁 Project Structure

```
iirr/
├── frontend/              # React 19 + Vite chatbot UI
│   ├── src/components/ChatbotForm.jsx  ← Main chatbot
│   └── src/services/api.js              ← Backend connector
├── backend/               # Express.js API server
│   ├── server.js          ← Express app
│   ├── controllers/predictController.js ← Prediction logic
│   └── models/User.js     ← MongoDB schema
├── ml-model/              # Flask ML API
│   ├── app.py             ← Flask server
│   ├── train.py           ← Random Forest trainer
│   └── requirements.txt    ← Python dependencies
├── dataset/               # Excel crop data
│   └── final_modified_dataset.xlsx
├── docker-compose.yml     ← Orchestrate all services
├── start.ps1              ← Auto-launcher
└── GETTING_STARTED.md     ← Setup guide
```

---

## 🏗️ System Architecture

```
User Browser
    ↓
React Frontend (Port 5173)
    ↓ [VITE_API_URL]
Express Backend (Port 5001)
    ├→ MongoDB (Port 27017) [Store predictions]
    └→ Flask ML API (Port 6000)
         ├→ Check Excel dataset
         └→ If no match: Random Forest prediction
```

---

## 🔧 Tech Stack

| Layer | Technology | Details |
|-------|-----------|---------|
| **Frontend** | React 19, Vite 8 | SPA chatbot UI, message bubbles |
| **Backend** | Node.js, Express | REST API, data validation |
| **Database** | MongoDB | Document storage, flexible schema |
| **ML** | Flask, scikit-learn | Random Forest classifier |
| **DevOps** | Docker, Docker Compose | Container orchestration |

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [GETTING_STARTED.md](GETTING_STARTED.md) | Complete setup guide with examples |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | One-page cheat sheet |
| [SYSTEM_CHECKLIST.md](SYSTEM_CHECKLIST.md) | Status of all components |
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Production deployment |
| [SYSTEM_SETUP_COMPLETE.md](SYSTEM_SETUP_COMPLETE.md) | Full configuration overview |

---

## ⚡ Getting Started Properly

### Prerequisites
- Node.js 16+ and npm 8+
- Python 3.8+ with pip
- MongoDB (local or Atlas)
- Docker (optional, for containerization)

### Step 1: Verify Setup
```powershell
node --version  # Should be 16+
npm --version   # Should be 8+
python --version  # Should be 3.8+
```

### Step 2: Start All Services
```powershell
.\start.ps1
```

This automatically:
- Starts MongoDB (port 27017)
- Starts ML API (port 6000)
- Starts Backend (port 5001)
- Starts Frontend (port 5173)

### Step 3: Open Chatbot
```
http://localhost:5173
```

### Step 4: Test Complete Flow
1. Fill chatbot form with farm details
2. Submit form
3. See prediction result
4. Check MongoDB for saved record

---

## 🤖 How It Works

### 1. User Submits Form
Frontend collects 20+ fields:
- Farmer info, weather, crop variety, crop stage, crop status, symptoms, insects, damage

### 2. Backend Receives Request
POST `/predict` endpoint processes submission

### 3. ML API Predicts
Two-stage prediction:
1. **Dataset Matching** - Exact match in Excel? Return it.
2. **AI Fallback** - No match? Use Random Forest model.

### 4. Result Stored
Prediction saved to MongoDB with:
- All input fields
- Prediction result
- Prediction source (dataset or AI)
- Timestamp

### 5. Frontend Shows Result
Displays prediction with source label:
```
🤖 Prediction: Powdery Mildew (Dataset Match)
```

---

## 📊 Example Request/Response

### Request (Frontend → Backend)
```json
{
  "farmer_name": "Ram Kumar",
  "location": { "latitude": 28.6139, "longitude": 77.2090 },
  "weather_type": "Normal",
  "rainfall": 600,
  "temperature": 28,
  "humidity": 65,
  "variety_type": "Traditional",
  "variety_name": "Basmati",
  "crop_duration": "120 days",
  "stage": "Vegetative",
  "crop_status": "Healthy",
  "color": "Green",
  "distribution": "Uniform",
  "symptom_1": "None",
  "symptom_2": "None",
  "insects_present": false,
  "part_damaged": "None",
  "insect_location": "None",
  "damage_level": 0
}
```

### Response (Backend → Frontend)
```json
{
  "success": true,
  "prediction": "Stem Borer",
  "prediction_source": "model_prediction",
  "record_id": "507f1f77bcf86cd799439011"
}
```

---

## 🔌 API Endpoints

### Backend (Port 5001)
```
POST /predict      → Get prediction + save to DB
GET  /history      → Last 10 predictions
GET  /stats        → Total records, healthy/unhealthy count
GET  /health       → Service health check
```

### ML API (Port 6000)
```
POST /predict      → Random Forest prediction
GET  /health       → API status
```

---

## 🧪 Testing & Verification

### Check All Services Running
```powershell
# Test MongoDB
mongo --eval "db.adminCommand('ping')"

# Test ML API
Invoke-WebRequest http://localhost:6000/health

# Test Backend
Invoke-WebRequest http://localhost:5001/health

# Test Frontend (browser)
http://localhost:5173
```

### Run System Health Check
```powershell
node test-system.js
```

---

## 🐳 Docker Deployment

### Build Images
```powershell
docker-compose build
```

### Start Services
```powershell
docker-compose up -d
```

### View Logs
```powershell
docker-compose logs -f backend
```

### Stop Services
```powershell
docker-compose down
```

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for production deployment to AWS, Azure, or Heroku.

---

## 🔐 Environment Variables

All `.env` files are pre-configured. Modify only if changing ports/URLs:

```env
# backend/.env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/agri_chatbot
ML_API_URL=http://localhost:6000

# frontend/.env.local
VITE_API_URL=http://localhost:5001

# ml-model/.env
FLASK_PORT=6000
DATASET_PATH=../dataset/final_modified_dataset.xlsx
```

---

## 🐛 Troubleshooting

### Port Already in Use
```powershell
Get-NetTCPConnection -LocalPort 5001
Stop-Process -Id [PID] -Force
```

### MongoDB Won't Connect
```powershell
mkdir $env:USERPROFILE\mongodb\data
mongod --dbpath $env:USERPROFILE\mongodb\data
```

### Frontend Can't Reach Backend
1. Check `frontend/.env.local` has correct `VITE_API_URL`
2. Verify `backend/.env` has correct `ML_API_URL`
3. Rebuild frontend: `cd frontend && npm run build`

See [GETTING_STARTED.md#troubleshooting](GETTING_STARTED.md#troubleshooting) for more solutions.

---

## 📦 Project Status

| Component | Status |
|-----------|--------|
| Frontend | ✅ Complete & Built |
| Backend | ✅ Complete & Configured |
| ML API | ✅ Complete & Ready |
| Database | ✅ Schema & Setup |
| Docker | ✅ Fully Configured |
| Docs | ✅ Comprehensive |

**System is production-ready!**

---

## 📈 Model Performance

**Random Forest Classifier**
- Trees: 200
- Max Depth: 10
- Min Samples Split: 5
- Features: Auto-detected from dataset
- Target: Auto-detected (pest/disease/prediction)

Model is trained on your Excel dataset and handles:
- Categorical variables (encoded)
- Multiple features
- Class imbalance (if any)

Accuracy evaluated on test set. See logs in `ml-model/train.py` output.

---

## 🚀 Next Steps

### For Development
1. Modify questions in `frontend/src/components/ChatbotForm.jsx`
2. Add new endpoints in `backend/server.js`
3. Retrain model: `cd ml-model && python train.py`

### For Production
1. Update environment variables for production URLs
2. Set up HTTPS/SSL certificates
3. Deploy with Docker to cloud platform (AWS, Azure, GCP)
4. Configure MongoDB Atlas for database
5. Set up CI/CD pipeline

### For Further Improvement
- Add user authentication
- Implement recommendation system
- Add seasonal data processing
- Create admin dashboard for statistics
- Integrate SMS/WhatsApp notifications

---

## 📞 Support

For issues, refer to:
1. [GETTING_STARTED.md](GETTING_STARTED.md) - Common setup issues
2. [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Reference commands
3. [SYSTEM_CHECKLIST.md](SYSTEM_CHECKLIST.md) - Component verification

---

## 📄 License

MIT License - Feel free to use, modify, and distribute

---

## 🙏 Acknowledgments

Built with:
- React & Vite for fast development
- Express.js for robust API
- MongoDB for flexible storage
- scikit-learn for ML models
- Flask for lightweight API

---

**Start now:**
```powershell
.\start.ps1
```

Then open: **http://localhost:5173** 🚀

---

*Last updated: System fully configured and production-ready*

The Express API runs on `http://127.0.0.1:5001`.

### 4. Start the React frontend

```bash
cd frontend
npm install
npm run dev
```

If needed, set:

```bash
VITE_API_BASE_URL=http://127.0.0.1:5001
```

## Request example

```json
{
  "inputs": {
    "stage": "nursery",
    "weather_type": "normal",
    "rainfall": "medium",
    "temperature": "20-30",
    "humidity": "50-90",
    "abnormal_weather": "na",
    "variety_type": "hybrid",
    "variety_name": "mtu-1010",
    "crop_duration": "medium",
    "crop_status": "unhealthy",
    "color": "yellow",
    "distribution": "patches",
    "symptom_1": "silvery streak",
    "symptom_2": "leaf rolling",
    "symptom_3": "na",
    "insects_present": "yes",
    "part_damaged": "leaf",
    "insect_location": "outside",
    "damage_level": "more than etl"
  },
  "location": {
    "latitude": 16.5062,
    "longitude": 80.648
  }
}
```

## Response example

```json
{
  "prediction": "Rice Thrips",
  "confidence": 0.81,
  "model_name": "Random Forest",
  "matched_on": ["stage", "weather_type", "rainfall"]
}
```
