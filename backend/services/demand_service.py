import os
import joblib
import pandas as pd
import numpy as np
from utils.preprocess import preprocess_input, get_all_features

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/demand_prediction_model.pkl")
ENCODER_PATH = os.path.join(os.path.dirname(__file__),"../../models/label_encoders.pkl")

_model_cache = None
_encoder_cache = None

def _load_model():
    global _model_cache, _encoder_cache

    if _model_cache is None:
        _model_cache = joblib.load(MODEL_PATH)

    if _encoder_cache is None:
            
            _encoder_cache = joblib.load(ENCODER_PATH)
       
    return _model_cache, _encoder_cache

def predict_demand(data: dict) -> dict:
    model, encoder = _load_model()
    df = preprocess_input(data, encoder)
    features = get_all_features(df)
    prediction = model.predict(features)
    demand_value = float(prediction[0])
    if demand_value < 0:
        demand_value = 0.0
    demand_label = _categorize_demand(demand_value)
    return {
        "predicted_demand": round(demand_value, 2),
        "demand_label": demand_label,
        "unit": "tonnes"
    }

def _categorize_demand(value: float) -> str:
    if value < 500:
        return "Low"
    elif value < 5000:
        return "Moderate"
    elif value < 50000:
        return "High"
    else:
        return "Very High"
