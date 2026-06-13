import React from "react";
import Hero from "../components/Hero";
import { Link } from "react-router-dom";
import "./Home.css";

const FEATURES = [
  {
    icon: "📊",
    title: "Demand Forecasting",
    desc: "Predict crop demand in tonnes using historical production and population data, powered by a trained regression model.",
  },
  {
    icon: "⚠️",
    title: "Risk Classification",
    desc: "Classify agricultural risk as Low, Medium, or High using multi-feature analysis of rainfall, area, and crop patterns.",
  },
  {
    icon: "🌧️",
    title: "Rainfall Auto-Fill",
    desc: "Monthly rainfall data is automatically fetched from the dataset when you select your state, district, crop and season.",
  },
  {
    icon: "🗺️",
    title: "State & District Coverage",
    desc: "Comprehensive coverage of Indian states and districts with intelligent autocomplete to reduce input friction.",
  },
  {
    icon: "🌾",
    title: "Multi-Crop Support",
    desc: "Supports a wide variety of crops across Kharif, Rabi and other seasons. Unknown crops are flagged instantly.",
  },
  {
    icon: "⚡",
    title: "Instant Results",
    desc: "Both demand and risk predictions are returned simultaneously in under a second from our optimised Flask API.",
  },
];

export default function Home() {
  return (
    <div className="home">
      <Hero />

      <section className="home__features">
        <div className="home__features-inner">
          <div className="home__section-head">
            <span className="home__section-tag">What We Offer</span>
            <h2 className="home__section-title">Intelligent Tools for<br />Agricultural Decisions</h2>
          </div>
          <div className="home__feature-grid">
            {FEATURES.map((f) => (
              <div className="home__feature-card" key={f.title}>
                <div className="home__feature-icon">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="home__cta">
        <div className="home__cta-inner">
          <h2>Ready to forecast your crop?</h2>
          <p>Enter your region and crop details to get an AI-powered demand prediction and risk assessment instantly.</p>
          <Link to="/predict" className="home__cta-btn">
            Open Prediction Tool →
          </Link>
        </div>
      </section>
    </div>
  );
}