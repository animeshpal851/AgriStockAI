import React from "react";
import PredictionForm from "../components/PredictionForm";
import "./PredictionPage.css";

export default function PredictionPage() {
  return (
    <div className="pp">
      <div className="pp__header">
        <div className="pp__header-inner">
          <span className="pp__tag">AI Prediction Engine</span>
          <h1 className="pp__title">Crop Demand &amp; Risk Forecast</h1>
          <p className="pp__subtitle">
            Fill in your agricultural details below. Rainfall is automatically fetched once
            state, district, crop and season are selected.
          </p>
        </div>
      </div>

      <div className="pp__body">
        <PredictionForm />
      </div>
    </div>
  );
}