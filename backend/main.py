from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
from ml_service import predict_yield
from google import genai

app = FastAPI(title="Crop Yield API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictRequest(BaseModel):
    Area: str
    Crop: str
    Year: int
    Rainfall: float
    Temperature: float
    Pesticide_usage: float

class PredictResponse(BaseModel):
    prediction: float
    top_features: list
    ai_explanation: str

# Use an environment variable or a fallback for the API key
# The user doesn't have an environment set up, so we will initialize the client carefully.
api_key = os.getenv("GEMINI_API_KEY", "")

@app.post("/api/predict", response_model=PredictResponse)
def predict(request: PredictRequest):
    try:
        req_data = request.dict()
        req_data["Pesticide usage"] = request.Pesticide_usage
        
        # Get ML prediction
        result = predict_yield(req_data)
        
        # Prepare Prompt for GenAI
        prompt = f"""You are a friendly agricultural advisor.
Explain the result in a very simple, human way.

Inputs:
* Area: {request.Area}
* Crop: {request.Crop}
* Rainfall: {request.Rainfall}
* Temperature: {request.Temperature}
* Pesticide Usage: {request.Pesticide_usage}
* Predicted Yield: {result['prediction']:.2f}

Explain like you are talking to a beginner farmer.
Structure your answer exactly as:

1. 🌾 Overall Result:
* Is the yield good, average, or low?

2. 🌦️ Rainfall Insight:
* Explain how rainfall affected yield

3. 🌡️ Temperature Insight:
* Explain impact simply

4. 🧪 Pesticide Insight:
* Explain effect on crop

5. 💡 Suggestions:
* What can be improved?
* What is already good?

6. 🧠 Final Advice:
* 1-2 simple lines

Use very simple English. Avoid technical words. Make it feel friendly and helpful."""
        
        ai_explanation = "AI Explanation unavailable. Please set GEMINI_API_KEY environment variable."
        if api_key:
            try:
                client = genai.Client(api_key=api_key)
                response = client.models.generate_content(
                    model='gemini-2.5-flash',
                    contents=prompt,
                )
                ai_explanation = response.text
            except Exception as e:
                ai_explanation = f"AI Error: {str(e)}"

        return PredictResponse(
            prediction=result["prediction"],
            top_features=result["top_features"],
            ai_explanation=ai_explanation
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
