from flask import Blueprint, request, jsonify
from services.risk_service import predict_risk

risk_bp = Blueprint("risk", __name__)

@risk_bp.route("/api/predict-risk", methods=["POST"])
def risk_route():
    data = request.get_json()
    if not data:
        return jsonify({"error": "No data provided"}), 400
    required = ["state", "district", "crop", "season", "area", "population", "production", "monthly_rainfall"]
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400
    try:
        result = predict_risk(data)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500