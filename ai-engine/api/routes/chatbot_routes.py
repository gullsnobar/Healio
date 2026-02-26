from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List
from models.chatbot_model import chatbot

router = APIRouter()

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None
    context: Optional[str] = 'general'
    history: Optional[List[dict]] = []

class ChatResponse(BaseModel):
    response: str
    session_id: str

@router.post('/chat', response_model=ChatResponse)
async def chat(msg: ChatMessage):
    response = await chatbot.generate_response(msg.message, msg.history, msg.context)
    return ChatResponse(response=response, session_id=msg.session_id or 'new')

@router.post('/chat/health-query')
async def health_query(msg: ChatMessage):
    response = await chatbot.generate_response(f'[Health Query] {msg.message}', msg.history, 'health')
    return {'response': response, 'disclaimer': 'This is AI-generated advice. Please consult a healthcare professional.'}
