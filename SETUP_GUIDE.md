# 🔷 AGRICULTURAL CHATBOT - COMPLETE SETUP GUIDE

## ✅ System Architecture

```
Frontend (React Chatbot)
    ↓
Node.js Backend (Express)
    ↓ ← ML Prediction
    ↓
Flask ML API (Random Forest)
    ↓
Dataset Matching
    ↓
MongoDB (User Data Storage)
    ↓
Return to Frontend
```

---

## 📋 FINAL CHECKLIST

### ✅ 1. ML Model (Random Forest)
- **File**: `ml-model/train.py`
- **Model**: Random Forest (200 estimators, max_depth=10)
- **Accuracy**: Evaluated on test set
- **Features**: All dataset columns
- **Target**: Pest/Disease prediction

**Run**:
```bash
cd ml-model
python train.py
```

**Output**: 
- `model.pkl` - Trained model
- `encoders.pkl` - Feature encoders
- `target_encoder.pkl` - Target class encoder

---

### ✅ 2. ML API Server (Flask)
- **File**: `ml-model/app.py`
- **Port**: 6000
- **Endpoint**: `POST /predict`
- **Features**:
  - First tries dataset matching
  - Falls back to ML model
  - Returns prediction + source

**Run**:
```bash
cd ml-model
python app.py
```

---

### ✅ 3. Database (MongoDB)
- **Collection**: User
- **Fields**: 
  - Farmer info (name, location)
  - Weather data (type, rainfall, temp, humidity)
  - Crop info (variety, duration, stage)
  - Health data (status, color, distribution)
  - Symptoms (symptom_1, symptom_2)
  - Insects (presence, part damaged, location)
  - Prediction results

**Connection**: `mongodb://127.0.0.1:27017/agri_chatbot`

---

### ✅ 4. Backend (Node.js Express)
- **File**: `backend/server.js`
- **Port**: 5001
- **Endpoints**:
  - `POST /predict` - Get prediction + save to DB
  - `GET /history` - Get past predictions
  - `GET /stats` - Get statistics
  - `GET /health` - Check server health

**Run**:
```bash
cd backend
npm install
node server.js
```

---

### ✅ 5. Frontend (React + Vite)
- **File**: `frontend/src/components/ChatbotForm.jsx`
- **Features**:
  - Conversational chatbot interface
  - Progressive question flow
  - Conditional questions based on answers
  - Message-based interaction
  - Displays prediction results + source

**Run**:
```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 COMPLETE STARTUP SEQUENCE

### Terminal 1 - MongoDB
```bash
mongod
```
(or use MongoDB cloud)

### Terminal 2 - ML API (Port 6000)
```bash
cd ml-model
python train.py    # Only first time
python app.py
```

### Terminal 3 - Backend (Port 5001)
```bash
cd backend
npm install
node server.js
```

### Terminal 4 - Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```

---

## 📊 DATA FLOW

### User Input → Prediction → Storage

1. **Frontend collects data**:
   - Farmer name, location
   - Weather conditions
   - Variety details
   - Crop stage
   - Health status
   - Symptoms
   - Insect info
   - Damage level

2. **Send to Backend** (`POST /predict`):
```json
{
  "farmer_name": "Ramesh",
  "location": {"latitude": 28.1234, "longitude": 77.5678},
  "weather_type": "normal",
  "rainfall": "medium",
  "temperature": "20-30",
  "humidity": "50-90",
  "variety_type": "Hybrid",
  "variety_name": "IR-64",
  "crop_duration": "short",
  "stage": "Flowering–Maturity",
  "crop_status": "unhealthy",
  "color": "yellow",
  "distribution": "patches",
  "symptom_1": "Wilting",
  "symptom_2": "Pointed leaf tips",
  "insects_present": "yes",
  "part_damaged": "leaf",
  "insect_location": "outside",
  "damage_level": "More than ETL"
}
```

3. **Backend processes**:
   - Calls Flask ML API
   - Gets prediction
   - Saves all data to MongoDB
   - Returns result

4. **Response** (`GET /predict`):
```json
{
  "success": true,
  "prediction": "Brown Leaf Spot",
  "prediction_source": "dataset_match",
  "record_id": "507f1f77bcf86cd799439011"
}
```

5. **Frontend displays**:
   - Prediction
   - Source (Dataset or Model)
   - Recommendation

---

## 🔍 IMPORTANT ENDPOINTS

### 1. Predict
```bash
POST /predict
Body: Structured farm input object
Response: Prediction + source + record_id
```

### 2. History
```bash
GET /history?limit=10
Response: Last 10 predictions with summaries
```

### 3. Statistics
```bash
GET /stats
Response: Total records, healthy/unhealthy split, match sources
```

### 4. Health Check
```bash
GET /health
Response: Server status, MongoDB connection, ML API status
```

---

## 🧠 ML MODEL DETAILS

### Random Forest Configuration
- **n_estimators**: 200 trees
- **max_depth**: 10 (prevents overfitting)
- **min_samples_split**: 5
- **min_samples_leaf**: 2
- **random_state**: 42 (reproducibility)

### Why Random Forest?
✅ Works well with categorical data
✅ No scaling needed
✅ Handles missing values
✅ Fast prediction
✅ High accuracy
✅ Feature importance available

---

## 📁 PROJECT STRUCTURE

```
iirr/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ChatbotForm.jsx (Main chatbot)
│   │   ├── services/
│   │   │   └── api.js (API calls)
│   │   └── App.jsx
│   └── package.json
├── backend/
│   ├── controllers/
│   │   └── predictController.js (Prediction logic)
│   ├── models/
│   │   └── User.js (MongoDB schema)
│   ├── server.js (Express server)
│   └── package.json
├── ml-model/
│   ├── train.py (Model training)
│   ├── app.py (Flask API)
│   └── models/ (Saved .pkl files)
├── dataset/
│   ├── final_modified_dataset.xlsx (Data source)
│   └── README.md
└── README.md
```

---

## 🔑 KEY FILES TO RUN

1. **Train Model**: `python ml-model/train.py`
2. **Start ML API**: `python ml-model/app.py`
3. **Start Backend**: `node backend/server.js`
4. **Start Frontend**: `npm run dev` (in frontend folder)

---

## 💾 DATABASE SCHEMA

### User Collection
```javascript
{
  _id: ObjectId,
  farmer_name: String,
  location: {
    latitude: Number,
    longitude: Number
  },
  weather_type: String,
  rainfall: String,
  temperature: String,
  humidity: String,
  abnormal_weather: String,
  variety_type: String,
  variety_name: String,
  crop_duration: String,
  stage: String,
  crop_status: String,
  color: String,
  distribution: String,
  symptom_1: String,
  symptom_2: String,
  insects_present: String,
  part_damaged: String,
  insect_location: String,
  damage_level: String,
  prediction: String,
  prediction_source: "dataset_match" | "model_prediction",
  raw_input: Object,
  createdAt: Date
}
```

---

## 🎓 VIVA ANSWER

**Q: How does the system work?**

A: "Our agricultural chatbot system uses a Random Forest machine learning model to predict pest and disease in crops. The flow works as follows:

1. **Data Collection**: The chatbot progressively asks farmers about their crop conditions through a conversational interface.

2. **Prediction**: User inputs are sent to a Flask API that first attempts to match against our dataset. If a match is found, we return that prediction directly. Otherwise, we use the trained Random Forest model.

3. **Storage**: All predictions and input data are stored permanently in MongoDB for future analysis and improvement.

4. **Frontend**: Results are displayed to the user with the prediction source (dataset match or model prediction) so they know the confidence level.

The Random Forest model was chosen because it handles categorical data well, doesn't require feature scaling, and provides good accuracy without extensive tuning."

---

## ✅ TEST THE SYSTEM

### 1. Test ML API
```bash
curl -X POST http://localhost:6000/predict \
  -H "Content-Type: application/json" \
  -d '{"inputs": {"weather_type": "normal", "variety_name": "IR-64", ...}}'
```

### 2. Test Backend
```bash
curl http://localhost:5001/health
curl http://localhost:5001/stats
```

### 3. Test Full Flow
- Open frontend (localhost:5173)
- Answer chatbot questions
- View prediction
- Check MongoDB for stored record

---

## 🚀 DEPLOYMENT READY

This system is ready for deployment on:
- **Frontend**: Vercel, Netlify
- **Backend**: Heroku, Railway, AWS
- **ML API**: Any Python-capable hosting
- **Database**: MongoDB Atlas

---

## 📞 SUPPORT

If any component fails:
1. Check port availability
2. Verify MongoDB connection
3. Check .env variables
4. Review console logs
5. Test endpoints individually

---

**Last Updated**: April 14, 2026
**Status**: ✅ Production Ready
