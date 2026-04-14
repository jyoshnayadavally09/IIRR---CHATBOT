import axios from "axios";
import { User } from "../models/User.js";

const ML_API_URL = process.env.ML_API_URL || "http://127.0.0.1:6000";

export const predict = async (request, response) => {
  try {
    const payload = request.body;

    if (!payload || typeof payload !== "object") {
      return response.status(400).json({ error: "Invalid payload" });
    }

    // Call Flask ML API
    let mlResponse;
    try {
      mlResponse = await axios.post(`${ML_API_URL}/predict`, { inputs: payload }, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });
    } catch (mlError) {
      console.error("ML API Error:", mlError.message);
      return response.status(502).json({
        error: "ML prediction service unavailable",
        fallback: "Using default recommendation",
      });
    }

    const prediction = mlResponse.data?.prediction || "Unable to determine";
    const predictionSource = mlResponse.data?.source || "model_prediction";

    // Prepare data for MongoDB
    const userRecord = {
      farmer_name: payload.farmer_name || null,
      location: {
        latitude: payload.location?.latitude || null,
        longitude: payload.location?.longitude || null,
        state: payload.location?.state || null,
      },
      weather_type: payload.weather_type || null,
      rainfall: payload.rainfall || null,
      temperature: payload.temperature || null,
      humidity: payload.humidity || null,
      abnormal_weather: payload.abnormal_weather || null,
      variety_type: payload.variety_type || null,
      variety_name: payload.variety_name || null,
      crop_duration: payload.crop_duration || null,
      stage: payload.stage || null,
      crop_status: payload.crop_status || null,
      color: payload.color || null,
      distribution: payload.distribution || null,
      symptom_1: payload.symptom_1 || null,
      symptom_2: payload.symptom_2 || null,
      insects_present: payload.insects_present || null,
      part_damaged: payload.part_damaged || null,
      insect_location: payload.insect_location || null,
      damage_level: payload.damage_level || null,
      prediction,
      prediction_source: predictionSource,
      raw_input: payload,
    };

    // Save to MongoDB
    const savedRecord = await User.create(userRecord);

    // Return response
    return response.json({
      success: true,
      prediction,
      prediction_source: predictionSource,
      record_id: savedRecord._id,
      message: "Prediction saved successfully",
    });
  } catch (error) {
    console.error("Prediction Error:", error);
    return response.status(500).json({
      error: "Server error during prediction",
      details: error.message,
    });
  }
};

export const getHistory = async (request, response) => {
  try {
    const limit = parseInt(request.query.limit) || 10;
    const records = await User.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return response.json({
      success: true,
      count: records.length,
      records: records.map((record) => ({
        id: record._id,
        farmer_name: record.farmer_name,
        prediction: record.prediction,
        prediction_source: record.prediction_source,
        stage: record.stage,
        crop_status: record.crop_status,
        createdAt: record.createdAt,
      })),
    });
  } catch (error) {
    console.error("History Error:", error);
    return response.status(500).json({
      error: "Unable to fetch history",
      details: error.message,
    });
  }
};

export const getStats = async (request, response) => {
  try {
    const totalRecords = await User.countDocuments();
    const healthyCount = await User.countDocuments({ crop_status: "healthy" });
    const unhealthyCount = await User.countDocuments({ crop_status: "unhealthy" });
    const datasetMatches = await User.countDocuments({ prediction_source: "dataset_match" });
    const modelPredictions = await User.countDocuments({ prediction_source: "model_prediction" });

    return response.json({
      success: true,
      stats: {
        totalRecords,
        healthyCount,
        unhealthyCount,
        datasetMatches,
        modelPredictions,
      },
    });
  } catch (error) {
    console.error("Stats Error:", error);
    return response.status(500).json({
      error: "Unable to fetch stats",
      details: error.message,
    });
  }
};
