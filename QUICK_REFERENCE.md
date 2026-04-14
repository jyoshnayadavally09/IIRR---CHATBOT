# 🎯 Quick Reference Card

## One-Command Startup (Windows)
```powershell
.\start.ps1
```

## Manual Startup (4 Terminals)

| Terminal | Command | Port |
|----------|---------|------|
| 1️⃣ MongoDB | `mongod --dbpath %USERPROFILE%\mongodb\data` | 27017 |
| 2️⃣ ML API | `cd ml-model && python train.py && python app.py` | 6000 |
| 3️⃣ Backend | `cd backend && npm install && node server.js` | 5001 |
| 4️⃣ Frontend | `cd frontend && npm install && npm run dev` | 5173 |

## Access URLs
- 🎨 Frontend: http://localhost:5173
- 🔧 Backend: http://localhost:5001
- 📡 ML API: http://localhost:6000
- 💾 Database: mongodb://127.0.0.1:27017/agri_chatbot

## Quick Checks
```powershell
# Check if ports are open
Get-NetTCPConnection -LocalPort 5001,5173,6000,27017 | Select-Object LocalPort,State

# Check MongoDB
mongo --eval "db.adminCommand('ping')"

# Check Backend Health
Invoke-WebRequest "http://localhost:5001/health"

# Check ML API Health
Invoke-WebRequest "http://localhost:6000/health"
```

## Kill Running Services
```powershell
# Kill by port
$process = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
if ($process) { Stop-Process -Id $process.OwningProcess -Force }

# Kill MongoDB
Stop-Process -Name mongod -Force -ErrorAction SilentlyContinue

# Kill by name
Stop-Process -Name node -Force
Stop-Process -Name python -Force
```

## File Structure
```
iirr/
├── frontend/          (React + Vite)
├── backend/           (Node + Express)
├── ml-model/          (Python + Flask)
├── dataset/           (Excel data)
├── start.ps1          (PowerShell launcher)
├── start.bat          (Batch launcher)
└── GETTING_STARTED.md (Full guide)
```

## Environment Variables Already Set
- ✅ backend/.env
- ✅ frontend/.env.local
- ✅ ml-model/.env

**No additional setup needed!**

## First Time Only
```powershell
# Install dependencies
cd backend && npm install
cd ../frontend && npm install
cd ../ml-model
pip install scikit-learn flask pandas openpyxl
```

## Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| Port in use | `Get-NetTCPConnection -LocalPort [PORT] \| Select-Object OwningProcess` then kill |
| MongoDB won't start | `mkdir %USERPROFILE%\mongodb\data` |
| Python not found | Add Python to PATH or use full path |
| Module not found | `pip install scikit-learn flask pandas openpyxl` |
| CORS error | Check `frontend/.env.local` has correct API URL |

## Test the System End-to-End
1. Open http://localhost:5173
2. Fill chatbot form
3. Submit
4. Check MongoDB: `mongo` → `use agri_chatbot` → `db.users.findOne()`
5. Verify response shows source: "(Dataset Match)" or "(AI Model)"

---

**Everything is pre-configured. Just run `.\start.ps1` and enjoy! 🚀**
