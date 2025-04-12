# Federated Learning Backend

This is the backend for the Federated Learning Simulation project. It provides APIs for training local models, aggregating models, and training with the global model.

## Setup

1. Install the required dependencies:
   ```
   pip install -r requirements.txt
   ```

2. Make sure you have the `smoking.csv` dataset in the backend directory.

## Running the Backend

Run the Flask application:
```
python app.py
```

The server will start on http://localhost:5000.

## API Endpoints

- **POST /train/{hospital_id}**: Train a local model for a specific hospital
- **POST /aggregate**: Aggregate all local models into a global model
- **POST /train-with-global/{hospital_id}**: Train a hospital with the global model
- **POST /train-all-with-global**: Train all hospitals with the global model

## Model Storage

Trained models are saved in the `models` directory:
- Local models: `hospital_{id}_model.pkl`
- Global model: `global_model.pkl`
