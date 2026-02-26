from datetime import datetime, timedelta
import hashlib

def get_date_range(days: int = 7):
    end = datetime.utcnow()
    start = end - timedelta(days=days)
    return start, end

def hash_string(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()

def format_response(data, message: str = 'Success'):
    return {'success': True, 'message': message, 'data': data}
