import pandas as pd

rain = pd.read_csv(
    "dataset/raw/rainfall.csv",
    sep=";"
)

print(rain.columns.tolist())

print("\nFirst 5 rows:\n")
print(rain.head())