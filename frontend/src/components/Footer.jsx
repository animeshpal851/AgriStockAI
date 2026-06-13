import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__logo">🌾 AgriStock <em>AI</em></span>
          <p>AI-powered crop demand forecasting and risk intelligence for India's agricultural sector.</p>
        </div>

        <div className="footer__links">
          <div className="footer__col">
            <h4>Navigate</h4>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/predict">Prediction</Link></li>
              <li><Link to="/about">About</Link></li>
            </ul>
          </div>
          <div className="footer__col">
            <h4>Models</h4>
            <ul>
              <li>Demand Prediction</li>
              <li>Risk Classification</li>
              <li>Rainfall Auto-fill</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="footer__bottom">
        <span>© {new Date().getFullYear()} AgriStock AI · Built with Scikit-Learn, Flask &amp; React</span>
      </div>
    </footer>
  );
}