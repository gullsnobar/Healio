import google.generativeai as genai
from config.settings import settings
import logging

logger = logging.getLogger(__name__)

class ChatbotModel:
    def __init__(self):
        genai.configure(api_key=settings.GEMINI_API_KEY)
        self.model = genai.GenerativeModel('gemini-pro')
        self.system_prompt = '''You are HEALIO AI, a health management assistant. Provide helpful health info, medication guidance, fitness tips, and nutrition advice. Never diagnose conditions. Always recommend consulting healthcare professionals for serious concerns.'''

    async def generate_response(self, message: str, history: list = None, context: str = 'general') -> str:
        try:
            chat = self.model.start_chat(history=[])
            response = chat.send_message(f'[Context: {context}] [System: {self.system_prompt}]\n\nUser: {message}')
            return response.text
        except Exception as e:
            logger.error(f'Chatbot error: {e}')
            return 'I am having trouble responding. Please try again.'

chatbot = ChatbotModel()
