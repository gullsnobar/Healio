from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from api.routes import chatbot_routes, recommendation_routes, analysis_routes, prediction_routes
from config.settings import settings
from config.database import connect_db
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title='HEALIO AI Engine', version='1.0.0', description='AI/ML engine for HEALIO health management platform')

app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])

@app.on_event('startup')
async def startup():
    await connect_db()
    logger.info('AI Engine started')

@app.get('/health')
async def health_check():
    return {'status': 'healthy', 'service': 'healio-ai-engine'}

app.include_router(chatbot_routes.router, prefix='/api', tags=['Chatbot'])
app.include_router(recommendation_routes.router, prefix='/api', tags=['Recommendations'])
app.include_router(analysis_routes.router, prefix='/api', tags=['Analysis'])
app.include_router(prediction_routes.router, prefix='/api', tags=['Predictions'])

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=settings.PORT, reload=True)
