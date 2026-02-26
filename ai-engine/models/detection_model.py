import numpy as np
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class MissedDoseDetector:
    def detect_patterns(self, adherence_data: list) -> dict:
        if not adherence_data:
            return {'detected': False, 'patterns': []}
        missed = [e for e in adherence_data if e.get('status') == 'missed']
        total = len(adherence_data)
        miss_rate = len(missed) / total if total > 0 else 0
        patterns = []
        if miss_rate > 0.3:
            patterns.append({'type': 'high_miss_rate', 'description': f'Missed {len(missed)} of {total} doses ({miss_rate*100:.0f}%)', 'severity': 'high' if miss_rate > 0.5 else 'medium'})
        # Detect time-based patterns
        time_counts = {}
        for entry in missed:
            time = entry.get('time', 'unknown')
            time_counts[time] = time_counts.get(time, 0) + 1
        for time, count in time_counts.items():
            if count >= 3:
                patterns.append({'type': 'time_pattern', 'description': f'Frequently missed at {time} ({count} times)', 'severity': 'medium'})
        return {'detected': len(patterns) > 0, 'patterns': patterns, 'missRate': miss_rate}

missed_dose_detector = MissedDoseDetector()
