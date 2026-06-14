from flask import Blueprint, request, jsonify
from services.demand_service import predict_demand

demand_bp = Blueprint("demand", __name__)

@demand_bp.route("/api/predict-demand", methods=["POST"])
def demand_route():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    required = ["state", "district", "crop", "season", "area", "population", "production", "monthly_rainfall"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    
    # Validate that numeric fields are non-negative
    numeric_fields = ["area", "population", "production", "monthly_rainfall"]
    for field in numeric_fields:
        try:
            value = float(data[field])
            if value < 0:
                return jsonify({"error": f"{field.capitalize()} must be a positive number"}), 400
        except (ValueError, TypeError):
            return jsonify({"error": f"{field.capitalize()} must be a valid number"}), 400
    
    try:
        result = predict_demand(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500