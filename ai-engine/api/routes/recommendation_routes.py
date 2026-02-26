from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List
from models.recommendation_model import recommendation_engine

router = APIRouter()

class UserData(BaseModel):
    userId: str
    medication_adherence: Optional[float] = 100
    avg_steps: Optional[int] = 0
    avg_sleep: Optional[float] = 8
    water_intake: Optional[int] = 2500
    medications: Optional[List[dict]] = []
    fitness: Optional[List[dict]] = []

@router.post('/recommendations')
async def get_recommendations(data: UserData):
    recommendations = recommendation_engine.generate_recommendations(data.dict())
    return {'recommendations': recommendations, 'count': len(recommendations)}
