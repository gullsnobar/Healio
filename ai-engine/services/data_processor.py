import numpy as np
from datetime import datetime, timedelta

def process_fitness_data(raw_data: list) -> dict:
    if not raw_data:
        return {'avg_steps': 0, 'avg_sleep': 0, 'avg_calories': 0}
    steps = [d.get('steps', {}).get('count', 0) for d in raw_data]
    sleep = [d.get('sleep', {}).get('duration', 0) for d in raw_data]
    calories = [d.get('calories', {}).get('burned', 0) for d in raw_data]
    return {'avg_steps': int(np.mean(steps)) if steps else 0, 'avg_sleep': round(np.mean(sleep), 1) if sleep else 0, 'avg_calories': int(np.mean(calories)) if calories else 0, 'days_tracked': len(raw_data)}

def calculate_health_score(adherence: float, steps: int, sleep: float) -> int:
    med_score = min(40, adherence * 0.4)
    fitness_score = min(30, (steps / 10000) * 30)
    sleep_score = min(30, (min(sleep, 8) / 8) * 30)
    return min(100, int(med_score + fitness_score + sleep_score))

def detect_anomalies(data_points: list, threshold: float = 2.0) -> list:
    if len(data_points) < 5:
        return []
    values = np.array([float(d) for d in data_points])
    mean, std = np.mean(values), np.std(values)
    return [{'index': i, 'value': float(v), 'zscore': float((v - mean) / std)} for i, v in enumerate(values) if abs((v - mean) / std) > threshold]
