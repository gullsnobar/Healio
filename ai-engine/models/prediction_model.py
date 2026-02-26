import numpy as np
import logging

logger = logging.getLogger(__name__)

class HealthPredictionModel:
    def predict_health_risks(self, user_data: dict) -> dict:
        risks = []
        bmi = user_data.get('bmi')
        if bmi and bmi > 30:
            risks.append({'factor': 'Obesity Risk', 'level': 'high', 'recommendation': 'Consult a nutritionist and increase physical activity'})
        bp = user_data.get('blood_pressure', {})
        if bp.get('systolic', 0) > 140 or bp.get('diastolic', 0) > 90:
            risks.append({'factor': 'Hypertension', 'level': 'high', 'recommendation': 'Monitor BP regularly and consult your doctor'})
        sugar = user_data.get('blood_sugar', {})
        if sugar.get('fasting', 0) > 126:
            risks.append({'factor': 'Diabetes Risk', 'level': 'high', 'recommendation': 'Schedule blood glucose test and consult endocrinologist'})
        hr = user_data.get('heart_rate', {})
        if hr.get('resting', 0) > 100:
            risks.append({'factor': 'Elevated Heart Rate', 'level': 'medium', 'recommendation': 'Monitor and consult cardiologist if persistent'})
        return {'risks': risks, 'overallRisk': 'high' if any(r['level'] == 'high' for r in risks) else 'medium' if risks else 'low'}

    def predict_adherence_trend(self, history: list) -> dict:
        if len(history) < 7:
            return {'trend': 'insufficient_data', 'prediction': None}
        recent = history[-7:]
        taken = sum(1 for h in recent if h.get('status') == 'taken')
        rate = taken / len(recent)
        trend = 'improving' if rate > 0.8 else 'declining' if rate < 0.5 else 'stable'
        return {'trend': trend, 'currentRate': rate, 'prediction': 'likely_adherent' if rate > 0.7 else 'at_risk'}

prediction_model = HealthPredictionModel()
