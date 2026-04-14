# 📦 Deployment & Docker Guide

## Quick Deployment Options

### Option 1: Local Development (Recommended for Testing)
See `GETTING_STARTED.md` for quick startup with `.\start.ps1`

### Option 2: Docker Deployment (Recommended for Production)
Requires: Docker and Docker Compose installed

```powershell
# Stop any running services on ports 5001, 6000, 5173
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f ml-api

# Stop all services
docker-compose down

# Clean up volumes (including database)
docker-compose down -v
```

## File Structure

```
iirr/
├── docker-compose.yml          ← Orchestrates all containers
├── .env.example                ← Environment reference
│
├── backend/
│   ├── Dockerfile              ← Backend container image
│   ├── package.json
│   ├── server.js
│   ├── .env                    ← Backend config (port 5001)
│   └── models/
│       └── User.js
│
├── ml-model/
│   ├── Dockerfile              ← ML API container image
│   ├── requirements.txt         ← Python dependencies
│   ├── app.py
│   ├── train.py
│   └── .env                    ← ML config (port 6000)
│
├── frontend/
│   ├── Dockerfile              ← Frontend container image
│   ├── nginx.conf              ← Nginx web server config
│   ├── vite.config.js
│   ├── package.json
│   └── .env.local              ← Frontend API URL
│
└── dataset/
    └── final_modified_dataset.xlsx

```

## Docker Container Architecture

```
┌─ Docker Network: agri_network ──────────────────┐
│                                                   │
│  ┌─────────────────────────────────────────┐    │
│  │  mongodb (Port 27017)                   │    │
│  │  - Database: agri_chatbot               │    │
│  │  - Volume: mongodb_data                 │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
│  ┌────────────▼────────────────────────────┐    │
│  │  ml-api (Port 6000)                     │    │
│  │  - Flask Python app                     │    │
│  │  - Random Forest models                 │    │
│  │  - Dataset matching                     │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
│  ┌────────────▼────────────────────────────┐    │
│  │  backend (Port 5001)                    │    │
│  │  - Express.js server                    │    │
│  │  - MongoDB client                       │    │
│  │  - ML API client                        │    │
│  └────────────┬────────────────────────────┘    │
│               │                                   │
│  ┌────────────▼────────────────────────────┐    │
│  │  frontend (Port 5173)                   │    │
│  │  - React + Vite                         │    │
│  │  - Nginx web server                     │    │
│  └─────────────────────────────────────────┘    │
│                                                   │
└───────────────────────────────────────────────────┘
```

## Docker Build & Pull Commands

```powershell
# Build all images
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build ml-api
docker-compose build frontend

# View images
docker images | grep agri

# Remove images
docker rmi agri-chatbot-backend agri-chatbot-ml agri-chatbot-frontend
```

## Production Deployment Checklist

### Pre-Deployment
- [ ] Create `.env` files in backend/, frontend/, ml-model/
- [ ] Set `VITE_API_URL` to production domain
- [ ] Update `MONGO_URI` to MongoDB Atlas or production DB
- [ ] Set `ML_API_URL` to production ML API
- [ ] Test locally with Docker Compose first
- [ ] Set up SSL certificates for HTTPS
- [ ] Configure database backups
- [ ] Set up monitoring/logging

### Deployment Options

#### A. AWS EC2 with Docker
1. Launch EC2 instance (Ubuntu 22.04, t3.medium)
2. Install Docker: `sudo apt-get install docker.io docker-compose-v2`
3. Clone repository
4. Create `.env` files with production values
5. Run: `sudo docker-compose up -d`
6. Set up ALB or CloudFront for HTTPS

#### B. DigitalOcean App Platform
1. Connect GitHub repository
2. Create app.yaml referencing docker-compose.yml
3. Set environment variables
4. Enable auto-deploy on push
5. Set up domain with SSL

#### C. Azure Container Instances
1. Push images to Azure Container Registry (ACR)
2. Deploy via Container Group
3. Set environment variables
4. Configure Application Gateway
5. Enable auto-scaling if needed

#### D. Heroku (Legacy)
```bash
# Add Hobby Dyno tier
heroku create agri-chatbot

# Deploy backend
git subtree push --prefix backend heroku main

# Deploy ML API (separate Heroku app)
git subtree push --prefix ml-model heroku-ml main
```

## Environment Variables for Production

### backend/.env (Production)
```env
PORT=5001
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster.mongodb.net/agri_chatbot?retryWrites=true&w=majority
ML_API_URL=https://api.yourdomain.com:6000
LOG_LEVEL=info
CORS_ORIGIN=https://yourdomain.com
```

### ml-model/.env (Production)
```env
FLASK_ENV=production
FLASK_PORT=6000
DATASET_PATH=/app/dataset/final_modified_dataset.xlsx
LOG_LEVEL=info
MODEL_CACHE_SIZE=100
```

### frontend/.env.local (Production)
```env
VITE_API_URL=https://api.yourdomain.com:5001
VITE_ENABLE_ANALYTICS=true
```

## Monitoring & Logs

### Docker Logs
```powershell
# View logs from all services
docker-compose logs -f

# View logs from specific service
docker-compose logs -f backend
docker-compose logs -f ml-api
docker-compose logs -f mongodb

# View last 100 lines
docker-compose logs --tail 100
```

### Health Checks
All containers have built-in health checks:
```powershell
# Check container health
docker-compose ps

# Manual health test
curl http://localhost:5001/health
curl http://localhost:6000/health
```

### Performance Monitoring
```powershell
# CPU/Memory usage
docker stats

# Disk usage
docker system df

# Network usage
docker network inspect agri_network
```

## Database Backup (MongoDB)

### Backup Local Development
```powershell
# Create backup
docker exec agri-chatbot-mongo mongodump --out /backups/mongo-backup

# Export to file
docker exec agri-chatbot-mongo mongoexport --db agri_chatbot --collection users --out /backups/users.json
```

### Backup MongoDB Atlas
```bash
# Enable backup in Atlas UI
# Restore via Restore button in Atlas console
```

## Troubleshooting

### Container Won't Start
```powershell
# View detailed logs
docker logs agri-chatbot-backend

# Check environment variables
docker inspect agri-chatbot-backend | grep -A 20 "Env"

# Rebuild without cache
docker-compose build --no-cache
```

### Database Connection Error
```powershell
# Verify MongoDB container is running
docker-compose ps mongodb

# Check MongoDB logs
docker logs agri-chatbot-mongo

# Test connection
docker exec agri-chatbot-backend node -e "require('mongodb').MongoClient.connect('mongodb://mongodb:27017/agri_chatbot', {}, (err, client) => { console.log(err ? 'FAILED' : 'SUCCESS'); process.exit(err ? 1 : 0); })"
```

### API Connection Error
```powershell
# View network
docker network inspect agri_network

# Test from container
docker exec agri-chatbot-backend curl http://ml-api:6000/health
```

## Scaling Considerations

### Horizontal Scaling (Multiple Instances)
1. Use Kubernetes (EKS, AKS, GKE) for orchestration
2. Configure service replicas: `replicas: 3`
3. Use load balancer (ALB, NLB, Load Balancer)
4. Enable auto-scaling based on CPU/memory

### Vertical Scaling (Larger Instances)
1. Increase worker_processes in nginx.conf
2. Increase Node.js memory: `--max-old-space-size=2048`
3. Increase Python workers: `--workers 4`
4. Use connection pooling for MongoDB

### Database Scaling
1. MongoDB Replica Set for high availability
2. MongoDB Atlas auto-scaling
3. Add read replicas for heavy query loads
4. Implement caching layer (Redis)

## Cost Optimization

- Use spot instances (AWS) or preemptible VMs (GCP)
- Right-size compute instances (t3.small is sufficient for MVP)
- Use CDN for frontend assets (CloudFront, Cloudflare)
- Clean up unused Docker images/volumes
- Enable auto-shutdown for dev/test environments

---

**Ready for production deployment! 🚀**
