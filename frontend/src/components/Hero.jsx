import React from "react";
import { Link } from "react-router-dom";
import "./Hero.css";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero__bg-texture" aria-hidden="true">
        <div className="hero__grain" />
        <div className="hero__circle hero__circle--1" />
        <div className="hero__circle hero__circle--2" />
        <div className="hero__circle hero__circle--3" />
      </div>

      <div className="hero__content">
        <div className="hero__badge">
          <span className="hero__badge-dot" />
          AI-Powered Agricultural Intelligence
        </div>

        <h1 className="hero__title">
          Forecast Crop<br />
          <span className="hero__title-accent">Demand &amp; Risk</span><br />
          with Precision
        </h1>

        <p className="hero__subtitle">
          AgriStock AI analyses area, production, rainfall and population data
          to deliver accurate demand predictions and risk classifications — empowering
          farmers, traders and policymakers across India.
        </p>

        <div className="hero__actions">
          <Link to="/predict" className="hero__btn hero__btn--primary">
            Start Forecasting
            <span className="hero__btn-arrow">→</span>
          </Link>
          <Link to="/about" className="hero__btn hero__btn--secondary">
            Learn How It Works
          </Link>
        </div>

        <div className="hero__stats">
          <div className="hero__stat">
            <strong>Multiple States</strong>
            <span>Covered across India</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>2 AI Models</strong>
            <span>Demand &amp; Risk</span>
          </div>
          <div className="hero__stat-divider" />
          <div className="hero__stat">
            <strong>Real Dataset</strong>
            <span>Crop production data</span>
          </div>
        </div>
      </div>

      <div className="hero__illustration" aria-hidden="true">
        <div className="hero__card hero__card--1">
          <div className="hero__card-label">Predicted Demand</div>
          <div className="hero__card-value">12,480 <span>tonnes</span></div>
          <div className="hero__card-badge hero__card-badge--high">High</div>
        </div>
        <div className="hero__card hero__card--2">
          <div className="hero__card-label">Risk Level</div>
          <div className="hero__card-value hero__card-value--risk">Medium</div>
          <div className="hero__card-progress">
            <div className="hero__card-bar" style={{ width: "55%" }} />
          </div>
        </div>
        <div className="hero__icon-cluster">
          <span>🌾</span>
          <span>🌧️</span>
          <span>📊</span>
          <span>🗺️</span>
        </div>
      </div>
    </section>
  );
}