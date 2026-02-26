from loguru import logger
import sys

logger.remove()
logger.add(sys.stderr, level='INFO', format='{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}')
logger.add('logs/ai_engine.log', rotation='10 MB', retention='30 days', level='DEBUG')

def get_logger():
    return logger
