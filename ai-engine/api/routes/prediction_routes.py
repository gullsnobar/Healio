from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from models.prediction_model import prediction_model

router = APIRouter()

class HealthData(BaseModel):
    bmi: Optional[float] = None
    blood_pressure: Optional[dict] = None
    blood_sugar: Optional[dict] = None
    heart_rate: Optional[dict] = None

class AdherenceHistory(BaseModel):
    history: List[dict]

@router.post('/predict/health-risks')
async def predict_health_risks(data: HealthData):
    result = prediction_model.predict_health_risks(data.dict())
    return result

@router.post('/predict/adherence-trend')
async def predict_adherence(data: AdherenceHistory):
    result = prediction_model.predict_adherence_trend(data.history)
    return result
