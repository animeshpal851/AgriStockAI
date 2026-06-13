import pandas as pd

df = pd.read_csv(
    "dataset/processed/final_dataset.csv"
)

print(df.columns.tolist())