import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import ResultCard from "./ResultCard";
import Toast from "./Toast";
import "./PredictionForm.css";

// Use localhost in development, production URL in production
const API_BASE = import.meta.env.DEV 
  ? "http://localhost:5000/" 
  : "https://agristock-backend.onrender.com/";

function AutocompleteInput({ 
  label, 
  id, 
  value, 
  onChange, 
  suggestions, 
  disabled, 
  placeholder, 
  onSelect,
  inputRef,
  nextFieldRef 
}) {
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef();

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(value.toLowerCase()) && s.toLowerCase() !== value.toLowerCase()
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Reset highlighted index when filtered suggestions change
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [filtered.length]);

  const handleSelectSuggestion = (suggestion) => {
    onSelect(suggestion);
    setOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    // If dropdown is closed and user presses arrow keys, open it
    if (!open) {
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && filtered.length > 0) {
        e.preventDefault();
        setOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    // Dropdown is open - handle all key presses
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev < filtered.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => 
        prev > 0 ? prev - 1 : filtered.length - 1
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelectSuggestion(filtered[highlightedIndex]);
        if (nextFieldRef?.current) {
          setTimeout(() => nextFieldRef.current.focus(), 0);
        }
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
        handleSelectSuggestion(filtered[highlightedIndex]);
      } else {
        setOpen(false);
        setHighlightedIndex(-1);
      }
      if (nextFieldRef?.current) {
        setTimeout(() => nextFieldRef.current.focus(), 0);
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="pf__field" ref={containerRef}>
      <label htmlFor={id} className="pf__label">{label}</label>
      <div className="pf__autocomplete-wrap">
        <input
          ref={inputRef}
          id={id}
          className="pf__input"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            setHighlightedIndex(-1);
          }}
          onFocus={() => {
            if (value && filtered.length > 0) {
              setOpen(true);
              setHighlightedIndex(-1);
            }
          }}
          onBlur={() => {
            setTimeout(() => {
              setOpen(false);
              setHighlightedIndex(-1);
            }, 150);
          }}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={placeholder}
          autoComplete="off"
        />
        {open && filtered.length > 0 && (
          <ul className="pf__suggestions">
            {filtered.slice(0, 8).map((s, idx) => (
              <li 
                key={s}
                className={idx === highlightedIndex ? "pf__suggestion-item pf__suggestion-item--highlighted" : "pf__suggestion-item"}
                onMouseDown={() => handleSelectSuggestion(s)}
                onMouseEnter={() => setHighlightedIndex(idx)}
              >
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
  const [areaHighlightedIndex, setAreaHighlightedIndex] = useState(-1);

  // Create refs for all form fields
  const stateInputRef = useRef();
  const districtInputRef = useRef();
  const cropInputRef = useRef();
  const seasonInputRef = useRef();
  const areaInputRef = useRef();
  const populationInputRef = useRef();
  const productionInputRef = useRef();
  const rainfallInputRef = useRef();

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

  const handleNumericChange = (field) => (e) => {
    let value = e.target.value;
    // Allow empty string
    if (value === "") {
      set(field)("");
      return;
    }
    // Parse and validate
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      // Only update if value is non-negative
      if (numValue >= 0) {
        set(field)(value);
      } else {
        // Silently ignore negative input
        e.target.value = form[field];
      }
    }
  };

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
    
    // Validate that district belongs to the selected state
    if (!districts.includes(form.district)) {
      showToast("error", "Selected district does not belong to the selected state");
      setLoading(false);
      return;
    }
    
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
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const [demandRes, riskRes] = await Promise.all([
        axios.post(`${API_BASE}/api/predict-demand`, payload, { headers }),
        axios.post(`${API_BASE}/api/predict-risk`, payload, { headers }),
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
            inputRef={stateInputRef}
            nextFieldRef={districtInputRef}
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
            inputRef={districtInputRef}
            nextFieldRef={cropInputRef}
          />

          <AutocompleteInput
            label="Crop"
            id="crop"
            value={form.crop}
            onChange={set("crop")}
            onSelect={set("crop")}
            suggestions={crops}
            placeholder="e.g. Rice"
            inputRef={cropInputRef}
            nextFieldRef={seasonInputRef}
          />

          <AutocompleteInput
            label="Season"
            id="season"
            value={form.season}
            onChange={set("season")}
            onSelect={set("season")}
            suggestions={seasons}
            placeholder="e.g. Kharif"
            inputRef={seasonInputRef}
            nextFieldRef={areaInputRef}
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
                ref={areaInputRef}
                id="area"
                className="pf__input"
                type="number"
                value={form.area}
                placeholder="e.g. 2500"
                min="0"
                step="any"
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "") {
                    setForm((prev) => ({ ...prev, area: "" }));
                  } else {
                    const numValue = parseFloat(value);
                    if (!isNaN(numValue) && numValue >= 0) {
                      setForm((prev) => ({ ...prev, area: value }));
                    }
                  }
                }}
                onFocus={() => {
                  setAreaHighlightedIndex(-1);
                  if (form.area && form.area.length >= 2) {
                    setShowAreaSuggestions(true);
                  }
                }}
                onBlur={() => {
                  setTimeout(() => {
                    setShowAreaSuggestions(false);
                    setAreaHighlightedIndex(-1);
                  }, 150);
                }}
                onKeyDown={(e) => {
                  switch (e.key) {
                    case "ArrowDown":
                      e.preventDefault();
                      if (!showAreaSuggestions && areaValues.length > 0) {
                        setShowAreaSuggestions(true);
                        setAreaHighlightedIndex(0);
                      } else if (showAreaSuggestions) {
                        setAreaHighlightedIndex((prev) =>
                          prev < areaValues.length - 1 ? prev + 1 : 0
                        );
                      }
                      break;

                    case "ArrowUp":
                      e.preventDefault();
                      if (!showAreaSuggestions && areaValues.length > 0) {
                        setShowAreaSuggestions(true);
                        setAreaHighlightedIndex(areaValues.length - 1);
                      } else if (showAreaSuggestions) {
                        setAreaHighlightedIndex((prev) =>
                          prev > 0 ? prev - 1 : areaValues.length - 1
                        );
                      }
                      break;

                    case "Enter":
                      e.preventDefault();
                      if (showAreaSuggestions && areaHighlightedIndex >= 0 && areaHighlightedIndex < areaValues.length) {
                        setForm((prev) => ({
                          ...prev,
                          area: areaValues[areaHighlightedIndex],
                        }));
                        setShowAreaSuggestions(false);
                        setAreaHighlightedIndex(-1);
                        setTimeout(() => populationInputRef.current?.focus(), 0);
                      }
                      break;

                    case "Tab":
                      e.preventDefault();
                      if (showAreaSuggestions && areaHighlightedIndex >= 0 && areaHighlightedIndex < areaValues.length) {
                        setForm((prev) => ({
                          ...prev,
                          area: areaValues[areaHighlightedIndex],
                        }));
                        setShowAreaSuggestions(false);
                        setAreaHighlightedIndex(-1);
                      }
                      populationInputRef.current?.focus();
                      break;

                    case "Escape":
                      e.preventDefault();
                      setShowAreaSuggestions(false);
                      setAreaHighlightedIndex(-1);
                      break;

                    default:
                      break;
                  }
                }}
              />

              {showAreaSuggestions && areaValues && areaValues.length > 0 && form.area && (
                <ul className="pf__suggestions">
                  {areaValues.map((v, idx) => (
                    <li
                      key={v}
                      className={idx === areaHighlightedIndex ? "pf__suggestion-item pf__suggestion-item--highlighted" : "pf__suggestion-item"}
                      onMouseDown={() => {
                        setForm((prev) => ({
                          ...prev,
                          area: v,
                        }));
                        setShowAreaSuggestions(false);
                        setAreaHighlightedIndex(-1);
                      }}
                      onMouseEnter={() => setAreaHighlightedIndex(idx)}
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
              ref={populationInputRef}
              id="population"
              className="pf__input"
              type="number"
              value={form.population}
              onChange={handleNumericChange("population")}
              placeholder="e.g. 500000"
              min="0"
              step="any"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  productionInputRef.current?.focus();
                }
              }}
            />
          </div>

          <div className="pf__field">
            <label htmlFor="production" className="pf__label">Production (tonnes)</label>
            <input
              ref={productionInputRef}
              id="production"
              className="pf__input"
              type="number"
              value={form.production}
              onChange={handleNumericChange("production")}
              placeholder="e.g. 8000"
              min="0"
              step="any"
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault();
                  rainfallInputRef.current?.focus();
                }
              }}
            />
          </div>

          <div className="pf__field">
            <label htmlFor="rainfall" className="pf__label">
              Monthly Rainfall (mm)
              <span className="pf__auto-badge">Auto-filled</span>
            </label>
            <input
              ref={rainfallInputRef}
              id="rainfall"
              className="pf__input pf__input--autofill"
              type="number"
              value={form.monthly_rainfall}
              onChange={handleNumericChange("monthly_rainfall")}
              placeholder="Auto-filled from dataset"
              min="0"
              step="any"
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