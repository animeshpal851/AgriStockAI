import React from "react";
import "./ResultCard.css";

const RISK_COLORS = {
  Low: { bg: "rgba(76,175,80,0.1)", border: "rgba(76,175,80,0.3)", text: "#2e7d32", icon: "🟢" },
  Medium: { bg: "rgba(255,152,0,0.1)", border: "rgba(255,152,0,0.3)", text: "#e65100", icon: "🟡" },
  High: { bg: "rgba(244,67,54,0.1)", border: "rgba(244,67,54,0.3)", text: "#c62828", icon: "🔴" },
};

const DEMAND_COLORS = {
  Low: { color: "#5A7A3A", bg: "rgba(90,122,58,0.1)" },
  Moderate: { color: "#C8832A", bg: "rgba(200,131,42,0.1)" },
  High: { color: "#2C6E9E", bg: "rgba(44,110,158,0.1)" },
  "Very High": { color: "#7B2D8B", bg: "rgba(123,45,139,0.1)" },
};

export default function ResultCard({ result }) {
  const { demand, risk, input } = result;
  const riskStyle = RISK_COLORS[risk.risk_level] || RISK_COLORS["Medium"];
  const demandStyle = DEMAND_COLORS[demand.demand_label] || DEMAND_COLORS["Moderate"];

  const probEntries = risk.probabilities
    ? Object.entries(risk.probabilities).sort((a, b) => b[1] - a[1])
    : [];

  return (
    <div className="rc" role="region" aria-label="Prediction Results">
      <div className="rc__header">
        <h2 className="rc__title">Prediction Results</h2>
        <div className="rc__meta">
          {input.crop} · {input.season} · {input.district}, {input.state}
        </div>
      </div>

      <div className="rc__cards">
        {/* Demand Card */}
        <div className="rc__card rc__card--demand">
          <div className="rc__card-icon">📈</div>
          <div className="rc__card-body">
            <div className="rc__card-label">Predicted Demand</div>
            <div className="rc__card-value">
              {demand.predicted_demand.toLocaleString()}
              <span className="rc__card-unit"> {demand.unit}</span>
            </div>
            <div
              className="rc__tag"
              style={{ background: demandStyle.bg, color: demandStyle.color }}
            >
              {demand.demand_label} Demand
            </div>
          </div>
        </div>

        {/* Risk Card */}
        <div
          className="rc__card rc__card--risk"
          style={{ background: riskStyle.bg, borderColor: riskStyle.border }}
        >
          <div className="rc__card-icon">{riskStyle.icon}</div>
          <div className="rc__card-body">
            <div className="rc__card-label">Risk Classification</div>
            <div className="rc__card-value" style={{ color: riskStyle.text }}>
              {risk.risk_level}
            </div>
            <div
              className="rc__tag"
              style={{ background: riskStyle.bg, color: riskStyle.text, border: `1px solid ${riskStyle.border}` }}
            >
              {risk.risk_level} Risk Level
            </div>
          </div>
        </div>
      </div>

      {probEntries.length > 0 && (
        <div className="rc__probabilities">
          <h3 className="rc__prob-title">Risk Probability Breakdown</h3>
          <div className="rc__prob-bars">
            {probEntries.map(([label, prob]) => {
              const style = RISK_COLORS[label] || { bg: "rgba(100,100,100,0.1)", border: "#ccc", text: "#555" };
              return (
                <div key={label} className="rc__prob-row">
                  <span className="rc__prob-label" style={{ color: style.text }}>{label}</span>
                  <div className="rc__prob-track">
                    <div
                      className="rc__prob-fill"
                      style={{ width: `${(prob * 100).toFixed(1)}%`, background: style.text }}
                    />
                  </div>
                  <span className="rc__prob-pct">{(prob * 100).toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="rc__inputs">
        <h3 className="rc__inputs-title">Input Summary</h3>
        <div className="rc__inputs-grid">
          {[
            ["Area", `${Number(input.area).toLocaleString()} ha`],
            ["Production", `${Number(input.production).toLocaleString()} t`],
            ["Population", Number(input.population).toLocaleString()],
            ["Rainfall", `${input.monthly_rainfall} mm/mo`],
          ].map(([k, v]) => (
            <div key={k} className="rc__input-item">
              <span className="rc__input-key">{k}</span>
              <span className="rc__input-val">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}