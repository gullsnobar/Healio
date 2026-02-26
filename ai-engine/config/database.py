from motor.motor_asyncio import AsyncIOMotorClient
from config.settings import settings
import logging

logger = logging.getLogger(__name__)
db = None

async def connect_db():
    global db
    client = AsyncIOMotorClient(settings.MONGODB_URI)
    db = client.healio
    logger.info('Connected to MongoDB')
    return db

def get_db():
    return db
