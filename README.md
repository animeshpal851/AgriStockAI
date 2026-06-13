# 🌾 AgriStock AI

AI-powered crop demand forecasting and risk classification for Indian agriculture.

## Project Structure

```
AgriStock-AI/
├── backend/
│   ├── app.py
│   ├── requirements.txt
│   ├── routes/
│   │   ├── demand.py
│   │   └── risk.py
│   ├── services/
│   │   ├── demand_service.py
│   │   └── risk_service.py
│   └── utils/
│       └── preprocess.py
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx / App.css
│       ├── main.jsx / index.css
│       ├── components/
│       │   ├── Navbar, Hero, PredictionForm
│       │   ├── ResultCard, Footer, Toast
│       └── pages/
│           ├── Home, PredictionPage, AboutPage
├── dataset/
│   ├── raw/
│   │   ├── crop_production.csv
│   │   ├── rainfall.csv
│   │   └── population.csv
│   └── processed/
│       └── final_dataset.csv
├── models/
│   ├── demand_prediction_model.pkl
│   └── risk_classification_model.pkl
└── public/
    └── final_dataset.json
```

## Prerequisites

- Python 3.9+
- Node.js 18+
- Trained model files in `models/`
- Processed dataset at `dataset/processed/final_dataset.csv`
- Frontend dataset at `frontend/public/final_dataset.json`

## Setup

### Backend

```bash
cd backend
pip install -r requirements.txt
python app.py
```

Server runs on http://localhost:5000

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on http://localhost:3000

## Dataset Columns

| Column | Description |
|---|---|
| state | Indian state |
| district | District within state |
| crop | Crop name |
| season | Growing season |
| area | Area in hectares |
| production | Output in tonnes |
| population | District population |
| monthly_rainfall | Avg monthly rainfall mm |
| demand | Target: demand tonnes |
| risk_level | Target: Low/Medium/High |

## API Endpoints

- `POST /api/predict-demand` → `{ predicted_demand, demand_label, unit }`
- `POST /api/predict-risk` → `{ risk_level, probabilities }`

Both endpoints accept:
```json
{
  "state": "Maharashtra",
  "district": "Pune",
  "crop": "Rice",
  "season": "Kharif",
  "area": 2500,
  "production": 8000,
  "population": 500000,
  "monthly_rainfall": 145.3
}
```

## Model Format

Models should be saved with joblib as either:
- A plain model object
- A dict: `{ "model": <estimator>, "encoders": { "state": LabelEncoder, ... } }`