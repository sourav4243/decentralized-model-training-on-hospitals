from flask import Flask, jsonify, request
from flask_cors import CORS
import PBL_Final_Improved_accuracy as pbl
from PBL_Final_Improved_accuracy import train_model_for_hospital, aggregate_models, train_with_global_model

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Route for local training
@app.route('/train/<int:hospital_id>', methods=['POST'])
def train_local(hospital_id):
    try:
        accuracy = train_model_for_hospital(hospital_id)
        return jsonify({
            "hospital_id": hospital_id,
            "local_accuracy": accuracy,
            "success": True
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

# Route for central aggregation
@app.route('/aggregate', methods=['POST'])
def aggregate():
    try:
        global_accuracy = aggregate_models()
        return jsonify({
            "message": "Central model aggregated",
            "global_accuracy": global_accuracy,
            "success": True
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

# Route for training with global model
@app.route('/train-with-global/<int:hospital_id>', methods=['POST'])
def train_global(hospital_id):
    try:
        accuracy = train_with_global_model(hospital_id)
        return jsonify({
            "hospital_id": hospital_id,
            "global_accuracy": accuracy,
            "success": True
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

# Route to train all hospitals with global model
@app.route('/train-all-with-global', methods=['POST'])
def train_all_global():
    try:
        results = {}
        for hospital_id in range(1, 11):
            accuracy = train_with_global_model(hospital_id)
            results[hospital_id] = accuracy

        return jsonify({
            "message": "All hospitals trained with global model",
            "results": results,
            "success": True
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

# Route to reset hospital data splits
@app.route('/reset-data', methods=['POST'])
def reset_data():
    try:
        # Clear existing data and models
        pbl.hospital_data = {}
        pbl.local_models = {}
        pbl.global_model = None

        # Create new random splits
        pbl.hospital_data = pbl.create_random_hospital_splits()

        return jsonify({
            "message": "Hospital data has been randomly redistributed",
            "success": True
        })
    except Exception as e:
        return jsonify({
            "error": str(e),
            "success": False
        }), 500

if __name__ == '__main__':
    app.run(debug=True)
