import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";
import Toast from "./Toast";
import "./PredictionForm.css";

const API_BASE = "https://agristock-backend.onrender.com/";

function AutocompleteInput({ label, id, value, onChange, suggestions, disabled, placeholder, onSelect }) {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
  );

  return (
    <div className="pf__field" ref={ref}>
      <label htmlFor={id} className="pf__label">{label}</label>
      <div className="pf__autocomplete-wrap">
        <input
  id={id}
  className="pf__input"
  value={value}
  onChange={(e) => {
    onChange(e.target.value);
    setOpen(true);
  }}
  onFocus={() => setOpen(true)}
  disabled={disabled}
  placeholder={placeholder}
  autoComplete="off"
/>
        {open && filtered.length > 0 && (
          <ul className="pf__suggestions">
            {filtered.slice(0, 8).map((s) => (
              <li key={s} onMouseDown={() => { onSelect(s); setOpen(false); }}>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default function PredictionForm() {
  const [dataset, setDataset] = useState([]);
  const [form, setForm] = useState({
    state: "",
    district: "",
    crop: "",
    season: "",
    area: "",
    population: "",
    production: "",
    monthly_rainfall: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState(null);
  const [unknownCrop, setUnknownCrop] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showAreaSuggestions, setShowAreaSuggestions] = useState(false);

  useEffect(() => {
    fetch("/final_dataset.json")
      .then((r) => r.json())
      .then((data) => { setDataset(data); setDataLoaded(true); })
      .catch(() => setToast({ type: "error", message: "Failed to load dataset." }));
  }, []);

  const states = [...new Set(dataset.map((r) => r.state))].filter(Boolean).sort();

  const districts = form.state
    ? [...new Set(dataset.filter((r) => r.state === form.state).map((r) => r.district))].filter(Boolean).sort()
    : [];

  const crops = [...new Set(dataset.map((r) => r.crop))].filter(Boolean).sort();

  const seasons = [...new Set(dataset.map((r) => r.season))].filter(Boolean).sort();

  const areaValues = form.area.length >= 2
    ? [...new Set(dataset.map((r) => String(r.area)).filter((v) => v.startsWith(form.area) && v !== form.area))].slice(0, 6)
    : [];

  useEffect(() => {
    if (!form.crop || crops.length === 0) { setUnknownCrop(false); return; }
    setUnknownCrop(!crops.includes(form.crop));
  }, [form.crop, crops]);

  // Auto-fill rainfall
  useEffect(() => {
    if (form.state && form.district && form.crop && form.season) {
      const match = dataset.find(
        (r) =>
          r.state === form.state &&
          r.district === form.district &&
          r.crop === form.crop &&
          r.season === form.season
      );
      if (match && match.monthly_rainfall !== undefined) {
        setForm((prev) => ({ ...prev, monthly_rainfall: String(match.monthly_rainfall) }));
      }
    }
  }, [form.state, form.district, form.crop, form.season, dataset]);

  const set = (field) => (val) => {
    setForm((prev) => {
      const next = { ...prev, [field]: val };
      if (field === "state") next.district = "";
      return next;
    });
  };

  const handleChange = (field) => (e) => set(field)(e.target.value);

  const canPredict =
    !unknownCrop &&
    form.state && form.district && form.crop && form.season &&
    form.area && form.population && form.production && form.monthly_rainfall;

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!canPredict) return;
    setLoading(true);
    setResult(null);
    const payload = {
      state: form.state,
      district: form.district,
      crop: form.crop,
      season: form.season,
      area: parseFloat(form.area),
      population: parseFloat(form.population),
      production: parseFloat(form.production),
      monthly_rainfall: parseFloat(form.monthly_rainfall),
    };
    
    // Validate that all numeric fields are non-negative
    const numericFields = ["area", "population", "production", "monthly_rainfall"];
    const negativeField = numericFields.find((field) => payload[field] < 0);
    if (negativeField) {
      showToast("error", `${negativeField.charAt(0).toUpperCase() + negativeField.slice(1)} must be a positive number`);
      setLoading(false);
      return;
    }
    
    try {
      const [demandRes, riskRes] = await Promise.all([
        axios.post(`${API_BASE}/api/predict-demand`, payload),
        axios.post(`${API_BASE}/api/predict-risk`, payload),
      ]);
      setResult({ demand: demandRes.data, risk: riskRes.data, input: payload });
      showToast("success", "Prediction complete!");
    } catch (err) {
      const msg = err?.response?.data?.error || "Prediction failed. Check server.";
      showToast("error", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pf">
      {toast && <Toast type={toast.type} message={toast.message} onClose={() => setToast(null)} />}

      <form className="pf__form" onSubmit={handleSubmit} noValidate>
        <div className="pf__grid">
          <AutocompleteInput
            label="State"
            id="state"
            value={form.state}
            onChange={set("state")}
            onSelect={set("state")}
            suggestions={states}
            placeholder="e.g. Maharashtra"
          />

          <AutocompleteInput
            label="District"
            id="district"
            value={form.district}
            onChange={set("district")}
            onSelect={set("district")}
            suggestions={districts}
            disabled={!form.state}
            placeholder={form.state ? "Select district" : "Select state first"}
          />

          <AutocompleteInput
            label="Crop"
            id="crop"
            value={form.crop}
            onChange={set("crop")}
            onSelect={set("crop")}
            suggestions={crops}
            placeholder="e.g. Rice"
          />

          <AutocompleteInput
            label="Season"
            id="season"
            value={form.season}
            onChange={set("season")}
            onSelect={set("season")}
            suggestions={seasons}
            placeholder="e.g. Kharif"
          />

          {unknownCrop && (
            <div className="pf__unknown-crop">
              <span className="pf__unknown-icon">⚠️</span>
              <p>This crop is currently unavailable. We will add this crop in the next update.</p>
            </div>
          )}

          <div className="pf__field">
  <label htmlFor="area" className="pf__label">
    Area (hectares)
  </label>

  <div className="pf__autocomplete-wrap">
    <input
      id="area"
      className="pf__input"
      type="number"
      value={form.area}
      placeholder="e.g. 2500"
      min="0"
      onChange={(e) => {
        setForm((prev) => ({
          ...prev,
          area: e.target.value,
        }));
        setShowAreaSuggestions(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          setShowAreaSuggestions(false);
          e.target.blur();
        }
      }}
      onFocus={() => {
        if (form.area.length >= 2) {
          setShowAreaSuggestions(true);
        }
      }}
    />

    {showAreaSuggestions &&
      areaValues.length > 0 &&
      form.area !== "" && (
        <ul className="pf__suggestions">
          {areaValues.map((v) => (
            <li
              key={v}
              onMouseDown={() => {
                setForm((prev) => ({
                  ...prev,
                  area: v,
                }));
                setShowAreaSuggestions(false);
              }}
            >
              {v}
            </li>
          ))}
        </ul>
      )}
  </div>
</div>

          <div className="pf__field">
            <label htmlFor="population" className="pf__label">Population</label>
            <input
              id="population"
              className="pf__input"
              type="number"
              value={form.population}
              onChange={handleChange("population")}
              placeholder="e.g. 500000"
              min="0"
            />
          </div>

          <div className="pf__field">
            <label htmlFor="production" className="pf__label">Production (tonnes)</label>
            <input
              id="production"
              className="pf__input"
              type="number"
              value={form.production}
              onChange={handleChange("production")}
              placeholder="e.g. 8000"
              min="0"
            />
          </div>

          <div className="pf__field">
            <label htmlFor="rainfall" className="pf__label">
              Monthly Rainfall (mm)
              <span className="pf__auto-badge">Auto-filled</span>
            </label>
            <input
              id="rainfall"
              className="pf__input pf__input--autofill"
              type="number"
              value={form.monthly_rainfall}
              onChange={handleChange("monthly_rainfall")}
              placeholder="Auto-filled from dataset"
            />
          </div>
        </div>

        <button
          type="submit"
          className="pf__submit"
          disabled={!canPredict || loading}
        >
          {loading ? (
            <span className="pf__spinner" />
          ) : (
            <>
              <span>Predict Now</span>
              <span className="pf__submit-arrow">→</span>
            </>
          )}
        </button>
      </form>

      {result && <ResultCard result={result} />}
    </div>
  );
}