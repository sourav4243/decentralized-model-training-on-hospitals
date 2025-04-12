import pandas as pd
import numpy as np
import os
import pickle
import time
import matplotlib.pyplot as plt

import xgboost as xgb
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, roc_auc_score, roc_curve

import warnings
warnings.filterwarnings("ignore")

# Load data once at module level
data_path = os.path.join(os.path.dirname(__file__), "smoking.csv")
smoking = pd.read_csv(data_path)
smoking = smoking.drop(columns="oral")

num_hospitals = 10

# Function to randomly split data for hospitals
def create_random_hospital_splits():
    # Shuffle with a random seed based on current time
    random_seed = int(time.time()) % 10000
    shuffled_data = smoking.sample(frac=1, random_state=random_seed).reset_index(drop=True)

    # Split into hospital datasets
    split_indices = np.array_split(shuffled_data.index, num_hospitals)

    # Create hospital datasets dictionary
    hospital_datasets = {}
    for i in range(1, num_hospitals + 1):
        hospital_datasets[i] = shuffled_data.loc[split_indices[i-1]].copy()

    return hospital_datasets

# Initialize hospital data
hospital_data = {}

# Store models
local_models = {}
global_model = None

# Directory for saving models
model_dir = os.path.join(os.path.dirname(__file__), "models")
os.makedirs(model_dir, exist_ok=True)
def preprocess_data(data):
    """Preprocess the hospital data for training"""
    data = data.copy()
    data["gender"] = data["gender"].map({"M": 1, "F": 0})
    data["tartar"] = data["tartar"].map({"Y": 1, "N": 0})

    # Standardization
    x = data[data.columns[1:-1]]
    y = data["smoking"]

    return x, y

def train_model_for_hospital(hospital_id):
    """Train a model for a specific hospital and return the accuracy"""
    global local_models, hospital_data

    if hospital_id < 1 or hospital_id > num_hospitals:
        raise ValueError(f"Hospital ID must be between 1 and {num_hospitals}")

    # If this is the first hospital being trained, create random splits for all hospitals
    if not hospital_data:
        hospital_data = create_random_hospital_splits()
        print(f"Created new random data splits for {num_hospitals} hospitals")

    # Get the hospital data
    data = hospital_data[hospital_id]

    # Preprocess data
    x, y = preprocess_data(data)

    # Split data
    train_x, test_x, train_y, test_y = train_test_split(x, y, test_size=0.3, random_state=2200)

    # Train model
    xgb_cls = xgb.XGBClassifier()
    xgb_cls.fit(train_x, train_y)

    # Evaluate model
    predictions = xgb_cls.predict(test_x)
    accuracy = accuracy_score(test_y, predictions)

    # Store model
    local_models[hospital_id] = xgb_cls

    # Save model to disk
    model_path = os.path.join(model_dir, f"hospital_{hospital_id}_model.pkl")
    with open(model_path, 'wb') as f:
        pickle.dump(xgb_cls, f)

    return float(accuracy)

def parse_tree_dump(tree_dump):
    """Convert tree dump into numerical representation"""
    numeric_values = []
    for line in tree_dump:
        parts = line.split(":")
        if len(parts) > 1:
            try:
                numeric_values.append(float(parts[-1]))  # Extract last numeric value
            except ValueError:
                continue
    return numeric_values

def aggregate_models():
    """Aggregate all local models into a global model and return the average accuracy"""
    global local_models, global_model, hospital_data

    if len(local_models) == 0:
        raise ValueError("No local models available for aggregation")

    # Ensure we have hospital data
    if not hospital_data:
        hospital_data = create_random_hospital_splits()

    # Step 1: Aggregate boosters from all local models
    boosters = [model.get_booster() for model in local_models.values()]

    # Step 2: Extract raw model dumps
    raw_boosters = [booster.get_dump(with_stats=True) for booster in boosters]

    # Step 3: Ensure all models have the same number of trees
    num_trees = [len(rb) for rb in raw_boosters]
    if len(set(num_trees)) != 1:
        raise ValueError("All models must have the same number of trees for averaging.")

    # Step 4: Convert each tree dump into a numerical representation
    all_numeric_values = [list(map(parse_tree_dump, booster)) for booster in raw_boosters]

    # Step 5: Compute the average values across all models
    avg_values = np.mean(all_numeric_values, axis=0)

    # Step 6: Use the first booster as the base
    global_booster = boosters[0]

    # Step 7: Create a new global XGBoost model
    global_model = xgb.XGBClassifier()
    global_model._Booster = global_booster  # Assign the booster

    # Save global model
    global_model_path = os.path.join(model_dir, "global_model.pkl")
    with open(global_model_path, 'wb') as f:
        pickle.dump(global_model, f)

    # Evaluate global model on all hospital data
    accuracies = []

    for hospital_id in range(1, num_hospitals + 1):
        data = hospital_data[hospital_id]
        x, y = preprocess_data(data)

        # Split data
        _, test_x, _, test_y = train_test_split(x, y, test_size=0.2, random_state=2200)

        # Evaluate
        predictions = global_model.predict(test_x)
        accuracy = accuracy_score(test_y, predictions)
        accuracies.append(accuracy)

    # Return average accuracy across all hospitals
    return float(np.mean(accuracies))

def train_with_global_model(hospital_id):
    """Train a hospital with the global model and return the new accuracy"""
    global global_model, hospital_data

    if global_model is None:
        raise ValueError("Global model not available. Aggregate models first.")

    if hospital_id < 1 or hospital_id > num_hospitals:
        raise ValueError(f"Hospital ID must be between 1 and {num_hospitals}")

    # Ensure we have hospital data
    if not hospital_data:
        hospital_data = create_random_hospital_splits()

    # Get the hospital data
    data = hospital_data[hospital_id]

    # Preprocess data
    x, y = preprocess_data(data)

    # Split data
    train_x, test_x, train_y, test_y = train_test_split(x, y, test_size=0.3, random_state=2200)

    # Fine-tune the global model with a lower learning rate
    model_copy = pickle.loads(pickle.dumps(global_model))  # Deep copy
    model_copy.set_params(learning_rate=0.01)  # Reduce from default (0.3) to a lower value
    model_copy.fit(train_x, train_y, xgb_model=model_copy.get_booster(), verbose=False)

    # Evaluate
    predictions = model_copy.predict(test_x)
    accuracy = accuracy_score(test_y, predictions)

    return float(accuracy)

# Initialize models if this script is run directly
if __name__ == "__main__":
    # Train all hospital models
    for i in range(1, num_hospitals + 1):
        accuracy = train_model_for_hospital(i)
        print(f"Hospital {i} Model Accuracy: {accuracy:.4f}")

    # Aggregate models
    global_accuracy = aggregate_models()
    print(f"Global Model Accuracy: {global_accuracy:.4f}")

    # Train with global model
    for i in range(1, num_hospitals + 1):
        new_accuracy = train_with_global_model(i)
        print(f"Hospital {i} with Global Model Accuracy: {new_accuracy:.4f}")