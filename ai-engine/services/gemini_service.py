import google.generativeai as genai
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')

    async def generate(self, prompt: str, temperature: float = 0.7) -> str:
        try:
            response = self.model.generate_content(prompt, generation_config={'temperature': temperature, 'max_output_tokens': 1024})
            return response.text
        except Exception as e:
            logger.error(f'Gemini error: {e}')
            return ''

    async def analyze_health_data(self, data: dict) -> dict:
        prompt = f'Analyze this health data and provide insights: {data}. Return JSON with keys: summary, insights (array), recommendations (array).'
        text = await self.generate(prompt, 0.3)
        try:
            import json
            return json.loads(text.replace('`json', '').replace('`', '').strip())
        except:
            return {'summary': 'Analysis unavailable', 'insights': [], 'recommendations': []}

gemini_service = GeminiService()
