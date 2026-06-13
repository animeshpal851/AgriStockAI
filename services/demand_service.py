# # import os
# # import joblib
# # import pandas as pd
# # import numpy as np
# # from utils.preprocess import preprocess_input, get_all_features

# # MODEL_PATH = os.path.join(os.path.dirname(__file__), "../../models/demand_prediction_model.pkl")

# # _model_cache = None
# # _encoder_cache = None

# # def _load_model():
# #     global _model_cache, _encoder_cache
# #     if _model_cache is None:
# #         bundle = joblib.load(MODEL_PATH)
# #         if isinstance(bundle, dict):
# #             _model_cache = bundle.get("model")
# #             _encoder_cache = bundle.get("encoders", None)
# #         else:
# #             _model_cache = bundle
# #             _encoder_cache = None
# #     return _model_cache, _encoder_cache

# # def predict_demand(data: dict) -> dict:
# #     model, encoder = _load_model()
# #     df = preprocess_input(data, encoder)
# #     features = get_all_features(df)
# #     prediction = model.predict(features)
# #     demand_value = float(prediction[0])
# #     if demand_value < 0:
# #         demand_value = 0.0
# #     demand_label = _categorize_demand(demand_value)
# #     return {
# #         "predicted_demand": round(demand_value, 2),
# #         "demand_label": demand_label,
# #         "unit": "tonnes"
# #     }

# # def _categorize_demand(value: float) -> str:
# #     if value < 500:
# #         return "Low"
# #     elif value < 5000:
# #         return "Moderate"
# #     elif value < 50000:
# #         return "High"
# #     else:
# #         return "Very High"

# from joblib import load

# model = load("models/demand_prediction_model.pkl")

# def predict_demand(features):
#     prediction = model.predict(features)

#     return {
#         "predicted_demand": float(prediction[0]),
#         "unit": "Tonnes",
#         "demand_label": (
#             "Very High"
#             if prediction[0] > 50000 else
#             "High"
#             if prediction[0] > 15000 else
#             "Moderate"
#             if prediction[0] > 5000 else
#             "Low"
#         )
#     }