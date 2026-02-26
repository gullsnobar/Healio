from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional
from models.detection_model import missed_dose_detector
import google.generativeai as genai
from config.settings import settings

router = APIRouter()

class LabResult(BaseModel):
    testName: str
    value: float
    unit: Optional[str] = ''
    normalRange: Optional[dict] = None

class LabReportRequest(BaseModel):
    results: List[LabResult]
    testType: str

class AdherenceEntry(BaseModel):
    status: str
    time: Optional[str] = ''
    date: Optional[str] = ''

class MissedDoseRequest(BaseModel):
    userId: str
    adherenceData: List[AdherenceEntry]

@router.post('/analyze-lab-report')
async def analyze_lab_report(request: LabReportRequest):
    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel('gemini-pro')
    prompt = f'Analyze lab results for {request.testType}: {[r.dict() for r in request.results]}. Return JSON: {{summary, recommendations: [], riskFactors: []}}'
    try:
        response = model.generate_content(prompt)
        import json
        text = response.text.replace('`json', '').replace('`', '').strip()
        return json.loads(text)
    except:
        return {'summary': 'Analysis completed', 'recommendations': ['Consult your doctor for detailed interpretation'], 'riskFactors': []}

@router.post('/detect-missed-dose')
async def detect_missed_dose(request: MissedDoseRequest):
    result = missed_dose_detector.detect_patterns([e.dict() for e in request.adherenceData])
    return result
