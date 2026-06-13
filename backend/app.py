from flask import Flask
from flask_cors import CORS
from routes.demand import demand_bp
from routes.risk import risk_bp

app = Flask(__name__)
CORS(app)

app.register_blueprint(demand_bp)
app.register_blueprint(risk_bp)

@app.route("/")
def home():
    return {
        "message": "AgriStock AI Backend Running"
    }

if __name__ == "__main__":
    app.run(debug=True, port=5000)