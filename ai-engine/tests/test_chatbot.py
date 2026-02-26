import pytest
from models.chatbot_model import ChatbotModel

class TestChatbot:
    def test_init(self):
        bot = ChatbotModel()
        assert bot.model is not None

    @pytest.mark.asyncio
    async def test_generate_response(self):
        bot = ChatbotModel()
        response = await bot.generate_response('Hello')
        assert isinstance(response, str)
