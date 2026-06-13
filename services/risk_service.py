# import os
# import joblib
# import pandas as pd
# import numpy as np
# from utils.preprocess import preprocess_input, get_all_features

# MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/risk_classification_model.pkl")

# _model_cache = None
# _encoder_cache = None

# def _load_model():
#     global _model_cache, _encoder_cache
#     if _model_cache is None:
#         bundle = joblib.load(MODEL_PATH)
#         if isinstance(bundle, dict):
#             _model_cache = bundle.get("model")
#             _encoder_cache = bundle.get("encoders", None)
#         else:
#             _model_cache = bundle
#             _encoder_cache = None
#     return _model_cache, _encoder_cache

# def predict_risk(data: dict) -> dict:
#     model, encoder = _load_model()
#     df = preprocess_input(data, encoder)
#     features = get_all_features(df)
#     prediction = model.predict(features)
#     risk_label = str(prediction[0])
#     proba = None
#     if hasattr(model, "predict_proba"):
#         proba_arr = model.predict_proba(features)[0]
#         classes = list(model.classes_)
#         proba = {str(cls): round(float(p), 4) for cls, p in zip(classes, proba_arr)}
#     return {
#         "risk_level": risk_label,
#         "probabilities": proba
#     }


from joblib import load

model = load("models/risk_classification_model.pkl")

def predict_risk(features):

    prediction = model.predict(features)[0]

    probabilities = model.predict_proba(features)[0]

    classes = model.classes_

    prob_dict = {}

    for cls, prob in zip(classes, probabilities):
        prob_dict[str(cls)] = float(prob)

    return {
        "risk_level": str(prediction),
        "probabilities": prob_dict
    }