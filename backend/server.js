import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { predict, getHistory, getStats } from "./controllers/predictController.js";

const app = express();
const PORT = Number(process.env.PORT || 5001);
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/agri_chatbot";

app.use(cors());
app.use(express.json());

async function connectMongo() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
  }
}

app.get("/health", (_request, response) => {
  response.json({
    status: "ok",
    mongo: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.post("/predict", predict);
app.get("/history", getHistory);
app.get("/stats", getStats);

connectMongo().finally(() => {
  app.listen(PORT, () => {
    console.log(`✅ Backend server listening on http://127.0.0.1:${PORT}`);
    console.log(`📡 ML API URL: ${process.env.ML_API_URL || "http://127.0.0.1:6000"}`);
  });
});

