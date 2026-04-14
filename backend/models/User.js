import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  // Farmer & Location
  farmer_name: { type: String, default: null },
  location: {
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    state: { type: String, default: null },
  },

  // Weather
  weather_type: { type: String, default: null },
  rainfall: { type: String, default: null },
  temperature: { type: String, default: null },
  humidity: { type: String, default: null },
  abnormal_weather: { type: String, default: null },

  // Variety
  variety_type: { type: String, default: null },
  variety_name: { type: String, default: null },
  crop_duration: { type: String, default: null },

  // Growth Stage
  stage: { type: String, default: null },

  // Crop Status
  crop_status: { type: String, default: null },
  color: { type: String, default: null },
  distribution: { type: String, default: null },

  // Symptoms
  symptom_1: { type: String, default: null },
  symptom_2: { type: String, default: null },

  // Insects
  insects_present: { type: String, default: null },
  part_damaged: { type: String, default: null },
  insect_location: { type: String, default: null },

  // Damage
  damage_level: { type: String, default: null },

  // Prediction & Source
  prediction: { type: String, required: true },
  prediction_source: { type: String, enum: ['dataset_match', 'model_prediction'], default: 'model_prediction' },
  
  // Raw input (for reference)
  raw_input: { type: mongoose.Schema.Types.Mixed, default: null },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);

