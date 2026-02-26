import pytest
from models.recommendation_model import RecommendationModel

class TestRecommendations:
    def test_low_adherence(self):
        engine = RecommendationModel()
        recs = engine.generate_recommendations({'medication_adherence': 50})
        assert len(recs) > 0
        assert recs[0]['type'] == 'medication'

    def test_low_steps(self):
        engine = RecommendationModel()
        recs = engine.generate_recommendations({'medication_adherence': 100, 'avg_steps': 2000})
        assert any(r['type'] == 'fitness' for r in recs)

    def test_perfect_health(self):
        engine = RecommendationModel()
        recs = engine.generate_recommendations({'medication_adherence': 100, 'avg_steps': 12000, 'avg_sleep': 8, 'water_intake': 3000})
        assert len(recs) == 0
