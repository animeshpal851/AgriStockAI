import os
import joblib
import pandas as pd
import numpy as np
from utils.preprocess import preprocess_input, get_all_features

MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/risk_classification_model.pkl")
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

def predict_risk(data: dict) -> dict:
    production = float(data.get("production", 0))

    # Use same demand formula as training
    predicted_demand = (
        production * 0.50
        + float(data.get("population", 0)) * 0.002
        + float(data.get("monthly_rainfall", 0)) * 5
    )

    if predicted_demand == 0:
        ratio = 0
    else:
        ratio = production / predicted_demand

    if ratio >= 1.2:
        risk_label = "Low Risk"
    elif ratio >= 0.8:
        risk_label = "Moderate Risk"
    else:
        risk_label = "High Risk"

    return {
        "risk_level": risk_label,
        "ratio": round(ratio, 2)
    }