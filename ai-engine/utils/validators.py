from pydantic import validator
import re

def validate_email(email: str) -> bool:
    return bool(re.match(r'^[\w\.-]+@[\w\.-]+\.\w+$', email))

def validate_object_id(id: str) -> bool:
    return bool(re.match(r'^[0-9a-fA-F]{24}$', id))

def sanitize_input(text: str) -> str:
    return re.sub(r'[<>\"\'&]', '', text) if text else ''
