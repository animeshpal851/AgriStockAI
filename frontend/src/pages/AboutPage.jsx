import React from "react";
import "./AboutPage.css";

const STEPS = [
  {
    num: "01",
    title: "Data Collection",
    desc: "Raw data is sourced from crop production records, district-level rainfall measurements, and population census data across Indian states.",
  },
  {
    num: "02",
    title: "Data Processing",
    desc: "Datasets are merged on state, district and season keys. Missing values are handled, categorical columns encoded, and a unified final_dataset.csv is produced.",
  },
  {
    num: "03",
    title: "Model Training",
    desc: "Two separate Scikit-Learn models are trained — a regression model for demand prediction and a classification model for risk level assignment.",
  },
  {
    num: "04",
    title: "API Deployment",
    desc: "Models are serialised with Joblib and served via a Flask REST API with two endpoints: /api/predict-demand and /api/predict-risk.",
  },
  {
    num: "05",
    title: "Frontend Interface",
    desc: "A React + Vite frontend consumes the API, provides intelligent autocomplete, auto-fills rainfall, and renders results with probability breakdowns.",
  },
];

const COLUMNS = [
  { name: "state", desc: "Indian state name" },
  { name: "district", desc: "District within state" },
  { name: "crop", desc: "Crop variety name" },
  { name: "season", desc: "Growing season (Kharif, Rabi, etc.)" },
  { name: "area", desc: "Cultivated area in hectares" },
  { name: "production", desc: "Crop output in tonnes" },
  { name: "population", desc: "District population count" },
  { name: "monthly_rainfall", desc: "Average monthly rainfall in mm" },
  { name: "demand", desc: "Target: predicted demand (tonnes)" },
  { name: "risk_level", desc: "Target: Low / Medium / High" },
];

export default function AboutPage() {
  return (
    <div className="ap">
      <div className="ap__hero">
        <div className="ap__hero-inner">
          <span className="ap__tag">About the Project</span>
          <h1 className="ap__title">How AgriStock AI Works</h1>
          <p className="ap__desc">
            AgriStock AI combines real-world agricultural datasets with machine learning to deliver
            reliable crop demand forecasts and risk assessments across India.
          </p>
        </div>
      </div>

      <div className="ap__body">
        <section className="ap__section">
          <h2 className="ap__section-title">Pipeline Overview</h2>
          <div className="ap__steps">
            {STEPS.map((s) => (
              <div className="ap__step" key={s.num}>
                <div className="ap__step-num">{s.num}</div>
                <div className="ap__step-content">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="ap__section">
          <h2 className="ap__section-title">Dataset Columns</h2>
          <div className="ap__table-wrap">
            <table className="ap__table">
              <thead>
                <tr>
                  <th>Column</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {COLUMNS.map((c) => (
                  <tr key={c.name}>
                    <td><code>{c.name}</code></td>
                    <td>{c.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="ap__section">
          <h2 className="ap__section-title">API Endpoints</h2>
          <div className="ap__endpoints">
            <div className="ap__endpoint">
              <div className="ap__endpoint-method">POST</div>
              <div className="ap__endpoint-body">
                <code>/api/predict-demand</code>
                <p>Accepts JSON with state, district, crop, season, area, population, production, monthly_rainfall. Returns predicted_demand in tonnes and demand_label.</p>
              </div>
            </div>
            <div className="ap__endpoint">
              <div className="ap__endpoint-method">POST</div>
              <div className="ap__endpoint-body">
                <code>/api/predict-risk</code>
                <p>Same input schema. Returns risk_level (Low / Medium / High) and per-class probability breakdown.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="ap__section">
          <h2 className="ap__section-title">Technology Stack</h2>
          <div className="ap__stack">
            {[
              ["Frontend", "React 18, Vite, React Router DOM, Axios"],
              ["Backend", "Python, Flask, Flask-CORS"],
              ["ML", "Scikit-Learn, Pandas, NumPy, Joblib"],
              ["Data", "crop_production.csv, rainfall.csv, population.csv"],
            ].map(([layer, tech]) => (
              <div className="ap__stack-row" key={layer}>
                <span className="ap__stack-layer">{layer}</span>
                <span className="ap__stack-tech">{tech}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}