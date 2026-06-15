import React, { useState, useEffect } from "react";
import { NavLink, Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ user, onLogout }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const handleLogout = () => {
    onLogout();
    setMenuOpen(false);
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__logo-icon">🌾</span>
          <span className="navbar__logo-text">AgriStock <em>AI</em></span>
        </Link>

        <button
          className={`navbar__burger ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>

        <ul className={`navbar__links ${menuOpen ? "navbar__links--open" : ""}`}>
          <li>
            <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""} onClick={() => setMenuOpen(false)}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/predict" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setMenuOpen(false)}>
              Predict
            </NavLink>
          </li>
          <li>
            <NavLink to="/about" className={({ isActive }) => isActive ? "active" : ""} onClick={() => setMenuOpen(false)}>
              About
            </NavLink>
          </li>
          <li className="navbar__user-section">
            {user && <span className="navbar__user-email">{user.email}</span>}
            <button className="navbar__logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
          <li>
            <Link to="/predict" className="navbar__cta" onClick={() => setMenuOpen(false)}>
              Get Forecast
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}