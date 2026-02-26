from pydantic_settings import BaseSettings
import os

class Settings(BaseSettings):
    ENVIRONMENT: str = 'development'
    PORT: int = 8000
    MONGODB_URI: str = ''
    GEMINI_API_KEY: str = ''
    JWT_SECRET: str = ''
    MODEL_PATH: str = './trained_models'

    class Config:
        env_file = '.env'

settings = Settings()
