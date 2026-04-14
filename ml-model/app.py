import os
import pickle
from pathlib import Path

import numpy as np
import pandas as pd
from flask import Flask, request, jsonify

app = Flask(__name__)
BASE_DIR = Path(__file__).resolve().parent

# Load model and encoders
with open(BASE_DIR / "model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open(BASE_DIR / "encoders.pkl", "rb") as encoders_file:
    encoders = pickle.load(encoders_file)

with open(BASE_DIR / "target_encoder.pkl", "rb") as target_encoder_file:
    target_encoder = pickle.load(target_encoder_file)

# Load dataset for matching
DATASET_PATH = BASE_DIR.parent / 'dataset' / 'final_modified_dataset.xlsx'
dataset_df = None

def load_dataset():
    global dataset_df
    try:
        if DATASET_PATH.exists():
            dataset_df = pd.read_excel(DATASET_PATH)
            print(f"Dataset loaded: {len(dataset_df)} rows")
            print(f"Columns: {list(dataset_df.columns)}")
    except Exception as e:
        print(f"Warning: Could not load dataset: {e}")
        dataset_df = None

def normalize_value(value):
    """Normalize input for comparison"""
    if isinstance(value, str):
        return value.lower().strip()
    return str(value).lower().strip()

def find_dataset_match(inputs):
    """Find matching prediction from dataset"""
    if dataset_df is None or dataset_df.empty:
        print("Warning: dataset not loaded or empty")
        return None, False
    
    try:
        df = dataset_df.copy()
        
        # Normalize column names
        df.columns = [normalize_value(col) for col in df.columns]
        
        # Define matching fields in order of importance
        match_fields = [
            ('variety_name', 'variety_name'),
            ('crop_status', 'crop_status'),
            ('stage', 'stage'),
            ('weather_type', 'weather_type'),
            ('crop_duration', 'crop_duration'),
            ('distribution', 'distribution'),
            ('symptom_1', 'symptom_1'),
        ]
        
        # Progressive matching through all available fields
        matches = df.copy()
        for input_field, df_field in match_fields:
            if input_field in inputs and df_field in matches.columns:
                val = normalize_value(inputs[input_field])
                if val:
                    mask = matches[df_field].astype(str).apply(
                        lambda x: normalize_value(x) == val
                    )
                    filtered = matches[mask]
                    if not filtered.empty:
                        matches = filtered
        
        # Return match if found
        if not matches.empty:
            match_row = matches.iloc[0].to_dict()
            # Look for prediction column (could be named: prediction, pest, disease, recommendation, etc.)
            prediction_cols = ['prediction', 'pest', 'disease', 'recommendation', 'output', 'result']
            for col in prediction_cols:
                if col in df.columns and pd.notna(match_row.get(col)):
                    return str(match_row.get(col)), True  # True indicates dataset match
        
        return None, False
    except Exception as e:
        print(f"Error in dataset matching: {e}")
        return None, False

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json.get("inputs", {})
    
    # First, try to match against dataset
    dataset_prediction, is_dataset_match = find_dataset_match(data)
    if dataset_prediction:
        return jsonify({
            "prediction": dataset_prediction,
            "source": "dataset_match",
            "matched": True
        })
    
    # Fallback to ML model
    processed = []
    for col in encoders:
        val = str(data.get(col, ""))
        if val in encoders[col].classes_:
            encoded = encoders[col].transform([val])[0]
        else:
            encoded = 0  # fallback
        processed.append(encoded)

    processed = np.array(processed).reshape(1, -1)
    pred = model.predict(processed)
    result = target_encoder.inverse_transform(pred)

    return jsonify({
        "prediction": result[0],
        "source": "model_prediction",
        "matched": False
    })

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "dataset_loaded": dataset_df is not None,
        "dataset_rows": len(dataset_df) if dataset_df is not None else 0
    })

if __name__ == "__main__":
    load_dataset()
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 6000)), debug=False)
