# import pandas as pd
# import numpy as np

# FEATURE_COLUMNS = ["area", "production", "population", "monthly_rainfall"]

# CATEGORICAL_COLUMNS = ["state", "district", "crop", "season"]

# def preprocess_input(data: dict, encoder=None) -> pd.DataFrame:
#     row = {
#         "state": str(data.get("state", "")).strip(),
#         "district": str(data.get("district", "")).strip(),
#         "crop": str(data.get("crop", "")).strip(),
#         "season": str(data.get("season", "")).strip(),
#         "area": float(data.get("area", 0)),
#         "production": float(data.get("production", 0)),
#         "population": float(data.get("population", 0)),
#         "monthly_rainfall": float(data.get("monthly_rainfall", 0)),
#     }
#     df = pd.DataFrame([row])
#     if encoder is not None:
#         for col in CATEGORICAL_COLUMNS:
#             if col in encoder:
#                 le = encoder[col]
#                 val = df[col].iloc[0]
#                 if val in le.classes_:
#                     df[col] = le.transform(df[col])
#                 else:
#                     df[col] = -1
#     return df

# def get_all_features(df: pd.DataFrame) -> pd.DataFrame:
#     cols = CATEGORICAL_COLUMNS + FEATURE_COLUMNS
#     return df[cols]