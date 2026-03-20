import pickle
import pandas as pd
import numpy as np
import shap
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "crop_model.pkl")
FEATURES_PATH = os.path.join(os.path.dirname(__file__), "..", "model_features.pkl")

# Load model and features
with open(MODEL_PATH, "rb") as f:
    model = pickle.load(f)

with open(FEATURES_PATH, "rb") as f:
    model_features = pickle.load(f)

# Initialize SHAP explainer
explainer = shap.TreeExplainer(model)

def predict_yield(input_data: dict) -> dict:
    # input_data contains: Area, Crop, Year, Rainfall, Temperature, Pesticide usage
    
    # Create base features
    base_data = {
        "Year": input_data["Year"],
        "rainfall": input_data["Rainfall"],
        "pesticide": input_data["Pesticide usage"],
        "temperature": input_data["Temperature"]
    }
    
    # Create one-hot combinations for Area and Crop
    area_col = f"Area_{input_data['Area']}"
    crop_col = f"Item_{input_data['Crop']}"
    
    base_data[area_col] = 1
    base_data[crop_col] = 1
    
    # Create DataFrame
    df = pd.DataFrame([base_data])
    
    # Align columns
    df = df.reindex(columns=model_features, fill_value=0)
    
    # Predict
    prediction = model.predict(df)[0]
    
    # SHAP Explanation
    shap_values = explainer.shap_values(df)
    
    # For a single prediction, shap_values is an array of shape (num_features,)
    # If it is a 2D array, we take the first row.
    if isinstance(shap_values, list): # For some models, it returns a list per class
        sv = shap_values[0]
        if hasattr(sv, "values"): # If shap Explaination object
            sv = sv.values
    else:
        sv = shap_values
    
    if len(sv.shape) == 2:
        sv = sv[0]
    
    # Get top 3 features by absolute SHAP value
    abs_sv = np.abs(sv)
    top_indices = np.argsort(abs_sv)[-3:][::-1]
    
    top_features = [
        {"feature": model_features[i], "importance": float(sv[i])}
        for i in top_indices
    ]
    
    return {
        "prediction": float(prediction),
        "top_features": top_features
    }
